"use client";

import React, { useState, useEffect, useRef } from 'react';
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
  children?: NavItem[];
}

const navigation: NavItem[] = [
  { href: '/', label: 'Acasă' },
  { href: '/stoc', label: 'Stoc Auto' },
  { 
    href: '#', 
    label: 'Servicii',
    children: [
      { href: '/comanda', label: 'Comandă Mașină' },
      { href: '/buyback', label: 'Vinde Mașina' }
    ]
  },
  { href: '/finantare', label: 'Finanțare' },
  { href: '/contact', label: 'Contact' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownToggle = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-smooth",
      "bg-background/95 backdrop-blur-md shadow-medium border-b border-border"
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
          <div className="hidden lg:flex items-center space-x-1" ref={dropdownRef}>
            {navigation.map((item) => (
              <div key={item.href} className="relative">
                {item.children ? (
                  <div>
                    <button
                      onClick={() => handleDropdownToggle(item.label)}
                      className={cn(
                        "relative px-4 py-2 rounded-lg text-sm font-medium transition-smooth hover:bg-accent/10 flex items-center space-x-1",
                        "text-foreground hover:text-primary"
                      )}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={cn(
                        "h-3 w-3 transition-transform",
                        openDropdown === item.label ? "rotate-180" : ""
                      )} />
                    </button>
                    
                    {openDropdown === item.label && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-large py-2 z-50 animate-fade-in">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className={cn(
                              "block px-4 py-2 text-sm font-medium transition-smooth hover:bg-accent/10",
                              location.pathname === child.href
                                ? "text-primary bg-primary/10"
                                : "text-foreground hover:text-primary"
                            )}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "relative px-4 py-2 rounded-lg text-sm font-medium transition-smooth hover:bg-accent/10",
                      location.pathname === item.href
                        ? "text-primary bg-primary/10"
                        : "text-foreground hover:text-primary"
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
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
          <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md relative z-40">
            <div className="py-4 space-y-2">
              {navigation.map((item) => (
                <div key={item.href}>
                  {item.children ? (
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDropdownToggle(item.label);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-smooth flex items-center justify-between",
                          "text-foreground hover:text-primary hover:bg-accent/10"
                        )}
                      >
                        <span>{item.label}</span>
                        <ChevronDown className={cn(
                          "h-3 w-3 transition-transform",
                          openDropdown === item.label ? "rotate-180" : ""
                        )} />
                      </button>
                      
                      {openDropdown === item.label && (
                        <div className="pl-4 space-y-1 animate-fade-in relative z-50">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              to={child.href}
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(false);
                                setOpenDropdown(null);
                              }}
                              className={cn(
                                "block px-4 py-2 rounded-lg text-sm font-medium transition-smooth",
                                location.pathname === child.href
                                  ? "text-primary bg-primary/10"
                                  : "text-foreground hover:text-primary hover:bg-accent/10"
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "block px-4 py-3 rounded-lg text-sm font-medium transition-smooth",
                        location.pathname === item.href
                          ? "text-primary bg-primary/10"
                          : "text-foreground hover:text-primary hover:bg-accent/10"
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              
              <div className="pt-4 space-y-3 border-t border-border">
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <a href="tel:+40721234567" className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>+40 721 234 567</span>
                  </a>
                </Button>
                
                <Button variant="hero" size="default" className="w-full" asChild>
                  <Link to="/stoc" onClick={() => setIsOpen(false)}>
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