const R = require('ramda');

const input = `DUURRDRRURUUUDLRUDDLLLURULRRLDULDRDUULULLUUUDRDUDDURRULDRDDDUDDURLDLLDDRRURRUUUDDRUDDLLDDDURLRDDDULRDUDDRDRLRDUULDLDRDLUDDDLRDRLDLUUUDLRDLRUUUDDLUURRLLLUUUUDDLDRRDRDRLDRLUUDUDLDRUDDUDLLUUURUUDLULRDRULURURDLDLLDLLDUDLDRDULLDUDDURRDDLLRLLLLDLDRLDDUULRDRURUDRRRDDDUULRULDDLRLLLLRLLLLRLURRRLRLRDLULRRLDRULDRRLRURDDLDDRLRDLDRLULLRRUDUURRULLLRLRLRRUDLRDDLLRRUDUDUURRRDRDLDRUDLDRDLUUULDLRLLDRULRULLRLRDRRLRLULLRURUULRLLRRRDRLULUDDUUULDULDUDDDUDLRLLRDRDLUDLRLRRDDDURUUUDULDLDDLDRDDDLURLDRLDURUDRURDDDDDDULLDLDLU
LURLRUURDDLDDDLDDLULRLUUUDRDUUDDUDLDLDDLLUDURDRDRULULLRLDDUDRRDRUDLRLDDDURDUURLUURRLLDRURDRLDURUDLRLLDDLLRDRRLURLRRUULLLDRLULURULRRDLLLDLDLRDRRURUUUDUDRUULDLUDLURLRDRRLDRUDRUDURLDLDDRUULDURDUURLLUDRUUUUUURRLRULUDRDUDRLLDUDUDUULURUURURULLUUURDRLDDRLUURDLRULDRRRRLRULRDLURRUULURDRRLDLRUURUDRRRDRURRLDDURLUDLDRRLDRLLLLRDUDLULUDRLLLDULUDUULLULLRLURURURDRRDRUURDULRDDLRULLLLLLDLLURLRLLRDLLRLUDLRUDDRLLLDDUDRLDLRLDUDU
RRDDLDLRRUULRDLLURLRURDLUURLLLUUDDULLDRURDUDRLRDRDDUUUULDLUDDLRDULDDRDDDDDLRRDDDRUULDLUDUDRRLUUDDRUDLUUDUDLUDURDURDLLLLDUUUUURUUURDURUUUUDDURULLDDLDLDLULUDRULULULLLDRLRRLLDLURULRDLULRLDRRLDDLULDDRDDRURLDLUULULRDRDRDRRLLLURLLDUUUDRRUUURDLLLRUUDDDULRDRRUUDDUUUDLRRURUDDLUDDDUDLRUDRRDLLLURRRURDRLLULDUULLURRULDLURRUURURRLRDULRLULUDUULRRULLLDDDDURLRRRDUDULLRRDURUURUUULUDLDULLUURDRDRRDURDLUDLULRULRLLURULDRUURRRRDUDULLLLLRRLRUDDUDLLURLRDDLLDLLLDDUDDDDRDURRL
LLRURUDUULRURRUDURRDLUUUDDDDURUUDLLDLRULRUUDUURRLRRUDLLUDLDURURRDDLLRUDDUDLDUUDDLUUULUUURRURDDLUDDLULRRRUURLDLURDULULRULRLDUDLLLLDLLLLRLDLRLDLUULLDDLDRRRURDDRRDURUURLRLRDUDLLURRLDUULDRURDRRURDDDDUUUDDRDLLDDUDURDLUUDRLRDUDLLDDDDDRRDRDUULDDLLDLRUDULLRRLLDUDRRLRURRRRLRDUDDRRDDUUUDLULLRRRDDRUUUDUUURUULUDURUDLDRDRLDLRLLRLRDRDRULRURLDDULRURLRLDUURLDDLUDRLRUDDURLUDLLULDLDDULDUDDDUDRLRDRUUURDUULLDULUUULLLDLRULDULUDLRRURDLULUDUDLDDRDRUUULDLRURLRUURDLULUDLULLRD
UURUDRRDDLRRRLULLDDDRRLDUDLRRULUUDULLDUDURRDLDRRRDLRDUUUDRDRRLLDULRLUDUUULRULULRUDURDRDDLDRULULULLDURULDRUDDDURLLDUDUUUULRUULURDDDUUUURDLDUUURUDDLDRDLLUDDDDULRDLRUDRLRUDDURDLDRLLLLRLULRDDUDLLDRURDDUDRRLRRDLDDUDRRLDLUURLRLLRRRDRLRLLLLLLURULUURRDDRRLRLRUURDLULRUUDRRRLRLRULLLLUDRULLRDDRDDLDLDRRRURLURDDURRLUDDULRRDULRURRRURLUURDDDUDLDUURRRLUDUULULURLRDDRULDLRLLUULRLLRLUUURUUDUURULRRRUULUULRULDDURLDRRULLRDURRDDDLLUDLDRRRRUULDDD`;

function pad(n, width, z) {
  z = z || ' ';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const createMappings = factor => {
  const grid = [];
  const mappings = {};

  const nLines = (factor * 2) - 1;
  let currentNumber = 0;
  let padding = factor - 1;

  for (let y = 0; y < nLines; y++) {
    let x = 0;
    const line = [];
    for (let p = 0; p < padding; p++) {
      line.push(null);
      x++;
    }

    for (let n = 0; n < nLines - (padding * 2); n++) {
      mappings[currentNumber] = { x, y };
      line.push(currentNumber);
      currentNumber++;
      x++;
    }

    for (let p = 0; p < padding; p++) {
      line.push(null);
      x++;
    }

    padding = y >= factor - 1 ? padding + 1 : padding - 1;
    grid.push(line);
  }

  return { grid, mappings };
}

const { grid, mappings } = createMappings(9);

grid.map(line => line.map(x => x && pad(x.toString(36), 2) || '  ').join(' ')).forEach(line =>
  console.log(line)
);

const nextNumber = (currentNumber, direction) => {
  const currentPosition = mappings[currentNumber];
  return {
    U: R.pathOr(currentNumber, [currentPosition.y - 1, currentPosition.x]),
    D: R.pathOr(currentNumber, [currentPosition.y + 1, currentPosition.x]),
    L: R.pathOr(currentNumber, [currentPosition.y, currentPosition.x - 1]),
    R: R.pathOr(currentNumber, [currentPosition.y, currentPosition.x + 1]),
  }[direction](grid);
};

const result = input.split('\n').map(numberSequence =>
  numberSequence.split('').reduce(nextNumber, 5)
).map(n => n.toString(36)).join('-');

console.log(result);