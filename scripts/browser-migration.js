/**
 * Script pentru a rula migrația OpenLane din browser
 * Deschide Developer Tools și rulează acest script în consolă
 */

async function runOpenLaneMigration() {
  console.log('🚀 Pornesc migrația OpenLane...');
  
  try {
    // Importă supabase client din aplicația existentă
    const { supabase } = await import('/src/integrations/supabase/client.ts');
    
    console.log('🔍 Supabase client importat cu succes');
    
    // Încearcă să adaugi coloana openlane_url
    const { error } = await supabase
      .from('stock')
      .update({ openlane_url: null })
      .eq('id', 'non-existent-id');
    
    if (error && error.message.includes('column "openlane_url" of relation "stock" does not exist')) {
      console.log('⚠️ Coloana openlane_url nu există, trebuie să o adaugi manual');
      console.log('📋 Rulează următorul SQL în Supabase Dashboard:');
      console.log('   ALTER TABLE public.stock ADD COLUMN IF NOT EXISTS openlane_url TEXT;');
      return false;
    }
    
    console.log('✅ Coloana openlane_url există deja în tabelul stock');
    
    // Testează că putem să facem update cu openlane_url
    const { data: testData, error: testError } = await supabase
      .from('stock')
      .select('id, openlane_url')
      .limit(1)
      .single();
    
    if (testError) {
      console.error('❌ Eroare la testarea coloanei:', testError);
      return false;
    }
    
    console.log('✅ Migrația OpenLane a fost finalizată cu succes!');
    console.log('📋 Coloana openlane_url este disponibilă pentru utilizare');
    return true;
    
  } catch (error) {
    console.error('❌ Eroare neașteptată:', error);
    console.log('💡 Adaugă manual coloana prin Supabase Dashboard:');
    console.log('   ALTER TABLE public.stock ADD COLUMN IF NOT EXISTS openlane_url TEXT;');
    return false;
  }
}

// Exportă funcția pentru utilizare în browser
window.runOpenLaneMigration = runOpenLaneMigration;

console.log('🎯 Script de migrație încărcat. Rulează: runOpenLaneMigration()');
