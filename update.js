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
  var sql = "UPDATE Catalogs SET stock = '1' WHERE name = 'cage'";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
    var sql = "UPDATE Catalogs SET stock = '1' WHERE name = 'bowl'";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
    var sql = "UPDATE Catalogs SET stock = '1' WHERE name = 'bed'";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});