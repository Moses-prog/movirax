"use client";
import { getMovieDetails } from "@/actions/tmdb";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";


import { getMovieLastPosition } from "@/actions/histories";
import { fetchServerSettings } from "@/actions/settings";
import MoviePlayer from "@/components/sections/Movie/Player/Player";
import { Params } from "@/types";
import { isEmpty } from "@/utils/helpers";
import { Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { NextPage } from "next";
import { notFound } from "next/navigation";
import { use } from "react";

const MoviePlayerPageContent: NextPage<Params<{ id: number }>> = ({ params }) => {
  const { id } = use(params);

  const {
    data: movie,
    isPending,
    error,
  } = useQuery({
    queryFn: () => getMovieDetails(id),
    queryKey: ["movie-player-detail", id],
  });

  const { data: serverSettings, isPending: isPendingSettings } = useQuery({
    queryFn: () => fetchServerSettings(),
    queryKey: ["server-settings"],
  });

  const { data: startAtResponse, isPending: isPendingStartAt } = useQuery({
    queryFn: () => getMovieLastPosition(id, "movie"),
    queryKey: ["movie-player-start-at", id],
  });

  // Extract the position from ActionResponse
  const startAt = (startAtResponse as any) || undefined;

  if (isPending || isPendingStartAt || isPendingSettings) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner size="lg" variant="simple" />
      </div>
    );
  }

  if (error || isEmpty(movie)) return notFound();

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center overflow-hidden">
      <MoviePlayer movie={movie} startAt={startAt} defaultServer={serverSettings?.defaultMovie} />
    </div>
  );
};

const MoviePlayerPage: NextPage<Params<{ id: number }>> = ({ params }) => {
  return (
    <Suspense fallback={<div className="w-full h-screen flex items-center justify-center"><Spinner size="lg" variant="simple" /></div>}>
      <NuqsAdapter>
      <MoviePlayerPageContent params={params} />
          </NuqsAdapter>
    </Suspense>
  );
};

export default MoviePlayerPage;
