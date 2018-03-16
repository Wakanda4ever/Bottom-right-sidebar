const mysql = require('mysql');
const fs = require('fs');
const connection = require('./index.js');
const businesses = fs.createReadStream('./businesses.csv');
const photos = fs.createReadStream('./photos.csv');
const tips = fs.createReadStream('./tips.csv');


connection.query('SELECT * FROM restaurants', (err, res) => {
  if (err) {
    throw err;
  }
  console.log(res);
});

connection.end();
