"use client";
import BackToTopButton from "@/components/ui/button/BackToTopButton";
import { Spinner, Button } from "@heroui/react";
import { useInViewport } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { memo, useEffect } from "react";
import MoviePosterCard from "@/components/sections/Movie/Cards/Poster";
import Loop from "@/components/ui/other/Loop";
import PosterCardSkeleton from "@/components/ui/other/PosterCardSkeleton";
import { getLoadingLabel } from "@/utils/movies";
import { siteConfig } from "@/config/site";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function MovieListPage({ params }: { params: { param: string } }) {
  const { param } = params;
  const listConfig = siteConfig.queryLists.movies.find(m => m.param === param);
  if (!listConfig) return notFound();

  const { ref, inViewport } = useInViewport();

  const { data, isPending, status, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["movie-list", param],
      queryFn: ({ pageParam }) => listConfig.query(pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    });

  useEffect(() => {
    if (inViewport && !isPending && hasNextPage) {
      fetchNextPage();
    }
  }, [inViewport, isPending, hasNextPage, fetchNextPage]);

  if (status === "error") return notFound();

  return (
    <div className="flex flex-col gap-10 min-h-screen p-4 md:p-8 max-w-7xl mx-auto pt-24">
      <div className="flex items-center gap-4">
        <Button as={Link} href="/" isIconOnly variant="flat" className="rounded-full shrink-0">
          <ChevronLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-black">{listConfig.name}</h1>
          <p className="text-muted-foreground mt-1">Explore top movies</p>
        </div>
      </div>
      
      {isPending ? (
        <div className="flex flex-col items-center justify-center gap-10 mt-6">
          <div className="movie-grid w-full">
            <Loop count={20} prefix="SkeletonListPosterCard">
              <PosterCardSkeleton variant="bordered" />
            </Loop>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-10 mt-6">
          <div className="movie-grid w-full">
            {data.pages.map((page) => {
              return page.results.map((movie) => {
                return <MoviePosterCard key={movie.id} movie={movie} variant="bordered" />;
              });
            })}
          </div>
          <div ref={ref} className="flex h-24 items-center justify-center">
            {isFetchingNextPage && <Spinner size="lg" variant="wave" label={getLoadingLabel()} />}
            {!hasNextPage && !isPending && (
              <p className="text-muted-foreground text-center text-base">
                You have reached the end of the list.
              </p>
            )}
          </div>
          <BackToTopButton />
        </div>
      )}
    </div>
  );
}
