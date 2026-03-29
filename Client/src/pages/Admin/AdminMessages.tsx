import { useEffect, useState } from "react";
import API from "../../services/api";

interface Reply {
  id: number;
  content: string;
  createdAt: string;
}

interface Message {
  id: number;
  content: string;
  propertyId: number;
  userId: number;
  user: {
    name: string;
    email: string;
  };
  property: {
    title: string;
  };
  replies?: Reply[];
  createdAt: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [notifications, setNotifications] = useState<Message[]>([]);

  const token = localStorage.getItem("token");

  // Fetch messages from backend
  const fetchMessages = async () => {
    if (!token) return;
    try {
      const res = await API.get("/messages/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Ensure replies array exists
      const msgs: Message[] = res.data.map((m: Message) => ({
        ...m,
        replies: m.replies || [],
      }));

      // Determine new messages for notifications
      const newMsgs = msgs.filter((m) => !messages.some((msg) => msg.id === m.id));
      if (newMsgs.length > 0) setNotifications(newMsgs);

      setMessages(msgs);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  // Initial fetch + polling every 15s
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 15000);
    return () => clearInterval(interval);
  }, []);

  // Handle sending a reply
  const handleReply = async (messageId: number) => {
    if (!replyText || !token) return;

    try {
      const res = await API.post(
        "/messages/reply",
        { messageId, content: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the message in state with the new reply
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, replies: [...(msg.replies || []), res.data] }
            : msg
        )
      );

      setReplyText("");
      setReplyingTo(null);
      alert("Reply sent!");
    } catch (error) {
      console.error("Failed to send reply", error);
      alert("Failed to send reply");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">User Messages</h1>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="bg-yellow-100 p-4 rounded mb-4">
          <p className="font-semibold">
            You have {notifications.length} new message(s)!
          </p>
        </div>
      )}

      {/* Messages list */}
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="border p-4 rounded shadow bg-gray-50 flex flex-col gap-2"
            >
              <p>
                <span className="font-semibold">{msg.user.name}</span> (
                {msg.user.email}) about{" "}
                <span className="font-semibold">{msg.property.title}</span>
              </p>
              <p>{msg.content}</p>
              <p className="text-gray-400 text-sm">
                {new Date(msg.createdAt).toLocaleString()}
              </p>

              {/* Replies */}
              {(msg.replies || []).length > 0 && (
                <div className="mt-2 bg-gray-100 p-3 rounded">
                  <h4 className="font-semibold">Replies:</h4>
                  {msg.replies?.map((r) => (
                    <p key={r.id} className="mt-1">
                      {r.content}{" "}
                      <span className="text-gray-400 text-xs">
                        ({new Date(r.createdAt).toLocaleString()})
                      </span>
                    </p>
                  ))}
                </div>
              )}

              {/* Reply form */}
              {replyingTo === msg.id ? (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    className="border p-2 flex-1 rounded"
                    placeholder="Type your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <button
                    className="bg-green-600 text-white px-4 rounded"
                    onClick={() => handleReply(msg.id)}
                  >
                    Send
                  </button>
                  <button
                    className="bg-gray-400 text-white px-4 rounded"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyText("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  className="mt-2 bg-blue-600 text-white px-4 py-1 rounded w-fit"
                  onClick={() => setReplyingTo(msg.id)}
                >
                  Reply
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}