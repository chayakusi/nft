import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import { Form, Button, Card, FormControl, Alert } from "react-bootstrap";

import { Container } from "react-bootstrap";
export default function SellNFT() {
  const [NFTdata, setNFTData] = useState([]);
  const loadNFT = async () => {
    const response = await axios.get("http://localhost:3001/nft/sell");
    setNFTData(response.data);
  };

  useEffect(() => {
    loadNFT();
  }, []);

  return (
    <>
      <Navbar />
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ margin: "20px" }}
      >
        <h1>Are You Ready to Sell!!</h1>
      </div>
      <div className="d-flex justify-content-center align-items-center flex-column">
        <h3>Enter Name and ID to Sell:</h3>
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
          <Card.Body>
            <h2 className="text-center mb-4">Enter Name and ID to Sell:</h2>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="d-flex justify-content-center align-items-center">
                  Name
                </Form.Label>
                <Form.Control type="text" placeholder="Enter Name" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="d-flex justify-content-center align-items-center">
                  ID
                </Form.Label>
                <Form.Control type="number" placeholder="Enter ID" />
              </Form.Group>
              <Button className="w-100" variant="primary">
                Sell
              </Button>
            </Form>
          </Card.Body>
        </div>
      </div>
    </>
  );
}
