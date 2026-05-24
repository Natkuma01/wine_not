# Wine Not - Quick Implementation Checklist

## PHASE 1: SE & Design (1-2 weeks)

### Security First
- [ ] **Input Validation** (3-4h) - Validators + serializer validation
- [ ] **Authorization** (4-5h) - Permissions + RestaurantUser model
- [ ] **CORS/CSRF** (1-2h) - Restrict origins, add CSRF tokens
- [ ] **Token Security** (2-3h) - Shorter JWT TTL, refresh rotation

### Then Efficiency
- [ ] **Service Layer** (5-6h) - Extract business logic from views
- [ ] **Component Decomposition** (4-5h) - Break 100+ line components
- [ ] **API Client** (2-3h) - Centralized axios instance
- [ ] **Caching** (3-4h) - Pagination + select_related()

---

## PHASE 2: Algorithms & DS (1-2 weeks)

### Security First
- [ ] **Rate Limiting** (2-3h) - Sliding window per IP/user
- [ ] **Permission Caching** (2-3h) - O(1) permission lookup

### Then Efficiency
- [ ] **N+1 Query Fix** (1-2h) - select_related/prefetch_related
- [ ] **Search/Filter Opt** (2-3h) - DB-level filtering + indexes
- [ ] **Analytics Opt** (3-4h) - Aggregate queries + cache
- [ ] **State Normalization** (3-4h) - Redux entity adapter
- [ ] **Selector Memoization** (2-3h) - Reselect library

---

## PHASE 3: Database (1-2 weeks)

### Security First
- [ ] **SQL Injection** (1-2h) - Audit + parameterized queries
- [ ] **Encryption at Rest** (2-3h) - Field-level encryption
- [ ] **Row Level Security** (2-3h) - PostgreSQL RLS policies

### Then Efficiency
- [ ] **Indexing** (2-3h) - Foreign keys + composite indexes
- [ ] **Pagination** (1-2h) - Cursor-based pagination
- [ ] **Materialized Views** (2-3h) - Pre-computed analytics
- [ ] **Redis Caching** (1-2h) - Query result caching
- [ ] **Connection Pooling** (30m) - Conn reuse settings

---

## Key Implementation Notes

### Phase 1 Implementation Order:
1. Authorization (blocks other security work)
2. Input Validation (blocks insecure data)
3. Service Layer (foundation for all logic)
4. CORS/CSRF (add to new response middleware)
5. Token Security (update JWT settings)
6. Component Decomposition (parallel with above)
7. API Client (use in new components)
8. Caching (integrate with API client)

### Phase 2 Implementation Order:
1. Rate Limiting (security)
2. N+1 Query Fix (foundation for all queries)
3. Permission Caching (built on auth from P1)
4. Search/Filter Opt (use N+1 fix + indexes)
5. Analytics Opt (builds on above)
6. Selector Memoization (parallel work)
7. State Normalization (parallel work)

### Phase 3 Implementation Order:
1. SQL Injection (audit only, quick)
2. Indexing (foundation; needed for pagination)
3. Row Level Security (database level)
4. Pagination (uses indexes)
5. Materialized Views (uses indexes)
6. Redis Caching (integration)
7. Connection Pooling (configuration)
8. Encryption at Rest (late stage)

---

## Testing Strategy

After each phase:
- [ ] Unit tests for new services/utilities
- [ ] Integration tests for API endpoints
- [ ] Performance tests (measure before/after)
- [ ] Security tests (OWASP top 10)

---

## Deployment Strategy

Phase 1 → Test in staging (1-2 days) → Deploy
Phase 2 → Test + performance benchmarks → Deploy
Phase 3 → Backup database + test recovery → Deploy

**Always backwards compatible** — no breaking API changes
