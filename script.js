

//on comand line write "npx http-server ." to work on the file and then open http://localhost:8080
//remember to disable caching in Network tab in Dev Tool

// DOM wiring
const textEl  = document.querySelector("#text-input");
const btn     = document.querySelector("#analyze-btn");
const scoreEl = document.querySelector("#score");
let storedGenreSuggestion = null


const TMDB_GENRES = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  "Comedy": 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Fantasy: 14,
  History: 36,
  Horror: 27,
  Music: 10402,
  Mystery: 9648,
  Romance: 10749,
  "Science Fiction": 878,
  "TV Movie": 10770,
  Thriller: 53,
  War: 10752,
  Western: 37
};

const YOUR_API_KEY = "YOUR_API_KEY"

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
    const confidence = Math.round(result.score * 100) / 100 ; // Convert to percentage
    const genresSuggestion = pickGenrefromSentiment(sentiment)
    storedGenreSuggestion = genresSuggestion // overwrite null storedGenreSuggestion from the top
    scoreEl.textContent = `Sentiment: ${sentiment} (Confidence: ${confidence}). Your genre suggestions are: ${genresSuggestion}`;
  } catch (error) {
    console.error(error);
    scoreEl.textContent = "Something went wrong running the analysis.";
  } finally {
    // re-enable the button
    btn.disabled = false;
    btn.textContent = "Analyze";
  }

  //logic continues...

  console.log(storedGenreSuggestion)

  // use storedGenreSuggestion to map values in TMDB_GENRES
  const genreIds = storedGenreSuggestion.map(genre => TMDB_GENRES[genre]); 

  console.log(genreIds); 

  //helper to fetch data
  async function getMoviesByGenre(genreId, page, apiKey) {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&language=en-US&page=${page}`
    );
    return await res.json();
  }



  
  let genre1 = []
  let genre2 = []
  let genre3 = []
  //iterate through genreIds to parse into api request
  for (let i=0; i<genreIds.length;i++){

    let totalPages = 500 //Math.min(firstData.total_pages); // get total amount of pages from TMDB 
    //console.log(totalPages)
    let randomPage = Number(Math.floor(Math.random() * totalPages) + 1);
    //console.log(randomPage)

    const pageData = await getMoviesByGenre(genreIds[i], randomPage, YOUR_API_KEY);

    //  push each genreId into a variable
    if (i === 0) {
      for (let j = 0; j < pageData.results.length; j++) {
        genre1.push(pageData.results[j]);
      }
    } else if (i === 1) {
      for (let j = 0; j < pageData.results.length; j++) {
        genre2.push(pageData.results[j]);
      }
    } else if (i === 2) {
      for (let j = 0; j < pageData.results.length; j++) {
        genre3.push(pageData.results[j]);
      }
    }
  }

  console.log("Genre 1 Movies:", genre1);
  console.log("Genre 2 Movies:", genre2);
  console.log("Genre 3 Movies:", genre3);

















}


btn.addEventListener("click", analyzeInput);
btn.disabled = true; // keep disabled until model loads
btn.textContent = "Loading model…";

init();

//HELPERS

// get 3 random genre propositions  from arrays 
function pickGenrefromSentiment(label){

const moviesForNegative = [
  "Comedy",
  "Family",
  "Animation",
  "TV Movie",
  "Music",
  "Documentary",
  "Fantasy"
];

const moviesForPositive = [
  "Romance",
  "Horror",
  "Adventure",
  "Science Fiction",
  "Action",
  "Thriller"
];

const moviesForNeutral = [
  "Drama",
  "Mystery",
  "History",
  "War",
  "Western",
  "Crime"
];


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

