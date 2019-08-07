var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "CREATE TABLE DogTables (email VARCHAR(30), owner VARCHAR(30), name VARCHAR(30), age VARCHAR(10), breed VARCHAR(20), color VARCHAR(15), address VARCHAR(40), city VARCHAR(20), state VARCHAR(2), password VARCHAR(20), image VARCHAR(20), audio VARCHAR(20), video VARCHAR(20), loginStatus VARCHAR(1), lastLoginDate VARCHAR(100), lastLogoutDate VARCHAR(100))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});