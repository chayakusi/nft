import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import "../css/Trans.css";

export default function Trans() {
  const [transData, setTransData] = useState([]);
  const loadTrans = async () => {
    const response = await axios.get("http://localhost:3001/trans");
    setTransData(response.data);
  };

  useEffect(() => {
    loadTrans();
  }, []);

  return (
    <>
      <Navbar />
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ margin: "20px" }}
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
              </tr>
            </thead>
            <tbody>
              {transData.map((item, index) => {
                return (
                  <tr>
                    <td>{item.buyer_id}</td>
                    <td>{item.seller_id}</td>
                    <td>{item.token_id}</td>
                    <td>{item.nft_addr}</td>
                    <td>{item.date}</td>
                    <td>{item.com_type}</td>
                    <td>{item.com_paid}</td>
                    <td>{item.value}</td>
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
