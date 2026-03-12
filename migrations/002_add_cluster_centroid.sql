-- Run this in Supabase SQL Editor to add spatial support for clusters
-- This allows drawing the 400m radius circles on the Live Map

ALTER TABLE clusters
ADD COLUMN IF NOT EXISTS centroid_lat float,
ADD COLUMN IF NOT EXISTS centroid_lon float;
