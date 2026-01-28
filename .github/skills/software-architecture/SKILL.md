---
name: software-architecture
description: Guide for quality focused software architecture. This skill should be used when users want to write code, design architecture, analyze code, in any case that relates to software development. 
---

# Software Architecture Development Skill

This skill provides guidance for quality focused software development and architecture. It is based on Clean Architecture and Domain Driven Design principles.

## Code Style Rules

### General Principles

- **Early return pattern**: Always use early returns when possible, over nested conditions for better readability
- Avoid code duplication through creation of reusable functions and modules
- Decompose long (more than 80 lines of code) components and functions into multiple smaller components and functions. If they cannot be used anywhere else, keep it in the same file. But if file longer than 200 lines of code, it should be split into multiple files.
- Use arrow functions instead of function declarations when possible

### Best Practices

#### Library-First Approach

- **ALWAYS search for existing solutions before writing custom code**
  - Check npm for existing libraries that solve the problem
  - Evaluate existing services/SaaS solutions
  - Consider third-party APIs for common functionality
- Use libraries instead of writing your own utils or helpers. For example, use `cockatiel` instead of writing your own retry logic.
- **When custom code IS justified:**
  - Specific business logic unique to the domain
  - Performance-critical paths with special requirements
  - When external dependencies would be overkill
  - Security-sensitive code requiring full control
  - When existing solutions don't meet requirements after thorough evaluation

#### Architecture and Design

- **Clean Architecture & DDD Principles:**
  - Follow domain-driven design and ubiquitous language
  - Separate domain entities from infrastructure concerns
  - Keep business logic independent of frameworks
  - Define use cases clearly and keep them isolated
- **Naming Conventions:**
  - **AVOID** generic names: `utils`, `helpers`, `common`, `shared`
  - **USE** domain-specific names: `OrderCalculator`, `UserAuthenticator`, `InvoiceGenerator`
  - Follow bounded context naming patterns
  - Each module should have a single, clear purpose
- **Separation of Concerns:**
  - Do NOT mix business logic with UI components
  - Keep database queries out of controllers
  - Maintain clear boundaries between contexts
  - Ensure proper separation of responsibilities

#### Anti-Patterns to Avoid

- **NIH (Not Invented Here) Syndrome:**
  - Don't build custom auth when Auth0/Supabase exists
  - Don't write custom state management instead of using Redux/Zustand
  - Don't create custom form validation instead of using established libraries
- **Poor Architectural Choices:**
  - Mixing business logic with UI components
  - Database queries directly in controllers
  - Lack of clear separation of concerns
- **Generic Naming Anti-Patterns:**
  - `utils.js` with 50 unrelated functions
  - `helpers/misc.js` as a dumping ground
  - `common/shared.js` with unclear purpose
- Remember: Every line of custom code is a liability that needs maintenance, testing, and documentation

#### Code Quality

- Proper error handling with typed catch blocks
- Break down complex logic into smaller, reusable functions
- Avoid deep nesting (max 3 levels)
- Keep functions focused and under 50 lines when possible
- Keep files focused and under 200 lines of code when possible

## Dependency Management

### Choosing Dependencies

**Evaluation criteria:**
1. **Maintenance**: Last commit < 6 months, active issues/PRs
2. **Popularity**: Downloads, stars (social proof of stability)
3. **Size**: Bundle size impact (use bundlephobia.com)
4. **Type support**: Native TypeScript or @types available
5. **License**: MIT/Apache preferred, check compatibility

**Red flags:**
- No updates in 1+ year
- Single maintainer with no activity
- Excessive transitive dependencies
- Security vulnerabilities (npm audit)

### Version Strategy

```json
{
  "dependencies": {
    "react": "^18.2.0",     // Caret: minor updates OK
    "stripe": "~14.0.0"     // Tilde: patch updates only (payment-critical)
  }
}
```

- Use exact versions for critical dependencies (payments, auth)
- Use caret (^) for well-maintained libraries
- Lock file (package-lock.json) must be committed
- Regular `npm audit` and dependency updates

## Testing Strategy

### Test Pyramid

```
        /\
       /  \      E2E Tests (few)
      /----\     - Critical user journeys only
     /      \
    /--------\   Integration Tests (some)
   /          \  - API endpoints, database queries
  /------------\
 /              \ Unit Tests (many)
/----------------\ - Pure functions, business logic
```

### What to Test

| Layer | Test Type | Tools | Coverage Target |
|-------|-----------|-------|-----------------|
| Domain logic | Unit | Vitest/Jest | 90%+ |
| Use cases | Unit/Integration | Vitest + mocks | 80%+ |
| API endpoints | Integration | Supertest | 70%+ |
| UI components | Component | Testing Library | Critical paths |
| User flows | E2E | Playwright | Happy paths only |

### Testing Principles

- **Test behavior, not implementation**
- **Avoid mocking what you don't own** - wrap external dependencies
- **One assertion per test** when possible
- **Arrange-Act-Assert** pattern consistently
- **Test names describe behavior**: `should reject empty email`

<Good>
```typescript
// Testing behavior
test('should calculate total with tax', () => {
  const cart = createCart([
    { price: 100, quantity: 2 },
    { price: 50, quantity: 1 }
  ]);

  expect(cart.totalWithTax(0.1)).toBe(275); // (200 + 50) * 1.1
});
```
</Good>

<Bad>
```typescript
// Testing implementation
test('should call calculateSubtotal and applyTax', () => {
  const spy1 = jest.spyOn(cart, 'calculateSubtotal');
  const spy2 = jest.spyOn(cart, 'applyTax');
  cart.totalWithTax(0.1);
  expect(spy1).toHaveBeenCalled();
  expect(spy2).toHaveBeenCalledWith(0.1);
});
```
</Bad>

## Error Handling

### Error Types

```typescript
// Domain errors (expected, recoverable)
class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Infrastructure errors (unexpected, may retry)
class DatabaseError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'DatabaseError';
  }
}
```

### Result Pattern (preferred over throwing)

```typescript
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

const parseEmail = (input: string): Result<Email, ValidationError> => {
  if (!input.includes('@')) {
    return { ok: false, error: new ValidationError('email', 'Invalid format') };
  }
  return { ok: true, value: input as Email };
};

// Usage
const result = parseEmail(userInput);
if (!result.ok) {
  return handleError(result.error);
}
const email = result.value; // Type-safe
```

### Error Boundaries

- Validate at system boundaries (API input, user input)
- Let errors bubble up with context
- Catch at appropriate level (controller, not deep in logic)
- Log with correlation IDs for tracing

## Performance Considerations

### When to Optimize

1. **Measure first** - Profile before optimizing
2. **Set budgets** - Define acceptable thresholds
3. **Optimize hot paths** - Focus on frequently executed code
4. **Avoid premature optimization** - Clarity over cleverness

### Common Optimizations

| Problem | Solution |
|---------|----------|
| N+1 queries | Batch loading, DataLoader pattern |
| Large payloads | Pagination, field selection |
| Repeated computation | Memoization, caching |
| Slow renders | React.memo, useMemo, virtualization |
| Bundle size | Code splitting, tree shaking |

### Caching Strategy

```typescript
// Cache hierarchy
// 1. In-memory (fastest, per-instance)
const cache = new Map<string, User>();

// 2. Distributed (shared, Redis)
await redis.setex(`user:${id}`, 3600, JSON.stringify(user));

// 3. HTTP caching (CDN, browser)
res.setHeader('Cache-Control', 'public, max-age=3600');
```

## Security Principles

### Input Validation

- **Validate all external input** at system boundaries
- **Whitelist over blacklist** - specify what's allowed
- **Type coercion is dangerous** - use strict parsing

```typescript
// Use schema validation (zod, yup)
const CreateUserSchema = z.object({
  email: z.string().email(),
  age: z.number().int().min(0).max(150),
  role: z.enum(['user', 'admin'])
});

const parsed = CreateUserSchema.safeParse(req.body);
if (!parsed.success) {
  return res.status(400).json({ errors: parsed.error.issues });
}
```

### Common Vulnerabilities to Prevent

| Vulnerability | Prevention |
|---------------|------------|
| SQL Injection | Parameterized queries, ORMs |
| XSS | Output encoding, CSP headers |
| CSRF | CSRF tokens, SameSite cookies |
| Auth bypass | Centralized auth middleware |
| Secrets exposure | Environment variables, secret managers |

### Secrets Management

- **Never commit secrets** to version control
- Use environment variables or secret managers
- Rotate secrets regularly
- Different secrets per environment

## API Design

### RESTful Conventions

```
GET    /users          # List users
GET    /users/:id      # Get single user
POST   /users          # Create user
PUT    /users/:id      # Replace user
PATCH  /users/:id      # Partial update
DELETE /users/:id      # Delete user
```

### Response Format

```typescript
// Success
{
  "data": { "id": "123", "name": "John" },
  "meta": { "requestId": "abc-123" }
}

// Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [{ "field": "email", "message": "Must contain @" }]
  },
  "meta": { "requestId": "abc-123" }
}
```

### Pagination

```typescript
// Cursor-based (preferred for large datasets)
GET /users?cursor=abc123&limit=20

// Offset-based (simpler, but slower for large offsets)
GET /users?page=5&limit=20
```

## Documentation

### Code Comments

- **Comment WHY, not WHAT** - code shows what, comments explain why
- **Document public APIs** - JSDoc for exported functions
- **Update comments with code** - stale comments are worse than none

<Good>
```typescript
/**
 * Calculates shipping cost based on weight and destination.
 * Uses tiered pricing: first 5kg at base rate, then $2/kg after.
 *
 * @param weightKg - Package weight in kilograms
 * @param zone - Shipping zone (1-5, higher = farther)
 * @returns Shipping cost in cents
 */
const calculateShipping = (weightKg: number, zone: number): number => {
  // Zone multiplier accounts for fuel surcharges in distant regions
  const zoneMultiplier = 1 + (zone - 1) * 0.15;
  // ...
};
```
</Good>

<Bad>
```typescript
// Calculate shipping
const calculateShipping = (w: number, z: number): number => {
  // Multiply by zone
  const m = 1 + (z - 1) * 0.15;
  // Add 2 for each kg over 5
  // ...
};
```
</Bad>

### Architecture Documentation

- **README.md**: Setup, running, deployment
- **ARCHITECTURE.md**: High-level design decisions
- **ADR/**: Architecture Decision Records for significant choices
- **API docs**: OpenAPI/Swagger for REST APIs

## Quick Reference

### File Organization

```
src/
├── domain/           # Business logic, entities
│   ├── user/
│   │   ├── User.ts
│   │   ├── UserRepository.ts (interface)
│   │   └── UserService.ts
│   └── order/
├── application/      # Use cases, orchestration
│   ├── CreateOrderUseCase.ts
│   └── GetUserOrdersUseCase.ts
├── infrastructure/   # External concerns
│   ├── database/
│   ├── http/
│   └── repositories/ # Repository implementations
└── presentation/     # UI, API controllers
    ├── api/
    └── web/
```

### Decision Checklist

Before implementing, ask:

- [ ] Does a library already solve this?
- [ ] Is this the simplest solution that works?
- [ ] Can I test this easily?
- [ ] Is the naming domain-specific?
- [ ] Are concerns properly separated?
- [ ] Is error handling appropriate?
- [ ] Are security implications considered?
