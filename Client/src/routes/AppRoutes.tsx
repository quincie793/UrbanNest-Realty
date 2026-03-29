import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

// User Pages
import Home from "../pages/Home/Home";
import PropertyDetails from "../pages/PropertyDetails/PropertyDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Favorites from "../pages/Favorites/Favorites";
import ContactAgentForm from "../components/ContactAgent/ContactAgentForm";
import About from "../pages/About";
import Contact from "../pages/Contact";

// Admin
import AdminLayout from "../pages/Admin/AdminLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminProperties from "../pages/Admin/AdminProperties";
import AdminMessages from "../pages/Admin/AdminMessages";
import AdminUsers from "../pages/Admin/AdminUsers";
import AdminPropertyForm from "../pages/Admin/AdminPropertyForm";
import AdminRoute from "../pages/Admin/AdminRoute";

export default function AppRoutes() {
  return (
    <Router>
      <Navbar /> {/* ✅ Always visible */}

      <Routes>
        {/* USER ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/contact-agent/:propertyId" element={<ContactAgentForm />} />

        {/* ADMIN ROUTES */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="properties/add" element={<AdminPropertyForm />} />
            <Route path="properties/edit/:id" element={<AdminPropertyForm />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}