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
  nft_price: "Price",
  nft_commission: "Commission",
  nft_total: "Total",
};

export default function BuyNFT() {
  const [state, setState] = useState(initialState);
  const { nft_name, nft_id, nft_price, nft_commission, nft_total } = state;
  const [NFTdata, setNFTData] = useState([]);
  const { currentUser } = useAuth();
  const userEmail = currentUser.email;
  const navigate = useNavigate();

  const loadNFT = async () => {
    const response = await Axios.post("http://localhost:3001/nft", {
      userEmail: userEmail,
    });
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
        style={{ margin: "20px", color: "white" }}
      >
        <h1>Are You Ready to Buy!!</h1>
      </div>
      <div
        style={{ color: "white", marginTop: "100px" }}
        className="d-flex justify-content-around align-items-center"
      >
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
        </div>
        <div>
          <div className="w-100" style={{ maxWidth: "600px" }}>
            <h2 className="text-center mb-4">Enter Name and ID to buy:</h2>
            <Form onSubmit={handleBuy}>
              <Form.Group className="mb-3">
                <Form.Label className="d-flex justify-content-center align-items-center">
                  Name
                </Form.Label>
                <Form.Control
                  autoComplete="off"
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

              <div>
                <Button className="w-100">Check Price</Button>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <div style={{ marginTop: "20px" }}>
                  <label>Commision</label>
                  {["radio"].map((type) => (
                    <div key={`inline-${type}`} className="mb-3">
                      <Form.Check
                        inline
                        label="ETH"
                        name="group1"
                        type={type}
                        id={`inline-${type}-ETH`}
                      />
                      <Form.Check
                        inline
                        label="USD"
                        name="group1"
                        type={type}
                        id={`inline-${type}-USD`}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <input
                    type="number"
                    id="nft_price"
                    name="nft_price"
                    disabled
                    placeholder={nft_price}
                    style={{ backgroundColor: "white" }}
                  ></input>
                  +
                  <input
                    type="number"
                    id="nft_commission"
                    name="nft_commission"
                    disabled
                    placeholder={nft_commission}
                    style={{ backgroundColor: "white" }}
                  ></input>
                  =
                  <div
                    style={{ marginTop: "5px" }}
                    className="d-flex justify-content-center align-items-center"
                  >
                    <input
                      type="number"
                      id="nft_total"
                      name="nft_total"
                      disabled
                      placeholder={nft_total}
                      style={{ backgroundColor: "white" }}
                    ></input>
                  </div>
                </div>
              </div>

              <div>
                <Button className="w-100" type="submit">
                  Buy
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
