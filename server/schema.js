var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "tanmay",
  database: "mydb",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  var loginTable =
    "CREATE TABLE login (login_id int NOT NULL AUTO_INCREMENT,email varchar(45) NOT NULL,password varchar(45) NOT NULL,first_name varchar(45) NOT NULL,last_name varchar(45) DEFAULT NULL,address varchar(100) NOT NULL,phone varchar(45) NOT NULL,cell_phone varchar(45) DEFAULT NULL,city varchar(45) NOT NULL,state varchar(45) NOT NULL,zip int NOT NULL,type varchar(45) NOT NULL,eth_adr varchar(100) NOT NULL,bal_usd int DEFAULT NULL,bal_eth int DEFAULT NULL,token_id varchar(100) DEFAULT NULL,PRIMARY KEY (login_id),UNIQUE KEY phone_UNIQUE (phone),KEY token_id_idx (token_id),CONSTRAINT token_id FOREIGN KEY (token_id) REFERENCES nft_list (token_id))";
  var nftTable =
    "CREATE TABLE nft_list (name varchar(45) DEFAULT NULL,token_id varchar(100) NOT NULL,nft_ethadr varchar(100) NOT NULL,price_usd int DEFAULT NULL,price_eth int DEFAULT NULL,is_avl int NOT NULL,PRIMARY KEY (token_id));";
  con.query(loginTable, function (err, result) {
    console.log("Table created");
  });
  con.query(nftTable, function (err, result) {
    console.log("Table created");
  });
});
