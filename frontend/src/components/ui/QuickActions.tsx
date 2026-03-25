"use client";

import { Users, UserPlus, Mail, Calculator } from "lucide-react";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  prompt: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "list-contacts",
    label: "Lista Contatti",
    icon: <Users className="w-4 h-4" />,
    prompt: "Mostrami la lista dei miei contatti.",
  },
  {
    id: "add-contact",
    label: "Nuovo Contatto",
    icon: <UserPlus className="w-4 h-4" />,
    prompt: "Voglio aggiungere un nuovo contatto alla mia rubrica. Ti fornirò nome, cognome e email. Il numero di telefono e le note personali sono opzionali.",
  },
  {
    id: "send-email",
    label: "Invia Email",
    icon: <Mail className="w-4 h-4" />,
    prompt: "Aiutami a spedire una email.",
  },
  {
    id: "calculate",
    label: "Calcola",
    icon: <Calculator className="w-4 h-4" />,
    prompt: "Devo eseguire un calcolo matematico.",
  },
];

interface QuickActionsProps {
  onActionClick: (prompt: string) => void;
  disabled?: boolean;
}

export function QuickActions({ onActionClick, disabled }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {QUICK_ACTIONS.map((action) => (
        <button
          key={action.id}
          onClick={() => onActionClick(action.prompt)}
          disabled={disabled}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-background/50 text-xs font-medium text-muted-foreground transition-all duration-200 hover:bg-accent/10 hover:border-accent/40 hover:text-accent disabled:opacity-50 disabled:pointer-events-none group"
        >
          <span className="text-muted-foreground group-hover:text-accent transition-colors duration-200">
            {action.icon}
          </span>
          {action.label}
        </button>
      ))}
    </div>
  );
}
