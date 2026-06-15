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

// Gets a random verb form (filters out infinitives, which have no person/number)
// TODO: add infinitive support with a simplified UI (tense/mood/voice only)
function getRandomForm() {
  const verb = verbData.verbs[Math.floor(Math.random() * verbData.verbs.length)];
  const finiteForms = verb.forms.filter(f => f.parses[0].person !== null);
  const form = finiteForms[Math.floor(Math.random() * finiteForms.length)];
  return { verb, form };
}

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
let currentParse;  // for verbs with more than one correct parse

// Helper for loadQuestion()
function getRandomParse(form) {
  return form.parses[Math.floor(Math.random() * form.parses.length)];
}

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

    currentParse = getRandomParse(currentForm);
    // If the verb is an infinitive, don't display person or number
    if (currentForm.mood === "infinitive")
    {
      formSpecs.textContent = `${currentParse.tense} ${currentParse.mood} ${currentParse.voice}`;
    }
    else
    {
      formSpecs.textContent = `${currentParse.person} person ${currentParse.number} ${currentParse.tense} ${currentParse.mood} ${currentParse.voice}`;
    } 
  }
  else if (mode === 3)
  {
    // If the mode is 3, just load the dictionary entry and meaning.
    // The user must type all 6 principal parts in the input box.
    challenge3.textContent = `${currentVerb.dictionary_entry} ${currentVerb.meaning}`;
  }
}

// Checks the user's answer in Greek to English mode.
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

// Checks the user's answer in English to Greek mode.
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

// Checks the user's answer in principal parts mode.
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

// Displays the answer in Greek to English mode.
function showAnswerParse() {
  let answerString = "";

    if (currentForm.parses.length === 1)
    {
      answerString = `${currentForm.parses[0].person} person ${currentForm.parses[0].number} ${currentForm.parses[0].tense} ${currentForm.parses[0].mood} ${currentForm.parses[0].voice}`;
    }
    else
    {
      let i = 0;
      do {
        let currentLine = `${currentForm.parses[i].person} person ${currentForm.parses[i].number} ${currentForm.parses[i].tense} ${currentForm.parses[i].mood} ${currentForm.parses[i].voice}`;
        if (i != (currentForm.parses.length - 1))
        {
          currentLine += "\n";
        }
        answerString += currentLine;
        i++;
      } while (i < currentForm.parses.length);
    }

    feedback.textContent = answerString;
}

// Displays the answer in English to Greek mode.
function showAnswerForm() {
  feedback.textContent = `${currentForm.form}`;
}

// Displays the answer in principal parts mode.
function showAnswerPP() {
  let answerString = "";
  for (let i = 0; i < 6; i++)
  {
    if (currentVerb.principal_parts[i] != null)
    {
      answerString += `${currentVerb.principal_parts[i]}`
    }
    else
    {
      answerString += "---";
    }

    if (i != 5)
    {
      answerString += ", ";
    }
  }

  feedback.textContent = answerString;
}

// Clears all input forms and generates a new question.
function nextQuestion() {
  if (mode === 1)
  {
    document.getElementById("person").value = '1st';
    document.getElementById("number").value = 'singular';
    document.getElementById("tense").value = 'present';
    document.getElementById("mood").value = 'indicative';
    document.getElementById("voice").value = 'active';
    feedback.textContent = "";

    loadQuestion();
  }
  else if (mode === 2)
  {
    document.getElementById("userAnswer").value = "";
    feedback.textContent = "";

    loadQuestion();
  }
  else if (mode === 3)
  {
    document.getElementById("pp1").value = "";
    document.getElementById("pp2").value = "";
    document.getElementById("pp3").value = "";
    document.getElementById("pp4").value = "";
    document.getElementById("pp5").value = "";
    document.getElementById("pp6").value = "";
    feedback.textContent = "";

    [pp1, pp2, pp3, pp4, pp5, pp6].forEach(input => {
      input.value = '';
      input.style.borderColor = '';
    });

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
document.getElementById('showAnswerParse').addEventListener('click', showAnswerParse);
document.getElementById('showAnswerForm').addEventListener('click', showAnswerForm);
document.getElementById('showAnswerPP').addEventListener('click', showAnswerPP);
document.querySelectorAll('.next').forEach(button => {
  button.addEventListener('click', nextQuestion);
});

document.getElementById('backToMenu').addEventListener('click', backToMenu);