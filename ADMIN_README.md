# Modul de Administrare - AutoOrder

## Descriere

Modulul de administrare pentru marketplace-ul auto premium AutoOrder oferă o interfață completă pentru gestionarea platformei. Este accesibil la ruta `/admin` și permite administratorilor să gestioneze stocul de vehicule, lead-urile și setările platformei.

## Funcționalități

### 🚗 Gestionarea Stocului (Stock Management)

- **Vizualizare vehicule**: Lista completă a tuturor vehiculelor din stoc cu filtrare și căutare
- **Adăugare vehicule noi**: Formular complet pentru adăugarea de vehicule noi cu toate detaliile
- **Editare vehicule**: Modificarea informațiilor despre vehiculele existente
- **Ștergere vehicule**: Eliminarea vehiculelor din stoc cu confirmare
- **Filtrare**: După stare (nou, second-hand, demo), marcă, model
- **Căutare**: După marcă, model sau alte detalii

### 📊 Gestionarea Lead-urilor (Lead Management)

- **Lead-uri Vânzare**: Cereri de vânzare de vehicule de la utilizatori
- **Lead-uri Finanțare**: Cereri de finanțare pentru vehicule
- **Mesaje Contact**: Mesaje primite prin formularul de contact
- **Status tracking**: Marcarea lead-urilor ca procesate
- **Vizualizare detaliată**: Informații complete despre fiecare lead
- **Filtrare**: După status (în așteptare, procesate)

### ⚙️ Gestionarea Setărilor (Settings Management)

- **Opțiuni Formulare**: Gestionarea opțiunilor din dropdown-urile formularelor
  - Mărci de vehicule
  - Tipuri de combustibil
  - Transmisii
  - Tipuri de caroserie
  - Stări vehicule
- **Texte Formulare**: Gestionarea textelor implicite din formulare
  - Placeholder-uri
  - Mesaje de validare
  - Mesaje de succes/eroare
- **Setări Site**: Configurarea setărilor generale ale platformei
  - Informații de contact
  - Social media
  - SEO

## Structura Bazei de Date

### Tabele Principale

#### `vehicles`
- Stochează toate vehiculele din stoc
- Câmpuri: brand, model, year, price, mileage, fuel_type, transmission, body_type, etc.
- Suportă imagini multiple, badge-uri și opțiuni de finanțare

#### `form_options`
- Opțiunile pentru dropdown-urile din formulare
- Organizate pe categorii (brands, fuelTypes, transmissions, etc.)
- Suportă ordinea de afișare

#### `form_texts`
- Textele implicite din formulare și validări
- Organizate pe categorii (forms, validation, messages)
- Chei unice pentru fiecare text

#### `site_settings`
- Setările generale ale site-ului
- Organizate pe categorii (site, contact, social, seo)
- Configurare flexibilă a platformei

### Tabele Lead-uri (existente, extinse)

#### `lead_sell`, `lead_finance`, `contact_messages`
- Coloana `processed` adăugată pentru tracking-ul statusului
- Indexuri pentru performanță optimă

## Instalare și Configurare

### 1. Rularea Migrației

```bash
# Rulați migrația SQL în Supabase
psql -h your-supabase-host -U postgres -d postgres -f supabase/migrations/20250101000000_admin_tables.sql
```

### 2. Configurarea Rutei

Ruta `/admin` este deja configurată în `src/App.tsx`:

```tsx
<Route path="/admin" element={<Admin />} />
```

### 3. Dependențe

Modulul folosește următoarele dependențe (deja instalate):
- `@tanstack/react-query` - pentru management-ul stării și cache
- `@supabase/supabase-js` - pentru comunicarea cu baza de date
- `lucide-react` - pentru iconițe
- Componentele UI din `shadcn/ui`

## Utilizare

### Accesarea Modulului

1. Navigați la `/admin` în aplicație
2. Interfața se încarcă cu un dashboard cu statistici
3. Folosiți tab-urile pentru a naviga între secțiuni

### Gestionarea Stocului

1. **Adăugare vehicul nou**:
   - Click pe "Adaugă Vehicul"
   - Completați formularul cu toate detaliile
   - Salvați vehiculul

2. **Editare vehicul**:
   - Click pe iconița de editare din tabel
   - Modificați informațiile dorite
   - Salvați modificările

3. **Ștergere vehicul**:
   - Click pe iconița de ștergere
   - Confirmați acțiunea

### Gestionarea Lead-urilor

1. **Vizualizare lead-uri**:
   - Navigați între tab-urile pentru fiecare tip de lead
   - Folosiți filtrele pentru a găsi lead-urile dorite

2. **Marcare ca procesat**:
   - Click pe iconița de verificare pentru lead-urile în așteptare
   - Lead-ul va fi marcat ca procesat

3. **Vizualizare detaliată**:
   - Click pe iconița de vizualizare pentru detalii complete

### Gestionarea Setărilor

1. **Opțiuni Formulare**:
   - Adăugați/editați opțiunile pentru dropdown-uri
   - Organizați pe categorii

2. **Texte Formulare**:
   - Gestionați textele implicite și mesajele
   - Personalizați validările

3. **Setări Site**:
   - Configurați informațiile de contact
   - Actualizați link-urile de social media
   - Modificați setările SEO

## Securitate

### Row Level Security (RLS)

- Toate tabelele au RLS activat
- Politici configurate pentru acces public la opțiuni și texte
- Acces complet pentru administratori (necesită implementarea autentificării)

### Autentificare

**IMPORTANT**: Modulul nu are implementată autentificarea. Pentru producție, implementați:

1. Autentificare cu Supabase Auth
2. Politici RLS bazate pe roluri de utilizator
3. Middleware pentru protejarea rutei `/admin`

### Exemplu de implementare autentificare:

```tsx
// În Admin.tsx
const { user, loading } = useAuth();

if (loading) return <div>Se încarcă...</div>;
if (!user || user.role !== 'admin') return <Navigate to="/login" />;
```

## Personalizare

### Adăugarea de Categorii Noi

Pentru a adăuga categorii noi de opțiuni:

1. Adăugați în baza de date:
```sql
INSERT INTO form_options (value, label, category, "order") VALUES
('new_option', 'New Option', 'newCategory', 1);
```

2. Actualizați `getCategoryLabel` în `SettingsManagement.tsx`:
```tsx
const labels: Record<string, string> = {
  // ... existing labels
  newCategory: "New Category Label"
};
```

### Stilizare

Modulul folosește Tailwind CSS și componentele din `shadcn/ui`. Pentru personalizare:

1. Modificați clasele Tailwind în componente
2. Actualizați tema în `tailwind.config.ts`
3. Personalizați componentele UI în `src/components/ui/`

## Performanță

### Optimizări Implementate

- **Indexuri baza de date**: Pentru câmpurile frecvent căutate
- **React Query**: Pentru cache-ing și sincronizare automată
- **Lazy loading**: Componentele se încarcă doar când sunt necesare
- **Paginare**: Pentru tabele mari (poate fi implementată)

### Monitorizare

- Log-uri pentru toate operațiunile CRUD
- Gestionarea erorilor cu mesaje user-friendly
- Toast notifications pentru feedback

## Troubleshooting

### Probleme Comune

1. **Eroare de conexiune la Supabase**:
   - Verificați configurația în `src/integrations/supabase/client.ts`
   - Asigurați-vă că URL-ul și cheia API sunt corecte

2. **Tabelele nu se creează**:
   - Rulați migrația SQL din nou
   - Verificați permisiunile în Supabase

3. **Componentele UI nu se încarcă**:
   - Verificați că `shadcn/ui` este instalat corect
   - Rulați `npm install` pentru a reinstala dependențele

### Debug

- Activați console logging în browser
- Verificați Network tab pentru cererile API
- Folosiți React DevTools pentru debugging-ul componentelor

## Contribuții

Pentru a contribui la modulul de administrare:

1. Creați un branch nou pentru feature-ul dorit
2. Implementați modificările cu testare adecvată
3. Actualizați documentația
4. Creați un Pull Request

## Licență

Modulul de administrare este parte din proiectul AutoOrder și urmează aceeași licență.

## Suport

Pentru suport tehnic sau întrebări:
- Creați un issue în repository
- Contactați echipa de dezvoltare
- Consultați documentația Supabase pentru întrebări specifice bazei de date
