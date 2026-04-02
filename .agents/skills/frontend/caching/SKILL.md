# SKILL: Caching

> Next.js caching strategies for data, routes, and on-demand revalidation.
> For data fetching patterns → `skills/frontend/data-fetching/SKILL.md`
> For Server Actions and revalidation after mutations → `skills/frontend/server-actions/SKILL.md`

---

## Which strategy to use

| Data type                       | Strategy         | Config                    |
| ------------------------------- | ---------------- | ------------------------- |
| Static content (rarely changes) | Force cache      | `cache: 'force-cache'`    |
| Time-sensitive content          | ISR — time-based | `next: { revalidate: N }` |
| Content invalidated on mutation | ISR — tag-based  | `next: { tags: ['tag'] }` |
| User-specific or real-time      | No cache         | `cache: 'no-store'`       |

---

## fetch Cache Options

```typescript
// ✅ Static — cache forever, revalidate manually
const data = await fetch(url, { cache: "force-cache" });

// ✅ ISR — revalidate every 60 seconds
const data = await fetch(url, { next: { revalidate: 60 } });

// ✅ Tag-based — invalidate on demand
const data = await fetch(url, { next: { tags: ["products"] } });

// ✅ Dynamic — no cache, fresh on every request
const data = await fetch(url, { cache: "no-store" });
```

---

## ORM Queries

```typescript
// With ORM (Prisma/Mongoose) — fetch cache does not apply
// Wrap queries with unstable_cache to enable tag-based revalidation
import { unstable_cache } from "next/cache";

const getProducts = unstable_cache(
  async () => db.product.findMany(),
  ["products"], // cache key
  { tags: ["products"], revalidate: 60 }, // same syntax as fetch
);

// revalidateTag('products') works normally after
```

---

## On-demand Revalidation

Prefer `revalidateTag` over `revalidatePath` — more precise, invalidates only the affected data.

```typescript
"use server";
import { revalidateTag, revalidatePath } from "next/cache";

// ✅ Tag-based — invalidates all fetches tagged 'products'
export async function updateProduct(id: string, data: UpdateProductDTO) {
  await db.product.update({ where: { id }, data });
  revalidateTag("products");
}

// ✅ Path-based — use when the full page must re-render
export async function updateProfile(data: UpdateProfileDTO) {
  await db.user.update({ where: { id: data.id }, data });
  revalidatePath("/profile");
}

// ✅ Both — when data is shared across multiple pages
export async function deletePost(id: string) {
  await db.post.delete({ where: { id } });
  revalidateTag("posts");
  revalidatePath("/blog");
}
```

---

## Route Segment Config

Override caching at the route level — takes precedence over fetch options.

```typescript
// page.tsx or layout.tsx

// ✅ Force dynamic — never cache this route
export const dynamic = "force-dynamic";

// ✅ Force static — always cache this route
export const dynamic = "force-static";

// ✅ Revalidate entire route every 3600 seconds
export const revalidate = 3600;
```

---

## Streaming with Suspense

Use Suspense to progressively stream slow data without blocking the entire page.

```typescript
// app/product/[id]/page.tsx
import { Suspense } from 'react'

export default async function ProductPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)   // fast — renders immediately

  return (
    <div>
      <ProductHeader product={product} />

      {/* Stream in slow sections independently */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews productId={id} />
      </Suspense>

      <Suspense fallback={<RecommendationsSkeleton />}>
        <Recommendations productId={id} />
      </Suspense>
    </div>
  )
}

// Each component fetches its own data — no prop drilling
async function Reviews({ productId }: { productId: string }) {
  const reviews = await getReviews(productId)   // slow API — streamed in
  return <ReviewList reviews={reviews} />
}
```

**Rule:** use Suspense when a section has a slow data dependency that should not block the rest of the page.

---

## Rules

- Default to `revalidateTag` over `revalidatePath` — it's more granular
- Always assign cache tags to fetches that are invalidated by mutations
- Never use `cache: 'no-store'` for public, shared data — it bypasses all caching and hurts performance
- Use `force-dynamic` only when the page truly needs fresh data on every request (e.g. dashboards with real-time data)
- Always provide a `fallback` to every `<Suspense>` boundary — never leave it empty
