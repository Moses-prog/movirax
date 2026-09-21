const fs = require("fs");
let content = fs.readFileSync("src/components/sections/Landing/LandingPage.tsx", "utf8");

content = content.replace(/"use client";\n?/, `"use client";\nimport { getLandingMovies, getLandingMovieVideos } from "@/actions/tmdb";\n`);

content = content.replace(/const fetchMovies = async \(\) => \{[\s\S]*?setMoviesLoading\(false\);\n      \};\n\n      fetchMovies\(\);/m, `const fetchMovies = async () => {
        try {
          const data = await getLandingMovies();
          if (data && data.results) {
            const moviesData = data.results.slice(0, 10);
            setMovies(moviesData);
            
            if (moviesData.length > 0) {
              try {
                const videoData = await getLandingMovieVideos(moviesData[0].id);
                if (videoData && videoData.results) {
                  const trailer = videoData.results.find((vid: any) => vid.type === "Trailer" && vid.site === "YouTube");
                  if (trailer) {
                    setHeroTrailer(trailer.key);
                  }
                }
              } catch (e) {
                console.error("Failed to fetch trailer:", e);
              }
            }
          }
        } catch (error) {
          console.error("Failed to fetch landing movies:", error);
        } finally {
          setMoviesLoading(false);
        }
      };
      
      fetchMovies();`);

fs.writeFileSync("src/components/sections/Landing/LandingPage.tsx", content);
console.log("Patched LandingPage fetch");