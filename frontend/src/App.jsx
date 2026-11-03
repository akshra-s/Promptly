
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

import "./App.css";
import Auth from "./Auth.jsx";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import Chats from "./Chats.jsx";
import Inputbox from "./InputBox.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );

  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(() => uuid());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [allThreads, setAllThreads] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Check existing login session
  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/auth/user",
          { credentials: "include" }
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkUser();
  }, []);

  const getReply = async () => {
    const message = prompt.trim();

    if (!message || isLoading) return;

    setIsLoading(true);
    setNewChat(false);
    setReply(null);

    try {
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          message,
          threadId: currThreadId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "The request failed.");
      }

      setCurrThreadId(data.threadId);
      setReply(data.reply);
    } catch (error) {
      console.error("Promptly chat error:", error);
      setReply("Sorry, something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    if (isLoading) return;

    setPrompt("");
    setReply(null);
    setPrevChats([]);
    setCurrThreadId(uuid());
    setNewChat(true);
  };

  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    newChat,
    setNewChat,
    prevChats,
    setPrevChats,
    isLoading,
    getReply,
    startNewChat,
    allThreads,
    setAllThreads,
  };

  if (checkingAuth) {
    return <div className="auth-loading">Loading Promptly...</div>;
  }

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  return (
    <div
      className={`main ${sidebarOpen ? "" : "sidebar-closed"} ${
        theme === "light" ? "light-theme" : ""
      }`}
    >
      <MyContext.Provider value={providerValues}>
        <Sidebar
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <Navbar
          sidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
          user={user}
          onLogout={() => setUser(null)}
          theme={theme}
          toggleTheme={() =>
            setTheme((prev) => (prev === "dark" ? "light" : "dark"))
          }
        />

        <ChatWindow>
          <Chats />
          <Inputbox />
        </ChatWindow>
      </MyContext.Provider>
    </div>
  );
}

export default App;
