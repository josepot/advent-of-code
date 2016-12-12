const readInput = require('./utils/read-input.js');

const processLine = (line, processedAmount = 0, inheritedRepetitions = 1) => {
  const parts =
    line.match(/^([0-9]*?x?[0-9]*?\)?[A-Z]*)?\(([0-9]*x[0-9]*)\)(.*)$/);

  if (!parts) return processedAmount + (line.length * inheritedRepetitions);

  const [ charsToProcess, repetitions ] =
    parts[2].split('x').map(x => parseInt(x));

  const partToRepeat = parts[3].substr(0, charsToProcess);
  const body = processLine(partToRepeat, 0, inheritedRepetitions * repetitions);
  const head = parts[1] ? parts[1].length * inheritedRepetitions : 0;

  return processLine(
    parts[3].substr(charsToProcess),
    processedAmount + head + body,
    inheritedRepetitions
  );
};

readInput(9)
  .then(input => input.substr(0, input.length -1))
  .then(processLine)
  .then(result => console.log(result))
;
