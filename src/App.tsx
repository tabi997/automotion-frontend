import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { ScrollToTopButton } from "@/components/common/ScrollToTopButton";
import { CookieConsent } from "@/components/common/CookieConsent";
import Index from "./pages/Index";
import Stock from "./pages/Stock";
import VehicleDetail from "./pages/VehicleDetail";
import VendeMasina from "./pages/VendeMasina";
import Finantare from "./pages/Finantare";
import Contact from "./pages/Contact";
import ComandaMasina from "./pages/ComandaMasina";
import TermeniConditii from "./pages/TermeniConditii";
import PoliticaConfidentialitate from "./pages/PoliticaConfidentialitate";
import PoliticaCookie from "./pages/PoliticaCookie";
import NotFound from "./pages/NotFound";
import Login from "./pages/Auth/Login";
import AdminLayout from "./pages/Admin/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import AdminStock from "./pages/Admin/Stock";
import AdminLeads from "./pages/Admin/Leads";
import TestUpload from "./pages/Admin/TestUpload";
import Settings from "./pages/Admin/Settings";
import AuthGate from "./components/auth/AuthGate";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <ScrollToTop />
        <ScrollToTopButton />
        <CookieConsent />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/stoc" element={<Stock />} />
          <Route path="/vehicul/:id" element={<VehicleDetail />} />
          <Route path="/buyback" element={<VendeMasina />} />
          <Route path="/finantare" element={<Finantare />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/comanda" element={<ComandaMasina />} />
          <Route path="/termeni-conditii" element={<TermeniConditii />} />
          <Route path="/politica-confidentialitate" element={<PoliticaConfidentialitate />} />
          <Route path="/politica-cookie-uri" element={<PoliticaCookie />} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes - Protected by AuthGate */}
          <Route path="/admin" element={
            <AuthGate>
              <AdminLayout />
            </AuthGate>
          }>
            <Route index element={<Dashboard />} />
            <Route path="stock" element={<AdminStock />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="settings" element={<Settings />} />
            <Route path="test-upload" element={<TestUpload />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
