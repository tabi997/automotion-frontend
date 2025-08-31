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
  CheckCircle
} from 'lucide-react';

// Import images
import heroCarImage from '@/assets/hero-car.jpg';
import bmwImage from '@/assets/bmw-x5.jpg';
import mercedesImage from '@/assets/mercedes-amg.jpg';
import audiImage from '@/assets/audi-a4.jpg';

// Import mock data
import settingsData from '@/data/settings.json';
import testimonialsData from '@/data/testimonials.json';
import brandsData from '@/data/brands.json';

const Index = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => 
        (prev + 1) % testimonialsData.testimonials.length
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

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
            
            <Button variant="outline" size="xl" className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary backdrop-blur-sm">
              {settingsData.hero.cta_secondary.ro}
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
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Mașini Premium Disponibile</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          O selecție din stocul nostru de vehicule verificate și certificate
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {[
          { 
            image: bmwImage, 
            brand: 'BMW', 
            model: 'X5', 
            year: 2023, 
            price: 85000,
            badges: [
              { text: 'Primul proprietar', variant: 'success' as const },
              { text: 'Service complet', variant: 'info' as const }
            ]
          },
          { 
            image: mercedesImage, 
            brand: 'Mercedes-Benz', 
            model: 'AMG GT', 
            year: 2024, 
            price: 165000,
            badges: [
              { text: 'Nou', variant: 'success' as const },
              { text: 'Urgent', variant: 'urgent' as const }
            ]
          },
          { 
            image: audiImage, 
            brand: 'Audi', 
            model: 'A4', 
            year: 2022, 
            price: 42000,
            badges: [
              { text: 'Fără accident', variant: 'success' as const },
              { text: 'Verificat', variant: 'info' as const }
            ]
          }
        ].map((car, index) => (
          <div 
            key={index}
            className={`automotive-card overflow-hidden hover-lift animate-fade-in-up stagger-${index + 1}`}
          >
            <div className="relative">
              <img 
                src={car.image}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {car.badges.map((badge, badgeIndex) => (
                  <Badge key={badgeIndex} variant={badge.variant} size="sm">
                    {badge.text}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">
                {car.brand} {car.model}
              </h3>
              <p className="text-muted-foreground mb-4">An: {car.year}</p>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-primary">
                    €{car.price.toLocaleString()}
                  </span>
                </div>
                
                <Button variant="outline" size="sm">
                  Detalii
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <Button variant="premium" size="lg" asChild>
          <Link to="/stoc">
            Vezi Tot Stocul
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
          
          <Button variant="outline" size="xl" className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary backdrop-blur-sm">
            <Car className="mr-2 h-5 w-5" />
            Comandă Mașina
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
