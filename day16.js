const R = require('ramda');

const fullDisk = (input, maxLength) => {
  if (input.length > maxLength) return input.substr(0, maxLength);
  if (input.length === maxLength) return input;
  const newInput = input + '0' +
    input.split('').reverse().map(x => x === '0' ? '1' : '0').join('');
  return fullDisk(newInput, maxLength);
};

const getChecksum = input => {
  if (input.length % 2 === 1) return input;
  let result = '';
  for (let i = 0; i < input.length - 1;i += 2) {
    const a = input.charAt(i);
    const b = input.charAt(i + 1);
    result += a === b ? '1' : '0';
  }
  return getChecksum(result);
};

const result = R.compose(getChecksum, fullDisk)('01101100001100100', 35651584);

console.log(result);
