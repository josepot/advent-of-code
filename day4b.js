const readInput = require('./utils/read-input.js');

const rotateCharacter = (c, nTimes) => String.fromCharCode(
  (((c.charCodeAt(0) - 97) + nTimes) % 26) + 97
);

const decrypt = (input, id) => input
  .split('')
  .map(c => c === '-' ? ' ' : rotateCharacter(c, id))
  .join('');

readInput(4)
  .then(input => input
    .split('\n')
    .slice(0, -1)
    .map(line => {
      const [ ,encrypted, id, checksum] = line.match(/(.*)-([0-9]*)\[([a-z]*)\]$/);
      return {
        encrypted,
        id: parseInt(id),
        checksum,
      };
    })
  )
  .then(input => input.filter(({ encrypted, checksum}) =>
    encrypted
      .replace(/\-/g, '')
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
  )
    .filter(({ encrypted, id }) => decrypt(encrypted, id).includes('northpole'))
    .forEach(({ encrypted, id }) => console.log(
      decrypt(encrypted, id),
      id
    ))
  );
