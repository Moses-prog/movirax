"use client";

import { useEffect, useState, useTransition } from "react";
import { addToast } from "@heroui/react";
import {
  addToViewedMovies,
  removeFromViewedMovies,
  checkInViewedMovies,
  getViewedMovies,
} from "@/actions/library";
import { queryClient } from "@/app/providers";
import { usePathname } from "next/navigation";
import useSupabaseUser from "./useSupabaseUser";

interface SavedMovieDetails {
  id: number;
  type: "movie" | "tv";
  title: string;
  poster_path?: string | null;
  backdrop_path?: string;
  release_date?: string;
  vote_average?: number;
  adult?: boolean;
}

interface UseViewedMoviesReturn {
  isViewed: boolean;
  isChecking: boolean;
  isPending: boolean;
  addToHistory: () => Promise<void>;
  removeFromHistory: () => Promise<void>;
  toggleViewedMovie: () => Promise<void>;
}

export function useViewedMovies(data: SavedMovieDetails): UseViewedMoviesReturn {
  const pathname = usePathname();
  const { data: user, isLoading: isUserLoading } = useSupabaseUser();
  const [isPending, startTransition] = useTransition();
  const [isViewed, setIsViewed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if movie is in viewed history on mount
  useEffect(() => {
    const checkViewedStatus = async () => {
      if (!user) {
        setIsChecking(false);
        setIsViewed(false);
        return;
      }

      setIsChecking(true);
      try {
        const result = await checkInViewedMovies(data.id, data.type);
        if (result.success) {
          setIsViewed(result.isInWatchlist); // reusing isInWatchlist for viewed status
        }
      } catch (error) {
        console.error("Error checking view history status:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkViewedStatus();
  }, [user, data.id, data.type]);

  const addToHistory = async () => {
    if (!user) {
      addToast({
        title: "You must be logged in to use this feature",
        color: "warning",
      });
      return;
    }

    startTransition(async () => {
      try {
        const viewedItem = {
          id: data.id,
          type: data.type,
          adult: data.adult,
          backdrop_path: data.backdrop_path,
          poster_path: data.poster_path || null,
          release_date: data.release_date,
          title: data.title,
          vote_average: data.vote_average,
        };

        const result = await addToViewedMovies(viewedItem);

        if (result.success) {
          setIsViewed(true);
          addToast({
            title: `${data.title} added to view history!`,
            color: "success",
          });

          if (pathname.includes("/library")) {
            queryClient.invalidateQueries({ queryKey: ["userWatchHistory"] });
          }
        } else {
          if (result.error === "This item is already in your view history") {
            setIsViewed(true);
            addToast({
              title: "Already in view history",
              description: `${data.title} is already in your view history`,
              color: "warning",
            });
          } else {
            addToast({
              title: "Error",
              description: result.error || "Failed to add to view history",
              color: "danger",
            });
          }
        }
      } catch (error) {
        console.error("Error adding to view history:", error);
        addToast({
          title: "Error",
          description: "An unexpected error occurred",
          color: "danger",
        });
      }
    });
  };

  const removeFromHistory = async () => {
    if (!user) {
      addToast({
        title: "You must be logged in to use this feature",
        color: "warning",
      });
      return;
    }

    startTransition(async () => {
      try {
        const result = await removeFromViewedMovies(data.id, data.type);

        if (result.success) {
          setIsViewed(false);
          addToast({
            title: `${data.title} removed from view history!`,
            color: "danger",
          });

          if (pathname.includes("/library")) {
            queryClient.invalidateQueries({ queryKey: ["userWatchHistory"] });
          }
        } else {
          addToast({
            title: "Error",
            description: result.error || "Failed to remove from view history",
            color: "danger",
          });
        }
      } catch (error) {
        console.error("Error removing from view history:", error);
        addToast({
          title: "Error",
          description: "An unexpected error occurred",
          color: "danger",
        });
      }
    });
  };

  const toggleViewedMovie = async () => {
    if (isViewed) {
      await removeFromHistory();
    } else {
      await addToHistory();
    }
  };

  return {
    isViewed,
    isChecking,
    isPending: isPending || isUserLoading,
    addToHistory,
    removeFromHistory,
    toggleViewedMovie,
  };
}

export default useViewedMovies;