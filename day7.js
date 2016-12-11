const R = require('ramda');
const readInput = require('./utils/read-input.js');

const hasAbba = input => input.split('').some((c, idx, arr) =>
  idx > 1 &&
    c === arr[idx - 1] && c !== arr[idx + 1] && arr[idx - 2] === arr[idx + 1]
);

const hasTlsSupport = input => {
  const parts = input.replace(/\[/g, '|').replace(/\]/g, '|').split('|');

  const brackets = parts.filter((_, idx) => idx % 2 === 1);
  const outside = parts.filter((_, idx) => idx % 2 === 0);

  return brackets.every(R.complement(hasAbba)) && outside.some(hasAbba);
};

readInput(7)
  .then(input => input.split('\n').slice(0, -1))
  .then(input => input.filter(hasTlsSupport).length)
  .then(result => console.log(result));
