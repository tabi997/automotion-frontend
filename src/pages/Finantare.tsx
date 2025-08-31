import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { FormSection } from "@/components/forms/FormSection";
import { InlineCalculator } from "@/components/forms/InlineCalculator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CreditCard, 
  CheckCircle, 
  Clock, 
  TrendingDown, 
  Shield,
  Calculator,
  Send
} from "lucide-react";
import { FinanceSchema, type FinanceInput, carOptions } from "@/lib/validation";
import { submitFinanceLead } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

const benefits = [
  { icon: Clock, title: "Aprobare în 24h", description: "Răspuns rapid la cererea ta" },
  { icon: TrendingDown, title: "Dobânzi competitive", description: "Cele mai bune condiții de pe piață" },
  { icon: Shield, title: "Fără surprize", description: "Costuri transparente, fără taxe ascunse" },
  { icon: CheckCircle, title: "Proces simplu", description: "Minim de documente necesare" }
];

const partnerLogos = [
  "BCR Leasing", "BRD Finance", "Raiffeisen Bank", "ING Bank", "UniCredit Leasing"
];

export default function Finantare() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<FinanceInput>({
    resolver: zodResolver(FinanceSchema),
    defaultValues: {
      pret: 25000,
      avans: 5000,
      perioada: 60,
      dobanda: 8.5
    }
  });

  const onSubmit = async (data: FinanceInput) => {
    setIsSubmitting(true);
    try {
      const result = await submitFinanceLead(data);
      
      if (result.success) {
        setSubmitSuccess(true);
        form.reset();
        toast({
          title: "Cererea a fost trimisă cu succes!",
          description: "Te vom contacta în cel mai scurt timp cu o ofertă personalizată.",
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
              <CreditCard className="h-4 w-4 mr-2" />
              Finanțare Auto
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold automotive-gradient-text">
              Finanțare auto simplă și rapidă
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Obții aprobarea în 24h cu cele mai competitive dobânzi de pe piață. 
              Calculează-ți rata și aplică pentru finanțare într-un singur loc.
            </p>
          </div>
        </Container>
      </Section>

      {/* Benefits */}
      <Section className="py-12">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <benefit.icon className="h-8 w-8 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {submitSuccess && (
        <Section>
          <Container>
            <Alert className="border-success bg-success/10">
              <CheckCircle className="h-4 w-4 text-success" />
              <AlertDescription className="text-success">
                <strong>Cererea ta a fost trimisă cu succes!</strong> Te vom contacta în cel mai scurt timp cu o ofertă personalizată de finanțare.
              </AlertDescription>
            </Alert>
          </Container>
        </Section>
      )}

      {/* Calculator & Form */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calculator */}
            <div>
              <InlineCalculator 
                defaultValues={{
                  pret: form.watch("pret"),
                  avans: form.watch("avans"),
                  perioada: form.watch("perioada"),
                  dobanda: form.watch("dobanda")
                }}
                onCalculate={(result) => {
                  // Update form values from calculator
                  form.setValue("pret", result.monthlyPayment);
                }}
              />
            </div>

            {/* Form */}
            <div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormSection 
                    title="Solicită Ofertă Personalizată" 
                    description="Completează datele pentru a primi o ofertă detaliată"
                  >
                    {/* Hidden fields for calculator values */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="pret"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prețul vehiculului</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
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
                        name="avans"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Avansul</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
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
                        name="perioada"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Perioada (luni)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
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
                        name="dobanda"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dobânda (%)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.1"
                                {...field} 
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="nume@email.com" {...field} />
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
                              <FormLabel>Telefon *</FormLabel>
                              <FormControl>
                                <Input placeholder="+40721234567" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="venit_lunar"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Venitul lunar (lei)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="3000" 
                                  {...field} 
                                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="tip_contract"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipul contractului</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selectează tipul" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {carOptions.tip_contract.map((option) => (
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
                        name="istoric_creditare"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Istoricul de creditare</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selectează istoricul" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {carOptions.istoric_creditare.map((option) => (
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
                        name="link_stoc"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Link către mașina din stoc (opțional)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://autoorder.ro/stoc/..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mesaj"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mesaj suplimentar</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Detalii suplimentare despre cererea ta..."
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
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
                            <Send className="h-4 w-4 mr-2" />
                            Solicită Oferta
                          </>
                        )}
                      </Button>
                    </div>
                  </FormSection>
                </form>
              </Form>
            </div>
          </div>
        </Container>
      </Section>

      {/* Partners */}
      <Section className="py-12">
        <Container>
          <div className="text-center space-y-8">
            <h2 className="text-2xl font-bold">Partenerii noștri financiari</h2>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {partnerLogos.map((partner, index) => (
                <Badge key={index} variant="outline" className="px-4 py-2">
                  {partner}
                </Badge>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  );
}