import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Axios from "axios";
import { Form, Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialState = {
  sellname: "",
  sellid: "",
};

export default function SellNFT() {
  const [state, setState] = useState(initialState);
  const { sellname, sellid } = state;
  const [NFTdata, setNFTData] = useState([]);
  const { currentUser } = useAuth();
  const userEmail = currentUser.email;
  const navigate = useNavigate();

  const loadNFT = async () => {
    const response = await Axios.get("http://localhost:3001/nft/get");
    setNFTData(response.data);
  };

  useEffect(() => {
    loadNFT();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSell = (e) => {
    e.preventDefault();
    let valid = false;
    NFTdata.forEach((item, index) => {
      if (item.name === sellname && item.token_id === sellid) valid = true;
    });
    if (!sellname || !sellid || !valid) {
      alert("Check your values");
    } else {
      console.log(sellid, sellname);
      Axios.post("http://localhost:3001/nft/sell", {
        sellname: sellname,
        sellid: sellid,
        userEmail: userEmail,
      })
        .then(() => {
          setState({ sellname: "", sellid: "" });
        })
        .catch((err) => toast.error(err.response.data));
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ margin: "20px" }}
      >
        <h1>Are You Ready to Sell!!</h1>
      </div>
      <div className="d-flex justify-content-center align-items-center flex-column">
        <h3>Enter Name and ID to Sell:</h3>
        <div style={{ margin: "20px" }}>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Token ID</th>
                <th>Price USD</th>
                <th>Price ETH</th>
              </tr>
            </thead>
            <tbody>
              {NFTdata.map((item, index) => {
                return (
                  <tr>
                    <td>{item.name}</td>
                    <td>{item.token_id}</td>
                    <td>{item.price_usd}</td>
                    <td>{item.price_eth}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="w-100" style={{ maxWidth: "600px" }}>
            <h2 className="text-center mb-4">Enter Name and ID to Sell:</h2>
            <Form onSubmit={handleSell}>
              <Form.Group className="mb-3">
                <Form.Label className="d-flex justify-content-center align-items-center">
                  Name
                </Form.Label>
                <Form.Control
                  id="sellname"
                  name="sellname"
                  onChange={handleInputChange}
                  type="name"
                  placeholder="Enter Name"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="d-flex justify-content-center align-items-center">
                  ID
                </Form.Label>
                <Form.Control
                  id="sellid"
                  name="sellid"
                  onChange={handleInputChange}
                  type="number"
                  placeholder="Enter ID"
                />
              </Form.Group>
              <Button className="w-100" type="submit">
                Sell
              </Button>
            </Form>
        </div>
      </div>
    </>
  );
}
