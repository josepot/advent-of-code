const R = require('ramda');
const readInput = require('./utils/read-input.js');

const GRID_WIDTH = 50;
const GRID_HEIGHT = 6;

const positionsTaken = new Set();

const fromXYToIdx = (x, y) =>
  ((y % GRID_HEIGHT) * GRID_WIDTH) + (x % GRID_WIDTH);

const fromIdxToXY = idx => ({
  x: idx % GRID_WIDTH,
  y: Math.floor(idx / GRID_WIDTH),
});

const deleteAndReturnIndexedItems = indexes => indexes
  .map(idx => {
    if (positionsTaken.has(idx)) {
      positionsTaken.delete(idx);
      return fromIdxToXY(idx);
    }
    return null;
  })
  .filter(R.complement(R.isNil));

const deleteAndGetItemsInRow = y => deleteAndReturnIndexedItems(
  R.range(0, GRID_WIDTH).map(x => fromXYToIdx(x, y))
);

const deleteAndGetItemsInCol = x => deleteAndReturnIndexedItems(
  R.range(0, GRID_HEIGHT).map(y => fromXYToIdx(x, y))
);

const rotateRow = (y, nTimes) => {
  const itemsInRow = deleteAndGetItemsInRow(y);
  itemsInRow.forEach(({ x, y }) => {
    positionsTaken.add(fromXYToIdx(x + nTimes, y));
  });
};

const rotateCol = (x, nTimes) => {
  const itemsInRow = deleteAndGetItemsInCol(x);
  itemsInRow.forEach(({ x, y }) => {
    positionsTaken.add(fromXYToIdx(x, y + nTimes));
  });
};

const drawRect = (width, height) => R.range(0, width).forEach(x =>
  R.range(0, height).forEach(y => positionsTaken.add(fromXYToIdx(x, y)))
);

const processLine = line => {
  const parts = line.split(' ');
  if (parts[0] === 'rect') {
    const [ width, height ] = parts[1].split('x');
    drawRect(parseInt(width), parseInt(height));
  } else {
    const position = parseInt(parts[2].split('=')[1]);
    const by = parseInt(parts[4]);
    const fn = parts[1] === 'row' ? rotateRow : rotateCol;
    fn(position, by);
  }
};

const printScreen = () => {
  R.range(0, GRID_HEIGHT).forEach(y => {
    const line = R.range(0, GRID_WIDTH)
      .map(x => positionsTaken.has(fromXYToIdx(x, y)) ? '#' : ' ')
      .join('');
    console.log(line);
  });
};

readInput(8)
  .then(input => input.split('\n').slice(0, -1))
  .then(inputs => inputs.forEach(processLine))
  .then(() => console.log(positionsTaken.size))
  .then(printScreen)
;
