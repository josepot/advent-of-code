const readInput = require('./utils/read-input.js');

readInput(20)
  .then(input => input.split('\n').slice(0, -1))
  .then(inputs => inputs.map(x => {
    const [min, max] = x.split('-').map(x => parseInt(x, 10));
    return { min, max };
  }).sort((a, b) => a.min - b.min))
  .then(entries => {
    let result;
    let i = 0;
    do {
      result = entries[i++].max + 1;
    } while (entries[i].min <= result);
    console.log(result);
  });
