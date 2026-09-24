import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SmoothScroll from "./components/SmoothScroll";
import Loader from "./components/Loader";
import ScrollToTop from "./components/ScrollToTop";
import { MessageCircle } from "lucide-react";

// Public Pages & Layout
import PublicLayout from "./layouts/PublicLayout";
const Home = lazy(() => import("./pages/Public/Home"));
const SpaceSelection = lazy(() => import("./pages/Public/SpaceSelection"));
const Randevu = lazy(() => import("./pages/Public/Randevu"));
const About = lazy(() => import("./pages/About"));
const ProductDetails = lazy(() => import("./pages/Public/ProductDetails"));
import EbatlamaForm from "./pages/Public/EbatlamaForm";
const ProjectDetails = lazy(() => import("./pages/Public/ProjectDetails"));
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
const AdminMessages = lazy(() => import("./pages/Admin/AdminMessages"));
const AdminCategories = lazy(() => import("./pages/Admin/AdminCategories"));

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
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
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="ebatlama" element={<AdminEbatlama />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="categories" element={<AdminCategories />} />
            </Route>
          </Routes>
        </Suspense>
      </SmoothScroll>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/905015397572" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center justify-center cursor-pointer"
        aria-label="WhatsApp İletişim"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-white">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      </a>
    </BrowserRouter>
  );
}
