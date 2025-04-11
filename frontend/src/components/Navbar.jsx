import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";
import { useSelector,useDispatch } from "react-redux";
import { LogOut } from "lucide-react";
import { authActions } from "../store/auth-slice";
export default function Navbar() {
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    setUserInfo(user);
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
          <span>❄️ FrigoTrack</span>
          <span className="user">Korisnik:{userInfo.username}</span>
          <span onClick={()=>logout()} className="logout-btn">
            <LogOut />
          </span>
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
