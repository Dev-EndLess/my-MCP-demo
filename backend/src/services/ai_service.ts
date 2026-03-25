import * as genai from "@google/generative-ai";
import dotenv from "dotenv";

// Carica le variabili (necessario qui per ESM import hoisting)
dotenv.config({ path: ".env.local" });
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  // Nota: Questo errore ora verrà lanciato solo se dopo il caricamento in index.ts la chiave manca ancora
  console.error("❌ ERRORE: GEMINI_API_KEY non trovata. Controlla il file .env.local nella cartella backend.");
  process.exit(1);
}

const genAI = new genai.GoogleGenerativeAI(GEMINI_API_KEY);

export interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

export const aiService = {
  /**
   * Genera una risposta con supporto tool calling.
   * Il loop MCP viene gestito in index.ts per massima flessibilità.
   */
  async generateChatResponse(
    prompt: string,
    history: Message[] = [],
    tools: any[] = [],
  ) {
    try {
      // Inizializzazione del modello Gemini (Flash 1.5/2.5 per velocità)
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite", 
        safetySettings: [
          {
            category: genai.HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: genai.HarmBlockThreshold.BLOCK_NONE,
          },
        ],
      });

      // Gemini richiede che la cronologia inizi tassativamente con un messaggio 'user'.
      // Se l'array history inizia con un messaggio 'model' (es. un saluto predefinito),
      // lo saltiamo finché non troviamo il primo intervento dell'utente.
      const validHistory = [];
      let foundFirstUser = false;
      for (const msg of history) {
        if (msg.role === "user") foundFirstUser = true;
        if (foundFirstUser) validHistory.push(msg);
      }

      const chat = model.startChat({
        history: validHistory,
        tools: tools.length > 0 ? [{ functionDeclarations: tools }] : [],
      });

      const result = await chat.sendMessage(prompt);
      const response = result.response;

      return {
        response,
        chat,
      };
    } catch (error) {
      console.error("💥 AI Service Error:", error);
      throw error;
    }
  },

  /**
   * Converte i tool MCP in Function Declarations per Gemini.
   * Rimuove il campo '$schema' che non è supportato dall'API di Gemini.
   */
  mapMcpToolsToGemini(mcpTools: any[]) {
    return mcpTools.map((tool) => {
      // Clona per non modificare l'originale
      const schema = { ...tool.inputSchema };
      delete schema.$schema;

      return {
        name: tool.name,
        description: tool.description,
        parameters: schema,
      };
    });
  },

  /**
   * Estrae il testo dalla risposta di Gemini.
   */
  extractText(response: any): string {
    return response.text() ?? "";
  },

  /**
   * Estrae le function calls dalla risposta di Gemini (tool calling).
   */
  extractFunctionCalls(response: any): any[] {
    const candidate = response.candidates?.[0];
    if (!candidate) return [];

    return candidate.content.parts
      .filter((part: any) => part.functionCall)
      .map((part: any) => part.functionCall);
  },
};