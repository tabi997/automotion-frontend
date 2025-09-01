import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Car, User, MapPin, Euro, Info, Shield } from 'lucide-react';
import { carOptions, judete } from '@/lib/validation';

interface SellCarFormStepsProps {
  formData: any;
  updateFormData: (data: any) => void;
  isComplete?: boolean;
}

// Step 1: Basic Car Information
export function CarBasicInfo({ formData, updateFormData }: SellCarFormStepsProps) {
  const handleChange = (field: string, value: string | number) => {
    updateFormData({ [field]: value });
  };

  const isComplete = formData.marca && formData.model && formData.an && formData.km;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Car className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Informații de bază</h3>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Completează informațiile esențiale despre mașina ta pentru o evaluare rapidă.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="marca" className="flex items-center space-x-2">
            <span>Marca</span>
            <Badge variant="outline" className="text-xs">Obligatoriu</Badge>
          </Label>
          <Input
            id="marca"
            placeholder="ex: BMW"
            value={formData.marca || ''}
            onChange={(e) => handleChange('marca', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="model" className="flex items-center space-x-2">
            <span>Model</span>
            <Badge variant="outline" className="text-xs">Obligatoriu</Badge>
          </Label>
          <Input
            id="model"
            placeholder="ex: X5"
            value={formData.model || ''}
            onChange={(e) => handleChange('model', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="an" className="flex items-center space-x-2">
            <span>Anul fabricației</span>
            <Badge variant="outline" className="text-xs">Obligatoriu</Badge>
          </Label>
          <Input
            id="an"
            type="number"
            placeholder="2020"
            value={formData.an || ''}
            onChange={(e) => handleChange('an', Number(e.target.value))}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Anul de fabricație al vehiculului
          </p>
        </div>

        <div>
          <Label htmlFor="km" className="flex items-center space-x-2">
            <span>Kilometraj</span>
            <Badge variant="outline" className="text-xs">Obligatoriu</Badge>
          </Label>
          <Input
            id="km"
            type="number"
            placeholder="50000"
            value={formData.km || ''}
            onChange={(e) => handleChange('km', Number(e.target.value))}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Numărul total de kilometri parcurși
          </p>
        </div>
      </div>

      {isComplete && (
        <Alert className="border-green-200 bg-green-50">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Excelent! Avem informațiile de bază. Continuă cu specificațiile tehnice.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// Step 2: Technical Specifications
export function CarTechnicalSpecs({ formData, updateFormData }: SellCarFormStepsProps) {
  const handleChange = (field: string, value: string) => {
    updateFormData({ [field]: value });
  };

  const isComplete = formData.combustibil && formData.transmisie && formData.caroserie;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Car className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Specificații tehnice</h3>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Aceste informații ne ajută să evaluăm corect valoarea mașinii tale.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="combustibil" className="flex items-center space-x-2">
            <span>Combustibil</span>
            <Badge variant="outline" className="text-xs">Obligatoriu</Badge>
          </Label>
          <Select 
            value={formData.combustibil || ''} 
            onValueChange={(value) => handleChange('combustibil', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selectează combustibilul" />
            </SelectTrigger>
            <SelectContent>
              {carOptions.combustibil.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="transmisie" className="flex items-center space-x-2">
            <span>Transmisie</span>
            <Badge variant="outline" className="text-xs">Obligatoriu</Badge>
          </Label>
          <Select 
            value={formData.transmisie || ''} 
            onValueChange={(value) => handleChange('transmisie', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selectează transmisia" />
            </SelectTrigger>
            <SelectContent>
              {carOptions.transmisie.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="caroserie" className="flex items-center space-x-2">
            <span>Caroserie</span>
            <Badge variant="outline" className="text-xs">Obligatoriu</Badge>
          </Label>
          <Select 
            value={formData.caroserie || ''} 
            onValueChange={(value) => handleChange('caroserie', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selectează caroseria" />
            </SelectTrigger>
            <SelectContent>
              {carOptions.caroserie.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="culoare">Culoare</Label>
          <Input
            id="culoare"
            placeholder="ex: Negru metalic"
            value={formData.culoare || ''}
            onChange={(e) => handleChange('culoare', e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Culoarea exactă a vehiculului
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vin">Numărul de șasiu (VIN)</Label>
          <Input
            id="vin"
            placeholder="WBAVA31030L..."
            value={formData.vin || ''}
            onChange={(e) => handleChange('vin', e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Opțional - pentru verificări suplimentare
          </p>
        </div>

        <div>
          <Label htmlFor="pret">Prețul dorit (EUR)</Label>
          <Input
            id="pret"
            type="number"
            placeholder="25000"
            value={formData.pret || ''}
            onChange={(e) => handleChange('pret', Number(e.target.value))}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Prețul la care vrei să vinzi mașina
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <Checkbox
          id="negociabil"
          checked={formData.negociabil || false}
          onCheckedChange={(checked) => handleChange('negociabil', checked as boolean)}
        />
        <div className="space-y-1">
          <Label htmlFor="negociabil" className="text-sm font-medium">
            Prețul este negociabil
          </Label>
          <p className="text-xs text-muted-foreground">
            Bifează dacă ești dispus să negociezi prețul
          </p>
        </div>
      </div>

      {isComplete && (
        <Alert className="border-green-200 bg-green-50">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Perfect! Specificațiile tehnice sunt complete. Continuă cu locația.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// Step 3: Location Information
export function CarLocation({ formData, updateFormData }: SellCarFormStepsProps) {
  const handleChange = (field: string, value: string) => {
    updateFormData({ [field]: value });
  };

  const isComplete = formData.judet && formData.oras;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <MapPin className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Locația vehiculului</h3>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Unde se află mașina în prezent pentru a organiza evaluarea.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="judet" className="flex items-center space-x-2">
            <span>Județul</span>
            <Badge variant="outline" className="text-xs">Obligatoriu</Badge>
          </Label>
          <Select 
            value={formData.judet || ''} 
            onValueChange={(value) => handleChange('judet', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selectează județul" />
            </SelectTrigger>
            <SelectContent>
              {judete.map((judet) => (
                <SelectItem key={judet} value={judet}>
                  {judet}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="oras" className="flex items-center space-x-2">
            <span>Orașul</span>
            <Badge variant="outline" className="text-xs">Obligatoriu</Badge>
          </Label>
          <Input
            id="oras"
            placeholder="Localitatea exactă"
            value={formData.oras || ''}
            onChange={(e) => handleChange('oras', e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Orașul sau localitatea unde se află mașina
          </p>
        </div>
      </div>

      {isComplete && (
        <Alert className="border-green-200 bg-green-50">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Excelent! Știm unde să găsim mașina. Ultimul pas: datele de contact.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// Step 4: Contact Information
export function CarContactInfo({ formData, updateFormData }: SellCarFormStepsProps) {
  const handleChange = (field: string, value: string) => {
    updateFormData({ [field]: value });
  };

  const isComplete = formData.nume && formData.telefon && formData.email && formData.gdpr;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <User className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Date de contact</h3>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Cum te putem contacta pentru evaluarea mașinii tale.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nume" className="flex items-center space-x-2">
            <span>Numele complet</span>
            <Badge variant="outline" className="text-xs">Obligatoriu</Badge>
          </Label>
          <Input
            id="nume"
            placeholder="Numele și prenumele"
            value={formData.nume || ''}
            onChange={(e) => handleChange('nume', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="telefon" className="flex items-center space-x-2">
            <span>Numărul de telefon</span>
            <Badge variant="outline" className="text-xs">Obligatoriu</Badge>
          </Label>
          <Input
            id="telefon"
            placeholder="+40721234567"
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
            <span>Adresa de email</span>
            <Badge variant="outline" className="text-xs">Obligatoriu</Badge>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="nume@email.com"
            value={formData.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="preferinta_contact">Preferința de contact</Label>
          <Select 
            value={formData.preferinta_contact || 'telefon'} 
            onValueChange={(value) => handleChange('preferinta_contact', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {carOptions.preferinta_contact.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="interval_orar">Intervalul orar preferat</Label>
        <Input
          id="interval_orar"
          placeholder="ex: 09:00 - 18:00"
          value={formData.interval_orar || ''}
          onChange={(e) => handleChange('interval_orar', e.target.value)}
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Când preferi să te contactăm
        </p>
      </div>

      <div className="flex items-start space-x-3 pt-4">
        <Checkbox
          id="gdpr"
          checked={formData.gdpr || false}
          onCheckedChange={(checked) => handleChange('gdpr', checked as boolean)}
        />
        <div className="space-y-1">
          <Label htmlFor="gdpr" className="text-sm font-medium">
            Consimțământ prelucrare date
          </Label>
          <p className="text-xs text-muted-foreground">
            Sunt de acord cu prelucrarea datelor personale conform GDPR. 
            Datele tale sunt protejate și vor fi folosite doar pentru evaluarea mașinii.
          </p>
        </div>
      </div>

      {isComplete && (
        <Alert className="border-green-200 bg-green-50">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Perfect! Toate informațiile sunt complete. Poți finaliza formularul pentru evaluare.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
