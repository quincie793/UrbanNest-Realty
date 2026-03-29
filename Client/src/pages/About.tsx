import { useEffect, useRef, useState } from "react";

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Fade-in on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div className="bg-gray-50 py-16 px-6 mt-20">
      <div
        ref={ref}
        className={`max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-10 grid md:grid-cols-2 gap-10 items-center transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* LEFT: TEXT */}
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            About UrbanNest Realty
          </h1>

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
    </div>
  );
}
