"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/common/Badge';
import { Section } from '@/components/common/Section';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { 
  Filter, 
  Search, 
  SlidersHorizontal,
  Grid3X3,
  List,
  ChevronDown,
  Heart,
  Share2,
  Phone,
  Euro,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  MapPin,
  Eye,
  ArrowLeft
} from 'lucide-react';
import { MockAPI } from '@/lib/mockApi';
import { Vehicle, VehicleFilters, VehicleSort, PaginatedVehicles, StockVehicle, VehicleBadge } from '@/types/vehicle';
import { StockAPI } from '@/lib/stockApi';
import { carBrands } from '@/data/carBrands';

// Import images
import bmwImage from '@/assets/bmw-x5.jpg';
import mercedesImage from '@/assets/mercedes-amg.jpg';
import audiImage from '@/assets/audi-a4.jpg';

const transformStockToVehicle = (stockVehicle: StockVehicle): Vehicle => ({
  id: stockVehicle.id,
  brand: stockVehicle.marca,
  model: stockVehicle.model,
  year: stockVehicle.an,
  mileage: stockVehicle.km,
  price: stockVehicle.pret,
  fuelType: stockVehicle.combustibil as 'benzina' | 'motorina' | 'hibrid' | 'electric' | 'gpl',
  transmission: stockVehicle.transmisie as 'cvt' | 'manuala' | 'automata',
  bodyType: stockVehicle.caroserie as 'berlina' | 'break' | 'suv' | 'coupe' | 'cabriolet' | 'hatchback' | 'monovolum',
  color: stockVehicle.culoare || '',
  vin: stockVehicle.vin,
  negotiable: stockVehicle.negociabil,
  description: stockVehicle.descriere || '',
  status: stockVehicle.status as 'active' | 'inactive' | 'sold',
  dateAdded: stockVehicle.created_at,
  updatedAt: stockVehicle.updated_at,
  badges: stockVehicle.badges || [], // Include badges from stock vehicle
  images: stockVehicle.images || [],
  mainImage: stockVehicle.images?.[0] || '',
  horsePower: 0, // Placeholder - not in stock table
  engineCapacity: 0, // Placeholder - not in stock table
  location: 'Romania', // Placeholder - not in stock table
  condition: 'second-hand' as const, // Default value
  features: [], // No features in stock table
  financing: undefined, // No financing info in stock table
  openlane_url: stockVehicle.openlane_url || '', // Add openlane_url to transformed vehicle
});

// Helper function to translate badge text to Romanian
function translateBadgeText(badge: VehicleBadge) {
  const translations: Record<string, { text: string; icon: string; className: string; glow: string; description: string }> = {
    hot: {
      text: 'În trend',
      icon: '🔥',
      className: 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400',
      glow: '0 4px 12px rgba(239, 68, 68, 0.4), 0 2px 4px rgba(0,0,0,0.1)',
      description: 'Vehicul foarte căutat în această perioadă'
    },
    demand: {
      text: 'Căutat',
      icon: '⭐',
      className: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-400',
      glow: '0 4px 12px rgba(249, 115, 22, 0.4), 0 2px 4px rgba(0,0,0,0.1)',
      description: 'Vehicul cu cerere ridicată'
    },
    reserved: {
      text: 'Rezervat',
      icon: '🚫',
      className: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-400',
      glow: '0 4px 12px rgba(59, 130, 246, 0.4), 0 2px 4px rgba(0,0,0,0.1)',
      description: 'Vehicul rezervat temporar'
    },
    new: {
      text: 'Nou',
      icon: '🆕',
      className: 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-400',
      glow: '0 4px 12px rgba(34, 197, 94, 0.4), 0 2px 4px rgba(0,0,0,0.1)',
      description: 'Vehicul nou adăugat în stoc'
    },
    discount: {
      text: 'Ofertă',
      icon: '💰',
      className: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-400',
      glow: '0 4px 12px rgba(147, 51, 234, 0.4), 0 2px 4px rgba(0,0,0,0.1)',
      description: 'Preț redus - ofertă specială'
    }
  };
  
  return translations[badge.text.toLowerCase()] || {
    text: badge.text,
    icon: '🏷️',
    className: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-400',
    glow: '0 4px 12px rgba(107, 114, 128, 0.4), 0 2px 4px rgba(0,0,0,0.1)',
    description: badge.text
  };
}

const Stock = () => {
  const [vehicles, setVehicles] = useState<PaginatedVehicles | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<VehicleFilters>({});
  const [sort, setSort] = useState<VehicleSort>({ field: 'dateAdded', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrandForFilter, setSelectedBrandForFilter] = useState<string>("");

  useEffect(() => {
    loadVehicles();
  }, [filters, sort, currentPage]);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      // Transform filters to match StockAPI format
      const stockFilters = {
        brand: filters.brand,
        model: filters.model,
        bodyType: filters.bodyType,
        fuelType: filters.fuelType,
        priceMin: filters.priceMin,
        priceMax: filters.priceMax,
        yearMin: filters.yearMin,
        yearMax: filters.yearMax,
        mileageMin: filters.mileageMin,
        mileageMax: filters.mileageMax,
      };
      
      const vehicles = await StockAPI.getVehicles(stockFilters);
      // Transform StockVehicle to Vehicle for compatibility
      const transformedVehicles = vehicles.map(transformStockToVehicle);
      setVehicles({
        vehicles: transformedVehicles,
        total: transformedVehicles.length,
        page: 1,
        limit: transformedVehicles.length,
        totalPages: 1
      });
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof VehicleFilters, value: string | number | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSortChange = (field: VehicleSort['field']) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const getVehicleImage = (vehicle: Vehicle) => {
    // Verifică dacă vehiculul are imagini reale
    if (vehicle.images && vehicle.images.length > 0 && vehicle.images[0]) {
      console.log('🔍 Stock: Using real image for', vehicle.brand, vehicle.model, ':', vehicle.images[0]);
      return vehicle.images[0];
    }
    
    // Fallback la imagini mock doar dacă nu există imagini reale
    console.log('🔍 Stock: Using mock image for', vehicle.brand, vehicle.model);
    if (vehicle.brand === 'BMW') return bmwImage;
    if (vehicle.brand === 'Mercedes-Benz') return mercedesImage;
    if (vehicle.brand === 'Audi') return audiImage;
    return bmwImage; // fallback
  };

  const renderVehicleCard = (vehicle: Vehicle) => (
    <div key={vehicle.id} className="automotive-card overflow-hidden hover-lift group">
      <div className="relative">
        <Link to={`/vehicul/${vehicle.id}`} className="block">
          <img 
            src={getVehicleImage(vehicle)}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-48 object-cover group-hover:scale-105 transition-smooth cursor-pointer"
          />
        </Link>
        
                 {/* Badges - Improved positioning and styling */}
         <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[calc(100%-2rem)]">
           {vehicle.badges.slice(0, 2).map((badge) => { // Limit to 2 badges to avoid overcrowding
             const badgeConfig = translateBadgeText(badge);
             return (
               <div 
                 key={badge.id} 
                 className={`vehicle-badge ${badgeConfig.className}`}
                 style={{
                   boxShadow: badgeConfig.glow
                 }}
                 title={badgeConfig.description}
               >
                 <span className="text-xs">{badgeConfig.icon}</span>
                 <span className="font-semibold tracking-wide">{badgeConfig.text}</span>
               </div>
             );
           })}
           {/* Show count if more than 2 badges */}
           {vehicle.badges.length > 2 && (
             <div 
               className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-black/70 text-white text-xs font-bold backdrop-blur-sm"
               title={`${vehicle.badges.length - 2} badge-uri suplimentare`}
             >
               +{vehicle.badges.length - 2}
             </div>
           )}
         </div>
        
                 {/* Actions */}
         <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-smooth">
           <button className="p-1.5 bg-white/90 rounded-lg hover:bg-white shadow-medium">
             <Heart className="h-3.5 w-3.5" />
           </button>
           <button className="p-1.5 bg-white/90 rounded-lg hover:bg-white shadow-medium">
             <Share2 className="h-3.5 w-3.5" />
           </button>
         </div>
         
         {/* Price Badge - Improved positioning */}
         <div className="absolute bottom-3 right-3 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-bold shadow-medium">
           €{vehicle.price.toLocaleString()}
         </div>
       </div>
       
       <div className="vehicle-card-content">
         <div className="flex items-start justify-between mb-3">
           <div className="flex-1 min-w-0">
             <Link to={`/vehicul/${vehicle.id}`} className="block hover:text-primary transition-colors">
               <h3 className="vehicle-card-title">
                 {vehicle.brand} {vehicle.model}
               </h3>
             </Link>
             <p className="text-muted-foreground text-sm">
               {vehicle.year} • {vehicle.location}
             </p>
           </div>
         </div>
         
         {/* Vehicle Details - Improved grid layout */}
         <div className="vehicle-card-details">
           <div className="flex items-center space-x-2 text-muted-foreground">
             <Gauge className="h-3.5 w-3.5 flex-shrink-0" />
             <span className="truncate">{vehicle.mileage.toLocaleString()} km</span>
           </div>
           <div className="flex items-center space-x-2 text-muted-foreground">
             <Fuel className="h-3.5 w-3.5 flex-shrink-0" />
             <span className="capitalize truncate">{vehicle.fuelType}</span>
           </div>
           <div className="flex items-center space-x-2 text-muted-foreground">
             <Settings className="h-3.5 w-3.5 flex-shrink-0" />
             <span className="capitalize truncate">{vehicle.transmission}</span>
           </div>
           <div className="flex items-center space-x-2 text-muted-foreground">
             <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
             <span className="truncate">{vehicle.horsePower} CP</span>
           </div>
         </div>
         
         {/* Actions - Improved layout with better spacing */}
         <div className="vehicle-card-actions">
           <Button 
             variant="premium" 
             size="sm" 
             className="vehicle-card-action-btn flex-1"
             asChild
           >
             <Link to={`/vehicul/${vehicle.id}`}>
               <Eye className="h-3.5 w-3.5 mr-1.5" />
               Detalii
             </Link>
           </Button>
           
           <Button 
             variant="outline" 
             size="sm" 
             className="vehicle-card-action-btn compact"
             title="Contactează"
           >
             <Phone className="h-3.5 w-3.5" />
           </Button>
           
           {/* OpenLane Button - Improved styling */}
           {vehicle.openlane_url && (
             <Button 
               variant="outline" 
               size="sm"
               className="vehicle-card-action-btn compact bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
               asChild
               title="Vezi pe OpenLane"
             >
               <a 
                 href={vehicle.openlane_url} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="flex items-center justify-center"
                 onClick={(e) => e.stopPropagation()}
               >
                 <span className="text-xs font-semibold">OL</span>
               </a>
             </Button>
           )}
         </div>
         
         {/* Financing Info - Improved styling */}
         {vehicle.financing?.available && (
           <div className="mt-3 p-2.5 bg-accent/10 rounded-lg border border-accent/20">
             <p className="text-xs text-accent font-medium text-center">
               De la €{vehicle.financing.monthlyPayment}/lună
             </p>
           </div>
         )}
      </div>
    </div>
  );

  const filtersPanel = (
    <div className={`lg:w-80 bg-card border border-border rounded-xl p-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Filtre</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Resetează
        </Button>
      </div>
      
      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Caută</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Caută mărcă, model..."
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
      </div>
      
      {/* Brand */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Marcă</label>
        <select
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={filters.brand || ''}
          onChange={(e) => {
            handleFilterChange('brand', e.target.value);
            setSelectedBrandForFilter(e.target.value);
            handleFilterChange('model', ''); // Reset model filter when brand changes
          }}
        >
          <option value="">Toate mărcile</option>
          {carBrands.map(({ brand }) => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      {/* Model */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Model</label>
        <select
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={filters.model || ''}
          onChange={(e) => handleFilterChange('model', e.target.value)}
          disabled={!selectedBrandForFilter}
        >
          <option value="">Toate modelele</option>
          {selectedBrandForFilter && carBrands.find(b => b.brand === selectedBrandForFilter)?.models.map((model) => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>
      </div>
      
      {/* Body Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Caroserie</label>
        <select
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={filters.bodyType || ''}
          onChange={(e) => handleFilterChange('bodyType', e.target.value)}
        >
          <option value="">Toate tipurile</option>
          <option value="berlina">Berlină</option>
          <option value="break">Break</option>
          <option value="suv">SUV</option>
          <option value="coupe">Coupe</option>
          <option value="hatchback">Hatchback</option>
        </select>
      </div>
      
      {/* Fuel Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Combustibil</label>
        <select
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={filters.fuelType || ''}
          onChange={(e) => handleFilterChange('fuelType', e.target.value)}
        >
          <option value="">Toate tipurile</option>
          <option value="benzina">Benzină</option>
          <option value="motorina">Motorină</option>
          <option value="hibrid">Hibrid</option>
          <option value="electric">Electric</option>
          <option value="gpl">GPL</option>
        </select>
      </div>
      
      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Preț (€)</label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Min"
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={filters.priceMin || ''}
            onChange={(e) => handleFilterChange('priceMin', e.target.value ? parseInt(e.target.value) : undefined)}
          />
          <input
            type="number"
            placeholder="Max"
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={filters.priceMax || ''}
            onChange={(e) => handleFilterChange('priceMax', e.target.value ? parseInt(e.target.value) : undefined)}
          />
        </div>
      </div>
      
      {/* Year Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">An fabricație</label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Min"
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={filters.yearMin || ''}
            onChange={(e) => handleFilterChange('yearMin', e.target.value ? parseInt(e.target.value) : undefined)}
          />
          <input
            type="number"
            placeholder="Max"
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={filters.yearMax || ''}
            onChange={(e) => handleFilterChange('yearMax', e.target.value ? parseInt(e.target.value) : undefined)}
          />
        </div>
      </div>
      
      {/* Mileage Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Kilometraj</label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Min km"
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={filters.mileageMin || ''}
            onChange={(e) => handleFilterChange('mileageMin', e.target.value ? parseInt(e.target.value) : undefined)}
          />
          <input
            type="number"
            placeholder="Max km"
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={filters.mileageMax || ''}
            onChange={(e) => handleFilterChange('mileageMax', e.target.value ? parseInt(e.target.value) : undefined)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <Section padding="lg" className="pt-24 lg:pt-28">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Stocul Nostru Premium
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descoperă mașini verificate și certificate din cele mai prestigioase mărci
          </p>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">250+</div>
            <div className="text-muted-foreground">Vehicule în stoc</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-1">100%</div>
            <div className="text-muted-foreground">Verificate tehnic</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-success mb-1">24h</div>
            <div className="text-muted-foreground">Aprobare finanțare</div>
          </div>
        </div>
      </Section>
      
      {/* Main Content */}
      <Section padding="none" className="pb-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {filtersPanel}
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filtre
                </Button>
                
                {vehicles && (
                  <p className="text-muted-foreground">
                    {vehicles.total} vehicule găsite
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                {/* Sort */}
                <select
                  className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={`${sort.field}-${sort.direction}`}
                  onChange={(e) => {
                    const [field, direction] = e.target.value.split('-');
                    setSort({ field: field as VehicleSort['field'], direction: direction as 'asc' | 'desc' });
                  }}
                >
                  <option value="dateAdded-desc">Cele mai noi</option>
                  <option value="price-asc">Preț crescător</option>
                  <option value="price-desc">Preț descrescător</option>
                  <option value="year-desc">An descrescător</option>
                  <option value="mileage-asc">Kilometraj crescător</option>
                </select>
                
                {/* View Mode */}
                <div className="flex border border-border rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-l-lg transition-smooth ${
                      viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent/10'
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-r-lg transition-smooth ${
                      viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent/10'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="automotive-card animate-pulse">
                    <div className="h-48 bg-muted" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                      <div className="h-8 bg-muted rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Vehicles Grid */}
            {!loading && vehicles && (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {vehicles.vehicles.map(renderVehicleCard)}
                </div>
                
                {/* Pagination */}
                {vehicles.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    
                    {[...Array(vehicles.totalPages)].map((_, i) => (
                      <Button
                        key={i}
                        variant={currentPage === i + 1 ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(vehicles.totalPages, p + 1))}
                      disabled={currentPage === vehicles.totalPages}
                    >
                      Următor
                    </Button>
                  </div>
                )}
              </>
            )}
            
            {/* Empty State */}
            {!loading && vehicles && vehicles.vehicles.length === 0 && (
              <div className="text-center py-16">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nu am găsit vehicule</h3>
                <p className="text-muted-foreground mb-6">
                  Încearcă să modifici filtrele pentru a găsi vehicule potrivite.
                </p>
                <Button onClick={clearFilters}>
                  Resetează filtrele
                </Button>
              </div>
            )}
          </div>
        </div>
      </Section>
      
      <Footer />
    </div>
  );
};

export default Stock;