import { useContext } from "react";

import "./InputBox.css";
import { MyContext } from "./MyContext.jsx";

export default function Inputbox() {
  const { prompt, setPrompt, getReply, isLoading } =
    useContext(MyContext);

  return (
    <form
      className="inputbox"
      onSubmit={(event) => {
        event.preventDefault();
        getReply();
      }}
    >
      <button
        type="button"
        className="input-btn attachment-btn"
        aria-label="Add attachment"
        disabled
        title="Attachments are not available yet"
      >
        <i className="fa-solid fa-plus" aria-hidden="true" />
      </button>

      <input
        type="text"
        value={prompt}
        placeholder="Ask Promptly anything..."
        aria-label="Message"
        onChange={(event) => setPrompt(event.target.value)}
        disabled={isLoading}
      />

      <button
        type="submit"
        className="input-btn send-btn"
        aria-label="Send message"
        disabled={isLoading || !prompt.trim()}
      >
        <i className="fa-solid fa-arrow-up" aria-hidden="true" />
      </button>
    </form>
  );
}