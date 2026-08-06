"use client";

import SectionTitle from "@/components/ui/other/SectionTitle";
import Carousel from "@/components/ui/wrapper/Carousel";
import useDiscoverFilters from "@/hooks/useDiscoverFilters";
import ResumeCard from "./Cards/Resume";
import { useQuery } from "@tanstack/react-query";
import { getUserHistories } from "@/actions/histories";

const ContinueWatching: React.FC = () => {
  const { content } = useDiscoverFilters();
  
  const { data, isLoading, isError } = useQuery({
    queryFn: async () => {
      try {
        const result = await getUserHistories();
        
        if (!result.success) {
          console.warn("getUserHistories:", result.message);
          return { success: false, data: [], message: result.message };
        }
        
        return result;
      } catch (err: any) {
        console.error("getUserHistories error:", err.message);
        return { success: false, data: [], message: err.message };
      }
    },
    queryKey: ["continue-watching"],
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="min-h-[250px] flex items-center justify-center">
        <div className="animate-pulse text-neutral-500">Loading your history...</div>
      </div>
    );
  }

  // 2. Error State or No Data - silently return null if not authenticated or no history
  if (isError || !data?.success || !data?.data || data.data.length === 0) {
    return null; 
  }

  return (
    <section id="continue-watching" className="min-h-[250px] md:min-h-[300px]">
      <div className="z-3 flex flex-col gap-2">
        <SectionTitle color={content === "movie" ? "primary" : "warning"}>
          Continue Your Journey
        </SectionTitle>
        <Carousel>
          {data.data.map((media) => (
            <div
              key={media.id}
              className="embla__slide flex min-h-fit max-w-fit items-center px-1 py-2"
            >
              <ResumeCard media={media} />
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default ContinueWatching;