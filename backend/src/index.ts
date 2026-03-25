import dotenv from "dotenv";
// Carica le variabili d'ambiente il prima possibile
dotenv.config({ path: ".env.local" });
dotenv.config();

import express, { type Request, type Response } from "express";
import cors from "cors";
import { createClient } from "./mcp_client.js";
import { aiService } from "./services/ai_service.js";
import { errorMiddleware } from "./lib/errors.js";
import createError from "http-errors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;

async function main() {
  console.error("🚀 MCP Orchestrator: Starting the Express API server...");

  let client: any;
  try {
    client = await createClient();
  } catch (err: any) {
    console.error("💥 Failed to create MCP Client:", err.message);
    process.exit(1);
  }

  app.get("/api/tools", async (req: Request, res: Response) => {
    const tools = await client.listTools();
    res.json(tools);
  });

  app.post("/api/chat", async (req: Request, res: Response) => {
    const { prompt, history = [] } = req.body;
    
    if (!prompt) {
      throw createError(400, "Prompt is required");
    }

      // 1. Otteniamo i tool disponibili dal server MCP
      const mcpToolsResponse = await client.listTools();
      const geminiTools = aiService.mapMcpToolsToGemini(mcpToolsResponse.tools);
      console.error("🛠️  Available Tools for Gemini:", geminiTools.map(t => t.name));

      // 2. Chiamiamo Gemini (inizia la sessione di chat)
      // Ottimizzazione: se l'ultimo messaggio della history è l'utente con lo stesso prompt,
      // lo togliamo dalla history perchésendMessage(prompt) lo aggiungerà di nuovo.
      const historyToPass = [...history];
      if (historyToPass.length > 0) {
        const lastMsg = historyToPass[historyToPass.length - 1];
        if (lastMsg.role === "user" && lastMsg.parts[0].text === prompt) {
          historyToPass.pop();
        }
      }

      const chatWrapper = await aiService.generateChatResponse(prompt, historyToPass, geminiTools);
      let messageResponse = chatWrapper.response;
      const chatSession = chatWrapper.chat;
      
      // 3. Loop di Tool Calling
      let turnCount = 0;
      const MAX_TURNS = 10;

      while (turnCount < MAX_TURNS) {
        const parts = messageResponse.candidates?.[0]?.content?.parts || [];
        const functionCalls = parts.filter((p: any) => p.functionCall);

        if (functionCalls.length === 0) break; // Nessuna (più) chiamata a funzioni, abbiamo finito!

        turnCount++;
        const toolResults = [];

        for (const part of parts) {
          if (!part.functionCall) continue;

          const { name, args } = part.functionCall;
          console.error(`🛠️  AI requested tool: ${name}`, args);

          try {
            // Eseguiamo il tool tramite il client MCP
            const result = await client.callTool({ name, arguments: args });
            
            toolResults.push({
              functionResponse: {
                name,
                response: { result }
              }
            });
          } catch (toolError: any) {
            console.error(`❌ Tool execution error (${name}):`, toolError.message);
            toolResults.push({
              functionResponse: {
                name,
                response: { error: toolError.message }
              }
            });
          }
        }

        if (toolResults.length > 0) {
          // Inviamo i risultati dei tool a Gemini per generare la risposta finale (o richiedere altri tool)
          const resultNext = await chatSession.sendMessage(toolResults);
          messageResponse = resultNext.response;
        }
      }

      res.json({
        text: messageResponse.text(),
        // Restituiamo la history aggiornata (opzionale, utile per il frontend)
        history: await chatSession.getHistory()
      });
  });

  app.post("/api/call-tool", async (req: Request, res: Response) => {
    const { name, arguments: args } = req.body;
    const result = await client.callTool({ name, arguments: args });
    res.json(result);
  });

  app.get("/api/resources", async (req: Request, res: Response) => {
    const resources = await client.listResources();
    res.json(resources);
  });

  // Error handling middleware (must be after all routes)
  app.use(errorMiddleware);

  app.listen(PORT, () => {
    console.error(`📡 API Server listening on http://localhost:${PORT}`);
  });
}

main().catch(console.error);

