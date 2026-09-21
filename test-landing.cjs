require('dotenv').config({ path: '.env.local' });
async function test() {
  const token = process.env.TMDB_ACCESS_TOKEN || process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
  console.log("Token starts with:", token ? token.substring(0, 10) : "UNDEFINED");
  const res = await fetch("https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&page=1", {
    headers: { Authorization: `Bearer ${token}`, accept: "application/json" }
  });
  const data = await res.json();
  console.log("Results count:", data.results ? data.results.length : data);
}
test();