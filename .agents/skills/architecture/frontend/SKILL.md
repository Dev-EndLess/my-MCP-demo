# SKILL: Architecture — Frontend

> Next.js App Router project structure and conventions.
> For component patterns → `skills/frontend/components/SKILL.md`
> For data fetching patterns → `skills/frontend/data-fetching/SKILL.md`
> For backend structure → `skills/architecture/backend/SKILL.md`

## Frontend Architecture (React/Next.js/TypeScript)

Adapt domain folders to the project. Core folders (app/, components/, lib/) are fixed conventions.

```bash
my-nextjs-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── providers.tsx               # Wrap global providers here (Zustand, etc.)
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   └── [domain]/               # Add API routes per domain
│   │       └── route.ts
│   │
│   ├── (auth)/                     # Route group — no URL segment
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   │
│   └── [domain]/                   # Feature routes
│       ├── layout.tsx
│       └── page.tsx
│
├── components/
│   ├── ui/                         # Generic reusable components + tests
│   │   ├── Button.tsx
│   │   └── Button.test.tsx
│   ├── layout/                     # Header, Footer, Sidebar
│   └── [domain]/                   # Domain-specific components
│
├── lib/
│   ├── utils.ts                    # Shared utilities (cn, formatters)
│   ├── db.ts                       # DB connection config
│   └── auth.ts                     # NextAuth options
│
├── store/                          # Zustand stores
│   ├── use[Domain]Store.ts
│   └── index.ts                    # Central export
│
├── hooks/                          # Custom React hooks
├── types/                          # TypeScript interfaces and types
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/                        # Playwright specs
│
├── public/
├── .env.local
├── .env.test
├── .env.production
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
└── playwright.config.ts
```

---

## FE Rules

- Server Components by default — add `'use client'` only when necessary
- Co-locate tests with components inside `components/ui/`
- E2E tests go in `tests/e2e/` — never inside `app/`
- One store per domain — never put unrelated state in the same store
- `lib/utils.ts` is for pure utilities only — no side effects, no API calls
- Never create files outside the established structure without asking first

---
