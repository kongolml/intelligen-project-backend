# Add i18n-ready fields to PortfolioItem

## Context
Adding `subtitle`, `client`, and `year` fields to portfolio items with locale-map structure (`{ en: "...", uk: "..." }`) for future i18n support. Also converting existing `name` field to the same locale-map pattern. Existing documents will get a migration script to backfill placeholder values so nothing is forgotten.

## Default locale constant
Add `DEFAULT_LOCALE = 'en'` to `src/admin/constants.ts` for use across the app.

## Files to modify

### 1. `src/admin/constants.ts`
- Export `DEFAULT_LOCALE = 'en'` and `SUPPORTED_LOCALES = ['en', 'uk']`

### 2. `src/models/portfolio-item.model.ts`
- Change `name` from `String` to `{ type: Map, of: String }`
- Add `subtitle: { type: Map, of: String }` (optional)
- Add `client: { type: Map, of: String }` (optional)
- Add `year: { type: Number }` (optional)
- Update `IPortfolioItem` interface accordingly

### 3. `src/admin/resources/portfolio-item.resource.ts`
- Add property configs for `subtitle`, `client`, `year` with appropriate visibility and positioning
- AdminJS handles Map types natively via key-value editor, so no custom components needed initially

### 4. `src/middleware/portfolio-item.middleware.ts`
- Update `preparePortfolioItemForResponse` to extract locale values from Map fields
- Accept an optional `locale` param (default to `DEFAULT_LOCALE`)
- Map output: `title: item.name?.get(locale) || item.name?.get(DEFAULT_LOCALE)` (with fallback for old string values during transition)
- Add `subtitle`, `client`, `year` to the response shape

### 5. `src/routes/public-api.ts`
- Accept optional `?locale=uk` query param on portfolio endpoints
- Pass locale to middleware functions

### 6. Migration script: `src/scripts/migrate-i18n.ts`
- One-time script to update existing documents:
  - Convert `name: "Some Title"` -> `name: { en: "Some Title" }`
  - Set `subtitle: { en: "[PLACEHOLDER] Subtitle for <name>" }`
  - Set `client: { en: "[PLACEHOLDER] Client name" }`
  - Leave `year` as `null` (no sensible placeholder)
- Run via: `npx tsx src/scripts/migrate-i18n.ts`

## Implementation order
1. Constants (locale config)
2. Model schema changes
3. Migration script (run it to update existing data)
4. Admin resource config
5. Middleware (API response transformation)
6. Routes (locale query param)

## Verification
1. `npm run build` - ensure no TS errors
2. `npm run dev` - start server
3. Run migration script against dev DB
4. Check AdminJS panel - new fields visible and editable on portfolio items
5. Test API: `GET /public-api/portfolio` returns new fields with placeholder values
6. Test API: `GET /public-api/portfolio?locale=uk` returns Ukrainian values (or falls back to en)
