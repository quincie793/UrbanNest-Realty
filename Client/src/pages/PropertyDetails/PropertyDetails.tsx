import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Property } from "../../types/Property";
import API from "../../services/api";

import Slider from "react-slick";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import Swal from "sweetalert2"; // ✅ ADDED

import PropertyCard from "../../components/property/PropertyCard";
import { useNavigate } from "react-router-dom";
import FadeIn from "../../components/animations/FadeIn";

/* Fix Leaflet marker icons */
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Message {
  id: number;
  content: string;
  createdAt: string;
  property: { id: number };
  replies?: { id: number; content: string; createdAt: string }[];
}

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [property, setProperty] = useState<Property | null>(null);
  const [relatedProperties, setRelatedProperties] = useState<Property[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const [price, setPrice] = useState(10000000);
  const [bedrooms, setBedrooms] = useState(0);

  const token = localStorage.getItem("token");

  // Fetch property
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await API.get(`/properties/${id}`);
        setProperty(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProperty();
  }, [id]);

  // Fetch related properties
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await API.get("/properties");
        const filtered = res.data.filter((p: Property) => p.id !== Number(id));
        setRelatedProperties(filtered);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRelated();
  }, [id]);

  // Fetch user favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await API.get("/favorites");
        setFavorites(res.data.map((f: any) => f.propertyId));
      } catch (error) {
        console.error(error);
      }
    };
    fetchFavorites();
  }, []);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!token) return;
      try {
        const res = await API.get("/messages", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const propertyMessages = res.data
          .filter((m: Message) => m.property.id === Number(id))
          .map((m: Message) => ({
            ...m,
            replies: m.replies || [],
          }));

        setMessages(propertyMessages);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMessages();
  }, [id, token]);

  // Toggle favorite
  const handleToggleFavorite = async (propertyId: number) => {
    try {
      if (favorites.includes(propertyId)) {
        await API.delete(`/favorites/${propertyId}`);
        setFavorites((prev) => prev.filter((id) => id !== propertyId));
      } else {
        await API.post(`/favorites/${propertyId}`);
        setFavorites((prev) => [...prev, propertyId]);
      }
    } catch (error) {
      console.error("Failed to toggle favorite", error);
    }
  };

  // ✅ UPDATED SEND MESSAGE WITH NOTIFICATION
  const handleSendMessage = async () => {
    if (!messageText || !property || !token) {
      Swal.fire({
        icon: "warning",
        title: "Empty Message",
        text: "Please write a message first.",
      });
      return;
    }

    setSending(true);
    try {
      const res = await API.post(
        "/messages",
        { content: messageText, propertyId: property.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => [
        {
          ...res.data,
          replies: res.data.replies || [],
        },
        ...prev,
      ]);

      setMessageText("");

      // ✅ SUCCESS TOAST
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Message sent",
        showConfirmButton: false,
        timer: 2000,
      });

    } catch (error: any) {
      console.error("Failed to send message", error);

      Swal.fire({
        icon: "error",
        title: "Failed",
        text:
          error.response?.data?.error ||
          error.message ||
          "Something went wrong",
      });
    } finally {
      setSending(false);
    }
  };

  // Filter related properties
  const filteredRelatedProperties = relatedProperties.filter((prop) => {
    return (
      prop.location.toLowerCase().includes(search.toLowerCase()) &&
      prop.price <= price &&
      prop.bedrooms >= bedrooms
    );
  });

  if (!property) return <div className="p-10">Loading...</div>;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      
      {/* PROPERTY DETAILS SECTION */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <Slider {...sliderSettings}>
          {property.images?.map((img) => (
            <img
              key={img.id}
              src={img.url}
              alt={property.title}
              className="w-full h-96 object-cover rounded-2xl shadow-lg"
            />
          ))}
        </Slider>

        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800">{property.title}</h1>
          <p className="text-gray-500 mt-2 text-lg">{property.location}</p>
          <p className="text-blue-600 font-bold mt-3 text-3xl">
            KSh {property.price.toLocaleString()}
          </p>

          <div className="flex gap-8 mt-6 text-gray-700 pb-6 border-b">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛏️</span>
              <div>
                <p className="text-sm text-gray-600">Bedrooms</p>
                <p className="font-bold text-lg">{property.bedrooms}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚿</span>
              <div>
                <p className="text-sm text-gray-600">Bathrooms</p>
                <p className="font-bold text-lg">{property.bathrooms}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleToggleFavorite(property.id)}
            className="mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            {favorites.includes(property.id)
              ? "❤️ Favorited"
              : "🤍 Add to Favorites"}
          </button>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Location</h2>
          <div className="h-72 rounded-2xl overflow-hidden shadow-lg">
            <MapContainer
              center={[property.lat, property.lng]}
              zoom={13}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <Marker position={[property.lat, property.lng]}>
                <Popup>{property.title}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        {/* Messages */}
        <div className="mt-10 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Agent</h2>

          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Write your message..."
            className="w-full p-4 border-2 border-gray-200 rounded-lg mb-4 focus:border-blue-600 focus:outline-none transition"
            rows={5}
          />

          <button
            onClick={handleSendMessage}
            disabled={sending}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors mb-4"
          >
            {sending ? "Sending..." : "Send Message"}
          </button>

          {messages.length === 0 && <p className="text-gray-600">No messages yet.</p>}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className="border-2 border-gray-200 p-4 mb-4 rounded-lg bg-gray-50"
            >
              <p className="text-gray-800">{msg.content}</p>
              <p className="text-gray-400 text-sm mt-2">
                Sent: {new Date(msg.createdAt).toLocaleString()}
              </p>

              {(msg.replies ?? []).length > 0 && (
                <div className="mt-4 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                  <h4 className="font-semibold text-blue-900 mb-2">Reply from Agent:</h4>
                  {(msg.replies ?? []).map((r) => (
                    <p key={r.id} className="text-gray-800">
                      {r.content}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* RELATED PROPERTIES SECTION */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 mt-10">
        <div className="max-w-7xl mx-auto px-4">

          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold text-gray-800 mb-3">Related Properties</h2>
              <p className="text-xl text-gray-600">Explore similar properties in the area</p>
            </div>
          </FadeIn>

          {/* FILTERS */}
          <FadeIn>
            <div className="bg-white p-8 rounded-2xl shadow-lg mb-10 grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Location</label>
                <input
                  type="text"
                  placeholder="Search location..."
                  className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-blue-600 focus:outline-none transition"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Max Price</label>
                <select
                  className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-blue-600 focus:outline-none transition"
                  onChange={(e) => setPrice(Number(e.target.value))}
                >
                  <option value="10000000">Up to 10M</option>
                  <option value="1000000">Up to 1M</option>
                  <option value="2000000">Up to 2M</option>
                  <option value="5000000">Up to 5M</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Bedrooms</label>
                <select
                  className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-blue-600 focus:outline-none transition"
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                >
                  <option value="0">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                </select>
              </div>
            </div>
          </FadeIn>

          {/* MAP */}
          <FadeIn>
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Browse on Map</h3>
              <div className="h-96 rounded-2xl overflow-hidden shadow-lg">
                <MapContainer
                  center={[-1.286389, 36.817223]}
                  zoom={12}
                  scrollWheelZoom={true}
                  className="h-full w-full"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />

                  {filteredRelatedProperties.map((prop) => (
                    <Marker
                      key={prop.id}
                      position={[prop.lat, prop.lng]}
                    >
                      <Popup>
                        <div>
                          <p className="font-bold">{prop.title}</p>
                          <p>KSh {prop.price.toLocaleString()}</p>

                          <button
                            onClick={() => navigate(`/properties/${prop.id}`)}
                            className="text-blue-600 underline"
                          >
                            View Property
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          </FadeIn>

          {/* RESULTS COUNT */}
          <FadeIn>
            <div className="mb-8">
              <p className="text-lg text-gray-600">
                Found <span className="font-bold text-blue-600">{filteredRelatedProperties.length}</span> properties
              </p>
            </div>
          </FadeIn>

          {/* GRID */}
          <FadeIn>
            <div className="grid md:grid-cols-3 gap-8">
              {filteredRelatedProperties.map((p) => (
                <PropertyCard
                  key={p.id}
                  {...p}
                  isFavorited={favorites.includes(p.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </FadeIn>

        </div>
      </section>

    </div>
  );
}