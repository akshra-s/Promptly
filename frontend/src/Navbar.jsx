
import { useState } from "react";
import "./Navbar.css";

export default function Navbar({ sidebarOpen, toggleSidebar }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="navbar">
      {!sidebarOpen && (
        <button
          className="sidebar-reopen"
          onClick={toggleSidebar}
          aria-label="Open sidebar"
          title="Open sidebar"
        >
          <i className="fa-solid fa-bars"></i>
        </button>
      )}

      <span>Promptly</span>

      <button
        className="profile-btn"
        aria-label="Profile"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="fa-solid fa-user"></i>
      </button>

      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItem">
            <i className="fa-solid fa-gear"></i> Settings
          </div>

          <div className="dropDownItem">
            <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan
          </div>

          <div className="dropDownItem">
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
          </div>
        </div>
      )}
    </header>
  );
}
