# SKILL: SEO & Metadata

> Next.js metadata API, Open Graph, and static generation patterns.
> For data fetching patterns → `skills/frontend/data-fetching/SKILL.md`
> For page structure → `skills/architecture/frontend/SKILL.md`

---

## Static Metadata

Define in `layout.tsx` for site-wide defaults, in `page.tsx` for route-specific overrides.

```typescript
// app/layout.tsx — site-wide defaults
export const metadata: Metadata = {
  title: {
    default: "My App",
    template: "%s | My App", // page title becomes "Product Name | My App"
  },
  description: "Default site description",
  metadataBase: new URL("https://myapp.com"),
};

// app/about/page.tsx — static override
export const metadata: Metadata = {
  title: "About", // renders as "About | My App"
  description: "About us page description",
};
```

---

## Dynamic Metadata

Use `generateMetadata` when metadata depends on fetched data.

```typescript
// app/products/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)

  if (product == null) return {}

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image, width: 1200, height: 630 }]
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [product.image]
    }
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (product == null) notFound()

  return <ProductDetail product={product} />
}
```

---

## generateStaticParams

Use to pre-render dynamic routes at build time.

```typescript
// app/products/[slug]/page.tsx
export async function generateStaticParams() {
  const products = await db.product.findMany({
    select: { slug: true },
  });
  return products.map((p) => ({ slug: p.slug }));
}
```

---

## not-found.tsx

Always define `not-found.tsx` at the route segment level — called via `notFound()`.

```typescript
// app/products/[slug]/not-found.tsx
export default function ProductNotFound() {
  return (
    <div>
      <h1>Product not found</h1>
      <p>The product you are looking for does not exist.</p>
    </div>
  )
}

// app/products/[slug]/page.tsx
import { notFound } from 'next/navigation'

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug)
  if (product == null) notFound()    // triggers not-found.tsx
  return <ProductDetail product={product} />
}
```

---

## Rules

- Always define `metadataBase` in root `layout.tsx` — required for absolute OG image URLs
- Always use `title.template` in root layout — avoids repeating the site name manually
- `generateMetadata` runs on the server — safe to fetch directly, never expose secrets in returned metadata
- Always call `notFound()` instead of returning `null` for missing resources — triggers the correct UI and returns a 404 status
- Open Graph images should be 1200×630px
