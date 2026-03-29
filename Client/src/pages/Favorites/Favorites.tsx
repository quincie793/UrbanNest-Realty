import { useEffect, useState } from "react";
import API from "../../services/api";
import PropertyCard from "../../components/property/PropertyCard";

export default function Favorites() {
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await API.get("/favorites");
        setFavorites(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFavorites();
  }, []);

  if (favorites.length === 0) return <div className="p-10">No favorites yet!</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 grid md:grid-cols-3 gap-6">
      {favorites.map((fav) => (
        <PropertyCard
          key={fav.id}
          {...fav.property}
          isFavorited={true}
        />
      ))}
    </div>
  );
}