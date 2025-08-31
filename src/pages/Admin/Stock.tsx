import VehicleStockManager from "@/components/admin/VehicleStockManager";

const Stock = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestionare Stoc Vehicule</h1>
        <p className="text-gray-600 mt-2">
          Administrează vehiculele din stocul platformei - adaugă, editează și gestionează anunțurile
        </p>
      </div>
      
      <VehicleStockManager />
    </div>
  );
};

export default Stock;
