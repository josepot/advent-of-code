const R = require('ramda');

const input = 'R4, R5, L5, L5, L3, R2, R1, R1, L5, R5, R2, L1, L3, L4, R3, L1, L1, R2, R3, R3, R1, L3, L5, R3, R1, L1, R1, R2, L1, L4, L5, R4, R2, L192, R5, L2, R53, R1, L5, R73, R5, L5, R186, L3, L2, R1, R3, L3, L3, R1, L4, L2, R3, L5, R4, R3, R1, L1, R5, R2, R1, R1, R1, R3, R2, L1, R5, R1, L5, R2, L2, L4, R3, L1, R4, L5, R4, R3, L5, L3, R4, R2, L5, L5, R2, R3, R5, R4, R2, R1, L1, L5, L2, L3, L4, L5, L4, L5, L1, R3, R4, R5, R3, L5, L4, L3, L1, L4, R2, R5, R5, R4, L2, L4, R3, R1, L2, R5, L5, R1, R1, L1, L5, L5, L2, L1, R5, R2, L4, L1, R4, R3, L3, R1, R5, L1, L4, R2, L3, R5, R3, R1, L3';

const directions = {
  north: { x: 0, y: 1, key: 'north' },
  south: { x: 0, y: -1, key: 'south' },
  east: { x: 1, y: 0, key: 'east' },
  west: { x: -1, y: 0, key: 'west' },
};

const rotations = {
  north: {
    R: directions.east,
    L: directions.west,
  },
  south: {
    R: directions.west,
    L: directions.east,
  },
  east: {
    R: directions.south,
    L: directions.north,
  },
  west: {
    R: directions.north,
    L: directions.south,
  },
};

const getnewDiff = ({ direction, diff }, newInput) => {
  const turnTo = newInput.substr(0, 1);
  const nSteps = parseInt(newInput.slice(1));
  const newDirection = rotations[direction.key][turnTo];
  const newDiff = R.map(R.multiply(nSteps), newDirection);
  return {
    direction: newDirection,
    diff: {
      x: diff.x + newDiff.x,
      y: diff.y + newDiff.y,
    },
  };
};

const { diff } = input.split(', ').reduce(getnewDiff, {
  direction: directions.north,
  diff: { x: 0, y: 0 }
});

const result = Math.abs(diff.x) + Math.abs(diff.y);

console.log(result);
