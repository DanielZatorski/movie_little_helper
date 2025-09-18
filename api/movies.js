// api/movies.js
export default async function handler(req, res) {
  const { genreId, page = "1" } = req.query || {};
  if (!genreId) return res.status(400).json({ error: "Missing genreId" });

  const TMDB_KEY = process.env.TMDB_KEY;
  const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=en-US&page=${page}`;
  const r = await fetch(url, { headers: { Authorization: `Bearer ${TMDB_KEY}` } });

  res
    .status(r.status)
    .setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300")
    .json(await r.json());
}
