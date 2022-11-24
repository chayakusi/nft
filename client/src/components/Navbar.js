import { React, useState } from "react";
import "../css/Navbar.css";
import { Outlet, Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    setError("");

    try {
      await logout();
      navigate("/");
    } catch {
      setError("Failed to log out");
    }
  }

  return (
    <nav className="NavbarItems">
      <h1 className="navbar-logo">
        NTS<i className="fab fa-react"></i>
      </h1>
      <ul className="nav-menu">
        <Link to="/dashboard" style={{ textDecoration: "none" }}>
          <li className="nav-links">Home</li>
        </Link>
        <Link to="/buynft" style={{ textDecoration: "none" }}>
          <li className="nav-links">Buy</li>
        </Link>
        <Link to="/sellnft" style={{ textDecoration: "none" }}>
          <li className="nav-links">Sell</li>
        </Link>
        <Link to="/trans" style={{ textDecoration: "none" }}>
          <li className="nav-links">Transactions</li>
        </Link>
        <Link to="/user" style={{ textDecoration: "none" }}>
          <li className="nav-links">User</li>
        </Link>
        <li className="nav-links-btn">
          <Button
            style={{ color: "white", textDecoration: "none" }}
            variant="link"
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
