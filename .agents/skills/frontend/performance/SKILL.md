# SKILL: Performance

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], display: 'swap' })
```

## Memoization — use sparingly, only when justified

```typescript
import { memo, useMemo, useCallback } from 'react'

// ✅ memo — only for components that re-render often with stable props
const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  return <div>{product.name}</div>
})

// ✅ useMemo — only for genuinely expensive computations
const sortedItems = useMemo(
  () => items.slice().sort((a, b) => b.price - a.price),
  [items]
)

// ✅ useCallback — only when passing callbacks to memoized children
const handleDelete = useCallback((id: string) => {
  setItems(prev => prev.filter(item => item.id !== id))
}, [])

// ❌ Avoid — memoizing cheap operations wastes memory
const label = useMemo(() => `Hello ${name}`, [name])
```

**Rule of thumb:** profile before optimizing. Don't add `memo`/`useMemo`/`useCallback` by default.

## Lazy loading

```typescript
// ✅ Lazy-load heavy components not needed on initial render
const RichTextEditor = dynamic(() => import('@/components/ui/RichTextEditor'), {
  loading: () => <EditorSkeleton />,
  ssr: false // for browser-only libs
})

// ✅ Lazy-load images
<Image
  src={product.image}
  alt={product.name}
  width={400}
  height={300}
  loading="lazy"        // below the fold
  priority={false}
/>

// For above-the-fold hero images:
<Image src={hero} alt="Hero" priority />
```

## List rendering

```typescript
// ✅ Always use stable, unique keys — never array index for dynamic lists
{items.map(item => <ProductCard key={item.id} product={item} />)}

// ❌ Index as key breaks reconciliation on reorder/delete
{items.map((item, i) => <ProductCard key={i} product={item} />)}
```

---
