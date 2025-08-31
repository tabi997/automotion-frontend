import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getStock, deleteListing } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Loader2,
  Eye,
  Car
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ListingForm from "@/components/admin/ListingForm";
import type { Database } from "@/integrations/supabase/types";

type StockRow = Database["public"]["Tables"]["stock"]["Row"];

export default function Stock() {
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<StockRow | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingListing, setDeletingListing] = useState<StockRow | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stock, isLoading, error } = useQuery({
    queryKey: ["stock"],
    queryFn: getStock,
  });

  const filteredStock = stock?.filter(item => 
    item.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.culoare?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vin?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleEdit = (listing: StockRow) => {
    setEditingListing(listing);
    setFormOpen(true);
  };

  const handleDelete = (listing: StockRow) => {
    setDeletingListing(listing);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingListing) return;

    try {
      await deleteListing(deletingListing.id);
      toast({
        title: "Anunț șters",
        description: "Anunțul a fost șters cu succes.",
      });
      queryClient.invalidateQueries({ queryKey: ["stock"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    } catch (error) {
      toast({
        title: "Eroare la ștergere",
        description: error instanceof Error ? error.message : "A apărut o eroare neașteptată.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setDeletingListing(null);
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["stock"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingListing(null);
  };

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        Eroare la încărcarea anunțurilor: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestionare Anunțuri</h1>
          <p className="text-gray-600 mt-2">
            Gestionează anunțurile de vehicule din stoc
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adaugă Anunț
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Caută după marcă, model, culoare sau VIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredStock.length === 0 ? (
          <div className="text-center py-12">
            <Car className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {searchTerm ? "Nu s-au găsit anunțuri" : "Nu există anunțuri"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm 
                ? "Încearcă să modifici termenii de căutare" 
                : "Începe prin a adăuga primul anunț"
              }
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicul</TableHead>
                <TableHead>An</TableHead>
                <TableHead>KM</TableHead>
                <TableHead>Preț</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Acțiuni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStock.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {item.marca} {item.model}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.caroserie} • {item.combustibil} • {item.transmisie}
                      </div>
                      {item.culoare && (
                        <div className="text-sm text-gray-500">
                          Culoare: {item.culoare}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{item.an}</TableCell>
                  <TableCell>{item.km.toLocaleString()} km</TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {item.pret.toLocaleString()} €
                    </div>
                    {item.negociabil && (
                      <Badge variant="secondary" className="text-xs">
                        Negociabil
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={item.status === 'active' ? 'default' : 'secondary'}
                    >
                      {item.status === 'active' ? 'Activ' : item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Add/Edit Form */}
      <ListingForm
        open={formOpen}
        onOpenChange={handleFormClose}
        listing={editingListing}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ești sigur?</AlertDialogTitle>
            <AlertDialogDescription>
              Această acțiune nu poate fi anulată. Anunțul "{deletingListing?.marca} {deletingListing?.model}" va fi șters definitiv din baza de date.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Șterge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
