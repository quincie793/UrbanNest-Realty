import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface PropertyImage {
  id: number;
  url: string;
}

interface PropertyCardProps {
  id: number;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  images: PropertyImage[];
  isFavorited: boolean;
  onToggleFavorite: (propertyId: number) => void;
}

export default function PropertyCard({
  id,
  title,
  price,
  location,
  bedrooms,
  bathrooms,
  images,
  isFavorited,
  onToggleFavorite,
}: PropertyCardProps) {
  const [favorite, setFavorite] = useState(isFavorited);

  useEffect(() => {
    setFavorite(isFavorited);
  }, [isFavorited]);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggleFavorite(id);
    setFavorite(!favorite);
  };

  const imageUrl = images?.[0]?.url || "https://via.placeholder.com/400";

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <Link to={`/properties/${id}`}>
        <div className="bg-white rounded-xl shadow hover:shadow-xl transition relative overflow-hidden">

          {/* ❤️ Favorite Button */}
          <button
            onClick={handleFavorite}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur p-2 rounded-full shadow"
          >
            {favorite ? "❤️" : "🤍"}
          </button>

          {/* 🖼 Property Image */}
          <img
            src={imageUrl}
            alt={title}
            className="h-48 w-full object-cover"
          />

          {/* ℹ Info */}
          <div className="p-4">
            <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
            <p className="text-gray-500 text-sm">{location}</p>

            <p className="text-blue-600 font-bold mt-3 text-lg">
              KSh {price.toLocaleString()}
            </p>

            <div className="flex gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛏️</span>
                <div>
                  <p className="text-gray-500 text-xs">Bedrooms</p>
                  <p className="font-semibold text-gray-800">{bedrooms}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🚿</span>
                <div>
                  <p className="text-gray-500 text-xs">Bathrooms</p>
                  <p className="font-semibold text-gray-800">{bathrooms}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </Link>
    </motion.div>
  );
}