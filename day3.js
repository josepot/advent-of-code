const readInput = require('./utils/read-input.js');

const main = input => {
  // console.log(input);
  const res = input.filter(([a, b, c]) => (
    a + b > c && a + c > b && c + b > a
  )).length;
  console.log(res);
}

readInput(3)
  .then(input =>
    input.split('\n')
      .slice(0, -1)
      .map(line =>
        [line.substr(0, 5), line.substr(5, 5), line.substr(10, 5)]
          .map(n => parseInt(n))
      )
    .reduce((groups, [a, b, c]) => {
      if (groups[0].slice(-1)[0].length === 3) {
        return [
          [...groups[0], [a]],
          [...groups[1], [b]],
          [...groups[2], [c]]
        ];
      }
      const [ t1, t2, t3 ] = groups.map(g => g.slice(-1)[0]);
      return [
        [...groups[0].slice(0, -1), t1.concat(a)],
        [...groups[1].slice(0, -1), t2.concat(b)],
        [...groups[2].slice(0, -1), t3.concat(c)]
      ];
    }, [[[]], [[]], [[]]])
    .reduce((result, current) => [...result, ...current], [])
  )
  .then(main)
  .catch(e => {
    console.log(e.message);
    console.log(e.stack);
  })
