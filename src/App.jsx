import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SmoothScroll from "./components/SmoothScroll";

// Public Pages & Layout
import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/Public/Home";
import SpaceSelection from "./pages/Public/SpaceSelection";
import Randevu from "./pages/Public/Randevu";
import About from "./pages/About";
import ProductDetails from "./pages/Public/ProductDetails";
import ProjectDetails from "./pages/Public/ProjectDetails";
import EbatlamaForm from "./pages/Public/EbatlamaForm";
import OrderForm from "./pages/Public/OrderForm";

import PanelOptimizer from "./pages/Public/PanelOptimizer";

// Admin Pages & Layout
import AdminLayout from "./layouts/AdminLayout";
import AdminLogin from "./pages/Admin/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminProjects from "./pages/Admin/AdminProjects";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminSettings from "./pages/Admin/AdminSettings";
import AdminEbatlama from "./pages/Admin/AdminEbatlama";

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScroll>
        <Routes>
          {/* Public Routes - Wrapped with Navbar and Standard Backgrounds */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/spaces" element={<SpaceSelection />} />
            <Route path="/randevu" element={<Randevu />} />
            <Route path="/about" element={<About />} />
            <Route path="/urun/:id" element={<ProductDetails />} />
            <Route path="/proje/:id" element={<ProjectDetails />} />
            <Route path="/ebatlama" element={<EbatlamaForm />} />
            <Route path="/siparis-ver" element={<OrderForm />} />
            <Route path="/optimizer" element={<PanelOptimizer />} />
          </Route>

          {/* Admin Routes - Separate Layout and Independent UI */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="ebatlama" element={<AdminEbatlama />} />
              <Route path="settings" element={<AdminSettings />} />
              {/* Future routes: messages, etc. */}
              <Route path="*" element={<AdminDashboard />} />
            </Route>
          </Route>
        </Routes>
      </SmoothScroll>
    </BrowserRouter>
  );
}
