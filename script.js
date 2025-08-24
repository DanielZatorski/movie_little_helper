

//on comand line write "npx http-server ." to work on the file and then open http://localhost:8080

import sentiment from "https://esm.sh/wink-sentiment";

document.addEventListener("DOMContentLoaded", () => {

  // DOM wiring
  const input = document.querySelector("#text-input");   // text box where user types
  const btn = document.querySelector("#analyze-btn");   // button to start analysis
  const scoreEl = document.querySelector("#score");     // place where we show result

  // function that checks the text and updates the score
  function updateScore() {
    const result = sentiment(input.value); // analyze the text
    scoreEl.textContent = result.normalizedScore.toFixed(3); // show score (rounded to 3 decimals)
  }

  // Run the analysis once when the page first loads
  updateScore();

  // Run the analysis again every time the button is clicked
  btn.addEventListener("click", updateScore);
});
