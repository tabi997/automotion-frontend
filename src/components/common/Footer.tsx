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
      { label: 'Comandă Auto', href: '/comanda' },
      { label: 'Finanțare', href: '/finantare' },
    ]
  },
  services: {
    title: 'Servicii',
    links: [
      { label: 'Stoc Auto', href: '/stoc' },
      { label: 'Comandă Auto', href: '/comanda' },
      { label: 'Finanțare', href: '/finantare' },
      { label: 'Buyback', href: '/buyback' },
      { label: 'Contact', href: '/contact' },
    ]
  },
  support: {
    title: 'Suport',
    links: [
      { label: 'Contact', href: '/contact' },
      { label: 'Stoc Auto', href: '/stoc' },
      { label: 'Comandă Auto', href: '/comanda' },
      { label: 'Finanțare', href: '/finantare' },
    ]
  },
  legal: {
    title: 'Legal',
    links: [
      { label: 'Contact', href: '/contact' },
      { label: 'Stoc Auto', href: '/stoc' },
      { label: 'Comandă Auto', href: '/comanda' },
      { label: 'Finanțare', href: '/finantare' },
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
        {/* Main Footer Content */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand & Contact */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="p-2 bg-primary-foreground/10 rounded-xl">
                  <Car className="h-6 w-6" />
                </div>
                <span className="text-xl font-bold">AutoOrder</span>
              </div>
              
              <p className="text-primary-foreground/80 mb-6 max-w-md">
                Găsește mașina perfectă din stocul nostru premium sau comandă exact 
                vehiculul dorit. Finanțare rapidă și servicii complete.
              </p>
              
              <div className="space-y-3">
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

            {/* Footer Links */}
            {Object.entries(footerSections).map(([key, section]) => (
              <div key={key}>
                <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="text-primary-foreground/80 hover:text-accent transition-smooth text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-primary-foreground/20 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Rămâi la curent</h3>
              <p className="text-primary-foreground/80 text-sm">
                Primește ultimele oferte și noutăți direct în inbox.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 lg:max-w-md">
              <input
                type="email"
                placeholder="Adresa ta de email"
                className="flex-1 px-4 py-3 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Button variant="accent" size="default" className="whitespace-nowrap">
                Abonează-te
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-primary-foreground/20 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-primary-foreground/60 text-sm">
              © {new Date().getFullYear()} AutoOrder. Toate drepturile rezervate.
            </p>
            
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-smooth"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};