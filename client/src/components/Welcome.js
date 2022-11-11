import React, { useEffect, useState } from "react";
import axios from "axios";
// import Slider from './Slider';
import "../css/Welcome.css";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
export default function Welcome() {
  // const [NFTList, setNFTList] = useState([]);
  // const getHoldings = () => {
  //     Axios.get("http://localhost:3001/nft").then((response) => {
  //       setNFTList(response.data);
  //     });
  //   };

  //nft fetch in single run
  const { currentUser } = useAuth();
  const [NFTdata, setNFTData] = useState([]);
  const [userLogin, setUserLogin] = useState([]);
  const loadNFT = async () => {
    const response = await axios.get("http://localhost:3001/nft/get");
    setNFTData(response.data);
  };

  const loadBalance = async () => {
    const response = await axios.get("http://localhost:3001/api/get");
    setUserLogin(response.data);
  };

  useEffect(() => {
    loadNFT();
  }, []);

  useEffect(() => {
    loadBalance();
  }, []);

  return (
    <>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ padding: "20px" }}
      >
        <div className="d-flex">
          <h1>Welcome,&nbsp;</h1>
          <h1> Tanmay&nbsp;</h1>
        </div>
        <div className="p-4 bg-warning rounded-circle"></div>
      </div>
      <div
        style={{ margin: "10px", fontSize: "30px" }}
        className="d-flex justify-content-center align-items-center flex-row "
      >
        Current Balance: $
        <div>
          {userLogin.map((item, index) => {
            return <>{item.bal_usd}</>;
          })}
        </div>
      </div>

      <div className="d-flex justify-content-center align-items-center flex-column">
        <h3>Your Holdings</h3>
        <div style={{ margin: "20px" }}>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price USD</th>
                <th>Price ETH</th>
              </tr>
            </thead>
            <tbody>
              {NFTdata.map((item, index) => {
                return (
                  <tr>
                    <td>{item.name}</td>
                    <td>{item.price_usd}</td>
                    <td>{item.price_eth}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div
        className="d-flex justify-content-around align-items-center"
        style={{ padding: "20px" }}
      >
        <Link to="/buynft">
          <button className="rounded bg-success" style={{ padding: "10px" }}>
            Buy NFT
          </button>
        </Link>
        <Link to="/sellnft">
          <button className="rounded bg-danger" style={{ padding: "10px" }}>
            Sell NFT
          </button>
        </Link>
      </div>
    </>
  );
}
