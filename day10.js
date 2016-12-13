const readInput = require('./utils/read-input.js');

const botBehaviours = {};
const bots = {};
const outputs = {};
let initial;

const numericSort = (a, b) => a - b;

const loadInstructions = instructions => instructions.forEach(line => {
  const valueParts = line.match(/^value\s([0-9]*)\sgoes\sto\sbot\s([0-9]*)$/);
  if (valueParts) {
    const [ ,value, bot ] = valueParts.map(x => parseInt(x));
    bots[bot] = bots[bot] || { id: bot, chips:[] };
    bots[bot].chips.push(value);
    bots[bot].chips.sort(numericSort);
    if (bots[bot].chips.length === 2) initial = bots[bot];
  } else {
    const botBeh =
      line.match(/^bot\s(\d*)\sgives\slow\sto\s(\w*)\s(\d*)\sand\shigh\sto\s(\w*)\s(\d*)$/);
    if (!botBeh) throw new Error('Wrong instructions');
    const [, botNumber, lowType, lowId, highType, highId] = botBeh;
    if (lowType !== 'bot' && !outputs[lowId]) {
      outputs[lowId] = [];
    } else if (!bots[lowId]) {
      bots[lowId] = { id: lowId, chips:[] };
    }
    if (highType !== 'bot' && !outputs[highId]) {
      outputs[highId] = [];
    } else if (!bots[highId]) {
      bots[highId] = { id: highId, chips:[] };
    }
    botBehaviours[botNumber] = {
      low: {
        type: lowType,
        dest: (lowType === 'bot' ? bots : outputs)[lowId],
      },
      high: {
        type: highType,
        dest: (highType === 'bot' ? bots : outputs)[highId],
      },
    };
  }
});

const areDestinationsAvailable = bot => {
  const behaviour = botBehaviours[bot.id];
  return (behaviour.low.type !== 'bot' || behaviour.low.dest.chips.length < 2) &&
    (behaviour.high.type !== 'bot' || behaviour.high.dest.chips.length < 2);
};

const releaseBot = bot => {
  const [low, high] = bot.chips;
  // if (low === 17 && high === 61) throw new Error(`Found ${bot.id}`);

  if (areDestinationsAvailable(bot)) {
    const behaviour = botBehaviours[bot.id];

    const lowDest = behaviour.low.type === 'bot' ? behaviour.low.dest.chips : behaviour.low.dest;
    lowDest.push(bot.chips.splice(0, 1)[0]);
    lowDest.sort(numericSort);
    if (behaviour.low.type === 'bot' && lowDest.length > 1) releaseBot(behaviour.low.dest);

    const highDest = behaviour.high.type === 'bot' ? behaviour.high.dest.chips : behaviour.high.dest;
    highDest.push(bot.chips.splice(0, 1)[0]);
    highDest.sort(numericSort);
    if (behaviour.high.type === 'bot' && highDest.length > 1) releaseBot(behaviour.high.dest);
  }
};

readInput(10)
  .then(input => input.split('\n').slice(0, -1))
  .then(loadInstructions)
  .then(() => releaseBot(initial))
  .then(() => {
    [0, 1, 2].forEach(id => {
      console.log(id, outputs[id]);
    });
  });
