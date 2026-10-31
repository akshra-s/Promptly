
import "./Sidebar.css";
import { useContext, useEffect, useState } from "react";
import logo from "./assets/p_logo.png";
import { MyContext } from "./MyContext.jsx";

export default function Sidebar({ toggleSidebar }) {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setCurrThreadId,
    setPrevChats,
    setNewChat,
    setReply,
    setPrompt,
    startNewChat,
  } = useContext(MyContext);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getAllThreads = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/thread");

      if (!response.ok) {
        throw new Error("Failed to fetch threads");
      }

      const res = await response.json();

      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));

      setAllThreads(filteredData);
    } catch (error) {
      console.error("Error fetching threads:", error);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    setPrompt("");
    setReply(null);

    try {
      const response = await fetch(
        `http://localhost:8080/api/thread/${newThreadId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch conversation");
      }

      const res = await response.json();

      setPrevChats(res);
      setNewChat(false);
    } catch (error) {
      console.error("Error changing thread:", error);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/thread/${threadId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete conversation");
      }

      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId)
      );

      if (threadId === currThreadId) {
        startNewChat();
      }
    } catch (error) {
      console.error("Error deleting thread:", error);
    }
  };

  const filteredThreads = allThreads.filter((thread) =>
    thread.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-header">
          <img src={logo} alt="Promptly logo" className="logo" />

          <div className="sidebar-icons">
            <i
              className="fa-solid fa-magnifying-glass"
              title="Search chats"
              onClick={() => {
                setSearchOpen((prev) => !prev);
                setSearchTerm("");
              }}
            ></i>

            <i
              className="fa-solid fa-right-to-bracket"
              onClick={toggleSidebar}
              title="Close sidebar"
            ></i>
          </div>
        </div>

        {searchOpen && (
          <input
            type="text"
            className="search-input"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        )}

        <button
          className="new-chat"
          onClick={() => {
            startNewChat();
            setSearchTerm("");
            setSearchOpen(false);
          }}
        >
          <i className="fa-solid fa-pen-to-square"></i>
          <span>New Chat</span>
        </button>

        <ul className="history">
          {filteredThreads.length > 0 ? (
            filteredThreads.map((thread) => (
              <li
                key={thread.threadId}
                onClick={() => changeThread(thread.threadId)}
                className={
                  thread.threadId === currThreadId ? "highlighted" : ""
                }
              >
                <span>{thread.title}</span>

                <i
                  className="fa-solid fa-trash"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteThread(thread.threadId);
                  }}
                ></i>
              </li>
            ))
          ) : (
            <p className="no-results">
              {searchTerm ? "No conversations found." : "No conversations yet."}
            </p>
          )}
        </ul>
      </div>

      <div className="sign">
        <p>Promptly</p>
      </div>
    </section>
  );
}
