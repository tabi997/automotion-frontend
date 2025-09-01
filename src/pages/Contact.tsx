import { useState } from "react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiStepForm, FormStep } from "@/components/forms/MultiStepForm";
import { ContactBasicInfo, ContactPreferences, ContactMessage } from "@/components/forms/ContactFormSteps";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare,
  CheckCircle,
  Shield,
  Zap
} from "lucide-react";
import { ContactSchema, type ContactInput } from "@/lib/validation";
import { submitContactMessage } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import settings from "@/data/settings.json";

const contactMethods = [
  {
    icon: Phone,
    title: "Telefon",
    value: settings.contact.phone,
    description: "Luni - Vineri: 09:00 - 18:00",
    action: `tel:${settings.contact.phone}`
  },
  {
    icon: Mail,
    title: "Email",
    value: settings.contact.email,
    description: "Răspuns în maxim 24h",
    action: `mailto:${settings.contact.email}`
  },
  {
    icon: MapPin,
    title: "Adresa",
    value: settings.contact.address,
    description: "Showroom și service",
    action: `https://maps.google.com/?q=${encodeURIComponent(settings.contact.address)}`
  }
];

const schedule = [
  { day: "Luni - Vineri", hours: "09:00 - 18:00" },
  { day: "Sâmbătă", hours: "10:00 - 16:00" },
  { day: "Duminică", hours: "Închis" }
];

const benefits = [
  {
    icon: Zap,
    title: "Răspuns rapid",
    description: "Te contactăm în maxim 24 de ore"
  },
  {
    icon: Shield,
    title: "Date protejate",
    description: "Informațiile tale sunt în siguranță"
  },
  {
    icon: MessageSquare,
    title: "Comunicare directă",
    description: "Vorbim direct cu echipa specializată"
  }
];

export default function Contact() {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { toast } = useToast();

  const handleFormComplete = async (formData: any) => {
    try {
      // Validate the form data
      const validatedData = ContactSchema.parse(formData);
      
      const result = await submitContactMessage(validatedData);
      
      if (result.success) {
        setSubmitSuccess(true);
        toast({
          title: "Mesajul a fost trimis cu succes!",
          description: "Te vom contacta în cel mai scurt timp.",
        });
      } else {
        toast({
          title: "Eroare",
          description: result.error || "A apărut o eroare. Încearcă din nou.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Eroare de validare",
        description: "Te rugăm să verifici informațiile introduse.",
        variant: "destructive"
      });
    }
  };

  const handleStepChange = (currentStep: number, data: any) => {
    console.log(`Step ${currentStep + 1} completed:`, data);
  };

  const formSteps: FormStep[] = [
    {
      id: "basic-info",
      title: "Informații de bază",
      description: "Numele și emailul pentru a începe conversația",
      component: <ContactBasicInfo formData={{}} updateFormData={() => {}} />,
      isRequired: true
    },
    {
      id: "contact-preferences",
      title: "Preferințe contact",
      description: "Cum preferi să te contactăm",
      component: <ContactPreferences formData={{}} updateFormData={() => {}} />,
      isRequired: false
    },
    {
      id: "message",
      title: "Mesajul tău",
      description: "Spune-ne despre ce vrei să vorbim",
      component: <ContactMessage formData={{}} updateFormData={() => {}} />,
      isRequired: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <Section className="pt-24 pb-12">
        <Container>
          <div className="text-center space-y-6">
            <Badge variant="outline" className="mx-auto">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold automotive-gradient-text">
              Hai să vorbim despre mașina ta
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Suntem aici să te ajutăm să găsești vehiculul perfect sau să îți răspundem la orice întrebare. 
              Contactează-ne prin oricare dintre modalitățile de mai jos.
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {submitSuccess && (
        <Section>
          <Container>
            <Alert className="border-success bg-success/10">
              <CheckCircle className="h-4 w-4 text-success" />
              <AlertDescription className="text-success">
                <strong>Mesajul tău a fost trimis cu succes!</strong> Te vom contacta în cel mai scurt timp.
              </AlertDescription>
            </Alert>
          </Container>
        </Section>
      )}

      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Contact Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>Informații de Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactMethods.map((method, index) => (
                    <a
                      key={index}
                      href={method.action}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors group"
                    >
                      <method.icon className="h-5 w-5 text-primary mt-0.5 group-hover:scale-110 transition-transform" />
                      <div>
                        <h4 className="font-semibold text-sm">{method.title}</h4>
                        <p className="text-sm font-medium">{method.value}</p>
                        <p className="text-xs text-muted-foreground">{method.description}</p>
                      </div>
                    </a>
                  ))}
                </CardContent>
              </Card>

              {/* Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Program de Lucru</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {schedule.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.day}</span>
                      <Badge variant="outline" className="text-xs">
                        {item.hours}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Trust Indicators */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Siguranță și Confidențialitate</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">Datele tale sunt protejate</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">Nu partajăm informații cu terți</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">Conformitate GDPR</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <MultiStepForm
                steps={formSteps}
                onComplete={handleFormComplete}
                onStepChange={handleStepChange}
                title="Contactează-ne"
                description="Completează formularul pas cu pas pentru a ne contacta rapid și eficient"
                showProgress={true}
                allowBackNavigation={true}
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* Map Section */}
      <Section className="py-12">
        <Container>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Locația Noastră</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <MapPin className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">Hartă integrată va fi disponibilă în curând</p>
                  <Badge variant="outline" asChild>
                    <a 
                      href={`https://maps.google.com/?q=${encodeURIComponent(settings.contact.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer"
                    >
                      Deschide în Google Maps
                    </a>
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </Container>
      </Section>

      <Footer />
    </div>
  );
}