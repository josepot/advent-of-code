let nElfs = 3004953;

const makeElf = (id, prevElf) => {
  const newElf = ({ id });
  prevElf.next = newElf;
  return newElf;
};

const buildCircle = nElfs => {
  const firstElf = { id: 1 };
  let prevElf = firstElf;
  const firstMiddlePosition = Math.floor(nElfs / 2) + 1;
  for (let i = 2; i < firstMiddlePosition; i++) {
    prevElf = makeElf(i, prevElf);
  }
  const preMiddleElf = prevElf;
  for (let i = firstMiddlePosition; i <= nElfs; i++) {
    prevElf = makeElf(i, prevElf);
  }
  prevElf.next = firstElf;
  return preMiddleElf;
};

let preMiddleElf;
for (preMiddleElf = buildCircle(nElfs); nElfs > 1; nElfs--) {
  preMiddleElf.next = preMiddleElf.next.next;
  if (nElfs % 2 === 1) preMiddleElf = preMiddleElf.next;
}

console.log(preMiddleElf.id);
