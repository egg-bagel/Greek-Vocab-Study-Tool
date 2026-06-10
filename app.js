function checkAnswer() {
  const answer = document.getElementById("userAnswer").value;
  const message = document.getElementById("feedback");

  if (answer === "Athens")
  {
    message.textContent = "Correct!";
    message.style.color = "green";
  }
  else
  {
    message.textContent = "Try again!";
    message.style.color = "red";
  }
}

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


