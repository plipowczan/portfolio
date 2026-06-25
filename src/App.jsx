import { MotionConfig } from "framer-motion";
import { Navigate, Route, Routes } from "react-router-dom";
import { BookingProvider } from "./context/BookingContext";
import Layout from "./components/layout/Layout";
import LocaleLayout from "./components/layout/LocaleLayout";
import Blog from "./pages/Blog";
import BlogPostPage from "./pages/BlogPostPage";
import CookiePolicy from "./pages/CookiePolicy";
import Home from "./pages/Home";
import LlmWikiLanding from "./pages/LlmWikiLanding";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

import ProjectPage from "./pages/ProjectPage";

function App() {
  return (
    <BookingProvider>
      <MotionConfig reducedMotion="user">
        <Layout>
          <Routes>
            {/* PL-only landing: redirect the /en mirror to the canonical PL URL */}
            <Route
              path="/en/llm-wiki"
              element={<Navigate to="/llm-wiki" replace />}
            />
            <Route path="/:lang?" element={<LocaleLayout />}>
              <Route index element={<Home />} />
              <Route path="llm-wiki" element={<LlmWikiLanding />} />
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
