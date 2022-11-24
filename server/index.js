const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mysql = require("mysql");

var ethers = require("ethers");
var crypto = require("crypto");
const { resolve } = require("path");
var id = crypto.randomBytes(32).toString("hex");
var privateKey = "0x" + id;

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "tanmay",
  database: "mydb",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/login", (req, res) => {
  const sqlSelect = "SELECT * FROM login;";
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

app.post("/api/updateBal", async (req, res) => {
  const userEmail = req.body.userEmail;
  const addMoney = req.body.addMoney;

  // Get the id of buyer
  const getLoginID = "SELECT login_id from login WHERE email = ?;";
  let login_id;
  login_id = await new Promise((resolve, error) => {
    db.query(getLoginID, [userEmail], (err, result) => {
      login_id = result[0].login_id;
      resolve(login_id);
    });
  });

  //Update the balance
  const sqlUpdate =
    "UPDATE login SET bal_usd = bal_usd + ?  WHERE (email = ?);";
  db.query(sqlUpdate, [addMoney, userEmail], (err, result) => {
    console.log(err);
  });

  //Log this transaction
  const transaction = "INSERT INTO trans VALUES (?,?,?,?,?,?,?,?,?);";
  db.query(
    transaction,
    [
      0,
      login_id,
      null,
      null,
      "xxxx",
      new Date().toISOString().slice(0, 19).replace("T", " "),
      "Added Money",
      0,
      addMoney,
    ],
    (err, result) => {
      console.log(err);
    }
  );
});

app.post("/api/updateETH", async (req, res) => {
  const userEmail = req.body.userEmail;
  const addEth = req.body.addEth;

  // Get the id of buyer
  const getLoginID = "SELECT login_id from login WHERE email = ?;";
  let login_id;
  login_id = await new Promise((resolve, error) => {
    db.query(getLoginID, [userEmail], (err, result) => {
      login_id = result[0].login_id;
      resolve(login_id);
    });
  });

  // Get the balance of buyer
  const getBalance = "SELECT bal_usd from login WHERE email = ?;";
  let bal_usd;
  bal_usd = await new Promise((resolve, error) => {
    db.query(getBalance, [userEmail], (err, result) => {
      bal_usd = result[0].bal_usd;
      resolve(bal_usd);
    });
  });
  if (bal_usd >= 50 * addEth) {
    //Update the balance
    const sqlUpdate =
      "UPDATE login SET bal_eth = bal_eth + ?  WHERE (email = ?);";
    db.query(sqlUpdate, [addEth, userEmail], (err, result) => {
      console.log(err);
    });

    const sqlUpdate1 =
      "UPDATE login SET bal_usd = bal_usd - (50*?)   WHERE (email = ?);";
    db.query(sqlUpdate1, [addEth, userEmail], (err, result) => {
      console.log(err);
    });

    //Log this transaction
    const transaction = "INSERT INTO trans VALUES (?,?,?,?,?,?,?,?,?);";
    db.query(
      transaction,
      [
        0,
        login_id,
        null,
        null,
        "xxxx",
        new Date().toISOString().slice(0, 19).replace("T", " "),
        "Added ETH",
        0,
        addEth,
      ],
      (err, result) => {
        console.log(err);
      }
    );
  }
});

app.post("/api/get", async (req, res) => {
  const userEmail = req.body.userEmail;

  // Get the id of buyer
  const getLoginID = "SELECT login_id from login WHERE email = ?;";
  let login_id;
  login_id = await new Promise((resolve, error) => {
    db.query(getLoginID, [userEmail], (err, result) => {
      login_id = result[0].login_id;
      resolve(login_id);
    });
  });

  const sqlSelect = "SELECT * FROM login where login_id=?;";
  db.query(sqlSelect, [login_id], (err, result) => {
    res.send(result);
  });
});

app.post("/api/insert", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const address = req.body.address;
  const phone = req.body.phone;
  const cphone = req.body.cphone;
  const city = req.body.city;
  const state = req.body.state;
  const zip = req.body.zip;
  const type = "GOLD";
  const balance = req.body.balance;

  const sqlInsert =
    "INSERT INTO login (email,password,first_name,last_name,address,phone,cell_phone,city,state,zip,type,eth_adr,bal_usd,bal_eth) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?);";

  db.query(
    sqlInsert,
    [
      email,
      password,
      firstname,
      lastname,
      address,
      phone,
      cphone,
      city,
      state,
      zip,
      type,
      privateKey,
      balance,
      0,
    ],
    (err, result) => {
      console.log(err);
    }
  );
});

app.post("/user", (req, res) => {
  const userEmail = req.body.userEmail;

  const getUserInfo = "SELECT * from login WHERE email = ?;";
  db.query(getUserInfo, [userEmail], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/nft/check", (req, res) => {
  const nft_name = req.body.nft_name;
  const nft_id = req.body.nft_id;
  const com_type = req.body.com_type;
  const login_id = req.body.login_id;
  const type = req.body.type;
  const conv_rate = req.body.conv_rate;
  let rate;

  if (type == "GOLD") {
    if (com_type == "eth") {
      rate = 0.1;
    } else {
      rate = conv_rate * 0.1;
    }
  } else {
    if (com_type == "eth") {
      rate = 0.2;
    } else {
      rate = conv_rate * 0.2;
    }
  }
  //Get the price of NFT
  const getAmt =
    "SELECT price_eth * ? as comm from nft_list where (token_id = ?);";
  db.query(getAmt, [rate, nft_id], (err, result) => {
    res.send(result);
  });
});

app.post("/nft/buy", async (req, res) => {
  const nft_id = req.body.nft_id;
  const com_type = req.body.com_type;
  const login_id = req.body.login_id;
  const bal_usd = req.body.bal_usd;
  const bal_eth = req.body.bal_eth;
  let commission;

  //Get the price of NFT
  const getAmt = "SELECT price_usd from nft_list where (token_id = ?);";
  let amount;
  amount = await new Promise((resolve, error) => {
    db.query(getAmt, [nft_id], (err, result) => {
      amount = result[0].price_usd;
      resolve(amount);
    });
  });

  if (com_type == "usd") {
    //Update the balance of USD
    const updateBal =
      "UPDATE login SET bal_usd = bal_usd - ? WHERE login_id = ?;";
    db.query(updateBal, [amount, login_id], (err, result) => {
      console.log(err);
    });
  } else {
    //Decrement the commission
  }

  //Update the balance of Buyer
  const balUpdate =
    "UPDATE login SET bal_eth = bal_eth - ? - ? WHERE login_id = ?;";
  db.query(balUpdate, [amount, 0], (err, result) => {
    console.log(err);
  });

  //Get the Seller ID
  const sellerId = "SELECT owner_id from nft_list where (token_id = ?);";
  let seller_id;
  seller_id = await new Promise((resolve, error) => {
    db.query(sellerId, [nft_id], (err, result) => {
      seller_id = result[0].owner_id;
      resolve(seller_id);
    });
  });

  //Update the balance of Seller
  const updateSellBal =
    "UPDATE login SET bal_usd = bal_usd + ? WHERE login_id = ?;";
  db.query(updateSellBal, [amount, seller_id], (err, result) => {
    console.log(err);
  });

  //Update the owner of NFT
  const updateOwner = "UPDATE nft_list SET owner_id = ? WHERE (token_id = ?);";
  db.query(updateOwner, [login_id, nft_id], (err, result) => {
    console.log(err);
  });

  //Make the NF available to buy
  const sqlUpdate = "UPDATE nft_list SET is_avl = 0  WHERE (token_id = ?);";
  db.query(sqlUpdate, [nft_id], (err, result) => {
    console.log(err);
  });

  //Log this transaction
  const transaction = "INSERT INTO trans VALUES (?,?,?,?,?,?,?,?,?);";
  db.query(
    transaction,
    [
      0,
      login_id,
      seller_id,
      nft_id,
      "xxxx",
      new Date().toISOString().slice(0, 19).replace("T", " "),
      "Buy",
      0,
      amount,
    ],
    (err, result) => {
      console.log(err);
    }
  );
});

app.post("/nft/get", async (req, res) => {
  const userEmail = req.body.userEmail;

  // Get the id of buyer
  const getLoginID = "SELECT login_id from login WHERE email = ?;";
  let login_id;
  login_id = await new Promise((resolve, error) => {
    db.query(getLoginID, [userEmail], (err, result) => {
      login_id = result[0].login_id;
      resolve(login_id);
    });
  });

  db.query(
    "SELECT token_id,name,price_usd,price_eth FROM nft_list where owner_id=?;",
    [login_id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/trans", async (req, res) => {
  const userEmail = req.body.userEmail;

  // Get the id of buyer
  const getLoginID = "SELECT login_id from login WHERE email = ?;";
  let login_id;
  login_id = await new Promise((resolve, error) => {
    db.query(getLoginID, [userEmail], (err, result) => {
      login_id = result[0].login_id;
      resolve(login_id);
    });
  });

  db.query(
    "SELECT * FROM trans where buyer_id = ? OR seller_id = ?;",
    [login_id, login_id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/man/trans", (req, res) => {
  db.query("SELECT * FROM trans;", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/nft", async (req, res) => {
  const login_id = req.body.login_id;

  db.query(
    "SELECT name,token_id,price_usd,price_eth FROM nft_list where is_avl=1 and owner_id <> ?;",
    [login_id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/nft/sell", async (req, res) => {
  const nft_id = req.body.sellid;
  const userEmail = req.body.userEmail;

  // Get the id of buyer
  const getLoginID = "SELECT login_id from login WHERE email = ?;";
  let login_id;
  login_id = await new Promise((resolve, error) => {
    db.query(getLoginID, [userEmail], (err, result) => {
      login_id = result[0].login_id;
      resolve(login_id);
    });
  });

  const sqlUpdate = "UPDATE nft_list SET is_avl = 1  WHERE (token_id = ?);";
  db.query(sqlUpdate, [nft_id], (err, result) => {
    console.log(err);
  });

  //Get the price of NFT
  const getAmt = "SELECT price_usd from nft_list where (token_id = ?);";
  let amount;
  amount = await new Promise((resolve, error) => {
    db.query(getAmt, [nft_id], (err, result) => {
      amount = result[0].price_usd;
      resolve(amount);
    });
  });

  //Log this transaction
  const transaction = "INSERT INTO trans VALUES (?,?,?,?,?,?,?,?,?);";
  db.query(
    transaction,
    [
      0,
      null,
      login_id,
      nft_id,
      "xxxx",
      new Date().toISOString().slice(0, 19).replace("T", " "),
      "Posted",
      0,
      amount,
    ],
    (err, result) => {
      console.log(err);
    }
  );
});

app.listen(3001, () => {
  console.log("running");
});
