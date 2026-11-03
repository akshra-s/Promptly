
import { useEffect, useRef, useState } from "react";
import "./Navbar.css";

export default function Navbar({
  sidebarOpen,
  toggleSidebar,
  user,
  onLogout,
  theme,
  toggleTheme,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setIsOpen(false);
      onLogout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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

      <div className="profile-container" ref={dropdownRef}>
        <button
          className="profile-btn"
          aria-label="Profile"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <i className="fa-solid fa-user"></i>
        </button>

        {isOpen && (
          <div className="dropDown">
            <div className="profile-email">
              <i className="fa-solid fa-user"></i>
              <span>{user?.email}</span>
            </div>

            <div className="dropdown-divider"></div>

            <button
              className="dropDownItem"
              onClick={() => setIsOpen(false)}
            >
              <i className="fa-solid fa-gear"></i>
              Settings
            </button>

            <button
              className="dropDownItem"
              onClick={() => setIsOpen(false)}
            >
              <i className="fa-solid fa-cloud-arrow-up"></i>
              Upgrade plan
            </button>

            <div className="dropDownItem theme-toggle-row">
              <i
                className={`fa-solid ${
                  theme === "dark" ? "fa-moon" : "fa-sun"
                }`}
              ></i>

              <span>{theme === "dark" ? "Dark mode" : "Light mode"}</span>

              <button
                className={`theme-switch ${
                  theme === "light" ? "active" : ""
                }`}
                onClick={toggleTheme}
                aria-label="Toggle theme"
                role="switch"
                aria-checked={theme === "light"}
              >
                <span></span>
              </button>
            </div>

            <div className="dropdown-divider"></div>

            <button
              className="dropDownItem logout-item"
              onClick={handleLogout}
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
