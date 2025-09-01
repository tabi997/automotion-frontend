import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Car, User, Euro, Info, Shield, Search } from 'lucide-react';

interface OrderCarFormStepsProps {
  formData: any;
  updateFormData: (data: any) => void;
  isComplete?: boolean;
}

const brands = [
  'BMW', 'Mercedes-Benz', 'Audi', 'Porsche', 'Tesla', 'Range Rover',
  'Volkswagen', 'Volvo', 'Lexus', 'Jaguar', 'Land Rover', 'Alfa Romeo',
  'Ferrari', 'Lamborghini', 'Maserati', 'Bentley', 'Rolls-Royce', 'Aston Martin'
];

const fuelTypes = ['Benzină', 'Motorină', 'Hibrid', 'Electric', 'GPL'];
const transmissions = ['Manuală', 'Automată', 'CVT'];
const bodyTypes = ['Berlina', 'Break', 'SUV', 'Coupe', 'Cabriolet', 'Hatchback', 'Monovolum'];
const colors = ['Alb', 'Negru', 'Gri', 'Roșu', 'Albastru', 'Verde', 'Galben', 'Portocaliu', 'Maro', 'Bej'];

// Step 1: Car Preferences
export function CarPreferences({ formData, updateFormData }: OrderCarFormStepsProps) {
  const handleChange = (field: string, value: string | number) => {
    updateFormData({ [field]: value });
  };

  const handleSpecialFeaturesChange = (feature: string, checked: boolean) => {
    const currentFeatures = formData.caracteristici_speciale || [];
    const newFeatures = checked 
      ? [...currentFeatures, feature]
      : currentFeatures.filter((f: string) => f !== feature);
    updateFormData({ caracteristici_speciale: newFeatures });
  };

  const isComplete = formData.marca || formData.pret_min || formData.pret_max;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Search className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Preferințe mașină</h3>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Spune-ne ce tip de mașină cauți și îți vom găsi opțiunile perfecte.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="marca">Marca preferată</Label>
          <Select 
            value={formData.marca || ''} 
            onValueChange={(value) => handleChange('marca', value)}
          >
            <SelectTrigger className="mt-1">
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
          <p className="text-xs text-muted-foreground mt-1">
            Lăsând gol, căutăm în toate mărcile
          </p>
        </div>

        <div>
          <Label htmlFor="model">Model (opțional)</Label>
          <Input
            id="model"
            placeholder="ex: X5, A4, C-Class"
            value={formData.model || ''}
            onChange={(e) => handleChange('model', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="an_min">An minim</Label>
          <Input
            id="an_min"
            type="number"
            min="1995"
            max={new Date().getFullYear()}
            placeholder="1995"
            value={formData.an_min || ''}
            onChange={(e) => handleChange('an_min', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="an_max">An maxim</Label>
          <Input
            id="an_max"
            type="number"
            min="1995"
            max={new Date().getFullYear()}
            placeholder={new Date().getFullYear().toString()}
            value={formData.an_max || ''}
            onChange={(e) => handleChange('an_max', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="km_max">Kilometri maximi</Label>
          <Input
            id="km_max"
            type="number"
            min="0"
            placeholder="ex: 100000"
            value={formData.km_max || ''}
            onChange={(e) => handleChange('km_max', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="combustibil">Combustibil</Label>
          <Select 
            value={formData.combustibil || ''} 
            onValueChange={(value) => handleChange('combustibil', value)}
          >
            <SelectTrigger className="mt-1">
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

        <div>
          <Label htmlFor="transmisie">Transmisie</Label>
          <Select 
            value={formData.transmisie || ''} 
            onValueChange={(value) => handleChange('transmisie', value)}
          >
            <SelectTrigger className="mt-1">
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

        <div>
          <Label htmlFor="caroserie">Tip caroserie</Label>
          <Select 
            value={formData.caroserie || ''} 
            onValueChange={(value) => handleChange('caroserie', value)}
          >
            <SelectTrigger className="mt-1">
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

        <div>
          <Label htmlFor="culoare">Culoare</Label>
          <Select 
            value={formData.culoare || ''} 
            onValueChange={(value) => handleChange('culoare', value)}
          >
            <SelectTrigger className="mt-1">
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

        <div>
          <Label htmlFor="pret_min">Preț minim (€)</Label>
          <Input
            id="pret_min"
            type="number"
            min="1000"
            placeholder="ex: 15000"
            value={formData.pret_min || ''}
            onChange={(e) => handleChange('pret_min', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="pret_max">Preț maxim (€)</Label>
          <Input
            id="pret_max"
            type="number"
            min="1000"
            placeholder="ex: 50000"
            value={formData.pret_max || ''}
            onChange={(e) => handleChange('pret_max', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Caracteristici speciale (opțional)</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
            {[
              'Navigație', 'Scaune încălzite', 'Scaune răcorite', 'Panoramic roof',
              'Senzori parcare', 'Camera marșarier', 'Cruise control', 'Bluetooth',
              'Apple CarPlay', 'Android Auto', 'Suspensie sport', 'Jante aliaj'
            ].map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={feature}
                  checked={(formData.caracteristici_speciale || []).includes(feature)}
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
            checked={formData.urgent || false}
            onCheckedChange={(checked) => handleChange('urgent', checked as boolean)}
          />
          <Label htmlFor="urgent">Cerere urgentă</Label>
        </div>

        <div>
          <Label htmlFor="observatii">Observații suplimentare</Label>
          <Textarea
            id="observatii"
            placeholder="Descrie alte preferințe sau cerințe speciale..."
            value={formData.observatii || ''}
            onChange={(e) => handleChange('observatii', e.target.value)}
            rows={3}
            className="mt-1"
          />
        </div>
      </div>

      {isComplete && (
        <Alert className="border-green-200 bg-green-50">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Excelent! Știm ce cauți. Continuă cu datele de contact.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// Step 2: Contact Information
export function OrderContactInfo({ formData, updateFormData }: OrderCarFormStepsProps) {
  const handleChange = (field: string, value: string) => {
    updateFormData({ [field]: value });
  };

  const isComplete = formData.nume && formData.telefon && formData.email && formData.gdpr;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <User className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Informații contact</h3>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Cum te putem contacta când găsim mașina perfectă pentru tine.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nume" className="flex items-center space-x-2">
            <span>Nume complet</span>
            <Badge variant="outline" className="text-xs">Obligatoriu</Badge>
          </Label>
          <Input
            id="nume"
            placeholder="Numele tău complet"
            value={formData.nume || ''}
            onChange={(e) => handleChange('nume', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="telefon" className="flex items-center space-x-2">
            <span>Telefon</span>
            <Badge variant="outline" className="text-xs">Obligatoriu</Badge>
          </Label>
          <Input
            id="telefon"
            type="tel"
            placeholder="+40 721 234 567"
            value={formData.telefon || ''}
            onChange={(e) => handleChange('telefon', e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Format: +40 721 234 567 sau 0721 234 567
          </p>
        </div>

        <div>
          <Label htmlFor="email" className="flex items-center space-x-2">
            <span>Email</span>
            <Badge variant="outline" className="text-xs">Obligatoriu</Badge>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="email@example.com"
            value={formData.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="preferinta_contact">Preferință contact</Label>
          <Select 
            value={formData.preferinta_contact || ''} 
            onValueChange={(value) => handleChange('preferinta_contact', value)}
          >
            <SelectTrigger className="mt-1">
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

        <div>
          <Label htmlFor="interval_orar">Interval orar preferat</Label>
          <Select 
            value={formData.interval_orar || ''} 
            onValueChange={(value) => handleChange('interval_orar', value)}
          >
            <SelectTrigger className="mt-1">
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

      <div className="flex items-start space-x-3 pt-4">
        <Checkbox
          id="gdpr"
          checked={formData.gdpr || false}
          onCheckedChange={(checked) => handleChange('gdpr', checked as boolean)}
        />
        <div className="space-y-1">
          <Label htmlFor="gdpr" className="text-sm font-medium">
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

      {isComplete && (
        <Alert className="border-green-200 bg-green-50">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Perfect! Toate informațiile sunt complete. Poți finaliza cererea de comandă.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
