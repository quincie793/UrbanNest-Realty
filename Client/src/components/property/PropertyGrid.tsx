import { useState } from "react";
import PropertyCard from "./PropertyCard";
import PropertySearch from "./PropertySearch";
import PropertyFilters from "./PropertyFilters";
import { properties as allProperties } from "../../utils/mockProperties";
import type { Property } from "../../types/Property";

export default function PropertyGrid() {
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(allProperties);

  return (
    <div className="p-10">
      <PropertySearch setFilteredProperties={setFilteredProperties} />
      <PropertyFilters setFilteredProperties={setFilteredProperties} allProperties={allProperties} />
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {filteredProperties.map((property) => (
          <PropertyCard key={property.id} {...property} />
        ))}
      </div>
    </div>
  );
}