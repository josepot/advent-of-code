const md5 = require('md5');

const input = 'qzyelonm';

const getKeyIndex = (targetIdx, salt, repetitions = 0) => {
  const candidates = [];
  const confirmations = [];
  const keys = [];

  for (let i = 0; keys.length < targetIdx; i++) {
    let hash = md5(salt + i);
    for (let h = 0; h < repetitions; h++) hash = md5(hash);

    let match;
    if (match = hash.match(/(.)\1{2}/)) {
      candidates.push({ idx: i, keyPart: match[1] });
    }

    if (match = hash.match(/(.)\1{4}/)) {
      confirmations.push({ idx: i, keyPart: match[1] });
    }

    if (candidates.length > 0 && i - candidates[0].idx === 1000) {
      const candidate = candidates[0];
      const key = confirmations.find(c => c.idx > candidate.idx &&
        c.idx - candidate.idx <= 1000 &&
          c.keyPart === candidate.keyPart
      );
      if (key !== undefined) keys.push(candidate);
      candidates.shift();
    }

    if (confirmations.length > 0 && i - confirmations[0].idx === 1000) {
      confirmations.shift();
    };
  }
  return keys[targetIdx - 1].idx;
};

console.log(getKeyIndex(64, 'abc'));
