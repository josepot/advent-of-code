const input = '^^^^......^...^..^....^^^.^^^.^.^^^^^^..^...^^...^^^.^^....^..^^^.^.^^...^.^...^^.^^^.^^^^.^^.^..^.^';
const nRows = 400000;

const getNextRow = prevRow => {
  return prevRow.map(
    (cell, idx, row) => (
      (row[idx - 1] === cell && cell !== row[idx + 1]) || (cell === row[idx + 1] && cell !== row[idx -1]) ?
        true : undefined
    ));
}

const rows = [];
rows[0] = input.split('').map(x => x ==='^' ? true : undefined);

while (rows.length < nRows) {
  rows.push(getNextRow(rows[rows.length - 1]));
}

const result = rows
  .map(row => row.filter(x => x === undefined).length)
  .reduce((result, nSafe) => result + nSafe, 0);

console.log(result);
