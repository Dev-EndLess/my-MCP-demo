# Anthropic MCP Course

Benvenuto! Questo repository è un esperimento creato dopo aver completato il corso ufficiale di Anthropic riguardo al **Model Context Protocol (MCP)**
E' stato implementato con TypeScript e Next.js diversamente dall'originale che è stato realizzato con Python.

## 🚀 Come funziona questa applicazione

Questa applicazione dimostra l'uso del protocollo MCP, che permette agli agenti AI o LLM di connettersi a servizi esterni come nel nostro caso a **Turso** (database SQLite) e **Gmail** (Nodemailer - invio email), oltre che a risorse locali (file markdown).

- **MCP Server (`backend/src/mcp_server.ts`)**: Funge da "ponte" verso i servizi esterni e le risorse locali. Scansiona i file markdown nella cartella `mcp-reference/` per trovare risorse e li espone come risorse leggibili.
- **MCP Client (`backend/src/mcp_client.ts`)**: Si connette al server, richiede la lista delle risorse e ne legge il contenuto. Successivamente, invia i dati raccolti al modello AI per l'elaborazione.
- **Frontend (`frontend/`)**: Un'interfaccia moderna costruita con Next.js che permette di visualizzare i dati e interagire con l'integrazione AI.

Il flusso segue lo standard MCP: il client avvia il server come processo figlio via STDIO, permettendo una comunicazione sicura e veloce.

## 🛠️ How to start

Per avviare il progetto localmente, segui questi passaggi:

### 1. Prerequisiti

Assicurati di avere [Node.js](https://nodejs.org/) installato (consigliata versione 20+).

### 2. Installazione e Avvio

È necessario avviare sia il backend che il frontend in due terminali separati.

**Backend:**

```bash
cd backend
npm install
npm run dev
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

Il frontend sarà disponibile su [http://localhost:3000](http://localhost:3000), il backend invece sarà disponibile su [http://localhost:8000](http://localhost:8000).

## 🔑 Configurazione API (Gemini)

L'applicazione utilizza l'AI di **Google Gemini** per elaborare i dati recuperati via MCP.

> [!IMPORTANT]
> Attualmente il progetto usa un modello **free tier**, che ha limiti di richieste (rate limits).
> Se desideri utilizzare la tua API Key personale per evitare limiti:
>
> 1. Crea un file `.env.local` nella cartella `backend/`.
> 2. Aggiungi la variabile: `GEMINI_API_KEY=la_tua_chiave_qui`.
> 3. Aggiungi le variabili per Gmail:
>    - `GMAIL_USER=latuaemail@gmail.com`
>    - `GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx` (da generare nelle impostazioni Google -> Password per le App).

Fuori dalla cartella `backend` e `frontend`, nella root del progetto, ho creato un file `.env.example` dove è possibile visualizzare le variabili d'ambiente utilizzate nel progetto.

## 📁 Struttura del Progetto

- `backend/`: Contiene la logica core di MCP (Server, Client) e i servizi AI.
- `frontend/`: Applicazione Next.js per l'interfaccia utente.
- `.gemini/`: ⚠️ **Da ignorare**. Questa cartella contiene file `SKILL.md` che servono come istruzioni per Gemini o altri LLM durante lo sviluppo del codice.
- `MCP_Flow.md`: Documentazione tecnica sul flusso di comunicazione del protocollo.
- `MCP_CheatSheet.md`: Una guida rapida per chi passa dal SDK Python (usato nei corsi ufficiali) a quello TypeScript.

## 🧪 Tecnologie Utilizzate

- **Framework**: [Next.js 16+](https://nextjs.org/)
- **Linguaggio**: [TypeScript](https://www.typescriptlang.org/)
- **Protocollo**: [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/typescript-sdk)
- **AI**: [Google Generative AI (Gemini)](https://ai.google.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
