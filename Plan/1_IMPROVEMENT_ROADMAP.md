# Wine Not - 4-6 Week Improvement Roadmap
## Security → Efficiency Focus (Practical Implementation)

---

# PHASE 1: SOFTWARE ENGINEERING & DESIGN (1-2 weeks)
## Focus: Security First, Then Efficiency

### SECURITY IMPROVEMENTS

#### 1.1 Input Validation & Sanitization (HIGH PRIORITY)
**Current Risk**: No validation layer; SQL injection, XSS, and invalid data risks

**Changes**:
- Backend: Add `validators.py` in each Django app
  - Wine: Validate name (no SQL keywords), producer, country, year (1000-9999), region
  - Inventory: Validate quantities (positive), prices (positive, 2 decimals max)
  - Restaurant: Validate name, address (no scripts), email
  - Create serializer validators (DRF built-in)
  
- Frontend: Implement form validation before API calls
  - Zod/Yup schema validation for all forms
  - Client-side error messages prevent invalid submissions
  - Sanitize user inputs (remove HTML/scripts)

**Effort**: 3-4 hours | **Impact**: Blocks 60% of injection attacks

---

#### 1.2 Authorization & Permissions (HIGH PRIORITY)
**Current Risk**: Any authenticated user can access all restaurants (no multi-tenant isolation)

**Changes**:
- Backend: Implement Django Permissions + Custom Permission Classes
  - `CanViewRestaurant`: User can only view their assigned restaurants
  - `CanModifyInventory`: User can only modify inventory at their restaurants
  - Add `RestaurantUser` model to track user↔restaurant relationships
  - Permission checks in views before data access
  
- Frontend: Role-based UI rendering
  - Check user permissions before showing edit/delete buttons
  - Redirect unauthorized access attempts to 403 page

**Effort**: 4-5 hours | **Impact**: Prevents unauthorized data access

---

#### 1.3 CORS & CSRF Protection (MEDIUM PRIORITY)
**Current Risk**: CORS headers allow any origin; CSRF tokens missing

**Changes**:
- Backend `settings.py`:
  - Restrict CORS to known frontend origins (not `*`)
  - Enable CSRF middleware (already in Django, verify config)
  - Add CSRF token to API responses
  
- Frontend:
  - Extract CSRF token from cookies/headers
  - Include in all state-changing requests (POST, PUT, DELETE)

**Effort**: 1-2 hours | **Impact**: Prevents cross-site attacks

---

#### 1.4 API Response Security (MEDIUM PRIORITY)
**Current Risk**: No standardized error responses; leaks sensitive info

**Changes**:
- Backend: Create middleware for response standardization
  ```
  Success: { success: true, data: {...}, timestamp }
  Error: { success: false, error: { code, message }, timestamp }
  ```
  - Hide stack traces in production
  - Log errors server-side only
  - Return generic messages to frontend
  
- Remove sensitive fields from serializers (e.g., password hashes if any)

**Effort**: 2-3 hours | **Impact**: Prevents information leakage

---

#### 1.5 Password & Token Security (MEDIUM PRIORITY)
**Current Risk**: JWT tokens lack expiration configs; no refresh token rotation

**Changes**:
- Backend `settings.py`:
  - Set JWT `ACCESS_TOKEN_LIFETIME = 15 minutes` (currently likely too long)
  - Set JWT `REFRESH_TOKEN_LIFETIME = 7 days` with rotation policy
  - Enable token blacklist on logout
  
- Frontend:
  - Implement refresh token rotation on each refresh
  - Clear tokens on logout (already done)
  - Store tokens securely (HttpOnly cookies if possible, else localStorage with short TTL)

**Effort**: 2-3 hours | **Impact**: Limits token hijacking window

---

### EFFICIENCY IMPROVEMENTS

#### 1.6 API Response Standardization & Caching (MEDIUM PRIORITY)
**Current Risk**: Over-fetching data; no query optimization

**Changes**:
- Backend:
  - Add `django-filter` for query optimization (filter restaurants, wines by type)
  - Implement `select_related()` / `prefetch_related()` in views
  - Add pagination (20 items per page) instead of fetching all
  
- Frontend:
  - Cache GET responses in Redux (avoid redundant API calls)
  - Add query parameters for filtering/pagination
  - Implement request deduplication

**Effort**: 3-4 hours | **Impact**: 40-50% fewer API calls

---

#### 1.7 Service Layer & Business Logic (MEDIUM PRIORITY)
**Current Risk**: Business logic in views; duplicated code across endpoints

**Changes**:
- Backend: Create `services.py` in each app
  - `WineService`: add_wine_with_validation(), validate_wine_availability()
  - `InventoryService`: calculate_profit_margin(), check_low_stock()
  - `RestaurantService`: get_restaurant_wines_with_inventory()
  - Views call services → services handle DB queries + validation
  
- Benefits: Reusable, testable, single source of truth

**Effort**: 5-6 hours | **Impact**: 30% code reduction, easier maintenance

---

#### 1.8 Frontend: Component Decomposition (MEDIUM PRIORITY)
**Current Risk**: 100-200 line components; hard to test/maintain

**Changes**:
- Break large components into smaller ones:
  - `WineList.jsx` → `WineListContainer.jsx` + `WineTable.jsx` + `AddWineForm.jsx` + `WineFilters.jsx`
  - `InventoryList.jsx` → `InventoryListContainer.jsx` + `InventoryTable.jsx` + `PriceCalculator.jsx` + `WineInfoForm.jsx`
  
- Create shared components (`src/components/shared/`):
  - `FormInput.jsx`, `FormSelect.jsx`, `Modal.jsx`, `ConfirmDialog.jsx`, `LoadingSpinner.jsx`, `ErrorAlert.jsx`

**Effort**: 4-5 hours | **Impact**: 35% code reduction, easier debugging

---

#### 1.9 Centralized API Client (EASY)
**Current Risk**: API calls scattered across Redux slices; no error/auth interceptor

**Changes**:
- Create `src/app/apiClient.js`:
  - Axios instance with base URL, headers
  - Request interceptor: Add auth token to all requests
  - Response interceptor: Handle 401 (refresh token), 403 (redirect), 5xx (retry logic)
  - Error handler: Standardized error messages
  
- Update Redux slices to use centralized client

**Effort**: 2-3 hours | **Impact**: Centralized error handling, automatic auth refresh

---

### PHASE 1 SUMMARY TABLE

| Item | Security | Efficiency | Effort | Impact |
|------|----------|-----------|--------|---------|
| 1.1 Input Validation | ⭐⭐⭐ | ⭐ | 3-4h | High |
| 1.2 Authorization | ⭐⭐⭐ | ⭐ | 4-5h | High |
| 1.3 CORS/CSRF | ⭐⭐ | ⭐ | 1-2h | High |
| 1.4 API Response Security | ⭐⭐ | ⭐⭐ | 2-3h | Medium |
| 1.5 Token Security | ⭐⭐⭐ | ⭐ | 2-3h | Medium |
| 1.6 Caching & Pagination | ⭐ | ⭐⭐⭐ | 3-4h | High |
| 1.7 Service Layer | ⭐⭐ | ⭐⭐ | 5-6h | High |
| 1.8 Component Decomposition | ⭐ | ⭐⭐ | 4-5h | Medium |
| 1.9 API Client | ⭐ | ⭐⭐ | 2-3h | Medium |

**Total Effort**: 26-35 hours | **Recommended**: Pick top 6-7 items for 1-2 weeks

---

# PHASE 2: ALGORITHMS & DATA STRUCTURES (1-2 weeks)
## Focus: Security First, Then Efficiency

### SECURITY IMPROVEMENTS

#### 2.1 Efficient Permission Checking Algorithm (MEDIUM PRIORITY)
**Current Risk**: Linear scanning of permissions on every request; potential DoS

**Changes**:
- Backend: Optimize permission queries
  - Use Django's `@cache_result(timeout=300)` for user→restaurant mappings
  - Build permission matrix at login; cache for session
  - Algorithm: O(1) lookup instead of O(n) DB query
  
- Example: Instead of querying DB each time, store in memory:
  ```
  user_permissions = {
    'restaurant_123': ['view', 'edit'],
    'wine_456': ['view']
  }
  ```

**Effort**: 2-3 hours | **Impact**: Prevents permission-check DoS

---

#### 2.2 Efficient Password Hashing Algorithm (EASY)
**Current Risk**: Django default is good, but verify it's not disabled

**Changes**:
- Backend `settings.py`:
  - Verify PASSWORD_HASHERS uses PBKDF2 or Argon2 (not MD5)
  - If using default, set `PASSWORD_HASH_ALGORITHM_TIME_COST = 180000` (milliseconds)
  - Consider Argon2 for brute-force resistance
  
- No code changes; config only

**Effort**: 30 mins | **Impact**: Brute-force resistant

---

#### 2.3 Rate Limiting Algorithm (MEDIUM PRIORITY)
**Current Risk**: No rate limiting; brute-force attacks possible on login/API

**Changes**:
- Backend: Implement sliding-window rate limiter
  - `django-ratelimit` or `djangorestframework-throttling`
  - Login endpoint: 5 attempts/minute per IP
  - API endpoints: 100 requests/minute per authenticated user
  - Algorithm: Redis-backed sliding window (O(log n) complexity)

**Effort**: 2-3 hours | **Impact**: Blocks brute-force & DoS attacks

---

### EFFICIENCY IMPROVEMENTS

#### 2.4 Profit Margin Calculation Optimization (EASY)
**Current Risk**: Recalculating profit margin on every keystroke (frontend)

**Changes**:
- Frontend: Memoize calculation function
  ```javascript
  const calculateProfitMargin = useMemo(() => 
    (buying, selling) => (((selling - buying) / selling) * 100).toFixed(2),
    []
  )
  ```
  - Prevents recalculation if inputs unchanged
  - Algorithm: O(1) with memoization
  
- Backend: Add `profit_margin` computed field in Inventory model
  - Calculate once on save, don't recalculate every read
  - Algorithm: O(1) cached value instead of O(1) computation per request

**Effort**: 1-2 hours | **Impact**: Smoother UI performance

---

#### 2.5 Search & Filter Algorithm Optimization (MEDIUM PRIORITY)
**Current Risk**: Frontend filters all wines in memory; O(n) per filter

**Changes**:
- Backend: Implement database-level filtering
  - Use Django ORM filters: `Wine.objects.filter(wine_type='red', country='France')`
  - Database indexes on `wine_type`, `country`, `restaurant_id`
  - Algorithm: O(log n) with B-tree indexes
  
- Frontend: Remove client-side filtering; fetch filtered data from API
  - Pass filter params to API: `/api/wines/?type=red&country=France`
  - Results pagination (20 per page): O(1) constant page size

**Effort**: 2-3 hours | **Impact**: Handles 10,000+ wines efficiently

---

#### 2.6 Inventory Query Optimization (MEDIUM PRIORITY)
**Current Risk**: N+1 queries; fetching wine details for each inventory item

**Changes**:
- Backend: Single optimized query
  ```python
  # Before (N+1): 1 query for inventories + 1 query per wine = N queries
  inventories = Inventory.objects.all()
  
  # After: Single query with joins
  inventories = Inventory.objects.select_related('wine', 'restaurant').all()
  ```
  - Algorithm: O(n) instead of O(n²)
  - Use `prefetch_related()` for Many-to-Many (wine.grapes)
  
- Update serializers to use `select_related` hints

**Effort**: 1-2 hours | **Impact**: 50-70% faster list views

---

#### 2.7 Redux Selector Memoization (EASY)
**Current Risk**: Redux selectors compute on every render; unnecessary re-renders

**Changes**:
- Frontend: Use `reselect` library for memoized selectors
  ```javascript
  export const selectWinesByRestaurant = createSelector(
    [state => state.wines, state => state.restaurants],
    (wines, restaurants) => wines.filter(w => w.restaurant_id === restaurants[0].id)
  )
  ```
  - Only recomputes if input selectors change
  - Algorithm: O(1) memoized cache vs O(n) filter on every render
  
- Apply to frequently used selectors (wine list, inventory totals)

**Effort**: 2-3 hours | **Impact**: 30-40% fewer component re-renders

---

#### 2.8 Analytics Query Optimization (MEDIUM PRIORITY)
**Current Risk**: Analytics dashboard may query entire database

**Changes**:
- Backend: Pre-compute analytics with efficient queries
  - `GET /api/analytics/restaurant/:id/summary` returns:
    - Total wines: COUNT(*)
    - Total inventory value: SUM(quantity * selling_price)
    - Low stock items: WHERE quantity < 5
  - Use database aggregations, not Python loops
  - Algorithm: O(1) aggregate queries instead of O(n) in Python
  
- Cache results for 1 hour: `@cache_result(timeout=3600)`

**Effort**: 3-4 hours | **Impact**: Dashboard loads in <500ms

---

#### 2.9 Frontend State Management Efficiency (EASY)
**Current Risk**: Redux store may hold duplicate data; entire store updates on single item change

**Changes**:
- Normalize Redux state structure
  ```javascript
  // Before: Array of full objects (duplicates, waste)
  wines: [{ id: 1, name: 'Wine A', restaurant: { id: 1, name: 'Rest A' } }, ...]
  
  // After: Normalized (single source of truth)
  wines: { byId: { 1: { id: 1, name: 'Wine A', restaurant_id: 1 }, ... }, allIds: [1, 2, ...] }
  restaurants: { byId: { 1: { id: 1, name: 'Rest A' }, ... }, allIds: [1, ...] }
  ```
  - Algorithm: O(1) updates instead of O(n) array searches
  - Smaller payload size; faster serialization
  
- Use Redux Toolkit's `createEntityAdapter()` for this

**Effort**: 3-4 hours | **Impact**: 50% smaller store, faster updates

---

### PHASE 2 SUMMARY TABLE

| Item | Security | Efficiency | Effort | Impact |
|------|----------|-----------|--------|---------|
| 2.1 Permission Caching | ⭐⭐ | ⭐⭐ | 2-3h | Medium |
| 2.2 Password Hashing | ⭐⭐ | ⭐ | 30m | Low |
| 2.3 Rate Limiting | ⭐⭐⭐ | ⭐⭐ | 2-3h | High |
| 2.4 Margin Calc Memoization | ⭐ | ⭐⭐⭐ | 1-2h | Medium |
| 2.5 Search/Filter Optimization | ⭐ | ⭐⭐⭐ | 2-3h | High |
| 2.6 N+1 Query Fix | ⭐ | ⭐⭐⭐ | 1-2h | High |
| 2.7 Selector Memoization | ⭐ | ⭐⭐ | 2-3h | Medium |
| 2.8 Analytics Optimization | ⭐ | ⭐⭐⭐ | 3-4h | High |
| 2.9 State Normalization | ⭐ | ⭐⭐ | 3-4h | Medium |

**Total Effort**: 17-27 hours | **Recommended**: Pick top 6-7 items for 1-2 weeks

---

# PHASE 3: DATABASE (1-2 weeks)
## Focus: Security First, Then Efficiency

### SECURITY IMPROVEMENTS

#### 3.1 SQL Injection Prevention (HIGH PRIORITY)
**Current Risk**: Low (using Django ORM), but raw queries possible

**Changes**:
- Audit all custom SQL queries (grep for `raw()`, `cursor.execute()`)
- Replace with ORM queries where possible
- If raw SQL needed: Use parameterized queries
  ```python
  # Bad (vulnerable)
  query = f"SELECT * FROM wines WHERE name = '{user_input}'"
  
  # Good (safe)
  Wine.objects.raw('SELECT * FROM wines WHERE name = %s', [user_input])
  ```
  - Always use `%s` placeholders, not string formatting

**Effort**: 1-2 hours | **Impact**: Eliminates SQL injection

---

#### 3.2 Data Encryption at Rest (MEDIUM PRIORITY)
**Current Risk**: Sensitive fields (prices, quantities) stored in plaintext

**Changes**:
- Backend: Add field-level encryption for sensitive data
  - Use `django-encrypted-model-fields` or `cryptography` library
  - Encrypt: `selling_price`, `buying_price` in Inventory
  - Encrypt: Wine notes, restaurant addresses
  - Store encryption key in environment variables, not code
  
- Database: Already using SQLite; upgrade to PostgreSQL for production
  - PostgreSQL supports transparent encryption with pgcrypto extension

**Effort**: 2-3 hours | **Impact**: Protects compromised database

---

#### 3.3 Database Backup & Recovery (MEDIUM PRIORITY)
**Current Risk**: No backup strategy; data loss = critical

**Changes**:
- Production database:
  - Automated daily backups (AWS RDS automated backups if migrating)
  - Store backups in separate region/service (S3)
  - Test recovery process monthly
  
- Development: Anonymize dumps before committing (no real data in repo)
- Retention policy: Keep 30-day rolling backups

**Effort**: 1-2 hours setup + 30 mins monthly testing | **Impact**: Disaster recovery

---

#### 3.4 Row-Level Security (MEDIUM PRIORITY)
**Current Risk**: Multi-tenant data isolation relies on application layer only

**Changes**:
- Database level (PostgreSQL):
  - Enable Row Level Security (RLS) policies
  - Each user/role can only access rows matching their restaurant_id
  - Fallback if application layer bypassed
  
- Example:
  ```sql
  CREATE POLICY user_restaurants ON inventories
  FOR SELECT USING (restaurant_id IN (SELECT restaurant_id FROM restaurant_users WHERE user_id = current_user_id))
  ```

**Effort**: 2-3 hours | **Impact**: Defense-in-depth data isolation

---

### EFFICIENCY IMPROVEMENTS

#### 3.5 Database Indexing Strategy (HIGH PRIORITY)
**Current Risk**: No indexes; full table scans on every query

**Changes**:
- Backend: Add indexes to frequently queried columns
  ```python
  class Inventory(models.Model):
      wine = models.ForeignKey(..., db_index=True)  # Add index
      restaurant = models.ForeignKey(..., db_index=True)  # Add index
      quantity = models.IntegerField(db_index=True)  # Filter by quantity
      
      class Meta:
          indexes = [
              models.Index(fields=['restaurant', 'wine']),  # Composite index
              models.Index(fields=['restaurant', '-quantity']),  # For sorting
          ]
  ```
  - Query performance: O(n) → O(log n)
  - Especially important when wines/inventories reach 1,000+
  
- Monitor slow queries: Enable Django debug toolbar, use `django-silk`

**Effort**: 2-3 hours | **Impact**: 10-100x faster queries for large datasets

---

#### 3.6 Query Result Pagination (MEDIUM PRIORITY)
**Current Risk**: Fetching 1,000+ rows = large payload, slow rendering

**Changes**:
- Backend: Implement cursor-based pagination
  ```python
  # List view with pagination
  class InventoryViewSet(ModelViewSet):
      queryset = Inventory.objects.all()
      pagination_class = CursorPagination
      page_size = 20
  ```
  - Request: `GET /api/inventories/?limit=20&offset=0`
  - Response: `{ results: [...], next: URL, previous: URL }`
  
- Frontend: Load more on scroll or pagination buttons
  - Algorithm: O(1) constant page size vs O(n) unbounded

**Effort**: 1-2 hours | **Impact**: 80% smaller payloads, 5-10x faster initial load

---

#### 3.7 Connection Pooling (EASY)
**Current Risk**: Creating new DB connection per request; overhead

**Changes**:
- Backend `settings.py`:
  ```python
  DATABASES = {
      'default': {
          'ENGINE': 'django.db.backends.postgresql',
          'CONN_MAX_AGE': 600,  # Reuse connections for 10 mins
          'OPTIONS': {
              'connect_timeout': 10,
          }
      }
  }
  ```
  - Connection overhead: ~100ms per connection
  - Reuse: ~1ms
  - Algorithm: O(1) vs O(n) connections for concurrent requests

**Effort**: 30 mins | **Impact**: 90% faster concurrent requests

---

#### 3.8 Denormalization & Materialized Views (MEDIUM PRIORITY)
**Current Risk**: Complex joins for analytics; slow aggregation queries

**Changes**:
- Database: Create materialized view for analytics
  ```sql
  CREATE MATERIALIZED VIEW restaurant_analytics AS
  SELECT 
    r.id,
    COUNT(DISTINCT i.wine_id) as total_wines,
    SUM(i.quantity) as total_quantity,
    SUM(i.quantity * i.selling_price) as inventory_value
  FROM restaurants r
  LEFT JOIN inventories i ON r.id = i.restaurant_id
  GROUP BY r.id;
  ```
  - Refresh daily: `REFRESH MATERIALIZED VIEW restaurant_analytics`
  - Query performance: O(1) lookup vs O(n) computation
  
- Backend: Query view instead of computing
  ```python
  @api_view(['GET'])
  def analytics_summary(request):
      stats = RestaurantAnalytics.objects.get(restaurant_id=request.user.restaurant_id)
      return Response(stats.__dict__)
  ```

**Effort**: 2-3 hours | **Impact**: Analytics dashboard <100ms query time

---

#### 3.9 Archive Old Data (MEDIUM PRIORITY)
**Current Risk**: Database grows infinitely; old data slows down queries

**Changes**:
- Strategy: Archive inventory transactions older than 1 year
  - Create `archive_database` or `s3_archive` for historical data
  - Keep active (current year) in main DB
  - Queries on active DB: ~10x faster
  
- Backend task (Celery/cron):
  ```python
  # Run monthly
  Inventory.objects.filter(created_at__lt=one_year_ago).archive()
  ```

**Effort**: 2-3 hours | **Impact**: Keeps main DB performant as it grows

---

#### 3.10 Query Caching Layer (REDIS) (EASY)
**Current Risk**: Same queries repeated; no caching

**Changes**:
- Backend: Add Redis caching
  ```python
  from django.core.cache import cache
  
  def get_wines(restaurant_id):
      key = f'wines_restaurant_{restaurant_id}'
      wines = cache.get(key)
      if wines is None:
          wines = Wine.objects.filter(restaurant_id=restaurant_id)
          cache.set(key, wines, timeout=300)  # 5 min cache
      return wines
  ```
  - Invalidate on write: `cache.delete(key)` when wine added/updated
  - Algorithm: O(1) cache hit vs O(n) DB query
  
- Frontend: Redux cache already handles some caching

**Effort**: 1-2 hours | **Impact**: 90% hit rate for repeated queries

---

### PHASE 3 SUMMARY TABLE

| Item | Security | Efficiency | Effort | Impact |
|------|----------|-----------|--------|---------|
| 3.1 SQL Injection | ⭐⭐⭐ | ⭐ | 1-2h | High |
| 3.2 Encryption at Rest | ⭐⭐⭐ | ⭐ | 2-3h | High |
| 3.3 Backup & Recovery | ⭐⭐ | ⭐ | 1-2h | Medium |
| 3.4 Row Level Security | ⭐⭐⭐ | ⭐ | 2-3h | High |
| 3.5 Indexing | ⭐ | ⭐⭐⭐ | 2-3h | High |
| 3.6 Pagination | ⭐ | ⭐⭐⭐ | 1-2h | High |
| 3.7 Connection Pooling | ⭐ | ⭐⭐ | 30m | Medium |
| 3.8 Materialized Views | ⭐ | ⭐⭐⭐ | 2-3h | High |
| 3.9 Archive Old Data | ⭐ | ⭐⭐ | 2-3h | Medium |
| 3.10 Redis Caching | ⭐ | ⭐⭐⭐ | 1-2h | High |

**Total Effort**: 15-24 hours | **Recommended**: Pick top 6-7 items for 1-2 weeks

---

# OVERALL 6-WEEK ROADMAP

## Week 1-2: Software Engineering & Design
- ✅ Input Validation (3-4h)
- ✅ Authorization (4-5h)
- ✅ CORS/CSRF (1-2h)
- ✅ Service Layer (5-6h)
- ✅ Component Decomposition (4-5h)
- ✅ API Client (2-3h)
**Subtotal**: 19-25 hours

## Week 3-4: Algorithms & Data Structures
- ✅ Rate Limiting (2-3h)
- ✅ Search/Filter Optimization (2-3h)
- ✅ N+1 Query Fix (1-2h)
- ✅ Analytics Optimization (3-4h)
- ✅ State Normalization (3-4h)
**Subtotal**: 11-16 hours

## Week 5-6: Database
- ✅ Indexing (2-3h)
- ✅ Pagination (1-2h)
- ✅ Row Level Security (2-3h)
- ✅ Materialized Views (2-3h)
- ✅ Redis Caching (1-2h)
**Subtotal**: 8-13 hours

**Total: 38-54 hours (~ 1-2 weeks full-time work per phase)**

---

# RECOMMENDED PRIORITIZATION

## If time-constrained (pick 3-4 per phase):

### Phase 1 - Must Do:
1. Input Validation (security blocker)
2. Authorization (security blocker)
3. Service Layer (foundation for other improvements)
4. Component Decomposition (code maintainability)

### Phase 2 - Must Do:
1. Rate Limiting (security blocker)
2. N+1 Query Fix (efficiency blocker)
3. Search/Filter Optimization (UX)

### Phase 3 - Must Do:
1. SQL Injection Prevention (security blocker)
2. Indexing (efficiency blocker)
3. Pagination (UX blocker)

---

# DEPENDENCIES & SEQUENCING

Phase 1 → Phase 2 → Phase 3 (linear; each builds on previous)
- Phase 1 creates the architectural foundation
- Phase 2 optimizes the logic within that architecture
- Phase 3 optimizes the data layer

**DO NOT skip phases or jump around** — early phases enable later optimizations.
