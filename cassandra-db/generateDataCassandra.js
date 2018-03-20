const fs = require('fs');
const faker = require('faker');
const Uuid = require('cassandra-driver').types.Uuid;

const businessesFile = fs.createWriteStream('./restaurants.csv');
const tipsFile = fs.createWriteStream('./tips.csv');
const photosFile = fs.createWriteStream('./photos.csv');
const cuisines = fs.readFileSync('cuisines.txt').toString().split('\n');
const rInt = max => Math.floor( Math.random() * max ) + 1;

const QUANTITY = 1e7;

const makeRestaurantObj = (id) => {
  // TODO optimize random unique cuisine selection
  let tempCuisines = cuisines.slice();
  const RestaurantUuid = Uuid.random();
  const restaurant = {
    id: RestaurantUuid,
    restaurant_id: id,
    name: faker.company.compasnyName(),
    city: faker.address.city(),
    avgScore: rInt(50),
    reviewCount: Math.floor(Math.random() * 1000),
    cuisine1: tempCuisines.splice(Math.floor(Math.random() * tempCuisines.length),1)[0],
    cuisine2: tempCuisines.splice(Math.floor(Math.random() * tempCuisines.length),1)[0],
    cuisine3: tempCuisines.splice(Math.floor(Math.random() * tempCuisines.length),1)[0],
    alsoViewed1: rInt(QUANTITY),
    alsoViewed2: rInt(QUANTITY),
    alsoViewed3: rInt(QUANTITY)
  };
  return restaurant;
}

const makeTipObj = (id) => {
  const tip = {
    id: Uuid.random(),
    restaurant_id: id,
    text: faker.lorem.sentence(),
  };
  return tip;
}

const makePhotoObj = (id) => {
  const photo = {
    id: Uuid.random(),
    restaurant_id: id,
    thumbnailUrl: 'http://lorempixel.com/60/60',
  };
  return photo;
}

function writeManyTimesCSV(file, generator, quantity) {
  let i = 1;
  write();
  function write() {
    let ok = true;
    // file.write(Object.keys(generator()).join(',') + '\n');
    do {
      if (i === quantity) {
        // last time!
        file.write(Object.values(generator(i)).join('\t') + '\n');
      } else {
        // see if we should continue, or wait
        // don't pass the callback, because we're not done yet.
        ok = file.write(Object.values(generator(i)).join('\t') + '\n');
      }
      i++;
    } while (i <= quantity && ok);
    if (i < quantity) {
      // had to stop early!
      // write some more once it drains
      file.once('drain', write);
    }
  }
}

writeManyTimesCSV(businessesFile, makeRestaurantObj, QUANTITY);
writeManyTimesCSV(tipsFile, makeTipObj, QUANTITY);
writeManyTimesCSV(photosFile, makePhotoObj, QUANTITY);
