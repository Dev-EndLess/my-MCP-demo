import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Crea e connette un client MCP al server tramite StdIO.
 */
export async function createClient() {
  console.error("🔍 MCP Client: Connecting to server...");

  // Trasporto basato su Standard Input/Output per comunicare con il processo mcp_server.ts
  const transport = new StdioClientTransport({
    command: "node",
    args: ["--import", "tsx", path.resolve(__dirname, "mcp_server.ts")],
  });

  const client = new Client(
    { name: "fabri-mcp-client", version: "1.0.0" },
    { capabilities: {} },
  );

  await client.connect(transport);
  console.error("✅ MCP Client: Connected!");
  
  return client;
}

if (process.argv[1] === __filename) {
  createClient().then(async (client) => {
    console.error("Fetching tools...");
    const toolsResponse = await client.listTools();
    console.log("Tools Found:", JSON.stringify(toolsResponse.tools, null, 2));
    process.exit(0);
  }).catch(console.error);
}

