const R = require('ramda');
const readInput = require('./utils/read-input.js');

const processLine = (line, processedText = '') => {
  const parts =
    line.match(/^([0-9]*?x?[0-9]*?\)?[A-Z]*)?\(([0-9]*x[0-9]*)\)(.*)$/);

  if (!parts) return processedText + line;

  const [ charsToProcess, repetitions ] =
    parts[2].split('x').map(x => parseInt(x));

  const partToRepeat = parts[3].substr(0, charsToProcess);
  const repeatedText = R.range(0, repetitions).map(() => partToRepeat).join('');

  return processLine(
    parts[3].substr(charsToProcess),
    processedText + (parts[1] || '') + repeatedText
  );
};

readInput(9)
  .then(input => input.substr(0, input.length -1))
  .then(processLine)
  .then(result => console.log(result.length))
;
