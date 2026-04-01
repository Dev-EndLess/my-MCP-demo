# Zustand

Standard for global client state. Use when state is shared across multiple components and is not server data, form data, or URL state. See [`state/SKILL.md`](../SKILL.md) for the full decision table.

## Store Structure

### Flat store (simple apps)

```ts
// store/useUIStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface UIState {
  sidebarOpen: boolean;
  activeModal: string | null;
  toggleSidebar: () => void;
  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      sidebarOpen: true,
      activeModal: null,
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      openModal: (id) => set({ activeModal: id }),
      closeModal: () => set({ activeModal: null }),
    }),
    { name: "ui-store" },
  ),
);

// Named selector hooks — export these, not the raw store
export const useSidebarOpen = () => useUIStore((s) => s.sidebarOpen);
export const useActiveModal = () => useUIStore((s) => s.activeModal);
```

### Slice pattern (medium-large apps)

Split into domain slices, compose into one store:

```ts
// store/slices/authSlice.ts
import { StateCreator } from "zustand";
import type { StoreState } from "../index";

export interface AuthSlice {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const createAuthSlice: StateCreator<StoreState, [], [], AuthSlice> = (
  set,
) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
});
```

```ts
// store/index.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createAuthSlice, AuthSlice } from "./slices/authSlice";
import { createUISlice, UISlice } from "./slices/uiSlice";

export type StoreState = AuthSlice & UISlice;

export const useStore = create<StoreState>()(
  devtools(
    (...args) => ({
      ...createAuthSlice(...args),
      ...createUISlice(...args),
    }),
    { name: "app-store" },
  ),
);

// Selector hooks per domain
export const useUser = () => useStore((s) => s.user);
export const useIsAuthenticated = () => useStore((s) => s.isAuthenticated);
```

## Persist Middleware

Use only for data that must survive page refresh (theme, preferences, cart):

```ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const usePreferencesStore = create<PreferencesState>()(
  devtools(
    persist(
      (set) => ({
        theme: "light" as "light" | "dark",
        language: "en",
        setTheme: (theme) => set({ theme }),
      }),
      {
        name: "user-preferences", // localStorage key
        partialize: (state) => ({
          theme: state.theme,
          language: state.language,
        }), // persist only data, not actions
      },
    ),
    { name: "preferences-store" },
  ),
);
```

## Reset Pattern

Always provide a reset action — required for logout, test teardown, wizard cancel:

```ts
const initialState = {
  user: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      ...initialState,
      setUser: (user) => set({ user, isAuthenticated: true }),
      reset: () => set(initialState),
    }),
    { name: "auth-store" },
  ),
);

// On logout
const reset = useAuthStore((s) => s.reset);
reset();
```

## Selective Subscriptions

Always subscribe to the minimum slice needed. Prevents unnecessary re-renders.

```ts
// ✅ subscribes only to user — re-renders only when user changes
const user = useStore((s) => s.user);

// ❌ subscribes to entire store — re-renders on any state change
const { user, sidebarOpen, activeModal } = useStore();
```

For multiple values, use `useShallow` to avoid reference inequality:

```ts
import { useShallow } from "zustand/react/shallow";

const { user, isAuthenticated } = useStore(
  useShallow((s) => ({ user: s.user, isAuthenticated: s.isAuthenticated })),
);
```

## TypeScript Rules

- Always define a typed interface for each store/slice — no `any`
- Actions are part of the interface, not separate
- Use `StateCreator<StoreState, [], [], SliceType>` for slices

```ts
// ✅
interface AuthSlice {
  user: User | null;
  setUser: (user: User) => void;
}

// ❌
const useStore = create((set) => ({
  user: null,
  setUser: (u: any) => set({ user: u }),
}));
```

## File Conventions

```ts
store/
├── index.ts              # composed store + selector hooks (slice pattern)
├── useUIStore.ts         # standalone store (flat pattern)
├── usePreferencesStore.ts
└── slices/
    ├── authSlice.ts
    └── uiSlice.ts
```

- One store per domain concern — `useAuthStore`, `useUIStore`, `useCartStore`
- Export named selector hooks alongside the store: `export const useUser = () => useStore(s => s.user)`
- Never import the raw store in components — use selector hooks

## Middleware Order

Order matters. Always: `devtools` outermost, `persist` inside:

```ts
// ✅
create()(devtools(persist(...)))

// ❌ inverted — devtools won't track persisted rehydration
create()(persist(devtools(...)))
```

## Anti-Patterns

| Anti-pattern                          | Why                                                  | Fix                                      |
| ------------------------------------- | ---------------------------------------------------- | ---------------------------------------- |
| Server data in Zustand                | Duplicates React Query cache, causes stale data      | Use React Query                          |
| Storing derived values                | Computed state goes stale                            | Compute inline or use selectors          |
| Destructuring entire store            | Subscribes to all state                              | Use granular selectors                   |
| One god store with all domains        | Hard to maintain, every change re-renders everything | Split into domain stores or slices       |
| Actions that call `useStore()` inside | Hook rules violation                                 | Pass values via args or use `getState()` |
| `persist` on actions                  | Serializes functions                                 | Use `partialize` to persist only data    |

## Combining with React Query

Zustand handles **client state**, React Query handles **server state**. Never mix:

```ts
// ✅ Clean separation
function Dashboard() {
  const sidebarOpen = useSidebarOpen(); // Zustand — UI state
  const { data: projects } = useProjects(); // React Query — server data
  const user = useUser(); // Zustand — auth user (set at login)
}

// ❌ Storing fetched data in Zustand
const useProjectsStore = create((set) => ({
  projects: [],
  fetchProjects: async () => {
    const data = await api.getProjects();
    set({ projects: data }); // now you've reinvented React Query, badly
  },
}));
```
