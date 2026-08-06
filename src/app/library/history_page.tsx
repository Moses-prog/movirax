"use client";

import { useEffect, useState } from "react";
import { Button, Card, Select, SelectItem, Spinner } from "@heroui/react";
import { getViewedMovies, removeFromViewedMovies } from "@/actions/library";
import { addToast } from "@heroui/react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface ViewedMovie {
  id: number;
  movie_id: number;
  movie_type: "movie" | "tv";
  title: string;
  poster_path?: string | null;
  backdrop_path?: string;
  vote_average?: number;
  viewed_at: string;
}

type FilterType = "all" | "movie" | "tv";

export default function ViewHistoryPage() {
  const [movies, setMovies] = useState<ViewedMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const limit = 20;

  // Fetch viewed movies
  useEffect(() => {
    const fetchViewedMovies = async () => {
      setIsLoading(true);
      try {
        const result = await getViewedMovies(filterType, currentPage, limit);

        if (result.success) {
          setMovies((result.data || []) as unknown as ViewedMovie[]);
          setTotalPages(result.totalPages || 0);
        } else {
          addToast({
            title: "Error",
            description: result.error || "Failed to fetch view history",
            color: "danger",
          });
        }
      } catch (error) {
        console.error("Error fetching view history:", error);
        addToast({
          title: "Error",
          description: "An unexpected error occurred",
          color: "danger",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchViewedMovies();
  }, [filterType, currentPage]);

  const handleRemove = async (movieId: number, movieType: "movie" | "tv") => {
    try {
      const result = await removeFromViewedMovies(movieId, movieType);

      if (result.success) {
        setMovies(movies.filter((m) => !(m.movie_id === movieId && m.movie_type === movieType)));
        addToast({
          title: "Removed from view history",
          color: "success",
        });
      } else {
        addToast({
          title: "Error",
          description: result.error || "Failed to remove movie",
          color: "danger",
        });
      }
    } catch (error) {
      console.error("Error removing movie:", error);
      addToast({
        title: "Error",
        description: "An unexpected error occurred",
        color: "danger",
      });
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">View History</h1>
          <p className="text-foreground-500 text-sm mt-1">
            Movies and shows you've marked as watched
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Select
          label="Filter by type"
          size="sm"
          className="w-40"
          selectedKeys={[filterType]}
          onChange={(e) => {
            setFilterType(e.target.value as FilterType);
            setCurrentPage(1);
          }}
        >
          <SelectItem key="all" value="all">
            All
          </SelectItem>
          <SelectItem key="movie" value="movie">
            Movies
          </SelectItem>
          <SelectItem key="tv" value="tv">
            TV Shows
          </SelectItem>
        </Select>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      ) : movies.length === 0 ? (
        <Card className="py-20 px-6">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-4xl mb-4">📽️</div>
            <h2 className="text-xl font-bold mb-2">No view history yet</h2>
            <p className="text-foreground-500">
              Start watching movies to build your history
            </p>
          </div>
        </Card>
      ) : (
        <>
          {/* Movies Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((movie) => (
              <Link
                key={`${movie.movie_id}-${movie.movie_type}`}
                href={`/${movie.movie_type}/${movie.movie_id}`}
              >
                <div className="group relative">
                  {/* Poster */}
                  <div className="relative overflow-hidden rounded-lg bg-foreground-100 aspect-[2/3]">
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-foreground-400">No Image</span>
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end p-2">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full space-y-2">
                        <Button
                          isIconOnly
                          className="w-full bg-danger"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemove(movie.movie_id, movie.movie_type);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>

                    {/* Watched Badge */}
                    <div className="absolute top-2 right-2 bg-success/10 text-success rounded-full p-1 text-xs font-bold">
                      ✓ Watched
                    </div>
                  </div>

                  {/* Info */}
                  <div className="mt-2 space-y-1">
                    <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-foreground-500">
                      {formatDistanceToNow(new Date(movie.viewed_at), { addSuffix: true })}
                    </p>
                    {movie.vote_average && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-warning">★</span>
                        <span className="text-xs font-semibold">{movie.vote_average.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                isDisabled={currentPage === 1}
                variant="bordered"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    isIconOnly
                    variant={currentPage === page ? "solid" : "bordered"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                isDisabled={currentPage === totalPages}
                variant="bordered"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}