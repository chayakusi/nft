import React, { useState, useEffect } from "react";
import Navbar from "./Navbar2";
import { Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ManDash() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const [manData, setManData] = useState([]);
  const [loginData, setLoginData] = useState([]);
  const [manname, setManName] = useState("");
  const loadManTrans = async () => {
    const response = await axios.post("http://localhost:3001/man/trans", {
      startDate: startDate,
      endDate: endDate,
    });
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
    loadLogin();
  });
  // useEffect(() => {
  //   loadManTrans();
  // },);

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
      <div style={{ color: "white", marginLeft: "50px" }}>
        <h5>Filter by date:</h5>
        {/* <label for="start">Start date:</label> */}
        <input
          onChange={(e) => {
            setStartDate(e.target.value);
          }}
          type="date"
          id="startDate"
          name="startDate"
        />{" "}
        &nbsp;- &nbsp;
        <input
          onChange={(e) => {
            setEndDate(e.target.value);
          }}
          type="date"
          id="endDate"
          name="endDate"
        />
        <Button style={{ marginLeft: "10px" }} onClick={loadManTrans}>
          Filter
        </Button>
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
