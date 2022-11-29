const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mysql = require("mysql2");

var ethers = require("ethers");
var crypto = require("crypto");
const { resolve } = require("path");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Chaya@sql123",
  database: "mydb"
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

app.post("/api/addNFT", async (req, res) => {
  const userEmail = req.body.userEmail;
  const nftname = req.body.nftname;
  const nftprice = req.body.nftprice;
  const convRate = req.body.convRate;
  let priceusd = nftprice * convRate;
  var id = crypto.randomBytes(32).toString("hex");
  var privateKey = "0x" + id;

  // Get the max Token Id
  const getTokenId = "SELECT max(token_id) as token_id from nft_list;";
  let t;
  t = await new Promise((resolve, error) => {
    db.query(getTokenId, (err, result) => {
      t = result[0].token_id;
      resolve(t);
    });
  });
  t = Number(t) + 1;
  //Add the NFT
  const sqlAdd = "INSERT INTO nft_list VALUES (?,?,100,?,?,1);";
  db.query(
    sqlAdd,
    [nftname, t, privateKey, nftprice],
    (err, result) => {
      console.log(err);
    }
  );
});

app.post("/cancel", (req, res) => {
  const trans_id = req.body.trans_id;
  const buyer_id = req.body.buyer_id;
  const seller_id = req.body.seller_id;
  const nft_id = req.body.token_id;
  const com_type = req.body.com_type;
  const com_paid = req.body.com_paid;
  const value = req.body.value;
  const status = req.body.status;
  const convRate = req.body.convRate;
console.log(status);
  if(status == "Added Money") {
    const updateBal = "UPDATE login SET bal_usd = bal_usd - ? WHERE login_id = ?;";
    db.query(
      updateBal,
      [value, buyer_id],
      (err, result) => {
        console.log(err);
      }
    );
  } else if(status == "Add ETH") {
    const updateBal = "UPDATE login SET bal_eth = bal_eth - ? WHERE login_id = ?;";
    db.query(
      updateBal,
      [value, buyer_id],
      (err, result) => {
        console.log(err);
      }
    );
    const updateBalUSD = "UPDATE login SET bal_usd = bal_usd + ? WHERE login_id = ?;";
    db.query(
      updateBalUSD,
      [value * convRate, buyer_id],
      (err, result) => {
        console.log(err);
      }
    );
  } else if(status === "Buy") {
    //Update balance of buyer
    if(com_type == "usd") {
      const updateBal = "UPDATE login SET bal_usd = bal_usd + ? WHERE login_id = ?;";
      db.query(
        updateBal,
        [value + com_paid, buyer_id],
        (err, result) => {
          console.log(result);
          console.log(err);
        }
      );
    } else {
      console.log("Buy ETH");
      const updateBal = "UPDATE login SET bal_eth = bal_eth + ? WHERE login_id = ?;";
      db.query(
        updateBal,
        [value + com_paid, buyer_id],
        (err, result) => {
          console.log(err);
        }
      );
    }
    //Update balance of Seller
    const updateBal = "UPDATE login SET bal_usd = bal_usd - ? WHERE login_id = ?;";
    db.query(
      updateBal,
      [value, seller_id],
      (err, result) => {
        console.log(err);
      }
    );
    //Update owner of NFT and make it available
    const updateOwner = "UPDATE nft_list SET owner_id = ? WHERE token_id = ?;";
    db.query(
      updateOwner,
      [seller_id, nft_id],
      (err, result) => {
        console.log(err);
      }
    );
    const makeAvailable = "UPDATE nft_list SET is_avl = 1 WHERE token_id = ?;";
    db.query(
      makeAvailable,
      [nft_id],
      (err, result) => {
        console.log(err);
      }
    );
  } else {
    // Cancel Sell operation
    const cancelSell = "UPDATE nft_list SET is_avl = 0 WHERE token_id = ?;";
    db.query(
      cancelSell,
      [nft_id],
      (err, result) => {
        console.log(err);
      }
    );
  }
  const delTrans = "DELETE FROM trans WHERE trans_id = ?;";
  db.query(
    delTrans,
    [trans_id],
    (err, result) => {
      console.log(err);
    }
  );
})

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
  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
  //Log this transaction
  const transaction = "INSERT INTO trans VALUES (?,?,?,?,?,?,?,?,?,?);";
  db.query(
    transaction,
    [
      0,
      login_id,
      null,
      null,
      "xxxx",
      localISOTime,
      "xxxx",
      0,
      addMoney,
      "Added Money",
    ],
    (err, result) => {
      console.log(err);
    }
  );
});

app.post("/api/updateETH", async (req, res) => {
  const userEmail = req.body.userEmail;
  const addEth = parseInt(req.body.addEth);
  const convRate = req.body.convRate;

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
  if (bal_usd >= convRate * addEth) {
    //Update the balance
    const sqlUpdate =
      "UPDATE login SET bal_eth = bal_eth + ?  WHERE (email = ?);";
    db.query(sqlUpdate, [addEth, userEmail], (err, result) => {
      console.log(err);
    });

    const sqlUpdate1 =
      "UPDATE login SET bal_usd = bal_usd - (?*?)   WHERE (email = ?);";
    db.query(sqlUpdate1, [convRate, addEth, userEmail], (err, result) => {
      console.log(err);
    });
    
  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    //Log this transaction
    const transaction = "INSERT INTO trans VALUES (?,?,?,?,?,?,?,?,?,?);";
    db.query(
      transaction,
      [
        0,
        login_id,
        null,
        null,
        "xxxx",
        localISOTime,
        "xxxx",
        0,
        addEth,
        "Add ETH",
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
  const type = "SILVER";
  const balance = req.body.balance;

  var id = crypto.randomBytes(32).toString("hex");
  var privateKey = "0x" + id;

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
  const nft_id = req.body.nft_id;
  const com_type = req.body.com_type;
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
    console.log(result);
    res.send(result);
  });
});

app.post("/nft/buy", async (req, res) => {
  const nft_id = req.body.nft_id;
  const com_type = req.body.com_type;
  const login_id = req.body.login_id;
  const commission = req.body.commission;
  const conv_rate = req.body.conv_rate;
  let amount;

  //Get the ETH price of NFT
  const getAmt = "SELECT price_eth from nft_list where (token_id = ?);";
  amount = await new Promise((resolve, error) => {
    db.query(getAmt, [nft_id], (err, result) => {
      amount = result[0].price_eth;
      resolve(amount);
    });
  });

  if (com_type == "usd") {
    //Update the balance of USD
    amount = amount * conv_rate;
    const updateBal =
      "UPDATE login SET bal_usd = bal_usd - ? - ? WHERE login_id = ?;";
    db.query(updateBal, [amount, commission, login_id], (err, result) => {
      console.log(err);
    });
  } else {
    //Update the balance of ETH
    const updateBal =
      "UPDATE login SET bal_eth = bal_eth - ? - ? WHERE login_id = ?;";
    db.query(updateBal, [amount, commission, login_id], (err, result) => {
      console.log(err);
    });
  }

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
  //Get the nft addr of NFT
  const getNftAddr = "SELECT nft_ethadr from nft_list where (token_id = ?);";
  nftaddr = await new Promise((resolve, error) => {
    db.query(getNftAddr, [nft_id], (err, result) => {
      nftaddr = result[0].nft_ethadr;
      resolve(nftaddr);
    });
  });
  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
  //Log this transaction
  const transaction = "INSERT INTO trans VALUES (?,?,?,?,?,?,?,?,?,?);";
  db.query(
    transaction,
    [
      0,
      login_id,
      seller_id,
      nft_id,
      nftaddr,
      localISOTime,
      com_type,
      commission,
      amount,
      "Buy",
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
    "SELECT token_id,name,price_eth FROM nft_list where owner_id=?;",
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

app.post("/man/trans", (req, res) => {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  db.query(
    "SELECT * FROM trans where date >= ? and date <= ?;",
    [startDate, endDate],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/nft", async (req, res) => {
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
    "SELECT name,token_id,price_eth FROM nft_list where is_avl=1 and owner_id <> ?;",
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
  const getAmt = "SELECT price_eth from nft_list where (token_id = ?);";
  let amount;
  amount = await new Promise((resolve, error) => {
    db.query(getAmt, [nft_id], (err, result) => {
      amount = result[0].price_eth;
      resolve(amount);
    });
  });
  //Get the nft addr of NFT
  const getNftAddr = "SELECT nft_ethadr from nft_list where (token_id = ?);";
  nftaddr = await new Promise((resolve, error) => {
    db.query(getNftAddr, [nft_id], (err, result) => {
      nftaddr = result[0].nft_ethadr;
      resolve(nftaddr);
    });
  });
  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
  //Log this transaction
  const transaction = "INSERT INTO trans VALUES (?,?,?,?,?,?,?,?,?,?);";
  db.query(
    transaction,
    [
      0,
      null,
      login_id,
      nft_id,
      nftaddr,
      localISOTime,
      "xxxx",
      0,
      amount,
      "Posted",
    ],
    (err, result) => {
      console.log(err);
    }
  );
});

app.listen(3001, () => {
  console.log("running");
});
