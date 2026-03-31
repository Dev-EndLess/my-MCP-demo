# SKILL: Architecture

> Entry point for project structure decisions. Read this file first, then open the specific skill.

---

## Skills Index

| Task                                                | File                                    |
| --------------------------------------------------- | --------------------------------------- |
| Next.js project structure, folder conventions       | `skills/architecture/frontend/SKILL.md` |
| Node.js/Express project structure, layer separation | `skills/architecture/backend/SKILL.md`  |

---

## Universal Rules

- Never create files outside the established structure without asking first
- One responsibility per folder — never mix concerns (e.g. no business logic in `utils/`)
- Shared code between frontend and backend (e.g. Zod schemas, types) lives in a `packages/shared/` folder in monorepo setups — never duplicate
- When in doubt about where a file belongs, ask before creating it

---

## When in doubt

If the project is fullstack Next.js (frontend + API routes in the same repo) → start from `frontend/SKILL.md`.
If the project has a separate Express backend → read both.
