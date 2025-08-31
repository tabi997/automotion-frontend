import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/common/Badge';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { 
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Palette,
  Hash,
  FileText,
  Heart,
  Share2,
  Euro,
  Car,
  CheckCircle,
  Star
} from 'lucide-react';
import { StockAPI } from '@/lib/stockApi';
import { StockVehicle } from '@/types/vehicle';

const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<StockVehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadVehicle();
    }
  }, [id]);

  const loadVehicle = async () => {
    try {
      setLoading(true);
      const vehicles = await StockAPI.getVehicles();
      const foundVehicle = vehicles.find(v => v.id === id);
      
      if (foundVehicle) {
        setVehicle(foundVehicle);
      } else {
        setError('Vehiculul nu a fost găsit');
      }
    } catch (err) {
      setError('Eroare la încărcarea vehiculului');
      console.error('Error loading vehicle:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleContactClick = () => {
    // Navigate to contact page or open contact form
    navigate('/contact');
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: `${vehicle?.marca} ${vehicle?.model}`,
        text: `Vezi ${vehicle?.marca} ${vehicle?.model} ${vehicle?.an} la AutoOrder`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Section padding="lg" className="pt-24">
          <Container>
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3" />
              <div className="h-96 bg-muted rounded" />
              <div className="space-y-4">
                <div className="h-6 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            </div>
          </Container>
        </Section>
        <Footer />
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Section padding="lg" className="pt-24">
          <Container>
            <div className="text-center py-16">
              <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-semibold mb-2">Vehicul negăsit</h1>
              <p className="text-muted-foreground mb-6">
                {error || 'Vehiculul pe care îl cauți nu există sau a fost șters.'}
              </p>
              <Button asChild>
                <Link to="/stoc">Înapoi la stoc</Link>
              </Button>
            </div>
          </Container>
        </Section>
        <Footer />
      </div>
    );
  }

  const hasImages = vehicle.images && vehicle.images.length > 0;
  const currentImage = hasImages ? vehicle.images[currentImageIndex] : '';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Breadcrumb */}
      <Section padding="sm" className="pt-24">
        <Container>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Acasă
            </Link>
            <span>/</span>
            <Link to="/stoc" className="hover:text-foreground transition-colors">
              Stoc
            </Link>
            <span>/</span>
            <span className="text-foreground">{vehicle.marca} {vehicle.model}</span>
          </div>
        </Container>
      </Section>

      {/* Main Content */}
      <Section padding="lg">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                {hasImages ? (
                  <img
                    src={currentImage}
                    alt={`${vehicle.marca} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car className="h-24 w-24 text-muted-foreground" />
                  </div>
                )}
                
                {/* Image Navigation */}
                {hasImages && vehicle.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentImageIndex === 0}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-medium hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(prev => Math.min(vehicle.images.length - 1, prev + 1))}
                      disabled={currentImageIndex === vehicle.images.length - 1}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-medium hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {hasImages && vehicle.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {vehicle.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex 
                          ? 'border-primary' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${vehicle.marca} ${vehicle.model} - Imaginea ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      {vehicle.marca} {vehicle.model}
                    </h1>
                    <p className="text-xl text-muted-foreground">
                      {vehicle.an} • {vehicle.km.toLocaleString()} km
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">
                      €{vehicle.pret.toLocaleString()}
                    </div>
                    {vehicle.negociabil && (
                      <Badge variant="outline" className="mt-2">
                        Negociabil
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <Badge 
                    variant={vehicle.status === 'active' ? 'success' : 'secondary'}
                    className="capitalize"
                  >
                    {vehicle.status === 'active' ? 'Disponibil' : vehicle.status}
                  </Badge>
                  {vehicle.negociabil && (
                    <Badge variant="info">Negociabil</Badge>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3">
                <Button 
                  variant="premium" 
                  size="lg" 
                  className="flex-1"
                  onClick={handleContactClick}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Contactează-ne
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handleShareClick}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              {/* Key Specifications */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">An</div>
                    <div className="font-semibold">{vehicle.an}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Gauge className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Kilometraj</div>
                    <div className="font-semibold">{vehicle.km.toLocaleString()} km</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Fuel className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Combustibil</div>
                    <div className="font-semibold capitalize">{vehicle.combustibil}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Transmisie</div>
                    <div className="font-semibold capitalize">{vehicle.transmisie}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Car className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Caroserie</div>
                    <div className="font-semibold capitalize">{vehicle.caroserie}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Culoare</div>
                    <div className="font-semibold capitalize">{vehicle.culoare}</div>
                  </div>
                </div>
              </div>

              {/* VIN */}
              {vehicle.vin && (
                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                  <Hash className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">VIN</div>
                    <div className="font-mono text-sm">{vehicle.vin}</div>
                  </div>
                </div>
              )}

              {/* OpenLane Link */}
              {vehicle.openlane_url && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">OL</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-blue-700 font-medium mb-1">
                      Vezi pe OpenLane
                    </div>
                    <div className="text-xs text-blue-600">
                      Link către licitația oficială
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    <a 
                      href={vehicle.openlane_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <span>Deschide</span>
                      <ArrowLeft className="h-3 w-3 rotate-180" />
                    </a>
                  </Button>
                </div>
              )}

              {/* Description */}
              {vehicle.descriere && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Descriere
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {vehicle.descriere}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Contact CTA */}
      <Section background="muted">
        <Container>
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold mb-4">Interesat de acest vehicul?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Contactează-ne pentru mai multe detalii, programări de vizualizare sau oferte personalizate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="premium" size="lg" onClick={handleContactClick}>
                <Phone className="h-5 w-5 mr-2" />
                Sună acum
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">
                  <Mail className="h-5 w-5 mr-2" />
                  Trimite mesaj
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  );
};

export default VehicleDetail;
