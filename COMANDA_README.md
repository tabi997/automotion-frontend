# Funcționalitatea de Comandă Mașină

## Descriere

Am implementat o funcționalitate completă pentru comandă mașină care permite utilizatorilor să trimită cereri personalizate pentru vehicule specifice. Aceste cereri sunt salvate ca lead-uri în baza de date și pot fi gestionate din panoul de administrare.

## Ce am implementat

### 1. Baza de Date
- **Tabel nou**: `lead_order` pentru stocarea cererilor de comandă
- **Migrație**: `20250101000002_lead_order_table.sql`
- **Structură**: Include toate câmpurile necesare pentru preferințele mașinii și informațiile de contact

### 2. Pagina de Comandă
- **Rută**: `/comanda`
- **Fișier**: `src/pages/ComandaMasina.tsx`
- **Formular complet** cu:
  - Preferințe mașină (marcă, model, an, km, combustibil, etc.)
  - Caracteristici speciale (checkbox-uri pentru opțiuni)
  - Informații de contact
  - Consent GDPR
  - Validare și feedback

### 3. Integrare cu Admin
- **Tab nou** în pagina de lead-uri: "Comandă"
- **Dashboard** actualizat cu statistici pentru lead-urile de comandă
- **Gestionare status** pentru lead-urile de comandă

### 4. Actualizări Homepage
- **Butoanele "Comandă Mașina"** sunt acum funcționale
- **Redirect** către formularul de comandă
- **Validare** că butoanele duc la destinația corectă

## Cum să rulezi

### 1. Rularea Migrației
```bash
# Instalează dependințele dacă nu le ai
npm install

# Rulează migrația
node scripts/run-migration.js
```

### 2. Testarea Funcționalității
1. **Homepage**: Click pe butoanele "Comandă Mașina"
2. **Formular**: Completează și trimite o cerere de comandă
3. **Admin**: Verifică lead-urile în `/admin/leads` tab-ul "Comandă"

## Structura Tabelului `lead_order`

```sql
CREATE TABLE public.lead_order (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Preferințe mașină
  marca TEXT NOT NULL,
  model TEXT,
  an_min INTEGER,
  an_max INTEGER,
  km_max INTEGER,
  combustibil TEXT,
  transmisie TEXT,
  caroserie TEXT,
  culoare TEXT,
  pret_max NUMERIC,
  pret_min NUMERIC,
  
  -- Preferințe suplimentare
  caracteristici_speciale TEXT[],
  urgent BOOLEAN DEFAULT false,
  observatii TEXT,
  
  -- Informații contact
  nume TEXT NOT NULL,
  telefon TEXT NOT NULL,
  email TEXT NOT NULL,
  preferinta_contact TEXT,
  interval_orar TEXT,
  
  -- GDPR și status
  gdpr BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'new'
);
```

## Funcții Admin Adăugate

- `getOrderLeads()` - Obține toate lead-urile de comandă
- `createOrderLead()` - Creează un nou lead de comandă
- `setLeadStatus()` - Actualizează statusul lead-urilor (actualizat pentru lead_order)

## Rute Noi

- **`/comanda`** - Formularul de comandă mașină
- **`/admin/leads`** - Tab-ul "Comandă" pentru gestionarea lead-urilor

## Validări Implementate

- **Câmpuri obligatorii**: Marcă, nume, telefon, email, GDPR
- **Validări numerice**: An (1995-prezent), preț (>1000€), km (>0)
- **Consent GDPR**: Obligatoriu pentru trimiterea formularului
- **Feedback utilizator**: Mesaje de succes/eroare cu toast-uri

## Stilizare și UX

- **Design consistent** cu restul aplicației
- **Responsive** pentru toate dispozitivele
- **Feedback vizual** pentru toate acțiunile
- **Formular intuitiv** cu grupări logice
- **Succes page** cu opțiuni de navigare

## Următorii Pași Recomandați

1. **Testare completă** a formularului
2. **Configurare email** pentru notificări automate
3. **Integrare CRM** pentru gestionarea avansată a lead-urilor
4. **Analytics** pentru tracking-ul conversiilor
5. **A/B testing** pentru optimizarea formularului

## Probleme Cunoscute

- Migrația trebuie rulată manual (nu este automată)
- Nu există notificări email automate
- Nu există integrare cu sisteme externe de CRM

## Suport

Pentru probleme sau întrebări legate de această funcționalitate, verifică:
1. Log-urile din consolă
2. Statusul migrației în baza de date
3. Configurația Supabase
4. Tipurile TypeScript actualizate
