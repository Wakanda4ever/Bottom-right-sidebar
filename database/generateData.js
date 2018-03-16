

const fs = require('fs');
const faker = require('faker');
const businessesFile = fs.createWriteStream('./businesses.csv');
const tipsFile = fs.createWriteStream('./tips.csv');
const photosFile = fs.createWriteStream('./photos.csv');
const cuisines = fs.readFileSync('cuisines.txt').toString().split('\n');
const rInt = max => Math.floor( Math.random() * max ) + 1;

const makeBusinessObj = (id) => {
  // TODO optimize random unique cuisine selection
  const tempCuisines = cuisines;
  const business = {
    _id: id,
    name: '"' + faker.company.companyName() + '"',
    avgScore: rInt(50),
    reviewCount: Math.floor(Math.random() * 1000),
    cuisine1: '"' + tempCuisines.splice(Math.floor(Math.random() * tempCuisines.length),1)[0] + '"',
    cuisine2: '"' + tempCuisines.splice(Math.floor(Math.random() * tempCuisines.length),1)[0] + '"',
    cuisine3: '"' + tempCuisines.splice(Math.floor(Math.random() * tempCuisines.length),1)[0] + '"',
    alsoViewed1: rInt(1e7),
    alsoViewed2: rInt(1e7),
    alsoViewed3: rInt(1e7),
  };
  return business;
}

const makeTipObj = (id) => {
  const tip = {
    restaurant_id: id,
    tip: '"' + faker.lorem.sentence() + '"',
  };
  return tip;
}

const makePhotoObj = (id) => {
  const photo = {
    restaurant_id: id,
    thumbnailUrl: '"' + "http://lorempixel.com/60/60" + '"',
  };
  return photo;
}

function writeManyTimesCSV(file, generator, quantity) {
  let i = quantity;
  write();
  function write() {
    let ok = true;
    file.write(Object.keys(generator()).join(',') + '\n');
    do {
      i--;
      if (i === 0) {
        // last time!
        file.write(Object.values(generator(i)).join(',') + '\n');
      } else {
        // see if we should continue, or wait
        // don't pass the callback, because we're not done yet.
        ok = file.write(Object.values(generator(i)).join(',') + '\n');
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // had to stop early!
      // write some more once it drains
      file.once('drain', write);
    }
  }
}

writeManyTimesCSV(businessesFile, makeBusinessObj, 1e1);
writeManyTimesCSV(tipsFile, makeTipObj, 1e1);
writeManyTimesCSV(photosFile, makePhotoObj, 1e1);
