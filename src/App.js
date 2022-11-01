import React from "react";
import { Signup } from "./components/Signup";
import { Container } from "react-bootstrap";
function App() {
  return(
    <Container className = "d-flex align-items-center justify-content-center" style={{minHeight:"100vh"}}>
    <div className="w-100" style={{maxWidth:"600px"}}>
    <Signup/>
    </div>
    </Container>
  )
}

export default App;
