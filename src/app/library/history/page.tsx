"use client";

import { useEffect, useState } from "react";
import { Button, Card, Spinner } from "@heroui/react";
import { Select, SelectItem } from "@heroui/select";
import { getViewedMovies, removeFromViewedMovies } from "@/actions/library";
import { addToast } from "@heroui/react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Icon } from "@iconify/react";

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

import UpgradeNotice from '@/components/ui/notice/Upgrade';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';

export default function ViewHistoryPage() {
  const { hasAccess, feature, isLoading: isFeatureLoading } = useFeatureAccess('f6'); // f6 is Watchlist & History
  const [movies, setMovies] = useState<ViewedMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const limit = 20;

  // Fetch viewed movies with error handling
  useEffect(() => {
    if (!hasAccess) {
      setIsLoading(false);
      return;
    }
    
    const fetchViewedMovies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getViewedMovies(filterType, currentPage, limit);

        if (!result) {
          setError("No response from server. Please try again.");
          setMovies([]);
          return;
        }

        if (result.success && result.data) {
          setMovies((result.data || []) as unknown as ViewedMovie[]);
          setTotalPages(result.totalPages || 0);
          setError(null);
        } else {
          setError(result.error || "Failed to fetch view history");
          setMovies([]);
          addToast({
            title: "Error",
            description: result.error || "Failed to fetch view history",
            color: "danger",
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
        console.error("Error fetching view history:", err);
        setError(errorMessage);
        setMovies([]);
        addToast({
          title: "Error",
          description: errorMessage,
          color: "danger",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchViewedMovies();
  }, [filterType, currentPage, hasAccess]);

  const handleRemove = async (movieId: number, movieType: "movie" | "tv") => {
    try {
      const result = await removeFromViewedMovies(movieId, movieType);

      if (!result) {
        addToast({
          title: "Error",
          description: "No response from server",
          color: "danger",
        });
        return;
      }

      if (result.success) {
        setMovies(movies.filter((m) => !(m.movie_id === movieId && m.movie_type === movieType)));
        addToast({
          title: "Success",
          description: "Removed from view history",
          color: "success",
        });
      } else {
        addToast({
          title: "Error",
          description: result.error || "Failed to remove movie",
          color: "danger",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      console.error("Error removing movie:", err);
      addToast({
        title: "Error",
        description: errorMessage,
        color: "danger",
      });
    }
  };

  if (isFeatureLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"/></div>;
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <UpgradeNotice 
          title="Upgrade Required" 
          description={feature && !feature.enabled 
            ? "This feature is currently disabled by the administrator."
            : "Watch History is a premium feature. Upgrade to Pro to track your viewed content!"}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4">
      {/* Centered Container */}
      <div className="w-full max-w-6xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon icon="mdi:history" width="32" height="32" className="text-primary" />
            <h1 className="text-4xl font-bold">View History</h1>
          </div>
          <p className="text-foreground-500 text-lg">
            Movies and shows you've marked as watched
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center justify-center gap-4">
          <Select
            label="Filter by type"
            size="sm"
            className="w-48"
            selectedKeys={[filterType]}
            onChange={(e) => {
              setFilterType(e.target.value as FilterType);
              setCurrentPage(1);
            }}
          >
            <SelectItem key="all">All</SelectItem>
            <SelectItem key="movie">Movies</SelectItem>
            <SelectItem key="tv">TV Shows</SelectItem>
          </Select>
        </div>

        {/* Error State */}
        {error && !isLoading && (
          <Card className="py-8 px-6 bg-danger/10 border border-danger">
            <div className="flex items-center gap-3">
              <Icon icon="mdi:alert-circle" width="24" className="text-danger" />
              <div>
                <h3 className="font-semibold text-danger">Error Loading History</h3>
                <p className="text-sm text-danger/70">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <Spinner size="lg" />
          </div>
        ) : movies.length === 0 ? (
          <Card className="py-20 px-6 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-7xl mb-4">📽️</div>
              <h2 className="text-2xl font-bold mb-2">No view history yet</h2>
              <p className="text-foreground-500 mb-6">
                Start watching movies to build your history
              </p>
              <Link href="/">
                <Button
                  color="primary"
                  startContent={<Icon icon="mdi:play-circle" />}
                >
                  Browse Movies
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <>
            {/* Movies Grid - Centered */}
            <div className="flex justify-center">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
                {movies.map((movie) => {
                  if (!movie) return null;
                  
                  return (
                    <Link
                      key={`${movie.movie_id}-${movie.movie_type}`}
                      href={`/${movie.movie_type}/${movie.movie_id}`}
                    >
                      <div className="group relative h-full">
                        {/* Poster */}
                        <div className="relative overflow-hidden rounded-xl bg-foreground-100 aspect-[2/3] shadow-lg hover:shadow-2xl transition-all duration-300">
                          {movie.poster_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                              alt={movie.title || "Movie"}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          ) : null}

                          {/* Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-end p-2">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full">
                              <Button
                                isIconOnly
                                className="w-full bg-danger"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleRemove(movie.movie_id, movie.movie_type);
                                }}
                                startContent={<Icon icon="mdi:trash" />}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>

                          {/* Watched Badge */}
                          <div className="absolute top-2 right-2 bg-success/90 text-white rounded-full px-2 py-1 text-xs font-bold flex items-center gap-1">
                            <Icon icon="mdi:check" width="14" />
                            Watched
                          </div>

                          {/* Fallback if no image */}
                          {!movie.poster_path && (
                            <div className="w-full h-full flex items-center justify-center bg-foreground-200">
                              <Icon icon="mdi:image-off" width="40" className="text-foreground-400" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="mt-3 space-y-1">
                          <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary transition-colors">
                            {movie.title || "Unknown Title"}
                          </h3>
                          <p className="text-xs text-foreground-500">
                            {movie.viewed_at ? formatDistanceToNow(new Date(movie.viewed_at), { addSuffix: true }) : "Unknown date"}
                          </p>
                          {movie.vote_average && (
                            <div className="flex items-center gap-1">
                              <Icon icon="mdi:star" width="14" className="text-warning" />
                              <span className="text-xs font-semibold">{movie.vote_average.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <Button
                  isDisabled={currentPage === 1}
                  variant="bordered"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  startContent={<Icon icon="mdi:chevron-left" />}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const pageNum = currentPage > 3 ? currentPage - 2 + i : i + 1;
                    return pageNum <= totalPages ? (
                      <Button
                        key={pageNum}
                        isIconOnly
                        variant={currentPage === pageNum ? "solid" : "bordered"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    ) : null;
                  })}
                </div>

                <Button
                  isDisabled={currentPage === totalPages}
                  variant="bordered"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  endContent={<Icon icon="mdi:chevron-right" />}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}