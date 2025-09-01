"use client";

import React from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Container } from '@/components/common/Container';
import { Section } from '@/components/common/Section';

/**
 * Pagina Politica de Cookie-uri
 * Conține politica detaliată despre utilizarea cookie-urilor
 */
const PoliticaCookie = () => {
  return (
    <>
      <Navbar />
      
      <Section className="pt-32 pb-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Politica de Cookie-uri
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                Ultima actualizare: {new Date().toLocaleDateString('ro-RO')}
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                1. Ce sunt Cookie-urile?
              </h2>
              <p className="text-gray-700 mb-6">
                Cookie-urile sunt fișiere text mici care sunt plasate pe dispozitivul dumneavoastră 
                (computer, tabletă, telefon mobil) când vizitați site-ul nostru. Acestea permit site-ului 
                să "își amintească" acțiunile și preferințele dumneavoastră pe o perioadă de timp, 
                astfel încât să nu trebuiască să le introduceți din nou de fiecare dată când vizitați site-ul.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                2. Tipurile de Cookie-uri pe care le Folosim
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                2.1 Cookie-uri Necesare
              </h3>
              <p className="text-gray-700 mb-4">
                Aceste cookie-uri sunt esențiale pentru funcționarea site-ului și nu pot fi dezactivate. 
                Ele nu stochează nicio informație personală identificabilă.
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Cookie-uri de sesiune:</strong> mențin sesiunea activă pe site</li>
                <li><strong>Cookie-uri de securitate:</strong> protejează împotriva atacurilor și fraudelor</li>
                <li><strong>Cookie-uri de funcționalitate de bază:</strong> permit navigarea și utilizarea funcțiilor esențiale</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                2.2 Cookie-uri Analitice
              </h3>
              <p className="text-gray-700 mb-4">
                Aceste cookie-uri ne ajută să înțelegem cum interacționați cu site-ul nostru, 
                permițându-ne să îmbunătățim funcționalitatea și experiența utilizatorului.
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Google Analytics:</strong> analizează traficul site-ului și comportamentul utilizatorilor</li>
                <li><strong>Cookie-uri de performanță:</strong> măsoară timpul de încărcare și performanța site-ului</li>
                <li><strong>Cookie-uri de erori:</strong> înregistrează erorile pentru îmbunătățirea site-ului</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                2.3 Cookie-uri de Marketing
              </h3>
              <p className="text-gray-700 mb-4">
                Aceste cookie-uri sunt folosite pentru a vă afișa reclame relevante și personalizate 
                pe baza intereselor și comportamentului dumneavoastră online.
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Cookie-uri de rețele sociale:</strong> permit partajarea conținutului pe rețelele sociale</li>
                <li><strong>Cookie-uri de publicitate:</strong> afișează reclame personalizate</li>
                <li><strong>Cookie-uri de tracking:</strong> urmează interacțiunile pentru optimizarea campaniilor</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                2.4 Cookie-uri de Preferințe
              </h3>
              <p className="text-gray-700 mb-4">
                Aceste cookie-uri salvează preferințele dumneavoastră pentru a personaliza experiența 
                pe site-ul nostru.
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Cookie-uri de limbă:</strong> salvează limba preferată</li>
                <li><strong>Cookie-uri de temă:</strong> salvează preferințele de design</li>
                <li><strong>Cookie-uri de filtrare:</strong> salvează filtrele aplicate pentru vehicule</li>
              </ul>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                3. Cookie-uri de la Terți
              </h2>
              <p className="text-gray-700 mb-4">
                Site-ul nostru poate include cookie-uri de la terți pentru servicii precum:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Google Analytics:</strong> pentru analiza traficului</li>
                <li><strong>Facebook Pixel:</strong> pentru tracking și publicitate</li>
                <li><strong>YouTube:</strong> pentru afișarea videoclipurilor</li>
                <li><strong>Google Maps:</strong> pentru afișarea hărților</li>
              </ul>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                4. Durata de Viață a Cookie-urilor
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Cookie-uri de sesiune:</strong> se șterg automat când închideți browserul</li>
                  <li><strong>Cookie-uri persistente:</strong> rămân pe dispozitiv pentru o perioadă specificată</li>
                  <li><strong>Cookie-uri de marketing:</strong> pot rămâne până la 2 ani</li>
                  <li><strong>Cookie-uri analitice:</strong> pot rămâne până la 2 ani</li>
                </ul>
              </div>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                5. Cum să Gestionați Cookie-urile
              </h2>
              <p className="text-gray-700 mb-4">
                Aveți mai multe opțiuni pentru a gestiona cookie-urile:
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                5.1 Setări Browser
              </h3>
              <p className="text-gray-700 mb-4">
                Puteți modifica setările browserului pentru a:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Bloca toate cookie-urile</li>
                <li>Permite doar cookie-uri de la site-uri de încredere</li>
                <li>Șterge cookie-urile existente</li>
                <li>Primi notificări când sunt plasate cookie-uri</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                5.2 Setări pe Site
              </h3>
              <p className="text-gray-700 mb-6">
                Puteți modifica preferințele cookie-urilor direct pe site-ul nostru 
                folosind bannerul de consimțământ sau setările de cookie-uri.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                6. Efectele Dezactivării Cookie-urilor
              </h2>
              <p className="text-gray-700 mb-6">
                Dezactivarea anumitor tipuri de cookie-uri poate afecta funcționalitatea site-ului:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Cookie-urile necesare: site-ul nu va funcționa corect</li>
                <li>Cookie-urile analitice: nu vom putea îmbunătăți site-ul pe baza datelor de utilizare</li>
                <li>Cookie-urile de marketing: reclamele nu vor fi personalizate</li>
                <li>Cookie-urile de preferințe: va trebui să setați din nou preferințele la fiecare vizită</li>
              </ul>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                7. Actualizări ale Politicii
              </h2>
              <p className="text-gray-700 mb-6">
                Această politică de cookie-uri poate fi actualizată periodic pentru a reflecta 
                schimbările în practicile noastre sau în legislația în vigoare. 
                Vă recomandăm să verificați această pagină în mod regulat.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                8. Contact
              </h2>
              <p className="text-gray-700 mb-6">
                Pentru întrebări despre această politică de cookie-uri, ne puteți contacta la:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@autoorder.ro<br />
                  <strong>Telefon:</strong> +40 721 234 567<br />
                  <strong>Adresă:</strong> Strada Victoriei 123, București, România
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
      
      <Footer />
    </>
  );
};

export default PoliticaCookie;
