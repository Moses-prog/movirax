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
    const details = await (tmdb.tvShows.details(id));
    const title = details.name || details.title || "";
    const description = details.overview || "";
    const image = details.backdrop_path ? `https://image.tmdb.org/t/p/w1280${details.backdrop_path}` : siteConfig.ogImage;
    
    return {
      title: `${title} | ${siteConfig.name}`,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: image }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      }
    };
  } catch (e) {
    return { title: siteConfig.name };
  }
}

export default async function Page(props: { params: Promise<{ id: number }> }) {
  const params = await props.params;
  const id = params.id;
  
  let jsonLd = null;
  try {
    const details = await (tmdb.tvShows.details(id));
    const title = details.name || details.title || "";
    const image = details.backdrop_path ? `https://image.tmdb.org/t/p/w1280${details.backdrop_path}` : siteConfig.ogImage;
    
    
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "TVSeries",
      "name": title,
      "image": image,
      "description": details.overview,
      "startDate": details.first_air_date,
    };
    
  } catch (e) {}

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ClientPage params={props.params as any} />
    </>
  );
}
