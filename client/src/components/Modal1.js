import React, { useState } from "react";
import { Button } from "react-bootstrap";
import "../css/Modal.css";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
function Modal1({ setOpenModal }) {
  const { currentUser } = useAuth();
  const userEmail = currentUser.email;
  const [addEth, setAddEth] = useState("");

  const updateETH = (e) => {
    e.preventDefault();
    if (addEth.length === 0) {
      alert("Enter correct value");
    } else {
      axios.post("http://localhost:3001/api/updateETH", {
        userEmail: userEmail,
        addEth: addEth,
      });
      alert("Successfully traded!!");
      setOpenModal(false);
    }
  };

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            X
          </button>
        </div>
        <div className="title flex-column">
          <h1>How much ETH??</h1>
          <h5>(1 ETH = 50 USD)</h5>
        </div>
        <div style={{ marginTop: "40px" }} className="body">
          <input
            onChange={(e) => {
              setAddEth(e.target.value);
            }}
            type="number"
            min="1"
            max="50"
            required
          />
        </div>
        <div className="footer">
          <Button onClick={updateETH}>Buy</Button>
        </div>
      </div>
    </div>
  );
}

export default Modal1;
