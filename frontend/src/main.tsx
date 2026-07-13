import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { ArticlesPage } from "./pages/ArticlesPage";
import { StockHistoryPage } from "./pages/StockHistoryPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ArticlesPage />} />
        <Route path="/articles/:id/history" element={<StockHistoryPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);