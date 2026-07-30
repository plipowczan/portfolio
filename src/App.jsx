import { MotionConfig } from "framer-motion";
import { Navigate, Route, Routes } from "react-router-dom";
import { BookingProvider } from "./context/BookingContext";
import Layout from "./components/layout/Layout";
import LocaleLayout from "./components/layout/LocaleLayout";
import StripEnRedirect from "./components/routing/StripEnRedirect";
import usePageTracking from "./hooks/usePageTracking";
import Blog from "./pages/Blog";
import BlogPostPage from "./pages/BlogPostPage";
import CookiePolicy from "./pages/CookiePolicy";
import CourseHub from "./pages/CourseHub";
import CourseLesson from "./pages/CourseLesson";
import Home from "./pages/Home";
import LlmWikiLanding from "./pages/LlmWikiLanding";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

import ProjectPage from "./pages/ProjectPage";

function App() {
  // Consent-gated GA4 page views. Sits here rather than in Layout because
  // Layout does not wrap every route, and here it is still under BrowserRouter.
  usePageTracking();

  return (
    <BookingProvider>
      <MotionConfig reducedMotion="user">
        <Layout>
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
            <Route path="/en/llm-wiki/kurs/:slug" element={<StripEnRedirect />} />
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
        </Layout>
      </MotionConfig>
    </BookingProvider>
  );
}

export default App;
