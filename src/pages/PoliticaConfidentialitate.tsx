"use client";

import React from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Container } from '@/components/common/Container';
import { Section } from '@/components/common/Section';

/**
 * Pagina Politica de Confidențialitate GDPR
 * Conține politica de confidențialitate conform GDPR
 */
const PoliticaConfidentialitate = () => {
  return (
    <>
      <Navbar />
      
      <Section className="pt-32 pb-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Politica de Confidențialitate (GDPR)
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                Ultima actualizare: {new Date().toLocaleDateString('ro-RO')}
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                1. Introducere
              </h2>
              <p className="text-gray-700 mb-6">
                AutoOrder SRL (denumită în continuare "noi", "niște" sau "compania noastră") se angajează să protejeze 
                confidențialitatea și securitatea datelor personale ale utilizatorilor site-ului nostru. 
                Această politică de confidențialitate explică cum colectăm, utilizăm și protejăm informațiile dumneavoastră 
                în conformitate cu Regulamentul General privind Protecția Datelor (GDPR).
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                2. Datele pe care le Colectăm
              </h2>
              <p className="text-gray-700 mb-4">
                Colectăm următoarele tipuri de date personale:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Date de identificare:</strong> nume, prenume, adresă de email, număr de telefon</li>
                <li><strong>Date de contact:</strong> adresă, cod poștal, oraș</li>
                <li><strong>Date financiare:</strong> informații despre finanțare (doar cu consimțământul explicit)</li>
                <li><strong>Date tehnice:</strong> adresa IP, tipul browserului, sistemul de operare</li>
                <li><strong>Date de utilizare:</strong> paginile vizitate, timpul petrecut pe site, interacțiunile</li>
              </ul>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                3. Scopul Colectării Datelor
              </h2>
              <p className="text-gray-700 mb-4">
                Utilizăm datele dumneavoastră personale pentru următoarele scopuri:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Furnizarea serviciilor solicitate (intermediere auto, finanțare)</li>
                <li>Comunicarea cu dumneavoastră despre serviciile noastre</li>
                <li>Îmbunătățirea experienței de utilizare a site-ului</li>
                <li>Conformitatea cu obligațiile legale</li>
                <li>Marketing direct (doar cu consimțământul explicit)</li>
              </ul>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                4. Baza Legală pentru Prelucrare
              </h2>
              <p className="text-gray-700 mb-4">
                Prelucrăm datele dumneavoastră pe următoarele baze legale:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Consimțământul:</strong> pentru marketing direct și cookie-uri opționale</li>
                <li><strong>Executarea contractului:</strong> pentru furnizarea serviciilor solicitate</li>
                <li><strong>Interesul legitim:</strong> pentru îmbunătățirea serviciilor și securitate</li>
                <li><strong>Obligația legală:</strong> pentru conformitatea cu legislația în vigoare</li>
              </ul>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                5. Partajarea Datelor
              </h2>
              <p className="text-gray-700 mb-6">
                Nu vindem, închiriem sau partajăm datele dumneavoastră personale cu terți, 
                cu excepția cazurilor în care:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Aveți consimțământul explicit</li>
                <li>Este necesar pentru furnizarea serviciilor solicitate</li>
                <li>Este obligatoriu conform legislației în vigoare</li>
                <li>Este necesar pentru protejarea drepturilor noastre legitime</li>
              </ul>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                6. Securitatea Datelor
              </h2>
              <p className="text-gray-700 mb-6">
                Implementăm măsuri tehnice și organizatorice adecvate pentru a proteja datele dumneavoastră 
                împotriva accesului neautorizat, modificării, dezvăluirii sau distrugerii accidentale. 
                Aceste măsuri includ criptarea, firewall-uri și proceduri de securitate strictă.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                7. Drepturile Dumneavoastră GDPR
              </h2>
              <p className="text-gray-700 mb-4">
                Conform GDPR, aveți următoarele drepturi:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Dreptul de acces:</strong> să știți ce date avem despre dumneavoastră</li>
                <li><strong>Dreptul de rectificare:</strong> să corectați datele inexacte</li>
                <li><strong>Dreptul la ștergere:</strong> să ștergem datele dumneavoastră ("dreptul de a fi uitat")</li>
                <li><strong>Dreptul la restricționarea prelucrării:</strong> să limităm modul în care folosim datele</li>
                <li><strong>Dreptul la portabilitatea datelor:</strong> să primiți datele într-un format structurat</li>
                <li><strong>Dreptul de opoziție:</strong> să vă opuneți prelucrării pentru marketing</li>
                <li><strong>Dreptul de retragere a consimțământului:</strong> să retrageți consimțământul oricând</li>
              </ul>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                8. Cookie-uri
              </h2>
              <p className="text-gray-700 mb-6">
                Site-ul nostru folosește cookie-uri pentru a îmbunătăți experiența de navigare. 
                Pentru detalii complete despre tipurile de cookie-uri și cum să le gestionați, 
                consultați Politica noastră de Cookie-uri.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                9. Retenția Datelor
              </h2>
              <p className="text-gray-700 mb-6">
                Păstrăm datele dumneavoastră personale doar atât timp cât este necesar pentru 
                îndeplinirea scopurilor pentru care au fost colectate sau conform obligațiilor legale. 
                Datele sunt șterse automat după perioada de retenție specificată.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                10. Transferuri Internaționale
              </h2>
              <p className="text-gray-700 mb-6">
                Datele dumneavoastră sunt procesate în România și în Uniunea Europeană. 
                Dacă este necesar să transferăm date în afara SEE, ne asigurăm că există 
                garanții adecvate de protecție a datelor.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                11. Contact și Reclamații
              </h2>
              <p className="text-gray-700 mb-6">
                Pentru a vă exercita drepturile GDPR sau pentru întrebări despre această politică, 
                ne puteți contacta la:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-gray-700">
                  <strong>Responsabil cu protecția datelor:</strong><br />
                  <strong>Email:</strong> dpo@autoorder.ro<br />
                  <strong>Telefon:</strong> +40 721 234 567<br />
                  <strong>Adresă:</strong> Strada Victoriei 123, București, România
                </p>
              </div>
              
              <p className="text-gray-700 mb-6">
                Aveți dreptul să depuneți o plângere la Autoritatea de Supraveghere a Prelucrării Datelor cu Caracter Personal 
                (ANSPDCP) dacă considerați că prelucrarea datelor dumneavoastră încalcă GDPR-ul.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                12. Modificări ale Politicii
              </h2>
              <p className="text-gray-700 mb-6">
                Ne rezervăm dreptul de a actualiza această politică de confidențialitate. 
                Modificările vor fi afișate pe această pagină și vă vom notifica despre schimbări importante.
              </p>
            </div>
          </div>
        </Container>
      </Section>
      
      <Footer />
    </>
  );
};

export default PoliticaConfidentialitate;
