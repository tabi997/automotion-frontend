"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';

const footerSections = {
  company: {
    title: 'AutoOrder',
    links: [
      { label: 'Cum funcționează', href: '/#process' },
      { label: 'Stoc Auto', href: '/stoc' },
      { label: 'Servicii', href: '/comanda' },
      { label: 'Finanțare', href: '/finantare' },
    ]
  },
  services: {
    title: 'Servicii',
    links: [
      { label: 'Comandă Auto', href: '/comanda' },
      { label: 'Vinde Mașina', href: '/buyback' },
      { label: 'Contact', href: '/contact' },
    ]
  },
  legal: {
    title: 'Legal',
    links: [
      { label: 'Termeni și Condiții', href: '/termeni-conditii' },
      { label: 'Politica de Confidențialitate', href: '/politica-confidentialitate' },
      { label: 'Politica de Cookie-uri', href: '/politica-cookie-uri' },
    ]
  }
};

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-auto">
        {/* Main Footer Content - Compact */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand & Contact - Compact */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-primary-foreground/10 rounded-xl">
                  <Car className="h-5 w-5" />
                </div>
                <span className="text-lg font-bold">AutoOrder</span>
              </div>
              
              <p className="text-primary-foreground/80 mb-4 text-sm">
                Găsește mașina perfectă din stocul nostru premium sau comandă exact 
                vehiculul dorit. Finanțare rapidă și servicii complete.
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-accent" />
                  <a href="tel:+40721234567" className="hover:text-accent transition-smooth">
                    +40 721 234 567
                  </a>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-accent" />
                  <a href="mailto:contact@autoorder.ro" className="hover:text-accent transition-smooth">
                    contact@autoorder.ro
                  </a>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-primary-foreground/80">
                    Strada Victoriei 123, București, România
                  </span>
                </div>
              </div>
            </div>

            {/* Newsletter Section - Moved to right side */}
            <div className="lg:col-span-2">
              <h3 className="text-base font-semibold mb-3">Rămâi la curent</h3>
              <p className="text-primary-foreground/80 text-sm mb-4">
                Primește ultimele oferte și noutăți direct în inbox.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 lg:max-w-md">
                <input
                  type="email"
                  placeholder="Adresa ta de email"
                  className="flex-1 px-3 py-2 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                />
                <Button variant="accent" size="sm" className="whitespace-nowrap">
                  Abonează-te
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Company Information & Legal - Compact */}
        <div className="border-t border-primary-foreground/20 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Company Details - Compact */}
            <div className="space-y-2">
              <h4 className="font-semibold text-primary-foreground text-sm">Informații Firma</h4>
              <div className="space-y-1 text-xs text-primary-foreground/80">
                <p><strong>Denumire:</strong> AutoOrder SRL</p>
                <p><strong>CUI:</strong> RO12345678</p>
                <p><strong>Nr. Reg. Comerț:</strong> J40/1234/2023</p>
              </div>
            </div>

            {/* Legal Links - Compact */}
            <div className="space-y-2">
              <h4 className="font-semibold text-primary-foreground text-sm">Documente Legale</h4>
              <div className="space-y-1">
                <Link 
                  to="/termeni-conditii" 
                  className="block text-primary-foreground/80 hover:text-accent transition-smooth text-xs"
                >
                  Termeni și Condiții
                </Link>
                <Link 
                  to="/politica-confidentialitate" 
                  className="block text-primary-foreground/80 hover:text-accent transition-smooth text-xs"
                >
                  Politica de Confidențialitate (GDPR)
                </Link>
                <Link 
                  to="/politica-cookie-uri" 
                  className="block text-primary-foreground/80 hover:text-accent transition-smooth text-xs"
                >
                  Politica de Cookie-uri
                </Link>
              </div>
            </div>

            {/* ANPC Badges - Updated with official logos */}
            <div className="space-y-2">
              <h4 className="font-semibold text-primary-foreground text-sm">Autorități de Supraveghere</h4>
              <div className="flex flex-col space-y-2">
                <a 
                  href="https://anpc.ro/ce-este-sal/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block"
                  aria-label="Link către ANPC SAL - Soluționarea Alternativă a Litigiilor"
                >
                  <img 
                    src="https://anpc.ro/wp-content/uploads/brizy/imgs/wp-7af89f9c287bc8c5cecef1fdd442bffc-370x174x0x0x370x174x1701197532.png" 
                    alt="ANPC SAL - Soluționarea Alternativă a Litigiilor" 
                    width="200" 
                    height="40" 
                    className="h-8 w-auto bg-white rounded p-1"
                  />
                </a>
                <a 
                  href="https://ec.europa.eu/consumers/odr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block"
                  aria-label="Link către SOL - Platforma Online de Rezolvare a Disputelor"
                >
                  <img 
                    src="https://consumer-redress.ec.europa.eu/themes/contrib/oe_theme/dist/ec/images/logo/positive/logo-ec--en.svg" 
                    alt="SOL - Platforma Online de Rezolvare a Disputelor" 
                    width="200" 
                    height="40" 
                    className="h-8 w-auto bg-white rounded p-1"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer - Compact */}
        <div className="border-t border-primary-foreground/20 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-primary-foreground/60 text-xs">
              © {new Date().getFullYear()} AutoOrder SRL. Toate drepturile rezervate.
            </p>
            
            <div className="flex items-center space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-1.5 rounded-md bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-smooth"
                  aria-label={social.label}
                >
                  <social.icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};