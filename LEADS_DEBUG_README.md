# 🔍 Debug Pagina Lead-uri Admin

## Problema Identificată

Pagina de lead-uri din admin (`/admin/leads`) apare albă, deși:
- ✅ Lead-urile apar în dashboard
- ✅ Funcția `getOrderLeads()` funcționează
- ✅ Baza de date conține date

## Ce Am Corectat

### 1. **Import Componenta Car**
- Am adăugat `Car` în importurile din `lucide-react`
- Aceasta era lipsă pentru tab-ul "Comandă"

### 2. **Tipuri TypeScript**
- Am actualizat `handleStatusChange` să accepte `"lead_order"`
- Am corectat tipurile pentru a include lead-urile de comandă

### 3. **Debug Info Adăugat**
- Am adăugat informații de debug în tab-ul "Comandă"
- Acestea vor afișa starea query-urilor

## Cum Să Testezi

### 1. **Verifică Console-ul Browser-ului**
1. Deschide `/admin/leads`
2. Deschide Developer Tools (F12)
3. Mergi la tab-ul "Console"
4. Caută mesajele de debug

### 2. **Verifică Tab-ul "Comandă"**
1. Click pe tab-ul "Comandă"
2. Ar trebui să vezi informațiile de debug
3. Verifică dacă se afișează lead-urile

### 3. **Verifică Network Tab**
1. În Developer Tools, mergi la "Network"
2. Caută request-urile către Supabase
3. Verifică dacă `getOrderLeads` returnează date

## Posibile Cauze

### 1. **Probleme cu React Query**
- Cache-ul poate fi corupt
- Query-urile pot fi în stări inconsistente

### 2. **Probleme cu Tipurile**
- TypeScript poate avea conflicte
- Tipurile din Supabase pot fi neactualizate

### 3. **Probleme cu Componenta**
- Render-ul poate eșua din cauza unor erori
- Starea poate fi inconsistentă

## Soluții de Debug

### 1. **Clear React Query Cache**
```javascript
// În console-ul browser-ului
queryClient.clear();
```

### 2. **Forțează Re-render**
```javascript
// În console-ul browser-ului
window.location.reload();
```

### 3. **Verifică Starea Query-urilor**
```javascript
// În console-ul browser-ului
console.log('Query State:', {
  sellLeads: queryClient.getQueryData(['sell-leads']),
  orderLeads: queryClient.getQueryData(['order-leads'])
});
```

## Verificări Suplimentare

### 1. **Verifică Tipurile Supabase**
```bash
# Rulează scriptul de test
export $(cat .env | xargs) && node scripts/test-order-leads.js
```

### 2. **Verifică Build-ul**
```bash
npm run build
```

### 3. **Verifică Linter-ul**
```bash
npm run lint
```

## Debug Info Adăugat

În tab-ul "Comandă" vei vedea:
- **Loading**: Starea de încărcare
- **Error**: Orice eroare apărută
- **Data count**: Numărul de lead-uri
- **Data**: Primul lead pentru debugging

## Următorii Pași

1. **Testează pagina** cu informațiile de debug
2. **Verifică console-ul** pentru erori
3. **Verifică Network tab** pentru request-uri
4. **Raportează ce vezi** în debug info

## Dacă Problema Persistă

1. **Verifică log-urile** din Supabase Dashboard
2. **Testează query-urile** direct în SQL Editor
3. **Verifică permisiunile** pentru tabelul `lead_order`
4. **Contactează suportul** cu informațiile de debug

## Suport

Pentru ajutor suplimentar:
1. **Screenshot** cu debug info
2. **Console logs** din browser
3. **Network requests** către Supabase
4. **Erori** din Developer Tools
