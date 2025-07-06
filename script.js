const Sentiment = require('sentiment');

const sentiment = new Sentiment();

const result = sentiment.analyze("I am feeling energized I feel that I want to break things!");

console.log("Sentiment Score:", result.score);
console.log("Comparative Score:", result.comparative);
console.log("Words Found:", result.words);
console.log("All Details:", result);