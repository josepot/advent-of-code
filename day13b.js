const PriorityQueue = require('priorityqueuejs');
const R = require('ramda');

const INPUT = 1358;

const isOpenSpace = ([x, y]) => {
  if (x < 0 || y < 0) return false;
  const number = (x * x) + (3 * x) + (2 * x * y) + y + (y * y) + INPUT;
  const binary = number.toString(2).split('');
  return binary.filter(b => b === '1').length % 2 === 0;
};

const positions = { 1: { 1: { prev: null } } };
let count = 1;

const getAllPreviousPositions = position => {
  const result = [];
  let prev = R.path(position.concat('prev'), positions);
  while (prev) {
    result.push(prev);
    prev = R.path(prev.concat('prev'), positions);
  }
  return result;
};

const addOrUpdatePosition = (newPosition, prev) => {
  if (!R.path(newPosition, positions)) {
    count++;
    const [x, y] = newPosition;
    if (!positions[x]) positions[x] = {};
    positions[x][y] = { prev, position: newPosition };
    return newPosition;
  }
  return null;
};

const getNewPositions = ([x, y]) =>
  [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]
    .filter(isOpenSpace)
    .map(newPosition => addOrUpdatePosition(newPosition, [x, y]))
    .filter(R.complement(R.isNil));

let newPositions = [[1, 1]];

for (let i = 0; i < 50; i++) {
  newPositions = newPositions
    .map(getNewPositions)
    .reduce((a, b) => a.concat(b), []);
}

console.log(count);
