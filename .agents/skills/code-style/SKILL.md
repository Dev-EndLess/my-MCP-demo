# SKILL: Code Style

## Formatting

- **Quotes:** single quotes for imports, double quotes for strings in code
- **Semicolons:** none
- **Trailing commas:** none
- **Arrow functions:** no parentheses for single parameter — `x => x + 1`
- **Max line length:** 120 characters

## Principles

- **KISS** — simplest solution that works. No over-engineering.
- **DRY** — extract common logic into functions. No copy-paste.
- **YAGNI** — don't build features before they're needed. Start simple, refactor when needed.

## TypeScript

- Strict mode always on — never use `any`, use `unknown` + type narrowing
- Use `import type` for type-only imports

## Immutability

Always use spread — never mutate objects or arrays directly.

```typescript
// ✅ Correct
const updatedUser = { ...user, name: "New Name" };
const updatedItems = [...items, newItem];

// ❌ Avoid
user.name = "New Name";
items.push(newItem);
```

### interface vs type

```typescript
// ✅ interface — objects, props, API responses, extendable shapes
interface User {
  id: string;
  name: string;
}

// ✅ type — unions, tuples, primitives
type Status = "idle" | "loading" | "error" | "success";
type Coordinates = [number, number];
type ID = string;
```

### Boolean expressions

```typescript
// ✅ Explicit for null/undefined checks
if (user != null) {
}
if (value !== "") {
}

// ✅ Concise OK for guaranteed boolean or number types
if (isEnabled) {
} // isEnabled: boolean
if (items.length) {
} // length: number

// ❌ Avoid truthiness on mixed types
if (value) {
} // unclear if string | number | null
```

### Optional chaining & nullish coalescing

```typescript
// ✅ Correct
const name = user?.profile?.name ?? "Anonymous";

// ❌ Avoid
const name = (user && user.profile && user.profile.name) || "Anonymous";
```

---

## Code Quality

- **Max lines per file:** 250 (excluding comments and blank lines)
- **Max imports per file:** 15 — if exceeded, consider splitting the file
- **No magic numbers:** use named constants
- **No `var`:** always `const` or `let`
- **Prefer `const`** over `let` when value does not change
- **No `debugger`** in committed code

```typescript
// ✅ Correct
const MAX_RETRY_ATTEMPTS = 3;
if (retries > MAX_RETRY_ATTEMPTS) {
}

// ❌ Avoid
if (retries > 3) {
}
```

---

## Naming Conventions

- **Components:** PascalCase — `UserCard.tsx`, `AuthModal.tsx`
- **Utilities / hooks / stores:** camelCase — `apiUtils.ts`, `useAuth.ts`, `useUserStore.ts`
- **Types / interfaces:** PascalCase — `UserProfile`, `ApiResponse`
- **Constants:** SCREAMING_SNAKE_CASE — `MAX_RETRIES`, `API_BASE_URL`

---

## Comments

- Code should be self-documenting — good naming over comments
- Comment the **why**, not the **what**
- Use JSDoc for public APIs and complex utilities

```typescript
// ❌ Obvious
// Increment counter
setCount((prev) => prev + 1);

// ✅ Explains why
// Debounce to prevent rate limiting on search API
const debouncedSearch = useDebounce(searchTerm, 500);

// ✅ JSDoc for public utility
/**
 * Formats a date string into a human-readable format
 * @param date - ISO 8601 date string
 * @param locale - BCP 47 language tag (default: 'it-IT')
 */
export function formatDate(date: string, locale = "it-IT"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}
```
