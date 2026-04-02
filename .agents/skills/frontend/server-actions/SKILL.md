# SKILL: Server Actions

> Mutations triggered from the client — form submissions, user-triggered writes.
> For data fetching → `frontend/data-fetching/SKILL.md`
> For form handling → `frontend/forms/SKILL.md`

---

## When to use

| Scenario                              | Use                              |
| ------------------------------------- | -------------------------------- |
| Form submission                       | Server Action                    |
| Simple mutation without optimistic UI | Server Action                    |
| Mutation that needs optimistic UI     | React Query `useMutation`        |
| Exposing data to third parties        | API Route — never Server Actions |

---

## Base pattern

```typescript
// app/actions/user.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { updateProfileSchema } from "@/lib/validators/user";
import { db } from "@/lib/db";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (session == null) return { error: "Unauthorized" };

  const parsed = updateProfileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.flatten() };

  await db.user.update({
    where: { id: session.user.id },
    data: parsed.data,
  });

  revalidatePath("/profile");
  return { success: true };
}
```

---

## Rules

- **Always authenticate inside the action** — never trust the caller
- **Always validate with Zod** before touching the DB
- **Never throw to the client** — return `{ error }` instead
- **Always revalidate** after a mutation — `revalidatePath` or `revalidateTag`

---

## Return shape

Consistent across all actions:

```typescript
// ✅ Success
return { success: true };
return { success: true, data: T };

// ✅ Error
return { error: "Unauthorized" };

// ✅ Validation error
return { error: parsed.error.flatten() };
```

Never mix shapes — always return the same structure from all branches of an action.

---

## Calling from a Client Component

```typescript
'use client'

import { updateProfile } from '@/app/actions/user.actions'

function ProfileForm() {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await updateProfile(formData)
      if (result.error) toast.error('Update failed')
    })
  }

  return (
    <form action={handleSubmit}>
      <input name="name" />
      <button type="submit" disabled={isPending}>Save</button>
    </form>
  )
}
```

Use `useTransition` to track pending state — never manage a manual `isLoading` boolean for actions.

---

## File location

```bash
app/
└── actions/
    ├── user.actions.ts     # one file per domain
    ├── post.actions.ts
    └── auth.actions.ts
```

- One file per domain — never mix unrelated actions in the same file
- Always suffix with `.actions.ts`
- Never co-locate actions inside `components/` — they belong in `app/actions/`
