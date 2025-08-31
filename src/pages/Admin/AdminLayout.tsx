import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  LogOut, 
  Menu,
  X,
  BarChart3,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Anunțuri", href: "/admin/stock", icon: Car },
  { name: "Lead-uri", href: "/admin/leads", icon: Users },
  { name: "Setări", href: "/admin/settings", icon: Settings },
  { name: "Test Upload", href: "/admin/test-upload", icon: BarChart3 },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Eroare la deconectare",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Deconectare reușită",
          description: "Ați fost deconectat cu succes.",
        });
        navigate("/login");
      }
    } catch (err) {
      toast({
        title: "Eroare la deconectare",
        description: "A apărut o eroare neașteptată.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    navigate(item.href);
                    setSidebarOpen(false);
                  }}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Button>
              );
            })}
          </nav>
          <Separator />
          <div className="p-4">
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Deconectare
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start ${isActive ? 'bg-blue-100 text-blue-900 border-blue-200' : ''}`}
                  onClick={() => navigate(item.href)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </Button>
              );
            })}
          </nav>
          <Separator />
          <div className="p-4">
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Deconectare
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
