import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useAuth } from "../contexts/AuthContext";
import Axios from "axios";
export default function User() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState([]);
  const userEmail = currentUser.email;

  const loadLogin = async () => {
    Axios.post("http://localhost:3001/user", {
      userEmail: userEmail,
    }).then((response) => {
      setUserData(response.data);
    });
  };
  useEffect(() => {
    loadLogin();
  });
  return (
    <div style={{ color: "white" }}>
      <Navbar />
      <div
        style={{ marginTop: "40px" }}
        className="d-flex justify-content-center align-items-center"
      >
        <h1>
          {userData.map((item, index) => {
            return (
              <>
                {item.first_name}&nbsp;{item.last_name}&nbsp;
                <sup
                  style={{
                    fontFamily: "fantasy",
                    padding: "2px",
                    color: "grey",
                    borderStyle: "dotted",
                    borderRadius: "10px",
                  }}
                >
                  {item.type}
                </sup>
              </>
            );
          })}
        </h1>
      </div>
      <div className="d-flex justify-contents-around align-items-center">
        <div>
          <label>Email: &nbsp;</label>
          <label>
            {userData.map((item, index) => {
              return <>{item.email}</>;
            })}
          </label>
        </div>
        <div>s</div>
      </div>
    </div>
  );
}
