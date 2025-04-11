import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span>❄️ FrigoTrack</span>
          <button className="menu-toggle" onClick={toggleMenu}>
            <span className="hamburger"></span>
          </button>
        </div>

        <ul className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <li>
            <NavLink to="/" end>
              Početna
            </NavLink>
          </li>
          <li>
            <NavLink to="/rooms" end>
              Hladnjače
            </NavLink>
          </li>
          <li>
            <NavLink to="/partners" end>
              Partneri
            </NavLink>
          </li>
          <li>
            <NavLink to="/products" end>
              Proizvodi
            </NavLink>
          </li>
          <li>
            <NavLink to="/documents" end>
              Dokumenta
            </NavLink>
          </li>
          <li>
            <NavLink to="/payments" end>
              Plaćanja
            </NavLink>
          </li>
          <li>
            <NavLink to="/stats" end>
              Statistika
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
