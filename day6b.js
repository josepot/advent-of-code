const readInput = require('./utils/read-input.js');

const initialData = [1,2,3,4,5,6,7,8].map(() => ({}));

readInput(6)
  .then(input => input.split('\n').slice(0, -1))
  .then(input => input.reduce((result, line) => {
    line.split('').forEach((c, idx) => {
      let currentKey = result[idx][c];
      if (!currentKey) {
        currentKey = { character: c, nTimes: 0 };
        result[idx][c] = currentKey;
      }
      currentKey.nTimes++;
    });
    return result;
  }, initialData)
    .map(keys => Object.values(keys).sort((a, b) => b.nTimes - a.nTimes)[0].character)
    .join('')
  )
  .then(message => console.log(message))
;
