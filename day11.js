const PriorityQueue = require('priorityqueuejs');
const R = require('ramda');

const CHIP = 'CHIP';
const GENERATOR = 'GENERATOR';
const items = {
  0: { id: 0, name: 'thulium', type: GENERATOR },
  1: { id: 1, name: 'thulium', type: CHIP },
  2: { id: 2, name: 'plutonium', type: GENERATOR },
  3: { id: 3, name: 'plutonium', type: CHIP },
  4: { id: 4, name: 'strontium', type: GENERATOR },
  5: { id: 5, name: 'strontium', type: CHIP },
  6: { id: 6, name: 'promethium', type: GENERATOR },
  7: { id: 7, name: 'promethium', type: CHIP },
  8: { id: 8, name: 'ruthenium', type: GENERATOR },
  9: { id: 9, name: 'ruthenium', type: CHIP },
  10: { id: 10, name: 'elerium', type: GENERATOR },
  11: { id: 11, name: 'elerium', type: CHIP },
  12: { id: 12, name: 'dilithium', type: GENERATOR },
  13: { id: 13, name: 'dilithium', type: CHIP },
};

const nItems = Object.keys(items).length;

const initialPosition = parseInt('000101222200000', 4);
const targetPosition = parseInt('333333333333333', 4);

const getBase4Position = position => {
  let str = position.toString(4);
  let missingZeros = (nItems + 1) - str.length;
  for (let i = 0; i < missingZeros; i++) str = '0' + str;
  return str.split('').map(x => parseInt(x));
};

const getPositionScore = position => parseInt(
  getBase4Position(position)
    .sort((a, b) => b - a)
    .slice(0, -1)
    .join(''),
  4);

const evolvePosition = (position, isGoingUp, moves) => {
  const positionEntries = getBase4Position(position);
  const add = isGoingUp ? 1 : -1;
  moves.forEach(id => positionEntries[id] = positionEntries[id] + add);
  positionEntries[nItems] = positionEntries[nItems] + add;
  return parseInt(positionEntries.join(''), 4);
};

const getPositionInfo = position => {
  const positionEntries = getBase4Position(position);
  const result = {
    elevator: positionEntries[nItems],
    0: {},
    1: {},
    2: {},
    3: {},
  };

  for (let id = 0; id < nItems; id++) {
    result[positionEntries[id]][id] = items[id];
  }
  return result;
};

const getCombinations = values => {
  const result = [];
  for (let i = 0; i < values.length - 1; i++) {
    for (let z = i + 1; z < values.length; z++) {
      result.push([values[i].id, values[z].id]);
    }
  }
  return result;
};

const getPossibleDeltas = (from, to) => {
  const toValues = Object.values(to);
  const toGenerators = toValues.filter(v => v.type === GENERATOR);
  const toMicros = toValues.filter(v => v.type === CHIP);
  const toPairedItems = toGenerators
    .filter(generator => !!to[generator.id + 1])
    .map(generator => [generator.id, generator.id + 1]);

  const fromValues = Object.values(from);
  const fromGenerators = fromValues.filter(v => v.type === GENERATOR);
  const fromMicros = fromValues.filter(v => v.type === CHIP);
  const fromPairedItems = fromGenerators
    .filter(generator => !!from[generator.id + 1])
    .map(generator => [generator.id, generator.id + 1]);

  const result = [];

  // If destination is empty
  if (toValues.length === 0) {
    fromValues.forEach(val => result.push([val.id]));
    getCombinations(fromGenerators).forEach(x => result.push(x));
    getCombinations(fromMicros).forEach(x => result.push(x));
    fromPairedItems.forEach(x => result.push(x));
    return result;
  }

  // If destination is all pairs
  if (toPairedItems.length === toValues.length / 2) {
    fromPairedItems.forEach(x => result.push(x));
    getCombinations(fromGenerators).forEach(x => result.push(x));
    fromGenerators.forEach(val => result.push([val.id]));
    return result;
  }

  // If destination is all chips
  if (toValues.every(val => val.type === CHIP)) {
    const compatibleGenerators = toValues
      .map(m => from[m.id - 1])
      .filter(x => !!x);

    if (toValues.length < 3 && compatibleGenerators.length === toValues.length) {
      result.push(compatibleGenerators.map(x => x.id));
    }
    getCombinations(fromMicros).forEach(x => result.push(x));
    fromMicros.forEach(x => result.push([x.id]));
    return result;
  }

  // If all generators
  if (toValues.every(val => val.type === GENERATOR)) {
    const compatibleMicros = toValues
      .map(m => from[m.id + 1])
      .filter(x => !!x);

    getCombinations(compatibleMicros).forEach(x => result.push(x));
    compatibleMicros.forEach(x => result.push([x.id]));
    getCombinations(fromGenerators).forEach(x => result.push(x));
    fromGenerators.forEach(x => result.push([x.id]));
    return result;
  }

  // Paired items with orphan generators
  const compatibleMicros = fromMicros.filter(m => !!to[m.id -1] && !to[m.id]);

  getCombinations(compatibleMicros).forEach(x => result.push(x));
  compatibleMicros.forEach(x => result.push([x.id]));
  getCombinations(fromGenerators).forEach(x => result.push(x));
  fromGenerators.forEach(x => result.push([x.id]));

  return result;
};

const positions = {
  [initialPosition]: { prev: null, move: null, position: initialPosition },
};

const getAllPreviousPositions = position => {
  const result = [];
  let prev = positions[position].prev;
  while (prev) {
    result.push(prev);
    prev = positions[prev].prev;
  }
  return result;
};

const queue = new PriorityQueue(
  (a, b) => getPositionScore(a) - getPositionScore(b)
);

const processPosition = position => {
  const history = getAllPreviousPositions(position);
  const positionInfo = getPositionInfo(position);
  const { elevator } = positionInfo;

  const processDeltas = (deltas, isGoingUp) => deltas.forEach(d => {
    const newPosition = evolvePosition(position, isGoingUp, d);
    const newPositionInfo = {
      prev: position,
      move: { isGoingUp, deltas: d },
      position: newPosition,
    };

    if (!positions[newPosition]) {
      positions[newPosition] = newPositionInfo;
      queue.enq(newPosition);
    } else {
      const stepsToNewPosition = getAllPreviousPositions(newPosition).length;
      if (history + 1 < stepsToNewPosition) {
        positions[newPosition] = newPositionInfo;
      }
    }
  });

  const downDeltas = elevator > 0 ?
    getPossibleDeltas(positionInfo[elevator], positionInfo[elevator - 1]) :
    [];
  processDeltas(downDeltas, false);
  const upDeltas = elevator < 3 ?
    getPossibleDeltas(positionInfo[elevator], positionInfo[elevator + 1]) :
    [];
  processDeltas(upDeltas, true);
};


const drawPosition = position => {
  const drawLine = () =>
    console.log('-----------------------------------------------------------------------------------');
  const lines = R.range(0, 4).map(() => R.range(0, nItems + 1).map(() => '     '));
  const parts = getBase4Position(position);
  parts.forEach((l, idx) =>
    lines[l][idx] = idx < nItems ?
      items[idx].name.substr(0, 3) + '-' + items[idx].type.substr(0, 1) :
      '  E  '
  );
  drawLine();
  lines.forEach(l => {
    console.log(l.join(' '));
    drawLine();
  });
  console.log();
  console.log();
};

queue.enq(initialPosition);

do {
  processPosition(queue.deq());
} while(positions[targetPosition] === undefined);


[targetPosition]
  .concat(getAllPreviousPositions(targetPosition))
  .reverse()
  .forEach(drawPosition);

console.log(getAllPreviousPositions(targetPosition).length);
