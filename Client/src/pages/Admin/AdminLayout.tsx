import { Link, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../../utils/auth";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-md flex flex-col p-4">
        <h2 className="text-2xl font-bold text-blue-600 mb-8">
          Admin Panel
        </h2>

        <nav className="flex flex-col gap-4 text-gray-700">
          <Link to="/admin" className="hover:text-blue-600">Dashboard</Link>
          <Link to="/admin/properties" className="hover:text-blue-600">Properties</Link>
          <Link to="/admin/messages" className="hover:text-blue-600">Messages</Link>
          <Link to="/admin/users" className="hover:text-blue-600">Users</Link>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}