import { useState } from "react";
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
import { Vehicle } from "@/types/vehicle";

interface VehicleFormData {
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  engineCapacity: number;
  horsePower: number;
  color: string;
  description: string;
  location: string;
  condition: string;
}

const StockManagement = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState<VehicleFormData>({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    fuelType: "benzina",
    transmission: "automata",
    bodyType: "berlina",
    engineCapacity: 0,
    horsePower: 0,
    color: "",
    description: "",
    location: "",
    condition: "second-hand"
  });

  // Fetch vehicles
  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["admin-vehicles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
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
        .from('vehicles')
        .insert([{
          ...data,
          images: [],
          mainImage: "",
          badges: [],
          features: [],
          dateAdded: new Date().toISOString(),
          isUrgent: false,
          isPromoted: false,
          financing: { available: true }
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      setIsAddDialogOpen(false);
      setFormData({
        brand: "",
        model: "",
        year: new Date().getFullYear(),
        price: 0,
        mileage: 0,
        fuelType: "benzina",
        transmission: "automata",
        bodyType: "berlina",
        engineCapacity: 0,
        horsePower: 0,
        color: "",
        description: "",
        location: "",
        condition: "second-hand"
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
        .from('vehicles')
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
        .from('vehicles')
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
    addVehicleMutation.mutate(formData);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price,
      mileage: vehicle.mileage,
      fuelType: vehicle.fuelType,
      transmission: vehicle.transmission,
      bodyType: vehicle.bodyType,
      engineCapacity: vehicle.engineCapacity,
      horsePower: vehicle.horsePower,
      color: vehicle.color,
      description: vehicle.description,
      location: vehicle.location,
      condition: vehicle.condition
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateVehicle = () => {
    if (editingVehicle) {
      updateVehicleMutation.mutate({ id: editingVehicle.id, data: formData });
    }
  };

  const handleDeleteVehicle = (id: string) => {
    deleteVehicleMutation.mutate(id);
  };

  const filteredVehicles = vehicles?.filter(vehicle => {
    const matchesSearch = vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || vehicle.condition === filterType;
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
                <Label htmlFor="brand">Marcă *</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
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
                <Label htmlFor="year">An *</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Preț (€) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mileage">Kilometri *</Label>
                <Input
                  id="mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })}
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fuelType">Combustibil *</Label>
                <Select value={formData.fuelType} onValueChange={(value) => setFormData({ ...formData, fuelType: value })}>
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
                <Label htmlFor="transmission">Transmisie *</Label>
                <Select value={formData.transmission} onValueChange={(value) => setFormData({ ...formData, transmission: value })}>
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
                <Label htmlFor="bodyType">Tip Caroserie *</Label>
                <Select value={formData.bodyType} onValueChange={(value) => setFormData({ ...formData, bodyType: value })}>
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
                <Label htmlFor="engineCapacity">Capacitate Motor (cc)</Label>
                <Input
                  id="engineCapacity"
                  type="number"
                  value={formData.engineCapacity}
                  onChange={(e) => setFormData({ ...formData, engineCapacity: parseInt(e.target.value) })}
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="horsePower">Cai Putere</Label>
                <Input
                  id="horsePower"
                  type="number"
                  value={formData.horsePower}
                  onChange={(e) => setFormData({ ...formData, horsePower: parseInt(e.target.value) })}
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="color">Culoare</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="Negru Safir"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="condition">Stare *</Label>
                <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map(condition => (
                      <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Locație</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="București"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descriere</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrierea vehiculului..."
                rows={3}
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
                <SelectItem value="nou">Nou</SelectItem>
                <SelectItem value="second-hand">Second Hand</SelectItem>
                <SelectItem value="demo">Demo</SelectItem>
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
                            <div className="font-medium">{vehicle.brand} {vehicle.model}</div>
                            <div className="text-sm text-gray-500">
                              {vehicle.year} • {vehicle.mileage.toLocaleString()} km
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">€{vehicle.price.toLocaleString()}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={vehicle.condition === 'nou' ? 'default' : 'secondary'}>
                          {vehicle.condition === 'nou' ? 'Nou' : 
                           vehicle.condition === 'second-hand' ? 'Second Hand' : 'Demo'}
                        </Badge>
                      </TableCell>
                      <TableCell>{vehicle.location}</TableCell>
                      <TableCell>
                        {new Date(vehicle.dateAdded).toLocaleDateString('ro-RO')}
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
              <Label htmlFor="edit-brand">Marcă *</Label>
              <Input
                id="edit-brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
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
              <Label htmlFor="edit-year">An *</Label>
              <Input
                id="edit-year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                min="1900"
                max={new Date().getFullYear() + 1}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-price">Preț (€) *</Label>
              <Input
                id="edit-price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                min="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-mileage">Kilometri *</Label>
              <Input
                id="edit-mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })}
                min="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-fuelType">Combustibil *</Label>
              <Select value={formData.fuelType} onValueChange={(value) => setFormData({ ...formData, fuelType: value })}>
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
              <Label htmlFor="edit-transmission">Transmisie *</Label>
              <Select value={formData.transmission} onValueChange={(value) => setFormData({ ...formData, transmission: value })}>
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
              <Label htmlFor="edit-bodyType">Tip Caroserie *</Label>
              <Select value={formData.bodyType} onValueChange={(value) => setFormData({ ...formData, bodyType: value })}>
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
              <Label htmlFor="edit-engineCapacity">Capacitate Motor (cc)</Label>
              <Input
                id="edit-engineCapacity"
                type="number"
                value={formData.engineCapacity}
                onChange={(e) => setFormData({ ...formData, engineCapacity: parseInt(e.target.value) })}
                min="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-horsePower">Cai Putere</Label>
              <Input
                id="edit-horsePower"
                type="number"
                value={formData.horsePower}
                onChange={(e) => setFormData({ ...formData, horsePower: parseInt(e.target.value) })}
                min="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-color">Culoare</Label>
              <Input
                id="edit-color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="Negru Safir"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-condition">Stare *</Label>
              <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map(condition => (
                    <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-location">Locație</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="București"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-description">Descriere</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrierea vehiculului..."
              rows={3}
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
