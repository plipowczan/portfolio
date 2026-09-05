import { MotionConfig } from "framer-motion";
import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { BookingProvider } from "./context/BookingContext";
import Layout from "./components/layout/Layout";
import LocaleLayout from "./components/layout/LocaleLayout";
import StripEnRedirect from "./components/routing/StripEnRedirect";
import { useFirstLoadTracker } from "./hooks/useFirstLoad";
import usePageTracking from "./hooks/usePageTracking";
import Home from "./pages/Home";

// `Home` zostaje statyczny, reszta tras jest leniwa.
//
// Strona główna to trasa, o pierwsze ładowanie której chodzi w tej zmianie —
// zrobienie jej leniwą dołożyłoby jej rundę sieciową na ścieżce krytycznej i
// jednocześnie wyprowadziłoby ją spod bramki rozmiaru, która mierzy chunk
// wejściowy wraz z jego statycznymi importami. Trasy leniwe płacą jedno
// dodatkowe żądanie przy wejściu na nie i w zamian znikają z pierwszego
// ładowania wszystkim pozostałym — z `react-markdown` i `remark`/`rehype`
// włącznie, bo te wchodzą tylko na artykuł i lekcję.
const Blog = lazy(() => import("./pages/Blog"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const CourseHub = lazy(() => import("./pages/CourseHub"));
const CourseLesson = lazy(() => import("./pages/CourseLesson"));
const LlmWikiLanding = lazy(() => import("./pages/LlmWikiLanding"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const ProjectPage = lazy(() => import("./pages/ProjectPage"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));

// Każda strona zaczyna się od `min-h-screen`, więc zastępnik trzyma tę samą
// wysokość. Bez tego stopka podskakiwałaby w górę na czas pobrania chunka.
const RouteFallback = () => <div className="min-h-screen" aria-hidden="true" />;

function App() {
  // Consent-gated GA4 page views. Sits here rather than in Layout because
  // Layout does not wrap every route, and here it is still under BrowserRouter.
  usePageTracking();

  // Odróżnia wejście bezpośrednie (jest prerender, nie animujemy nad zgięciem)
  // od nawigacji wewnątrz serwisu (animacja gra) — patrz `useFirstLoad`.
  useFirstLoadTracker();

  return (
    <BookingProvider>
      <MotionConfig reducedMotion="user">
        <Layout>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              {/* PL-only /llm-wiki section: redirect the /en mirror(s) to the
                  canonical PL URL. The exact landing redirect is kept; the course
                  paths get explicit redirects (so they win the ranking tie against
                  the nested /:lang? course routes, exactly like the landing does)
                  plus a splat catch-all for any future deep /en/llm-wiki path. */}
              <Route
                path="/en/llm-wiki"
                element={<Navigate to="/llm-wiki" replace />}
              />
              <Route path="/en/llm-wiki/kurs" element={<StripEnRedirect />} />
              <Route
                path="/en/llm-wiki/kurs/:slug"
                element={<StripEnRedirect />}
              />
              <Route path="/en/llm-wiki/*" element={<StripEnRedirect />} />
              <Route path="/:lang?" element={<LocaleLayout />}>
                <Route index element={<Home />} />
                <Route path="llm-wiki">
                  <Route index element={<LlmWikiLanding />} />
                  <Route path="kurs" element={<CourseHub />} />
                  <Route path="kurs/:slug" element={<CourseLesson />} />
                </Route>
                <Route path="blog" element={<Blog />} />
                <Route path="blog/:slug" element={<BlogPostPage />} />
                <Route path="projects/:slug" element={<ProjectPage />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="terms-of-service" element={<TermsOfService />} />
                <Route path="cookie-policy" element={<CookiePolicy />} />
              </Route>
            </Routes>
          </Suspense>
        </Layout>
      </MotionConfig>
    </BookingProvider>
  );
}

export default App;
