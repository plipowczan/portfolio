import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./i18n";
import "./styles/index.css";
import { collectPrerenderedHead } from "./utils/prerenderedHead";

// Before React renders anything: whatever <SEO> tags are in <head> now came
// from the prerendered file, and <SEO> swaps them for its own on mount.
collectPrerenderedHead();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Analytics />
      <SpeedInsights />
    </BrowserRouter>
  </React.StrictMode>
);
