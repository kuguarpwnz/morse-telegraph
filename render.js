const alphabetContainer = document.getElementById('alphabet');

for (const [seq, char] of Object.entries(defaultAlphabet)) {
  const letterNode = document.createElement('div');
  letterNode.classList.add('letter-container');

  const sequence = document.createElement('span');
  sequence.classList.add('sequence');
  sequence.innerText = seq;

  const letter = document.createElement('span');
  letter.classList.add('letter');
  letter.innerText = char;

  letterNode.appendChild(letter);
  letterNode.appendChild(sequence);

  alphabetContainer.appendChild(letterNode);
}
