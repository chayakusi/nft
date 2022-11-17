import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Axios from "axios";
import { Form, Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const initialState = {
  nft_name: "",
  nft_id: "",
  com_type: ""
};

export default function BuyNFT() {
  const [state, setState] = useState(initialState);
  const { nft_name, nft_id, com_type } = state;
  const [userData, setUserData] = useState([]);
  const [NFTdata, setNFTData] = useState([]);
  const [convRate, setConvRate] = useState(0);
  const { currentUser } = useAuth();
  const userEmail = currentUser.email;
  const navigate = useNavigate();

  const getConvRate = () => {
    axios.get("https://api.coinbase.com/v2/prices/BTC-USD/buy")
    .then((res) => {
      console.log(parseInt(res.data.data.amount, 10));
      setConvRate(parseInt(res.data.data.amount, 10));
    },
    (err) => {
      console.log(err);
    })
  }

  const loadNFT = async () => {
    console.log("here");
    const response = await Axios.post("http://localhost:3001/nft", {
      login_id: userData[0].login_id,
    });
    setNFTData(response.data);
  };

  useEffect(() => {
    Axios.post("http://localhost:3001/user", {
      userEmail: userEmail,
    }).then((response) => {
      setUserData(response.data);
    }, (err) => {
      console.log(err);
    }).then(() => {
      // let login_id, bal_usd, bal_eth;
      // login_id = userData[0].login_id;
      // bal_usd = userData[0].bal_usd;
      // bal_eth = userData[0].bal_eth;
      console.log(userData);
      loadNFT();
    })
    getConvRate();
    console.log(convRate);
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
    if (!nft_name || !nft_id || !com_type || !valid) {
      alert("Check your values");
    } else {
      if((com_type == "usd" && userData[0].bal_usd < 0) || (com_type == "eth" && userData[0].bal_eth < 0)) {
        alert("Balance is insufficient to proceed");
      } else {
        Axios.post("http://localhost:3001/nft/buy", {
        nft_name: nft_name,
        nft_id: nft_id,
        com_type: com_type,
        login_id: userData[0].login_id,
        bal_usd: userData[0].bal_usd,
        bal_eth: userData[0].bal_eth
      }).then(() => {
        setState({ nft_name: "", nft_id: "", com_type: "" });
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ margin: "20px", color: "white" }}
      >
        <h1>Are You Ready to Buy??</h1>
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
            <Form.Group className="mb-3">
              <Form.Label className="d-flex justify-content-center align-items-center">
                How do you want to pay the transaction fee?
              </Form.Label>
              <Form.Check
                name="com_type"
                value="usd"
                type="radio"
                aria-label="radio 1"
                label="USD"
                onChange={handleInputChange}
                checked={com_type === "usd"}
              />
              <Form.Check
                name="com_type"
                value="eth"
                type="radio"
                aria-label="radio 2"
                label="Ethereum"
                onChange={handleInputChange}
                checked={com_type === "eth"}
              />
            </Form.Group>

              <Button className="w-100" type="submit">
                Buy
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
