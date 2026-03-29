import { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api"; // ✅ use your API instance
import Swal from "sweetalert2";

export default function ContactAgentForm() {
  const { id } = useParams<{ id: string }>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ✅ prevents page reload

    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to send a message",
      });
      return;
    }

    if (!message.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Empty Message",
        text: "Please type your message before sending.",
      });
      return;
    }

    try {
      setLoading(true);

      await API.post(
        "/messages", // ✅ use relative URL
        {
          content: message,
          propertyId: Number(id),
          name,
          email,
          phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Message Sent!",
        text: "Your inquiry has been delivered to the agent.",
        timer: 2000,
        showConfirmButton: false,
      });

      // ✅ Clear form
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (error: any) {
      console.error("Error sending message:", error);

      Swal.fire({
        icon: "error",
        title: "Failed to Send",
        text:
          error?.response?.data?.error ||
          error?.message ||
          "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 bg-white p-6 rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4">Contact Agent</h2>

      <div className="flex flex-col mb-3">
        <label className="mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-2 rounded"
        />
      </div>

      <div className="flex flex-col mb-3">
        <label className="mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded"
        />
      </div>

      <div className="flex flex-col mb-3">
        <label className="mb-1">Phone</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="border p-2 rounded"
        />
      </div>

      <div className="flex flex-col mb-3">
        <label className="mb-1">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="border p-2 rounded"
        />
      </div>

      <button
        type="submit" // ✅ keep submit (we already prevent default)
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}