import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { FormSection } from "@/components/forms/FormSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare,
  CheckCircle,
  Send
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

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactInput>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      gdpr: false
    }
  });

  const onSubmit = async (data: ContactInput) => {
    setIsSubmitting(true);
    try {
      const result = await submitContactMessage(data);
      
      if (result.success) {
        setSubmitSuccess(true);
        form.reset();
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
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormSection 
                    title="Scrie-ne un Mesaj" 
                    description="Completează formularul și te vom contacta în cel mai scurt timp"
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
                        name="telefon"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Numărul de telefon</FormLabel>
                            <FormControl>
                              <Input placeholder="+40721234567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subiect"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subiectul *</FormLabel>
                            <FormControl>
                              <Input placeholder="Despre ce vrei să vorbești?" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="mesaj"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mesajul *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Scrie aici mesajul tău detaliat..."
                              className="min-h-[120px]"
                              {...field} 
                            />
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
                          <Send className="h-4 w-4 mr-2" />
                          Trimite Mesajul
                        </>
                      )}
                    </Button>
                  </FormSection>
                </form>
              </Form>
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
                  <Button variant="outline" asChild>
                    <a 
                      href={`https://maps.google.com/?q=${encodeURIComponent(settings.contact.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Deschide în Google Maps
                    </a>
                  </Button>
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