import { env } from "@/utils/env";
import { TMDB } from "tmdb-ts";

const fallbackToken = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
const token = env.TMDB_ACCESS_TOKEN || fallbackToken;

if (!token) {
  console.warn("TMDB_ACCESS_TOKEN is not defined. The app will fail to fetch movie data.");
}

export const tmdb = new TMDB(token || "dummy-token");
