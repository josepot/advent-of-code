const PriorityQueue = require('priorityqueuejs');
const R = require('ramda');

const INPUT = 1358;

const isOpenSpace = ([x, y]) => {
  if (x < 0 || y < 0) return false;
  const number = (x * x) + (3 * x) + (2 * x * y) + y + (y * y) + INPUT;
  const binary = number.toString(2).split('');
  return binary.filter(b => b === '1').length % 2 === 0;
};

const positions = { 31: { 39: { prev: null } } };

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
  const position = R.path(newPosition, positions);
  if (!position) {
    const [x, y] = newPosition;
    if (!positions[x]) positions[x] = {};
    positions[x][y] = { prev, position: newPosition };
    return newPosition;
  } else if (
    position.prev !== prev && position.prev &&
    getAllPreviousPositions(position.prev).length > getAllPreviousPositions(prev)
  ) {
    position.prev = prev;
  }
  return null;
};

const getNewPositions = ([x, y]) =>
  [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]
    .filter(isOpenSpace)
    .map(newPosition => addOrUpdatePosition(newPosition, [x, y]))
    .filter(R.complement(R.isNil));

const start = [31, 39];
const goal = [1, 1];

const queue = new PriorityQueue((a, b) => (b[0] + b[1]) - (a[0] + a[1]));

queue.enq(start);

do {
  getNewPositions(queue.deq()).forEach(p => queue.enq(p));
} while(queue.size() > 0 && !R.path(goal, positions));

console.log(getAllPreviousPositions(goal).length);
