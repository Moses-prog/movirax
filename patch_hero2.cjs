const fs = require("fs");
const lines = fs.readFileSync("src/components/sections/Landing/LandingPage.tsx", "utf8").split("\n");

const start = lines.findIndex(l => l.includes("const sortedByRating ="));
const end = lines.findIndex((l, i) => i > start && l.includes("setMovies(moviesData);"));

if (start !== -1 && end !== -1) {
  const replacement = `            const sortedByRating = [...validMovies].sort((a, b) => b.vote_average - a.vote_average);
            
            // Try to find a movie with a trailer from the top 5
            const top5 = sortedByRating.slice(0, 5);
            
            // Shuffle top 5 to randomize which one we try first
            const shuffledTop5 = [...top5].sort(() => 0.5 - Math.random());
            
            let heroMovie = shuffledTop5[0];
            let trailerKey = null;
            
            for (const movie of shuffledTop5) {
              try {
                const videoData = await getLandingMovieVideos(movie.id);
                if (videoData?.results) {
                  const trailer = videoData.results.find((v: any) => v.site === "YouTube" && v.type === "Trailer");
                  if (trailer) {
                    heroMovie = movie;
                    trailerKey = trailer.key;
                    break;
                  }
                }
              } catch (e) {
                console.error("Failed to fetch trailer for movie " + movie.id, e);
              }
            }
            
            const remainingMovies = validMovies.filter((m: any) => m.id !== heroMovie.id);
            const finalMoviesList = [heroMovie, ...remainingMovies.slice(0, 7)];

            const moviesData = finalMoviesList.map((movie: any) => ({
              id: movie.id,
              poster_path: movie.poster_path,
              backdrop_path: movie.backdrop_path,
              title: movie.title,
              vote_average: movie.vote_average,
            }));
            
            if (trailerKey) {
              moviesData[0].trailerKey = trailerKey;
            }
            
            setMovies(moviesData);`;
            
  lines.splice(start, end - start + 1, replacement);
  fs.writeFileSync("src/components/sections/Landing/LandingPage.tsx", lines.join("\n"));
  console.log("Replaced using line indices successfully!");
} else {
  console.log("Could not find start or end index.");
}