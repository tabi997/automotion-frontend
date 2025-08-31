import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Stock from "./pages/Stock";
import VendeMasina from "./pages/VendeMasina";
import Finantare from "./pages/Finantare";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/Auth/Login";
import AdminLayout from "./pages/Admin/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import AdminStock from "./pages/Admin/Stock";
import AdminLeads from "./pages/Admin/Leads";
import AuthGate from "./components/auth/AuthGate";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/stoc" element={<Stock />} />
          <Route path="/buyback" element={<VendeMasina />} />
          <Route path="/finantare" element={<Finantare />} />
          <Route path="/contact" element={<Contact />} />
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
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
