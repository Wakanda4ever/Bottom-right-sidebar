const fs = require('fs');
const Promise = require('bluebird');
const cassandra = require('cassandra-driver');
const client = new cassandra.Client({
  // contactPoints: ['localhost'], // Development
  contactPoints: ['172.31.13.166', '172.31.12.58'], // Deploy
  promiseFactory: Promise.fromCallback
});

// let counter = 0;
// var promises = [];
const BATCH_SIZE = 19;
let photosAllInserted = false;
let tipsAllInserted = false;
let restaurantsAllInserted = false;

const insertFromCSV = (file, query) => {
  let counter = 0;
  const promises = [];
  console.log(`Inserting from ${file}...`);

  return new Promise((resolve, reject) => {
    let photos_queries = [];
    let photos_counter = 0;
    var LineByLineReader = require('line-by-line'),
        photo_lineReader = new LineByLineReader(file);
    photo_lineReader.on('line', function (line) {
      photos_queries.push({query: query, params: line.split('\t')});
      photos_counter++;
      counter++;
      if (counter % 100000 === 0) {
        console.log(`${counter.toLocaleString()} records inserted`);
      }
      if (photos_counter > BATCH_SIZE) {
        photo_lineReader.pause();
        promises.push(client.batch(photos_queries, { prepare: true }));
        Promise.all(promises)
        .then(() => {
          photo_lineReader.resume();
          photos_counter = 0;
          photos_queries = [];
        });
      }
    });
    photo_lineReader.on('end', () => {
      console.log(`${file} completely read.`);
      photo_lineReader.end();
      // Call any left-over queries
      if (photos_queries.length > 0) {
        promises.push(client.batch(photos_queries, { prepare: true }));
      }
      Promise.all(promises)
        .then(() => {
          photosAllInserted = true;
          resolve('success!');
        });
    });
  });
};

console.log('Setting up database...');
client.execute('DROP KEYSPACE IF EXISTS chompy_bottom_right;')
  .then(()=>client.execute("CREATE KEYSPACE chompy_bottom_right WITH REPLICATION = {'class':'SimpleStrategy','replication_factor':1};"))
  .then(()=>client.execute("USE chompy_bottom_right;"))
  .then(()=>client.execute("CREATE TABLE restaurants (id UUID, restaurant_id int, name varchar, city varchar, avgscore int, reviewcount int, cuisine1 varchar, cuisine2 varchar, cuisine3 varchar, alsoviewed1 int, alsoviewed2 int, alsoviewed3 int, PRIMARY KEY ((id), restaurant_id));"))
  .then(()=>client.execute("CREATE TABLE tips (id UUID, restaurant_id int, text varchar, PRIMARY KEY ((id), restaurant_id));"))
  .then(()=>client.execute("CREATE TABLE photos (id UUID, restaurant_id int, thumbnailurl varchar, PRIMARY KEY ((id), restaurant_id));"))
  .then(()=>client.execute("CREATE INDEX ON restaurants (restaurant_id);"))
  .then(()=>client.execute("CREATE INDEX ON tips (restaurant_id);"))
  .then(()=>client.execute("CREATE INDEX ON photos (restaurant_id);"))
  .then(() => insertFromCSV('./cassandra-db/photos.csv', 'INSERT INTO photos (id, restaurant_id, thumbnailurl) VALUES (?, ?, ?)'))
  .then(() => insertFromCSV('./cassandra-db/tips.csv', 'INSERT INTO tips (id, restaurant_id, text) VALUES (?, ?, ?)'))
  .then(() => insertFromCSV('./cassandra-db/restaurants.csv', 'INSERT INTO restaurants (id, restaurant_id, name, city, avgscore, reviewcount, cuisine1, cuisine2, cuisine3, alsoviewed1, alsoviewed2, alsoviewed3) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'))
  .then(() => {
    client.shutdown();
    console.log('All done! Exiting...')
  })
  .catch(err => {
    console.error('Error!\n', err);
    process.exit(1);
  });

// const intervalId = setInterval(()=>{
//   if (photosAllInserted && tipsAllInserted && restaurantsAllInserted) {
//     client.shutdown()
//       .then(() => {
//         console.log('DB connection closed');
//       });
//     clearInterval(intervalId);
//   }
// }, 2000);