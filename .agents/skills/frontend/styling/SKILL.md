# Styling

Tailwind CSS v4 only. No inline styles, no CSS modules unless strictly necessary.
For visual UI patterns (glow, glassmorphism, hero, grid) → `skills/frontend/ui-patterns/SKILL.md`

---

## cn() Setup

```ts
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

```tsx
// Usage — conditional classes
<div
  className={cn(
    "flex items-center gap-2 rounded-lg px-4 py-2",
    variant === "primary" && "bg-indigo-600 text-white",
    variant === "ghost" && "bg-white/5 text-white/60",
    disabled && "cursor-not-allowed opacity-50",
  )}
/>
```

---

## Tailwind v4 — Theme Config

In v4 there is no `tailwind.config.ts` — the entire theme lives in the CSS with `@theme`.

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* Colors */
  --color-brand: #6366f1;
  --color-brand-hover: #4f46e5;

  /* Border radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;

  /* Typography */
  --font-sans: "Inter", sans-serif;
  --font-display: "Cal Sans", sans-serif;
}
```

The variables defined in `@theme` automatically become utility classes:

- `--color-brand` → `bg-brand`, `text-brand`, `border-brand`
- `--radius-md` → `rounded-md`

---

## CSS Custom Properties

For dynamic values or values not covered by `@theme`, use standard CSS custom properties:

```css
/* globals.css */
:root {
  --sidebar-width: 260px;
  --header-height: 56px;
}
```

```tsx
{/* Use them with arbitrary values */}
<aside className="w-(--sidebar-width)" />
<header className="h-(--header-height)" />
```

---

## Typography Scale

Guidelines for text on dark background:

```tsx
{/* Headings */}
<h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl" />
<h2 className="text-2xl font-semibold tracking-tight text-white" />
<h3 className="text-lg font-semibold text-white" />

{/* Body */}
<p className="text-base leading-relaxed text-white/60" />
<p className="text-sm leading-relaxed text-white/50" />  {/* secondary */}

{/* Muted / labels */}
<span className="text-xs font-medium uppercase tracking-widest text-white/40" />
```

Rule: `text-white` for headings, `text-white/60` for body, `text-white/40` for muted, `text-white/30` for placeholder.

---

## Responsive — Mobile First

Always from mobile upward. Never think desktop-first.

```tsx
{
  /* ✅ */
}
<div className="flex flex-col gap-4 md:flex-row md:gap-6" />;

{
  /* ❌ */
}
<div className="flex flex-row gap-6 sm:flex-col sm:gap-4" />;
```

Breakpoints v4: `sm` 640px · `md` 768px · `lg` 1024px · `xl` 1280px · `2xl` 1536px

---

## Dark Mode

Use `dark:` variant — never manual toggling via JS.

```tsx
<div className="bg-white text-gray-900 dark:bg-gray-950 dark:text-white" />
```

In v4 configure the strategy in CSS:

```css
/* globals.css */
@variant dark (&:where(.dark, .dark *));
```

---

## Icons — Lucide React

Always import individual icons — never import a barrel.

```tsx
{
  /* ✅ */
}
import { ArrowRight, Check, X } from "lucide-react";

{
  /* ❌ */
}
import * as Icons from "lucide-react";
```

Standard sizes: `size={16}` inline, `size={18}` button, `size={20}` standalone.

---

## Rules

- Arbitrary values for static values: `w-[320px]`, `bg-[#0a0a0a]`, `[background-size:24px_24px]`
- `style={{}}` only for **dynamic** values at runtime (from props or state)
- Never use `!important`
- Never use CSS modules or `styled-components` — Tailwind only
- Class order: layout → spacing → typography → color → border → effect → transition
