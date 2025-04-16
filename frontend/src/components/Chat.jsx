import "./chat.css";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function Chat() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  async function fetchUsers() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      const filtered = data.filter((u) => u.username !== user.username);
      setUsers(filtered);
      setSelectedUser(filtered[0]?._id);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let interval;

    async function fetchMessages() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/messages/between?senderId=${user._id}&receiverId=${selectedUser}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setMessages(data);
      } catch (err) {
        console.log(err);
      }
    }

    if (selectedUser) {
      fetchMessages(); // odmah učitaj poruke
      interval = setInterval(fetchMessages, 3000); // učitavaj svakih 3s
    }

    return () => clearInterval(interval);
  }, [selectedUser]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  function handleShowChat() {
    setIsChatOpen((prev) => !prev);
  }

  async function handleSend() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          sender: user._id,
          receiver: selectedUser,
          text: text,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setText("");
      // Ne čekamo sledeći interval, odmah dodaj poruku
      setMessages((prev) => [...prev, data]);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      {!isChatOpen && <button onClick={handleShowChat} className="chat-button">
        ✉
      </button>}
      {isChatOpen && (
        <div className="chat-container">
          <label>Primalac</label>
          <button className="chat-close" onClick={handleShowChat}>X</button>
          <select
            name="users"
            id="users"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>

          <div className="chat-content">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat-message ${
                  msg.sender === user._id ? "right" : "left"
                }`}
              >
                <div className="chat-message-content">
                  <p>{msg.text}</p>
                  <small>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </small>
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
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}
