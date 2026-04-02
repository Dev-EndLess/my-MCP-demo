# UI Patterns

Modern UI patterns for production interfaces. Reference: Linear, Vercel, Resend, Clerk.
All patterns use Tailwind + CSS custom properties. No external animation libraries unless noted.

---

## Gradient Text

```tsx
<h1 className="bg-linear-to-br from-white via-white/90 to-white/40 bg-clip-text text-transparent">
  Build something great
</h1>;

{
  /* Colored variant */
}
<span className="bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
  ship faster
</span>;
```

---

## Glow / Spotlight

```tsx
{
  /* Radial glow behind hero content */
}
<div className="relative flex items-center justify-center">
  <div className="absolute h-100 w-150 rounded-full bg-indigo-500/20 blur-[120px]" />
  <div className="relative z-10">{/* content */}</div>
</div>;

{
  /* Button glow */
}
<button
  className="relative rounded-lg bg-indigo-600 px-6 py-2.5 text-white
  shadow-[0_0_24px_rgba(99,102,241,0.4)] transition-shadow
  hover:shadow-[0_0_32px_rgba(99,102,241,0.6)]"
>
  Get started
</button>;
```

---

## Glassmorphism Card

```tsx
<div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
  {/* content */}
</div>;

{
  /* Darker variant — sits on dark bg */
}
<div
  className="rounded-xl border border-white/6 bg-white/3 p-6 backdrop-blur-xl
  shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
>
  {/* content */}
</div>;
```

---

## Noise Texture Overlay

```css
/* globals.css */
.noise::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); /* use an SVG noise or bg-noise package */
  opacity: 0.03;
  pointer-events: none;
}
```

```tsx
{
  /* Simpler Tailwind approach — use a noise PNG in /public */
}
<div className="relative">
  <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
  <div className="relative z-10">{/* content */}</div>
</div>;
```

---

## Animated Gradient Border

```tsx
{/* CSS-based — performant */}
<div className="relative rounded-xl bg-[linear-gradient(135deg,#6366f1,#06b6d4,#6366f1)] p-1px">
  <div className="rounded-xl bg-gray-950 p-6">
    {/* content */}
  </div>
</div>

{/* Animated variant */}
<style>{`
  @keyframes border-rotate {
    to { --angle: 360deg; }
  }
  .animated-border {
    background: conic-gradient(from var(--angle, 0deg), #6366f1, #06b6d4, #a855f7, #6366f1);
    animation: border-rotate 4s linear infinite;
  }
`}</style>

<div className="animated-border relative rounded-xl p-1px">
  <div className="rounded-xl bg-gray-950 p-6">{/* content */}</div>
</div>
```

---

## Subtle Grid Background

```tsx
{
  /* Dot grid */
}
<div className="relative bg-gray-950">
  <div
    className="absolute inset-0
    bg-[radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1px)]
    bg-size-[24px_24px]"
  />
  <div className="relative z-10">{/* content */}</div>
</div>;

{
  /* Line grid */
}
<div
  className="absolute inset-0
  bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]
  bg-size-[48px_48px]"
/>;
```

---

## Hero Section

```tsx
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gray-950 px-6 py-32 text-center">
      {/* Glow */}
      <div
        className="absolute left-1/2 top-0 h-100px w-200px -translate-x-1/2
        rounded-full bg-indigo-500/15 blur-[120px]"
      />

      {/* Badge */}
      <div
        className="relative mb-6 inline-flex items-center gap-2 rounded-full
        border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/60"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
        Now in public beta
      </div>

      {/* Heading */}
      <h1
        className="relative mx-auto max-w-3xl text-5xl font-bold tracking-tight
        text-white md:text-7xl"
      >
        Ship products{" "}
        <span
          className="bg-linear-to-br from-indigo-400 to-cyan-400
          bg-clip-text text-transparent"
        >
          that scale
        </span>
      </h1>

      {/* Subheading */}
      <p className="relative mx-auto mt-6 max-w-xl text-lg text-white/50">
        The platform for modern teams. Build, deploy, and iterate at speed.
      </p>

      {/* CTA */}
      <div className="relative mt-10 flex items-center justify-center gap-4">
        <button
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium
          text-white shadow-[0_0_24px_rgba(99,102,241,0.35)]
          transition-all hover:bg-indigo-500 hover:shadow-[0_0_32px_rgba(99,102,241,0.5)]"
        >
          Get started free
        </button>
        <button className="text-sm text-white/50 transition-colors hover:text-white">
          Read the docs →
        </button>
      </div>
    </section>
  );
}
```

---

## Feature Card

```tsx
function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div
      className="group rounded-xl border border-white/60 bg-white/20 p-6
      transition-colors hover:border-white/10 hover:bg-white/40"
    >
      <div
        className="mb-4 inline-flex rounded-lg border border-white/10
        bg-white/5 p-2.5 text-indigo-400"
      >
        <Icon size={18} />
      </div>
      <h3 className="mb-2 text-sm font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-white/50">{description}</p>
    </div>
  );
}
```

---

## Fade-In Animation

```tsx
{/* globals.css */}
@keyframes fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-fade-up {
  animation: fade-up 0.5s ease forwards;
}

{/* Usage — stagger with delay */}
<div className="animate-fade-up [animation-delay:0ms]">...</div>
<div className="animate-fade-up [animation-delay:100ms]">...</div>
<div className="animate-fade-up [animation-delay:200ms]">...</div>
```

---

## Rules

- Dark background default: `bg-gray-950` o `bg-zinc-950` — never pure black `#000`
- Text on dark: `text-white` for headings, `text-white/60` for body, `text-white/40` for muted
- Border on dark: `border-white/10` standard, `border-white/[0.06]` for subtle elements
- Blur glow: `blur-[80px]` – `blur-[140px]` — never `blur-sm` for spotlight
- Transitions: always `transition-all` or `transition-colors` with implicit duration (150ms default Tailwind)
- Arbitrary values first: use `[background-image:...]` and `[background-size:...]` instead of `style={{}}`
- `style={{}}` only for **dynamic** values — come from props or runtime state, cannot be static arbitrary values
- Never use `!important`, never use inline styles for static values already expressible in Tailwind
