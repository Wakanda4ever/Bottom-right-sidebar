const fs = require('fs');
const file = fs.createWriteStream('./photos.csv');

const makePhotoObj = (id) => {
  const photo = {
    restaurant_id: id,
    thumbnailUrl: '"' + "http://lorempixel.com/60/60" + '"',
  };
  return photo;
}

function writeManyTimesCSV(file) {
  let i = 1e2;
  write();
  function write() {
    let ok = true;
    file.write(Object.keys(makePhotoObj()).join(',') + '\n');
    do {
      i--;
      if (i === 0) {
        // last time!
        file.write(Object.values(makePhotoObj(i)).join(',') + '\n');
      } else {
        // see if we should continue, or wait
        // don't pass the callback, because we're not done yet.
        ok = file.write(Object.values(makePhotoObj(i)).join(',') + '\n');
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
