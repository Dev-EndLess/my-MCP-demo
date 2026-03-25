import { InputAreaProps } from "@/types/input";

export function InputArea({ input, setInput, handleSend, isLoading }: InputAreaProps) {
  return (
    <form
      onSubmit={handleSend}
      className="group relative flex items-center gap-2 overflow-hidden rounded-2xl border bg-muted/30 p-2.5 shadow-xl transition-all duration-300 focus-within:border-accent/40 focus-within:ring-4 focus-within:ring-accent/10 focus-within:bg-muted/50"
    >
      <textarea
        rows={1}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        disabled={isLoading}
        className="flex-1 bg-transparent px-4 py-2 text-[15px] outline-none resize-none max-h-40 min-h-11 placeholder:text-muted-foreground/60"
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-white shadow-lg shadow-accent/20 transition-all duration-200 hover:scale-105 hover:bg-accent/90 active:scale-95 disabled:opacity-30 disabled:grayscale disabled:hover:scale-100 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </form>
  );
}
