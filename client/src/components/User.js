import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useAuth } from "../contexts/AuthContext";
import Axios from "axios";
import "../css/User.css";
import user from "../photos/user.jpg";
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
    <>
      <Navbar />

      <div className="container mt-5 ">
        <div className="row d-flex justify-content-center">
          <div className="col-md-7">
            <div
              style={{ color: "white", backgroundColor: "transparent" }}
              className=" card p-3 py-4"
            >
              <div className="text-center">
                <img
                  src={user}
                  alt="userimage"
                  width="100"
                  className="rounded-circle"
                />
              </div>

              <div className="text-center mt-3">
                <span className="bg-secondary p-1 px-2 rounded text-white">
                  {userData.map((item, index) => {
                    return <>{item.type}</>;
                  })}
                </span>
                <h5 style={{ fontSize: "30px" }} className="mt-2 mb-0">
                  {userData.map((item, index) => {
                    return (
                      <>
                        {item.first_name}&nbsp;{item.last_name}&nbsp;
                      </>
                    );
                  })}
                </h5>
                <div>
                  <span>
                    {userData.map((item, index) => {
                      return <>{item.eth_adr}</>;
                    })}
                  </span>
                </div>
                <span style={{ fontWeight: "bold" }}>
                  {userData.map((item, index) => {
                    return <>{item.email}</>;
                  })}
                </span>

                <div
                  style={{ marginTop: "20px" }}
                  className="d-flex justify-content-around align-items-center flex-row"
                >
                  <div>
                    <div>
                      <i>Address: &nbsp;</i>
                      <span style={{ fontWeight: "bold" }}>
                        {userData.map((item, index) => {
                          return <>{item.address}</>;
                        })}
                      </span>
                    </div>
                    <div className="d-flex justify-content-start">
                      <i>City: &nbsp;</i>
                      <span style={{ fontWeight: "bold" }}>
                        {userData.map((item, index) => {
                          return <>{item.city}</>;
                        })}
                      </span>
                    </div>
                    <div className="d-flex justify-content-start">
                      <i>State: &nbsp;</i>
                      <span style={{ fontWeight: "bold" }}>
                        {userData.map((item, index) => {
                          return <>{item.state}</>;
                        })}
                      </span>
                    </div>
                    <div className="d-flex justify-content-start">
                      <i>Zip: &nbsp;</i>
                      <span style={{ fontWeight: "bold" }}>
                        {userData.map((item, index) => {
                          return <>{item.zip}</>;
                        })}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="d-flex justify-content-start">
                      <i>Phone: &nbsp;</i>
                      <span style={{ fontWeight: "bold" }}>
                        {userData.map((item, index) => {
                          return <>{item.phone}</>;
                        })}
                      </span>
                    </div>
                    <div className="d-flex justify-content-end">
                      <i>Cell Phone: &nbsp;</i>
                      <span style={{ fontWeight: "bold" }}>
                        {userData.map((item, index) => {
                          return (
                            <>
                              {item.phone !== ""
                                ? item.cell_phone
                                : "xxxxxxxxxx"}
                            </>
                          );
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
