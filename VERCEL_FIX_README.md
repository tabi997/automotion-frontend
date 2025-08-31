# 🚀 Fix Vercel Deployment Issues

## Problema Identificată
- ✅ Anunțurile se importă în Vercel
- ❌ Eroare 404 la refresh pe `/stoc` și `/admin`
- ❌ RLS policies restrictive pentru tabelul `stock`

## 🔧 Fix-uri Implementate

### 1. Fișierul `vercel.json` (Creat ✅)
Acest fișier rezolvă erorile 404 la refresh pentru rutele SPA:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. Migrația RLS pentru Stock (Creat ✅)
Fișierul `supabase/migrations/20250101000005_fix_stock_public_view.sql` permite utilizatorilor publici să vadă stocul.

### 3. Script de Rulare (Creat ✅)
Scriptul `scripts/run-stock-rls-fix.js` pentru a aplica fix-ul RLS automat.

## 📋 Pași de Implementare

### Pasul 1: Commit și Push
```bash
git add .
git commit -m "Fix Vercel deployment: add vercel.json and RLS policies"
git push
```

### Pasul 2: Fă Deploy pe Vercel
- Vercel va detecta automat `vercel.json`
- Fă redeploy la proiect

### Pasul 3: Aplică Fix-ul RLS în Supabase

#### Opțiunea A: Script automat
```bash
cd scripts
node run-stock-rls-fix.js
```

#### Opțiunea B: Manual în Supabase Dashboard
1. Mergi la [supabase.com](https://supabase.com)
2. Selectează proiectul tău
3. Mergi la **SQL Editor**
4. Rulează următorul SQL:

```sql
-- Fix stock table RLS policy to allow public viewing
DROP POLICY IF EXISTS "Allow authenticated users to view stock" ON public.stock;

CREATE POLICY "Allow public to view stock" ON public.stock
    FOR SELECT USING (true);
```

## 🎯 Rezultatul Așteptat

După implementarea fix-urilor:
- ✅ **Refresh pe `/stoc`** - funcționează fără 404
- ✅ **Refresh pe `/admin`** - funcționează fără 404
- ✅ **Vizualizare stoc** - utilizatorii publici pot vedea mașinile
- ✅ **Admin funcțional** - poți modifica conținutul în timp real pe Vercel

## 🔍 Testare

1. **Testează `/stoc`** - ar trebui să vezi cele 2 anunțuri
2. **Testează refresh** - nu ar trebui să primești 404
3. **Testează `/admin`** - ar trebui să funcționeze
4. **Testează modificări** - schimbările ar trebui să fie vizibile imediat

## 🚨 Dacă Tot Nu Funcționează

1. **Verifică variabilele de mediu** în Vercel
2. **Verifică dacă RLS policies** sunt aplicate corect
3. **Verifică console-ul browser** pentru erori
4. **Verifică logs-urile Vercel** pentru erori de build

## 📞 Suport

Dacă ai probleme, verifică:
- Console-ul browser (F12)
- Logs-urile Vercel
- Supabase Dashboard pentru RLS policies
