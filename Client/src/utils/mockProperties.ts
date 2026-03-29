import type { Property } from "../types/Property";

export const properties: Property[] = [
  {
    id: 1,
    title: "Modern Apartment",
    price: 8500000,
    location: "Nairobi",
    bedrooms: 3,
    bathrooms: 2,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    ],
    coordinates: { lat: -1.2921, lng: 36.8219 },
  },
  {
    id: 2,
    title: "Luxury Villa",
    price: 25000000,
    location: "Karen",
    bedrooms: 5,
    bathrooms: 4,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    ],
    coordinates: { lat: -1.2921, lng: 36.8219 },
},
  {
    id: 3,
    title: "City Studio",
    price: 4500000,
    location: "Westlands",
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    ],
    coordinates: { lat: -1.2921, lng: 36.8219 },
},
];