# MCP Cheat Sheet: TypeScript vs Python

Questa guida mette a confronto i concetti fondamentali tra l'SDK TypeScript (usato in questo progetto) e l'SDK Python (spesso usato nei corsi ufficiali di Anthropic).

## 🧩 Anatomia dell'SDK

L'SDK (Software Development Kit) è l'insieme di strumenti che ti permettono di costruire applicazioni MCP. Ecco le tre parti principali:

1. **Core Classes (`McpServer`, `Client`)**: Il "cervello". Gestiscono lo stato, la connessione e il ciclo di vita del protocollo.
2. **Transports (`StdioServerTransport`, `SseServerTransport`)**: Il "mezzo di comunicazione". Definiscono _come_ i messaggi viaggiano (es. via terminale o via web).
3. **Schemas & Types (`zod`)**: Il "linguaggio". Definiscono _cosa_ può essere detto o chiesto, validando i messaggi tramite Zod.

| Componente | Ruolo | TypeScript (SDK High-Level) | Python (FastMCP/SDK) |
| :--- | :--- | :--- | :--- |
| **Server** | Il provider di dati | `new McpServer({ name, version })` | `FastMCP("name")` |
| **Resources** | Dati passivi (Read-only) | `server.registerResource(name, template, handler)` | `@mcp.resource("uri")` |
| **Tools** | Funzioni eseguibili | `server.registerTool(name, { schema }, handler)` | `@mcp.tool()` |
| **Prompts** | Template di prompt | `server.registerPrompt(name, { schema }, handler)` | `@mcp.prompt()` |

---

## 🏗️ 1. Setup del Server

In Python si usa `mcp.server.fastmcp`. In TypeScript usiamo la classe `McpServer` per un approccio semplificato e moderno.

### Python 🐍 (Setup)

```python
from mcp.server.fastmcp import FastMCP
mcp = FastMCP("MyServer")
```

### TypeScript 🟦 (Setup)

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "my-server",
  version: "1.0.0",
});

// Avvio con trasporto STDIO
const transport = new StdioServerTransport();
await server.connect(transport);
```

---

## 🛠️ 2. Registrazione dei Tool

### Python 🐍 (Tools)

```python
@mcp.tool()
def sum_numbers(a: int, b: int) -> int:
    return a + b
```

### TypeScript 🟦 (Tools)

In TS usiamo **Zod** per definire lo schema di input in modo granulare.

```typescript
import { z } from "zod";

server.registerTool(
  "calculate_sum",
  {
    description: "Somma due numeri",
    inputSchema: {
      a: z.number().describe("Primo numero"),
      b: z.number().describe("Secondo numero"),
    },
  },
  async ({ a, b }) => {
    return {
      content: [{ type: "text", text: String(a + b) }],
    };
  }
);
```

---

## 📄 3. Risorse (Resources)

Le risorse sono dati statici o dinamici che l'AI può leggere per ottenere contesto.

### Python 🐍 (Resources)

```python
@mcp.resource("mcp://info/{sub}")
def get_info(sub: str):
    return f"Dati per {sub}"
```

### TypeScript 🟦 (Resources)

```typescript
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

server.registerResource(
  "info",
  new ResourceTemplate("mcp://info/{sub}", { list: async () => ({ resources: [] }) }),
  async (uri, { sub }) => ({
    contents: [{
      uri: uri.href,
      text: `Dati per ${sub}`,
    }],
  })
);
```

---

## 🔥 Differenze Chiave da Ricordare

1. **Validazione**: In TypeScript l'uso di **Zod** è integrato e permette di aggiungere descrizioni ai parametri che l'AI leggerà.
2. **Trasporto (STDIO)**: Quando usi STDIO (default per i processi locali), usa sempre `console.error` per i log personali. `console.log` è riservato allo scambio dei messaggi JSON-RPC.
3. **Modularità**: In TS è facile separare tool e risorse in file diversi passando l'istante di `McpServer` come parametro (coerente con il nostro refactor `modular version`).
