import { useState } from "react";
import { v4 as uuid } from "uuid";

import "./App.css";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import Chats from "./Chats.jsx";
import Inputbox from "./InputBox.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";

function App() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [currThreadId, setCurrThreadId] = useState(() => uuid());
  const [isLoading, setIsLoading] = useState(false);

  const getReply = async () => {
    const message = prompt.trim();

    if (!message || isLoading) return;

    setMessages((previous) => [
      ...previous,
      { role: "user", content: message },
    ]);
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
        throw new Error(data.error || "The request failed.");
      }

      if (typeof data.reply !== "string" || !data.reply.trim()) {
        throw new Error("The server returned an empty reply.");
      }

      setCurrThreadId(data.threadId);

      setMessages((previous) => [
        ...previous,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      console.error("Promptly chat error:", error);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "I couldn't get a reply. Please check that the backend and AI service are running, then try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    if (isLoading) return;

    setPrompt("");
    setMessages([]);
    setCurrThreadId(uuid());
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
    startNewChat,
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