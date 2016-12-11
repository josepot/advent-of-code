const readInput = require('./utils/read-input.js');

readInput(4)
  .then(input => input
    .split('\n')
    .slice(0, -1)
    .map(line => {
      const [ ,str, id, checksum] = line.match(/(.*)-([0-9]*)\[([a-z]*)\]$/);
      return {
        encrypted: str.replace(/\-/g, ''),
        id: parseInt(id),
        checksum,
      };
    })
  )
  .then(input => input.filter(({ encrypted, checksum}) =>
    encrypted
      .split('')
      .sort()
      .reduce((result, current) => {
        const last = result.length && result[result.length -1];

        if (!last || last.key !== current) {
          return result.concat({ key: current, amount: 1 });
        }
        last.amount++;
        return result;
      }, [])
      .sort((a, b) => (b.amount - a.amount) || a.key.charCodeAt(0) - b.key.charCodeAt(0))
      .map(({ key }) => key)
      .slice(0, 5)
      .join('') === checksum
  ).map(({ id }) => id).reduce((prev, curr) => prev + curr, 0))
  .then(result => console.log(result));
