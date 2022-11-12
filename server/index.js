const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mysql = require("mysql2");

var ethers = require("ethers");
var crypto = require("crypto");
const { resolve } = require("path");
var id = crypto.randomBytes(32).toString("hex");
var privateKey = "0x" + id;

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Chaya@sql123",
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

app.get("/api/get", (req, res) => {
  const sqlSelect = "SELECT * FROM login where login_id=101;";
  db.query(sqlSelect, (err, result) => {
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
    "INSERT INTO login (email,password,first_name,last_name,address,phone,cell_phone,city,state,zip,type,eth_adr,bal_usd) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?);";

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
    ],
    (err, result) => {
      console.log(err);
    }
  );
});

app.post("/nft/buy", async (req, res) => {
  const nft_id = req.body.nft_id;

  // Get the balance of buyer
  const getBal = "SELECT bal_usd from login WHERE login_id = 101;";
  let balance;
  balance = await new Promise((resolve,error) => {
    db.query(getBal, (err, result) => {
      balance = result[0].bal_usd;
      resolve(balance);
      });
  })
  
  //Get the price of NFT
  const getAmt = "SELECT price_usd from nft_list where (token_id = ?);";
  let amount;
  amount = await new Promise((resolve, error) => {
    db.query(getAmt, [nft_id], (err, result) => {
      amount = result[0].price_usd;
      resolve(amount);
    })
  })
 
  if(balance >= amount) {
    //Update the balance of Buyer
    const updateBal = "UPDATE login SET bal_usd = bal_usd - ? WHERE login_id = 101;";
    db.query(updateBal, [amount], (err, result) => {
      console.log(err);
    })

    //Get the Seller ID
    const sellerId = "SELECT owner_id from nft_list where (token_id = ?);";
    let seller_id;
    seller_id = await new Promise((resolve, error) => {
      db.query(sellerId, [nft_id], (err, result) => {
        seller_id = result[0].owner_id;
        resolve(seller_id);
      })
    })
    
    //Update the balance of Seller
    const updateSellBal = "UPDATE login SET bal_usd = bal_usd + ? WHERE login_id = ?;";
    db.query(updateSellBal, [amount, seller_id], (err, result) => {
      console.log(err);
    })

    //Update the owner of NFT
    const updateOwner = "UPDATE nft_list SET owner_id = 101 WHERE (token_id = ?);";
    db.query(updateOwner, [nft_id], (err, result) => {
      console.log(err);
    })

    //Make the NF available to buy
    const sqlUpdate = "UPDATE nft_list SET is_avl = 0  WHERE (token_id = ?);";
    db.query(sqlUpdate, [nft_id], (err, result) => {
      console.log(err);
    });

    //Log this transaction
    const transaction = "INSERT INTO trans VALUES (?,?,?,?,?,?,?,?,?);";
    db.query(transaction, [0, 101, seller_id, nft_id, 'xxxx', new Date().toISOString().slice(0, 19).replace('T', ' '), "Buy", 0, amount], (err, result) => {
      console.log(err);
    });
  }

});

app.get("/nft/get", (req, res) => {
  db.query(
    "SELECT token_id,name,price_usd,price_eth FROM nft_list where owner_id=101;",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/nft", (req, res) => {
  db.query(
    "SELECT name,token_id,price_usd,price_eth FROM nft_list where is_avl=1 and owner_id <> 101;",
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
  db.query(transaction, [0, 100, 101, nft_id, 'xxxx', new Date().toISOString().slice(0, 19).replace('T', ' '), "Posted", 0, amount], (err, result) => {
    console.log(err);
  });

});

app.listen(3001, () => {
  console.log("running");
});
