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
  Eye
} from 'lucide-react';
import { MockAPI } from '@/lib/mockApi';
import { Vehicle, VehicleFilters, VehicleSort, PaginatedVehicles, StockVehicle } from '@/types/vehicle';
import { StockAPI } from '@/lib/stockApi';

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
  fuelType: stockVehicle.combustibil as any,
  transmission: stockVehicle.transmisie as any,
  bodyType: stockVehicle.caroserie as any,
  color: stockVehicle.culoare || '',
  vin: stockVehicle.vin,
  negotiable: stockVehicle.negociabil,
  description: stockVehicle.descriere || '',
  status: stockVehicle.status as 'active' | 'inactive' | 'sold',
  dateAdded: stockVehicle.created_at,
  updatedAt: stockVehicle.updated_at,
  badges: [], // No badges in stock vehicle
  images: stockVehicle.images || [],
  mainImage: stockVehicle.images?.[0] || '',
  horsePower: 0, // Placeholder - not in stock table
  engineCapacity: 0, // Placeholder - not in stock table
  location: 'Romania', // Placeholder - not in stock table
  condition: 'second-hand' as const, // Default value
  features: [], // No features in stock table
  financing: undefined, // No financing info in stock table
});

const Stock = () => {
  const [vehicles, setVehicles] = useState<PaginatedVehicles | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<VehicleFilters>({});
  const [sort, setSort] = useState<VehicleSort>({ field: 'dateAdded', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, [filters, sort, currentPage]);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const vehicles = await StockAPI.getVehicles();
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

  const handleFilterChange = (key: keyof VehicleFilters, value: any) => {
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
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {vehicle.badges.map((badge) => (
            <Badge key={badge.id} variant={badge.type} size="sm">
              {badge.text}
            </Badge>
          ))}
        </div>
        
        {/* Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-smooth">
          <button className="p-2 bg-white/90 rounded-lg hover:bg-white shadow-medium">
            <Heart className="h-4 w-4" />
          </button>
          <button className="p-2 bg-white/90 rounded-lg hover:bg-white shadow-medium">
            <Share2 className="h-4 w-4" />
          </button>
        </div>
        
        {/* Price Badge */}
        <div className="absolute bottom-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-lg font-bold shadow-medium">
          €{vehicle.price.toLocaleString()}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <Link to={`/vehicul/${vehicle.id}`} className="block hover:text-primary transition-colors">
              <h3 className="text-xl font-semibold mb-1 cursor-pointer">
                {vehicle.brand} {vehicle.model}
              </h3>
            </Link>
            <p className="text-muted-foreground text-sm">
              {vehicle.year} • {vehicle.location}
            </p>
          </div>
        </div>
        
        {/* Vehicle Details */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Gauge className="h-4 w-4" />
            <span>{vehicle.mileage.toLocaleString()} km</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Fuel className="h-4 w-4" />
            <span className="capitalize">{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Settings className="h-4 w-4" />
            <span className="capitalize">{vehicle.transmission}</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{vehicle.horsePower} CP</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3">
          <Button 
            variant="premium" 
            size="sm" 
            className="flex-1"
            asChild
          >
            <Link to={`/vehicul/${vehicle.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              Detalii
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Financing Info */}
        {vehicle.financing?.available && (
          <div className="mt-4 p-3 bg-accent/10 rounded-lg">
            <p className="text-sm text-accent font-medium">
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
          onChange={(e) => handleFilterChange('brand', e.target.value)}
        >
          <option value="">Toate mărcile</option>
          {MockAPI.getBrands().map(brand => (
            <option key={brand} value={brand}>{brand}</option>
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