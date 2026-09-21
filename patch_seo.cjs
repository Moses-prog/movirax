const fs = require("fs");
const path = require("path");

function refactorToSEO(dirPath, isMovie) {
  const pagePath = path.join(dirPath, "page.tsx");
  const clientPath = path.join(dirPath, "Client.tsx");
  
  if (!fs.existsSync(pagePath)) return;
  
  let originalCode = fs.readFileSync(pagePath, "utf8");
  
  // If already refactored, skip
  if (!originalCode.includes("\"use client\"")) return;

  // Rename original to Client.tsx
  let clientCode = originalCode;
  
  // Fix the export name for Client.tsx if we want, but not strictly necessary. Let's just write it.
  fs.writeFileSync(clientPath, clientCode);

  // Generate the new Server Component page.tsx
  const serverCode = `import { Metadata } from "next";
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
    const details = await (${isMovie ? "tmdb.movies.details(id)" : "tmdb.tvShows.details(id)"});
    const title = details.name || details.title || "";
    const description = details.overview || "";
    const image = details.backdrop_path ? \`https://image.tmdb.org/t/p/w1280\${details.backdrop_path}\` : siteConfig.ogImage;
    
    return {
      title: \`\${title} | \${siteConfig.name}\`,
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
    const details = await (${isMovie ? "tmdb.movies.details(id)" : "tmdb.tvShows.details(id)"});
    const title = details.name || details.title || "";
    const image = details.backdrop_path ? \`https://image.tmdb.org/t/p/w1280\${details.backdrop_path}\` : siteConfig.ogImage;
    
    ${isMovie ? `
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Movie",
      "name": title,
      "image": image,
      "description": details.overview,
      "dateCreated": details.release_date,
    };
    ` : `
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "TVSeries",
      "name": title,
      "image": image,
      "description": details.overview,
      "startDate": details.first_air_date,
    };
    `}
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
`;

  fs.writeFileSync(pagePath, serverCode);
}

refactorToSEO("src/app/movie/[id]", true);
refactorToSEO("src/app/tv/[id]", false);
console.log("Refactored Movie and TV detail pages for SEO (JSON-LD & og:image)");