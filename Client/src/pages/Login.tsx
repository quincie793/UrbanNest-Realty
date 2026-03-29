import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { saveToken } from "../utils/auth";

interface User {
  id: number;
  name: string;
  role: string;
}

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      // Save token
      saveToken(res.data.token);

      // Save user data in localStorage (normalize role to lowercase)
      const user: User = {
        id: res.data.user.id,
        name: res.data.user.name,
        role: res.data.user.role.toLowerCase(), // ✅ lowercase for consistency
      };
      localStorage.setItem("user", JSON.stringify(user));

      alert("Login successful 🎉");

      // Redirect based on role
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/"); // regular user
      }
    } catch (error) {
      alert("Login failed ❌");
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow w-96"
      >
        <h2 className="text-2xl font-bold mb-6">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}