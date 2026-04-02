# SKILL: Forms

> Form state, validation, and submission patterns using react-hook-form + zod.
> For submission logic → `frontend/server-actions/SKILL.md`
> For input styling → `frontend/styling/SKILL.md`

---

## Stack

Always `react-hook-form` + `zod`. Never manage form state manually with `useState`.

---

## Base pattern

```typescript
// ✅ Schema defined outside the component — never inline
const profileSchema = z.object({
  name: z.string().min(2, 'Name too short'),
  email: z.string().email('Invalid email')
})

type ProfileFormValues = z.infer<typeof profileSchema>

function ProfileForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema)
  })

  const onSubmit = async (values: ProfileFormValues) => {
    const result = await updateProfile(values)
    if (result.error) toast.error('Update failed')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" {...register('name')} />
        {errors.name && <p>{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register('email')} />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting}>Save</button>
    </form>
  )
}
```

---

## Schema rules

- Define the Zod schema **outside** the component — never inline inside `useForm`
- Use the **same schema** for both client validation and server-side validation
- Export the schema from a shared `lib/validators/` file when used in a Server Action

```bash
lib/
└── validators/
    ├── user.ts      # profileSchema, createUserSchema
    └── auth.ts      # loginSchema, registerSchema
```

```typescript
// lib/validators/user.ts
export const profileSchema = z.object({
  name: z.string().min(2, "Name too short"),
  email: z.string().email(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
```

---

## Default values

Always provide `defaultValues` — avoids uncontrolled/controlled input warnings.

```typescript
useForm<ProfileFormValues>({
  resolver: zodResolver(profileSchema),
  defaultValues: {
    name: user.name,
    email: user.email,
  },
});
```

---

## Pending state

- Use `formState.isSubmitting` for async `onSubmit` handlers
- Use `useTransition` when calling a Server Action directly via `action` prop

```typescript
// ✅ With handleSubmit (async onSubmit)
<button type="submit" disabled={isSubmitting}>Save</button>

// ✅ With useTransition (Server Action via action prop)
<button type="submit" disabled={isPending}>Save</button>
```

---

## Rules

- Never use `useState` to track form fields — always `register`
- Always disable the submit button during submission
- Always show field-level error messages — never only a generic toast
- Always associate labels with inputs via `htmlFor` / `id`
