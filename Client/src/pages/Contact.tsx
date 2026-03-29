export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-20 px-6 mt-20">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Get In Touch</h1>
          <p className="text-xl text-gray-600">
            We'd love to hear from you. Reach out to us through any of these channels.
          </p>
        </div>

        {/* CONTACT CARDS */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          
          {/* EMAIL CARD */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">✉️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Email</h2>
            <a
              href="mailto:info@urbannestrealty.com"
              className="text-blue-600 hover:text-blue-800 text-lg font-semibold underline"
            >
              info@urbannestrealty.com
            </a>
          </div>

          {/* PHONE CARD */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">📞</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Phone</h2>
            <a
              href="tel:+254700000000"
              className="text-blue-600 hover:text-blue-800 text-lg font-semibold"
            >
              +254 700 000 000
            </a>
          </div>

          {/* INSTAGRAM CARD */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">📸</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Instagram</h2>
            <a
              href="https://instagram.com/UrbanNest Realty"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-lg font-semibold underline"
            >
              @UrbanNest Realty
            </a>
          </div>

        </div>

        

      </div>
    </div>
  );
}