# SKILL: Frontend

> Entry point for all frontend skills. Read this file first, then open the specific skill for the task.
> For TypeScript rules and code quality → `skills/code-style/SKILL.md`
> For project structure and file placement → `skills/architecture/SKILL.md`

---

## Skills Index

| Task                                          | File                                      |
| --------------------------------------------- | ----------------------------------------- |
| React components, props, Server vs Client     | `skills/frontend/components/SKILL.md`     |
| Styling — Tailwind, cn(), dark mode           | `skills/frontend/styling/SKILL.md`        |
| UI patterns — glow, glassmorphism, hero, grid | `skills/frontend/ui-patterns/SKILL.md`    |
| Forms — react-hook-form + zod                 | `skills/frontend/forms/SKILL.md`          |
| Data fetching — RSC, React Query              | `skills/frontend/data-fetching/SKILL.md`  |
| Mutations — Server Actions                    | `skills/frontend/server-actions/SKILL.md` |
| SEO, metadata, Open Graph, not-found          | `skills/frontend/seo/SKILL.md`            |
| Auth — NextAuth, session and middleware       | `skills/frontend/auth/SKILL.md`           |
| Caching, ISR, revalidation, Streaming         | `skills/frontend/caching/SKILL.md`        |
| Performance — memo, lazy loading              | `skills/frontend/performance/SKILL.md`    |
| Accessibility — ARIA, keyboard, contrast      | `skills/frontend/accessibility/SKILL.md`  |
| Error boundaries, toast, not-found            | `skills/frontend/error-handling/SKILL.md` |

---

## Stack

| Package                   | Purpose                          |
| ------------------------- | -------------------------------- |
| `next`                    | Framework (App Router)           |
| `typescript`              | Language — strict mode always on |
| `tailwindcss`             | Styling                          |
| `zod`                     | Schema validation                |
| `react-hook-form`         | Form state management            |
| `zustand`                 | Global client state              |
| `next-auth`               | Authentication                   |
| `lucide-react`            | Icon library                     |
| `sonner`                  | Toast notifications              |
| `clsx` + `tailwind-merge` | Conditional class merging        |

**Optional — use only if already in `package.json`:**
`@shadcn/ui`, `@tanstack/react-query`, `nuqs`

---

## Universal Rules

- Server Components by default — add `'use client'` only when strictly needed
- Never use `useEffect` + `fetch` for data fetching — use RSC or React Query
- Never manage form state with `useState` — use `react-hook-form` + `zod`
- Always validate input with Zod before touching the DB or calling a Server Action
- Tailwind only — no inline styles, no CSS modules unless strictly necessary

## When in doubt

If the task touches multiple areas, start from `components/SKILL.md` — it's the foundation.
