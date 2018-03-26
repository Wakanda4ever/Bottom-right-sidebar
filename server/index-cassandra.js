require('newrelic');
const express = require("express");
const app = express();
const cassandra = require('cassandra-driver');
// Development DB
// const client = new cassandra.Client({ contactPoints: ['localhost'], keyspace: 'chompy_bottom_right' });
// Deployed DB
const client = new cassandra.Client({ contactPoints: ['cassandra://database'], keyspace: 'chompy_bottom_right' });
const path = require("path");
// const morgan = require('morgan');

// app.use(morgan('dev'));
app.use(express.static("./client/dist/"));


// const connection = mysql.createConnection({
//   host: "chompy-test-database.cr8yw4uwndba.us-west-1.rds.amazonaws.com",
//   user: "root",
//   database: "chompyremote",
//   password: "chompydatabase"
// });

// connection.connect(function(err) {
//   if (err) {
//     console.log("mySQL ERROR");
//   } else {
//     console.log("mySQL CONNECTED");
//   }
// });

app.get("/sidebar/business/:id", function(req, res) {
  var id = req.params.id;
  let q = `SELECT * FROM restaurants WHERE restaurant_id=${id}`;
  client.execute(q)
    .then(result => res.status(201).send(result.rows[0]))
    .catch((err) => {throw err});
  // connection.query(q, function(err, rows, fields) {
  //   if (err) throw err;
  //   res.status(201).send(rows);
  // });
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
  let q = `SELECT * FROM tips WHERE restaurant_id=${id}`;
  // console.log('q', q);
  client.execute(q)
    .then(result => res.status(201).send(result.rows[0]))
    .catch((err) => {throw err});
  // connection.query(q, function(err, rows, fields) {
  //   if (err) throw err;
  //   res.status(201).send(rows);
  // });
});

app.get("/sidebar/photos/:id", function(req, res) {
  var id = req.params.id;
  let q = `SELECT * FROM photos WHERE restaurant_id=${id} LIMIT 1`;
  client.execute(q)
    .then(result => res.status(201).send(result.rows[0]))
    .catch((err) => {throw err});
  // connection.query(q, function(err, rows, fields) {
  //   if (err) throw error;
  //   res.status(201).send(rows);
  // });
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
