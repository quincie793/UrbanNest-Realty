import { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminAddProperty() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    lat: "",
    lng: "",
    type: "SALE",
    agentId: "",
    images: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Convert images string → array
      const imagesArray = form.images.split(",").map((img) => img.trim());

      await API.post("/properties/admin", {
        ...form,
        images: imagesArray,
      });

      alert("Property created successfully 🚀");
      navigate("/admin/properties");
    } catch (error) {
      console.error(error);
      alert("Failed to create property");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Add Property</h1>

      <form onSubmit={handleSubmit} className="grid gap-4">

        <input name="title" placeholder="Title" className="border p-2" onChange={handleChange} required />

        <textarea name="description" placeholder="Description" className="border p-2" onChange={handleChange} required />

        <input name="location" placeholder="Location" className="border p-2" onChange={handleChange} required />

        <input name="price" type="number" placeholder="Price" className="border p-2" onChange={handleChange} required />

        <input name="bedrooms" type="number" placeholder="Bedrooms" className="border p-2" onChange={handleChange} required />

        <input name="bathrooms" type="number" placeholder="Bathrooms" className="border p-2" onChange={handleChange} required />

        <input name="lat" type="number" placeholder="Latitude" className="border p-2" onChange={handleChange} required />

        <input name="lng" type="number" placeholder="Longitude" className="border p-2" onChange={handleChange} required />

        <select name="type" className="border p-2" onChange={handleChange}>
          <option value="SALE">For Sale</option>
          <option value="RENT">For Rent</option>
        </select>

        <input name="agentId" type="number" placeholder="Agent ID" className="border p-2" onChange={handleChange} required />

        <input
          name="images"
          placeholder="Image URLs (comma separated)"
          className="border p-2"
          onChange={handleChange}
          required
        />

        <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Create Property
        </button>

      </form>
    </div>
  );
}