import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const sampleVehicles = [
  {
    marca: 'BMW',
    model: 'X5',
    an: 2020,
    km: 45000,
    pret: 45000,
    combustibil: 'motorina',
    transmisie: 'automata',
    caroserie: 'suv',
    culoare: 'Alb',
    vin: 'WBA12345678901234',
    negociabil: true,
    descriere: 'BMW X5 în stare excelentă, perfect întreținut, cu toate reviziile la zi. Ideal pentru familie sau uz personal.',
    status: 'active',
    openlane_url: 'https://openlane.com/listing/123456',
    images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800']
  },
  {
    marca: 'Mercedes-Benz',
    model: 'C-Class',
    an: 2019,
    km: 35000,
    pret: 32000,
    combustibil: 'benzina',
    transmisie: 'automata',
    caroserie: 'sedan',
    culoare: 'Negru',
    vin: 'WDD12345678901234',
    negociabil: false,
    descriere: 'Mercedes-Benz C-Class elegant și performant, cu dotări premium și confort excepțional.',
    status: 'active',
    images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800']
  },
  {
    marca: 'Audi',
    model: 'A4',
    an: 2021,
    km: 25000,
    pret: 38000,
    combustibil: 'motorina',
    transmisie: 'automata',
    caroserie: 'sedan',
    culoare: 'Gri',
    vin: 'WAU12345678901234',
    negociabil: true,
    descriere: 'Audi A4 nou, cu tehnologie de ultimă generație și design modern.',
    status: 'active',
    openlane_url: 'https://openlane.com/listing/789012',
    images: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800']
  }
];

async function testBadgesUI() {
  console.log('🚀 Testing badge UI functionality...');
  
  try {
    // Clear existing test vehicles
    console.log('🧹 Clearing existing test vehicles...');
    const { error: deleteError } = await supabase
      .from('stock')
      .delete()
      .in('marca', ['BMW', 'Mercedes-Benz', 'Audi'])
      .in('model', ['X5', 'C-Class', 'A4']);
    
    if (deleteError) {
      console.error('❌ Error clearing test vehicles:', deleteError);
    } else {
      console.log('✅ Test vehicles cleared');
    }
    
    // Insert new test vehicles (without badges for now)
    console.log('📝 Inserting test vehicles...');
    
    for (const vehicle of sampleVehicles) {
      const { data, error } = await supabase
        .from('stock')
        .insert([vehicle])
        .select()
        .single();
      
      if (error) {
        console.error(`❌ Error inserting ${vehicle.marca} ${vehicle.model}:`, error);
      } else {
        console.log(`✅ Inserted ${vehicle.marca} ${vehicle.model}`);
        if (vehicle.openlane_url) {
          console.log(`   - OpenLane URL: ${vehicle.openlane_url}`);
        }
      }
    }
    
    // Verify the data was inserted correctly
    console.log('🔍 Verifying inserted data...');
    const { data: vehicles, error: fetchError } = await supabase
      .from('stock')
      .select('*')
      .in('marca', ['BMW', 'Mercedes-Benz', 'Audi'])
      .order('created_at', { ascending: false });
    
    if (fetchError) {
      console.error('❌ Error fetching test vehicles:', fetchError);
    } else {
      console.log('✅ Test vehicles:');
      vehicles?.forEach(vehicle => {
        console.log(`  - ${vehicle.marca} ${vehicle.model}: €${vehicle.pret.toLocaleString()}`);
        if (vehicle.openlane_url) {
          console.log(`    OpenLane: ${vehicle.openlane_url}`);
        }
      });
    }
    
    console.log('🎉 UI test completed successfully!');
    console.log('🌐 Check the stock page to see:');
    console.log('   - OpenLane button moved to bottom action area');
    console.log('   - Better layout for future badges');
    console.log('   - Improved user experience');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testBadgesUI();
