-- Migration: Add deleted_at columns to proposal adjustments and acceptances
-- Date: 2025-11-17

ALTER TABLE IF EXISTS proposal_adjustments
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

ALTER TABLE IF EXISTS proposal_acceptances
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

