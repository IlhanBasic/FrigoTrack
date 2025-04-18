import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";
import { useSelector, useDispatch } from "react-redux";
import { LogOut } from "lucide-react";
import { authActions } from "../store/auth-slice";

export default function Navbar() {
  const dispatch = useDispatch();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    function handleResize() {
      setIsSmallScreen(window.innerWidth < 480);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  function logout() {
    dispatch(authActions.logout());
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span>❄️ FrigoTrack 🌡</span>
          {!isSmallScreen && (
            <span className="user">Korisnik: {user?.username}</span>
          )}
          <span onClick={logout} className="logout-btn">
            <LogOut />
          </span>
          {isSmallScreen && (
            <button className="menu-toggle" onClick={toggleMenu}>
              <span
                className={`hamburger ${isMenuOpen ? "active" : ""}`}
              ></span>
            </button>
          )}
        </div>

        <ul className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <li>
            <NavLink
              to="/"
              end
              onClick={() => isSmallScreen && setIsMenuOpen(false)}
            >
              Početna
            </NavLink>
          </li>
          {(user.role === "admin" ||
            (user.role === "user" && user.department === "skladište")) && (
            <li>
              <NavLink
                to="/rooms"
                end
                onClick={() => isSmallScreen && setIsMenuOpen(false)}
              >
                Komore
              </NavLink>
            </li>
          )}
          {(user.role === "admin" ||
            (user.role === "user" && user.department === "administracija")) && (
            <li>
              <NavLink
                to="/partners"
                end
                onClick={() => isSmallScreen && setIsMenuOpen(false)}
              >
                Partneri
              </NavLink>
            </li>
          )}
          {(user.role === "admin" ||
            (user.role === "user" && user.department === "skladište")) && (
            <li>
              <NavLink
                to="/products"
                end
                onClick={() => isSmallScreen && setIsMenuOpen(false)}
              >
                Proizvodi
              </NavLink>
            </li>
          )}
          {(user.role === "admin" ||
            (user.role === "user" && user.department === "administracija")) && (
            <li>
              <NavLink
                to="/documents"
                end
                onClick={() => isSmallScreen && setIsMenuOpen(false)}
              >
                Dokumenta
              </NavLink>
            </li>
          )}
          {(user.role === "admin" ||
            (user.role === "user" && user.department === "administracija")) && (
            <li>
              <NavLink
                to="/payments"
                end
                onClick={() => isSmallScreen && setIsMenuOpen(false)}
              >
                Plaćanja
              </NavLink>
            </li>
          )}
          <li>
            <NavLink
              to="/stats"
              end
              onClick={() => isSmallScreen && setIsMenuOpen(false)}
            >
              Statistika
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/assistant"
              end
              onClick={() => isSmallScreen && setIsMenuOpen(false)}
            >
              Asistent
            </NavLink>
          </li>
          {isSmallScreen && (
            <li>
              <span className="user">Korisnik: {user?.username}</span>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
