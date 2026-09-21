import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import ClientPage from "./Client";
import { Params } from "@/types";
import { tmdb } from "@/api/tmdb";

export async function generateMetadata(
  props: { params: Promise<{ id: number }> }
): Promise<Metadata> {
  const params = await props.params;
  const id = params.id;
  
  try {
    const details = await (tmdb.movies.details(id));
    const title = details.name || details.title || "";
    const description = details.overview || "";
    const image = details.backdrop_path ? `https://image.tmdb.org/t/p/w1280${details.backdrop_path}` : siteConfig.ogImage;
    
    return {
      title: `Watch ${title} | ${siteConfig.name}`,
      description,
      openGraph: {
        title: `Watch ${title}`,
        description,
        images: [{ url: image }],
      },
      twitter: {
        card: "summary_large_image",
        title: `Watch ${title}`,
        description,
        images: [image],
      },
    };
  } catch (error) {
    return {
      title: `Watch Movie | ${siteConfig.name}`,
    };
  }
}

export default function Page({ params }: { params: Promise<{ id: number }> }) {
  return <ClientPage params={params} />;
}