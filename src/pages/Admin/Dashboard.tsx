import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/lib/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Car, 
  Users, 
  MessageSquare, 
  TrendingUp,
  Loader2 
} from "lucide-react";

export default function Dashboard() {
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
        Eroare la încărcarea statisticilor: {error.message}
      </div>
    );
  }

  const cards = [
    {
      title: "Anunțuri Active",
      value: stats?.stockCount || 0,
      description: "Vehicule în stoc",
      icon: Car,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Lead-uri Vânzare",
      value: stats?.sellLeadsCount || 0,
      description: "Cereri de vânzare",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Lead-uri Finanțare",
      value: stats?.financeLeadsCount || 0,
      description: "Cereri de finanțare",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Mesaje Contact",
      value: stats?.contactCount || 0,
      description: "Mesaje primite",
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Prezentare generală a activității platformei
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {card.value.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activități Recente</CardTitle>
            <CardDescription>
              Ultimele activități din platformă
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Dashboard accesat</p>
                  <p className="text-xs text-gray-500">Acum câteva secunde</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Sistemul este funcțional</p>
                  <p className="text-xs text-gray-500">Toate serviciile sunt active</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistici Rapide</CardTitle>
            <CardDescription>
              Informații despre performanța platformei
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total vehicule</span>
                <Badge variant="secondary">{stats?.stockCount || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total lead-uri</span>
                <Badge variant="secondary">
                  {(stats?.sellLeadsCount || 0) + (stats?.financeLeadsCount || 0)}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Mesaje contact</span>
                <Badge variant="secondary">{stats?.contactCount || 0}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
