import React, { useState } from "react";
import { Card, Button, Alert, Navbar } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Navbar1 from "./Navbar";
import Welcome from "./Welcome";
export default function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  // const navigate = useNavigate()

  // async function handleLogout() {
  //   setError("")

  //   try {
  //     await logout()
  //     navigate('/')
  //   } catch {
  //     setError("Failed to log out")
  //   }
  // }

  return (
    <div className="dash">
      <Navbar1 />
      {error && <Alert variant="danger">{error}</Alert>}
      <strong>Email:</strong> {currentUser.email}
      <Welcome />
    </div>
  );
}
