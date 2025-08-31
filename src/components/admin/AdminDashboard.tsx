import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/lib/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Car, 
  Users, 
  MessageSquare, 
  TrendingUp,
  Loader2,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Euro,
  Gauge,
  Settings,
  BarChart3,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        <Activity className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <h3 className="text-lg font-semibold mb-2">Eroare la încărcarea statisticilor</h3>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );
  }

  const cards = [
    {
      title: "Vehicule în Stoc",
      value: stats?.stockCount || 0,
      description: "Anunțuri active",
      icon: Car,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      link: "/admin/stock",
      action: "Gestionare Stoc"
    },
    {
      title: "Lead-uri Vânzare",
      value: stats?.sellLeadsCount || 0,
      description: "Cereri de vânzare",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      link: "/admin/leads",
      action: "Vezi Lead-uri"
    },
    {
      title: "Lead-uri Finanțare",
      value: stats?.financeLeadsCount || 0,
      description: "Cereri de finanțare",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      link: "/admin/leads",
      action: "Vezi Lead-uri"
    },
    {
      title: "Mesaje Contact",
      value: stats?.contactCount || 0,
      description: "Mesaje primite",
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      link: "/admin/leads",
      action: "Vezi Mesaje"
    },
    {
      title: "Lead-uri Comandă",
      value: stats?.orderLeadsCount || 0,
      description: "Cereri de comandă",
      icon: Car,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      link: "/admin/leads",
      action: "Vezi Comenzi"
    },
  ];

  const quickActions = [
    {
      title: "Adaugă Vehicul Nou",
      description: "Creează un nou anunț de vânzare",
      icon: Plus,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      link: "/admin/stock",
      action: "Adaugă"
    },
    {
      title: "Gestionare Stoc",
      description: "Administrează vehiculele existente",
      icon: Car,
      color: "text-green-600",
      bgColor: "bg-green-50",
      link: "/admin/stock",
      action: "Accesează"
    },
    {
      title: "Lead Management",
      description: "Gestionează cererile de vânzare și finanțare",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      link: "/admin/leads",
      action: "Accesează"
    },
    {
      title: "Setări Platformă",
      description: "Configurează parametrii sistemului",
      icon: Settings,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      link: "/admin/settings",
      action: "Configurează"
    },
  ];

  const recentActivities = [
    {
      type: "vehicle_added",
      title: "Vehicul nou adăugat",
      description: "BMW X5 2020 a fost adăugat în stoc",
      time: "Acum 2 ore",
      color: "bg-green-500"
    },
    {
      type: "lead_received",
      title: "Lead nou primit",
      description: "Cerere de vânzare pentru Mercedes C-Class",
      time: "Acum 4 ore",
      color: "bg-blue-500"
    },
    {
      type: "status_updated",
      title: "Status actualizat",
      description: "Audi A4 a fost marcat ca vândut",
      time: "Acum 6 ore",
      color: "bg-purple-500"
    },
    {
      type: "message_received",
      title: "Mesaj nou",
      description: "Mesaj de contact de la client",
      time: "Acum 8 ore",
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-600 mt-2">
            Prezentare generală a activității platformei și controale rapide
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Raport Detaliat
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Adaugă Vehicul
          </Button>
        </div>
      </div>

      {/* Statistici principale */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title} className="hover:shadow-lg transition-all duration-200 border-2 hover:border-gray-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {card.value.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mb-3">
                {card.description}
              </p>
              <Link to={card.link}>
                <Button variant="outline" size="sm" className="w-full">
                  {card.action}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Acțiuni rapide */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Acțiuni Rapide
            </CardTitle>
            <CardDescription>
              Accesează rapid funcționalitățile principale
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Link key={action.title} to={action.link}>
                  <div className={`p-4 rounded-lg border-2 ${action.bgColor} ${action.borderColor} hover:shadow-md transition-all duration-200 cursor-pointer`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-full ${action.bgColor}`}>
                        <action.icon className={`h-5 w-5 ${action.color}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{action.title}</h4>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      {action.action}
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Activități Recente
            </CardTitle>
            <CardDescription>
              Ultimele activități din platformă
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 ${activity.color} rounded-full mt-2`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistici detaliate */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performanța Platformei</CardTitle>
            <CardDescription>
              Metrici de performanță
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Utilizare stoc</span>
                <span>{Math.round((stats?.stockCount || 0) / 100 * 100)}%</span>
              </div>
              <Progress value={Math.min((stats?.stockCount || 0) / 100 * 100, 100)} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Lead-uri procesate</span>
                <span>{Math.round(((stats?.sellLeadsCount || 0) + (stats?.financeLeadsCount || 0)) / 50 * 100)}%</span>
              </div>
              <Progress value={Math.min(((stats?.sellLeadsCount || 0) + (stats?.financeLeadsCount || 0)) / 50 * 100, 100)} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Statistici Vehicule</CardTitle>
            <CardDescription>
              Informații despre stoc
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total vehicule</span>
              <Badge variant="secondary">{stats?.stockCount || 0}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Lead-uri vânzare</span>
              <Badge variant="outline">{stats?.sellLeadsCount || 0}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Lead-uri finanțare</span>
              <Badge variant="outline">{stats?.financeLeadsCount || 0}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Mesaje contact</span>
              <Badge variant="outline">{stats?.contactCount || 0}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sistem & Status</CardTitle>
            <CardDescription>
              Starea sistemului
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Activ
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Storage</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Activ
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Activ
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Frontend</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Activ
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
