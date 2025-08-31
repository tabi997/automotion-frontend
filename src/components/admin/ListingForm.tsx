import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { createListing, updateListing } from "@/lib/admin";
import type { Database } from "@/integrations/supabase/types";

type StockRow = Database["public"]["Tables"]["stock"]["Row"];
type StockInsert = Database["public"]["Tables"]["stock"]["Insert"];

const listingSchema = z.object({
  marca: z.string().min(1, "Marca este obligatorie"),
  model: z.string().min(1, "Modelul este obligatoriu"),
  an: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  km: z.coerce.number().min(0, "Kilometrajul nu poate fi negativ"),
  pret: z.coerce.number().min(1, "Prețul este obligatoriu"),
  combustibil: z.string().min(1, "Combustibilul este obligatoriu"),
  transmisie: z.string().min(1, "Transmisia este obligatorie"),
  caroserie: z.string().min(1, "Caroseria este obligatorie"),
  culoare: z.string().optional(),
  vin: z.string().optional(),
  negociabil: z.boolean().default(false),
  descriere: z.string().optional(),
  status: z.string().default("active"),
});

type ListingFormData = z.infer<typeof listingSchema>;

interface ListingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing?: StockRow | null;
  onSuccess: () => void;
}

const combustibilOptions = ["Benzină", "Diesel", "Electric", "Hibrid", "Plug-in Hybrid", "GPL"];
const transmisieOptions = ["Manuală", "Automată", "CVT", "Semi-automată"];
const caroserieOptions = ["Sedan", "Hatchback", "Break", "SUV", "Coupe", "Cabrio", "Van", "Pickup"];

export default function ListingForm({ open, onOpenChange, listing, onSuccess }: ListingFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const isEditing = !!listing;

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      marca: listing?.marca || "",
      model: listing?.model || "",
      an: listing?.an || new Date().getFullYear(),
      km: listing?.km || 0,
      pret: listing?.pret || 0,
      combustibil: listing?.combustibil || "",
      transmisie: listing?.transmisie || "",
      caroserie: listing?.caroserie || "",
      culoare: listing?.culoare || "",
      vin: listing?.vin || "",
      negociabil: listing?.negociabil || false,
      descriere: listing?.descriere || "",
      status: listing?.status || "active",
    },
  });

  const onSubmit = async (data: ListingFormData) => {
    setLoading(true);
    try {
      if (isEditing && listing) {
        await updateListing(listing.id, data);
        toast({
          title: "Anunț actualizat",
          description: "Anunțul a fost actualizat cu succes.",
        });
      } else {
        await createListing(data);
        toast({
          title: "Anunț creat",
          description: "Anunțul a fost creat cu succes.",
        });
      }
      onSuccess();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Eroare",
        description: error instanceof Error ? error.message : "A apărut o eroare neașteptată.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="marca">Marca *</Label>
              <Input
                id="marca"
                {...form.register("marca")}
                placeholder="ex: BMW"
              />
              {form.formState.errors.marca && (
                <p className="text-sm text-red-600">{form.formState.errors.marca.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                {...form.register("model")}
                placeholder="ex: X5"
              />
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
                    <SelectItem key={option} value={option}>
                      {option}
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
                    <SelectItem key={option} value={option}>
                      {option}
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
                    <SelectItem key={option} value={option}>
                      {option}
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="descriere">Descriere</Label>
            <Textarea
              id="descriere"
              {...form.register("descriere")}
              placeholder="Descriere detaliată a vehiculului..."
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="negociabil"
              checked={form.watch("negociabil")}
              onCheckedChange={(checked) => form.setValue("negociabil", checked as boolean)}
            />
            <Label htmlFor="negociabil">Preț negociabil</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Anulează
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Se salvează..." : isEditing ? "Actualizează" : "Creează"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
