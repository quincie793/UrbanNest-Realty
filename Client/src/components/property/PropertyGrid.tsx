import { useState } from "react";
import PropertyCard from "./PropertyCard";
import PropertySearch from "./PropertySearch";
import PropertyFilters from "./PropertyFilters";
import { properties as allProperties } from "../../utils/mockProperties";
import type { Property } from "../../types/Property";

export default function PropertyGrid() {
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(allProperties);
  const [search, setSearch] = useState("");
  const [price, setPrice] = useState(10000000);
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const handleToggleFavorite = (propertyId: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(propertyId)) {
      newFavorites.delete(propertyId);
    } else {
      newFavorites.add(propertyId);
    }
    setFavorites(newFavorites);
  };

  return (
    <div className="p-10">
      <PropertySearch setFilteredProperties={setFilteredProperties} />
      <PropertyFilters
        search={search}
        setSearch={setSearch}
        price={price}
        setPrice={setPrice}
        bedrooms={bedrooms}
        setBedrooms={setBedrooms}
        bathrooms={bathrooms}
        setBathrooms={setBathrooms}
      />
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {filteredProperties.map((property) => (
          <PropertyCard
            key={property.id}
            {...property}
            isFavorited={favorites.has(property.id)}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}