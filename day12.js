const readInput = require('./utils/read-input.js');

const registers = { a: 0, b: 0, c: 1, d: 0 };
let currentInstruction = 0;
const instructions = [];

const getValue = x => {
  const parsedX = parseInt(x);
  return isNaN(parsedX) ? registers[x] : parsedX;
};

const cpy = (x, y) => registers[y] = getValue(x);
const inc = x => registers[x]++;
const dec = x => registers[x]--;
const jnz = (x, y) =>
  getValue(x) > 0 && (currentInstruction += parseInt(y)) || currentInstruction++;

const processInstruction = line => {
  const parts = line.split(' ');
  switch (parts[0]) {
    case 'cpy': {
      cpy(parts[1], parts[2]);
      return currentInstruction++;
    }
    case 'inc': {
      inc(parts[1]);
      return currentInstruction++;
    }
    case 'dec': {
      dec(parts[1]);
      return currentInstruction++;
    }
    case 'jnz':
      return jnz(parts[1], parts[2]);
    default:
      return;
  }
};

readInput(12)
  .then(input => input.split('\n').slice(0, -1))
  .then(lines => lines.forEach(l => instructions.push(l)))
  .then(() => {
    do {
      processInstruction(instructions[currentInstruction]);
    } while (currentInstruction < instructions.length)
    console.log(registers.a);
  });
