import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import ClientPage from "./Client";
import { Params } from "@/types";
import { tmdb } from "@/api/tmdb";

export async function generateMetadata(
  props: { params: Promise<{ id: number, season: number, episode: number }> }
): Promise<Metadata> {
  const params = await props.params;
  const id = params.id;
  const season = params.season;
  const episode = params.episode;
  
  try {
    const details = await (tmdb.tvShows.details(id));
    const title = details.name || details.title || "";
    const description = details.overview || "";
    const image = details.backdrop_path ? `https://image.tmdb.org/t/p/w1280${details.backdrop_path}` : siteConfig.ogImage;
    const fullTitle = `Watch ${title} S${season}E${episode}`;
    
    return {
      title: `${fullTitle} | ${siteConfig.name}`,
      description,
      openGraph: {
        title: fullTitle,
        description,
        images: [{ url: image }],
      },
      twitter: {
        card: "summary_large_image",
        title: fullTitle,
        description,
        images: [image],
      },
    };
  } catch (error) {
    return {
      title: `Watch TV Show | ${siteConfig.name}`,
    };
  }
}

export default function Page({ params }: { params: Promise<{ id: number, season: number, episode: number }> }) {
  return <ClientPage params={params} />;
}