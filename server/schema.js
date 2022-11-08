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
    "CREATE TABLE login (login_id int NOT NULL AUTO_INCREMENT,email varchar(45) NOT NULL,password varchar(45) NOT NULL,first_name varchar(45) NOT NULL,last_name varchar(45) DEFAULT NULL,address varchar(100) NOT NULL,phone varchar(45) NOT NULL,cell_phone varchar(45) DEFAULT NULL,city varchar(45) NOT NULL,state varchar(45) NOT NULL,zip int NOT NULL,type varchar(45) NOT NULL,eth_adr varchar(100) NOT NULL,bal_usd int DEFAULT NULL,bal_eth int DEFAULT NULL,token_id varchar(100) DEFAULT NULL,PRIMARY KEY (login_id),UNIQUE KEY phone_UNIQUE (phone),KEY token_id_idx (token_id),CONSTRAINT token_id FOREIGN KEY (token_id) REFERENCES nft_list (token_id))";
  var nftTable =
    "CREATE TABLE nft_list (name varchar(45) DEFAULT NULL,token_id varchar(100) NOT NULL,nft_ethadr varchar(100) NOT NULL,price_usd int DEFAULT NULL,price_eth int DEFAULT NULL,is_avl int NOT NULL,PRIMARY KEY (token_id));";
  var nftOwnedTable = 
    "CREATE TABLE nft_owned (token_id varchar(100) NOT NULL, login_id int NOT NULL);";
  con.query(nftTable, function (err, result) {
    console.log("Table created");
  });
  con.query(loginTable, function (err, result) {
    console.log("Table created");
  });
  con.query(nftOwnedTable, function (err, result) {
    console.log("Table created");
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

  var nftOwnedInsert1 = "INSERT INTO nft_owned VALUES(2,1)";
  con.query(nftOwnedInsert1, function (err, result) {
    console.log("Record inserted");
  });

  var nftOwnedInsert2 = "INSERT INTO nft_owned VALUES(3,1)";
  con.query(nftOwnedInsert2, function (err, result) {
    console.log("Record inserted");
  });
});
