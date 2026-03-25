import { toast } from "react-toastify";

export const handleError = (error: unknown, options: { 
  title?: string; 
  showToast?: boolean;
  fallbackMsg?: string;
} = {}) => {
  const { 
    title = "Errore", 
    showToast = true, 
    fallbackMsg = "Si è verificato un errore imprevisto." 
  } = options;

  let message = fallbackMsg;
  let statusCode: number | string | null = null;

  if (error instanceof Error) {
    message = error.message;
  }
  
  // Per errori che arrivano da fetch o dal backend in formato JSON
  // usiamo un type guard parziale per evitare 'any' dove possibile
  if (error && typeof error === 'object') {
    const errObj = error as Record<string, unknown>;
    
    // Tentativo di estrarre il messaggio e lo status code
    if (typeof errObj.message === 'string') message = errObj.message;
    if (typeof errObj.statusCode === 'number' || typeof errObj.statusCode === 'string') {
      statusCode = errObj.statusCode;
    }
    
    // Handling specifico per risposte fetch/axios che mettono l'errore in una proprietà 'error'
    if (typeof errObj.error === 'string') {
      message = errObj.error;
    }
  }

  // Log su console per il debugging
  console.error(`[FRONTEND ERROR] ${title}${statusCode ? ` (${statusCode})` : ""}:`, error);

  if (showToast) {
    if (statusCode === 429) {
      toast.warn(`Limite Raggiunto: Hai superato il limite di richieste dell'API gratuita di Gemini. Attendi un momento prima di riprovare.`, {
        position: "bottom-right",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "dark",
      });
    } else if (statusCode === 503) {
      toast.info(`Server Occupato: Molti utenti stanno usando l'API gratuita in questo momento. Riprova tra 10-15 secondi.`, {
        position: "bottom-right",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "dark",
      });
    } else {
      toast.error(`${title}: ${message}`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  }

  return { message, statusCode };
};
