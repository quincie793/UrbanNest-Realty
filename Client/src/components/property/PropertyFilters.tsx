import type { Dispatch, SetStateAction } from "react";

interface FiltersProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;

  price: number;
  setPrice: Dispatch<SetStateAction<number>>;

  bedrooms: number;
  setBedrooms: Dispatch<SetStateAction<number>>;

  bathrooms: number;
  setBathrooms: Dispatch<SetStateAction<number>>;
}

export default function Filters({
  search,
  setSearch,
  price,
  setPrice,
  bedrooms,
  setBedrooms,
  bathrooms,
  setBathrooms,
}: FiltersProps) {
  return (
    <div className="bg-white p-6 rounded shadow grid md:grid-cols-5 gap-4 mb-6">

      {/* Location */}
      <input
        type="text"
        placeholder="Search location..."
        className="border p-2 rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Price */}
      <select
        className="border p-2 rounded"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
      >
        <option value={10000000}>Max Price</option>
        <option value={1000000}>1M</option>
        <option value={2000000}>2M</option>
        <option value={5000000}>5M</option>
      </select>

      {/* Bedrooms */}
      <select
        className="border p-2 rounded"
        value={bedrooms}
        onChange={(e) => setBedrooms(Number(e.target.value))}
      >
        <option value={0}>Bedrooms</option>
        <option value={1}>1+</option>
        <option value={2}>2+</option>
        <option value={3}>3+</option>
        <option value={4}>4+</option>
      </select>

      {/* Bathrooms */}
      <select
        className="border p-2 rounded"
        value={bathrooms}
        onChange={(e) => setBathrooms(Number(e.target.value))}
      >
        <option value={0}>Bathrooms</option>
        <option value={1}>1+</option>
        <option value={2}>2+</option>
        <option value={3}>3+</option>
      </select>

      {/* Reset */}
      <button
        onClick={() => {
          setSearch("");
          setPrice(10000000);
          setBedrooms(0);
          setBathrooms(0);
        }}
        className="bg-gray-200 rounded p-2 hover:bg-gray-300"
      >
        Reset
      </button>
    </div>
  );
}