import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SmoothScroll from "./components/SmoothScroll";
import Loader from "./components/Loader";

// Public Pages & Layout
import PublicLayout from "./layouts/PublicLayout";
const Home = lazy(() => import("./pages/Public/Home"));
const SpaceSelection = lazy(() => import("./pages/Public/SpaceSelection"));
const Randevu = lazy(() => import("./pages/Public/Randevu"));
const About = lazy(() => import("./pages/About"));
const ProductDetails = lazy(() => import("./pages/Public/ProductDetails"));
const ProjectDetails = lazy(() => import("./pages/Public/ProjectDetails"));
const EbatlamaForm = lazy(() => import("./pages/Public/EbatlamaForm"));
const OrderForm = lazy(() => import("./pages/Public/OrderForm"));
const UrunlerPage = lazy(() => import("./pages/Public/UrunlerPage"));

const PanelOptimizer = lazy(() => import("./pages/Public/PanelOptimizer"));

// Admin Pages & Layout
import AdminLayout from "./layouts/AdminLayout";
const AdminLogin = lazy(() => import("./pages/Admin/AdminLogin"));
import ProtectedRoute from "./components/ProtectedRoute";
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const AdminProjects = lazy(() => import("./pages/Admin/AdminProjects"));
const AdminProducts = lazy(() => import("./pages/Admin/AdminProducts"));
const AdminSettings = lazy(() => import("./pages/Admin/AdminSettings"));
const AdminEbatlama = lazy(() => import("./pages/Admin/AdminEbatlama"));

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScroll>
        <Suspense fallback={<Loader />}>
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
              <Route path="/urunler/:categorySlug?" element={<UrunlerPage />} />
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
        </Suspense>
      </SmoothScroll>
    </BrowserRouter>
  );
}
