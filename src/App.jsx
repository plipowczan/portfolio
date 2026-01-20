import { Route, Routes } from "react-router-dom";
import { BookingProvider } from "./context/BookingContext";
import Layout from "./components/layout/Layout";
import Blog from "./pages/Blog";
import BlogPostPage from "./pages/BlogPostPage";
import CookiePolicy from "./pages/CookiePolicy";
import Home from "./pages/Home";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

import ProjectPage from "./pages/ProjectPage";

function App() {
  return (
    <BookingProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/projects/:slug" element={<ProjectPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
        </Routes>
      </Layout>
    </BookingProvider>
  );
}

export default App;

