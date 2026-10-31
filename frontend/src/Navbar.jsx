
import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="navbar">
      <span>Promptly</span>

      <button
        className="profile-btn"
        aria-label="Profile"
        aria-expanded={isOpen}
        onClick={handleProfileClick}
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
