# State Management

Entry point for state management decisions. Read this first, then open the relevant skill.

## Decision Table

| State Type              | When                                            | Solution                                                                       |
| ----------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------ |
| **Server state**        | Remote data, caching, mutations                 | → [`frontend/data-fetching`](../frontend/data-fetching/SKILL.md) (React Query) |
| **Form state**          | Input values, validation, submission            | → [`frontend/forms`](../frontend/forms/SKILL.md) (RHF + Zod)                   |
| **Server Actions**      | Mutations triggered from Server Components      | → [`frontend/server-actions`](../frontend/server-actions/SKILL.md)             |
| **URL state**           | Filters, pagination, search params              | `useSearchParams` (Next.js) or `nuqs`                                          |
| **Local component**     | State used by one component only                | `useState` / `useReducer`                                                      |
| **Global client state** | Shared UI state, auth user, modals, preferences | → [`state/zustand`](./zustand/SKILL.md) ✅                                     |

## Core Rule

> Keep state as close to where it's used as possible. Only promote to global when truly needed.

```ts
1 component needs it      → useState
2-3 sibling components    → lift state up or Context
app-wide, client-only     → Zustand
remote data               → React Query (never Zustand)
```

## What Belongs in Zustand

- Authenticated user object (after login)
- UI state: sidebar open/closed, active modal, theme
- Multi-step form wizard progress
- Shopping cart, notification queue
- Feature flags or user preferences (with persist)

## What Does NOT Belong in Zustand

- Server data (products list, user posts) → React Query
- Form field values → react-hook-form
- URL-driven state (filters, page) → useSearchParams
- Derived/computed values → compute inline or use selectors
