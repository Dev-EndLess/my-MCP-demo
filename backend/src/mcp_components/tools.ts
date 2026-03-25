import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { contactsDb } from "../db/database.js";
import { wrapTool } from "../lib/errors.js";

/**
 * Registra i tool generali e di rubrica nel server MCP.
 */
export function registerTools(server: McpServer) {
  /**
   * Tool per calcolare la somma di due numeri.
   */
  server.registerTool(
    "calculate_sum",
    {
      description: "Calcola la somma di due numeri",
      inputSchema: {
        a: z.number().describe("Primo numero"),
        b: z.number().describe("Secondo numero"),
      },
    },
    wrapTool(async ({ a, b }) => {
      const result = a + b;
      return {
        content: [{ type: "text", text: `La somma di ${a} e ${b} è ${result}` }],
      };
    }),
  );

  /**
   * Tool per aggiungere un nuovo contatto al database SQLite.
   */
  server.registerTool(
    "add_contact",
    {
      description: "Aggiunge un nuovo contatto alla rubrica",
      inputSchema: {
        name: z.string().describe("Nome completo del contatto"),
        email: z.string().email().describe("Indirizzo email"),
        phone: z.string().optional().describe("Numero di telefono (opzionale)"),
        notes: z.string().optional().describe("Note aggiuntive (opzionale)"),
      },
    },
    wrapTool(async ({ name, email, phone, notes }) => {
        const contact = await contactsDb.add({ name, email, phone: phone ?? null, notes: notes ?? null });
        return {
          content: [
            {
              type: "text",
              text: `✅ Contatto aggiunto: ${contact.name} <${contact.email}> (ID: ${contact.id})`,
            },
          ],
        };
    }),
  );

  /**
   * Tool per elencare tutti i contatti salvati.
   */
  server.registerTool(
    "list_contacts",
    {
      description: "Mostra tutti i contatti nella rubrica",
      inputSchema: {},
    },
    wrapTool(async () => {
      const contacts = await contactsDb.list();
      if (contacts.length === 0) {
        return { content: [{ type: "text", text: "📭 Nessun contatto in rubrica." }] };
      }
      const list = contacts
        .map((c) => `• [${c.id}] ${c.name} — ${c.email}${c.phone ? ` | ${c.phone}` : ""}`)
        .join("\n");
      return {
        content: [{ type: "text", text: `📒 Contatti (${contacts.length}):\n${list}` }],
      };
    }),
  );

  /**
   * Tool per cercare contatti specifici per nome.
   */
  server.registerTool(
    "get_contact",
    {
      description: "Cerca un contatto per nome (ricerca parziale, case-insensitive)",
      inputSchema: {
        name: z.string().describe("Nome (o parte del nome) da cercare"),
      },
    },
    wrapTool(async ({ name }) => {
      const found = await contactsDb.findByName(name);
      if (found.length === 0) {
        return {
          content: [{ type: "text", text: `🔍 Nessun contatto trovato per: "${name}"` }],
        };
      }
      const details = found
        .map(
          (c) =>
            `📇 ${c.name}\n   Email: ${c.email}\n   Tel: ${c.phone ?? "—"}\n   Note: ${c.notes ?? "—"}`,
        )
        .join("\n\n");
      return { content: [{ type: "text", text: details }] };
    }),
  );

  /**
   * Tool per eliminare un contatto dalla rubrica tramite il suo ID.
   */
  server.registerTool(
    "delete_contact",
    {
      description: "Elimina un contatto dalla rubrica tramite il suo ID numerico",
      inputSchema: {
        id: z.number().describe("L'ID numerico del contatto da eliminare"),
      },
    },
    wrapTool(async ({ id }) => {
        const deleted = await contactsDb.delete(id);
        if (deleted) {
          return {
            content: [
              {
                type: "text",
                text: `🗑️ Contatto con ID ${id} eliminato con successo.`,
              },
            ],
          };
        } else {
          return {
            content: [
              {
                type: "text",
                text: `⚠️ Nessun contatto trovato con ID ${id}. Nulla è stato eliminato.`,
              },
            ],
          };
        }
    }),
  );
}
