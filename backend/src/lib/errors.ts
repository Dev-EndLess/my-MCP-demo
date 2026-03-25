import type { Request, Response, NextFunction } from "express";

/**
 * Middleware centralizzato per la gestione degli errori in Express.
 */
export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // In sviluppo logghiamo lo stack trace completo su console.error
  // Usiamo console.error perché l'MCP server usa lo stdout per comunicare.
  console.error(`[ERROR] ${req.method} ${req.path} - ${statusCode}: ${message}`);
  if (err.stack) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    // stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

/**
 * Wrapper per i tool MCP per gestire gli errori in modo consistente.
 * Restituisce una risposta nel formato richiesto dall'SDK MCP.
 */
export const wrapTool = <T extends Record<string, any>>(
  handler: (args: T) => Promise<{ content: { type: "text"; text: string }[] }>
) => {
  return async (args: T) => {
    try {
      return await handler(args);
    } catch (error: any) {
      const message = error.message || String(error);
      const statusCode = error.status || error.statusCode || 500;
      
      console.error(`[MCP TOOL ERROR] ${message}`);
      
      return {
        content: [{ type: "text" as const, text: `❌ Errore (${statusCode}): ${message}` }],
        isError: true,
      };
    }
  };
};
