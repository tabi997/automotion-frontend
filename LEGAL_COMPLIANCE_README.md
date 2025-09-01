# Implementare Conformitate Legală - AutoOrder

Acest document descrie implementarea componentelor de conformitate legală pentru site-ul AutoOrder, conform cerințelor GDPR și legislației românești.

## Componente Implementate

### 1. Footer Actualizat (`src/components/common/Footer.tsx`)

**Funcționalități adăugate:**
- **Linkuri legale:** Termeni și Condiții, Politica de Confidențialitate (GDPR), Politica de Cookie-uri
- **Informații firma:** Denumire completă (AutoOrder SRL), CUI, Nr. Reg. Comerț, adresă, telefon, email
- **Pictograme ANPC:** SAL și SOL cu linkuri externe către autoritățile competente
- **Structură organizată:** Secțiuni separate pentru informații firma, documente legale și autorități

**Pictograme ANPC:**
- `public/sal.svg` - Pictograma ANPC SAL (Soluționarea Alternativă a Litigiilor)
- `public/sol.svg` - Pictograma SOL (Platforma Online de Rezolvare a Disputelor)
- Linkuri externe către `https://anpc.ro/ce-este-sal/` și `https://ec.europa.eu/consumers/odr`

### 2. Componenta CookieConsent (`src/components/common/CookieConsent.tsx`)

**Funcționalități:**
- **Banner de consimțământ** afișat la prima vizită
- **Text în limba română** explicând utilizarea cookie-urilor
- **Butoane de acțiune:** "Acceptă toate cookie-urile", "Setări cookie-uri", "Refuz cookie-uri opționale"
- **Setări detaliate** cu opțiuni pentru fiecare tip de cookie:
  - Cookie-uri necesare (întotdeauna activate)
  - Cookie-uri analitice
  - Cookie-uri marketing
  - Cookie-uri preferințe
- **Persistența alegerii** în localStorage
- **Stilizare modernă** cu Tailwind CSS și componente shadcn/ui

**Stare gestionată:**
- `isVisible` - controlul vizibilității bannerului
- `showSettings` - afișarea setărilor detaliate
- `cookiePreferences` - preferințele pentru fiecare tip de cookie

### 3. Pagini Legale

#### Termeni și Condiții (`src/pages/TermeniConditii.tsx`)
- Acceptarea termenilor
- Descrierea serviciilor
- Utilizarea site-ului
- Informații despre vehicule
- Prețuri și disponibilitate
- Confidențialitatea și securitatea
- Limitarea răspunderii
- Drepturi de proprietate intelectuală
- Modificări ale termenilor
- Informații de contact

#### Politica de Confidențialitate GDPR (`src/pages/PoliticaConfidentialitate.tsx`)
- Introducere GDPR
- Datele colectate
- Scopul colectării
- Baza legală pentru prelucrare
- Partajarea datelor
- Securitatea datelor
- Drepturile GDPR (acces, rectificare, ștergere, etc.)
- Cookie-uri
- Retenția datelor
- Transferuri internaționale
- Contact și reclamații
- Modificări ale politicii

#### Politica de Cookie-uri (`src/pages/PoliticaCookie.tsx`)
- Ce sunt cookie-urile
- Tipurile de cookie-uri (necesare, analitice, marketing, preferințe)
- Cookie-uri de la terți
- Durata de viață
- Cum să gestionați cookie-urile
- Efectele dezactivării
- Actualizări ale politicii
- Informații de contact

## Integrare în Aplicație

### Rute Adăugate (`src/App.tsx`)
```typescript
<Route path="/termeni-conditii" element={<TermeniConditii />} />
<Route path="/politica-confidentialitate" element={<PoliticaConfidentialitate />} />
<Route path="/politica-cookie-uri" element={<PoliticaCookie />} />
```

### Componenta CookieConsent Integrată
```typescript
<CookieConsent />
```

## Conformitate GDPR

### Principii Implementate:
1. **Consimțământ explicit** pentru cookie-uri opționale
2. **Transparență** prin politici detaliate
3. **Drepturi utilizatori** explicate clar
4. **Securitatea datelor** menționată
5. **Contact DPO** specificat

### Cookie-uri Conform GDPR:
- **Necesare:** Întotdeauna activate, esențiale pentru funcționare
- **Analitice:** Pentru îmbunătățirea site-ului
- **Marketing:** Pentru publicitate personalizată
- **Preferințe:** Pentru personalizarea experienței

## Conformitate ANPC

### Pictograme Implementate:
- **ANPC SAL:** Soluționarea Alternativă a Litigiilor
- **SOL:** Platforma Online de Rezolvare a Disputelor

### Linkuri Externe:
- SAL: `https://anpc.ro/ce-este-sal/`
- SOL: `https://ec.europa.eu/consumers/odr`

## Utilizare

### CookieConsent
Componenta se afișează automat la prima vizită și salvează alegerea utilizatorului în localStorage. Pentru a reseta consimțământul, ștergeți cheia `cookieConsent` din localStorage.

### Footer
Footer-ul actualizat este afișat pe toate paginile și conține toate informațiile legale necesare.

### Pagini Legale
Paginile sunt accesibile prin linkurile din footer sau direct prin URL-urile:
- `/termeni-conditii`
- `/politica-confidentialitate`
- `/politica-cookie-uri`

## Personalizare

### Informații Firma
Modificați informațiile firmei în `src/components/common/Footer.tsx`:
```typescript
<p><strong>Denumire:</strong> AutoOrder SRL</p>
<p><strong>CUI:</strong> RO12345678</p>
// ... etc
```

### Cookie-uri
Pentru a adăuga logica de activare/dezactivare a cookie-urilor, modificați funcțiile din `CookieConsent.tsx`:
```typescript
const handleAcceptAll = () => {
  // Adăugați logica pentru activarea cookie-urilor
  // De exemplu: Google Analytics, Facebook Pixel, etc.
};
```

## Note Tehnice

- Toate componentele folosesc TypeScript strict
- Stilizarea se face exclusiv cu Tailwind CSS
- Componentele shadcn/ui sunt folosite pentru consistență
- Textul este complet în limba română
- Componentele sunt responsive și accesibile
- Persistența datelor se face în localStorage

## Verificare Conformitate

1. **Cookie-uri:** Verificați că bannerul se afișează la prima vizită
2. **Linkuri:** Testați că toate linkurile legale funcționează
3. **Pictograme ANPC:** Verificați că imaginile se încarcă și linkurile externe funcționează
4. **Informații firma:** Confirmați că toate informațiile sunt corecte și actualizate
5. **GDPR:** Verificați că toate drepturile sunt explicate și contactul DPO este specificat

## Suport

Pentru întrebări sau probleme legate de implementarea conformității legale, contactați echipa de dezvoltare sau consultați documentația GDPR și ANPC.
