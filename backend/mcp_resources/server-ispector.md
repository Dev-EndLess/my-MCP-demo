# Testare un MCP Server con l'Inspector

Quando sviluppi un **MCP server**, hai bisogno di un modo per testare le funzionalità senza doverlo collegare a un'applicazione completa.

L'**SDK JS/TS di MCP** include un **Inspector integrato basato su browser** che permette di:

- fare debug
- testare il server
- verificare i tool in tempo reale


# Avviare l'Inspector

Per prima cosa assicurati che il tuo **ambiente JS/TS sia attivo**  
(controlla il README del progetto per il comando esatto).

Successivamente avvia l'Inspector con:

```bash
npx @modelcontextprotocol/inspector
```

Questo avvia un server di sviluppo e ti fornisce un URL locale, tipicamente qualcosa come http://localhost:6274/ 
Apri questo URL nel browser per accedere all'MCP Inspector.

# Utilizzare l'interfaccia dell'Inspector

L'interfaccia dell'Inspector è **in sviluppo attivo**, quindi potrebbe cambiare nel tempo.
Tuttavia le funzionalità principali restano sempre simili.
Cerca questi elementi principali:

- **Connect button** per avviare il tuo MCP server
- **Navigation tabs** per:
  - Resources
  - Tools
  - Prompts
  - altre funzionalità
- **Panel di testing dei tool**

La prima cosa da fare è cliccare **Connect** per inizializzare il server.

Vedrai lo stato della connessione cambiare da: **Disconnected** a **Connected**.  

# Prova i tuoi tools

Vai alla sezione **Tools** e clicca su **List Tools** per vedere tutti i tool disponibili dal tuo server. Quando selezioni un tool, il pannello di destra mostra i dettagli e i campi di input.

Ad esempio, per testare un tool di lettura di documenti:

Seleziona il tool **introduction**
Inserisci un ID di documento (come "introduction.md")
Clicca su **Run Tool**
Controlla i risultati per successo e output atteso
L'inspector mostra sia lo stato di successo che i dati effettivi restituiti, rendendo facile verificare che il tuo tool funzioni correttamente.

# Testing Tool Interactions

Puoi testare più tool in sequenza per verificare flussi di lavoro complessi. Ad esempio, dopo aver usato un tool di modifica per modificare un documento, testa immediatamente il tool di lettura per confermare che le modifiche siano state applicate correttamente.

L'inspector mantiene lo stato del tuo server tra le chiamate ai tool, quindi le modifiche persistono e puoi verificare la funzionalità completa del tuo MCP server.

# Workflow di sviluppo

L'MCP Inspector diventa una parte essenziale del tuo processo di sviluppo. Invece di scrivere script di test separati o connetterti ad applicazioni complete, puoi:

- iterare rapidamente sulle implementazioni dei tool
- testare casi limite e condizioni di errore
- verificare le interazioni tra tool e gestione dello stato
- fare debug in tempo reale

Questo ciclo di feedback immediato rende lo sviluppo di MCP server molto più efficiente e aiuta a individuare i problemi fin dalle prime fasi del processo di sviluppo.