import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { FormSection } from "@/components/forms/FormSection";
import { UploadGallery } from "@/components/forms/UploadGallery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Car, 
  DollarSign, 
  Shield, 
  Clock, 
  CheckCircle, 
  Upload,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { SellCarSchema, type SellCarInput, carOptions, judete } from "@/lib/validation";
import { submitSellLead } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

const steps = [
  { id: 1, title: "Completezi formularul", description: "Adaugi detaliile mașinii și fotografii" },
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

export default function VendeMasina() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<SellCarInput>({
    resolver: zodResolver(SellCarSchema),
    defaultValues: {
      negociabil: false,
      preferinta_contact: "telefon",
      gdpr: false,
      images: []
    }
  });

  const onSubmit = async (data: SellCarInput) => {
    setIsSubmitting(true);
    try {
      const result = await submitSellLead(data);
      
      if (result.success) {
        setSubmitSuccess(true);
        form.reset();
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
        title: "Eroare",
        description: "A apărut o eroare. Încearcă din nou.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Car Details */}
                  <FormSection 
                    title="Detalii Mașină" 
                    description="Completează informațiile tehnice ale vehiculului"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="marca"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Marca *</FormLabel>
                            <FormControl>
                              <Input placeholder="ex: BMW" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="model"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Model *</FormLabel>
                            <FormControl>
                              <Input placeholder="ex: X5" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="an"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Anul fabricației *</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="2020" 
                                {...field} 
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="km"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kilometraj *</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="50000" 
                                {...field} 
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="combustibil"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Combustibil *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selectează combustibilul" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {carOptions.combustibil.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="transmisie"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Transmisie *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selectează transmisia" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {carOptions.transmisie.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="caroserie"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Caroserie *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selectează caroseria" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {carOptions.caroserie.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="culoare"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Culoare</FormLabel>
                            <FormControl>
                              <Input placeholder="ex: Negru metalic" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="vin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Numărul de șasiu (VIN)</FormLabel>
                            <FormControl>
                              <Input placeholder="WBAVA31030L..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="pret"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prețul dorit (EUR)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="25000" 
                                {...field} 
                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="negociabil"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Prețul este negociabil</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Bifează dacă ești dispus să negociezi prețul
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                  </FormSection>

                  {/* Location */}
                  <FormSection 
                    title="Locația Vehiculului" 
                    description="Unde se află mașina în prezent"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="judet"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Județul *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selectează județul" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {judete.map((judet) => (
                                  <SelectItem key={judet} value={judet}>
                                    {judet}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="oras"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Orașul *</FormLabel>
                            <FormControl>
                              <Input placeholder="Localitatea exactă" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </FormSection>

                  {/* Images */}
                  <FormSection 
                    title="Fotografii" 
                    description="Încarcă minimum 3 fotografii clare ale mașinii"
                  >
                    <FormField
                      control={form.control}
                      name="images"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <UploadGallery
                              onImagesChange={field.onChange}
                              minImages={3}
                              maxImages={10}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </FormSection>

                  {/* Contact Details */}
                  <FormSection 
                    title="Date de Contact" 
                    description="Cum te putem contacta pentru ofertă"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="nume"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Numele complet *</FormLabel>
                            <FormControl>
                              <Input placeholder="Numele și prenumele" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="telefon"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Numărul de telefon *</FormLabel>
                            <FormControl>
                              <Input placeholder="+40721234567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Adresa de email *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="nume@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="preferinta_contact"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferința de contact *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {carOptions.preferinta_contact.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="interval_orar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Intervalul orar preferat</FormLabel>
                          <FormControl>
                            <Input placeholder="ex: 09:00 - 18:00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gdpr"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Consimțământ prelucrare date *</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Sunt de acord cu prelucrarea datelor personale conform GDPR
                            </p>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Se trimite...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Trimite pentru Evaluare
                        </>
                      )}
                    </Button>
                  </FormSection>
                </form>
              </Form>
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