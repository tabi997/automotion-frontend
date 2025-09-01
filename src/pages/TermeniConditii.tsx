"use client";

import React from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Container } from '@/components/common/Container';
import { Section } from '@/components/common/Section';

/**
 * Pagina Termeni și Condiții
 * Conține termenii și condițiile de utilizare a site-ului
 */
const TermeniConditii = () => {
  return (
    <>
      <Navbar />
      
      <Section className="pt-32 pb-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Termeni și Condiții
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                Ultima actualizare: {new Date().toLocaleDateString('ro-RO')}
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                1. Acceptarea Termenilor
              </h2>
              <p className="text-gray-700 mb-6">
                Prin accesarea și utilizarea site-ului AutoOrder.ro, acceptați să respectați acești termeni și condiții 
                de utilizare. Dacă nu sunteți de acord cu orice parte a acestor termeni, vă rugăm să nu utilizați site-ul nostru.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                2. Descrierea Serviciilor
              </h2>
              <p className="text-gray-700 mb-6">
                AutoOrder.ro oferă servicii de intermediere în vânzarea și cumpărarea de vehicule, 
                inclusiv stoc auto, comenzi personalizate, servicii de finanțare și alte servicii conexe 
                în domeniul auto.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                3. Utilizarea Site-ului
              </h2>
              <p className="text-gray-700 mb-6">
                Vă angajați să utilizați site-ul doar în scopuri legale și în conformitate cu acești termeni. 
                Nu aveți dreptul să utilizați site-ul pentru a transmite materiale ilegale, dăunătoare, 
                amenințătoare, abuzive, hărțuitoare, defăimătoare, vulgare, obscene sau altfel inacceptabile.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                4. Informații despre Vehicule
              </h2>
              <p className="text-gray-700 mb-6">
                Deși ne străduim să oferim informații precise și actualizate despre vehiculele afișate, 
                nu garantăm că toate informațiile sunt complete, exacte sau actualizate. 
                Vă recomandăm să verificați personal informațiile despre vehicul înainte de a face o achiziție.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                5. Prețuri și Disponibilitate
              </h2>
              <p className="text-gray-700 mb-6">
                Prețurile afișate pot fi supuse modificărilor fără notificare prealabilă. 
                Disponibilitatea vehiculelor poate varia în funcție de cerere. 
                Ne rezervăm dreptul de a modifica sau întrerupe serviciile în orice moment.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                6. Confidențialitatea și Securitatea
              </h2>
              <p className="text-gray-700 mb-6">
                Protejarea confidențialității și securității datelor dumneavoastră este o prioritate pentru noi. 
                Pentru detalii complete, consultați Politica noastră de Confidențialitate.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                7. Limitarea Răspunderii
              </h2>
              <p className="text-gray-700 mb-6">
                AutoOrder.ro nu poate fi trasă la răspundere pentru daune directe, indirecte, incidentale, 
                speciale sau consecvente care rezultă din utilizarea sau incapacitatea de a utiliza site-ul.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                8. Drepturi de Proprietate Intelectuală
              </h2>
              <p className="text-gray-700 mb-6">
                Conținutul site-ului, inclusiv textele, imaginile, logotipurile și designul, 
                sunt protejate de drepturile de proprietate intelectuală și aparțin AutoOrder.ro 
                sau licențiatorilor săi.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                9. Modificări ale Termenilor
              </h2>
              <p className="text-gray-700 mb-6">
                Ne rezervăm dreptul de a modifica acești termeni în orice moment. 
                Modificările vor fi afișate pe această pagină și vor intra în vigoare la data publicării.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                10. Contact
              </h2>
              <p className="text-gray-700 mb-6">
                Pentru întrebări sau nelămuriri legate de acești termeni, ne puteți contacta la:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> contact@autoorder.ro<br />
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

export default TermeniConditii;
