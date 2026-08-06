"use server";

import { tmdb } from "@/api/tmdb";
import { UnifiedPlayerEventData } from "@/hooks/usePlayerEvents";
import { ActionResponse } from "@/types";
import { HistoryDetail } from "@/types/movie";
import { mutateMovieTitle, mutateTvShowTitle } from "@/utils/movies";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const syncHistory = async (
  data: UnifiedPlayerEventData,
  completed?: boolean,
): Promise<ActionResponse> => {
  if (!data || !data.mediaId || !data.mediaType) {
    return { success: false, message: "Missing required fields" };
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, message: "Authentication required" };
    }

    // 1. Fetch metadata from TMDB only if we don't have essential UI info
    // (Optimization: You could pass title/poster from the client to skip this API call)
    let media;
    try {
      media = data.mediaType === "movie"
        ? await tmdb.movies.details(Number(data.mediaId))
        : await tmdb.tvShows.details(Number(data.mediaId));
    } catch (tmdbErr) {
      console.error("TMDB Fetch Error:", tmdbErr);
      return { success: false, message: "Could not verify media details" };
    }

    // 2. Perform Upsert
    const { error } = await supabase
      .from("histories")
      .upsert(
        {
          user_id: user.id,
          media_id: Number(data.mediaId),
          type: data.mediaType,
          season: data.season || 0,
          episode: data.episode || 0,
          duration: Math.round(data.duration || 0),
          last_position: Math.round(data.currentTime || 0),
          completed: completed || false,
          adult: "adult" in media ? media.adult : false,
          backdrop_path: media.backdrop_path,
          poster_path: media.poster_path,
          release_date: "release_date" in media ? media.release_date : media.first_air_date,
          title: "title" in media ? mutateMovieTitle(media) : mutateTvShowTitle(media),
          vote_average: media.vote_average,
        },
        { onConflict: "user_id,media_id,type,season,episode" }
      );

    if (error) throw error;

    // Refresh the home page data
    revalidatePath("/");
    return { success: true, message: "Progress synced" };

  } catch (error: any) {
    console.error("Sync Error:", error.message);
    return { success: false, message: error.message || "Failed to sync progress" };
  }
};

export const getUserHistories = async (limit: number = 20): Promise<ActionResponse<HistoryDetail[]>> => {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, message: "Not authenticated" };

    const { data, error } = await supabase
      .from("histories")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false }) // Use updated_at so most recent watch is first
      .limit(limit);

    if (error) throw error;

    return { success: true, data: data as unknown as HistoryDetail[] };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const getMovieLastPosition = async (
  mediaId: number | string,
  mediaType: "movie" | "tv"
): Promise<ActionResponse<number>> => {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, message: "Not authenticated" };

    const { data, error } = await supabase
      .from("histories")
      .select("last_position")
      .eq("user_id", user.id)
      .eq("media_id", Number(mediaId))
      .eq("type", mediaType)
      .single(); // Fetch single record

    if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows found

    return {
      success: true,
      data: data?.last_position ?? 0
    };
  } catch (error: any) {
    console.error("Get Last Position Error:", error.message);
    return { success: false, message: error.message };
  }
};

export const getTvShowLastPosition = async (
  showId: number,
  season: number,
  episode: number
): Promise<ActionResponse<number>> => {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, message: "Not authenticated" };

    const { data, error } = await supabase
      .from("histories")
      .select("last_position")
      .eq("user_id", user.id)
      .eq("media_id", showId)
      .eq("type", "tv")
      .eq("season", season)
      .eq("episode", episode)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows found

    return {
      success: true,
      data: data?.last_position ?? 0
    };
  } catch (error: any) {
    console.error("Get TV Show Last Position Error:", error.message);
    return { success: false, message: error.message };
  }
};