const readInput = require('./utils/read-input.js');

readInput(20)
  .then(input => input.split('\n').slice(0, -1))
  .then(inputs => inputs.map(x => {
    const [min, max] = x.split('-').map(x => parseInt(x, 10));
    return { min, max };
  }).sort((a, b) => a.min - b.min))
  .then(entries => {
    let result = 0;
    for (let [i, previousMax] = [0, 0];i < entries.length - 1;i++) {
      const { max } = entries[i];
      const { min: nextMin } = entries[i+1];
      previousMax = max > previousMax ? max : previousMax;
      if (nextMin > previousMax + 1) {
        result += nextMin - previousMax - 1;
      }
    }
    console.log(result);
  });
