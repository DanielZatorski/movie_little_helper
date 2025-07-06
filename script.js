const Sentiment = require('sentiment')

const sentiment = new Sentiment()

const result = sentiment.analyze("I am feeling energized and happy!")

console.log(result.score)