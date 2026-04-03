# SKILL: Accessibility

Semantic HTML first — ARIA only when native elements are not sufficient.

```typescript
// ❌ Avoid — div with click handler is not keyboard accessible
<div onClick={handleClick}>Open menu</div>

// ✅ Use semantic elements
<button onClick={handleClick}>Open menu</button>
```

## ARIA essentials

```typescript
// ✅ Icon-only buttons must have an accessible label
<button aria-label="Close dialog">
  <X size={16} aria-hidden="true" />
</button>

// ✅ Dynamic regions that update asynchronously
<div aria-live="polite">{statusMessage}</div>

// ✅ Form fields must be associated with labels
<label htmlFor="email">Email</label>
<input id="email" type="email" {...register('email')} />
```

## Keyboard navigation

- All interactive elements must be reachable via Tab and operable via Enter/Space
- Modal/dialog: trap focus inside while open, restore focus on close
- Never remove `outline` without providing an equivalent `:focus-visible` style

```typescript
// ✅ Preserve focus styles
<button className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none">
  Submit
</button>
```

## Color contrast

- Normal text: minimum 4.5:1 ratio (WCAG AA)
- Large text (18px+ or 14px bold): minimum 3:1 ratio
- Never use color alone to convey information — always pair with text or icon
