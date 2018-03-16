

const fs = require('fs');
const faker = require('faker');
const file = fs.createWriteStream('./businesses.csv');
const cuisines = fs.readFileSync('cuisines.txt').toString().split('\n');
const rInt = max => Math.floor( Math.random() * max ) + 1;

const makeBusinessObj = (id) => {
  // TODO optimize random unique cuisine selection
  const tempCuisines = cuisines;
  const business = {
    _id: id,
    // thumbnailUrl: '"' + "http://lorempixel.com/60/60" + '"',
    name: '"' + faker.company.companyName() + '"',
    avgScore: rInt(50),
    reviewCount: Math.floor(Math.random() * 1000),
    // tip: '"' + faker.lorem.sentence() + '"',
    cuisine1: '"' + tempCuisines.splice(Math.floor(Math.random() * tempCuisines.length),1)[0] + '"',
    cuisine2: '"' + tempCuisines.splice(Math.floor(Math.random() * tempCuisines.length),1)[0] + '"',
    cuisine3: '"' + tempCuisines.splice(Math.floor(Math.random() * tempCuisines.length),1)[0] + '"',
    alsoViewed1: rInt(1e7),
    alsoViewed2: rInt(1e7),
    alsoViewed3: rInt(1e7),
    // alsoViewedIds: [rInt(1e7), rInt(1e7), rInt(1e7)],
  };
  return business;
}

// See https://nodejs.org/api/stream.html#stream_event_drain
// function writeManyTimes(writer) {
//   writer.write('[');
//   let i = 1e7;
//   write();
//   function write() {
//     let ok = true;
//     do {
//       i--;
//       if (i === 0) {
//         // last time!
//         writer.write(`${makeBusinessStr(i)}`);
//       } else {
//         // see if we should continue, or wait
//         // don't pass the callback, because we're not done yet.
//         ok = writer.write(`${makeBusinessStr(i)},`);
//       }
//     } while (i > 0 && ok);
//     if (i > 0) {
//       // had to stop early!
//       // write some more once it drains
//       writer.once('drain', write);
//     }
//   }
//   writer.write(']');
// }

function writeManyTimesCSV(file) {
  let i = 1e2;
  write();
  function write() {
    let ok = true;
    file.write(Object.keys(makeBusinessObj()).join(',') + '\n');
    do {
      i--;
      if (i === 0) {
        // last time!
        file.write(Object.values(makeBusinessObj(i)).join(',') + '\n');
      } else {
        // see if we should continue, or wait
        // don't pass the callback, because we're not done yet.
        ok = file.write(Object.values(makeBusinessObj(i)).join(',') + '\n');
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // had to stop early!
      // write some more once it drains
      file.once('drain', write);
    }
  }
}

// writeManyTimes(file);
writeManyTimesCSV(file);
