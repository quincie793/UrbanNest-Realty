import { useEffect, useState } from "react";
import API from "../../services/api";
import type { Property } from "../../types/Property";
import Hero from "../../components/Hero/HeroSection";
import PropertyCard from "../../components/property/PropertyCard";
import FadeIn from "../../components/animations/FadeIn";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState<Property[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]); // store property IDs
  const [search, setSearch] = useState("");
  const [price, setPrice] = useState(10000000);
  const [bedrooms, setBedrooms] = useState(0);

  // 🔥 Fetch properties and user favorites
  useEffect(() => {
    const fetchData = async () => {
      try {
        const propRes = await API.get("/properties");
        setProperties(propRes.data);

        const favRes = await API.get("/favorites"); // should return { propertyId: number }[]
        setFavorites(favRes.data.map((f: any) => f.propertyId));
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // 🔥 Toggle favorite via backend
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

  // FILTER
  const filteredProperties = properties.filter((property) => {
    return (
      property.location.toLowerCase().includes(search.toLowerCase()) &&
      property.price <= price &&
      property.bedrooms >= bedrooms
    );
  });

  return (
    <div className="space-y-20">

      {/* HOME */}
      <section id="home" className="pt-24">
        <FadeIn>
          <Hero onSearch={(location) => setSearch(location)} />
        </FadeIn>
      </section>

      {/* PROPERTIES */}
      <section id="properties" className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">

          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold text-gray-800 mb-3">Find Your Perfect Property</h2>
              <p className="text-xl text-gray-600">Explore our curated collection of premium properties</p>
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

                  {filteredProperties.map((property) => (
                    <Marker
                      key={property.id}
                      position={[property.lat, property.lng]}
                    >
                      <Popup>
                        <div>
                          <p className="font-bold">{property.title}</p>
                          <p>KSh {property.price.toLocaleString()}</p>

                          <button
                            onClick={() => navigate(`/properties/${property.id}`)}
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
                Found <span className="font-bold text-blue-600">{filteredProperties.length}</span> properties
              </p>
            </div>
          </FadeIn>

          {/* GRID */}
          <FadeIn>
            <div className="grid md:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  {...property}
                  isFavorited={favorites.includes(property.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </FadeIn>

        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="bg-gray-50 min-h-screen py-16 px-6 flex items-center">
        <FadeIn>
          <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-10 grid md:grid-cols-2 gap-10 items-center">
            {/* LEFT: TEXT */}
            <div>
              <h2 className="text-4xl font-bold text-gray-800">
                About UrbanNest Realty
              </h2>

              <p className="text-gray-500 mt-3 text-lg">
                Connecting people to places they truly belong.
              </p>

              <div className="w-16 h-1 bg-blue-600 my-5 rounded"></div>

              <p className="text-gray-700 text-lg leading-relaxed">
                At <span className="font-semibold text-gray-900">UrbanNest Realty</span>, 
                we don't just list properties—we create connections.
              </p>

              <p className="text-gray-700 text-lg leading-relaxed mt-4">
                Our mission is to redefine how people discover homes by combining 
                <span className="font-semibold"> simplicity</span>, 
                <span className="font-semibold"> trust</span>, and 
                <span className="font-semibold"> innovation</span>.
              </p>

              <p className="text-gray-700 text-lg leading-relaxed mt-4">
                Whether you're searching for your first home or your next investment, 
                UrbanNest is your trusted partner every step of the way.
              </p>

              <div className="mt-6">
                <p className="text-gray-800 font-medium text-lg">
                  Your next home isn't just a place… it's a feeling.
                </p>
                <p className="text-blue-600 font-semibold mt-1">
                  Let's help you find it.
                </p>
              </div>
            </div>

            {/* RIGHT: IMAGE */}
            <div>
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa"
                alt="Modern home"
                className="rounded-2xl shadow-md w-full h-[350px] object-cover"
              />
            </div>
          </div>
        </FadeIn>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20 px-4">
        <FadeIn>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-3">Get In Touch</h2>
              <p className="text-lg text-gray-600">Reach out to us through any of these channels</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              
              {/* EMAIL */}
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-4">✉️</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Email</h3>
                <a
                  href="mailto:urbannestrealty899@gmail.com"
                  className="text-blue-600 hover:text-blue-800 font-semibold text-lg underline"
                >
                  urbannestrealty899@gmail.com
                </a>
              </div>

              {/* PHONE */}
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-4">📞</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Phone</h3>
                <a
                  href="tel:+254705524362"
                  className="text-blue-600 hover:text-blue-800 font-semibold text-lg"
                >
                  +254 705 524 362
                </a>
              </div>

              {/* INSTAGRAM */}
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-4">📸</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Instagram</h3>
                <a
                  href="https://instagram.com/urbannestrealty899"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-semibold text-lg underline"
                >
                  @urbannestrealty899
                </a>
              </div>

            </div>
          </div>
        </FadeIn>
      </section>

    </div>
  );
}