# MCP Clients

L'**MCP Client** funge da **ponte di comunicazione tra il tuo server e gli MCP servers**.

È il punto di accesso a tutti gli strumenti forniti da un MCP server e si occupa di:

- gestire lo scambio di messaggi
- gestire i dettagli del protocollo

In questo modo **la tua applicazione non deve preoccuparsi della complessità della comunicazione**.

---

# Comunicazione indipendente dal trasporto (Transport Agnostic)

Uno dei principali punti di forza di MCP è che è **transport agnostic**.

In termini semplici significa che **client e server possono comunicare utilizzando protocolli diversi**, a seconda della configurazione del tuo sistema.

La configurazione più comune prevede che **MCP client e MCP server girino sulla stessa macchina**, comunicando tramite:

- **standard input**
- **standard output**

Tuttavia è possibile connetterli anche tramite altri protocolli di rete, come ad esempio:

- **HTTP**
- **WebSockets**
- **altri protocolli di rete**

Questo rende MCP molto flessibile e adattabile a diversi tipi di architettura.

---

# Tipi di messaggi MCP

Una volta stabilita la connessione, client e server si scambiano **tipi di messaggi specifici definiti nella specifica MCP**.

I principali con cui lavorerai sono:

### ListToolsRequest / ListToolsResult

Il client chiede al server:

> "Quali strumenti metti a disposizione?"

Il server risponde con **la lista dei tool disponibili**.

---

### CallToolRequest / CallToolResult

Il client chiede al server di:

- eseguire uno specifico tool
- con determinati argomenti

Successivamente riceve **il risultato dell'esecuzione del tool**.

---

# Come funziona tutto insieme

Vediamo un esempio completo di come una **richiesta dell'utente attraversa l'intero sistema**:

- dal tuo server
- attraverso l'MCP client
- verso servizi esterni come GitHub
- fino alla risposta finale di Claude

Supponiamo che un utente chieda:

> "Quali repository possiedo?"

### Flusso passo per passo

1. **User Query**  
   L'utente invia la propria domanda al tuo server.

2. **Tool Discovery**  
   Il tuo server deve sapere quali tool sono disponibili da inviare a Claude.

3. **List Tools Exchange**  
   Il tuo server chiede all'MCP client quali tool sono disponibili.

4. **MCP Communication**  
   L'MCP client invia una `ListToolsRequest` al MCP server e riceve una `ListToolsResult`.

5. **Claude Request**  
   Il tuo server invia a Claude:
   - la richiesta dell'utente
   - la lista dei tool disponibili.

6. **Tool Use Decision**  
   Claude decide che deve utilizzare un tool per rispondere alla domanda.

7. **Tool Execution Request**  
   Il tuo server chiede all'MCP client di eseguire il tool indicato da Claude.

8. **External API Call**  
   L'MCP client invia una `CallToolRequest` al MCP server, che effettua la vera chiamata alle **API di GitHub**.

9. **Results Flow Back**  
   GitHub risponde con i dati dei repository.  
   Il risultato ritorna attraverso l'MCP server come `CallToolResult`.

10. **Tool Result to Claude**  
    Il tuo server invia i risultati del tool a Claude.

11. **Final Response**  
    Claude genera una risposta finale utilizzando i dati dei repository.

12. **User Gets Answer**  
    Il tuo server restituisce la risposta di Claude all'utente.

---

# Perché questo flusso è importante

Sì, questo processo contiene diversi passaggi, ma **ogni componente ha una responsabilità ben definita**.

L'**MCP client** astrae tutta la complessità della comunicazione con i server MCP, permettendoti di:

- concentrarti sulla **logica della tua applicazione**
- avere comunque accesso a **strumenti potenti e fonti di dati esterne**

Comprendere bene questo flusso è fondamentale, perché **vedrai tutte queste componenti quando inizierai a costruire i tuoi MCP clients e servers** nelle sezioni successive.