# 🔧 Rezolvarea Problemei RLS pentru Formularul de Comandă

## Problema Identificată

Formularul de comandă mașină primește eroarea:
```
"new row violates row-level security policy for table 'lead_order'"
```

## Cauza

Tabelul `lead_order` există în baza de date, dar politicile de securitate (RLS - Row Level Security) nu permit inserarea de date de la utilizatorii publici.

## Soluția

### Opțiunea 1: Corectare Automată (Recomandată)

1. **Deschide Supabase Dashboard**:
   - Mergi la: https://supabase.com/dashboard
   - Selectează proiectul: `naedfhnzuwywnltjsqgp`

2. **Accesează SQL Editor**:
   - În meniul din stânga, click pe "SQL Editor"
   - Click pe "New Query"

3. **Rulează Migrația**:
   - Copiază conținutul din `supabase/migrations/20250101000004_fix_lead_order_rls_final.sql`
   - Lipește-l în editor
   - Click pe "Run" (▶️)

4. **Verifică Rezultatul**:
   - Ar trebui să vezi mesajul "Success. No rows returned"

### Opțiunea 2: Corectare Manuală în Dashboard

1. **Accesează Authentication > Policies**:
   - În meniul din stânga, click pe "Authentication"
   - Click pe "Policies"

2. **Găsește Tabelul lead_order**:
   - Caută în listă tabelul `lead_order`
   - Click pe el pentru a vedea politicile existente

3. **Creează Politica de Inserare**:
   - Click pe "New Policy"
   - Alege "Create a policy from scratch"
   - Completează:
     - **Policy Name**: `Allow public insert`
     - **Target roles**: `public`
     - **Policy definition**: `INSERT`
     - **Using expression**: `true`
     - **With check expression**: `true`
   - Click "Review" și apoi "Save policy"

4. **Creează Politica de Selectare** (opțional):
   - Click pe "New Policy" din nou
   - Alege "Create a policy from scratch"
   - Completează:
     - **Policy Name**: `Allow public select`
     - **Target roles**: `public`
     - **Policy definition**: `SELECT`
     - **Using expression**: `true`
   - Click "Review" și apoi "Save policy"

### Opțiunea 3: Dezactivare Temporară RLS

**⚠️ ATENȚIE**: Această opțiune elimină securitatea pentru tabelul `lead_order`. Folosește-o doar temporar pentru testare.

1. **În SQL Editor, rulează**:
   ```sql
   ALTER TABLE public.lead_order DISABLE ROW LEVEL SECURITY;
   ```

2. **Pentru a reactiva securitatea după testare**:
   ```sql
   ALTER TABLE public.lead_order ENABLE ROW LEVEL SECURITY;
   ```

## Verificarea Soluției

După ce ai aplicat una din soluțiile de mai sus:

1. **Testează Formularul**:
   - Mergi la `/comanda`
   - Completează și trimite formularul
   - Ar trebui să funcționeze fără erori

2. **Verifică în Admin**:
   - Mergi la `/admin/leads`
   - Tab-ul "Comandă" ar trebui să afișeze lead-ul nou creat

## Structura Politicilor RLS Recomandate

```sql
-- Politica pentru inserare publică
CREATE POLICY "Allow public insert on lead_order" 
ON public.lead_order 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Politica pentru selectare publică
CREATE POLICY "Allow public select on lead_order" 
ON public.lead_order 
FOR SELECT 
TO public 
USING (true);

-- Politica pentru actualizare de către utilizatori autentificați
CREATE POLICY "Allow authenticated update on lead_order" 
ON public.lead_order 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Politica pentru ștergere de către utilizatori autentificați
CREATE POLICY "Allow authenticated delete on lead_order" 
ON public.lead_order 
FOR DELETE 
TO authenticated 
USING (true);
```

## Troubleshooting

### Dacă Politicile Nu Se Creează

1. **Verifică Permisiunile**:
   - Asigură-te că ai rolul de `service_role` sau `postgres`
   - Verifică că ești logat cu contul corect

2. **Verifică Sintaxa SQL**:
   - Asigură-te că nu există erori de sintaxă
   - Rulează fiecare comandă separat

3. **Verifică Log-urile**:
   - În Supabase Dashboard, mergi la "Logs"
   - Caută erori legate de `lead_order`

### Dacă Formularul Încă Nu Funcționează

1. **Verifică Politicile Active**:
   - În Authentication > Policies, verifică că politicile sunt active
   - Verifică că nu există conflicte între politici

2. **Testează Direct în SQL Editor**:
   ```sql
   INSERT INTO public.lead_order (marca, nume, telefon, email, gdpr, status)
   VALUES ('BMW', 'Test', '+40123456789', 'test@example.com', true, 'new');
   ```

3. **Verifică RLS Status**:
   ```sql
   SELECT schemaname, tablename, rowsecurity 
   FROM pg_tables 
   WHERE tablename = 'lead_order';
   ```

## Suport

Dacă întâmpini probleme:

1. **Verifică Log-urile** din Supabase Dashboard
2. **Testează Politicile** cu comenzi SQL simple
3. **Verifică Permisiunile** utilizatorului Supabase
4. **Contactează Suportul** Supabase dacă problema persistă

## Următorii Pași

După ce ai rezolvat problema RLS:

1. **Testează Complet** formularul de comandă
2. **Verifică Lead-urile** în panoul de administrare
3. **Configurează Notificări** pentru lead-uri noi
4. **Implementează Validări** suplimentare dacă este necesar
