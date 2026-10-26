import { useContext, useState } from "react";
import "./Chats.css";
import { MyContext } from "./MyContext.jsx";
import { RingLoader } from "react-spinners";

export default function Chats() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);

  const getReply = async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/chat",
        options
      );

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.error || "Failed to get a reply");
      }

      console.log(res);
      setReply(res.reply);
      setPrompt("");
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chats">
      {!reply && (
        <p>Start a conversation with Promptly.</p>
      )}

      {reply && <div className="reply">{reply}</div>}

      {loading && (
        <div className="loader">
          <RingLoader color="#36D7B7" size={30} />
        </div>
      )}
    </div>
  );
}