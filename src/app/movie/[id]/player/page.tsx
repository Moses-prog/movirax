"use client";

import { tmdb } from "@/api/tmdb";
import { getMovieLastPosition } from "@/actions/histories";
import MoviePlayer from "@/components/sections/Movie/Player/Player";
import { Params } from "@/types";
import { isEmpty } from "@/utils/helpers";
import { Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { NextPage } from "next";
import { notFound } from "next/navigation";
import { use } from "react";

const MoviePlayerPage: NextPage<Params<{ id: number }>> = ({ params }) => {
  const { id } = use(params);

  const {
    data: movie,
    isPending,
    error,
  } = useQuery({
    queryFn: () => tmdb.movies.details(id),
    queryKey: ["movie-player-detail", id],
  });

  const { data: startAtResponse, isPending: isPendingStartAt } = useQuery({
    queryFn: () => getMovieLastPosition(id, "movie"),
    queryKey: ["movie-player-start-at", id],
  });

  // Extract the position from ActionResponse
  const startAt = (startAtResponse as any) || undefined;

  if (isPending || isPendingStartAt) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner size="lg" variant="simple" />
      </div>
    );
  }

  if (error || isEmpty(movie)) return notFound();

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center overflow-hidden">
      <MoviePlayer movie={movie} startAt={startAt} />
    </div>
  );
};

export default MoviePlayerPage;