# SKILL: CI/CD, Husky & GitHub Actions

## Branch Naming Convention

Pattern: `{type}/{KEY}-{number}-{short-description}`
Replace `{KEY}` with your project key (e.g. Jira: `MD`, Linear: `ENG`, GitHub: `GH`)

### Allowed types

| Type       | When to use              |
| ---------- | ------------------------ |
| `feat`     | New features             |
| `fix`      | Bug fixes                |
| `refactor` | Code refactoring         |
| `docs`     | Documentation changes    |
| `test`     | Test-related changes     |
| `chore`    | Maintenance tasks        |
| `perf`     | Performance improvements |
| `style`    | Formatting changes       |
| `build`    | Build system changes     |
| `ci`       | CI/CD config changes     |
| `revert`   | Reverting changes        |

### Examples

```bash
# ✅ Valid
feat/KEY-1783-add-dashboard-layout
fix/KEY-657-resolve-api-timeout
chore/KEY-556-update-dependencies
ci/KEY-210-add-lint-step

# ❌ Invalid
feature-dashboard        # missing KEY number
fix-bug                  # missing KEY number
KEY-123-add-layout       # missing type prefix
feat/123-layout          # missing KEY prefix
feat/KEY-123             # missing description
```

---

## GitHub Actions Pipeline

Triggers: push to `main` / `develop`, PR to `main`

| Job            | Purpose                 | When             |
| -------------- | ----------------------- | ---------------- |
| `branch-check` | Validates branch naming | PR only          |
| `test`         | Unit tests + linting    | Always           |
| `e2e`          | End-to-end tests        | Always           |
| `build`        | Application build       | After tests pass |
| `deploy`       | Production deployment   | `main` only      |

---

## Husky Hooks

### Pre-commit

Runs `lint-staged` on staged files — blocks commit if any check fails.
Executes: `eslint --fix` → `prettier` → `tsc --noEmit`

### Pre-push

Runs full test suite — blocks push if tests fail.
Executes: `npm run test`

---

## Local Commands

### Testing

```bash
npm run test                   # run unit tests
npm run test -- --watch        # watch mode
npm run test -- --coverage     # with coverage (target: >80%)
npx playwright test            # run E2E tests
npx playwright test --ui       # E2E with UI mode
```

### Code Quality

```bash
npm run lint                   # ESLint check
npm run lint:fix               # auto-fix ESLint issues
npm run format                 # format with Prettier
npm run format:check           # check formatting
npm run type-check             # TypeScript check
```

---

## Rules

- Never push directly to `main` or `develop` — always open a PR
- All checks must pass before merging: lint, type-check, tests, build
- Never use `--force` push on shared branches
- Keep PRs small and focused — one feature or fix per PR
