import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { AdminUploadGallery } from "./AdminUploadGallery";
import { StockVehicle } from "@/types/vehicle";
import { createListing, updateListing } from "@/lib/admin";
import { Car, Image, FileText } from "lucide-react";
import { carBrands } from "@/data/carBrands";

// Schema de validare care se potrivește exact cu baza de date
const vehicleSchema = z.object({
  marca: z.string().min(2, "Marca trebuie să aibă cel puțin 2 caractere"),
  model: z.string().min(2, "Modelul trebuie să aibă cel puțin 2 caractere"),
  an: z.coerce.number().min(1900).max(new Date().getFullYear() + 1, "Anul nu poate fi în viitor"),
  km: z.coerce.number().min(0, "Kilometrajul nu poate fi negativ").max(9999999, "Kilometrajul pare prea mare"),
  pret: z.coerce.number().min(1, "Prețul trebuie să fie mai mare decât 0").max(10000000, "Prețul pare prea mare"),
  combustibil: z.string().min(1, "Combustibilul este obligatoriu"),
  transmisie: z.string().min(1, "Transmisia este obligatorie"),
  caroserie: z.string().min(1, "Caroseria este obligatorie"),
  culoare: z.string().optional(),
  vin: z.string().optional(),
  negociabil: z.boolean().default(false),
  descriere: z.string().min(10, "Descrierea trebuie să aibă cel puțin 10 caractere").max(2000, "Descrierea este prea lungă"),
  status: z.enum(["active", "inactive", "sold", "reserved"]).default("active"),
  openlane_url: z.string().optional().refine((val) => {
    if (!val || val === "") return true; // Allow empty strings
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  }, "URL-ul OpenLane trebuie să fie valid"),
  badges: z.array(z.object({
    id: z.string(),
    text: z.string(),
    type: z.enum(["success", "warning", "info", "urgent"]),
    icon: z.string().optional(),
  })).default([]),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle?: StockVehicle | null;
  onSuccess: () => void;
}

const combustibilOptions = [
  { value: "benzina", label: "Benzină", icon: "⛽" },
  { value: "motorina", label: "Motorină", icon: "⛽" },
  { value: "electric", label: "Electric", icon: "⚡" },
  { value: "hibrid", label: "Hibrid", icon: "🔋" },
  { value: "gpl", label: "GPL", icon: "🔥" },
];

const transmisieOptions = [
  { value: "manuala", label: "Manuală", icon: "⚙️" },
  { value: "automata", label: "Automată", icon: "⚙️" },
  { value: "cvt", label: "CVT", icon: "⚙️" },
];

const caroserieOptions = [
  { value: "sedan", label: "Sedan", icon: "🚗" },
  { value: "hatchback", label: "Hatchback", icon: "🚗" },
  { value: "break", label: "Break", icon: "🚗" },
  { value: "suv", label: "SUV", icon: "🚙" },
  { value: "coupe", label: "Coupe", icon: "🏎️" },
  { value: "cabrio", label: "Cabrio", icon: "🚗" },
  { value: "van", label: "Van", icon: "🚐" },
];

const badgeOptions = [
  { id: "hot", text: "În trend", type: "urgent" as const, icon: "🔥" },
  { id: "demand", text: "Căutat", type: "warning" as const, icon: "⭐" },
  { id: "reserved", text: "Rezervat", type: "info" as const, icon: "🔒" },
  { id: "new", text: "Nou", type: "success" as const, icon: "🆕" },
  { id: "discount", text: "Ofertă", type: "warning" as const, icon: "💰" },
];

export default function VehicleForm({ open, onOpenChange, vehicle, onSuccess }: VehicleFormProps) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState(vehicle?.marca || "");
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const { toast } = useToast();
  const isEditing = !!vehicle;

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      marca: vehicle?.marca || "",
      model: vehicle?.model || "",
      an: vehicle?.an || new Date().getFullYear(),
      km: vehicle?.km || 0,
      pret: vehicle?.pret || 0,
      combustibil: vehicle?.combustibil || "",
      transmisie: vehicle?.transmisie || "",
      caroserie: vehicle?.caroserie || "",
      culoare: vehicle?.culoare || "",
      vin: vehicle?.vin || "",
      negociabil: vehicle?.negociabil || false,
      descriere: vehicle?.descriere || "Vehicul în stare excelentă, perfect întreținut, cu toate reviziile la zi. Ideal pentru familie sau uz personal. Toate documentele sunt în regulă și vehiculul este gata de înmatriculare.",
      status: (vehicle?.status as any) || "active",
      openlane_url: vehicle?.openlane_url || "",
      badges: vehicle?.badges || [],
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (vehicle) {
      form.reset({
        marca: vehicle.marca,
        model: vehicle.model,
        an: vehicle.an,
        km: vehicle.km,
        pret: vehicle.pret,
        combustibil: vehicle.combustibil,
        transmisie: vehicle.transmisie,
        caroserie: vehicle.caroserie,
        culoare: vehicle.culoare || "",
        vin: vehicle.vin || "",
        negociabil: vehicle.negociabil || false,
        descriere: vehicle.descriere || "Vehicul în stare excelentă, perfect întreținut, cu toate reviziile la zi. Ideal pentru familie sau uz personal. Toate documentele sunt în regulă și vehiculul este gata de înmatriculare.",
        status: vehicle.status as any,
        openlane_url: vehicle.openlane_url || "",
        badges: vehicle.badges || [],
      });
      setImages(vehicle.images || []);
      setSelectedBrand(vehicle.marca);
      setSelectedBadges(vehicle.badges?.map(b => b.id) || []);
    } else {
      setSelectedBrand("");
      setSelectedBadges([]);
    }
  }, [vehicle, form]);

  const onSubmit = async (data: VehicleFormData) => {
    console.log('🔍 VehicleForm: onSubmit called with data:', data);
    console.log('🔍 VehicleForm: form errors:', form.formState.errors);
    console.log('🔍 VehicleForm: images:', images);
    
    setLoading(true);
    try {
      const vehicleData = {
        marca: data.marca,
        model: data.model,
        an: data.an,
        km: data.km,
        pret: data.pret,
        combustibil: data.combustibil,
        transmisie: data.transmisie,
        caroserie: data.caroserie,
        culoare: data.culoare,
        vin: data.vin,
        negociabil: data.negociabil,
        descriere: data.descriere,
        status: data.status,
        images: images,
        openlane_url: data.openlane_url,
        badges: data.badges,
      };

      console.log('🔍 VehicleForm: vehicleData to send:', vehicleData);

      if (isEditing && vehicle) {
        const result = await updateListing(vehicle.id, vehicleData);
        if (result.error) {
          throw new Error(`Eroare la actualizare: ${result.error}`);
        }
        toast({
          title: "Anunț actualizat",
          description: "Anunțul a fost actualizat cu succes.",
        });
      } else {
        const result = await createListing(vehicleData);
        console.log('🔍 VehicleForm: createListing result:', result);
        
        if (result.error) {
          throw new Error(`Eroare la creare: ${result.error}`);
        }
        
        if (!result.data) {
          throw new Error("Anunțul nu a fost creat - nu s-au returnat date");
        }
        
        toast({
          title: "Anunț creat",
          description: "Anunțul a fost creat cu succes.",
        });
      }
      onSuccess();
      onOpenChange(false);
      form.reset();
      setImages([]);
    } catch (error) {
      console.error('🔍 VehicleForm: Error in onSubmit:', error);
      toast({
        title: "Eroare",
        description: error instanceof Error ? error.message : "A apărut o eroare neașteptată.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = form.formState.isValid && images.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            {isEditing ? "Editează Anunț" : "Adaugă Anunț Nou"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Modifică informațiile despre vehicul" 
              : "Completează informațiile despre vehiculul nou"
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                De bază
              </TabsTrigger>
              <TabsTrigger value="images" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Imagini
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Detalii
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informații de bază</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="marca">Marcă *</Label>
                      <Select
                        value={form.watch("marca")}
                        onValueChange={(value) => {
                          form.setValue("marca", value);
                          form.setValue("model", ""); // Reset model when brand changes
                          setSelectedBrand(value);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selectează marca" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                          {carBrands.map(({ brand }) => (
                            <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.marca && (
                        <p className="text-sm text-red-600">{form.formState.errors.marca.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="model">Model *</Label>
                      <Select
                        value={form.watch("model")}
                        onValueChange={(value) => form.setValue("model", value)}
                        disabled={!selectedBrand}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={selectedBrand ? "Selectează modelul" : "Selectează mai întâi marca"} />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                          {carBrands.find(b => b.brand === selectedBrand)?.models.map((model) => (
                            <SelectItem key={model} value={model}>{model}</SelectItem>
                          )) || []}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.model && (
                        <p className="text-sm text-red-600">{form.formState.errors.model.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="an">An *</Label>
                      <Input
                        id="an"
                        type="number"
                        {...form.register("an")}
                        placeholder="2020"
                      />
                      {form.formState.errors.an && (
                        <p className="text-sm text-red-600">{form.formState.errors.an.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="km">Kilometraj *</Label>
                      <Input
                        id="km"
                        type="number"
                        {...form.register("km")}
                        placeholder="50000"
                      />
                      {form.formState.errors.km && (
                        <p className="text-sm text-red-600">{form.formState.errors.km.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pret">Preț (€) *</Label>
                      <Input
                        id="pret"
                        type="number"
                        {...form.register("pret")}
                        placeholder="25000"
                      />
                      {form.formState.errors.pret && (
                        <p className="text-sm text-red-600">{form.formState.errors.pret.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="combustibil">Combustibil *</Label>
                      <Select
                        value={form.watch("combustibil")}
                        onValueChange={(value) => form.setValue("combustibil", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selectează combustibilul" />
                        </SelectTrigger>
                        <SelectContent>
                          {combustibilOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <span className="mr-2">{option.icon}</span>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.combustibil && (
                        <p className="text-sm text-red-600">{form.formState.errors.combustibil.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transmisie">Transmisie *</Label>
                      <Select
                        value={form.watch("transmisie")}
                        onValueChange={(value) => form.setValue("transmisie", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selectează transmisia" />
                        </SelectTrigger>
                        <SelectContent>
                          {transmisieOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <span className="mr-2">{option.icon}</span>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.transmisie && (
                        <p className="text-sm text-red-600">{form.formState.errors.transmisie.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="caroserie">Caroserie *</Label>
                      <Select
                        value={form.watch("caroserie")}
                        onValueChange={(value) => form.setValue("caroserie", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selectează caroseria" />
                        </SelectTrigger>
                        <SelectContent>
                          {caroserieOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <span className="mr-2">{option.icon}</span>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.caroserie && (
                        <p className="text-sm text-red-600">{form.formState.errors.caroserie.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="culoare">Culoare</Label>
                      <Input
                        id="culoare"
                        {...form.register("culoare")}
                        placeholder="ex: Alb"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vin">VIN</Label>
                      <Input
                        id="vin"
                        {...form.register("vin")}
                        placeholder="Numărul de șasiu"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="negociabil">Preț negociabil</Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="negociabil"
                          checked={form.watch("negociabil")}
                          onCheckedChange={(checked) => form.setValue("negociabil", checked as boolean)}
                        />
                        <Label htmlFor="negociabil" className="text-sm">Preț negociabil</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="images" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Fotografii vehicul</CardTitle>
                </CardHeader>
                <CardContent>
                  <AdminUploadGallery
                    onImagesChange={setImages}
                    minImages={1}
                    maxImages={15}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Detalii și opțiuni</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="descriere">Descriere *</Label>
                    <Textarea
                      id="descriere"
                      {...form.register("descriere")}
                      placeholder="Descriere detaliată a vehiculului..."
                      rows={4}
                    />
                    {form.formState.errors.descriere && (
                      <p className="text-sm text-red-600">{form.formState.errors.descriere.message}</p>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select
                      value={form.watch("status")}
                      onValueChange={(value) => form.setValue("status", value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Activ</SelectItem>
                        <SelectItem value="inactive">Inactiv</SelectItem>
                        <SelectItem value="sold">Vândut</SelectItem>
                        <SelectItem value="reserved">Rezervat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="openlane_url">URL OpenLane</Label>
                    <Input
                      id="openlane_url"
                      {...form.register("openlane_url")}
                      placeholder="https://openlane.com/listing/123456"
                    />
                    {form.formState.errors.openlane_url && (
                      <p className="text-sm text-red-600">{form.formState.errors.openlane_url.message}</p>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Badge-uri vehicul</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {badgeOptions.map((badge) => (
                        <div key={badge.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`badge-${badge.id}`}
                            checked={selectedBadges.includes(badge.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedBadges(prev => [...prev, badge.id]);
                                const currentBadges = form.getValues("badges");
                                form.setValue("badges", [...currentBadges, badge]);
                              } else {
                                setSelectedBadges(prev => prev.filter(id => id !== badge.id));
                                const currentBadges = form.getValues("badges");
                                form.setValue("badges", currentBadges.filter(b => b.id !== badge.id));
                              }
                            }}
                          />
                          <Label 
                            htmlFor={`badge-${badge.id}`} 
                            className="text-sm flex items-center gap-2 cursor-pointer"
                          >
                            <span>{badge.icon}</span>
                            {badge.text}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Badge-urile vor apărea pe fotografia vehiculului în pagina de stoc
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
            <p>Form valid: {form.formState.isValid ? "✅" : "❌"}</p>
            <p>Errors: {Object.keys(form.formState.errors).length}</p>
            <p>Images: {images.length}</p>
            <p>Final valid: {isFormValid ? "✅" : "❌"}</p>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Anulează
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !isFormValid}
              className={!isFormValid ? "opacity-50 cursor-not-allowed" : ""}
            >
              {loading ? "Se salvează..." : isEditing ? "Actualizează" : "Creează"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
