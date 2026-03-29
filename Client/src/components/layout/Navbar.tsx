import { isLoggedIn, logout } from "../../utils/auth";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
  };

  // Highlight active route
  const linkStyle = (path: string) =>
    location.pathname === path
      ? "text-blue-600 font-bold"
      : "hover:text-blue-600 transition";

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          UrbanNest Realty
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 text-gray-700 font-medium items-center">
          <li>
            <Link to="/" className={linkStyle("/")}>
              Home
            </Link>
          </li>

          <li>
            <Link to="/properties/1" className={linkStyle("/properties")}>
              Properties
            </Link>
          </li>

          <li>
            <Link to="/about" className={linkStyle("/about")}>
              About
            </Link>
          </li>

          <li>
            <Link to="/contact" className={linkStyle("/contact")}>
              Contact
            </Link>
          </li>

          {!loggedIn ? (
            <>
              <li>
                <Link to="/login" className="hover:text-blue-600">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-blue-600">
                  Register
                </Link>
              </li>
            </>
          ) : (
            <li>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:underline"
              >
                Logout
              </button>
            </li>
          )}
        </ul>

        {/* Mobile Hamburger Menu */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex flex-col gap-1.5"
        >
          <span className={`w-6 h-0.5 bg-gray-700 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-gray-700 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-gray-700 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <ul className="flex flex-col gap-2 text-gray-700 font-medium p-4">
            <li>
              <Link to="/" className={`block px-4 py-2 rounded ${linkStyle("/")}`}>
                Home
              </Link>
            </li>

            <li>
              <Link to="/properties/1" className={`block px-4 py-2 rounded ${linkStyle("/properties")}`}>
                Properties
              </Link>
            </li>

            <li>
              <Link to="/about" className={`block px-4 py-2 rounded ${linkStyle("/about")}`}>
                About
              </Link>
            </li>

            <li>
              <Link to="/contact" className={`block px-4 py-2 rounded ${linkStyle("/contact")}`}>
                Contact
              </Link>
            </li>

            {!loggedIn ? (
              <>
                <li>
                  <Link to="/login" className="block px-4 py-2 rounded hover:text-blue-600">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="block px-4 py-2 rounded hover:text-blue-600">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded text-red-500 hover:underline"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}