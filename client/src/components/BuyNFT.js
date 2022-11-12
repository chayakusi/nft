import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Axios from "axios";
import { Form, Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import "react-toastify/dist/ReactToastify.css";

const initialState = {
  nft_name: "",
  nft_id: "",
};

export default function BuyNFT() {
  const [state, setState] = useState(initialState);
  const { nft_name, nft_id } = state;
  const [NFTdata, setNFTData] = useState([]);
  const { currentUser } = useAuth();
  const userEmail = currentUser.email;
  const navigate = useNavigate();

  const loadNFT = async () => {
    const response = await Axios.get("http://localhost:3001/nft");
    setNFTData(response.data);
  };

  useEffect(() => {
    loadNFT();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleBuy = (e) => {
    e.preventDefault();
    let valid = false;
    NFTdata.forEach((item, index) => {
      if (item.name === nft_name && item.token_id === nft_id) valid = true;
    });
    if (!nft_name || !nft_id || !valid) {
      alert("Check your values");
    } else {
      Axios.post("http://localhost:3001/nft/buy", {
        nft_name: nft_name,
        nft_id: nft_id,
        userEmail: userEmail,
      }).then(() => {
        setState({ nft_name: "", nft_id: "" });
      });

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
        <h1>Are You Ready to Buy!!</h1>
      </div>
      <div className="d-flex justify-content-center align-items-center flex-column">
        <h3>Choose your next happiness!!</h3>
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
          <h2 className="text-center mb-4">Enter Name and ID to buy:</h2>
          <Form onSubmit={handleBuy}>
            <Form.Group className="mb-3">
              <Form.Label className="d-flex justify-content-center align-items-center">
                Name
              </Form.Label>
              <Form.Control
                id="nft_name"
                name="nft_name"
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
                id="nft_id"
                name="nft_id"
                onChange={handleInputChange}
                type="number"
                placeholder="Enter ID"
              />
            </Form.Group>

            <Button className="w-100" type="submit">
              Buy
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
}
