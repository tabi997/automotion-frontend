# Funcționalitatea de Curățare Lead-uri Vechi

## Prezentare Generală

Această funcționalitate permite administratorilor să șteargă lead-urile vechi din baza de date pentru a menține performanța și să elibereze spațiu.

## Caracteristici

### 1. Statistici de Cleanup
- Afișează numărul total de lead-uri pentru fiecare tip
- Indică câte lead-uri sunt mai vechi de 90 de zile
- Actualizare în timp real a statisticilor

### 2. Opțiuni de Ștergere
- **Vârsta minimă**: 30, 60, 90, 180 sau 365 de zile
- **Tip de ștergere**: 
  - Toate lead-urile vechi (implicit)
  - Doar lead-urile procesate (opțional)

### 3. Tipuri de Lead-uri Suportate
- **Lead-uri Vânzare** (`lead_sell`)
- **Lead-uri Finanțare** (`lead_finance`) 
- **Mesaje Contact** (`contact_messages`)

## Implementare Tehnică

### Funcții în `src/lib/actions.ts`

#### `deleteOldLeads(options)`
Șterge lead-urile vechi dintr-un tabel specific:
```typescript
interface Options {
  table: string;           // Numele tabelului
  daysOld: number;         // Vârsta minimă în zile
  onlyProcessed?: boolean; // Doar lead-urile procesate
}
```

#### `deleteOldLeadsFromAllTables(options)`
Șterge lead-urile vechi din toate tabelele de lead-uri:
```typescript
interface Options {
  daysOld: number;         // Vârsta minimă în zile
  onlyProcessed?: boolean; // Doar lead-urile procesate
}
```

#### `getLeadCleanupStats()`
Returnează statistici detaliate pentru cleanup:
```typescript
interface CleanupStats {
  sellLeads: {
    total: number;
    old30Days: number;
    old90Days: number;
    old30DaysProcessed: number;
    old90DaysProcessed: number;
  };
  financeLeads: { /* similar */ };
  contactMessages: { /* similar */ };
}
```

### Componenta în `src/components/admin/LeadManagement.tsx`

#### Secțiunea de Cleanup
- **Card de statistici**: Afișează numărul total și lead-urile vechi
- **Buton de actualizare**: Reîmprospătează statisticile
- **Dialog de confirmare**: Setări și confirmare pentru ștergere

#### Stare Locală
```typescript
const [cleanupOptions, setCleanupOptions] = useState({
  daysOld: 90,           // Implicit 90 de zile
  onlyProcessed: true     // Implicit doar procesate
});
```

#### Query pentru Statistici
```typescript
const { data: cleanupStats, refetch: refetchCleanupStats } = useQuery({
  queryKey: ["admin-cleanup-stats"],
  queryFn: async () => {
    const result = await getLeadCleanupStats();
    if (!result.success) throw new Error(result.error);
    return result.data;
  }
});
```

## Utilizare

### 1. Accesare
- Navighează la **Admin > Leads** în aplicație
- Secțiunea de cleanup este afișată sub filtrele de căutare

### 2. Configurare
- Selectează vârsta minimă a lead-urilor de șters
- Bifează opțiunea "Șterge doar lead-urile procesate" dacă dorești
- Verifică statisticile afișate

### 3. Executare
- Apasă butonul **"Șterge Lead-uri Vechi"**
- Confirmă acțiunea în dialogul de confirmare
- Monitorizează rezultatul prin toast-urile afișate

## Securitate

### RLS (Row Level Security)
- Funcțiile de cleanup respectă politicile RLS configurate
- Doar utilizatorii autentificați cu drepturi de admin pot accesa funcționalitatea

### Validare
- Vârsta minimă este validată (30-365 zile)
- Opțiunea `onlyProcessed` este opțională
- Toate operațiunile sunt încapsulate în try-catch

## Monitorizare

### Toast-uri de Feedback
- **Succes**: Numărul de lead-uri șterse
- **Eroare**: Detalii despre eroarea întâlnită

### Actualizare Automată
- Statisticile sunt reîmprospătate după ștergere
- Listele de lead-uri sunt actualizate
- Cache-ul React Query este invalidat

## Considerații de Performanță

### Indexuri
- Tabelele au indexuri pe `created_at` pentru performanță optimă
- Operațiile de ștergere folosesc `lt('created_at', cutoffDate)`

### Batch Operations
- Ștergerea se face în loturi pentru eficiență
- Supabase optimizează automat operațiile DELETE

## Troubleshooting

### Probleme Comune

#### 1. Eroare de Permisiuni
```
Error: new row violates row-level security policy
```
**Soluție**: Verifică dacă utilizatorul are drepturi de admin

#### 2. Statistici Neactualizate
**Soluție**: Apasă butonul "Actualizează Statistici"

#### 3. Ștergere Eșuată
**Soluție**: Verifică log-urile și asigură-te că lead-urile există

### Debug
- Folosește Developer Tools pentru a monitoriza request-urile
- Verifică Console pentru erori JavaScript
- Monitorizează Network tab pentru request-uri Supabase

## Dezvoltare Viitoare

### Funcționalități Planificate
- [ ] Programare automată a cleanup-ului
- [ ] Backup înainte de ștergere
- [ ] Rapoarte de audit pentru ștergeri
- [ ] Notificări email pentru cleanup-uri mari
- [ ] Dashboard cu istoricul cleanup-urilor

### Îmbunătățiri Tehnice
- [ ] Paginare pentru lead-urile vechi
- [ ] Filtrare avansată înainte de ștergere
- [ ] Export de lead-uri înainte de ștergere
- [ ] Rollback pentru ștergeri accidentale
