import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";

interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  images: { id: number; url: string }[];
}

export default function AdminProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔥 Fetch all properties
  const fetchProperties = async () => {
    try {
      const res = await API.get("/properties");
      setProperties(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // 🗑 Delete property
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      await API.delete(`/properties/admin/${id}`);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <div>
      {/* 🔥 HEADER + ADD BUTTON */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Properties</h1>

        <Link
          to="/admin/properties/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Property
        </Link>
      </div>

      {/* ⏳ LOADING */}
      {loading ? (
        <p className="text-gray-500">Loading properties...</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Location</th>
                <th className="p-3">Price</th>
                <th className="p-3">Images</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {properties.map((property) => (
                <tr key={property.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{property.title}</td>
                  <td className="p-3">{property.location}</td>
                  <td className="p-3">KSh {property.price.toLocaleString()}</td>
                  <td className="p-3">{property.images.length}</td>

                  <td className="p-3 flex gap-4">
                    {/* ✏️ EDIT */}
                    <button
                      onClick={() =>
                        navigate(`/admin/properties/edit/${property.id}`)
                      }
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>

                    {/* 🗑 DELETE */}
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {properties.length === 0 && (
            <p className="p-4 text-gray-500">No properties found.</p>
          )}
        </div>
      )}
    </div>
  );
}