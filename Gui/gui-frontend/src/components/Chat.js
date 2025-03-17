import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

const Chat = () => {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5017/chatHub", { withCredentials: true }) // ✅ Cookies are automatically sent
      .withAutomaticReconnect()
      .build();

    newConnection.start()
      .then(() => console.log("Connected to SignalR"))
      .catch(err => console.error("Connection failed", err));

    newConnection.on("ReceiveMessage", (user, message) => {
      setMessages(prev => [...prev, { user, message }]);
    });

    setConnection(newConnection);

    return () => {
      newConnection.stop();
    };
  }, []);

  const sendMessage = async () => {
    if (connection) {
      await connection.invoke("SendMessage", message);
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}><b>{msg.user}:</b> {msg.message}</p>
        ))}
      </div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
