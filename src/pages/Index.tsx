"use client";

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/common/Badge';
import { Section } from '@/components/common/Section';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { 
  ArrowRight, 
  ShieldCheck, 
  CreditCard, 
  Truck,
  Search,
  Calculator,
  Key,
  Star,
  ChevronLeft,
  ChevronRight,
  Car,
  Zap,
  Crown,
  CheckCircle,
  Eye
} from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Import images
import heroCarImage from '@/assets/hero-car.jpg';
import bmwImage from '@/assets/bmw-x5.jpg';
import mercedesImage from '@/assets/mercedes-amg.jpg';
import audiImage from '@/assets/audi-a4.jpg';

// Import mock data
import settingsData from '@/data/settings.json';
import testimonialsData from '@/data/testimonials.json';
import brandsData from '@/data/brands.json';

// Import real data API and types
import { StockAPI } from '@/lib/stockApi';
import { StockVehicle, Vehicle } from '@/types/vehicle';

const transformStockToVehicle = (stockVehicle: StockVehicle): Vehicle => ({
  id: stockVehicle.id,
  brand: stockVehicle.marca,
  model: stockVehicle.model,
  year: stockVehicle.an,
  mileage: stockVehicle.km,
  price: stockVehicle.pret,
  fuelType: stockVehicle.combustibil as 'benzina' | 'motorina' | 'hibrid' | 'electric' | 'gpl',
  transmission: stockVehicle.transmisie as 'manuala' | 'automata' | 'cvt',
  bodyType: stockVehicle.caroserie as 'berlina' | 'break' | 'suv' | 'coupe' | 'cabriolet' | 'hatchback' | 'monovolum',
  color: stockVehicle.culoare || '',
  vin: stockVehicle.vin,
  negotiable: stockVehicle.negociabil,
  description: stockVehicle.descriere || '',
  status: stockVehicle.status as 'active' | 'inactive' | 'sold',
  dateAdded: stockVehicle.created_at,
  updatedAt: stockVehicle.updated_at,
  badges: [], // No badges in stock vehicle
  images: stockVehicle.images || [],
  mainImage: stockVehicle.images?.[0] || '',
  horsePower: 0, // Placeholder - not in stock table
  engineCapacity: 0, // Placeholder - not in stock table
  location: 'Romania', // Placeholder - not in stock table
  condition: 'second-hand' as const, // Default value
  features: [], // No features in stock table
  financing: undefined, // No financing info in stock table
});

const Index = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const stockVehicles = await StockAPI.getVehicles();
      // Transform StockVehicle to Vehicle for compatibility
      const transformedVehicles = stockVehicles.map(transformStockToVehicle);
      // Take only the first 6 vehicles for the carousel
      setVehicles(transformedVehicles.slice(0, 6));
    } catch (error) {
      console.error('Error loading vehicles:', error);
      // Fallback to empty array if API fails
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => 
        (prev + 1) % testimonialsData.testimonials.length
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const getVehicleImage = (vehicle: Vehicle) => {
    // Verifică dacă vehiculul are imagini reale
    if (vehicle.images && vehicle.images.length > 0 && vehicle.images[0]) {
      return vehicle.images[0];
    }
    
    // Fallback la imagini mock doar dacă nu există imagini reale
    if (vehicle.brand === 'BMW') return bmwImage;
    if (vehicle.brand === 'Mercedes-Benz') return mercedesImage;
    if (vehicle.brand === 'Audi') return audiImage;
    return bmwImage; // fallback
  };

  const heroSection = (
    <Section 
      padding="none" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroCarImage}
          alt="Premium automotive showroom"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Badge variant="info" size="lg" className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm">
            <Crown className="h-4 w-4" />
            Dealership Premium
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            {settingsData.hero.title.ro}
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            {settingsData.hero.subtitle.ro}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" asChild className="group">
              <Link to="/stoc" className="flex items-center">
                {settingsData.hero.cta_primary.ro}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button variant="outline" size="xl" asChild className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary backdrop-blur-sm">
              <Link to="/comanda" className="flex items-center">
                {settingsData.hero.cta_secondary.ro}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </Section>
  );

  const uspSection = (
    <Section background="muted">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">De ce AutoOrder?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Experiența premium în automotive, cu servicii complete și transparență totală
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {settingsData.usps.map((usp, index) => {
          const IconComponent = usp.icon === 'shield-check' ? ShieldCheck : 
                                usp.icon === 'credit-card' ? CreditCard : Truck;
          
          return (
            <div 
              key={usp.id}
              className={`automotive-card p-8 text-center hover-lift animate-fade-in-up stagger-${index + 1}`}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6 ${
                usp.color === 'success' ? 'bg-success/10 text-success' :
                usp.color === 'accent' ? 'bg-accent/10 text-accent' :
                'bg-primary/10 text-primary'
              }`}>
                <IconComponent className="h-8 w-8" />
              </div>
              
              <h3 className="text-xl font-semibold mb-4">{usp.title.ro}</h3>
              <p className="text-muted-foreground leading-relaxed">{usp.description.ro}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );

  const processSection = (
    <Section>
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Cum funcționează</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Procesul nostru simplu și transparent în doar 3 pași
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Connection Lines */}
        <div className="hidden md:block absolute top-1/2 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-accent via-primary to-accent opacity-30 -translate-y-1/2" />
        
        {settingsData.process.map((step, index) => {
          const IconComponent = step.icon === 'search' ? Search : 
                                step.icon === 'calculator' ? Calculator : Key;
          
          return (
            <div 
              key={step.id}
              className={`text-center relative animate-fade-in-up stagger-${index + 1}`}
            >
              <div className="relative mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 gradient-automotive rounded-2xl shadow-accent mb-4">
                  <IconComponent className="h-10 w-10 text-white" />
                </div>
                
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold shadow-medium">
                  {step.step}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-4">{step.title.ro}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                {step.description.ro}
              </p>
            </div>
          );
        })}
      </div>
    </Section>
  );

  const featuredCarsSection = (
    <Section background="muted">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {loading ? 'Se încarcă...' : vehicles.length > 0 ? 'Mașini Premium din Stocul Nostru' : 'Stocul Nostru'}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {loading 
            ? 'Se încarcă vehiculele din stocul nostru...' 
            : vehicles.length > 0 
              ? 'O selecție din stocul nostru de vehicule verificate și certificate' 
              : 'În acest moment nu avem vehicule în stoc'
          }
        </p>
      </div>
      
      <div className="relative mb-12">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
                         {loading ? (
               // Loading skeleton
               [...Array(3)].map((_, index) => (
                 <CarouselItem key={`loading-${index}`} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                   <div className="automotive-card overflow-hidden animate-pulse">
                     <div className="h-48 bg-muted" />
                     <div className="p-6 space-y-3">
                       <div className="h-4 bg-muted rounded w-3/4" />
                       <div className="h-3 bg-muted rounded w-1/2" />
                       <div className="h-8 bg-muted rounded w-full" />
                     </div>
                   </div>
                 </CarouselItem>
               ))
             ) : vehicles.length === 0 ? (
               // Empty state
               <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                 <div className="automotive-card p-8 text-center">
                   <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                   <h3 className="text-lg font-semibold mb-2">Nu sunt mașini disponibile</h3>
                   <p className="text-muted-foreground mb-4">
                     În acest moment nu avem vehicule în stoc.
                   </p>
                   <Button variant="outline" size="sm" asChild>
                     <Link to="/stoc">Vezi stocul</Link>
                   </Button>
                 </div>
               </CarouselItem>
             ) : (
               vehicles.map((vehicle, index) => (
                 <CarouselItem key={vehicle.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                   <div className="automotive-card overflow-hidden hover-lift">
                     <div className="relative">
                       <Link to={`/vehicul/${vehicle.id}`} className="block">
                         <img 
                           src={getVehicleImage(vehicle)}
                           alt={`${vehicle.brand} ${vehicle.model}`}
                           className="w-full h-48 object-cover cursor-pointer group-hover:scale-105 transition-smooth"
                         />
                       </Link>
                       <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                         {/* Dynamic badges based on vehicle data */}
                         {vehicle.year >= new Date().getFullYear() - 1 && (
                           <Badge variant="success" size="sm">Nou</Badge>
                         )}
                         {vehicle.mileage < 50000 && (
                           <Badge variant="info" size="sm">Kilometraj mic</Badge>
                         )}
                         {vehicle.negotiable && (
                           <Badge variant="warning" size="sm">Negociabil</Badge>
                         )}
                       </div>
                     </div>
                     
                     <div className="p-6">
                       <Link to={`/vehicul/${vehicle.id}`} className="block hover:text-primary transition-colors">
                         <h3 className="text-xl font-semibold mb-2 cursor-pointer">
                           {vehicle.brand} {vehicle.model}
                         </h3>
                       </Link>
                       <p className="text-muted-foreground mb-2">An: {vehicle.year}</p>
                       <p className="text-muted-foreground mb-4">{vehicle.mileage.toLocaleString()} km</p>
                       
                       <div className="flex items-center justify-between">
                         <div>
                           <span className="text-2xl font-bold text-primary">
                             €{vehicle.price.toLocaleString()}
                           </span>
                         </div>
                         
                         <Button variant="outline" size="sm" asChild>
                           <Link to={`/vehicul/${vehicle.id}`} aria-label={`Vezi detalii pentru ${vehicle.brand} ${vehicle.model}`}>
                             <Eye className="h-4 w-4 mr-2" />
                             Detalii
                           </Link>
                         </Button>
                       </div>
                     </div>
                   </div>
                 </CarouselItem>
               ))
             )}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>
      
      <div className="text-center">
        <Button 
          variant="premium" 
          size="lg" 
          asChild
          disabled={loading || vehicles.length === 0}
        >
          <Link to="/stoc">
            {loading ? 'Se încarcă...' : 'Vezi Tot Stocul'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </Section>
  );

  const testimonialsSection = (
    <Section>
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ce spun clienții noștri</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Mii de clienți mulțumiți și-au găsit mașina perfectă prin AutoOrder
        </p>
      </div>
      
      <div className="relative max-w-4xl mx-auto">
        <div className="automotive-card p-8 md:p-12 text-center">
          <div className="flex justify-center mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 text-accent fill-current" />
            ))}
          </div>
          
          <blockquote className="text-xl md:text-2xl font-medium leading-relaxed mb-8 text-muted-dark">
            "{testimonialsData.testimonials[currentTestimonial].text}"
          </blockquote>
          
          <div className="flex items-center justify-center space-x-4">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
              <span className="text-accent font-bold text-lg">
                {testimonialsData.testimonials[currentTestimonial].name.charAt(0)}
              </span>
            </div>
            
            <div className="text-left">
              <p className="font-semibold">
                {testimonialsData.testimonials[currentTestimonial].name}
              </p>
              <p className="text-sm text-muted-foreground">
                {testimonialsData.testimonials[currentTestimonial].location} • {testimonialsData.testimonials[currentTestimonial].vehicle}
              </p>
            </div>
          </div>
        </div>
        
        {/* Navigation Dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonialsData.testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-smooth ${
                index === currentTestimonial 
                  ? 'bg-accent shadow-accent' 
                  : 'bg-border hover:bg-accent/50'
              }`}
            />
          ))}
        </div>
      </div>
    </Section>
  );

  const brandsSection = (
    <Section background="muted">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Mărci de Încredere</h2>
        <p className="text-muted-foreground">
          Lucrăm cu cele mai prestigioase mărci auto din lume
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
        {brandsData.brands.map((brand) => (
          <div 
            key={brand.id}
            className="automotive-card p-4 flex items-center justify-center hover-lift group"
          >
            <div className="text-center">
              <Car className="h-8 w-8 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-smooth" />
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-smooth">
                {brand.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );

  const ctaSection = (
    <Section className="gradient-hero text-white">
      <div className="text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Gata să începem?
        </h2>
        
        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
          Descoperă mașina perfectă pentru tine sau lasă-ne să o comandăm special. 
          Procesul este simplu, rapid și transparent.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button variant="accent" size="xl" asChild className="group shadow-accent">
            <Link to="/stoc" className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Explorează Stocul
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          
          <Button variant="outline" size="xl" asChild className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary backdrop-blur-sm">
            <Link to="/comanda" className="flex items-center">
              <Car className="mr-2 h-5 w-5" />
              Comandă Mașina
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {heroSection}
      {uspSection}
      {processSection}
      {featuredCarsSection}
      {testimonialsSection}
      {brandsSection}
      {ctaSection}
      
      <Footer />
    </div>
  );
};

export default Index;
