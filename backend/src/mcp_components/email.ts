import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import nodemailer from "nodemailer";
import { wrapTool } from "../lib/errors.js";

/**
 * Registra il tool di invio email nel server MCP tramite Nodemailer (Gmail).
 */
export function registerEmailTool(server: McpServer) {
  // Configura il transporter per Gmail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  server.registerTool(
    "send_email",
    {
      description: "Invia una email tramite Gmail e Nodemailer",
      inputSchema: {
        to: z.string().email().describe("Indirizzo email del destinatario"),
        subject: z.string().describe("Oggetto della email"),
        body: z.string().describe("Contenuto testuale della email"),
      },
    },
    wrapTool(async ({ to, subject, body }) => {
        if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
          throw new Error("Credenziali Gmail (GMAIL_USER, GMAIL_APP_PASSWORD) non configurate nel backend.");
        }

        const info = await transporter.sendMail({
          from: `"MCP Assistant" <${process.env.GMAIL_USER}>`,
          to: to,
          subject: subject,
          text: body,
        });

        return {
          content: [
            {
              type: "text",
              text: `📧 Email inviata con successo a ${to}! (Message ID: ${info.messageId})`,
            },
          ],
        };
    }),
  );
}
