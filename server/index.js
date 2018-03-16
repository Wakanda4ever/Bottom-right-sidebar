const express = require("express");
const app = express();
const mysql = require("mysql");
const path = require("path");

app.use(express.static("./client/dist/"));

const connection = mysql.createConnection({
  host: "chompy-test-database.cr8yw4uwndba.us-west-1.rds.amazonaws.com",
  user: "root",
  database: "chompyremote",
  password: "chompydatabase"
});

connection.connect(function(err) {
  if (err) {
    console.log("mySQL ERROR");
  } else {
    console.log("mySQL CONNECTED");
  }
});

app.get("/sidebar/business/:id", function(req, res) {
  var id = req.params.id;
  let q = `SELECT * FROM business WHERE id = "${id}"`;
  connection.query(q, function(err, rows, fields) {
    if (err) throw err;
    res.status(201).send(rows);
  });
});

app.get("/sidebar/postalCode/:code", function(req, res) {
  var postalCode = req.params.code;
  let q = `SELECT * FROM business WHERE postal_code="${postalCode}" AND review_count > 200 LIMIT 4`;
  connection.query(q, function(err, rows, fields) {
    if (err) throw err;
    res.status(201).send(rows);
  });
});

app.get("/sidebar/businessTips/:id", function(req, res) {
  var id = req.params.id;
  let q = `SELECT * FROM tip WHERE business_id="${id}" LIMIT 1`;
  connection.query(q, function(err, rows, fields) {
    if (err) throw err;
    res.status(201).send(rows);
  });
});

app.get("/sidebar/photos/:id", function(req, res) {
  var id = req.params.id;
  let q = `SELECT * FROM photo WHERE business_id="${id}" LIMIT 1`;
  connection.query(q, function(err, rows, fields) {
    if (err) throw error;
    res.status(201).send(rows);
  });
});

app.get("/:id", (req, res) => {
  res.sendFile(path.join(__dirname + "/../client/dist/index.html"));
});

const PORT = 3010;

app.listen(PORT, function() {
  console.log(`Listening on port ${PORT}`);
});
