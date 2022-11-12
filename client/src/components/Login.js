import React, { useRef, useState } from "react";
import { Form, Button, Card, FormControl, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import "../css/Login.css";
export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/dashboard");
    } catch {
      setError("Failed to log in");
    }

    setLoading(false);
  }

  return (
    <div className="login">
      <div style={{ marginLeft: "800px" }}>
        <Container
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="w-100" style={{ maxWidth: "600px" }}>
            <Card
              className="login_card"
              style={{
                backgroundColor: "transparent",
                color: "black",
                borderRadius: "20px",
                padding: "40px",
              }}
            >
              <Card.Body>
                {/* <h2 className="text-center mb-4">Log In</h2> */}
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group
                    id="emailRef"
                    className="mb-3"
                    controlId="formGridEmail"
                  >
                    <Form.Label
                      style={{
                        padding: "10px",
                        fontWeight: "bold",
                        fontSize: "20px",
                      }}
                      className="d-flex justify-content-center align-items-center"
                    >
                      Email Address
                    </Form.Label>
                    <Form.Control
                      className="login_input"
                      style={{
                        borderRadius: "50px",
                        height: "50px",
                      }}
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
                    <Form.Label
                      style={{
                        padding: "5px",
                        fontWeight: "bold",
                        fontSize: "20px",
                      }}
                      className="d-flex justify-content-center align-items-center"
                    >
                      Password
                    </Form.Label>
                    <Form.Control
                      className="login_input"
                      style={{
                        borderRadius: "50px",
                        height: "50px",
                      }}
                      type="password"
                      ref={passwordRef}
                      placeholder="Enter Password"
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-center align-items-center">
                    <Button
                      className="login_button"
                      style={{
                        borderRadius: "50px",
                        height: "50px",
                        marginTop: "25px",
                        width: "50%",
                      }}
                      disabled={loading}
                      variant="primary"
                      type="submit"
                    >
                      Log IN
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
            <div style={{ padding: "10px" }} className="d-flex flex-row">
              <div>
                Need an Account? <Link to="/signup">Sign Up</Link>
              </div>
              <div style={{ marginLeft: "auto", marginRight: "0" }}>
                Manager? <Link to="/manlogin">Login</Link>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
