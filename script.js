

//on comand line write "npx http-server ." to work on the file and then open http://localhost:8080
//remember to disable caching in Network tab in Dev Tool
import sentiment from "https://esm.sh/wink-sentiment";

document.addEventListener("DOMContentLoaded", () => {

  // DOM wiring
  const input = document.querySelector("#text-input");   // text box where user types
  const btn = document.querySelector("#analyze-btn");   // button to start analysis
  const scoreEl = document.querySelector("#score");     // place where we show result

    //reversed genre mapping to the sentiment eg. sad = happy movie
    function mapSentimentToGenre(score) {
        if (score <= -2.0) return "Comedy / Stand-up";
        if (score <= -1.0) return "Adventure / Family";
        if (score <= -0.2) return "Romance / Musical";
        if (score <= +0.2) return "Mystery / Thriller";
        if (score <= +1.0) return "Tragedy / Historical Drama";
        if (score <= +2.0) return "Drama / War";
        return "Horror / Psychological Thriller";
    }


    function updateScore() {

    const text = input.value.trim();

    // if there is no text in result clear it
    if (text === "") {
      scoreEl.textContent = "";
      return;
    }

    const result = sentiment(input.value);
    const score = result.normalizedScore.toFixed(3);

    // apply function to find genre
    const genre = mapSentimentToGenre(result.normalizedScore);
    
    scoreEl.textContent = " Genre " + genre + " | score: " + score;

    console.log(`Score: ${score}, Suggested Genre: ${genre}`);
    }


  // Run the analysis once when the page first loads
  updateScore();

  // Run the analysis again every time the button is clicked
  btn.addEventListener("click", updateScore);
});

//console.log("hello")
