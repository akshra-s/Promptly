
import "./Sidebar.css";
import { useContext, useEffect } from "react";
import logo from "./assets/p_logo.png";
import { MyContext } from "./MyContext.jsx";

export default function Sidebar() {
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

  return (
    <section className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-header">
          <img src={logo} alt="Promptly logo" className="logo" />

          <div className="sidebar-icons">
            <i className="fa-solid fa-magnifying-glass"></i>
            <i className="fa-solid fa-right-to-bracket"></i>
          </div>
        </div>

        <button className="new-chat" onClick={startNewChat}>
          <i className="fa-solid fa-pen-to-square"></i>
          <span>New Chat</span>
        </button>

        <ul className="history">
          {allThreads.map((thread) => (
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
          ))}
        </ul>
      </div>

      <div className="sign">
        <p>Promptly</p>
      </div>
    </section>
  );
}
