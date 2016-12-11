const md5 = require('md5');

const input = 'wtnhxymk';

let password = [];
let count = 0;
for (let i = 0; count < 8; i++) {
  const hash = md5(input + i);
  if (hash.startsWith('00000')) {
    const position = parseInt(hash.substr(5, 1), 16);
    if (position < 8 && password[position] === undefined) {
      password[position] = hash.substr(6, 1);
      count++;
    }
  }
}

console.log(password.join(''));
