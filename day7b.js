const R = require('ramda');
const readInput = require('./utils/read-input.js');

const getAbas = input => input.split('').map((c, idx, arr) =>
  idx > 0 && c !== arr[idx - 1] && arr[idx - 1] === arr[idx + 1] ?
    arr[idx - 1] + c + arr[idx + 1] :
    null
).filter(R.complement(R.isNil));

const hasSslSupport = input => {
  const parts = input.replace(/\[/g, '|').replace(/\]/g, '|').split('|');

  const brackets = parts.filter((_, idx) => idx % 2 === 1);
  const outside = parts.filter((_, idx) => idx % 2 === 0);

  const abas = R.unnest(outside.map(getAbas));
  const possibleBabs = R.unnest(brackets.map(getAbas));

  return abas.some(aba => possibleBabs.some(bab =>
    aba.charAt(0) === bab.charAt(1) && bab.charAt(0) === aba.charAt(1)
  ));
};

readInput(7)
  .then(input => input.split('\n').slice(0, -1))
  .then(input => input.filter(hasSslSupport).length)
  .then(result => console.log(result));
