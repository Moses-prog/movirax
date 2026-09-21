const fs = require("fs");
let content = fs.readFileSync("src/components/sections/Landing/LandingPage.tsx", "utf8");

const regex = /const sortedByRating = \[\.\.\.validMovies\]\.sort\(\(a, b\) => b\.vote_average - a\.vote_average\);[\s\S]*?setMovies\(moviesData\);\n          \}/m;

const replacement = `const sortedByRating = [...validMovies].sort((a, b) => b.vote_average - a.vote_average);
            
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
            
            setMovies(moviesData);
          }`;

if (content.match(regex)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync("src/components/sections/Landing/LandingPage.tsx", content);
  console.log("Replaced successfully!");
} else {
  console.log("Could not match regex.");
}