"use client";

import { useEffect, useState } from "react";
import { BsCheckCircleFill, BsPlayCircle } from "react-icons/bs";
import IconButton from "./IconButton";
import useViewedMovies from "@/hooks/useViewedMovies";

interface ViewHistoryButtonProps {
  data: {
    id: number;
    type: "movie" | "tv";
    title: string;
    poster_path?: string | null;
    backdrop_path?: string;
    release_date?: string;
    vote_average?: number;
    adult?: boolean;
  };
  isTooltipDisabled?: boolean;
}

const ViewHistoryButton: React.FC<ViewHistoryButtonProps> = ({ data, isTooltipDisabled }) => {
  const { isViewed, isChecking, isPending, toggleViewedMovie } = useViewedMovies(data);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <IconButton
      onPress={toggleViewedMovie}
      icon={isViewed ? <BsCheckCircleFill size={20} /> : <BsPlayCircle size={20} />}
      variant={isViewed ? "shadow" : "faded"}
      color={isViewed ? "success" : "default"}
      isLoading={isChecking || isPending}
      tooltip={
        isTooltipDisabled
          ? undefined
          : isViewed
            ? "Remove from View History"
            : "Mark as Viewed"
      }
    />
  );
};

export default ViewHistoryButton;