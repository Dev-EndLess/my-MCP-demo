import { ChatAreaProps } from "@/types/chat";

export function ChatArea({messages, messagesEndRef, isLoading}: ChatAreaProps) {
  return (
    <main className="flex-1 overflow-y-auto px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-8">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-50">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-lg font-medium">Inizia una conversazione</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            } animate-in`}
          >
            <div
              className={`max-w-[85%] px-5 py-3.5 shadow-sm transition-all duration-200 ${
                message.role === "user"
                  ? "chat-bubble-user"
                  : "chat-bubble-ai border border-border"
              }`}
            >
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="chat-bubble-ai border border-border px-5 py-3.5 italic text-muted-foreground">
              L&apos;assistente sta scrivendo...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </main>
  );
}
