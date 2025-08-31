// Script pentru verificarea vehiculelor existente din baza de date
// și a mărcilor/modelelor lor

const { createClient } = require('@supabase/supabase-js');
const { carBrands } = require('../src/data/carBrands.ts');

// Configurare Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variabilele de mediu Supabase lipsesc!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkVehicleBrands() {
  try {
    console.log('🔍 Verificare vehicule din baza de date...\n');
    
    // Obține toate vehiculele
    const { data: vehicles, error } = await supabase
      .from('stock')
      .select('id, marca, model, created_at')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    if (!vehicles || vehicles.length === 0) {
      console.log('ℹ️ Nu există vehicule în baza de date.');
      return;
    }
    
    console.log(`📊 Găsite ${vehicles.length} vehicule în baza de date.\n`);
    
    // Grupează vehiculele după marcă
    const vehiclesByBrand = {};
    vehicles.forEach(vehicle => {
      if (!vehiclesByBrand[vehicle.marca]) {
        vehiclesByBrand[vehicle.marca] = [];
      }
      vehiclesByBrand[vehicle.marca].push(vehicle);
    });
    
    // Afișează statistici
    console.log('📈 Statistici vehicule:');
    Object.entries(vehiclesByBrand).forEach(([brand, brandVehicles]) => {
      console.log(`  ${brand}: ${brandVehicles.length} vehicule`);
    });
    
    console.log('\n🔍 Verificare compatibilitate cu mărcile predefinite:');
    
    let compatibleCount = 0;
    let incompatibleCount = 0;
    const incompatibleVehicles = [];
    
    vehicles.forEach(vehicle => {
      const brandExists = carBrands.find(b => b.brand === vehicle.marca);
      const modelExists = brandExists?.models.find(m => m === vehicle.model);
      
      if (brandExists && modelExists) {
        compatibleCount++;
      } else {
        incompatibleCount++;
        incompatibleVehicles.push({
          id: vehicle.id,
          marca: vehicle.marca,
          model: vehicle.model,
          brandExists: !!brandExists,
          modelExists: !!modelExists
        });
      }
    });
    
    console.log(`✅ Compatibile: ${compatibleCount}`);
    console.log(`❌ Incompatibile: ${incompatibleCount}`);
    
    if (incompatibleVehicles.length > 0) {
      console.log('\n❌ Vehicule incompatibile:');
      incompatibleVehicles.forEach(vehicle => {
        console.log(`  - ID ${vehicle.id}: ${vehicle.marca} ${vehicle.model}`);
        if (!vehicle.brandExists) {
          console.log(`    ⚠️ Marca "${vehicle.marca}" nu există în lista predefinită`);
        }
        if (!vehicle.modelExists) {
          console.log(`    ⚠️ Modelul "${vehicle.model}" nu există pentru marca "${vehicle.marca}"`);
        }
      });
    }
    
    console.log('\n📋 Mărci disponibile în lista predefinită:');
    carBrands.forEach((brand, index) => {
      console.log(`  ${index + 1}. ${brand.brand} (${brand.models.length} modele)`);
    });
    
    console.log('\n✨ Verificarea s-a terminat cu succes!');
    
  } catch (error) {
    console.error('❌ Eroare la verificarea vehiculelor:', error);
    process.exit(1);
  }
}

// Rulează scriptul
checkVehicleBrands();
