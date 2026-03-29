import { useState } from "react";

interface HeroProps {
  onSearch: (location: string) => void;
}

export default function Hero({ onSearch }: HeroProps) {
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    onSearch(location);
  };

  return (
    <div
      className="h-[500px] bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa')",
      }}
    >
      <div className="bg-white/90 backdrop-blur p-8 rounded shadow-lg max-w-2xl w-full">

        <h1 className="text-3xl font-bold text-center mb-4">
          Find Your Dream Home
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Discover the best properties with UrbanNest Realty
        </p>

        {/* Search bar */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search location..."
            className="flex-1 border p-3 rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>

      </div>
    </div>
  );
}