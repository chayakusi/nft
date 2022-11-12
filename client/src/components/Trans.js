import React from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { Form, Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import "../css/Trans.css";

export default function Trans() {
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
              {/* {NFTdata.map((item, index) => {
                return (
                  <tr>
                    <td>{item.name}</td>
                    <td>{item.token_id}</td>
                    <td>{item.price_usd}</td>
                    <td>{item.price_eth}</td>
                  </tr>
                );
              })} */}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
