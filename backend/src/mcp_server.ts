import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { fileURLToPath } from "node:url";
import { registerResources } from "./mcp_components/resources.js";
import { registerTools } from "./mcp_components/tools.js";
import { registerEmailTool } from "./mcp_components/email.js";

const __filename = fileURLToPath(import.meta.url);

// --- SERVER INITIALIZATION ---

const server = new McpServer({
  name: "fabri-mcp-server",
  version: "1.0.0",
});

// --- REGISTER MODULES ---

registerResources(server);
registerTools(server);
registerEmailTool(server);

// --- START SERVER ---

export async function startServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🚀 MCP Server running (Modular version)!");
}

if (process.argv[1] === __filename) {
  startServer().catch(console.error);
}
