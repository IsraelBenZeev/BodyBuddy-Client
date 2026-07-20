-- Optional link the user can attach to an exercise report (e.g. a video/image showing
-- what the exercise looks like), to help the developer identify it when reviewing.

ALTER TABLE exercise_reports
  ADD COLUMN example_url TEXT;
