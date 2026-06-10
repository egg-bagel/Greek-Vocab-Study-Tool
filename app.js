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