import "./InputBox.css";


export default function Inputbox() {
  return (
    <form
      className="inputbox"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="text"
        placeholder="Ask Promptly anything..."
        aria-label="Message"
      />
    </form>
  );
}
