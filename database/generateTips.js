

const faker = require('faker');
const fs = require('fs');
const file = fs.createWriteStream('./tips.csv');

const makeTipObj = (id) => {
  const tip = {
    restaurant_id: id,
    tip: '"' + faker.lorem.sentence() + '"',
  };
  return tip;
}

function writeManyTimesCSV(file) {
  let i = 1e2;
  write();
  function write() {
    let ok = true;
    file.write(Object.keys(makeTipObj()).join(',') + '\n');
    do {
      i--;
      if (i === 0) {
        // last time!
        file.write(Object.values(makeTipObj(i)).join(',') + '\n');
      } else {
        // see if we should continue, or wait
        // don't pass the callback, because we're not done yet.
        ok = file.write(Object.values(makeTipObj(i)).join(',') + '\n');
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // had to stop early!
      // write some more once it drains
      file.once('drain', write);
    }
  }
}

writeManyTimesCSV(file);
