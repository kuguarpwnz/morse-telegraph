const DOT_TIME_MS = 70;
const DOTS_COUNT_DASH = 3;
const DOTS_COUNT_SPACE = 7;

const SOUND_FREQUENCY_HZ = 800;
const SPACES_TO_LOSE = 3;


const wordsContainer = document.getElementById('words');

const audioCtx = new window.AudioContext();
let oscillator;

const letters = [];
let currentLetterSymbols = '';
let currentLetter = '';
let currentSymbol = '';

let spaceInterval;
let pressInterval;
let storeTimeout;

let isPressed = false;
document.body.addEventListener('keydown', (event) => {
  if (!isPressed && isNeededKey(event)) {
    isPressed = true;
    startCapturing();
  }
});

document.body.addEventListener('keyup', (event) => {
  if (isPressed && isNeededKey(event)) {
    isPressed = false;
    stopCapturing();
  }
});

function getSymbol(pressDuration) {
  return pressDuration >= DOT_TIME_MS * DOTS_COUNT_DASH ? '_' : '.';
}

function setCurrentLetter(symbol) {
  currentSymbol = symbol;
  const currentLetterSymbolsMaybe = [...currentLetterSymbols, symbol].join('');
  currentLetter = defaultAlphabet[currentLetterSymbolsMaybe] || '?';

  const newLetter = getNewLetterNode();
  newLetter.innerText = currentLetter;
}

function getNewLetterNode(shouldRefresh = false) {
  let newLetter = document.getElementById('new');

  if (shouldRefresh && newLetter) {
    newLetter.id = '';
    newLetter = null;
  }

  if (!newLetter) {
    newLetter = document.createElement('div');
    newLetter.id = 'new';

    wordsContainer.appendChild(newLetter);
  }

  return newLetter;
}

function isNeededKey(event) {
  // Dot key
  return event.which === 190;
}

function createOscillator() {
  oscillator = audioCtx.createOscillator();
  oscillator.type = 'square';
  oscillator.frequency.value = SOUND_FREQUENCY_HZ;
  oscillator.connect(audioCtx.destination);
}

function startCapturing() {
  clearInterval(spaceInterval);
  clearTimeout(storeTimeout);

  createOscillator();
  oscillator.start();
  const capturingStartTime = performance.now();
  setCurrentLetter(getSymbol(0));
  pressInterval = setInterval(() => {
    setCurrentLetter(getSymbol(performance.now() - capturingStartTime));
  }, 20);
}

function insertSpace() {
  const newLetter = getNewLetterNode(true);
  newLetter.innerHTML = '&nbsp;';
}

function stopCapturing() {
  clearInterval(pressInterval);

  storeTimeout = setTimeout(() => {
    letters.push(currentLetter);
    currentLetterSymbols = '';
    currentLetter = '';

    insertSpace();

    let counter = 0;
    spaceInterval = setInterval(() => {
      if (counter >= SPACES_TO_LOSE - 1) {
        const newLetterNode = getNewLetterNode();
        newLetterNode.id = '';
        return clearInterval(spaceInterval);
      }

      ++counter;
      insertSpace();
    }, DOT_TIME_MS * DOTS_COUNT_SPACE);
  }, DOT_TIME_MS * (3 /* just to make it easier */));

  currentLetterSymbols += currentSymbol;

  oscillator.stop();

}
