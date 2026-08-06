"use server";

import { createClient } from "@/utils/supabase/server";
import { requireAuth } from "./auth-helpers";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// Types
type ContentType = "movie" | "tv";
type FilterType = ContentType | "all";

interface WatchlistItem {
  id: number;
  type: ContentType;
  adult?: boolean;
  backdrop_path?: string;
  poster_path?: string | null;
  release_date?: string;
  title: string;
  vote_average?: number;
}

interface WatchlistEntry extends WatchlistItem {
  user_id: string;
  created_at: string;
}

interface ActionResponse<T = any> {
  success: boolean;
  error?: string;
  message?: string;
  data?: T;
}

interface WatchlistResponse extends ActionResponse<WatchlistEntry[]> {
  totalCount?: number;
  totalPages?: number;
  currentPage?: number;
  hasNextPage?: boolean;
}

interface CheckWatchlistResponse extends ActionResponse {
  isInWatchlist: boolean;
}

// ==========================================
// WATCHLIST FUNCTIONS
// ==========================================

/**
 * Add item to watchlist
 */
export async function addToWatchlist(item: WatchlistItem): Promise<ActionResponse<WatchlistEntry>> {
  try {
    // Ensure user is authenticated
    const user = await requireAuth();

    const supabase = await createClient();

    // Validate required fields
    if (!item.id || !item.type || !item.title) {
      return {
        success: false,
        error: "Missing required fields",
      };
    }

    // Validate type
    if (!["movie", "tv"].includes(item.type)) {
      return {
        success: false,
        error: 'Invalid content type. Must be "movie" or "tv"',
      };
    }

    // Get active profile
    const cookieStore = await cookies();
    const profileId = cookieStore.get('movira_active_profile')?.value || 'default';

    // Add to watchlist
    const { data, error } = await supabase
      .from("watchlist")
      .insert({
        user_id: user.id,
        profile_id: profileId,
        id: item.id,
        type: item.type,
        adult: item.adult || false,
        backdrop_path: item.backdrop_path || "",
        poster_path: item.poster_path || null,
        release_date: item.release_date || new Date().toISOString().split("T")[0],
        title: item.title,
        vote_average: item.vote_average || 0,
      })
      .select()
      .single<WatchlistEntry>();

    if (error) {
      // Check if it's a duplicate error
      if (error.code === "23505") {
        return {
          success: false,
          error: "This item is already in your watchlist",
        };
      }

      console.error("Watchlist add error:", error);
      return {
        success: false,
        error: "Failed to add item to watchlist",
      };
    }

    // Revalidate the watchlist page
    revalidatePath("/library");

    return {
      success: true,
      data,
      message: "Added to watchlist successfully",
    };
  } catch (error: any) {
    console.error("addToWatchlist error:", error.message);

    if (error.message.includes("Authentication required")) {
      return {
        success: false,
        error: "You must be logged in to add items to watchlist",
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

/**
 * Remove item from watchlist
 */
export async function removeFromWatchlist(
  id: number,
  type: ContentType
): Promise<ActionResponse> {
  try {
    // Ensure user is authenticated
    const user = await requireAuth();

    const supabase = await createClient();

    // Validate inputs
    if (!id || !type) {
      return {
        success: false,
        error: "Missing required parameters",
      };
    }

    // Validate type
    if (!["movie", "tv"].includes(type)) {
      return {
        success: false,
        error: "Invalid content type",
      };
    }

    // Get active profile
    const cookieStore = await cookies();
    const profileId = cookieStore.get('movira_active_profile')?.value || 'default';

    // Delete from watchlist
    const { error } = await supabase
      .from("watchlist")
      .delete()
      .eq("user_id", user.id)
      .eq("profile_id", profileId)
      .eq("id", id)
      .eq("type", type);

    if (error) {
      console.error("Watchlist remove error:", error);
      return {
        success: false,
        error: "Failed to remove item from watchlist",
      };
    }

    // Revalidate the watchlist page
    revalidatePath("/library");

    return {
      success: true,
      message: "Removed from watchlist successfully",
    };
  } catch (error: any) {
    console.error("removeFromWatchlist error:", error.message);

    if (error.message.includes("Authentication required")) {
      return {
        success: false,
        error: "You must be logged in to remove items from watchlist",
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

/**
 * Remove all items from watchlist
 */
export const removeAllWatchlist = async (type: ContentType): Promise<ActionResponse> => {
  try {
    // Ensure user is authenticated
    const user = await requireAuth();

    const supabase = await createClient();

    // Validate type
    if (!["movie", "tv"].includes(type)) {
      return {
        success: false,
        error: "Invalid content type",
      };
    }

    // Get active profile
    const cookieStore = await cookies();
    const profileId = cookieStore.get('movira_active_profile')?.value || 'default';

    // Delete from watchlist
    const { error } = await supabase
      .from("watchlist")
      .delete()
      .eq("user_id", user.id)
      .eq("profile_id", profileId)
      .eq("type", type);

    if (error) {
      console.error("Watchlist remove error:", error);
      return {
        success: false,
        error: "Failed to remove items from watchlist",
      };
    }

    // Revalidate the watchlist page
    revalidatePath("/library");

    return {
      success: true,
      message: "Removed items from watchlist successfully",
    };
  } catch (error: any) {
    console.error("removeAllWatchlist error:", error.message);

    if (error.message.includes("Authentication required")) {
      return {
        success: false,
        error: "You must be logged in to remove items from watchlist",
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
};

/**
 * Check if item is in watchlist
 */
export async function checkInWatchlist(
  id: number,
  type: ContentType
): Promise<CheckWatchlistResponse> {
  try {
    // Ensure user is authenticated
    const user = await requireAuth();

    const supabase = await createClient();

    // Get active profile
    const cookieStore = await cookies();
    const profileId = cookieStore.get('movira_active_profile')?.value || 'default';

    // Check if exists
    const { data, error } = await supabase
      .from("watchlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("profile_id", profileId)
      .eq("id", id)
      .eq("type", type)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      console.error("Watchlist check error:", error);
      return {
        success: false,
        isInWatchlist: false,
        error: "Failed to check watchlist status",
      };
    }

    return {
      success: true,
      isInWatchlist: !!data,
    };
  } catch (error: any) {
    console.error("checkInWatchlist error:", error.message);

    if (error.message.includes("Authentication required")) {
      return {
        success: false,
        isInWatchlist: false,
        error: "User not authenticated",
      };
    }

    return {
      success: false,
      isInWatchlist: false,
      error: "An unexpected error occurred",
    };
  }
}

/**
 * Get user's watchlist with pagination
 */
export async function getWatchlist(
  filterType: FilterType = "all",
  page: number = 1,
  limit: number = 20
): Promise<WatchlistResponse> {
  try {
    // Ensure user is authenticated
    const user = await requireAuth();

    const supabase = await createClient();

    // Calculate offset
    const offset = (page - 1) * limit;

    // Get active profile
    const cookieStore = await cookies();
    const profileId = cookieStore.get('movira_active_profile')?.value || 'default';

    // Build query
    let query = supabase
      .from("watchlist")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply type filter if not 'all'
    if (filterType !== "all" && ["movie", "tv"].includes(filterType)) {
      query = query.eq("type", filterType);
    }

    const { data, count, error } = await query;

    console.log(`[DEBUG] getWatchlist - User: ${user.id}, Profile: ${profileId}, Type: ${filterType}, Offset: ${offset}, Limit: ${limit}`);
    console.log(`[DEBUG] getWatchlist - Data length: ${data?.length}, Count: ${count}, Error: ${JSON.stringify(error)}`);

    if (error) {
      console.error("Watchlist fetch error:", error);
      return {
        success: false,
        data: [],
        error: "Failed to fetch watchlist",
      };
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return {
      success: true,
      data: (data as WatchlistEntry[]) || [],
      totalCount: count || 0,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
    };
  } catch (error: any) {
    console.error("getWatchlist error:", error.message);

    if (error.message.includes("Authentication required")) {
      return {
        success: false,
        data: [],
        error: "User not authenticated",
      };
    }

    return {
      success: false,
      data: [],
      error: "An unexpected error occurred",
    };
  }
}

/**
 * Toggle watchlist status
 */
export async function toggleWatchlist(item: WatchlistItem): Promise<ActionResponse> {
  const checkResult = await checkInWatchlist(item.id, item.type);

  if (!checkResult.success) {
    return checkResult;
  }

  if (checkResult.isInWatchlist) {
    return await removeFromWatchlist(item.id, item.type);
  } else {
    return await addToWatchlist(item);
  }
}

// ==========================================
// VIEWED MOVIES FUNCTIONS
// ==========================================

/**
 * Add item to viewed_movies
 */
export async function addToViewedMovies(item: WatchlistItem): Promise<ActionResponse<WatchlistEntry>> {
  try {
    // Ensure user is authenticated
    const user = await requireAuth();

    const supabase = await createClient();

    // Validate required fields
    if (!item.id || !item.type || !item.title) {
      return {
        success: false,
        error: "Missing required fields",
      };
    }

    // Validate type
    if (!["movie", "tv"].includes(item.type)) {
      return {
        success: false,
        error: 'Invalid content type. Must be "movie" or "tv"',
      };
    }

    // Get active profile
    const cookieStore = await cookies();
    const profileId = cookieStore.get('movira_active_profile')?.value || 'default';

    // Add to viewed_movies
    const supabaseAny = supabase as any;
    const insertResult = await supabaseAny
      .from("viewed_movies")
      .insert({
        user_id: user.id,
        profile_id: profileId,
        movie_id: item.id,
        movie_type: item.type,
        movie_data: {
          id: item.id,
          type: item.type,
          title: item.title,
          poster_path: item.poster_path,
          backdrop_path: item.backdrop_path,
          vote_average: item.vote_average,
          release_date: item.release_date,
          adult: item.adult,
        },
      })
      .select()
      .single();
    const { data, error } = insertResult;

    if (error) {
      // Check if it's a duplicate error
      if (error.code === "23505") {
        return {
          success: false,
          error: "This item is already in your view history",
        };
      }

      console.error("Viewed movies add error:", error);
      return {
        success: false,
        error: "Failed to add item to view history",
      };
    }

    // Revalidate the library page
    revalidatePath("/library");

    return {
      success: true,
      data,
      message: "Added to view history successfully",
    };
  } catch (error: any) {
    console.error("addToViewedMovies error:", error.message);

    if (error.message.includes("Authentication required")) {
      return {
        success: false,
        error: "You must be logged in to add items to view history",
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

/**
 * Remove item from viewed_movies
 */
export async function removeFromViewedMovies(
  id: number,
  type: ContentType
): Promise<ActionResponse> {
  try {
    // Ensure user is authenticated
    const user = await requireAuth();

    const supabase = await createClient();

    // Validate inputs
    if (!id || !type) {
      return {
        success: false,
        error: "Missing required parameters",
      };
    }

    // Validate type
    if (!["movie", "tv"].includes(type)) {
      return {
        success: false,
        error: "Invalid content type",
      };
    }

    // Get active profile
    const cookieStore = await cookies();
    const profileId = cookieStore.get('movira_active_profile')?.value || 'default';

    // Delete from viewed_movies
    const supabaseAny = supabase as any;
    const deleteResult = await supabaseAny
      .from("viewed_movies")
      .delete()
      .eq("user_id", user.id)
      .eq("profile_id", profileId)
      .eq("movie_id", id)
      .eq("movie_type", type);
    const { error } = deleteResult;

    if (error) {
      console.error("Viewed movies remove error:", error);
      return {
        success: false,
        error: "Failed to remove item from view history",
      };
    }

    // Revalidate the library page
    revalidatePath("/library");

    return {
      success: true,
      message: "Removed from view history successfully",
    };
  } catch (error: any) {
    console.error("removeFromViewedMovies error:", error.message);

    if (error.message.includes("Authentication required")) {
      return {
        success: false,
        error: "You must be logged in to remove items from view history",
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

/**
 * Check if item is in viewed_movies
 */
export async function checkInViewedMovies(
  id: number,
  type: ContentType
): Promise<CheckWatchlistResponse> {
  try {
    // Ensure user is authenticated
    const user = await requireAuth();

    const supabase = await createClient();

    // Get active profile
    const cookieStore = await cookies();
    const profileId = cookieStore.get('movira_active_profile')?.value || 'default';

    // Check if exists
    const supabaseAny = supabase as any;
    const checkResult = await supabaseAny
      .from("viewed_movies")
      .select("id")
      .eq("user_id", user.id)
      .eq("profile_id", profileId)
      .eq("movie_id", id)
      .eq("movie_type", type)
      .single();
    const { data, error } = checkResult;

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      console.error("Viewed movies check error:", error);
      return {
        success: false,
        isInWatchlist: false,
        error: "Failed to check view history status",
      };
    }

    return {
      success: true,
      isInWatchlist: !!data,
    };
  } catch (error: any) {
    console.error("checkInViewedMovies error:", error.message);

    if (error.message.includes("Authentication required")) {
      return {
        success: false,
        isInWatchlist: false,
        error: "User not authenticated",
      };
    }

    return {
      success: false,
      isInWatchlist: false,
      error: "An unexpected error occurred",
    };
  }
}

/**
 * Get user's viewed_movies history with pagination
 */
export async function getViewedMovies(
  filterType: FilterType = "all",
  page: number = 1,
  limit: number = 20
): Promise<WatchlistResponse> {
  try {
    // Ensure user is authenticated
    const user = await requireAuth();

    const supabase = await createClient();

    // Calculate offset
    const offset = (page - 1) * limit;

    // Get active profile
    const cookieStore = await cookies();
    const profileId = cookieStore.get('movira_active_profile')?.value || 'default';

    // Build query
    const supabaseAny = supabase as any;
    let query = supabaseAny
      .from("viewed_movies")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .eq("profile_id", profileId)
      .order("viewed_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply type filter if not 'all'
    if (filterType !== "all" && ["movie", "tv"].includes(filterType)) {
      query = query.eq("movie_type", filterType);
    }

    const queryResult = await query;
    const { data, count, error } = queryResult;

    if (error) {
      console.error("Viewed movies fetch error:", error);
      return {
        success: false,
        data: [],
        error: "Failed to fetch view history",
      };
    }

    // Transform the data to properly structure it
    const transformedData = (data || []).map((item: any) => ({
      id: item.id,
      movie_id: item.movie_id,
      movie_type: item.movie_type,
      title: item.movie_data?.title || "Unknown Title",
      poster_path: item.movie_data?.poster_path,
      backdrop_path: item.movie_data?.backdrop_path,
      vote_average: item.movie_data?.vote_average,
      viewed_at: item.viewed_at,
      user_id: item.user_id,
      created_at: item.created_at,
    }));

    const totalPages = Math.ceil((count || 0) / limit);

    return {
      success: true,
      data: transformedData,
      totalCount: count || 0,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
    };
  } catch (error: any) {
    console.error("getViewedMovies error:", error.message);

    if (error.message.includes("Authentication required")) {
      return {
        success: false,
        data: [],
        error: "User not authenticated",
      };
    }

    return {
      success: false,
      data: [],
      error: "An unexpected error occurred",
    };
  }
}

/**
 * Toggle viewed_movies status
 */
export async function toggleViewedMovie(item: WatchlistItem): Promise<ActionResponse> {
  const checkResult = await checkInViewedMovies(item.id, item.type);

  if (!checkResult.success) {
    return checkResult;
  }

  if (checkResult.isInWatchlist) {
    return await removeFromViewedMovies(item.id, item.type);
  } else {
    return await addToViewedMovies(item);
  }
}