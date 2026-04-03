# Error Handling

Standard for surfacing errors from server to UI. Covers React error boundaries, toast notifications, and the connection between Server Actions and client feedback.

For Express error classes and middleware → `skills/api/express-errors/SKILL.md`
For Server Action return shapes → `skills/frontend/server-actions/SKILL.md`

---

## Error Boundaries

Use `error.tsx` as the default boundary in Next.js App Router. It catches unexpected runtime errors in a route segment.

```ts
// app/dashboard/error.tsx
'use client'

import { useEffect } from 'react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error) // replace with Sentry or similar in production
  }, [error])

  return (
    <div>
      <p>Something went wrong.</p>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

Use `global-error.tsx` at root only to catch errors in the root layout — rare.

---

## Toast Notifications — Sonner

Centralize toast calls — never call `toast()` directly in components.

```ts
// lib/toast.ts
import { toast } from "sonner";

export const toastSuccess = (message: string) => toast.success(message);
export const toastError = (message: string) => toast.error(message);
```

Mount `<Toaster />` once in root layout:

```ts
// app/layout.tsx
import { Toaster } from 'sonner'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  )
}
```

---

## Server Action → Toast Pattern

Action returns `{ success, error }`, component reads it and fires toast.

```ts
// app/actions/post.ts
"use server";

export async function createPost(data: unknown) {
  const parsed = postSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Invalid data" };

  try {
    await db.post.create({ data: parsed.data });
    return { success: true };
  } catch {
    return { success: false, error: "Failed to create post" };
  }
}
```

```ts
'use client'

import { useTransition } from 'react'
import { createPost } from '@/app/actions/post'
import { toastSuccess, toastError } from '@/lib/toast'

export function CreatePostButton() {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    startTransition(async () => {
      const result = await createPost(data)
      if (result.success) toastSuccess('Post created')
      else toastError(result.error ?? 'Something went wrong')
    })
  }

  return <button disabled={isPending} onClick={handleClick}>Create</button>
}
```

---

## Not Found

Use Next.js built-in — never render a 404 manually inside a page component.

```ts
// app/posts/[id]/page.tsx
import { notFound } from 'next/navigation'

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await db.post.findUnique({ where: { id: params.id } })
  if (!post) notFound()

  return <PostView post={post} />
}
```

```ts
// app/posts/[id]/not-found.tsx
export default function NotFound() {
  return <p>Post not found.</p>
}
```

---

## Rules

- Never swallow errors silently — always return `{ success: false, error }` or throw
- Never expose internal error messages to the client — map to user-friendly strings
- Never call `toast()` directly in components — use helpers from `lib/toast.ts`
- `error.tsx` is for unexpected crashes — expected errors (not found, unauthorized) use `notFound()` or action return shapes
- Always log unexpected errors server-side before returning a generic message to the client
