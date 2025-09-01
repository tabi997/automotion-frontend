import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Mail, Phone, MessageSquare, Shield, Info } from 'lucide-react';

interface ContactFormStepsProps {
  formData: any;
  updateFormData: (data: any) => void;
  isComplete?: boolean;
}

// Step 1: Basic Contact Information
export function ContactBasicInfo({ formData, updateFormData }: ContactFormStepsProps) {
  const handleChange = (field: string, value: string) => {
    updateFormData({ [field]: value });
  };

  const isComplete = formData.nume && formData.email;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <User className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Informații de bază</h3>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Completează doar informațiile esențiale pentru a începe conversația.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
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
          <p className="text-xs text-muted-foreground mt-1">
            Folosim numele tău pentru a te contacta personal
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
          <p className="text-xs text-muted-foreground mt-1">
            Nu vom partaja emailul tău cu terți
          </p>
        </div>
      </div>

      {isComplete && (
        <Alert className="border-green-200 bg-green-50">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Perfect! Ai completat informațiile de bază. Poți continua la următorul pas.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// Step 2: Contact Preferences
export function ContactPreferences({ formData, updateFormData }: ContactFormStepsProps) {
  const handleChange = (field: string, value: string) => {
    updateFormData({ [field]: value });
  };

  const isComplete = formData.telefon || formData.preferinta_contact;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Phone className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Preferințe de contact</h3>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Alege cum preferi să te contactăm pentru a-ți răspunde rapid.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div>
          <Label htmlFor="telefon">Numărul de telefon</Label>
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
          <Label htmlFor="preferinta_contact">Preferința de contact</Label>
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
          <p className="text-xs text-muted-foreground mt-1">
            Te vom contacta prin metoda preferată
          </p>
        </div>
      </div>

      {isComplete && (
        <Alert className="border-green-200 bg-green-50">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Excelent! Știm cum să te contactăm. Ultimul pas: mesajul tău.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// Step 3: Message Details
export function ContactMessage({ formData, updateFormData }: ContactFormStepsProps) {
  const handleChange = (field: string, value: string) => {
    updateFormData({ [field]: value });
  };

  const isComplete = formData.subiect && formData.mesaj && formData.gdpr;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Mesajul tău</h3>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Spune-ne despre ce vrei să vorbim și te vom contacta în cel mai scurt timp.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div>
          <Label htmlFor="subiect" className="flex items-center space-x-2">
            <span>Subiectul</span>
            <Badge variant="outline" className="text-xs">Obligatoriu</Badge>
          </Label>
          <Input
            id="subiect"
            placeholder="Despre ce vrei să vorbești?"
            value={formData.subiect || ''}
            onChange={(e) => handleChange('subiect', e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Un subiect clar ne ajută să te contactăm cu persoana potrivită
          </p>
        </div>

        <div>
          <Label htmlFor="mesaj" className="flex items-center space-x-2">
            <span>Mesajul</span>
            <Badge variant="outline" className="text-xs">Obligatoriu</Badge>
          </Label>
          <Textarea
            id="mesaj"
            placeholder="Scrie aici mesajul tău detaliat..."
            value={formData.mesaj || ''}
            onChange={(e) => handleChange('mesaj', e.target.value)}
            className="mt-1 min-h-[120px]"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Cu cât mai multe detalii, cu atât mai rapid îți putem răspunde
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
              Datele tale sunt protejate și vor fi folosite doar pentru a-ți răspunde.
            </p>
          </div>
        </div>
      </div>

      {isComplete && (
        <Alert className="border-green-200 bg-green-50">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Perfect! Mesajul tău este gata de trimitere. Poți finaliza formularul.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
