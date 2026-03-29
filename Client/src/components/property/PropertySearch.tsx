import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  setFilteredProperties: Dispatch<SetStateAction<any[]>>;
}

export default function PropertySearch({ setFilteredProperties }: Props) {
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    setFilteredProperties((prev) =>
      prev.filter((p: any) =>
        p.location.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  return (
    <div className="flex gap-4 p-6 bg-white shadow rounded">
      <input
        type="text"
        placeholder="Search location..."
        className="border p-2 rounded flex-1"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
}