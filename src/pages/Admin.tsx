import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Car, 
  MessageSquare, 
  Settings, 
  Users, 
  TrendingUp,
  Shield,
  Database
} from "lucide-react";
import StockManagement from "@/components/admin/StockManagement";
import LeadManagement from "@/components/admin/LeadManagement";
import SettingsManagement from "@/components/admin/SettingsManagement";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("stock");

  // Fetch dashboard stats
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [
        { count: vehiclesCount },
        { count: sellLeadsCount },
        { count: financeLeadsCount },
        { count: contactMessagesCount }
      ] = await Promise.all([
        supabase.from('vehicles').select('*', { count: 'exact', head: true }),
        supabase.from('lead_sell').select('*', { count: 'exact', head: true }),
        supabase.from('lead_finance').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true })
      ]);

      return {
        vehicles: vehiclesCount || 0,
        sellLeads: sellLeadsCount || 0,
        financeLeads: financeLeadsCount || 0,
        contactMessages: contactMessagesCount || 0
      };
    }
  });

  const dashboardCards = [
    {
      title: "Vehicule în Stoc",
      value: stats?.vehicles || 0,
      icon: Car,
      description: "Total vehicule disponibile",
      color: "bg-blue-500"
    },
    {
      title: "Lead-uri Vânzare",
      value: stats?.sellLeads || 0,
      icon: Users,
      description: "Cereri de vânzare",
      color: "bg-green-500"
    },
    {
      title: "Lead-uri Finanțare",
      value: stats?.financeLeads || 0,
      icon: TrendingUp,
      description: "Cereri de finanțare",
      color: "bg-purple-500"
    },
    {
      title: "Mesaje Contact",
      value: stats?.contactMessages || 0,
      icon: MessageSquare,
      description: "Mesaje de contact",
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Administrare</h1>
          </div>
          <p className="text-gray-600">
            Gestionează stocul, lead-urile și setările platformei
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${card.color}`}>
                  <card.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {card.value}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Gestionare Platformă</CardTitle>
            <CardDescription>
              Selectează secțiunea pe care dorești să o administrezi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="stock" className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Stoc Vehicule
                </TabsTrigger>
                <TabsTrigger value="leads" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Lead-uri
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Setări
                </TabsTrigger>
              </TabsList>

              <TabsContent value="stock" className="mt-6">
                <StockManagement />
              </TabsContent>

              <TabsContent value="leads" className="mt-6">
                <LeadManagement />
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <SettingsManagement />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
