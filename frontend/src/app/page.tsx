"use client";

import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/header/Header";
import { ChatArea } from "@/components/ui/ChatArea";
import { InputArea } from "@/components/ui/InputArea";
import { QuickActions } from "@/components/ui/QuickActions";

import { Message } from "@/types/chat";
import { handleError } from "@/lib/error-toaster";
import { chatApi } from "@/lib/chat-api";

const initialMessage: Message[] = [
  {
    role: "ai",
    content: `Ciao! Questa è una demo del Model Context Protocol (MCP) per mostrare come l'AI possa interagire con i servizi esterni e con il mondo reale.

Puoi chiedermi di usare diverse funzionalità (Tool) che ho a disposizione, come:
- 📗 **Gestire la rubrica** (aggiungere, cercare o eliminare contatti sul db)
- 📧 **Inviare email** (tramite Gmail)
- 🔢 **Eseguire calcoli** matematici

Puoi usare i pulsanti qui sotto oppure scrivermi direttamente qui. Che cosa mi vorresti chiedere?`,
  },
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>(initialMessage);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    setIsLoading(true);
    try {
      const data = await chatApi.send(text, messages);
      setMessages((prev) => [...prev, { role: "ai", content: data.text }]);
    } catch (error) {
      handleError(error, {
        title: "Chat Error",
        fallbackMsg: "Errore durante la comunicazione con l'AI",
      });
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "Ops! Si è verificato un errore. Prova a ricaricare la pagina o riprovare più tardi.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (e?: React.SyntheticEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!input.trim()) return;

    const currentInput = input;
    const userMessage: Message = { role: "user", content: currentInput };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    sendMessage(currentInput);
  };

  const handleQuickAction = (prompt: string) => {
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);
    sendMessage(prompt);
  };

  return (
    <div className="flex h-screen flex-col bg-background text-foreground transition-colors duration-300">
      <Header />

      <ChatArea
        messages={messages}
        messagesEndRef={messagesEndRef}
        isLoading={isLoading}
      />

      <footer className="p-6 md:p-12 bg-linear-to-t from-background via-background/80 to-transparent">
        <div className="mx-auto max-w-2xl relative">
          <QuickActions
            onActionClick={handleQuickAction}
            disabled={isLoading}
          />
          <InputArea
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            isLoading={isLoading}
          />
          <p className="mt-4 text-center text-[11px] text-muted-foreground/70 font-medium">
            Sviluppato per comprendere il protocollo MCP • 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
