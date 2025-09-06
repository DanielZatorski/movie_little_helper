

# movie_little_helper

## Sentiment-based movie recommendations for boring evenings.

**Having trouble picking a movie? Feeling a certain way but don't know what to watch?** `movie_little_helper` is here to help! This project aims to provide personalized movie recommendations by understanding your mood and suggesting films that fit.

##  Goal of the Project

The core idea is to simplify movie selection by aligning it with your current emotional state. Here's how we plan to achieve it:

1.  **Mood Detection/Selection:** Allow users to either express their mood through text (for sentiment analysis) or select from a predefined list of emotions.
2.  **Mood-to-Genre Mapping:** Map the detected or selected mood to appropriate random movie genre IDs from The Movie Database (TMDB or IMDB).
3.  **Movie Fetching:** Utilize the API to fetch a list of movies belonging to the matched genre by choosing three options.
4.  **Random Selection & Recommendation:** Randomly select 3 movies from the fetched list and present it to the user as a recommendation.

##  User Interface (UI)

The final goal is to have a simple, intuitive, and engaging web-based UI built with HTML, CSS, and JavaScript. Here's a conceptual breakdown:

### HTML Structure

* A clear header with the project title.
* An input area where users can either:
    * Type a sentence describing their mood (e.g., "I'm feeling adventurous tonight," "Just want something light and funny").
    * Select from a dropdown or a set of buttons representing different moods (e.g., "Happy," "Sad," "Excited," "Relaxed," "Thought-Provoking").
* A "Get Movie Recommendation" button.
* A dedicated section to display the recommended movie (title, synopsis, perhaps a poster).
* "Try Another" button to get a new recommendation within the same mood/genre.

### CSS Styling

* Clean and modern design.
* Responsive layout for various screen sizes (desktop, tablet, mobile).
* Visually appealing elements for mood selection and movie display.
* Consider subtle animations for a smoother user experience.

### JavaScript Functionality

* **Event Handling:** Listen for user input (typing, button clicks).
* **Sentiment Analysis (if implemented):**
    * Send user's mood text to a sentiment analysis API (or a local model if feasible).
    * Receive the sentiment score/classification.
* **Mood-to-Genre Logic:** Map the sentiment or selected mood to TMDB genre IDs. This logic will be crucial.
* **TMDB API Interaction:**
    * Construct API requests using the fetched genre IDs.
    * Handle API responses, extracting movie data.
    * Implement error handling for API calls.
* **Random Selection:** Implement logic to randomly pick 3 movies from the retrieved list.
* **DOM Manipulation:** Dynamically update the HTML to display the recommended movie details.



How It Works (Conceptual Flow for UI)

1.  **User Input:** The user interacts with the UI to specify their mood.
2.  **Mood Processing:**
    * If text input, JavaScript sends the text to a sentiment analysis function (internal or external API).
    * If selection, JavaScript directly uses the chosen mood.
3.  **Genre Mapping:** JavaScript uses the processed mood to determine relevant TMDB genre ID(s) (e.g., "Happy" -> "Comedy", "Romance").
4.  **API Call:** JavaScript constructs and sends a request to the TMDB API to fetch movies within those genre(s).
5.  **Movie Selection:** Upon receiving a successful response, JavaScript randomly picks one movie from the list.
6.  **Display:** The UI is updated with the selected movie's details (title, overview, poster, etc.).
