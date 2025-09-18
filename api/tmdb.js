// api/movies.js
export default async function handler(req, res) {
  const { genreId, page = "1" } = req.query || {};
  if (!genreId) return res.status(400).json({ error: "Missing genreId" });

  const TMDB_KEY = process.env.TMDB_API_KEY;
  if (!TMDB_KEY) return res.status(500).json({ error: "Server not configured" });

  const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=en-US&page=${page}`;
  const tmdbRes = await fetch(url, { headers: { Authorization: `Bearer ${TMDB_KEY}` } });

  if (!tmdbRes.ok) return res.status(tmdbRes.status).json({ error: "TMDB error" });

  const data = await tmdbRes.json();
  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  return res.status(200).json(data);
}
