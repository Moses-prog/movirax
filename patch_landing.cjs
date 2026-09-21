const fs = require("fs");
let content = fs.readFileSync("src/components/sections/Landing/LandingPage.tsx", "utf8");

// We find the start index of "const fetchMovies = async () => {"
const startIndex = content.indexOf("const fetchMovies = async () => {");
// We find the end index of "fetchMovies();\n  }, []);"
const endText = "fetchMovies();\n  }, []);";
let endIndex = content.indexOf(endText);
if (endIndex === -1) {
    // maybe \r\n
    endIndex = content.indexOf("fetchMovies();\r\n  }, []);");
}

if (startIndex !== -1 && endIndex !== -1) {
    const before = content.substring(0, startIndex);
    const after = content.substring(endIndex + endText.length);
    
    const newFetchMovies = `const fetchMovies = async () => {
      try {
        const data = await getLandingMovies();

        if (data?.results && Array.isArray(data.results)) {
          const titles = data.results
            .filter((m: any) => m.title)
            .map((m: any) => ({ 
              title: m.title, 
              posterPath: m.poster_path 
            }));
          setTrendingTitles(titles);

          const validMovies = data.results.filter((movie: any) => movie.poster_path && movie.backdrop_path);
          
          if (validMovies.length > 0) {
            const sortedByRating = [...validMovies].sort((a, b) => b.vote_average - a.vote_average);
            
            const top5 = sortedByRating.slice(0, 5);
            const randomIndex = Math.floor(Math.random() * top5.length);
            const heroMovie = top5[randomIndex];
            
            const remainingMovies = validMovies.filter((m: any) => m.id !== heroMovie.id);
            const finalMoviesList = [heroMovie, ...remainingMovies.slice(0, 7)];

            const moviesData = finalMoviesList.map((movie: any) => ({
              id: movie.id,
              poster_path: movie.poster_path,
              backdrop_path: movie.backdrop_path,
              title: movie.title,
              vote_average: movie.vote_average,
            }));
            
            try {
              const videoData = await getLandingMovieVideos(moviesData[0].id);
              if (videoData?.results) {
                const trailer = videoData.results.find((v: any) => v.site === "YouTube" && v.type === "Trailer");
                if (trailer) {
                  moviesData[0].trailerKey = trailer.key;
                }
              }
            } catch (e) {
              console.error("Failed to fetch trailer:", e);
            }
            
            setMovies(moviesData);
          }
        }
      } catch (error) {
        console.error("Failed to fetch landing movies:", error);
      } finally {
        setMoviesLoading(false);
      }
    };

    fetchMovies();
  }, []);`;

    const newContent = before + newFetchMovies + after;
    fs.writeFileSync("src/components/sections/Landing/LandingPage.tsx", newContent);
    console.log("Successfully replaced fetchMovies!");
} else {
    console.log("Could not find start or end index", startIndex, endIndex);
}