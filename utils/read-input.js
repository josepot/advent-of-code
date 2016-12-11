const fs = require('fs');

module.exports = inputNumber => new Promise((resolve, reject) =>
  fs.readFile(`./inputs/${inputNumber}.txt`, 'utf8', (err, data) =>
    err ? reject(err) : resolve(data)
  )
);
