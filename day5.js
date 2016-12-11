const md5 = require('md5');

const input = 'wtnhxymk';

let password = '';
for (let i = 0; password.length < 8; i++) {
  const hash = md5(input + i);
  if (hash.startsWith('00000')) {
    password += hash.substr(5, 1);
  }
}

console.log(password);
