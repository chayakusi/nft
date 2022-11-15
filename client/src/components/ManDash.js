import React, { useState, useEffect } from "react";
import Navbar from "./Navbar2";
import { Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ManDash() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const [manData, setManData] = useState([]);
  const [loginData, setLoginData] = useState([]);
  const [manname, setManName] = useState("");
  const loadManTrans = async () => {
    const response = await axios.get("http://localhost:3001/man/trans");
    setManData(response.data);
  };
  const loadLogin = async () => {
    const response = await axios.get("http://localhost:3001/api/login");
    setLoginData(response.data);

    loginData.forEach((item, index) => {
      if (item.email === currentUser.email) setManName(item.first_name);
    });
  };

  useEffect(() => {
    loadManTrans();
  }, []);
  useEffect(() => {
    loadLogin();
  });

  return (
    <>
      <Navbar />
      {error && <Alert variant="danger">{error}</Alert>}
      <strong>Email:</strong> {currentUser.email}
      <div
        style={{ margin: "20px", color: "white" }}
        className="d-flex justify-content-center align-items-center"
      >
        <h1>Hello,&nbsp;</h1>
        <h1> {manname}&nbsp;</h1>
      </div>
      <div>
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
                {manData.map((item, index) => {
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
      </div>
    </>
  );
}
