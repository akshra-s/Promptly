import "./ChatWindow.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";

export default function ChatWindow({ children }) {
  const {
    prompt,
    setPrompt,
    reply,
    prevChats,
    setPrevChats,
  } = useContext(MyContext);

  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);

      setPrompt("");
    }
  }, [reply]);

  return (
    <section className="chat-window">
      {children}

      <p className="disclaimer">
        Promptly can make mistakes. Check important info.
      </p>
    </section>
  );
}