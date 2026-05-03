import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Message from "./Message";
import InputBox from "./InputBox";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef();

  // load history
  useEffect(() => {
    const saved = localStorage.getItem("chat");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // save history
  useEffect(() => {
    localStorage.setItem("chat", JSON.stringify(messages));
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const newMessages = [...messages, { sender: "user", text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/chat", {
        message: text,
      });

      let reply = "";
      const fullText = res.data.reply;

      for (let i = 0; i < fullText.length; i++) {
        reply += fullText[i];
        setMessages([...newMessages, { sender: "bot", text: reply }]);
        await new Promise((r) => setTimeout(r, 10));
      }
    } catch {
      setMessages([
        ...newMessages,
        { sender: "bot", text: "Error connecting to server" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, i) => (
          <Message key={i} {...msg} />
        ))}
        {loading && <p className="typing">Bot is typing...</p>}
        <div ref={endRef} />
      </div>

      <InputBox onSend={sendMessage} />
    </div>
  );
}
