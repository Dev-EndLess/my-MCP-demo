# MCP Architecture

L'architettura di MCP segue un modello Client-Server:

1. **Host/Client**: L'ambiente dove risiede il modello (e.g. Claude Desktop, IDE, Browser).
2. **Server**: Un processo separato che implementa il protocollo MCP e fornisce accesso a risorse e strumenti.
3. **Transport**: Il canale di comunicazione. MCP supporta:
   - **STDIO**: Standard Input/Output (comunicazione locale tramite processi figli).
   - **SSE**: Server-Sent Events (comunicazione via HTTP).
