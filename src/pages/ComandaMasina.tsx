"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/common/Badge';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { 
  Car, 
  CheckCircle, 
  ArrowLeft,
  Calendar,
  Gauge,
  Palette,
  Euro,
  Clock,
  Phone,
  Mail,
  User
} from 'lucide-react';
import { createOrderLead } from '@/lib/admin';
import { useToast } from '@/hooks/use-toast';

const brands = [
  'BMW', 'Mercedes-Benz', 'Audi', 'Porsche', 'Tesla', 'Range Rover',
  'Volkswagen', 'Volvo', 'Lexus', 'Jaguar', 'Land Rover', 'Alfa Romeo',
  'Ferrari', 'Lamborghini', 'Maserati', 'Bentley', 'Rolls-Royce', 'Aston Martin'
];

const fuelTypes = ['Benzină', 'Motorină', 'Hibrid', 'Electric', 'GPL'];
const transmissions = ['Manuală', 'Automată', 'CVT'];
const bodyTypes = ['Berlina', 'Break', 'SUV', 'Coupe', 'Cabriolet', 'Hatchback', 'Monovolum'];
const colors = ['Alb', 'Negru', 'Gri', 'Roșu', 'Albastru', 'Verde', 'Galben', 'Portocaliu', 'Maro', 'Bej'];

export default function ComandaMasina() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState({
    marca: '',
    model: '',
    an_min: '',
    an_max: '',
    km_max: '',
    combustibil: '',
    transmisie: '',
    caroserie: '',
    culoare: '',
    pret_max: '',
    pret_min: '',
    caracteristici_speciale: [] as string[],
    urgent: false,
    observatii: '',
    nume: '',
    telefon: '',
    email: '',
    preferinta_contact: '',
    interval_orar: '',
    gdpr: false
  });

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSpecialFeaturesChange = (feature: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      caracteristici_speciale: checked 
        ? [...prev.caracteristici_speciale, feature]
        : prev.caracteristici_speciale.filter(f => f !== feature)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.gdpr) {
      toast({
        title: "Eroare",
        description: "Trebuie să accepți termenii GDPR pentru a continua.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        ...formData,
        an_min: formData.an_min ? parseInt(formData.an_min) : null,
        an_max: formData.an_max ? parseInt(formData.an_max) : null,
        km_max: formData.km_max ? parseInt(formData.km_max) : null,
        pret_max: formData.pret_max ? parseFloat(formData.pret_max) : null,
        pret_min: formData.pret_min ? parseFloat(formData.pret_min) : null,
        status: 'new'
      };

      const { error } = await createOrderLead(orderData);
      
      if (error) {
        throw error;
      }

      setSubmitSuccess(true);
      toast({
        title: "Succes!",
        description: "Cererea ta de comandă a fost trimisă cu succes. Te vom contacta în cel mai scurt timp.",
      });

      // Reset form
      setFormData({
        marca: '',
        model: '',
        an_min: '',
        an_max: '',
        km_max: '',
        combustibil: '',
        transmisie: '',
        caroserie: '',
        culoare: '',
        pret_max: '',
        pret_min: '',
        caracteristici_speciale: [],
        urgent: false,
        observatii: '',
        nume: '',
        telefon: '',
        email: '',
        preferinta_contact: '',
        interval_orar: '',
        gdpr: false
      });

    } catch (error) {
      toast({
        title: "Eroare",
        description: error instanceof Error ? error.message : "A apărut o eroare neașteptată.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Section className="pt-24 pb-12">
          <Container>
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-success" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-success">
                Cererea trimisă cu succes!
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Mulțumim pentru cererea ta de comandă mașină. Echipa noastră va analiza cerințele tale 
                și te va contacta în cel mai scurt timp pentru a discuta opțiunile disponibile.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" size="lg" onClick={() => setSubmitSuccess(false)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Comandă altă mașină
                </Button>
                
                <Button variant="hero" size="lg" onClick={() => navigate('/')}>
                  Înapoi la Homepage
                </Button>
              </div>
            </div>
          </Container>
        </Section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <Section className="pt-24 pb-12">
        <Container>
          <div className="text-center space-y-6">
            <Badge variant="outline" className="mx-auto">
              <Car className="h-4 w-4 mr-2" />
              Comandă Personalizată
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold automotive-gradient-text">
              Comandă mașina perfectă pentru tine
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Nu ai găsit mașina dorită în stocul nostru? Comandă exact vehiculul pe care îl vrei 
              și îl vom găsi pentru tine în cel mai scurt timp posibil.
            </p>
          </div>
        </Container>
      </Section>

      {/* Form Section */}
      <Section>
        <Container>
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Car Preferences */}
              <div className="automotive-card p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Car className="h-6 w-6 mr-3 text-primary" />
                  Preferințe Mașină
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="marca">Marca *</Label>
                    <Select value={formData.marca} onValueChange={(value) => handleInputChange('marca', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează marca" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">Model (opțional)</Label>
                    <Input
                      id="model"
                      placeholder="ex: X5, A4, C-Class"
                      value={formData.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="an_min">An minim</Label>
                    <Input
                      id="an_min"
                      type="number"
                      min="1995"
                      max={new Date().getFullYear()}
                      placeholder="1995"
                      value={formData.an_min}
                      onChange={(e) => handleInputChange('an_min', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="an_max">An maxim</Label>
                    <Input
                      id="an_max"
                      type="number"
                      min="1995"
                      max={new Date().getFullYear()}
                      placeholder={new Date().getFullYear().toString()}
                      value={formData.an_max}
                      onChange={(e) => handleInputChange('an_max', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="km_max">Kilometri maximi</Label>
                    <Input
                      id="km_max"
                      type="number"
                      min="0"
                      placeholder="ex: 100000"
                      value={formData.km_max}
                      onChange={(e) => handleInputChange('km_max', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="combustibil">Combustibil</Label>
                    <Select value={formData.combustibil} onValueChange={(value) => handleInputChange('combustibil', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează combustibilul" />
                      </SelectTrigger>
                      <SelectContent>
                        {fuelTypes.map((fuel) => (
                          <SelectItem key={fuel} value={fuel}>
                            {fuel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transmisie">Transmisie</Label>
                    <Select value={formData.transmisie} onValueChange={(value) => handleInputChange('transmisie', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează transmisia" />
                      </SelectTrigger>
                      <SelectContent>
                        {transmissions.map((transmission) => (
                          <SelectItem key={transmission} value={transmission}>
                            {transmission}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="caroserie">Tip caroserie</Label>
                    <Select value={formData.caroserie} onValueChange={(value) => handleInputChange('caroserie', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează tipul caroseriei" />
                      </SelectTrigger>
                      <SelectContent>
                        {bodyTypes.map((bodyType) => (
                          <SelectItem key={bodyType} value={bodyType}>
                            {bodyType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="culoare">Culoare</Label>
                    <Select value={formData.culoare} onValueChange={(value) => handleInputChange('culoare', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează culoarea" />
                      </SelectTrigger>
                      <SelectContent>
                        {colors.map((color) => (
                          <SelectItem key={color} value={color}>
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pret_min">Preț minim (€)</Label>
                    <Input
                      id="pret_min"
                      type="number"
                      min="1000"
                      placeholder="ex: 15000"
                      value={formData.pret_min}
                      onChange={(e) => handleInputChange('pret_min', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pret_max">Preț maxim (€)</Label>
                    <Input
                      id="pret_max"
                      type="number"
                      min="1000"
                      placeholder="ex: 50000"
                      value={formData.pret_max}
                      onChange={(e) => handleInputChange('pret_max', e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <Label>Caracteristici speciale (opțional)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        'Navigație', 'Scaune încălzite', 'Scaune răcorite', 'Panoramic roof',
                        'Senzori parcare', 'Camera marșarier', 'Cruise control', 'Bluetooth',
                        'Apple CarPlay', 'Android Auto', 'Suspensie sport', 'Jante aliaj'
                      ].map((feature) => (
                        <div key={feature} className="flex items-center space-x-2">
                          <Checkbox
                            id={feature}
                            checked={formData.caracteristici_speciale.includes(feature)}
                            onCheckedChange={(checked) => 
                              handleSpecialFeaturesChange(feature, checked as boolean)
                            }
                          />
                          <Label htmlFor={feature} className="text-sm">{feature}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="urgent"
                      checked={formData.urgent}
                      onCheckedChange={(checked) => handleInputChange('urgent', checked as boolean)}
                    />
                    <Label htmlFor="urgent">Cerere urgentă</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="observatii">Observații suplimentare</Label>
                    <Textarea
                      id="observatii"
                      placeholder="Descrie alte preferințe sau cerințe speciale..."
                      value={formData.observatii}
                      onChange={(e) => handleInputChange('observatii', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="automotive-card p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <User className="h-6 w-6 mr-3 text-primary" />
                  Informații Contact
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nume">Nume complet *</Label>
                    <Input
                      id="nume"
                      placeholder="Numele tău complet"
                      value={formData.nume}
                      onChange={(e) => handleInputChange('nume', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefon">Telefon *</Label>
                    <Input
                      id="telefon"
                      type="tel"
                      placeholder="+40 721 234 567"
                      value={formData.telefon}
                      onChange={(e) => handleInputChange('telefon', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferinta_contact">Preferință contact</Label>
                    <Select value={formData.preferinta_contact} onValueChange={(value) => handleInputChange('preferinta_contact', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează preferința" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="telefon">Telefon</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interval_orar">Interval orar preferat</Label>
                    <Select value={formData.interval_orar} onValueChange={(value) => handleInputChange('interval_orar', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează intervalul" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dimineata">Dimineața (9:00-12:00)</SelectItem>
                        <SelectItem value="dupa_amiaza">După-amiaza (12:00-17:00)</SelectItem>
                        <SelectItem value="seara">Seara (17:00-20:00)</SelectItem>
                        <SelectItem value="orice">Orice oră</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* GDPR Consent */}
              <div className="automotive-card p-6">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="gdpr"
                    checked={formData.gdpr}
                    onCheckedChange={(checked) => handleInputChange('gdpr', checked as boolean)}
                    required
                  />
                  <div className="space-y-2">
                    <Label htmlFor="gdpr" className="text-sm">
                      Accept să îmi procesez datele personale conform{" "}
                      <a href="/gdpr" className="text-primary hover:underline">
                        politicii de confidențialitate
                      </a>
                      . *
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Datele tale vor fi folosite exclusiv pentru a-ți procesa cererea de comandă mașină 
                      și pentru a te contacta în acest scop.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <Button 
                  type="submit" 
                  variant="hero" 
                  size="xl" 
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Se trimite...
                    </>
                  ) : (
                    <>
                      <Car className="mr-2 h-5 w-5" />
                      Trimite cererea de comandă
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Container>
      </Section>
      
      <Footer />
    </div>
  );
}
