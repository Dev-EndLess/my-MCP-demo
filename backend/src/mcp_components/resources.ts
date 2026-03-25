import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RESOURCES_DIR = path.resolve(__dirname, "../../mcp_resources");

/**
 * Trova ricorsivamente tutti i file markdown in una directory.
 */
const getMarkdownFiles = async (dir: string): Promise<string[]> => {
  try {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      dirents.map((dirent) => {
        const fullPath = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getMarkdownFiles(fullPath) : fullPath;
      }),
    );
    return files.flat().filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }
};

/**
 * Converte un path assoluto in URI relativo alla RESOURCES_DIR.
 */
const toResourceUri = (absolutePath: string): string =>
  `mcp://resources/${path.relative(RESOURCES_DIR, absolutePath).replace(/\\/g, "/")}`;

/**
 * Registra le risorse markdown nel server MCP.
 */
export function registerResources(server: McpServer) {
  server.registerResource(
    "mcp-resources",
    new ResourceTemplate("mcp://resources/{path}", {
      list: async () => {
        const allFiles = await getMarkdownFiles(RESOURCES_DIR);
        return {
          resources: allFiles.map((file) => ({
            uri: toResourceUri(file),
            name: path.basename(file),
            mimeType: "text/markdown",
          })),
        };
      },
    }),
    {
      description: "Materiale di riferimento per il Model Context Protocol",
    },
    async (uri: URL, { path: relPath }) => {
      if (typeof relPath !== "string") {
        throw new Error("Path non valido");
      }

      const absolutePath = path.join(RESOURCES_DIR, relPath);

      // Sicurezza: path traversal check
      const relative = path.relative(RESOURCES_DIR, absolutePath);
      if (relative.startsWith("..") || path.isAbsolute(relative)) {
        throw new Error("Accesso negato.");
      }

      const content = await fs.readFile(absolutePath, "utf-8").catch(() => {
        throw new Error(`File non trovato: ${relPath}`);
      });

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/markdown",
            text: content,
          },
        ],
      };
    },
  );
}
