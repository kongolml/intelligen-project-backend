# Project Improvement Plan — Security, Hardening & Cleanup

## Context
Security audit revealed critical vulnerabilities (auth bypass, XSS, hardcoded credentials), missing server hardening (no CORS, no rate limiting, session misconfiguration), and accumulated tech debt (debug logs, commented code, deprecated dependencies). This plan addresses all issues in 4 phases ordered by severity.

---

## Phase 1: Critical Security Fixes ✅ COMPLETED

### 1.1 Fix authentication bypass + move credentials to env vars ✅
**Files:** `src/admin/auth-provider.ts`, `src/admin/constants.ts`
- ✅ Installed `bcrypt` and `@types/bcrypt`
- ✅ Replaced `DEFAULT_ADMIN` hardcoded credentials with `process.env.ADMIN_EMAIL` and `process.env.ADMIN_PASSWORD_HASH`
- ✅ Fixed `authenticate()` to compare email and bcrypt-verify password; returns `null` on mismatch
- ✅ Created `.env.example` documenting `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`
- ✅ Updated `CLAUDE.md` env vars section

### 1.2 Fix XSS in EditorJSShow ✅
**File:** `src/admin/components/EditorJSShow.tsx`
- ✅ Installed `isomorphic-dompurify`
- ✅ Sanitized every `__html` value with `DOMPurify.sanitize()`

### 1.3 Fix hardcoded DigitalOcean region ✅
**Files:** `src/middleware/portfolio-item.middleware.ts`
- ✅ Created shared helper `getMediaUrl(bucket, s3Key)` in `src/helpers/url.ts` using `process.env.DIGITALOCEAN_SPACE_HOST`
- ✅ Replaced all hardcoded `fra1.digitaloceanspaces.com` and `${REGION}.digitaloceanspaces.com` URL constructions in portfolio-item middleware
- ✅ Reused same helper in `src/middleware/teammates.middleware.ts` and `src/models/file.model.ts` virtual

---

## Phase 2: Server Hardening

### 2.1 Add CORS
**File:** `src/app.ts`
- Install `cors` (`npm install cors @types/cors`)
- Add `app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(','), credentials: true }))` before routes

### 2.2 Fix session configuration
**File:** `src/app.ts` (lines 37-41)
- Set `saveUninitialized: false`, `resave: false`
- Add cookie options: `httpOnly: true`, `secure: process.env.NODE_ENV === 'production'`, `sameSite: 'lax'`, `maxAge: 86400000`

### 2.3 Secure file uploads
**File:** `src/routes/public-api.ts`
- Add multer limits: `limits: { fileSize: 10 * 1024 * 1024 }` (line 19)
- Add `fileFilter` to accept only image MIME types
- The upload endpoint (`POST /admin/api/editorjs/upload`, line 103) is on the public router with no auth check — add session verification middleware

### 2.4 Add input validation
**File:** `src/routes/public-api.ts`
- Validate `slug` param with regex `/^[a-z0-9-]+$/` (line 84)
- Validate `portfolioItemId` is valid ObjectId format in upload handler (line 124)

### 2.5 Add global error handler
**File:** `src/app.ts`
- Add Express error middleware after all routes
- Wrap the `/teammates` handler (line 133) in try/catch (currently missing)

### 2.6 Add rate limiting
**File:** `src/app.ts`
- Install `express-rate-limit` (`npm install express-rate-limit`)
- General limiter on `/public-api` (100 req/min)
- Strict limiter on upload endpoint (10 req/min)

---

## Phase 3: Code Quality & Cleanup

### 3.1 Remove debug logs
- `src/app.ts:17` — remove `console.log("start1")`
- `src/app.ts:22` — remove `console.log('123123')`
- `src/app.ts:71` — fix `"AdminJS available12312312"` → `"AdminJS available"`
- `src/routes/public-api.ts:127` — remove `console.log(req)` (leaks headers/cookies)

### 3.2 Remove commented-out code
- `src/app.ts:44-63` — dead formidable middleware block
- `src/app.ts:73-77` — commented import calls
- `src/routes/public-api.ts:52-81` — commented routes
- `src/routes/public-api.ts:104,111-118,128` — commented lines in upload handler
- `src/middleware/portfolio-item.middleware.ts` — commented populate options

### 3.3 Fix @ts-ignore suppressions
- `src/helpers/editorjs-adminjs.ts` — replace ~10 `@ts-ignore` with proper type narrowing via discriminated union on `block.type`
- `src/admin/components/EditorJSShow.tsx:15` — type the conversion result
- `src/admin/components/EditorJSEdit.tsx:51` — type EditorJS constructor

### 3.4 Remove unused imports
- `src/app.ts:4` — remove `express-formidable` import (unused)
- `src/app.ts:9` — remove `importPortfolioItems, createMediaFilesFromUrls` import (only used in commented code)

---

## Phase 4: Infrastructure Modernization

### 4.1 Move import script out of src/
- Extract `uploadFileAndCreateDbRecord` from `src/helpers/import.ts` → `src/helpers/media-files.ts`
- Move remaining `import.ts` to `scripts/import.ts`
- Update `src/routes/public-api.ts:16` to import from new location

### 4.2 Migrate AWS SDK v2 → v3
- Replace `aws-sdk` with `@aws-sdk/client-s3` in `package.json`
- Update `src/admin/constants.ts` — remove `new AWS.Endpoint()`, configure S3Client
- Update `src/helpers/media-files.ts` (after 4.1 merge) — use `S3Client` + `PutObjectCommand`

### 4.3 Add pagination to portfolio endpoint
- Add `page`/`limit` query params to `GET /portfolio` route
- Update `getPortfolioItems()` in `src/middleware/portfolio-item.middleware.ts` to accept pagination params, use `.skip()` and `.limit()`
- Return `{ data, total, page, limit }` envelope

### 4.4 Remove frontend code from backend repo
- Delete `src/app/components/PortfolioList/` (Next.js component doesn't belong here)

---

## New Dependencies Summary
| Phase | Package | Purpose |
|-------|---------|---------|
| 1 | `bcrypt`, `@types/bcrypt` | Password hashing |
| 1 | `isomorphic-dompurify` | HTML sanitization |
| 2 | `cors`, `@types/cors` | CORS headers |
| 2 | `express-rate-limit` | Rate limiting |
| 4 | `@aws-sdk/client-s3` | Replace deprecated aws-sdk v2 |

## Verification
- After Phase 1: Try logging into `/admin` with wrong credentials — should be rejected. Inspect EditorJSShow rendered HTML — should have no raw script tags.
- After Phase 2: Test CORS headers with `curl -H "Origin: evil.com"`. Attempt uploading a 50MB file — should be rejected. Hit rate limit.
- After Phase 3: `npm run lint` should pass. No `@ts-ignore` remaining. No debug logs in output.
- After Phase 4: `npm run build` succeeds. Upload flow works with SDK v3. Pagination works on `/portfolio?page=1&limit=10`.
