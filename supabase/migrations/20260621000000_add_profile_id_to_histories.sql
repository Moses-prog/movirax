-- Migration to support Multiple Profiles Watch History
-- Add profile_id to histories and watchlist tables

-- 1. Alter histories table
ALTER TABLE "public"."histories" 
ADD COLUMN "profile_id" text;

-- Drop the old unique constraint that didn't include profile_id
ALTER TABLE "public"."histories" 
DROP CONSTRAINT "histories_user_id_media_id_type_season_episode_key";

-- Create a new unique constraint that includes profile_id
-- We use coalesce(profile_id, 'default') so that existing rows with NULL profile_id don't violate uniqueness
CREATE UNIQUE INDEX histories_user_media_type_season_ep_profile_idx 
ON public.histories USING btree (user_id, media_id, type, season, episode, coalesce(profile_id, 'default'));

-- 2. Alter watchlist table
ALTER TABLE "public"."watchlist" 
ADD COLUMN "profile_id" text;

-- For watchlist, the primary key is (user_id, id, type). We need to change it to include profile_id
ALTER TABLE "public"."watchlist" 
DROP CONSTRAINT "watchlist_pkey";

ALTER TABLE "public"."watchlist" 
ADD CONSTRAINT "watchlist_pkey" PRIMARY KEY (user_id, id, type, profile_id);
