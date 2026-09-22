-- Enforce one assessment attempt per candidate per paper at database level.
-- Before applying this migration, resolve any existing duplicate rows.
CREATE UNIQUE INDEX IF NOT EXISTS assessment_attempts_one_per_candidate_paper
ON assessment_attempts (candidate_id, paper_id)
WHERE candidate_id IS NOT NULL AND paper_id IS NOT NULL;