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
    status: "active"
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
        status: "active"
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
      const { error } = await supabase
        .from('stock')
        .update(data)
        .eq('id', id);

      if (error) throw error;
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
      status: vehicle.status
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
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestionare Stoc Vehicule</h2>
          <p className="text-gray-600">Administrează vehiculele din stocul platformei</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adaugă Vehicul
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adaugă Vehicul Nou</DialogTitle>
              <DialogDescription>
                Completează informațiile despre vehiculul nou
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="marca">Marcă *</Label>
                <Input
                  id="marca"
                  value={formData.marca}
                  onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                  placeholder="BMW"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="X5"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="an">An *</Label>
                <Input
                  id="an"
                  type="number"
                  value={formData.an}
                  onChange={(e) => setFormData({ ...formData, an: parseInt(e.target.value) })}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pret">Preț (€) *</Label>
                <Input
                  id="pret"
                  type="number"
                  value={formData.pret}
                  onChange={(e) => setFormData({ ...formData, pret: parseInt(e.target.value) })}
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="km">Kilometri *</Label>
                <Input
                  id="km"
                  type="number"
                  value={formData.km}
                  onChange={(e) => setFormData({ ...formData, km: parseInt(e.target.value) })}
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="combustibil">Combustibil *</Label>
                <Select value={formData.combustibil} onValueChange={(value) => setFormData({ ...formData, combustibil: value })}>
                  <SelectTrigger>
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
                  <SelectTrigger>
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
                <Label htmlFor="caroserie">Tip Caroserie *</Label>
                <Select value={formData.caroserie} onValueChange={(value) => setFormData({ ...formData, caroserie: value })}>
                  <SelectTrigger>
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
                  value={formData.culoare}
                  onChange={(e) => setFormData({ ...formData, culoare: e.target.value })}
                  placeholder="Negru Safir"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vin">Vin</Label>
                <Input
                  id="vin"
                  value={formData.vin}
                  onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                  placeholder="WBA3A9C50EP000000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="negociabil">Negociabil</Label>
                <Select value={formData.negociabil ? "true" : "false"} onValueChange={(value) => setFormData({ ...formData, negociabil: value === "true" })}>
                  <SelectTrigger>
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
                  <SelectTrigger>
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
                value={formData.descriere}
                onChange={(e) => setFormData({ ...formData, descriere: e.target.value })}
                placeholder="Descrierea vehiculului..."
                rows={3}
              />
            </div>
            
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Fotografii Vehicul</Label>
              <AdminUploadGallery
                onImagesChange={(imageUrls) => {
                  // Store image URLs for later upload
                  setImages(imageUrls as any);
                }}
                minImages={1}
                maxImages={10}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Anulează
              </Button>
              <Button 
                onClick={handleAddVehicle}
                disabled={addVehicleMutation.isPending}
              >
                {addVehicleMutation.isPending ? "Se adaugă..." : "Adaugă Vehicul"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Caută după marcă sau model..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrează după stare" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toate</SelectItem>
                <SelectItem value="active">Activ</SelectItem>
                <SelectItem value="inactive">Inactiv</SelectItem>
                <SelectItem value="sold">Vândute</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vehicles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicule în Stoc</CardTitle>
          <CardDescription>
            {filteredVehicles.length} vehicule găsite
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Se încarcă...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicul</TableHead>
                    <TableHead>Preț</TableHead>
                    <TableHead>Stare</TableHead>
                    <TableHead>Locație</TableHead>
                    <TableHead>Data Adăugării</TableHead>
                    <TableHead>Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Car className="h-6 w-6 text-gray-500" />
                          </div>
                          <div>
                            <div className="font-medium">{vehicle.marca} {vehicle.model}</div>
                            <div className="text-sm text-gray-500">
                              {vehicle.an} • {vehicle.km.toLocaleString()} km
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">€{vehicle.pret.toLocaleString()}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={vehicle.status === 'active' ? 'default' : 'secondary'}>
                          {vehicle.status === 'active' ? 'Activ' : 
                           vehicle.status === 'inactive' ? 'Inactiv' : 'Vândut'}
                        </Badge>
                      </TableCell>
                      <TableCell>{/* Locație is not in StockVehicle, so it's empty */}</TableCell>
                      <TableCell>
                        {new Date(vehicle.created_at).toLocaleDateString('ro-RO')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditVehicle(vehicle)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Ești sigur?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Această acțiune nu poate fi anulată. Vehiculul va fi șters definitiv din stoc.
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
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Vehicle Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editează Vehicul</DialogTitle>
            <DialogDescription>
              Modifică informațiile despre vehicul
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-marca">Marcă *</Label>
              <Input
                id="edit-marca"
                value={formData.marca}
                onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                placeholder="BMW"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-model">Model *</Label>
              <Input
                id="edit-model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="X5"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-an">An *</Label>
              <Input
                id="edit-an"
                type="number"
                value={formData.an}
                onChange={(e) => setFormData({ ...formData, an: parseInt(e.target.value) })}
                min="1900"
                max={new Date().getFullYear() + 1}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-pret">Preț (€) *</Label>
              <Input
                id="edit-pret"
                type="number"
                value={formData.pret}
                onChange={(e) => setFormData({ ...formData, pret: parseInt(e.target.value) })}
                min="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-km">Kilometri *</Label>
              <Input
                id="edit-km"
                type="number"
                value={formData.km}
                onChange={(e) => setFormData({ ...formData, km: parseInt(e.target.value) })}
                min="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-combustibil">Combustibil *</Label>
              <Select value={formData.combustibil} onValueChange={(value) => setFormData({ ...formData, combustibil: value })}>
                <SelectTrigger>
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
              <Label htmlFor="edit-transmisie">Transmisie *</Label>
              <Select value={formData.transmisie} onValueChange={(value) => setFormData({ ...formData, transmisie: value })}>
                <SelectTrigger>
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
              <Label htmlFor="edit-caroserie">Tip Caroserie *</Label>
              <Select value={formData.caroserie} onValueChange={(value) => setFormData({ ...formData, caroserie: value })}>
                <SelectTrigger>
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
              <Label htmlFor="edit-culoare">Culoare</Label>
              <Input
                id="edit-culoare"
                value={formData.culoare}
                onChange={(e) => setFormData({ ...formData, culoare: e.target.value })}
                placeholder="Negru Safir"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-vin">Vin</Label>
              <Input
                id="edit-vin"
                value={formData.vin}
                onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                placeholder="WBA3A9C50EP000000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-negociabil">Negociabil</Label>
              <Select value={formData.negociabil ? "true" : "false"} onValueChange={(value) => setFormData({ ...formData, negociabil: value === "true" })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Da</SelectItem>
                  <SelectItem value="false">Nu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'inactive' })}>
                <SelectTrigger>
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
            <Label htmlFor="edit-descriere">Descriere</Label>
            <Textarea
              id="edit-descriere"
              value={formData.descriere}
              onChange={(e) => setFormData({ ...formData, descriere: e.target.value })}
              placeholder="Descrierea vehiculului..."
              rows={3}
            />
          </div>
          
          {/* Image Upload for Edit */}
          <div className="space-y-2">
            <Label>Fotografii Vehicul</Label>
            <AdminUploadGallery
              onImagesChange={(imageUrls) => {
                // Store image URLs for later update
                setImages(imageUrls as any);
              }}
              minImages={1}
              maxImages={10}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Anulează
            </Button>
            <Button 
              onClick={handleUpdateVehicle}
              disabled={updateVehicleMutation.isPending}
            >
              {updateVehicleMutation.isPending ? "Se actualizează..." : "Actualizează"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockManagement;
