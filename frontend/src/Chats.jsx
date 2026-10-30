
import { useContext, useState, useEffect } from "react";
import "./Chats.css";
import { MyContext } from "./MyContext.jsx";
import { RingLoader } from "react-spinners";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

export default function Chats() {
  const { prevChats, isLoading, newChat } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);

  useEffect(() => {
    if (prevChats.length === 0) {
      setLatestReply(null);
      return;
    }

    const lastMessage = prevChats[prevChats.length - 1];

    if (lastMessage.role !== "assistant") {
      setLatestReply(null);
      return;
    }

    const words = lastMessage.content.split(" ");
    let idx = 0;

    setLatestReply("");

    const interval = setInterval(() => {
      idx++;
      setLatestReply(words.slice(0, idx).join(" "));

      if (idx >= words.length) {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [prevChats]);

  return (
    <div className="chats">
      {newChat && prevChats.length === 0 && (
        <p className="welcome-message">
          Start a conversation with Promptly.
        </p>
      )}

      {prevChats.map((chat, index) => {
        const isLatest =
          index === prevChats.length - 1 &&
          chat.role === "assistant";

        return (
          <div className={`message ${chat.role}`} key={index}>
            {chat.role === "assistant" ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                  rehypeRaw,
                  rehypeSanitize,
                  rehypeHighlight,
                ]}
              >
                {isLatest && latestReply !== null
                  ? latestReply
                  : chat.content}
              </ReactMarkdown>
            ) : (
              <p>{chat.content}</p>
            )}
          </div>
        );
      })}

      {isLoading && (
        <div className="loader" role="status">
          <RingLoader color="#36D7B7" size={30} />
        </div>
      )}
    </div>
  );
}
