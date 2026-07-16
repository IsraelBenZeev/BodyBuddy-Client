-- Adds support for up to 3 user-uploaded images per custom exercise (stored on Cloudinary,
-- this column only holds the resulting secure_url values).

ALTER TABLE user_custom_exercises
  ADD COLUMN image_urls TEXT[] NOT NULL DEFAULT '{}';
