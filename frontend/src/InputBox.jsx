
import "./InputBox.css";

export default function Inputbox() {
  return (
    <form
      className="inputbox"
      onSubmit={(e) => e.preventDefault()}
    >
      <button type="button" className="input-btn" aria-label="Add attachment">
        <i className="fa-solid fa-square-plus"></i>
      </button>

      <input
        type="text"
        placeholder="Ask Promptly anything..."
        aria-label="Message"
      />

      <button type="submit" className="input-btn" aria-label="Send message">
        <i className="fa-solid fa-paper-plane"></i>
      </button>
    </form>
  );
}
