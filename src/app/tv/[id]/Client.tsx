"use client";

import { use, Suspense, useMemo } from "react";
import { tmdb } from "@/api/tmdb";
import { Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { NextPage } from "next";

// --- Dynamic Imports ---
const PhotosSection = dynamic(() => import("@/components/ui/other/PhotosSection"));
const TvShowRelatedSection = dynamic(() => import("@/components/sections/TV/Details/Related"));
const TvShowCastsSection = dynamic(() => import("@/components/sections/TV/Details/Casts"));
const TvShowBackdropSection = dynamic(() => import("@/components/sections/TV/Details/Backdrop"));
const TvShowOverviewSection = dynamic(() => import("@/components/sections/TV/Details/Overview"));
const TvShowsSeasonsSelection = dynamic(() => import("@/components/sections/TV/Details/Seasons"), {
  ssr: false, // Ensures client-side state for season selection remains stable
});

interface PageProps {
  params: Promise<{ id: string }>;
}

const TVShowDetailPage: NextPage<PageProps> = ({ params }) => {
  // 1. Unwrap params for Next.js 15
  const resolvedParams = use(params);
  const id = Number(resolvedParams.id);

  // 2. Fetch TV Details 
  // IMPORTANT: Added "videos" back to the array to prevent the "results of undefined" error
  const {
    data: tv,
    isPending,
    error,
  } = useQuery({
    queryKey: ["tv-show-detail", id],
    queryFn: () =>
      tmdb.tvShows.details(id, [
        "images",
        "videos",
        "credits",
        "keywords",
        "recommendations",
        "similar",
        "reviews",
        "watch/providers",
      ]),
    enabled: !!id,
  });

  // 3. Memoize seasons to prevent unnecessary re-renders when shifting layout
  const validSeasons = useMemo(() => {
    return tv?.seasons?.filter((s: any) => s.season_number > 0) || [];
  }, [tv?.seasons]);

  // 4. Loading State
  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" color="warning" label="Loading show details..." />
      </div>
    );
  }

  // 5. Error Handling
  if (error || !tv) return notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Suspense
        fallback={
          <div className="flex justify-center py-20">
            <Spinner size="lg" color="warning" />
          </div>
        }
      >
        <div className="flex flex-col gap-12">
          {/* SECTION 1: HERO / BACKDROP */}
          <TvShowBackdropSection tv={tv} />

          {/* SECTION 2: OVERVIEW & SYNOPSIS */}
          <TvShowOverviewSection
            onViewEpisodesClick={() => {
              const element = document.getElementById("seasons-selection-root");
              element?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            tv={tv}
          />

          {/* SECTION 3: CAST MEMBERS */}
          {tv.credits?.cast && <TvShowCastsSection casts={tv.credits.cast} />}

          {/* SECTION 4: MEDIA GALLERY */}
          {tv.images?.backdrops && (
            <PhotosSection images={tv.images.backdrops} type="tv" />
          )}

          {/* SECTION 5: SEASONS & EPISODES (Moved Down) */}
          <div id="seasons-selection-root" className="scroll-mt-10">
            <TvShowsSeasonsSelection 
              key={`tv-seasons-${id}`} 
              id={id} 
              seasons={validSeasons} 
            />
          </div>

          {/* SECTION 6: RECOMMENDATIONS / RELATED */}
          <TvShowRelatedSection tv={tv} />
        </div>
      </Suspense>
    </div>
  );
};

export default TVShowDetailPage;