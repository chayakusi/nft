import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import "../css/Trans.css";

export default function Trans() {
  const [transData, setTransData] = useState([]);
  const { currentUser } = useAuth();
  const userEmail = currentUser.email;
  const [convRate, setConvRate] = useState(0);
  const loadTrans = async () => {
    const response = await axios.post("http://localhost:3001/trans", {
      userEmail: userEmail,
    });
    setTransData(response.data);
  };

  const getConvRate = async () => {
    const response = await axios.get(
      "https://api.coinbase.com/v2/prices/BTC-USD/buy"
    );
    setConvRate(parseInt(response.data.data.amount, 10));
   
  };
  useEffect(() => {
    getConvRate();
  }, []);
  useEffect(() => {
    loadTrans();
  }, []);

  const handleCancel = async (trans_id, buyer_id, seller_id, token_id, com_type, com_paid, value, status) => {
    console.log("nahdlecancel");
    let filtered = transData.filter((data) => data.trans_id != trans_id);
    setTransData(filtered);
    await axios.post("http://localhost:3001/cancel", {
      trans_id,
      buyer_id,
      seller_id,
      token_id,
      com_type,
      com_paid,
      value,
      status,
      convRate
    });
  }

  return (
    <>
      <Navbar />
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ margin: "20px", color: "white" }}
      >
        <h1>Your Transactions</h1>
      </div>
      <div className="d-flex justify-content-center align-items-center flex-column">
        <div style={{ margin: "20px" }}>
          <table className="trans-table">
            <thead>
              <tr>
                <th>Buyer ID</th>
                <th>Seller ID</th>
                <th>Token ID</th>
                <th>NFT ADDRESS</th>
                <th>Date</th>
                <th>Type</th>
                <th>Commision</th>
                <th>Value</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transData.map((item, index) => {
                return (
                  <tr key={item.trans_id}>
                    <td>{item.buyer_id}</td>
                    <td>{item.seller_id}</td>
                    <td>{item.token_id}</td>
                    <td>{item.nft_addr}</td>
                    <td>{item.date}</td>
                    <td>{item.com_type}</td>
                    <td>{item.com_paid}</td>
                    <td>{item.value}</td>
                    <td>{item.status}</td>
                    <td>{Math.abs(new Date() - new Date(item.date)) / (1000 * 60) < 15 && 
                    <Button onClick={() => {
                      handleCancel(item.trans_id, item.buyer_id, item.seller_id, item.token_id, item.com_type, item.com_paid, item.value, item.status)
                    }}>Cancel
                    </Button>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
