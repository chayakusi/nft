import { React, useState } from "react";
import "../css/Navbar.css";
import { Outlet, Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal2";
const Navbar = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    setError("");

    try {
      await logout();
      navigate("/manlogin");
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
        <li className="nav-links-btn">
          <Button
            style={{ color: "white", textDecoration: "none" }}
            variant="link"
            onClick={() => {
              setModalOpen(true);
            }}
          >
            Add NFT
          </Button>
        </li>
        {modalOpen && <Modal setOpenModal={setModalOpen} />}
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
