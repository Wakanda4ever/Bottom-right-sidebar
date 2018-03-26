// DO NOT USE, INSTEAD, USE CASSANDRA
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chompy_bottom_right"
});

connection.connect();

module.exports = connection;
