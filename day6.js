const readInput = require('./utils/read-input.js');

const initialData = [1,2,3,4,5,6,7,8].map(() => ({
  mostFrequent: null,
  keys: {}
}));

readInput(6)
  .then(input => input.split('\n').slice(0, -1))
  .then(input => input.reduce((result, line) => {
    line.split('').forEach((c, idx) => {
      let currentKey = result[idx].keys[c];
      if (!currentKey) {
        currentKey = { character: c, nTimes: 0 };
        result[idx].keys[c] = currentKey;
      }
      currentKey.nTimes++;
      if (!result[idx].mostFrequent || result[idx].mostFrequent.nTimes < currentKey.nTimes) {
        result[idx].mostFrequent = currentKey;
      }
    });
    return result;
  }, initialData)
      .map(({ mostFrequent: { character } }) => character).join('')
  )
  .then(message => console.log(message))
;
