# SKILL: Architecture — Backend

> Node.js/Express project structure, layering, and conventions.
> For API patterns (controllers, validation, errors) → `skills/api/SKILL.md`
> For frontend structure → `skills/architecture/frontend/SKILL.md`

## Backend Architecture (Node.js/Express)

A robust, layered architecture for a Node.js/Express backend, separating routing, business logic, and data access.

```bash
my-express-backend/
├── src/
│   ├── app.ts                      # Express app setup, global middlewares, routes mounting
│   ├── server.ts                   # Entry point (HTTP server start, DB init)
│   │
│   ├── config/                     # Configuration and environment variables parsing
│   │   ├── env.ts                  # Typed environment variables validation
│   │   └── database.ts             # DB connection setup
│   │
│   ├── api/                        # Presentation layer (HTTP)
│   │   ├── routes/                 # Express route definitions (e.g., user.routes.ts)
│   │   ├── controllers/            # Request handlers (extracts req/res, calls services)
│   │   └── middlewares/            # Custom middlewares (auth, role check, validation)
│   │
│   ├── core/                       # Domain / Business logic layer
│   │   ├── services/               # Core business rules (where the actual logic lives)
│   │   ├── models/                 # DB schema definitions (ORM/ODM models)
│   │   ├── dtos/                   # Data Transfer Objects & Validation schemas (Zod/Joi)
│   │   └── exceptions/             # Custom Error classes (AppError, NotFoundError, etc.)
│   │
│   ├── utils/                      # Helper utilities (logger, cryptography, formatters)
│   │
│   ├── types/                      # Global TypeScript definitions and type augmentations
│   │
│   └── tests/                      # Tests suite
│       ├── unit/                   # Unit tests (Services, Utils)
│       └── integration/            # Integration tests (Routes/Controllers)
│
├── .env.development
├── .env.production
├── .eslintrc.json
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

---

## BE Rules

- **Controllers should be thin**: Never write business logic in controllers. Extract req, res, and call a Service.
- **Fail early and centralized**: Use a global error handler middleware. Do not return `res.send(...)` inside try-catch blocks everywhere, pass errors via `next(error)`.
- **Validate all inputs**: Always validate `req.body`, `req.query`, and `req.params` at the route level using a schema library (e.g., Zod).
- **Environment variables**: Must be validated on startup (e.g., using a schema like Zod to ensure failure at boot if missing).
- **No cyclic dependencies**: Data access layer should not depend on services, services should not depend on controllers.

---
