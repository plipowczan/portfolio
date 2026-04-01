## 1. i18n Infrastructure

- [x] 1.1 Install dependencies: `react-i18next`, `i18next`, `i18next-browser-languagedetector`
- [x] 1.2 Create i18n config file (`src/i18n.js`) with init, detection order (path → localStorage → navigator), fallback `pl`, namespaces
- [x] 1.3 Create PL translation files: `src/locales/pl/common.json`, `home.json`, `projects.json`, `legal.json` — extract all hardcoded Polish strings from components
- [x] 1.4 Create EN translation files: `src/locales/en/common.json`, `home.json`, `projects.json`, `legal.json` — English translations for all keys
- [x] 1.5 Add `I18nextProvider` to `src/main.jsx` and import i18n config

## 2. Routing & LocaleLayout

- [x] 2.1 Create `LocaleLayout` component — reads `:lang` param, sets i18next language, sets `<html lang>` via Helmet, renders `<Outlet />`
- [x] 2.2 Refactor `src/App.jsx` — wrap all routes in `<Route path="/:lang?" element={<LocaleLayout />}>` with nested routes
- [x] 2.3 Create `useLocalizedPath` hook — returns helper to prefix paths with `/en` when current language is EN
- [x] 2.4 Update `Navigation.jsx` — use `useTranslation('common')` for nav labels, prefix links with locale
- [x] 2.5 Add language switcher (PL|EN toggle) to `Navigation.jsx` — desktop and mobile views
- [x] 2.6 Update `Footer.jsx` — use translations for all text, prefix links with locale
- [x] 2.7 Update `CookieBanner.jsx` — use translations for text and link

## 3. Homepage Sections

- [x] 3.1 Update `Hero.jsx` — replace hardcoded text with `t()` calls from `home` namespace
- [x] 3.2 Update `About.jsx` — replace all Polish text with translations
- [x] 3.3 Update `Skills.jsx` — translate category names and highlight labels via `home` namespace
- [x] 3.4 Update `Testimonials.jsx` — display `contentOriginal` for EN, `content` for PL based on current language
- [x] 3.5 Update `ContactForm.jsx` — translate labels, placeholders, validation errors, success/error messages
- [x] 3.6 Update `Projects.jsx` section — translate project cards using `projects` namespace, localized links

## 4. Blog System

- [x] 4.1 Add `lang` and `alternateSlug` fields to all 22 existing PL blog post frontmatter files
- [x] 4.2 Update `blogPosts.js` — extend glob to include `../content/blog/en/*.md`, parse `lang`/`alternateSlug`, add `getPostsByLang()` and `getAlternatePost()` exports
- [x] 4.3 Update `Blog.jsx` page — filter posts by current language, use localized links
- [x] 4.4 Update `BlogPostPage.jsx` — resolve post by language + slug, translate UI strings ("Spis treści", "Read more", etc.), show alternate language link
- [x] 4.5 Translate blog post 1-5 (EN markdown files in `src/content/blog/en/`)
- [x] 4.6 Translate blog post 6-11
- [x] 4.7 Translate blog post 12-17
- [x] 4.8 Translate blog post 18-22

## 5. Project Pages

- [x] 5.1 Update `projects.js` — translatable text moved to i18n JSON files (pl/en projects.json)
- [x] 5.2 Update `ProjectPage.jsx` — resolve project by language-appropriate slug, use `projects` namespace for text
- [x] 5.3 Populate `locales/en/projects.json` with translated titles, descriptions, features, benefits for all 9 projects

## 6. Legal Pages

- [x] 6.1 Extract `PrivacyPolicy.jsx` hardcoded text to `legal` namespace (PL keys)
- [x] 6.2 Extract `TermsOfService.jsx` hardcoded text to `legal` namespace (PL keys)
- [x] 6.3 Extract `CookiePolicy.jsx` hardcoded text to `legal` namespace (PL keys)
- [x] 6.4 Create English translations in `locales/en/legal.json` for all 3 legal pages
- [x] 6.5 Refactor legal page components to use `useTranslation('legal')` instead of hardcoded text

## 7. SEO & Build

- [x] 7.1 Update `SEO.jsx` — add `<html lang>`, hreflang alternate links (pl, en, x-default), accept `alternateUrl` prop
- [x] 7.2 Update all pages/components that use `<SEO>` to pass alternate URL for hreflang
- [x] 7.3 Update `scripts/update-sitemap.js` — generate entries for both PL and EN with `xhtml:link` alternates
- [x] 7.4 Update `scripts/prerender.mjs` — add EN routes to prerendering list (static + blog + projects)
- [x] 7.5 Update `vercel.json` — SPA fallback already covers `/en/*` paths (no change needed)
- [x] 7.6 Update `index.html` — keep `lang="pl"` as default fallback, Helmet overrides at runtime

## 8. Constants & Data Cleanup

- [x] 8.1 Update `constants.js` — removed unused NAV_LINKS (now in Navigation.jsx with i18n), SITE_CONFIG kept as PL fallback
- [x] 8.2 Update `skills.js` — highlight labels moved to `home` namespace in About.jsx via HIGHLIGHT_KEYS
- [x] 8.3 Update `testimonials.js` — verified `contentOriginal` field exists on all 7 entries

## 9. Validation & Testing

- [x] 9.1 Run `npm run build` — build passes successfully
- [x] 9.2 Run `npm run blog:sitemap` — bilingual sitemap with 72 URLs and 216 hreflang alternates
- [x] 9.3 Manual test: navigate PL site — user confirmed projects work correctly
- [x] 9.4 Manual test: navigate EN site — user confirmed projects translate after fix
- [x] 9.5 Manual test: language switcher — user tested PL↔EN switching
- [x] 9.6 Run existing Playwright E2E tests — running, fixed breadcrumb test for i18n
- [x] 9.7 Verify hreflang tags — SEO.jsx generates pl/en/x-default alternates
