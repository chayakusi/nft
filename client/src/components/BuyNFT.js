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
  com_type: "",
};

export default function BuyNFT() {
  const [state, setState] = useState(initialState);
  const { nft_name, nft_id, com_type } = state;
  const [userData, setUserData] = useState([]);
  const [NFTdata, setNFTData] = useState([]);
  const [commission, setCommission] = useState();
  const [convRate, setConvRate] = useState(0);
  const [bal_usd, setBalUSD] = useState(0);
  const [bal_eth, setBalEth] = useState(0);
  const [price_eth, setPriceEth] = useState(0);
  const [login_id, setLoginId] = useState("");
  const [type, setType] = useState("");
  const { currentUser } = useAuth();
  const userEmail = currentUser.email;
  const navigate = useNavigate();

  const loadUser = async () => {
    const response = await axios.get("http://localhost:3001/api/login");
    setUserData(response.data);

    userData.forEach((item, index) => {
      if (item.email === userEmail) {
        setLoginId(item.login_id);
        setType(item.type);
        setBalUSD(item.bal_usd);
        setBalEth(item.bal_eth);
      }
    });
  };

  const getConvRate = async () => {
    const response = await axios.get(
      "https://api.coinbase.com/v2/prices/BTC-USD/buy"
    );
    setConvRate(parseInt(response.data.data.amount, 10));
    console.log(convRate);
  };

  const loadNFT = async () => {
    const response = await Axios.post("http://localhost:3001/nft", {
      userEmail: userEmail,
    });
    setNFTData(response.data);
  };

  useEffect(() => {
    loadUser();
  });

  useEffect(() => {
    loadNFT();
    getConvRate();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
    setCommission();
  };
  const handleCheck = async (e) => {
    e.preventDefault();
    let valid = false;
    NFTdata.forEach((item, index) => {
      if (item.name === nft_name && item.token_id === nft_id) {
        valid = true;
        setPriceEth(item.price_eth);
      }
    });
    if (!nft_name || !nft_id || !com_type || !valid) {
      alert("Check your values");
    } else {
      if (com_type === "usd") {
        getConvRate();
      }
      const response = await Axios.post("http://localhost:3001/nft/check", {
        nft_name: nft_name,
        nft_id: nft_id,
        com_type: com_type,
        login_id: login_id,
        type: type,
        conv_rate: convRate,
      });
      setCommission(parseInt(response.data[0].comm, 10));
    }
  };
  const handleBuy = (e) => {
    e.preventDefault();
    let valid = false;
    NFTdata.forEach((item, index) => {
      if (item.name === nft_name && item.token_id === nft_id) {
        valid = true;
      }
    });
    if (!nft_name || !nft_id || !com_type || !valid) {
      alert("Check your values");
    } else {
      if (
        (com_type === "usd" && bal_usd < price_eth * convRate + commission) ||
        (com_type === "eth" && bal_eth < price_eth + commission)
      ) {
        alert("Balance is insufficient to proceed");
      } else {
        Axios.post("http://localhost:3001/nft/buy", {
          nft_name: nft_name,
          nft_id: nft_id,
          com_type: com_type,
          login_id: login_id,
          commission: commission,
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

                  <th>Price(ETH)</th>
                </tr>
              </thead>
              <tbody>
                {NFTdata.map((item, index) => {
                  return (
                    <tr>
                      <td>{item.name}</td>
                      <td>{item.token_id}</td>

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
              <div className="d-flex justify-content-center align-items-center">
                <div style={{ marginTop: "20px" }}>
                  <label>Commision</label>
                  {["radio"].map((type) => (
                    <div key={`inline-${type}`} className="mb-3">
                      <Form.Check
                        inline
                        onChange={handleInputChange}
                        label="ETH"
                        name="com_type"
                        type={type}
                        id="eth"
                        value="eth"
                      />
                      <Form.Check
                        inline
                        label="USD"
                        name="com_type"
                        type={type}
                        id="usd"
                        value="usd"
                        onChange={handleInputChange}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  Commission Rate is {Math.round(commission * 100) / 100}{" "}
                  {commission !== ""
                    ? com_type === "eth"
                      ? "ETH"
                      : "USD"
                    : ""}
                </div>
              </div>
              <div className=" d-flex justify-content-center align-items-center">
                <Button
                  style={{ backgroundColor: "blue" }}
                  onClick={handleCheck}
                  className="w-50 "
                >
                  Check Commission
                </Button>
              </div>
              <div style={{ marginTop: "10px" }}>
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
