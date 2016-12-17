const PriorityQueue = require('priorityqueuejs');
const md5 = require('md5');

const input = 'mmsxrhfx';

const getPossibleDirections = ([x, y], previousSteps) =>
  [y > 0 && 'U', y < 3 && 'D', x > 0 && 'L', x < 3 && 'R']
    .map((d, idx) => md5(previousSteps).charCodeAt(idx) > 97 ? d : false)
    .filter(x => x !== false);

const getNewPositions = ([[x, y], previousSteps]) =>
  getPossibleDirections([x, y], previousSteps).map(d => {
    switch (d) {
      case 'U':
        return [[x, y - 1], previousSteps + 'U'];
      case 'D':
        return [[x, y + 1], previousSteps + 'D'];
      case 'L':
        return [[x - 1, y], previousSteps + 'L'];
      default:
        return [[x + 1, y], previousSteps + 'R'];
    };
  });

const queue = new PriorityQueue((a, b) =>
  (b[0][0] + b[0][1]) - (a[0][0] + a[0][1])
);
queue.enq([[0, 0], input]);

let results = [];
do {
  const newPositions = getNewPositions(queue.deq());
  const result = newPositions.findIndex(([[x, y]]) => x === 3 && y === 3);
  if (result !== -1) {
    results.push(newPositions[result][1]);
    newPositions.splice(result, 1);
  }
  newPositions.forEach(p => queue.enq(p));
} while(!queue.isEmpty());

const result = results.reduce(
  (res, curr) => curr.length > res ? curr.length : res, 0
) - input.length;

console.log(result);
