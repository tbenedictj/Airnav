import React, { useState } from "react";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Komponen Message
const Message = ({ sender, text }) => (
  <div className={`flex ${sender === "user" ? "justify-end" : "justify-start"} mb-2`}>
    <div className={`p-3 rounded-lg max-w-sm text-sm ${sender === "user" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}>
      {text}
    </div>
  </div>
);

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Halo! Ada yang bisa saya bantu?" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    setTimeout(() => {
      const botResponse = { sender: "bot", text: "Saya masih belajar, coba tanyakan sesuatu yang lain!" };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    }, 1000);
  };

  return (
    <div className="container-fluid flex sticky h-screen mt-14 mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-gray-100">
      {/* Sidebar */}
      <div className="container w-1/5 bg-blue-800 text-white p-6 hidden md:block">
        <h2 className="text-lg font-bold mb-4">Menu</h2>
        <nav className="space-y-2">
          <Link to="/" className="block py-2 hover:bg-blue-600 rounded-lg px-3">Home</Link>
          <Link to="/chatbot" className="block py-2 hover:bg-blue-600 rounded-lg px-3">Chatbot</Link>
        </nav>
      </div>

      {/* Chatbot UI */}
      <div className="flex flex-col flex-1 w-screen max-w-3xl mx-auto mt-10 bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-500 text-white p-4 flex justify-between">
          <h2 className="text-lg font-semibold">Chatbot</h2>
          <span className="text-sm">{new Date().toLocaleDateString()}</span>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 h-96 bg-gray-100">
          {messages.map((msg, index) => (
            <Message key={index} sender={msg.sender} text={msg.text} />
          ))}
        </div>

        {/* Input Chat */}
        <div className="p-4 bg-white shadow-md flex border-t">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketik pesan..."
            className="flex-1 border border-gray-300 rounded-lg p-2 outline-none"
          />
          <button onClick={sendMessage} className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
            SEND
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
