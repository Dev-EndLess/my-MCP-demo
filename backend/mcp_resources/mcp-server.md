# MCP Servers (JS/TS SDK)

Costruire un MCP server diventa molto più semplice quando si utilizza l'SDK ufficiale per JavaScript/TypeScript. Invece di scrivere complessi schemi JSON a mano, è possibile definire strumenti utilizzando l'API di alto livello `McpServer` e la validazione degli input tramite **Zod**.

In questo esempio, vediamo come inizializzare un server e registrare un tool per il calcolo, simile a quanto implementato nel nostro progetto.

## Setting Up the MCP Server

Il JS/TS MCP SDK rende la creazione del server immediata. Puoi inizializzarlo con poche righe:

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "mio-mcp-server",
  version: "1.0.0",
});
```

## Definizione dei Tool con Zod

L'SDK utilizza **Zod** per definire e validare lo schema di input dei tool. Questo permette a Claude di capire esattamente quali parametri inviare e garantisce che i dati siano corretti prima dell'esecuzione.

### Esempio: Tool per la Somma

Ecco come registrare uno strumento che calcola la somma di due numeri:

```typescript
import { z } from "zod";

server.registerTool(
  "calculate_sum",
  {
    description: "Calcola la somma di due numeri",
    inputSchema: {
      a: z.number().describe("Primo numero"),
      b: z.number().describe("Secondo numero"),
    },
  },
  async ({ a, b }) => {
    const result = a + b;
    return {
      content: [{ type: "text", text: `La somma di ${a} e ${b} è ${result}` }],
    };
  },
);
```

Il metodo `registerTool` specifica il nome, la descrizione e lo schema di input. La funzione di callback viene eseguita solo se l'input passa la validazione Zod.

## Avvio del Server

Per rendere il server disponibile, dobbiamo connetterlo a un **Transport**. Il metodo più comune per l'utilizzo locale (come con l'Inspector o Claude Desktop) è lo **StdioServerTransport**:

```typescript
async function start() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🚀 MCP Server running!");
}

start().catch(console.error);
```

## I Vantaggi dell'Approccio SDK (JS/TS)

- **Validazione Automatica**: Grazie a Zod, non devi scrivere codice di validazione manuale.
- **Tipizzazione Forte**: TypeScript garantisce che il tuo codice sia robusto.
- **Integrazione Nativa**: Lo schema JSON richiesto dal protocollo viene generato automaticamente.
- **Semplicità**: L'API `McpServer` astrae tutta la complessità del protocollo JSON-RPC sottostante.

L'SDK JS/TS di MCP trasforma la creazione di strumenti da un complesso esercizio di scrittura di schemi a semplici definizioni di funzioni con validazione integrata.