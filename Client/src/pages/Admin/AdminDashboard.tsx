import { useEffect, useState } from "react";
import API from "../../services/api";

export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProperties, setTotalProperties] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const usersRes = await API.get("/users");
        const propertiesRes = await API.get("/properties");
        const messagesRes = await API.get("/messages");

        setTotalUsers(usersRes.data.length);
        setTotalProperties(propertiesRes.data.length);
        setTotalMessages(messagesRes.data.length);
      } catch (error) {
        console.error("Failed to fetch totals", error);
      }
    };

    fetchTotals();
  }, []);

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="p-6 bg-blue-100 rounded shadow">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-2xl mt-2">{totalUsers}</p>
        </div>
        <div className="p-6 bg-green-100 rounded shadow">
          <h2 className="text-xl font-semibold">Total Properties</h2>
          <p className="text-2xl mt-2">{totalProperties}</p>
        </div>
        <div className="p-6 bg-yellow-100 rounded shadow">
          <h2 className="text-xl font-semibold">Total Messages</h2>
          <p className="text-2xl mt-2">{totalMessages}</p>
        </div>
      </div>
    </div>
  );
}