import { useState, useEffect, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";

interface PropertyFormData {
  title: string;
  description: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  lat: number;
  lng: number;
  type: string;
}

export default function AdminPropertyForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    description: "",
    location: "",
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    lat: 0,
    lng: 0,
    type: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Fetch property data if editing
  useEffect(() => {
    if (isEditMode) {
      const fetchProperty = async () => {
        try {
          const res = await API.get(`/properties/${id}`);
          const data = res.data;
          setFormData({
            title: data.title,
            description: data.description,
            location: data.location,
            price: data.price,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            lat: data.lat,
            lng: data.lng,
            type: data.type,
          });
          setPreviewUrls(data.images.map((img: any) => img.url));
        } catch (err) {
          console.error("Error fetching property:", err);
        }
      };
      fetchProperty();
    }
  }, [id, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["price", "bedrooms", "bathrooms", "lat", "lng"].includes(name)
        ? parseFloat(value)
        : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImages(files);

    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in as admin to perform this action.");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value.toString());
    });

    images.forEach((file) => {
      data.append("images", file);
    });

    console.log("Submitting FormData:");
    for (let pair of data.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      if (isEditMode) {
        await API.put(`/properties/admin/${id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await API.post(`/properties/admin`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      }
      alert(isEditMode ? "Property updated successfully!" : "Property created successfully!");
      setTimeout(() => navigate("/admin/properties"), 500);
    } catch (err) {
      console.error("Error saving property:", err);
      alert("Failed to save property. Check console for details.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? "Edit Property" : "Add Property"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block font-semibold">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label className="block font-semibold">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        {/* Price / Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            >
              <option value="">Select type</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Condo">Condo</option>
            </select>
          </div>
        </div>

        {/* Bedrooms / Bathrooms / Lat / Lng */}
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label>Bedrooms</label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label>Bathrooms</label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label>Latitude</label>
            <input
              type="number"
              name="lat"
              value={formData.lat}
              onChange={handleChange}
              step="0.00001"
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label>Longitude</label>
            <input
              type="number"
              name="lng"
              value={formData.lng}
              onChange={handleChange}
              step="0.00001"
              className="border p-2 w-full rounded"
            />
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block font-semibold">Property Images</label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Previews */}
        {previewUrls.length > 0 && (
          <div className="flex gap-4 mt-2 overflow-x-auto">
            {previewUrls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Preview ${idx}`}
                className="h-24 w-32 object-cover rounded border"
              />
            ))}
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
        >
          {isEditMode ? "Update Property" : "Add Property"}
        </button>
      </form>
    </div>
  );
}