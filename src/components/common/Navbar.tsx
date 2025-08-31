"use client";

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Car, 
  Menu, 
  X, 
  Phone, 
  Globe,
  ChevronDown
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  badge?: string;
}

const navigation: NavItem[] = [
  { href: '/', label: 'Acasă' },
  { href: '/stoc', label: 'Stoc Auto' },
  { href: '/buyback', label: 'Vinde Mașina', badge: 'Nou' },
  { href: '/finantare', label: 'Finanțare' },
  { href: '/contact', label: 'Contact' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-smooth",
      isScrolled 
        ? "bg-background/95 backdrop-blur-md shadow-medium border-b border-border" 
        : "bg-transparent"
    )}>
      <div className="container-auto">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-primary rounded-xl shadow-medium group-hover:shadow-large transition-smooth">
              <Car className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold automotive-gradient-text">
              AutoOrder
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "relative px-4 py-2 rounded-lg text-sm font-medium transition-smooth hover:bg-accent/10",
                  location.pathname === item.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs px-1.5 py-0.5 rounded-full font-semibold">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <a href="tel:+40721234567" className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+40 721 234 567</span>
              </a>
            </Button>
            
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm">
                <Globe className="h-4 w-4" />
                <span>RO</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
            
            <Button variant="hero" size="default" asChild>
              <Link to="/stoc">
                Explorează Stocul
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-accent/10 transition-smooth"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md">
            <div className="py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "block px-4 py-3 rounded-lg text-sm font-medium transition-smooth",
                    location.pathname === item.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
                  )}
                >
                  <div className="flex items-center justify-between">
                    {item.label}
                    {item.badge && (
                      <span className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
              
              <div className="pt-4 space-y-3 border-t border-border">
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href="tel:+40721234567" className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>+40 721 234 567</span>
                  </a>
                </Button>
                
                <Button variant="hero" size="default" className="w-full" asChild>
                  <Link to="/stoc">
                    Explorează Stocul
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};