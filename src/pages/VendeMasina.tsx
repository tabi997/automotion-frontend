import { useState } from "react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiStepForm, FormStep } from "@/components/forms/MultiStepForm";
import { 
  CarBasicInfo, 
  CarTechnicalSpecs, 
  CarLocation, 
  CarContactInfo 
} from "@/components/forms/SellCarFormSteps";
import { 
  Car, 
  DollarSign, 
  Shield, 
  Clock, 
  CheckCircle, 
  Upload,
  ChevronRight,
  AlertCircle,
  Zap,
  Star
} from "lucide-react";
import { SellCarSchema, type SellCarInput } from "@/lib/validation";
import { submitSellLead } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

const steps = [
  { id: 1, title: "Completezi formularul", description: "Adaugi detaliile mașinii" },
  { id: 2, title: "Primești oferta", description: "Te contactăm în 24h cu o ofertă personalizată" },
  { id: 3, title: "Finalizezi vânzarea", description: "Semnezi actele și primești banii instant" }
];

const benefits = [
  "Evaluare gratuită și rapidă",
  "Plata imediată și sigură",
  "Preluăm toate actele",
  "Fără taxe ascunse"
];

const faqItems = [
  {
    question: "Cât durează procesul de evaluare?",
    answer: "Te contactăm în maxim 24 de ore cu o ofertă detaliată pentru mașina ta."
  },
  {
    question: "Ce documente sunt necesare?",
    answer: "Certificat de înmatriculare, carte de identitate și eventuale documente de service."
  },
  {
    question: "Când primesc banii?",
    answer: "Plata se face imediat după semnarea contractului, prin transfer bancar sau numerar."
  },
  {
    question: "Pot vinde mașina cu credit în derulare?",
    answer: "Da, ne ocupăm de toate formele necesare pentru stingerea creditului auto."
  }
];

const trustIndicators = [
  {
    icon: Zap,
    title: "Evaluare rapidă",
    description: "Răspuns în 24 de ore"
  },
  {
    icon: Shield,
    title: "Tranzacție sigură",
    description: "Plata garantată și sigură"
  },
  {
    icon: Star,
    title: "Experiență verificată",
    description: "Mii de clienți mulțumiți"
  }
];

export default function VendeMasina() {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { toast } = useToast();

  const handleFormComplete = async (formData: any) => {
    try {
      // Validate the form data
      const validatedData = SellCarSchema.parse(formData);
      
      const result = await submitSellLead(validatedData);
      
      if (result.success) {
        setSubmitSuccess(true);
        toast({
          title: "Cererea a fost trimisă cu succes!",
          description: "Te vom contacta în cel mai scurt timp pentru evaluarea mașinii tale.",
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
      id: "car-basic-info",
      title: "Informații de bază",
      description: "Marca, modelul, anul și kilometrajul mașinii",
      component: <CarBasicInfo formData={{}} updateFormData={() => {}} />,
      isRequired: true
    },
    {
      id: "car-technical-specs",
      title: "Specificații tehnice",
      description: "Combustibil, transmisie, caroserie și preț",
      component: <CarTechnicalSpecs formData={{}} updateFormData={() => {}} />,
      isRequired: true
    },
    {
      id: "car-location",
      title: "Locația vehiculului",
      description: "Unde se află mașina în prezent",
      component: <CarLocation formData={{}} updateFormData={() => {}} />,
      isRequired: true
    },
    {
      id: "car-contact-info",
      title: "Date de contact",
      description: "Cum te putem contacta pentru evaluare",
      component: <CarContactInfo formData={{}} updateFormData={() => {}} />,
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
              <Car className="h-4 w-4 mr-2" />
              Vende Rapid
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold automotive-gradient-text">
              Vinde-ți mașina ușor și rapid
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Obții o evaluare profesională în 24h și îți vinzi mașina cu plata imediată. 
              Fără bătăi de cap, fără comisioane ascunse.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {benefits.map((benefit) => (
                <Badge key={benefit} variant="secondary" className="text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-success" />
                  {benefit}
                </Badge>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {trustIndicators.map((indicator, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <indicator.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">{indicator.title}</h3>
                  <p className="text-sm text-muted-foreground">{indicator.description}</p>
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
                <strong>Cererea ta a fost trimisă cu succes!</strong> Te vom contacta în cel mai scurt timp pentru evaluarea mașinii tale.
              </AlertDescription>
            </Alert>
          </Container>
        </Section>
      )}

      {/* Form Section */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <MultiStepForm
                steps={formSteps}
                onComplete={handleFormComplete}
                onStepChange={handleStepChange}
                title="Evaluare mașină"
                description="Completează formularul pas cu pas pentru o evaluare rapidă și profesională"
                showProgress={true}
                allowBackNavigation={true}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Process Steps */}
              <Card>
                <CardHeader>
                  <CardTitle>Cum funcționează?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                          {step.id}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Trust & Security */}
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
                    <span className="text-sm">Evaluare gratuită și fără obligații</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">Datele tale sunt protejate</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">Tranzacție transparentă</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">Fără comisioane ascunse</span>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ */}
              <Card>
                <CardHeader>
                  <CardTitle>Întrebări Frecvente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {faqItems.map((item, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-sm mb-1">{item.question}</h4>
                      <p className="text-sm text-muted-foreground">{item.answer}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  );
}