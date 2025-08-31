import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Search, Filter, Eye, Car, MoreHorizontal, Calendar, Gauge, Euro, MapPin, Star, AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { StockVehicle } from "@/types/vehicle";
import VehicleForm from "./VehicleForm";
import VehicleQuickView from "./VehicleQuickView";

interface VehicleStockManagerProps {
  className?: string;
}

const VehicleStockManager = ({ className }: VehicleStockManagerProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<StockVehicle | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<StockVehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterBrand, setFilterBrand] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const queryClient = useQueryClient();

  // Fetch vehicles with filters and sorting
  const { data: vehicles, isLoading, error } = useQuery({
    queryKey: ["admin-vehicles", filterStatus, filterBrand, sortBy, sortOrder],
    queryFn: async () => {
      let query = supabase
        .from('stock')
        .select('*');

      // Apply filters
      if (filterStatus !== "all") {
        query = query.eq('status', filterStatus);
      }
      if (filterBrand !== "all") {
        query = query.eq('marca', filterBrand);
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === "asc" });

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  // Get unique brands for filter
  const { data: brands } = useQuery({
    queryKey: ["vehicle-brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stock')
        .select('marca')
        .order('marca');
      
      if (error) throw error;
      const uniqueBrands = [...new Set(data?.map(v => v.marca) || [])];
      return uniqueBrands;
    }
  });

  // Delete vehicle mutation
  const deleteVehicleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('stock')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast({
        title: "Succes",
        description: "Vehiculul a fost șters cu succes!",
      });
    },
    onError: (error) => {
      toast({
        title: "Eroare",
        description: "Eroare la ștergerea vehiculului. Încearcă din nou.",
        variant: "destructive",
      });
    }
  });

  // Bulk status update mutation
  const bulkStatusUpdateMutation = useMutation({
    mutationFn: async ({ ids, status }: { ids: string[]; status: string }) => {
      const { error } = await supabase
        .from('stock')
        .update({ status })
        .in('id', ids);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] });
      toast({
        title: "Succes",
        description: "Statusul vehiculelor a fost actualizat cu succes!",
      });
    },
    onError: (error) => {
      toast({
        title: "Eroare",
        description: "Eroare la actualizarea statusului. Încearcă din nou.",
        variant: "destructive",
      });
    }
  });

  const handleEditVehicle = (vehicle: StockVehicle) => {
    setEditingVehicle(vehicle);
    setIsEditDialogOpen(true);
  };

  const handleQuickView = (vehicle: StockVehicle) => {
    setSelectedVehicle(vehicle);
    setIsQuickViewOpen(true);
  };

  const handleDeleteVehicle = (id: string) => {
    deleteVehicleMutation.mutate(id);
  };

  const handleBulkStatusUpdate = (status: string) => {
    // For now, we'll just show a toast. In a real implementation,
    // you'd have checkboxes to select vehicles
    toast({
      title: "Info",
      description: "Funcționalitatea de actualizare în bulk va fi implementată în curând.",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: "default" as const, icon: CheckCircle, label: "Activ" },
      inactive: { variant: "secondary" as const, icon: XCircle, label: "Inactiv" },
      sold: { variant: "destructive" as const, icon: CheckCircle, label: "Vândut" },
      reserved: { variant: "outline" as const, icon: Clock, label: "Rezervat" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getStatusCount = (status: string) => {
    return vehicles?.filter(v => v.status === status).length || 0;
  };

  const filteredVehicles = vehicles?.filter(vehicle => {
    const matchesSearch = 
      vehicle.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.descriere?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === "all" || vehicle.status === activeTab;
    
    return matchesSearch && matchesTab;
  }) || [];

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-600 mb-2">Eroare la încărcarea datelor</h3>
            <p className="text-gray-600">Nu s-au putut încărca vehiculele. Încearcă din nou.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Header cu statistici */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Vehicule</p>
                <p className="text-2xl font-bold">{vehicles?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold">{getStatusCount("active")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Rezervate</p>
                <p className="text-2xl font-bold">{getStatusCount("reserved")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Vândute</p>
                <p className="text-2xl font-bold">{getStatusCount("sold")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controale principale */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Caută vehicule după marcă, model sau descriere..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full lg:w-96"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Adaugă Vehicul
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs pentru filtrare */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Toate ({vehicles?.length || 0})</TabsTrigger>
              <TabsTrigger value="active">Active ({getStatusCount("active")})</TabsTrigger>
              <TabsTrigger value="reserved">Rezervate ({getStatusCount("reserved")})</TabsTrigger>
              <TabsTrigger value="sold">Vândute ({getStatusCount("sold")})</TabsTrigger>
              <TabsTrigger value="inactive">Inactive ({getStatusCount("inactive")})</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Tabel vehicule */}
      <Card>
        <CardHeader>
          <CardTitle>Lista Vehicule</CardTitle>
          <CardDescription>
            {filteredVehicles.length} vehicule găsite
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Se încarcă vehiculele...</p>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="text-center py-8">
              <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Nu s-au găsit vehicule</h3>
              <p className="text-gray-500">Încearcă să modifici filtrele sau să adaugi un vehicul nou.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicul</TableHead>
                    <TableHead>Preț</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data Adăugării</TableHead>
                    <TableHead className="text-right">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Car className="h-6 w-6 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {vehicle.marca} {vehicle.model}
                            </div>
                            <div className="text-sm text-gray-500 space-x-2">
                              <span className="inline-flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {vehicle.an}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Gauge className="h-3 w-3" />
                                {vehicle.km.toLocaleString()} km
                              </span>
                            </div>
                            {vehicle.culoare && (
                              <div className="text-xs text-gray-400">
                                {vehicle.culoare}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-gray-900">
                          €{vehicle.pret.toLocaleString()}
                        </div>
                        {vehicle.negociabil && (
                          <Badge variant="outline" className="text-xs">
                            Negociabil
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(vehicle.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {new Date(vehicle.created_at).toLocaleDateString('ro-RO')}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acțiuni</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleQuickView(vehicle)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Vezi detalii
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditVehicle(vehicle)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editează
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteVehicle(vehicle.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Șterge
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog pentru adăugare vehicul nou */}
      <VehicleForm
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={() => {
          setIsAddDialogOpen(false);
          queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] });
        }}
      />

      {/* Dialog pentru editare vehicul */}
      <VehicleForm
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        vehicle={editingVehicle}
        onSuccess={() => {
          setIsEditDialogOpen(false);
          setEditingVehicle(null);
          queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] });
        }}
      />

      {/* Dialog pentru vizualizare rapidă */}
      <VehicleQuickView
        open={isQuickViewOpen}
        onOpenChange={setIsQuickViewOpen}
        vehicle={selectedVehicle}
      />
    </div>
  );
};

export default VehicleStockManager;
