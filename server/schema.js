var mysql = require("mysql2");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Chaya@sql123",
  database: "mydb",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  var loginTable =
    "CREATE TABLE login (login_id int NOT NULL AUTO_INCREMENT,email varchar(45) NOT NULL,password varchar(45) NOT NULL,first_name varchar(45) NOT NULL,last_name varchar(45) DEFAULT NULL,address varchar(100) NOT NULL,phone varchar(45) NOT NULL,cell_phone varchar(45) DEFAULT NULL,city varchar(45) NOT NULL,state varchar(45) NOT NULL,zip int NOT NULL,type varchar(45) NOT NULL,eth_adr varchar(100) NOT NULL,bal_usd int DEFAULT NULL,bal_eth int DEFAULT NULL,PRIMARY KEY (login_id),UNIQUE KEY phone_UNIQUE (phone));";
  var nftTable =
    "CREATE TABLE nft_list (name varchar(45) DEFAULT NULL,token_id varchar(100) NOT NULL,nft_ethadr varchar(100) NOT NULL,price_usd int DEFAULT NULL,price_eth int DEFAULT NULL,is_avl int NOT NULL,PRIMARY KEY (token_id));";
  var transTable =
    "CREATE TABLE trans (trans_id int NOT NULL AUTO_INCREMENT,buyer_id int DEFAULT NULL,seller_id int DEFAULT NULL,token_id varchar(100) DEFAULT NULL,nft_addr varchar(100) NOT NULL,date date DEFAULT NULL,com_type varchar(45) DEFAULT NULL,com_paid int DEFAULT NULL,value int DEFAULT NULL,PRIMARY KEY (trans_id),KEY buyer_idx (buyer_id),KEY seller_idx (seller_id),KEY nfttoken_idx (token_id),CONSTRAINT buyer FOREIGN KEY (buyer_id) REFERENCES login (login_id),CONSTRAINT nfttoken FOREIGN KEY (token_id) REFERENCES nft_list (token_id),CONSTRAINT seller FOREIGN KEY (seller_id) REFERENCES login (login_id));";
  var nftOwnedTable =
    "CREATE TABLE nft_owned (lid int NOT NULL,tid varchar(100) NOT NULL,name varchar(45) DEFAULT NULL,PRIMARY KEY (lid,tid),KEY token_idx (tid),CONSTRAINT `login` FOREIGN KEY (`lid`) REFERENCES login (login_id),CONSTRAINT token FOREIGN KEY (tid) REFERENCES nft_list (token_id));";

  con.query(nftTable, function (err, result) {
    console.log("NFT_List Table created");
  });

  con.query(loginTable, function (err, result) {
    console.log("Login Table created");
  });

  con.query(nftOwnedTable, function (err, result) {
    console.log("NFT_Owned Table created");
  });

  con.query(transTable, function (err, result) {
    console.log("Trans Table created");
  });

  var nftInsert1 = "INSERT INTO nft_list VALUES ('A',1,1,1,1,1)";
  con.query(nftInsert1, function (err, result) {
    console.log("Record inserted");
  });

  var nftInsert2 = "INSERT INTO nft_list VALUES ('B',2,2,2,2,1)";
  con.query(nftInsert2, function (err, result) {
    console.log("Record inserted");
  });

  var nftInsert3 = "INSERT INTO nft_list VALUES ('C',3,3,3,3,1)";
  con.query(nftInsert3, function (err, result) {
    console.log("Record inserted");
  });

  var nftInsert4 = "INSERT INTO nft_list VALUES ('D',4,4,4,4,1)";
  con.query(nftInsert4, function (err, result) {
    console.log("Record inserted");
  });

  var nftInsert5 = "INSERT INTO nft_list VALUES ('E',5,5,5,5,1)";
  con.query(nftInsert5, function (err, result) {
    console.log("Record inserted");
  });

  var nftOwnedInsert1 = "INSERT INTO nft_owned VALUES(2, 1, 'A')";
  con.query(nftOwnedInsert1, function (err, result) {
    console.log("Record inserted");
  });

  var nftOwnedInsert2 = "INSERT INTO nft_owned VALUES(3, 1, 'A')";
  con.query(nftOwnedInsert2, function (err, result) {
    console.log("Record inserted");
  });
});
