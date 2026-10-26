
import { useContext } from "react";
import "./Chats.css";
import { MyContext } from "./MyContext.jsx";
import { RingLoader } from "react-spinners";

export default function Chats() {
  const { messages, isLoading } = useContext(MyContext);

  return (
    <div className="chats">
      {messages.length === 0 && (
        <p className="welcome-message">
          Start a conversation with Promptly.
        </p>
      )}

      {messages.map((message, index) => (
        <div
          className={`message ${message.role}`}
          key={index}
        >
          <p>{message.content}</p>
        </div>
      ))}

      {isLoading && (
        <div className="loader" role="status" aria-label="Generating reply">
          <RingLoader color="#36D7B7" size={30} />
        </div>
      )}
    </div>
  );
}
