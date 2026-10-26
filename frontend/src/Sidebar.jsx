
import "./Sidebar.css";
import logo from "./assets/p_logo.png";

export default function Sidebar() {
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

        <button className="new-chat">
          <i className="fa-solid fa-pen-to-square"></i>
          <span>New Chat</span>
        </button>

        <ul className="history">
          <li>Chat 1</li>
          <li>Chat 2</li>
          <li>Chat 3</li>
          <li>Chat 4</li>
        </ul>
      </div>

      <div className="sign">
        <p>Promptly</p>
      </div>
    </section>
  );
}
