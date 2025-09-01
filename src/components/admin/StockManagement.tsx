import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Search, Filter, Eye, Car } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { StockVehicle } from "@/types/vehicle";
import { AdminUploadGallery } from "@/components/admin/AdminUploadGallery";
import { env } from "@/lib/env";
import { carBrands } from "../../data/carBrands";

interface VehicleFormData {
  marca: string;
  model: string;
  an: number;
  pret: number;
  km: number;
  combustibil: string;
  transmisie: string;
  caroserie: string;
  culoare: string;
  vin: string;
  negociabil: boolean;
  descriere: string;
  status: string;
  openlane_url: string;
}

const StockManagement = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<StockVehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const queryClient = useQueryClient();

  // Debug environment variables
  useEffect(() => {
    console.log('🔍 StockManagement Debug:');
    console.log('• VITE_ENABLE_UPLOAD:', env.VITE_ENABLE_UPLOAD);
    console.log('• VITE_BYPASS_ADMIN_FOR_UPLOAD:', env.VITE_BYPASS_ADMIN_FOR_UPLOAD);
    console.log('• VITE_STORAGE_BUCKET:', env.VITE_STORAGE_BUCKET);
    console.log('• AdminUploadGallery imported:', !!AdminUploadGallery);
  }, []);

  // Form state
  const [formData, setFormData] = useState<VehicleFormData>({
    marca: "",
    model: "",
    an: new Date().getFullYear(),
    pret: 0,
    km: 0,
    combustibil: "benzina",
    transmisie: "automata",
    caroserie: "berlina",
    culoare: "",
    vin: "",
    negociabil: false,
    descriere: "",
    status: "active",
    openlane_url: ""
  });

  // Add image upload functionality
  const [images, setImages] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Fetch vehicles
  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["admin-vehicles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stock')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  // Add vehicle mutation
  const addVehicleMutation = useMutation({
    mutationFn: async (data: VehicleFormData) => {
      const { error } = await supabase
        .from('stock')
        .insert([{
          ...data,
          images: []
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      setIsAddDialogOpen(false);
      setFormData({
        marca: "",
        model: "",
        an: new Date().getFullYear(),
        pret: 0,
        km: 0,
        combustibil: "benzina",
        transmisie: "automata",
        caroserie: "berlina",
        culoare: "",
        vin: "",
        negociabil: false,
        descriere: "",
        status: "active",
        openlane_url: ""
      });
      toast({
        title: "Succes",
        description: "Vehiculul a fost adăugat cu succes!",
      });
    },
    onError: (error) => {
      toast({
        title: "Eroare",
        description: "Eroare la adăugarea vehiculului. Încearcă din nou.",
        variant: "destructive",
      });
    }
  });

  // Update vehicle mutation
  const updateVehicleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<VehicleFormData> }) => {
      console.log('🔍 StockManagement: Updating vehicle with data:', { id, data });
      
      const { error } = await supabase
        .from('stock')
        .update(data)
        .eq('id', id);

      if (error) {
        console.error('🔍 StockManagement: Supabase update error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] });
      setIsEditDialogOpen(false);
      setEditingVehicle(null);
      toast({
        title: "Succes",
        description: "Vehiculul a fost actualizat cu succes!",
      });
    },
    onError: (error) => {
      toast({
        title: "Eroare",
        description: "Eroare la actualizarea vehiculului. Încearcă din nou.",
        variant: "destructive",
      });
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

  const handleAddVehicle = () => {
    if (!formData.marca || !formData.model || !formData.an || !formData.pret || !formData.km) {
      toast({
        title: "Eroare",
        description: "Completează toate câmpurile obligatorii",
        variant: "destructive",
      });
      return;
    }
    
    // Include images in the form data
    const vehicleDataWithImages = {
      ...formData,
      images: images
    };
    
    addVehicleMutation.mutate(vehicleDataWithImages);
  };

  const handleEditVehicle = (vehicle: StockVehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      marca: vehicle.marca,
      model: vehicle.model,
      an: vehicle.an,
      pret: vehicle.pret,
      km: vehicle.km,
      combustibil: vehicle.combustibil,
      transmisie: vehicle.transmisie,
      caroserie: vehicle.caroserie,
      culoare: vehicle.culoare || "",
      vin: vehicle.vin || "",
      negociabil: vehicle.negociabil || false,
      descriere: vehicle.descriere || "",
      status: vehicle.status,
      openlane_url: vehicle.openlane_url || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateVehicle = () => {
    if (editingVehicle) {
      // Include images in the update data
      const updateDataWithImages = {
        ...formData,
        images: images
      };
      updateVehicleMutation.mutate({ id: editingVehicle.id, data: updateDataWithImages });
    }
  };

  const handleDeleteVehicle = (id: string) => {
    deleteVehicleMutation.mutate(id);
  };

  const filteredVehicles = vehicles?.filter(vehicle => {
    const matchesSearch = vehicle.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || vehicle.status === filterType;
    return matchesSearch && matchesFilter;
  }) || [];

  const fuelTypes = ["benzina", "motorina", "hibrid", "electric", "gpl"];
  const transmissions = ["manuala", "automata", "cvt"];
  const bodyTypes = ["berlina", "break", "suv", "coupe", "cabriolet", "hatchback", "monovolum"];
  const conditions = ["nou", "second-hand", "demo"];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900" id="page-title">Gestionare Stoc Vehicule</h2>
          <p className="text-sm sm:text-base text-gray-600" id="page-description">Administrează vehiculele din stocul platformei</p>
        </div>
    
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="flex items-center gap-2 w-full sm:w-auto"
              aria-describedby="page-description"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Adaugă Vehicul</span>
              <span className="sm:hidden">Adaugă</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Adaugă Vehicul Nou</DialogTitle>
              <DialogDescription className="text-sm">
                Completează informațiile despre vehiculul nou
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="marca">Marcă *</Label>
                {/* Debug info */}
                <div className="text-xs text-gray-500 mb-2">
                  Debug: carBrands length = {carBrands?.length || 'undefined'}
                </div>
                <Select
                  value={formData.marca}
                  onValueChange={(value) => {
                    setFormData({ ...formData, marca: value });
                    setSelectedBrand(value);
                    setFormData(prev => ({ ...prev, model: '' })); // Reset model when brand changes
                  }}
                >
                  <SelectTrigger id="marca" name="marca">
                    <SelectValue placeholder="Selectează marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {carBrands?.map(({ brand }) => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Select
                  value={formData.model}
                  onValueChange={(value) => setFormData({ ...formData, model: value })}
                  disabled={!selectedBrand}
                >
                  <SelectTrigger id="model" name="model">
                    <SelectValue placeholder="Selectează modelul" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedBrand && carBrands?.find(b => b.brand === selectedBrand)?.models.map((model) => (
                      <SelectItem key={model} value={model}>{model}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="an">An *</Label>
                <Input
                  id="an"
                  name="an"
                  type="number"
                  value={formData.an}
                  onChange={(e) => setFormData({ ...formData, an: parseInt(e.target.value) || 0 })}
                  placeholder="2020"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pret">Preț (€) *</Label>
                <Input
                  id="pret"
                  name="pret"
                  type="number"
                  value={formData.pret}
                  onChange={(e) => setFormData({ ...formData, pret: parseInt(e.target.value) || 0 })}
                  placeholder="25000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="km">Kilometraj *</Label>
                <Input
                  id="km"
                  name="km"
                  type="number"
                  value={formData.km}
                  onChange={(e) => setFormData({ ...formData, km: parseInt(e.target.value) || 0 })}
                  placeholder="50000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="combustibil">Combustibil *</Label>
                <Select value={formData.combustibil} onValueChange={(value) => setFormData({ ...formData, combustibil: value })}>
                  <SelectTrigger id="combustibil" name="combustibil">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="transmisie">Transmisie *</Label>
                <Select value={formData.transmisie} onValueChange={(value) => setFormData({ ...formData, transmisie: value })}>
                  <SelectTrigger id="transmisie" name="transmisie">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {transmissions.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="caroserie">Caroserie *</Label>
                <Select value={formData.caroserie} onValueChange={(value) => setFormData({ ...formData, caroserie: value })}>
                  <SelectTrigger id="caroserie" name="caroserie">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {bodyTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="culoare">Culoare</Label>
                <Input
                  id="culoare"
                  name="culoare"
                  value={formData.culoare}
                  onChange={(e) => setFormData({ ...formData, culoare: e.target.value })}
                  placeholder="Negru Safir"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vin">Vin</Label>
                <Input
                  id="vin"
                  name="vin"
                  value={formData.vin}
                  onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                  placeholder="WBA3A9C50EP000000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="openlane_url">Link OpenLane</Label>
                <Input
                  id="openlane_url"
                  name="openlane_url"
                  type="url"
                  value={formData.openlane_url}
                  onChange={(e) => setFormData({ ...formData, openlane_url: e.target.value })}
                  placeholder="https://www.openlane.eu/auction/..."
                />
                <p className="text-xs text-gray-500">
                  Link-ul către licitația OpenLane pentru acest vehicul
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="negociabil">Negociabil</Label>
                <Select value={formData.negociabil ? "true" : "false"} onValueChange={(value) => setFormData({ ...formData, negociabil: value === "true" })}>
                  <SelectTrigger id="negociabil" name="negociabil">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Da</SelectItem>
                    <SelectItem value="false">Nu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'inactive' })}>
                  <SelectTrigger id="status" name="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activ</SelectItem>
                    <SelectItem value="inactive">Inactiv</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="descriere">Descriere</Label>
              <Textarea
                id="descriere"
                name="descriere"
                value={formData.descriere}
                onChange={(e) => setFormData({ ...formData, descriere: e.target.value })}
                placeholder="Descrierea vehiculului..."
                rows={3}
              />
            </div>
            
            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="vehicle-images">Fotografii Vehicul</Label>
              <div id="vehicle-images" aria-describedby="vehicle-images-help">
                <AdminUploadGallery
                  onImagesChange={(imageUrls) => {
                    // Store image URLs for later upload
                    setImages(imageUrls as unknown as File[]);
                  }}
                  minImages={1}
                  maxImages={10}
                />
              </div>
              <p id="vehicle-images-help" className="text-sm text-gray-500">
                Adaugă între 1 și 10 fotografii ale vehiculului
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(false)}
                className="w-full sm:w-auto"
                aria-describedby="add-cancel-help"
              >
                Anulează
              </Button>
              <Button 
                onClick={handleAddVehicle}
                disabled={addVehicleMutation.isPending}
                className="w-full sm:w-auto"
                aria-describedby="add-submit-help"
              >
                {addVehicleMutation.isPending ? "Se adaugă..." : "Adaugă Vehicul"}
              </Button>
            </div>
            <div className="sr-only">
              <p id="add-cancel-help">Anulează adăugarea vehiculului și închide dialogul</p>
              <p id="add-submit-help">Adaugă vehiculul nou în stoc</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Caută după marcă sau model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toate vehiculele</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 sm:w-16">ID</TableHead>
                <TableHead className="min-w-32 sm:min-w-40">Marcă/Model</TableHead>
                <TableHead className="hidden sm:table-cell">An</TableHead>
                <TableHead className="hidden sm:table-cell">KM</TableHead>
                <TableHead className="min-w-20 sm:min-w-24">Preț</TableHead>
                <TableHead className="hidden lg:table-cell">Status</TableHead>
                <TableHead className="w-20 sm:w-24">Acțiuni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      <span className="ml-2">Se încarcă...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredVehicles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center">
                      <Car className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-gray-500">Nu s-au găsit vehicule</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-mono text-xs sm:text-sm">{vehicle.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm sm:text-base">{vehicle.marca}</span>
                        <span className="text-xs sm:text-sm text-gray-500">{vehicle.model}</span>
                        <div className="sm:hidden text-xs text-gray-500">
                          {vehicle.an} • {vehicle.km.toLocaleString()} km
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{vehicle.an}</TableCell>
                    <TableCell className="hidden sm:table-cell">{vehicle.km.toLocaleString()}</TableCell>
                    <TableCell className="font-semibold">€{vehicle.pret.toLocaleString()}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge variant={vehicle.status === 'active' ? 'default' : 'secondary'}>
                        {vehicle.status === 'active' ? 'Activ' : 'Inactiv'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditVehicle(vehicle)}
                          className="h-8 w-8 p-0 sm:h-9 sm:w-9"
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 sm:h-9 sm:w-9 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Șterge vehiculul</AlertDialogTitle>
                              <AlertDialogDescription>
                                Ești sigur că vrei să ștergi acest vehicul? Această acțiune nu poate fi anulată.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Anulează</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteVehicle(vehicle.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Șterge
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default StockManagement;
