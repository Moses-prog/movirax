import { env } from "@/utils/env";
import { isEmpty } from "@/utils/helpers";
import { TMDB } from "tmdb-ts";

const token = env.TMDB_ACCESS_TOKEN;

if (!token) {
  console.warn("TMDB_ACCESS_TOKEN is not defined. The app will fail to fetch movie data.");
}

export const tmdb = new TMDB(token || "dummy-token");
