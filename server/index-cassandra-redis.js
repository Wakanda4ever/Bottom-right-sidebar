// require('newrelic');

const express = require("express");
const app = express();
const cassandra = require('cassandra-driver');
var redis = require('redis');
var redisClient = redis.createClient({host : 'localhost', port : 6379});
const EXPIRATION_INTERVAL = 360;
// Development DB
const client = new cassandra.Client({ contactPoints: ['localhost'], keyspace: 'chompy_bottom_right' });

// Deployed DB
// const client = new cassandra.Client({ contactPoints: ['172.31.13.166', '172.31.12.58'], keyspace: 'chompy_bottom_right' });


function cache(req, res, next) {
  const id = req.params.id;
  redisClient.get(id, (err, data) => {
    if (err) console.error(err);
    if (data !== null) {
      // console.log(`Redis: id# ${id} found in cache`);
      res.send(data);
    } else {
      // console.log(`Redis: id# ${id} NOT FOUND IN CACHE`);
      next();
    }
  });
}

function cacheTips(req, res, next) {
  const id = req.params.id;
  redisClient.get(`t${id}`, (err, data) => {
    if (err) console.error(err);
    if (data !== null) {
      // console.log(`Redis: id# ${id} found in cache`);
      res.send(data);
    } else {
      // console.log(`Redis: id# ${id} NOT FOUND IN CACHE`);
      next();
    }
  });
}

function cachePhotos(req, res, next) {
  const id = req.params.id;
  redisClient.get(`p${id}`, (err, data) => {
    if (err) console.error(err);
    if (data !== null) {
      // console.log(`Redis: id# ${id} found in cache`);
      res.send(data);
    } else {
      // console.log(`Redis: id# ${id} NOT FOUND IN CACHE`);
      next();
    }
  });
}



const path = require("path");
app.use(express.static("./client/dist/"));

app.get("/sidebar/business/:id", cache, function(req, res) {
  var id = req.params.id;
  let q = `SELECT * FROM restaurants WHERE restaurant_id=${id}`;
  client.execute(q)
    .then(result => {
      redisClient.setex(id, EXPIRATION_INTERVAL, JSON.stringify(result.rows[0]), (error, result) => {
        if (error) console.error(err);
        // console.log(`Redis: id# ${id} saved in cache`);
      });
      // console.log('result.rows[0]', result.rows[0]);
      return res.status(201).send(result.rows[0]);
    })
    .catch(console.error);
});

app.get("/sidebar/businessTips/:id", cacheTips, function(req, res) {
  var id = req.params.id;
  let q = `SELECT * FROM tips WHERE restaurant_id=${id}`;
  client.execute(q)
    .then(result => {
      redisClient.setex(`t${id}`, EXPIRATION_INTERVAL, JSON.stringify(result.rows[0]), (error, result) => {
        if (error) console.error(err);
        // console.log(`Redis: id# ${id} saved in cache`);
      });
      return res.status(201).send(result.rows[0]);
    })
    .catch(console.error);
});

app.get("/sidebar/photos/:id", cachePhotos, function(req, res) {
  var id = req.params.id;
  let q = `SELECT * FROM photos WHERE restaurant_id=${id} LIMIT 1`;
  client.execute(q)
    .then(result => {
      redisClient.setex(`p${id}`, EXPIRATION_INTERVAL, JSON.stringify(result.rows[0]), (error, result) => {
        if (error) console.error(err);
        // console.log(`Redis: id# ${id} saved in cache`);
      });
      return res.status(201).send(result.rows[0]);
    })
    .catch(console.error);
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
