import React from "react";
import { Signup } from "./components/Signup";
import { Container } from "react-bootstrap";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter as Router, Route , Routes} from "react-router-dom";
import Landing from "./components/Landing";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return(
    
    <Container className = "d-flex align-items-center justify-content-center" style={{minHeight:"100vh"}}>
    <div className="w-100" style={{maxWidth:"600px"}}>
    <Router>
    <AuthProvider>
        <Routes>
        <PrivateRoute exact path="/" element={<Dashboard/>} />
        {/* <Route exact path='/' element={<Landing/>} /> */}
        <Route path='/signup' element={<Signup/>} />
        <Route path='/login' element={<Login/>} />
        
        </Routes>
    </AuthProvider>
    </Router>
    </div>
    </Container>
  )
}

export default App;
