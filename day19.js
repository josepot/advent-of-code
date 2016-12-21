const nElfs = 3004953;

const makeElf = (id, prev) => {
  const newElf = ({ id });
  prev.next = newElf;
  return newElf;
};

const builCircle = nElfs => {
  const firstElf = { id: 1 };
  let prevElf = firstElf;
  for (let i = 2; i <= nElfs; i++) {
    prevElf = makeElf(i, prevElf);
  }
  prevElf.next = firstElf;
  return firstElf;
};

let currentElf = builCircle(nElfs);

while (currentElf.next !== currentElf) {
  currentElf.next = currentElf.next.next;
  currentElf = currentElf.next;
};

console.log(currentElf.id);
