# SKILL: Components

> React component patterns, structure, and composition for Next.js projects.
> For styling → `frontend/styling/SKILL.md`
> For data fetching → `frontend/data-fetching/SKILL.md`
> For TypeScript rules → `code-style/SKILL.md`

---

## Declaration style

- **Exported components:** always `function Component()` — better stack traces and DevTools
- **Internal helpers and callbacks:** always arrow functions

```typescript
// ✅ Correct
function UserCard({ user }: UserCardProps) {
  const formatName = (name: string) => name.trim().toLowerCase()
  const handleClick = () => setCount(prev => prev + 1)

  return <div onClick={handleClick}>{formatName(user.name)}</div>
}

// ❌ Avoid
const UserCard = ({ user }: UserCardProps) => { ... }
```

---

## Props

- Always destructure — never use `props.x`
- Always use `<>` shorthand — use `<Fragment>` only when `key` is needed
- Never blind-spread props

```typescript
// ❌ Never
function Button(props: ButtonProps) {
  return <button {...props} />
}

// ✅ Explicit
function Button({ onClick, disabled, children }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{children}</button>
}

// ✅ Rest spread — only when consciously wrapping a native HTML element
function Button({ variant = 'primary', children, ...htmlProps }: ButtonProps) {
  return (
    <button className={cn(variantStyles[variant])} {...htmlProps}>
      {children}
    </button>
  )
}
```

---

## Server vs Client Components

Default to Server Components. Add `'use client'` only when strictly needed.

| Use Server Components for | Use Client Components for               |
| ------------------------- | --------------------------------------- |
| Data fetching, DB access  | Event handlers, `useState`, `useEffect` |
| Static rendering, SEO     | Browser APIs, third-party DOM libs      |

```typescript
// ✅ Server Component — no directive, async allowed
export default async function ProductList() {
  const products = await getProducts()
  return <ul>{products.map(p => <ProductCard key={p.id} product={p} />)}</ul>
}

// ✅ Client Component — only what needs interactivity
'use client'

export function AddToCartButton({ productId }: { productId: string }) {
  const [added, setAdded] = useState(false)
  return (
    <button onClick={() => setAdded(true)}>
      {added ? 'Added' : 'Add to cart'}
    </button>
  )
}
```

**Push `'use client'` as far down the tree as possible.** Extract only the interactive part — keep the parent as Server Component.

---

## When to split a component

Split when any of these apply:

- Exceeds ~80 JSX lines
- Has its own independent state
- Is reused in 2+ unrelated places
- Has a distinct, nameable responsibility

```typescript
// ❌ Monolith
function DashboardPage() {
  return <div>{/* 200 lines */}</div>
}

// ✅ Composed
function DashboardPage() {
  return (
    <div>
      <DashboardHeader />
      <MetricsSummary />
      <RecentActivityFeed />
    </div>
  )
}
```

---

## Composition over configuration

Prefer composing small focused components over prop explosion.

```typescript
// ❌ Avoid
<Modal title="..." footer="..." showCloseButton hasOverlay size="lg" />

// ✅ Prefer
<Modal>
  <Modal.Header>Title</Modal.Header>
  <Modal.Body>Content</Modal.Body>
  <Modal.Footer><Button>Confirm</Button></Modal.Footer>
</Modal>
```

---

## Co-location

Keep files close to where they are used. Promote to shared folders only when used in 2+ unrelated places.

```bash
components/
├── ui/                   # Generic — reusable anywhere
│   ├── Button.tsx
│   └── Button.test.tsx
└── [domain]/             # Domain-specific — never reuse across domains
    └── UserCard.tsx
```
