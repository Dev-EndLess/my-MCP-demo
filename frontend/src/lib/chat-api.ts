import { Message } from "@/types/chat";

/**
 * Service per gestire le chiamate API alla chat MCP.
 */
export const chatApi = {
  /**
   * Invia un prompt al backend e gestisce la risposta o gli errori.
   */
  async send(prompt: string, history: Message[]) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    
    const res = await fetch(`${apiUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: prompt,
        history: history.map((m) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }],
        })),
      }),
    });

    if (!res.ok) {
      // Estrazione dettagliata dell'errore
      let errorData;
      try {
        errorData = await res.json();
      } catch {
        errorData = { message: "Errore nella risposta del server" };
      }

      // Costruzione errore strutturato per il frontend
      const error = Object.assign(
        new Error(errorData.message || "Errore nella comunicazione con il server"),
        { 
          statusCode: res.status,
          error: errorData.message 
        }
      );
      throw error;
    }

    return res.json();
  }
};
