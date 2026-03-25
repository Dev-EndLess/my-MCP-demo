export function Header() {
  return (
    <header className="flex h-16 items-center border-b px-6 glass sticky top-0 z-10 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
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
            className="text-white"
          >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
          </svg>
        </div>
        <div className="flex flex-col">
          <h1 className="text-base font-bold tracking-tight leading-none">
            MCP Assistant
          </h1>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
            Anthropic MCP Course
          </span>
        </div>
      </div>
    </header>
  );
}