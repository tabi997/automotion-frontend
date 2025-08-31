export interface CarBrand {
  brand: string;
  models: string[];
}

export const carBrands: CarBrand[] = [
  // Mărci populare (top)
  { brand: 'BMW', models: ['116', '118', '120', '125', '218', '220', '318', '320', '330', '340', 'X1', 'X3', 'X5', 'X7', 'Z4', 'i3', 'i4', 'iX', 'M2', 'M3', 'M4', 'M5'] },
  { brand: 'Mercedes-Benz', models: ['A-Class', 'B-Class', 'C-Class', 'E-Class', 'S-Class', 'GLA', 'GLC', 'GLE', 'GLS', 'AMG GT', 'AMG C63', 'AMG E63', 'CLA', 'CLS', 'G-Class'] },
  { brand: 'Audi', models: ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'e-tron', 'RS3', 'RS4', 'RS6', 'TT', 'R8'] },
  { brand: 'Volkswagen', models: ['Polo', 'Golf', 'Passat', 'T-Roc', 'Tiguan', 'Touareg', 'ID.3', 'ID.4', 'ID.5', 'Arteon', 'T-Cross', 'Taigo'] },
  { brand: 'Toyota', models: ['Yaris', 'Corolla', 'Camry', 'C-HR', 'RAV4', 'Prius', 'Hilux', 'Land Cruiser', 'Highlander', 'bZ4X'] },
  
  // Mărci premium
  { brand: 'Porsche', models: ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan', 'Cayman', 'Boxster', 'Carrera'] },
  { brand: 'Tesla', models: ['Model 3', 'Model S', 'Model X', 'Model Y', 'Cybertruck'] },
  { brand: 'Range Rover', models: ['Evoque', 'Velar', 'Sport', 'Autobiography', 'Defender', 'Discovery'] },
  { brand: 'Lexus', models: ['ES', 'LS', 'NX', 'RX', 'UX', 'LC', 'RC', 'IS'] },
  { brand: 'Volvo', models: ['S60', 'S90', 'V60', 'V90', 'XC40', 'XC60', 'XC90', 'C40'] },
  
  // Mărci mainstream populare
  { brand: 'Ford', models: ['Fiesta', 'Focus', 'Mondeo', 'Kuga', 'Puma', 'Mustang', 'Explorer', 'Edge', 'Ranger'] },
  { brand: 'Renault', models: ['Clio', 'Megane', 'Captur', 'Kadjar', 'Zoe', 'Austral', 'Arkana', 'Talisman'] },
  { brand: 'Peugeot', models: ['208', '308', '508', '2008', '3008', '5008', '408', '508 SW'] },
  { brand: 'Opel', models: ['Corsa', 'Astra', 'Insignia', 'Mokka', 'Crossland', 'Grandland', 'Combo'] },
  { brand: 'Skoda', models: ['Fabia', 'Octavia', 'Superb', 'Kamiq', 'Karoq', 'Kodiaq', 'Scala', 'Enyaq'] },
  
  // Mărci asiatice
  { brand: 'Hyundai', models: ['i20', 'i30', 'Tucson', 'Santa Fe', 'Kona', 'Elantra', 'IONIQ', 'Staria', 'Bayon'] },
  { brand: 'Kia', models: ['Picanto', 'Rio', 'Ceed', 'Sportage', 'Sorento', 'EV6', 'Niro', 'Stonic', 'Soul'] },
  { brand: 'Honda', models: ['Civic', 'CR-V', 'Jazz', 'HR-V', 'Accord', 'e:Ny1', 'ZR-V'] },
  { brand: 'Nissan', models: ['Micra', 'Juke', 'Qashqai', 'X-Trail', 'Leaf', 'Ariya', 'Note', 'Pulsar'] },
  
  // Mărci europene
  { brand: 'Alfa Romeo', models: ['Giulia', 'Giulietta', 'Stelvio', 'MiTo', '4C', 'Tonale', 'Brennero'] },
  { brand: 'Citroën', models: ['C3', 'C3 Aircross', 'C4', 'C4 Cactus', 'C5 Aircross', 'Berlingo', 'C5 X'] },
  { brand: 'Seat', models: ['Ibiza', 'Leon', 'Arona', 'Ateca', 'Tarraco', 'Alhambra'] },
  
  // Mărci românești
  { brand: 'Dacia', models: ['Sandero', 'Logan', 'Duster', 'Spring', 'Jogger', 'Jogger Hybrid'] },
  { brand: 'Fiat', models: ['500', 'Panda', 'Tipo', '500X', 'Doblo', 'Pulse', 'Fastback'] },
  
  // Mărci americane
  { brand: 'Chevrolet', models: ['Spark', 'Cruze', 'Malibu', 'Equinox', 'Traverse', 'Camaro', 'Corvette'] },
  { brand: 'Jeep', models: ['Renegade', 'Compass', 'Cherokee', 'Grand Cherokee', 'Wrangler', 'Gladiator'] },
  
  // Mărci chineze
  { brand: 'MG', models: ['MG3', 'MG4', 'MG5', 'MG ZS', 'MG HS', 'Marvel R'] },
  { brand: 'BYD', models: ['Atto 3', 'Dolphin', 'Seal', 'Tang', 'Han'] },
  
  // Mărci japoneze
  { brand: 'Mazda', models: ['Mazda2', 'Mazda3', 'Mazda6', 'CX-3', 'CX-30', 'CX-5', 'CX-60', 'MX-30'] },
  { brand: 'Subaru', models: ['Impreza', 'XV', 'Forester', 'Outback', 'BRZ', 'Solterra'] },
  
  // Mărci italiene
  { brand: 'Ferrari', models: ['F8', 'SF90', '296', 'Roma', 'Portofino', 'Purosangue'] },
  { brand: 'Lamborghini', models: ['Huracan', 'Aventador', 'Urus', 'Revuelto'] },
  { brand: 'Maserati', models: ['Ghibli', 'Quattroporte', 'Levante', 'Grecale', 'MC20'] }
];
