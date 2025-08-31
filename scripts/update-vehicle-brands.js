// Script pentru actualizarea vehiculelor existente din baza de date
// pentru a se potrivi cu noile mărci și modele predefinite

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

// Funcție pentru a găsi cea mai apropiată marcă și model
function findClosestBrandAndModel(marca, model) {
  const marcaLower = marca.toLowerCase();
  const modelLower = model.toLowerCase();
  
  // Caută exact match
  for (const brand of carBrands) {
    if (brand.brand.toLowerCase() === marcaLower) {
      for (const modelName of brand.models) {
        if (modelName.toLowerCase() === modelLower) {
          return { brand: brand.brand, model: modelName };
        }
      }
    }
  }
  
  // Caută match parțial pentru marcă
  for (const brand of carBrands) {
    if (brand.brand.toLowerCase().includes(marcaLower) || 
        marcaLower.includes(brand.brand.toLowerCase())) {
      // Caută match parțial pentru model
      for (const modelName of brand.models) {
        if (modelName.toLowerCase().includes(modelLower) || 
            modelLower.includes(modelName.toLowerCase())) {
          return { brand: brand.brand, model: modelName };
        }
      }
    }
  }
  
  // Returnează prima marcă și model dacă nu găsește nimic
  return { brand: carBrands[0].brand, model: carBrands[0].models[0] };
}

async function updateVehicleBrands() {
  try {
    console.log('🚗 Începe actualizarea vehiculelor din baza de date...');
    
    // Obține toate vehiculele
    const { data: vehicles, error } = await supabase
      .from('stock')
      .select('id, marca, model');
    
    if (error) {
      throw error;
    }
    
    if (!vehicles || vehicles.length === 0) {
      console.log('ℹ️ Nu există vehicule în baza de date.');
      return;
    }
    
    console.log(`📊 Găsite ${vehicles.length} vehicule pentru actualizare.`);
    
    let updatedCount = 0;
    let errors = [];
    
    // Actualizează fiecare vehicul
    for (const vehicle of vehicles) {
      try {
        const { brand: newBrand, model: newModel } = findClosestBrandAndModel(
          vehicle.marca, 
          vehicle.model
        );
        
        // Actualizează doar dacă s-au schimbat
        if (newBrand !== vehicle.marca || newModel !== vehicle.model) {
          const { error: updateError } = await supabase
            .from('stock')
            .update({ 
              marca: newBrand, 
              model: newModel,
              updated_at: new Date().toISOString()
            })
            .eq('id', vehicle.id);
          
          if (updateError) {
            errors.push({ id: vehicle.id, error: updateError.message });
          } else {
            updatedCount++;
            console.log(`✅ Actualizat: ${vehicle.marca} ${vehicle.model} → ${newBrand} ${newModel}`);
          }
        } else {
          console.log(`ℹ️ Deja corect: ${vehicle.marca} ${vehicle.model}`);
        }
      } catch (vehicleError) {
        errors.push({ id: vehicle.id, error: vehicleError.message });
      }
    }
    
    console.log(`\n🎯 Rezumat actualizare:`);
    console.log(`✅ Vehicule actualizate: ${updatedCount}`);
    console.log(`❌ Erori: ${errors.length}`);
    
    if (errors.length > 0) {
      console.log('\n❌ Detalii erori:');
      errors.forEach(({ id, error }) => {
        console.log(`  - ID ${id}: ${error}`);
      });
    }
    
    console.log('\n✨ Actualizarea s-a terminat cu succes!');
    
  } catch (error) {
    console.error('❌ Eroare la actualizarea vehiculelor:', error);
    process.exit(1);
  }
}

// Rulează scriptul
updateVehicleBrands();
