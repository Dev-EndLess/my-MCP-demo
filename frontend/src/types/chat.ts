export interface Message {
  role: "user" | "ai";
  content: string;
}

export interface ChatAreaProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  isLoading?: boolean;
}
