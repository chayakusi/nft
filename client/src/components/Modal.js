import React, { useState } from "react";
import { Button } from "react-bootstrap";
import "../css/Modal.css";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
function Modal({ setOpenModal }) {
  const { currentUser } = useAuth();
  const userEmail = currentUser.email;
  const [addMoney, setAddMoney] = useState("");

  const updateBalance = (e) => {
    e.preventDefault();
    if (addMoney <= 0) {
      alert("Enter correct value");
    } else {
      axios.post("http://localhost:3001/api/updateBal", {
        userEmail: userEmail,
        addMoney: addMoney,
      });
      alert("Money successfully added!!");
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
          <h1>How much money??</h1>
          <h1>🤑</h1>
        </div>
        <div style={{ marginTop: "40px" }} className="body">
          <input
            onChange={(e) => {
              setAddMoney(e.target.value);
            }}
            type="number"
            min="1"
            required
          />
        </div>
        <div className="footer">
          <Button onClick={updateBalance}>Add</Button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
