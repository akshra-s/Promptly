import "./App.css";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import Chats from "./Chats.jsx";
import Inputbox from "./Inputbox.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState } from "react";
import { v4 as uuid } from "uuid";

function App() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [currThreadId, setCurrThreadId] = useState(uuid());
  const [isLoading, setIsLoading] = useState(false);

  const getReply = async () => {
    const message = prompt.trim();

    if (!message || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setPrompt("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          threadId: currThreadId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get a reply");
      }

      setCurrThreadId(data.threadId);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const providerValues = {
    prompt,
    setPrompt,
    messages,
    isLoading,
    getReply,
    currThreadId,
    setCurrThreadId,
    setMessages,
  };

  return (
    <div className="main">
      <MyContext.Provider value={providerValues}>
        <Sidebar />
        <Navbar />

        <ChatWindow>
          <Chats />
          <Inputbox />
        </ChatWindow>
      </MyContext.Provider>
    </div>
  );
}

export default App;