export default async function handler(req, res) {
  const { genreId, page = "1" } = req.query || {};
  if (!genreId) return res.status(400).json({ error: "Missing genreId" });

  const KEY = process.env.TMDB_KEY;
  if (!KEY) return res.status(500).json({ error: "Server not configured: TMDB_API_KEY missing" });

  const isV3 = /^[a-f0-9]{32}$/.test(KEY); // v3 keys look like 32-hex chars
  const base = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=en-US&page=${page}`;
  const url = isV3 ? `${base}&api_key=${KEY}` : base;

  const headers = isV3
    ? { accept: "application/json" }
    : { accept: "application/json", Authorization: `Bearer ${KEY}` };

  const r = await fetch(url, { headers });

  if (!r.ok) {
    const body = await r.text();
    return res.status(r.status).json({ error: "TMDB error", status: r.status, body });
  }

  res
    .status(200)
    .setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300")
    .json(await r.json());
}