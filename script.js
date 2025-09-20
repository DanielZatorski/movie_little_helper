

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

//const YOUR_API_KEY = process.env.TMDB_TOKEN;


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

 //console.log(storedGenreSuggestion)

  // use storedGenreSuggestion to map values in TMDB_GENRES
  const genreIds = storedGenreSuggestion.map(genre => TMDB_GENRES[genre]); 

  //console.log(genreIds); 

  //helper to fetch data
  async function getMoviesByGenre_legacy(genreId, page, apiKey) {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&language=en-US&page=${page}`
    );
    return await res.json();
  }

  async function getMoviesByGenre(genreId, page) {
  const res = await fetch(`/api/movies?genreId=${genreId}&page=${page}`);
  if (!res.ok) throw new Error("Failed to fetch movies");
  return res.json();
  }


  //define empty arrays for storing movie suggestions
  let genre1 = []
  let genre2 = []
  let genre3 = []


  //iterate through genreIds to parse into api request
  for (let i=0; i<genreIds.length;i++){

    let totalPages = 500 //Math.min(firstData.total_pages); // get total amount of pages from TMDB 
    //console.log(totalPages)
    let randomPage = Number(Math.floor(Math.random() * totalPages) + 1);
    //console.log(randomPage)

    //const pageData = await getMoviesByGenre(genreIds[i], randomPage, YOUR_API_KEY);
    const pageData = await getMoviesByGenre(genreIds[i], randomPage);

    //  push each genreId into a variable to separate movue suggestions
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

  //get random movie from 20 movies stored in genre1/2/3
  let randomMovie1 = genre1[Number(Math.floor(Math.random() * genre1.length))]
  let randomMovie2 = genre2[Number(Math.floor(Math.random() * genre2.length))]
  let randomMovie3 = genre3[Number(Math.floor(Math.random() * genre3.length))]


  //console.log(randomMovie1);
  //console.log(randomMovie2);
  //console.log(randomMovie3);

  //NEXT STEPS:
  // store pictures using poster path from api call by
  //creating a link from a base link - https://image.tmdb.org/t/p/original/${poster_path}
  //
  //then use movie info below from API response to use:
  // title,release year, (Genre), popularity, description, poster in column view

  function getImageUrl(movie){

    let path = movie.poster_path

    let constructPath = `https://image.tmdb.org/t/p/original${path}`


    return constructPath

  }

  // overwriting css class attribute to become AllMovies as a result displaying results
  const hiddenBins = document.getElementsByClassName("hidden")
  hiddenBins[0].setAttribute("class","AllMovies")

  // DOM WIRING OF MOVIES
  // Movie 1
  document.getElementById("movie1title").textContent = `${randomMovie1.title} (${randomMovie1.release_date.substring(0,4)})⭐${Number(randomMovie1.vote_average).toFixed(0)}/10`
  document.getElementById("movie1Description").textContent = randomMovie1.overview;
  document.getElementById("img1").src = getImageUrl(randomMovie1);
  document.getElementById("img1").alt = randomMovie1.title;

  // Movie 2
  document.getElementById("movie2title").textContent = `${randomMovie2.title} (${randomMovie2.release_date.substring(0,4)})⭐${Number(randomMovie2.vote_average).toFixed(0)}/10`
  document.getElementById("movie2Description").textContent = randomMovie2.overview;
  document.getElementById("img2").src = getImageUrl(randomMovie2);
  document.getElementById("img2").alt = randomMovie2.title;

  // Movie 3
  document.getElementById("movie3title").textContent = `${randomMovie3.title} (${randomMovie3.release_date.substring(0,4)})⭐${Number(randomMovie3.vote_average).toFixed(0)}/10`
  document.getElementById("movie3Description").textContent = randomMovie3.overview;
  document.getElementById("img3").src = getImageUrl(randomMovie3);
  document.getElementById("img3").alt = randomMovie3.title;








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


let messages = ["Hi, I am a movie little helper 🤖",
      "Type how you feel, and I will help you select a movie! 🎞️",
      "Let's go!"
]

let heading = document.getElementById("dynamicText")


function printMessages(){

function printStringByLetter(messageIndex = 0) {
  const message = messages[messageIndex];
  let index = 0;
  heading.textContent = ""; // replace each message with empty field

  const intervalId = setInterval(() => {
    heading.textContent += message.charAt(index++); // add 1 char after each run to HTML output
    
    // stop writing when reaching full sentence
    if (index >= message.length) { 
      clearInterval(intervalId); 

      //continue going through each items from an array
      if (messageIndex + 1 < messages.length) {
        setTimeout(() => printStringByLetter(messageIndex + 1), 2000); // start with new message after finishing and add buffer of 2 seconds
      }
    }
  }, 80); // how fast it types
}

printStringByLetter()

}

printMessages(messages, true)