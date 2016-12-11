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

const inputs = input.split(', ').map(input => ({
  turnTo: input.substr(0,1),
  nSteps: parseInt(input.slice(1)),
}));

const visitedSpots = new Set();
let found = false;
let currentSpot = { x: 0, y: 0 };
visitedSpots.add('0-0');
let currentDirection = directions.north;

for (let idx = 0; idx < inputs.length && !found; idx++) {
  const { turnTo, nSteps } = inputs[idx];
  currentDirection = rotations[currentDirection.key][turnTo];
  for (let i = 0; i < nSteps && !found; i++) {
    currentSpot = {
      x: currentSpot.x + currentDirection.x,
      y: currentSpot.y + currentDirection.y,
    };
    if (visitedSpots.has(currentSpot.x + '-' + currentSpot.y)) {
      found = true;
    } else {
      visitedSpots.add(currentSpot.x + '-' + currentSpot.y);
    }
  }
}

const result = Math.abs(currentSpot.x) + Math.abs(currentSpot.y);

console.log(result);
