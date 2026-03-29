export interface PropertyImage {
  id: number;
  url: string;
}

export interface Property {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  lat: number;
  lng: number;
  type: string;
  images: PropertyImage[];
}