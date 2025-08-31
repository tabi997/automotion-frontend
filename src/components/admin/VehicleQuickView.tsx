import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { StockVehicle } from "@/types/vehicle";
import { Car, Calendar, Gauge, Euro, MapPin, Settings, Palette, Hash, FileText, Star, Clock, CheckCircle, XCircle, Info, ArrowLeft } from "lucide-react";

interface VehicleQuickViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: StockVehicle | null;
}

const VehicleQuickView = ({ open, onOpenChange, vehicle }: VehicleQuickViewProps) => {
  if (!vehicle) return null;

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            {vehicle.marca} {vehicle.model}
          </DialogTitle>
          <DialogDescription>
            Detalii complete despre vehicul
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header cu informații principale */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">
                    {vehicle.marca} {vehicle.model}
                  </CardTitle>
                  <div className="flex items-center gap-2 mb-3">
                    {getStatusBadge(vehicle.status)}
                    {vehicle.negociabil && (
                      <Badge variant="outline">Negociabil</Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">
                    €{vehicle.pret.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Preț</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-blue-600">{vehicle.an}</div>
                  <div className="text-sm text-gray-500">An</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-purple-600">
                    {vehicle.km.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Kilometri</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-orange-600">
                    {vehicle.combustibil}
                  </div>
                  <div className="text-sm text-gray-500">Combustibil</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-indigo-600">
                    {vehicle.transmisie}
                  </div>
                  <div className="text-sm text-gray-500">Transmisie</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Imagini */}
          {vehicle.images && vehicle.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Fotografii ({vehicle.images.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {vehicle.images.map((image, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={image} 
                        alt={`${vehicle.marca} ${vehicle.model} - Imagine ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Specificații tehnice */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Specificații tehnice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Marcă</span>
                    <span className="font-medium">{vehicle.marca}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Model</span>
                    <span className="font-medium">{vehicle.model}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">An</span>
                    <span className="font-medium">{vehicle.an}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Kilometraj</span>
                    <span className="font-medium">{vehicle.km.toLocaleString()} km</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Combustibil</span>
                    <span className="font-medium capitalize">{vehicle.combustibil}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Transmisie</span>
                    <span className="font-medium capitalize">{vehicle.transmisie}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Caroserie</span>
                    <span className="font-medium capitalize">{vehicle.caroserie}</span>
                  </div>
                  {vehicle.culoare && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Culoare</span>
                      <span className="font-medium">{vehicle.culoare}</span>
                    </div>
                  )}
                  {vehicle.vin && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">VIN</span>
                      <span className="font-medium font-mono text-sm">{vehicle.vin}</span>
                    </div>
                  )}
                  {vehicle.openlane_url && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">OpenLane</span>
                      <a 
                        href={vehicle.openlane_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                      >
                        Vezi licitația
                        <ArrowLeft className="h-3 w-3 rotate-180" />
                      </a>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Preț negociabil</span>
                    <span className="font-medium">
                      {vehicle.negociabil ? "Da" : "Nu"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Descriere */}
          {vehicle.descriere && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Descriere
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {vehicle.descriere}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Informații despre anunț */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Informații despre anunț
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Creat la:</span>
                  </div>
                  <div className="font-medium">{formatDate(vehicle.created_at)}</div>
                </div>

                {vehicle.updated_at && vehicle.updated_at !== vehicle.created_at && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Actualizat la:</span>
                    </div>
                    <div className="font-medium">{formatDate(vehicle.updated_at)}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Butoane de acțiune */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Închide
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleQuickView;
