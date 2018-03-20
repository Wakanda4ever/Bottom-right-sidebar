const express = require("express");
const app = express();
const mysql = require("mysql");
const path = require("path");
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(express.static("./client/dist/"));


const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "chompy_bottom_right",
  // password: "chompydatabase"
});
// const connection = mysql.createConnection({
//   host: "chompy-test-database.cr8yw4uwndba.us-west-1.rds.amazonaws.com",
//   user: "root",
//   database: "chompyremote",
//   password: "chompydatabase"
// });

connection.connect(function(err) {
  if (err) {
    console.log("mySQL ERROR");
  } else {
    console.log("mySQL CONNECTED");
  }
});

app.get("/sidebar/business/:id", function(req, res) {
  var id = req.params.id;

  let q = `SELECT * FROM restaurants WHERE restaurant_id = "${id}"`;
  connection.query(q, function(err, rows, fields) {
    if (err) throw err;
    res.status(201).send(rows[0]);
  });
});

// app.get("/sidebar/postalCode/:code", function(req, res) {
//   var postalCode = req.params.code;
//   let q = `SELECT * FROM restaurants WHERE postal_code="${postalCode}" AND review_count > 200 LIMIT 4`;
//   connection.query(q, function(err, rows, fields) {
//     if (err) throw err;
//     res.status(201).send(rows);
//   });
// });

app.get("/sidebar/businessTips/:id", function(req, res) {
  var id = req.params.id;
  let q = `SELECT * FROM tips WHERE restaurant_id="${id}" LIMIT 1`;
  connection.query(q, function(err, rows, fields) {
    if (err) throw err;
    res.status(201).send(rows[0]);
  });
});

app.get("/sidebar/photos/:id", function(req, res) {
  var id = req.params.id;
  let q = `SELECT * FROM photos WHERE restaurant_id="${id}" LIMIT 1`;
  connection.query(q, function(err, rows, fields) {
    if (err) throw error;
    res.status(201).send(rows[0]);
  });
});

app.get('/loading.gif', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../loading.gif`));
});

app.get("/:id", (req, res) => {
  res.sendFile(path.join(__dirname + "/../client/dist/index.html"));
});

const PORT = 3010;

app.listen(PORT, function() {
  console.log(`Listening on port ${PORT}`);
});
