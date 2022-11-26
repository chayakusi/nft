import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import "../css/Modal.css";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
function Modal1({ setOpenModal }) {
  const { currentUser } = useAuth();
  const userEmail = currentUser.email;
  const [nftname, setNftName] = useState("");
  const [convRate, setConvRate] = useState(0);
  const [nftprice, setNftPrice] = useState("");

  useEffect(() => {
    const getConvRate = async () => {
      const response = await axios.get(
        "https://api.coinbase.com/v2/prices/BTC-USD/buy"
      );
      setConvRate(parseInt(response.data.data.amount, 10));
      // console.log(convRate);
    };

    getConvRate();
  }, []);

  const addNFT = (e) => {
    e.preventDefault();
    if (nftprice.length === 0 || nftname === "") {
      alert("Enter correct value");
    } else {
      axios.post("http://localhost:3001/api/addNFT", {
        userEmail: userEmail,
        nftname: nftname,
        nftprice: nftprice,
        convRate: convRate,
      });

      alert("Successfully added!!");

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
          <h1>Add your NFT details...</h1>
        </div>
        <div style={{ marginTop: "40px" }} className="body">
          <label>NFT Name...</label>
          <input
            placeholder="Enter Name"
            onChange={(e) => {
              setNftName(e.target.value);
            }}
            type="text"
            required
          />
          <label>Price(ETH)...</label>
          <input
            placeholder="Enter Price in ETH"
            onChange={(e) => {
              setNftPrice(e.target.value);
            }}
            type="number"
            required
          />
        </div>
        <div className="footer">
          <Button onClick={addNFT}>Buy</Button>
        </div>
      </div>
    </div>
  );
}

export default Modal1;
