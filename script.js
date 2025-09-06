

//on comand line write "npx http-server ." to work on the file and then open http://localhost:8080
//remember to disable caching in Network tab in Dev Tool

// DOM wiring
const textEl  = document.querySelector("#text-input");
const btn     = document.querySelector("#analyze-btn");
const scoreEl = document.querySelector("#score");

// Import the library from the web
import { pipeline } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0";

//variable to hold the model once its loaded
let analyze = null;

//loading model
async function init() {
  try {
    analyze = await pipeline(
      // 'text-classification' is the canonical task name in Transformers.js
        "text-classification",
        "Xenova/twitter-roberta-base-sentiment-latest",
        { dtype: "q8" } );

    //button showing that it is ready loading the model
    btn.textContent = "Analyze";
    btn.disabled = false;
  } catch (err) {
    console.error(err);
    scoreEl.textContent = "Failed to load the model";
  }
}

// run sentimental analysis on the input using DOM 
async function analyzeInput() {
  const text = textEl.value.trim(); // grab text from texbox
  if (text === "") {
    scoreEl.textContent = "Please enter text";
    return;
  }

  //disable button while analyzing
  btn.disabled = true;
  btn.textContent = "Analyzing…";


  // run analysis
  try {
    const results = await analyze(text);
    const result = results[0]; // get first result from analysis
    const sentiment = result.label;
    const confidence = result.score; // Convert to percentage
    scoreEl.textContent = `Sentiment: ${sentiment} (Confidence: ${confidence})`;
    
  } catch (error) {
    console.error(error);
    scoreEl.textContent = "Something went wrong running the analysis.";
  } finally {
    // re-enable the button
    btn.disabled = false;
    btn.textContent = "Analyze";
  }
}


btn.addEventListener("click", analyzeInput);
btn.disabled = true; // keep disabled until model loads
btn.textContent = "Loading model…";

init();


// get 3 random genre propositions  from arrays 
function pickGenrefromSentiment(label){

  const moviesForNegative = ["Comedy", "Family", "Animation", "TV Movie", "Music"];
  const moviesForPositive = ["Romance", "Horror", "Adventure", "Fantasy", "Science Fiction"];
  const moviesForNeutral = ["Drama", "Mystery", "Documentary", "History", "War"];

  if (label === "negative"){


    let suggestionNeg1 =  moviesForNegative[Math.floor(Math.random() * moviesForNegative.length)]
    let suggestionNeg2 =  moviesForNegative[Math.floor(Math.random() * moviesForNegative.length)]
    let suggestionNeg3 =  moviesForNegative[Math.floor(Math.random() * moviesForNegative.length)]
    let suggestion = [suggestionNeg1, suggestionNeg2, suggestionNeg3]

    return suggestion
    
  } else if (label === "positive"){

    let suggestionPos1 =  moviesForPositive[Math.floor(Math.random() * moviesForPositive.length)]
    let suggestionPos2 =  moviesForPositive[Math.floor(Math.random() * moviesForPositive.length)]
    let suggestionPos3 =  moviesForPositive[Math.floor(Math.random() * moviesForPositive.length)]
    let suggestion = [suggestionPos1, suggestionPos2, suggestionPos3]

    return suggestion
  } else {

    let moviesForNeutral1 =  moviesForNeutral[Math.floor(Math.random() * moviesForNeutral.length)]
    let moviesForNeutral2 =  moviesForNeutral[Math.floor(Math.random() * moviesForNeutral.length)]
    let moviesForNeutral3 =  moviesForNeutral[Math.floor(Math.random() * moviesForNeutral.length)]
    let suggestion = [moviesForNeutral1, moviesForNeutral2, moviesForNeutral3]

    return suggestion

  }


}


console.log(pickGenrefromSentiment("positive"))
