import React, { useRef, useState, useEffect } from "react";
import { Form, Button, Card, FormControl, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import "../css/Manlogin.css";
import axios from "axios";

export default function Manlogin() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const mancodeRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState([]);
  const loadLogin = async () => {
    const response = await axios.get("http://localhost:3001/api/login");
    setLoginData(response.data);
  };

  useEffect(() => {
    loadLogin();
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    let valid = false;
    loginData.forEach((item, index) => {
      if (
        item.email === emailRef.current.value &&
        item.mancode == mancodeRef.current.value
      )
        valid = true;
    });
    if (!valid) {
      alert("Not a manager");
    } else {
      try {
        setError("");
        setLoading(true);
        await login(emailRef.current.value, passwordRef.current.value);
        navigate("/manpage");
      } catch {
        setError("Failed to log in");
      }

      setLoading(false);
    }
  }

  return (
    <div className="man_login">
      <div style={{ marginRight: "800px" }}>
        <Container
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="w-100" style={{ maxWidth: "600px" }}>
            <Card
              style={{
                backgroundColor: "transparent",
                color: "white",
                borderStyle: "none",
              }}
            >
              <Card.Body>
                <h2 className="text-center mb-4">Welcome, Manager</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleLogin}>
                  <Form.Group
                    id="emailRef"
                    className="mb-3 "
                    controlId="formGridEmail"
                  >
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      ref={emailRef}
                      placeholder="Enter Email Address"
                    />
                  </Form.Group>

                  <Form.Group
                    id="passwordRef"
                    className="mb-3"
                    controlId="formGridPassword"
                  >
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      ref={passwordRef}
                      placeholder="Enter Password"
                    />
                  </Form.Group>

                  <Form.Group id="mancodeRef" className="mb-3">
                    <Form.Label>Manager Code</Form.Label>
                    <Form.Control
                      type="number"
                      ref={mancodeRef}
                      placeholder="Enter your Manager Code"
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-center align-items-center">
                    <Button
                      style={{
                        marginTop: "20px",
                        backgroundColor: "rgb(82, 95, 241)",
                      }}
                      disabled={loading}
                      className="w-50"
                      variant="primary"
                      type="submit"
                    >
                      Log IN
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
            <div
              style={{ color: "white", marginTop: "10px" }}
              className="d-flex justify-content-center align-items-center"
            >
              Trader? &nbsp;<Link to="/">Login</Link>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
