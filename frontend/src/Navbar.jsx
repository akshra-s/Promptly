import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <span>Promptly</span>

      <button className="profile-btn" aria-label="Profile">
        <i className="fa-solid fa-user"></i>
      </button>
    </header>
  );
}