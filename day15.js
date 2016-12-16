const disks = [
  [7, 0],
  [13, 0],
  [3, 2],
  [5, 2],
  [17, 0],
  [19, 7],
  [11, 0],
];

const firstAligendMoments = disks.map(([nPositions, startPosition], idx) =>
  (((nPositions - (startPosition + idx + 1)) % nPositions) + nPositions) % nPositions
);

const sortedDisks = disks.map((disk, idx) => idx).sort((a, b) => {
  return disks[b][0] - disks[a][0];
});

const isDiskAligned = (moment, diskIdx) =>
  ((moment - firstAligendMoments[diskIdx]) % disks[diskIdx][0]) === 0;

const increaseBy = disks[sortedDisks[0]][0];
let areDisksAligned = false;
let currentMoment;
for (
  currentMoment = firstAligendMoments[sortedDisks[0]];
  !areDisksAligned;
  currentMoment += increaseBy
) {
  areDisksAligned = true;
  for (let z = 1; z < disks.length; z++) {
    if (!isDiskAligned(currentMoment, sortedDisks[z])) {
      areDisksAligned = false;
      break;
    }
  }
}

console.log(currentMoment);
