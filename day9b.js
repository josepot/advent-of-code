const R = require('ramda');
const readInput = require('./utils/read-input.js');

const repeatText = (text, nTimes) => {
  let result = '';
  for (let i = 0; i < nTimes; i++) result += text;
  return result;
}

const processLine = (line, processedText = '', inheritedRepetitions = 1) => {
  const parts =
    line.match(/^([0-9]*?x?[0-9]*?\)?[A-Z]*)?\(([0-9]*x[0-9]*)\)(.*)$/);

  if (!parts) return processedText + repeatText(line, inheritedRepetitions);

  const [ charsToProcess, repetitions ] =
    parts[2].split('x').map(x => parseInt(x));

  const partToRepeat = parts[3].substr(0, charsToProcess);
  const repeatedText = processLine(partToRepeat, '', inheritedRepetitions * repetitions);

  return processLine(
    parts[3].substr(charsToProcess),
    processedText + (parts[1] || '') + repeatedText,
    inheritedRepetitions
  );
};

readInput(9)
  .then(input => input.substr(0, input.length -1))
  .then(processLine)
  .then(result => console.log(result.length))
  .catch(e => {
    console.log(e.message);
    console.log(e.stack);
  })
;
