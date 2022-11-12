import React from "react";
import Signup from "./components/Signup";

import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";
import BuyNFT from "./components/BuyNFT";
import SellNFT from "./components/SellNFT";
import Manlogin from "./components/Manlogin";
import Trans from "./components/Trans";

function App() {
  return (
    <div className="gradient-bg-welcome">
      <Router>
        <AuthProvider>
          <Routes>
            {/* <PrivateRoute exact path="/" element={<Dashboard/>} /> */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/buynft" element={<BuyNFT />} />
            <Route path="/sellnft" element={<SellNFT />} />
            <Route path="/manlogin" element={<Manlogin />} />
            <Route path="/trans" element={<Trans />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
