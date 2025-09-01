"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Settings, CheckCircle } from 'lucide-react';

/**
 * Componenta CookieConsent - Banner de consimțământ pentru cookie-uri
 * Afișează un banner compact la prima vizită a utilizatorului pentru a obține consimțământul
 * pentru utilizarea cookie-urilor. Salvează alegerea în localStorage.
 */
export const CookieConsent: React.FC = () => {
  // Starea pentru controlul vizibilității bannerului
  const [isVisible, setIsVisible] = useState(false);
  // Starea pentru afișarea setărilor detaliate
  const [showSettings, setShowSettings] = useState(false);
  // Starea pentru cookie-urile selectate
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Cookie-urile necesare sunt întotdeauna activate
    analytics: false,
    marketing: false,
    preferences: false
  });

  // Verifică dacă utilizatorul a făcut deja o alegere la încărcarea componentei
  useEffect(() => {
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      // Delay mic pentru a nu fi prea agresiv
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  /**
   * Gestionează acceptarea tuturor cookie-urilor
   */
  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    setIsVisible(false);
    
    // Aici poți adăuga logica pentru activarea cookie-urilor
    console.log('Toate cookie-urile au fost acceptate');
  };

  /**
   * Gestionează refuzul cookie-urilor opționale
   */
  const handleRejectOptional = () => {
    const minimalConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('cookieConsent', JSON.stringify(minimalConsent));
    setIsVisible(false);
    
    // Aici poți adăuga logica pentru dezactivarea cookie-urilor opționale
    console.log('Doar cookie-urile necesare au fost acceptate');
  };

  /**
   * Gestionează salvarea preferințelor personalizate
   */
  const handleSavePreferences = () => {
    const preferences = {
      ...cookiePreferences,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    setIsVisible(false);
    setShowSettings(false);
    
    // Aici poți adăuga logica pentru aplicarea preferințelor
    console.log('Preferințele cookie-urilor au fost salvate:', preferences);
  };

  /**
   * Gestionează schimbarea preferințelor pentru cookie-uri
   */
  const handlePreferenceChange = (type: keyof typeof cookiePreferences) => {
    if (type === 'necessary') return; // Cookie-urile necesare nu pot fi dezactivate
    
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // Nu afișa bannerul dacă utilizatorul a făcut deja o alegere
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-4">
          {!showSettings ? (
            /* Banner principal compact */
            <div className="space-y-3">
              {/* Header compact */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1 bg-primary/10 rounded">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Cookie-uri
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              
              {/* Text compact */}
              <p className="text-xs text-gray-600 leading-relaxed">
                Folosim cookie-uri pentru a îmbunătăți experiența ta. 
                Cookie-urile necesare sunt esențiale pentru funcționarea site-ului.
              </p>
              
              {/* Butoane compacte */}
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={handleAcceptAll}
                  size="sm"
                  className="h-8 text-xs bg-primary hover:bg-primary/90 text-white"
                >
                  Acceptă toate
                </Button>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSettings(true)}
                    className="h-8 text-xs flex-1"
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    Setări
                  </Button>
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={handleRejectOptional}
                    className="h-8 text-xs flex-1 text-gray-500 hover:text-gray-700"
                  >
                    Refuz
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* Setări detaliate compacte */
            <div className="space-y-3">
              {/* Header setări */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  Setări Cookie-uri
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              
              <p className="text-xs text-gray-600">
                Selectează tipurile de cookie-uri:
              </p>
              
              {/* Opțiuni compacte */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {/* Cookie-uri necesare */}
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Necesare</div>
                    <div className="text-gray-500">Esențiale pentru funcționare</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={cookiePreferences.necessary}
                    disabled
                    className="h-3 w-3 text-primary border-gray-300 rounded"
                  />
                </div>

                {/* Cookie-uri analitice */}
                <div className="flex items-center justify-between p-2 border rounded text-xs">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Analitice</div>
                    <div className="text-gray-500">Îmbunătățesc site-ul</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={cookiePreferences.analytics}
                    onChange={() => handlePreferenceChange('analytics')}
                    className="h-3 w-3 text-primary border-gray-300 rounded"
                  />
                </div>

                {/* Cookie-uri marketing */}
                <div className="flex items-center justify-between p-2 border rounded text-xs">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Marketing</div>
                    <div className="text-gray-500">Reclame personalizate</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={cookiePreferences.marketing}
                    onChange={() => handlePreferenceChange('marketing')}
                    className="h-3 w-3 text-primary border-gray-300 rounded"
                  />
                </div>

                {/* Cookie-uri preferințe */}
                <div className="flex items-center justify-between p-2 border rounded text-xs">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Preferințe</div>
                    <div className="text-gray-500">Salvează setările tale</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={cookiePreferences.preferences}
                    onChange={() => handlePreferenceChange('preferences')}
                    className="h-3 w-3 text-primary border-gray-300 rounded"
                  />
                </div>
              </div>

              {/* Butoane acțiune */}
              <div className="flex gap-2 pt-2">
                <Button 
                  onClick={handleSavePreferences}
                  size="sm"
                  className="h-8 text-xs bg-primary hover:bg-primary/90 text-white flex-1"
                >
                  Salvează
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                  className="h-8 text-xs flex-1"
                >
                  Anulează
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
