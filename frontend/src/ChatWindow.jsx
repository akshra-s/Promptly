import "./ChatWindow.css";

export default function ChatWindow({ children }) {
  return (
    <section className="chat-window">
      {children}
      <p className="disclaimer">
        Promptly can make mistakes. Check important info.
      </p>
    </section>
  );
}
