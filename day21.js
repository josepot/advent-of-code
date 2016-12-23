const readInput = require('./utils/read-input.js');

const swapPosition = (x, y, str) => {
  const yChar = str[y];
  str[y] = str[x];
  str[x] = yChar;
  return str;
};

const swapLetter = (x, y, str) => {
  const xPositions = [];
  const yPositions = [];
  for (let i = 0; i < str.length; i++) {
    if (str[i] === x) {
      xPositions.push(i);
      continue;
    }
    if (str[i] === y) yPositions.push(i);
  }

  xPositions.forEach(i => str[i] = y);
  yPositions.forEach(i => str[i] = x);
  return str;
};

const rotate = (direction, nSteps, str) => {
  if (nSteps <=0) return str;
  let rotationIdx = direction === 'left' ?
    nSteps :
    (nSteps * -1);
  rotationIdx = rotationIdx % str.length;

  rotationIdx = rotationIdx < 0 ?
    str.length + rotationIdx :
    rotationIdx;

  return str.slice(rotationIdx).concat(str.slice(0, rotationIdx));
};

const rotateBasedOn = (x, str) => {
  const idx = str.indexOf(x);
  const inc = idx > 3 ? 2 : 1;
  return rotate('right', idx + inc, str);
};

const reverse = (x, y, str) => str
  .slice(0, x)
  .concat(str.slice(x, y + 1).reverse())
  .concat(str.slice(y + 1));

const move = (x, y, str) => {
  const [c] = str.splice(x, 1);
  str.splice(y, 0, c);
  return str;
};

const processLine = (line, str) => {
  const parts = line.split(' ');
  if (line.startsWith('swap position')) {
    return swapPosition(parseInt(parts[2]), parseInt(parts[5]), str);
  } else if (line.startsWith('swap letter')) {
    return swapLetter(parts[2], parts[5], str);
  } else if(line.startsWith('rotate')) {
    if(['left', 'right'].indexOf(parts[1]) !== -1) {
      return rotate(parts[1], parseInt(parts[2]), str);
    } else {
      return rotateBasedOn(parts[6], str);
    }
  } else if (line.startsWith('reverse')) {
    return reverse(parseInt(parts[2]), parseInt(parts[4]), str);
  } else if (line.startsWith('move')) {
    return move(parseInt(parts[2]), parseInt(parts[5]), str);
  }
  return str;
};

let str = 'abcdefgh'.split('');

readInput(21)
  .then(input => input.split('\n').slice(0, -1))
  .then(lines => {
    lines.forEach(line => {
      str = processLine(line, str);
    });
    console.log(str.join(''));
  })
;
