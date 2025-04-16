import "./chat.css";
import { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { Send, X } from "lucide-react";
export default function Chat() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log("Initializing Socket.IO...");
    const socketUrl = import.meta.env.VITE_API_URL.replace(
      /\/api$/,
      ""
    ).replace(/\/$/, "");
    socketRef.current = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket"],
      autoConnect: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      path: "/socket.io",
    });

    socketRef.current.on("connect", () => {
      console.log("✅ Connected to Socket.IO server");
      setIsConnected(true);
      if (user?._id) {
        socketRef.current.emit("joinUser", user._id);
      }
    });

    socketRef.current.on("disconnect", () => {
      console.log("❌ Disconnected from Socket.IO server");
      setIsConnected(false);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("💥 Connection error:", err);
      setIsConnected(false);
    });

    socketRef.current.on("newMessage", (newMessage) => {
      setMessages((prevMessages) => {
        const messageExists = prevMessages.some(
          (msg) => msg._id === newMessage._id
        );
        if (messageExists) return prevMessages;
        return [...prevMessages, newMessage];
      });
    });

    return () => {
      console.log("Cleaning up Socket.IO connection");
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user?._id]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      const filtered = data.filter((u) => u.username !== user.username);
      setUsers(filtered);
      if (!selectedUser && filtered.length > 0) {
        setSelectedUser(filtered[0]._id);
      }
    } catch (err) {
      console.error("Error fetching users in chat:", err);
    }
  }, [user.username, selectedUser]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const fetchMessages = useCallback(async () => {
    if (!selectedUser) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/messages/between?senderId=${
          user._id
        }&receiverId=${selectedUser}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessages(data);
    } catch (err) {
      console.error("Error fetching messages in chat:", err);
    }
  }, [selectedUser, user._id]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleShowChat = () => setIsChatOpen((prev) => !prev);

  const handleSend = async () => {
    if (!text.trim() || !selectedUser || !isConnected) return;

    const messageData = {
      sender: user._id,
      receiver: selectedUser,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(messageData),
      });

      const savedMessage = await res.json();
      if (!res.ok) throw new Error(savedMessage.message);

      socketRef.current.emit("sendMessage", savedMessage);

      setMessages((prev) => [...prev, savedMessage]);
      setText("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <>
      {!isChatOpen && (
        <button onClick={handleShowChat} className="chat-button">
          ✉
        </button>
      )}
      {isChatOpen && (
        <div className="chat-container">
          <label>Primalac:</label>
          <button className="chat-close" onClick={handleShowChat}>
            <X />
          </button>
          <select
            name="users"
            id="users"
            value={selectedUser || ""}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username} - {user.department}
              </option>
            ))}
          </select>

          <div className="chat-content">
            {messages.map((msg) => (
              <div
                key={msg._id || msg.timestamp}
                className={`chat-message ${
                  msg.sender === user._id ? "right" : "left"
                }`}
              >
                <div className="chat-message-content">
                  <p>{msg.text}</p>
                  <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Type your message"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              disabled={!isConnected || !text.trim()}
            >
              <Send />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
