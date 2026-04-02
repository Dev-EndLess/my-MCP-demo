# SKILL: Data Fetching

> When and how to fetch data in a Next.js App Router project.
> For mutations and form submissions → `frontend/server-actions/SKILL.md`
> For component structure → `frontend/components/SKILL.md`

---

## Which approach to use

| Scenario                                     | Use                    |
| -------------------------------------------- | ---------------------- |
| Initial page load, SEO-critical, static data | RSC (Server Component) |
| Data that changes on user interaction        | React Query            |
| Polling or real-time updates                 | React Query            |
| Data needed only after a user action         | React Query            |

**Never use `useEffect` + `fetch`** — use RSC or React Query instead.

---

## RSC — Server Components

Fetch directly in the component. No `useEffect`, no loading state needed at component level.

```typescript
// ✅ Async Server Component
export default async function UserProfile({ userId }: { userId: string }) {
  const user = await getUser(userId)
  if (user == null) notFound()
  return <ProfileView user={user} />
}
```

### Loading and error boundaries

Always pair a `page.tsx` with `loading.tsx` and `error.tsx` in the same route segment.

```bash
app/users/[id]/
├── page.tsx       # data fetch here
├── loading.tsx    # automatic Suspense boundary
└── error.tsx      # automatic error boundary
```

```typescript
// loading.tsx
export default function Loading() {
  return <ProfileSkeleton />
}

// error.tsx
'use client'
export default function Error({ error, reset }: { error: Error, reset: () => void }) {
  return (
    <div>
      <p>Something went wrong.</p>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

### Parallel fetching

Avoid waterfalls — fetch independent data in parallel with `Promise.all`.

```typescript
// ❌ Waterfall — each await blocks the next
const user = await getUser(userId);
const posts = await getPosts(userId);

// ✅ Parallel
const [user, posts] = await Promise.all([getUser(userId), getPosts(userId)]);
```

---

## React Query — Client-side

Use when data must update based on user interaction, needs polling, or must refetch without navigation.

```typescript
// ✅ Standard pattern
'use client'
function UserActivity({ userId }: { userId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user-activity', userId],
    queryFn: () => fetchUserActivity(userId)
  })

  if (isLoading) return <ActivitySkeleton />
  if (error != null) return <ErrorMessage error={error} />
  return <ActivityFeed data={data} />
}
```

### Query key conventions

```typescript
// ✅ Always include identifiers that scope the query
queryKey: ["users", userId];
queryKey: ["users", userId, "posts"];
queryKey: ["products", { category, page }];

// ❌ Too generic — collides across instances
queryKey: ["user"];
queryKey: ["data"];
```

### Mutations

```typescript
// ✅ useMutation for user-triggered writes
const { mutate, isPending } = useMutation({
  mutationFn: (data: UpdateProfileDTO) => updateProfile(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["users", userId] });
  },
  onError: (error) => {
    toast.error("Update failed");
  },
});
```

Always invalidate or update the relevant query after a successful mutation.

---

## Rules

- RSC for initial load — React Query for dynamic/interactive data
- Never fetch in `useEffect`
- Always handle `isLoading` and `error` states explicitly — never assume data is available
- Parallel fetch with `Promise.all` when data is independent
- Query keys must be specific enough to avoid cache collisions
