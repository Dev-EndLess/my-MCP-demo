# Introduction to Model Context Protocol (MCP)

Il Model Context Protocol (MCP) è uno standard aperto che permette agli sviluppatori di fornire dati e funzionalità ai modelli di intelligenza artificiale in modo sicuro e standardizzato.

Funziona come una "porta USB-C" per l'AI, connettendo client (come Claude Desktop o il nostro frontend) a server che espongono:


# Introduzione a MCP

**Model Context Protocol (MCP)** è un livello di comunicazione che fornisce a Claude contesto e strumenti senza richiedere di scrivere una grande quantità di codice di integrazione noioso.

In pratica, è un modo per **spostare l'onere della definizione degli strumenti e della loro esecuzione dal tuo server a server MCP specializzati**.

Quando incontri MCP per la prima volta, vedrai spesso diagrammi che mostrano l’architettura di base:

- Un **MCP Client** (il tuo server)
- Connesso a uno o più **MCP Servers**
- Che contengono **resources, tools, prompts**
- **Resources**: Dati statici o dinamici (file, database, API).
- **Tools**: Funzionalità eseguibili (calcoli, azioni nel mondo reale).
- **Prompts**: Template di prompt predefiniti.

Ogni **MCP Server** funge da interfaccia verso un servizio esterno.

---

# Il problema che MCP risolve

Immagina di costruire un'interfaccia chat in cui gli utenti possano chiedere a Claude informazioni sui propri dati **GitHub**.

Un utente potrebbe chiedere:

> "Quali pull request aperte ci sono in tutti i miei repository?"

Per gestire questa richiesta, Claude deve avere strumenti per accedere alle **API di GitHub**.

Il problema è che **GitHub ha una quantità enorme di funzionalità**:

- repository
- pull request
- issues
- progetti
- e molto altro

Senza MCP dovresti:

- creare **un numero enorme di schemi di tool**
- scrivere **tutte le funzioni per ogni endpoint**
- gestire **integrazione, test e manutenzione**

Questo significa **scrivere, testare e mantenere molto codice di integrazione**.

Il costo di sviluppo e manutenzione diventerebbe rapidamente molto alto.

---

# Come funziona MCP

MCP risolve questo problema **spostando la definizione e l'esecuzione degli strumenti dal tuo server a server MCP dedicati**.

Invece di implementare tu tutti i tool di GitHub, esiste un **MCP Server per GitHub** che lo fa già.

Questo server:

- incapsula molte funzionalità di GitHub
- le espone come **set standardizzato di tool**

La tua applicazione **si connette a questo MCP server** invece di implementare tutto da zero.

---

# MCP Servers spiegati

Gli **MCP Servers** forniscono accesso a dati o funzionalità implementate da servizi esterni.

Agiscono come **interfacce specializzate** che espongono:

- tools
- prompts
- resources

in modo **standardizzato**.

Nel nostro esempio con GitHub:

- il **MCP Server per GitHub** contiene tool come: get_repos() e si connette direttamente alle 

**API di GitHub**

Il tuo server comunica con l’MCP server, che **gestisce tutti i dettagli specifici dell’implementazione GitHub**.

---

# Domande comuni

## Chi crea gli MCP Servers?

Chiunque può creare un'implementazione di un MCP server.

Spesso sono gli **stessi provider dei servizi** a rilasciare implementazioni ufficiali.

Ad esempio:

- **AWS** potrebbe rilasciare un MCP server ufficiale con strumenti per i propri servizi.

---

## In cosa è diverso dal chiamare direttamente le API?

Gli **MCP servers forniscono già schemi di tool e funzioni predefiniti**.

Se invece chiami le API direttamente:

- devi definire tu i **tool schema**
- devi implementare tu le **funzioni**
- devi gestire **integrazione e manutenzione**

MCP ti **fa risparmiare tutto questo lavoro di implementazione**.

---

## MCP non è la stessa cosa del tool use?

Questo è un equivoco comune.

**MCP servers** e **tool use** sono concetti **complementari ma diversi**.

- **MCP servers** → forniscono tool e schemi già definiti
- **Tool use** → riguarda il modo in cui Claude utilizza quei tool

La differenza principale è **chi fa il lavoro**:

- senza MCP → **scrivi tu i tool**
- con MCP → **qualcun altro li ha già implementati**

---

# Il vantaggio principale

Il beneficio è chiaro:

Invece di mantenere un sistema complesso di integrazioni, puoi **sfruttare MCP servers** che gestiscono tutto il lavoro di connessione ai servizi esterni.
