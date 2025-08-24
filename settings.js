// PURPOSE OF THIS SETTINGS FILE:
// 1. Detect how the user feels (positive/negative mood, energy level, intent).
// 2. Define baseline TMDB genre distributions (PRIORS) for different moods.
// 3. Allow explicit mentions of genres in user input to override mood-based logic.


// -----------------------------------------------------------------------------
// VOCABULARY LISTS (mood + intent detection)
// These arrays contain keywords, slang, and emojis users might type.
// They are matched against free-text input to infer emotional state and context.
// The results influence whether we use uplifting genres, cathartic dramas,
// scary thrillers, cozy family movies, etc.
// -----------------------------------------------------------------------------



const NEG = [
  "sad","down","depressed","lonely","blue","anxious","worried","nervous",
  "stressed","burnt","burned out","burnt out","heartbroken","tired","exhausted",
  "angry","mad","frustrated","hopeless","upset","broken","crying","lost",
  "miserable","gloomy","devastated","tragic","dark","melancholy","negative",
  "defeated","hurt","hate my life","can’t handle","anxiety","panic",
  "😞","😔","😢","😭","💔"
];

// POSITIVE mood words and phrases
const POS = [
  "happy","glad","excited","pumped","stoked","hyped","joyful","great",
  "awesome","celebrate","cheerful","positive","smiling","energetic","fantastic",
  "wonderful","amazing","thrilled","ecstatic","overjoyed","lit","dope","vibing",
  "good mood","life is good","love it","having fun","yay","wohoo","feeling good",
  "😊","😁","😂","😍","🎉","✨","🔥"
];

// Wanting uplifting / cheering-up content
const CHEER_UP = [
  "cheer","laugh","funny","feel-good","uplift","wholesome","light","silly",
  "make me smile","hilarious","comedy","jokes","positive vibes","lol","lmao",
  "😂","🤣","😆","😹"
];

// Lean-in (embracing sadness / catharsis)
const LEAN_IN = [
  "cry","tearjerker","sob","catharsis","heartbreaking","tragic","emotional",
  "sad movie","deep drama","make me cry","need to cry","😭","💔"
];

// High-arousal / hype / thrill-seeking
const HYPE = [
  "pumped","hyped","adrenaline","epic","blockbuster","thrill","intense",
  "edge of seat","exciting","fast-paced","explosive","wild","extreme",
  "let’s go","action-packed","crazy","insane","high energy","🔥","⚡"
];

// Low-arousal / calm / cozy
const CALM = [
  "chill","relax","background","cozy","gentle","quiet","slow","low-key",
  "soothing","peaceful","laid back","easy","calming","casual","simple",
  "comforting","snackable","bedtime watch","before sleep","zen","🛋️","😌"
];

// Scary / horror-seeking intent
const SCARE = [
  "scare","creepy","horror","spooky","terrify","nightmare","jump scare",
  "ghosts","paranormal","haunted","killer","slasher","dark","disturbing",
  "make me scream","creep me out","psychological","suspense","unsettling",
  "😱","👻","💀","🕷️","🧟"
];

// Learning / documentary / educational intent
const LEARN = [
  "learn","documentary","docu","true story","biopic","educational","history",
  "based on real events","inspired by real","science","nature","wildlife",
  "expose","non-fiction","facts","knowledge","explore","discovery",
  "want to know more","curious","informative","🧠","📚","🌍"
];

// Group: kids / family context
const GROUP_KIDS = [
  "kids","family","child","children","cartoon","animation","pixar","disney",
  "for my son","for my daughter","for the little ones","family friendly",
  "all ages","safe for kids","👶","🧒","👧","👦"
];

// Group: friends / party context
const GROUP_FRIENDS = [
  "friends","party","group","crew","hangout","watch together","buddies",
  "mates","squad","game night","fun night","laugh with friends",
  "movie night","drinks and a movie","🍻","🎉","👯"
];

// Date night / romantic context
const DATE_NIGHT = [
  "date","partner","girlfriend","boyfriend","romantic","romance","love story",
  "cuddle","with my partner","relationship","couples movie","intimate",
  "sweet","kiss","heart","love","romcom","romantic comedy",
  "💑","❤️","💕","😘"
];



// -----------------------------------------------------------------------------
// TMDB GENRES (official list with IDs)
// These come directly from TMDB's /genre/movie/list endpoint.
// We keep them here for reference and to allow explicit overrides.
// -----------------------------------------------------------------------------
const TMDB_GENRES = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
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


// -----------------------------------------------------------------------------
// EXPLICIT GENRES (user mentions → TMDB IDs)
// If a user explicitly types a genre name ("horror", "sci-fi", etc.),
// we map it here to its TMDB ID. This *overrides* mood-based suggestions.
// -----------------------------------------------------------------------------
const EXPLICIT_GENRES = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  "sci-fi": 878,
  scifi: 878,
  thriller: 53,
  war: 10752,
  western: 37,
  tv: 10770
};


// -----------------------------------------------------------------------------
// SENTIMENT PRIORS (baseline genre distributions)
// These are "default" probability distributions of TMDB genres for different
// sentiment score ranges (from -3 = very negative to +3 = very positive).
// The recommender starts with these weights and then adjusts based on intents
// (e.g., CHEER_UP, LEAN_IN, etc.) or explicit user mentions.
// Example: if sentiment ≈ -2.5 → Horror, Thriller, Crime, Mystery are weighted.
// -----------------------------------------------------------------------------
const PRIORS = [
  { min: -3, max: -2, genres: { 27:0.35, 53:0.25, 80:0.20, 9648:0.20 } },      // Horror, Thriller, Crime, Mystery
  { min: -2, max: -1, genres: { 18:0.40, 80:0.25, 9648:0.20, 10752:0.15 } },   // Drama, Crime, Mystery, War
  { min: -1, max:  0, genres: { 18:0.45, 10749:0.25, 36:0.15, 99:0.15 } },     // Drama, Romance, History, Documentary
  { min: -0.25, max: 0.25, genres: { 99:0.40, 18:0.30, 36:0.15, 10751:0.15 } },// Documentary, Drama, History, Family
  { min:  0, max:  1, genres: { 10749:0.30, 18:0.30, 10402:0.20, 35:0.20 } },  // Romance, Drama, Music, Comedy
  { min:  1, max:  2, genres: { 35:0.40, 12:0.25, 10751:0.15, 28:0.20 } },     // Comedy, Adventure, Family, Action
  { min:  2, max:  3, genres: { 35:0.35, 10749:0.30, 16:0.20, 14:0.15 } }      // Comedy, Romance, Animation, Fantasy
];
