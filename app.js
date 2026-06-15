// =========== IMPORTS ================


// ============ CONSTANTS ================
const GrkToEngButton = document.getElementById('GrkToEng');
const EngToGrkButton = document.getElementById('EngToGrk');
const PrincipalPartsButton = document.getElementById('PrincipalParts');

const challenge = document.getElementById('challenge');  // Greek -> Eng question
const submitParseButton = document.getElementById('submitParse');
const challenge2 = document.getElementById('challenge2');  // Eng -> Greek question
const formSpecs = document.getElementById('formSpecs');  // space for Eng->Gr form specs
const submitVerbFormButton = document.getElementById('submitVerbForm');

const challenge3 = document.getElementById('challenge3');  // principal parts question
const pp1 = document.getElementById('pp1');
const pp2 = document.getElementById('pp2');
const pp3 = document.getElementById('pp3');
const pp4 = document.getElementById('pp4');
const pp5 = document.getElementById('pp5');
const pp6 = document.getElementById('pp6');
const submitPrincipalPartsButton = document.getElementById('submitPrincipalParts');

const feedback = document.getElementById('feedback');  // feedback on the user's answer


// ========= DOM SELECTORS & STATE =========
let mode = 1;  // 1 for Greek to Eng, 2 for Eng to Greek, 3 for principal parts practice

// ======= UTILITIES/HELPERS =========

// Gets a random verb form
// This is temporarily filtering out infinitives and participles, which have no person
// or number, to make testing easier
function getRandomForm() {
  const verb = verbData.verbs[Math.floor(Math.random() * verbData.verbs.length)];
  const finiteForms = verb.forms.filter(f => f.person !== null);
  const form = finiteForms[Math.floor(Math.random() * finiteForms.length)];
  return { verb, form };
}
/*
function getRandomForm() {
  const verb = verbData.verbs[Math.floor(Math.random() * verbData.verbs.length)];
  const form = verb.forms[Math.floor(Math.random() * verb.forms.length)];
  return { verb, form };  // this is shorthand for return { verb: verb, form: form };
  
}
  */

// ======== MAIN LOGIC / EVENT HANDLERS ==========

// Load the verb data from the JSON file
let verbData;

fetch('verbs.json')
  .then(response => response.json())
  .then(data => {
    verbData = data;
    initializeApp(); // start the app only once data is ready
  })
  .catch(error => console.error('Error loading verb data:', error));

function initializeApp() {
  // safe to use verbData here
  console.log(verbData.verbs[0].dictionary_entry); // "λύω"
}

// Switches modes and shows the correct panel of the quiz screen
function switchMode(newMode) {
  mode = newMode;

  // Hide mode select, show quiz screen
  document.getElementById('modeSelect').classList.add('hidden');
  document.getElementById('quizScreen').classList.remove('hidden');

  // Hide all mode panels, then show the right one
  document.querySelectorAll('#quizScreen > div').forEach(el => el.classList.add('hidden'));
  document.getElementById(`mode${newMode}`).classList.remove('hidden');

  // Load the first question
  loadQuestion();
}

let currentVerb;
let currentForm;

// Loads a question to the quiz screen based on what mode is selected.
function loadQuestion() {

  const randVerbForm = getRandomForm();
  currentVerb = randVerbForm.verb;
  currentForm = randVerbForm.form;

  if (mode === 1)
  {
    challenge.textContent = currentForm.form;
  }
  else if (mode === 2)
  {
    challenge2.textContent = `${currentVerb.dictionary_entry} ${currentVerb.meaning}`;
    formSpecs.textContent = `${currentForm.person} person ${currentForm.number} ${currentForm.tense} ${currentForm.mood} ${currentForm.voice}`; 
  }
  else if (mode === 3)
  {
    // If the mode is 3, just load the dictionary entry and meaning.
    // The user must type all 6 principal parts in the input box.
    challenge3.textContent = `${currentVerb.dictionary_entry} ${currentVerb.meaning}`;
  }
}

// TODO: some forms are ambiguous (e.g. λύετε is present active indicative
// OR present active imperative). Currently only one parse is stored per form.
// Fix: store an array of valid parses and check against all of them in checkAnswer().

// Checks the user's answers for parsing mode.
function checkAnswerParse() {
  const selectedPerson = document.getElementById('person').value;
  const selectedNumber = document.getElementById('number').value;
  const selectedTense  = document.getElementById('tense').value;
  const selectedMood   = document.getElementById('mood').value;
  const selectedVoice  = document.getElementById('voice').value;

  // Compare to each element of the parses array
  // some is a JS array method that returns true if at least one element passes the test
  const correct = currentForm.parses.some(parse =>
    selectedPerson === parse.person &&
    selectedNumber === parse.number &&
    selectedTense  === parse.tense  &&
    selectedMood   === parse.mood   &&
    selectedVoice  === parse.voice
  );

  if (correct) {
    feedback.textContent = 'Correct!';
    loadQuestion(); // load next question
  } else {
    feedback.textContent = 'Not quite — try again!';
  }
}

function checkAnswerVerbForm() {
  const answer = document.getElementById('userAnswer').value;

  const correct = (answer === currentForm.form);

  if (correct) {
    feedback.textContent = 'Correct!';
    loadQuestion(); // load next question
  } else {
    feedback.textContent = 'Not quite — try again!';
  }
}

function checkPrincipalParts() {
  const correct = currentVerb.principal_parts;
  const inputs = [pp1, pp2, pp3, pp4, pp5, pp6];
  
  let allCorrect = true;
  inputs.forEach((input, i) => {
    if (input.value.trim() === correct[i]) {
      input.style.borderColor = 'green';
    } else {
      input.style.borderColor = 'red';
      allCorrect = false;
    }
  });

  if (allCorrect) {
    feedback.textContent = 'Correct!';
    loadQuestion();
  }
}

function backToMenu() {
  document.getElementById('quizScreen').classList.add('hidden');
  document.getElementById('modeSelect').classList.remove('hidden');
  feedback.textContent = '';
}

// ========= EVENT LISTENERS & INITIALIZATION ==========

GrkToEngButton.addEventListener('click', () => switchMode(1));
EngToGrkButton.addEventListener('click', () => switchMode(2));
PrincipalPartsButton.addEventListener('click', () => switchMode(3));
submitParseButton.addEventListener('click', () => checkAnswerParse());
submitVerbFormButton.addEventListener('click', () => checkAnswerVerbForm());
submitPrincipalPartsButton.addEventListener('click', () => checkPrincipalParts());
document.getElementById('backToMenu').addEventListener('click', backToMenu);