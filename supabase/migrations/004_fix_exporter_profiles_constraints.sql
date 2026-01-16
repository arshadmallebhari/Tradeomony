-- Fix exporter_profiles table: Make moq and other fields optional
-- This allows users to complete onboarding without filling all fields

ALTER TABLE exporter_profiles
  ALTER COLUMN company_name DROP NOT NULL,
  ALTER COLUMN country DROP NOT NULL,
  ALTER COLUMN city DROP NOT NULL,
  ALTER COLUMN products DROP NOT NULL,
  ALTER COLUMN moq DROP NOT NULL;
