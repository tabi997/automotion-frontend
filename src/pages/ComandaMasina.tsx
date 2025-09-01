"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/common/Badge';
import { Section } from '@/components/common/Section';
import { Container } from '@/components/common/Container';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { MultiStepForm, FormStep } from '@/components/forms/MultiStepForm';
import { CarPreferences, OrderContactInfo } from '@/components/forms/OrderCarFormSteps';
import { 
  Car, 
  CheckCircle, 
  ArrowLeft,
  Search,
  Shield,
  Zap,
  Star
} from 'lucide-react';
import { createOrderLead } from '@/lib/admin';
import { useToast } from '@/hooks/use-toast';

const benefits = [
  {
    icon: Search,
    title: "Căutare personalizată",
    description: "Găsim exact mașina pe care o cauți"
  },
  {
    icon: Zap,
    title: "Răspuns rapid",
    description: "Te contactăm în maxim 24 de ore"
  },
  {
    icon: Shield,
    title: "Tranzacție sigură",
    description: "Garantăm calitatea și siguranța"
  }
];

const trustIndicators = [
  {
    icon: Star,
    title: "Experiență verificată",
    description: "Mii de clienți mulțumiți"
  },
  {
    icon: Shield,
    title: "Date protejate",
    description: "Informațiile tale sunt în siguranță"
  },
  {
    icon: CheckCircle,
    title: "Fără obligații",
    description: "Evaluare gratuită și fără comisioane"
  }
];

export default function ComandaMasina() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleFormComplete = async (formData: any) => {
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

    } catch (error) {
      toast({
        title: "Eroare",
        description: error instanceof Error ? error.message : "A apărut o eroare neașteptată.",
        variant: "destructive",
      });
    }
  };

  const handleStepChange = (currentStep: number, data: any) => {
    console.log(`Step ${currentStep + 1} completed:`, data);
  };

  const formSteps: FormStep[] = [
    {
      id: "car-preferences",
      title: "Preferințe mașină",
      description: "Spune-ne ce tip de mașină cauți",
      component: <CarPreferences formData={{}} updateFormData={() => {}} />,
      isRequired: true
    },
    {
      id: "contact-info",
      title: "Informații contact",
      description: "Cum te putem contacta când găsim mașina",
      component: <OrderContactInfo formData={{}} updateFormData={() => {}} />,
      isRequired: true
    }
  ];

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

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {trustIndicators.map((indicator, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                    <indicator.icon className="h-6 w-6 text-success" />
                  </div>
                  <h3 className="font-semibold">{indicator.title}</h3>
                  <p className="text-sm text-muted-foreground">{indicator.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Form Section */}
      <Section>
        <Container>
          <div className="max-w-4xl mx-auto">
            <MultiStepForm
              steps={formSteps}
              onComplete={handleFormComplete}
              onStepChange={handleStepChange}
              title="Comandă mașină personalizată"
              description="Completează formularul pas cu pas pentru a găsi mașina perfectă pentru tine"
              showProgress={true}
              allowBackNavigation={true}
            />
          </div>
        </Container>
      </Section>
      
      <Footer />
    </div>
  );
}
