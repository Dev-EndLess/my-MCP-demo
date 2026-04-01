# SKILL: Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/) standard.

## Format

```bash
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

## Types

| Type       | When to use                              |
| ---------- | ---------------------------------------- |
| `feat`     | New feature                              |
| `fix`      | Bug fix                                  |
| `docs`     | Documentation only                       |
| `test`     | Adding or updating tests                 |
| `chore`    | Maintenance, deps, tooling               |
| `refactor` | Code change that is not a fix or feature |
| `perf`     | Performance improvement                  |
| `style`    | Formatting, whitespace — no logic change |
| `build`    | Build system or dependency changes       |
| `ci`       | CI/CD config changes                     |
| `revert`   | Reverts a previous commit                |

## Scope

Single word describing the area of change: `auth`, `api`, `dashboard`, `ui`, `db`, `config`, `deps`, `ci`.
Omit scope for changes that affect multiple areas.

## Subject Line Rules

- Imperative mood: `add`, `fix`, `remove` — not `added`, `fixing`
- Max 50 characters
- Lowercase — no capital first letter
- No period at the end

## Examples

```bash
feat(auth): add Google OAuth callback handler
fix(api): handle null response on missing user
refactor(ui): extract Button into shared component
chore(deps): upgrade next to 15.2.0
ci(actions): add lint step to PR workflow
test(auth): add unit tests for token validation
docs(readme): update installation instructions
```

## Body (optional)

Use when the _why_ is not obvious from the subject.
Separate from subject with a blank line. Wrap at 72 chars.

## Footer (optional)

- Breaking changes: `BREAKING CHANGE: <description>`
- Issue references: `Closes #42`, `Refs #17`

## Complex example

```bash
feat(auth): implement JWT-based authentication

Add complete auth system with login, logout, and token refresh.
Includes protected routes and refresh token mechanism.

Closes #42
```

## Anti-patterns

```bash
# ❌ Avoid
fix bug
added new feature
Update README.md
feat(auth): Add login.    # capital + period

# ✅ Correct
fix(dashboard): resolve layout shift on mobile
feat(auth): add user login flow
docs(readme): update installation guide
```

## Rules

- One logical change per commit — never bundle unrelated changes
- Never commit directly to `main` or `develop`
- Always suggest the commit message to the user before executing — never commit without confirmation
