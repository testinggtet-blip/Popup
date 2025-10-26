/*
  # Form Builder Database Schema

  1. New Tables
    - `forms`
      - `id` (uuid, primary key)
      - `name` (text) - Form name/title
      - `description` (text) - Form description
      - `fields` (jsonb) - Array of form fields with configurations
      - `global_rules` (jsonb) - Array of global conditional rules
      - `submit_action` (jsonb) - Submit action configuration
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
      - `user_id` (uuid) - Owner of the form (null for anonymous)
      - `is_published` (boolean) - Whether form is published
      - `slug` (text) - Unique URL-friendly identifier

    - `form_submissions`
      - `id` (uuid, primary key)
      - `form_id` (uuid, foreign key to forms)
      - `submission_data` (jsonb) - Form submission data
      - `submitted_at` (timestamptz) - Submission timestamp
      - `ip_address` (text) - Submitter IP address
      - `user_agent` (text) - Submitter user agent

  2. Security
    - Enable RLS on both tables
    - Forms: Anyone can read published forms, only owners can create/update/delete
    - Submissions: Anyone can create submissions for published forms, only form owners can read
    
  3. Indexes
    - Index on `user_id` for faster form lookups
    - Index on `slug` for URL-based form access
    - Index on `form_id` in submissions for faster queries
    - Index on `submitted_at` for sorting submissions
*/

-- Create forms table
CREATE TABLE IF NOT EXISTS forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  fields jsonb NOT NULL DEFAULT '[]'::jsonb,
  global_rules jsonb NOT NULL DEFAULT '[]'::jsonb,
  submit_action jsonb NOT NULL DEFAULT '{"type": "popup", "successMessage": "Form submitted successfully!", "errorMessage": "Error submitting form."}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid DEFAULT NULL,
  is_published boolean DEFAULT false,
  slug text UNIQUE NOT NULL
);

-- Create form_submissions table
CREATE TABLE IF NOT EXISTS form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  submission_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  submitted_at timestamptz DEFAULT now(),
  ip_address text DEFAULT NULL,
  user_agent text DEFAULT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_forms_user_id ON forms(user_id);
CREATE INDEX IF NOT EXISTS idx_forms_slug ON forms(slug);
CREATE INDEX IF NOT EXISTS idx_forms_is_published ON forms(is_published);
CREATE INDEX IF NOT EXISTS idx_submissions_form_id ON form_submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON form_submissions(submitted_at DESC);

-- Enable Row Level Security
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Forms policies
CREATE POLICY "Anyone can view published forms"
  ON forms FOR SELECT
  USING (is_published = true);

CREATE POLICY "Authenticated users can view their own forms"
  ON forms FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anonymous users can create forms"
  ON forms FOR INSERT
  WITH CHECK (user_id IS NULL);

CREATE POLICY "Authenticated users can create their own forms"
  ON forms FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own forms"
  ON forms FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anonymous users can update forms with no owner"
  ON forms FOR UPDATE
  USING (user_id IS NULL)
  WITH CHECK (user_id IS NULL);

CREATE POLICY "Users can delete their own forms"
  ON forms FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anonymous users can delete forms with no owner"
  ON forms FOR DELETE
  USING (user_id IS NULL);

-- Form submissions policies
CREATE POLICY "Anyone can submit to published forms"
  ON form_submissions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM forms
      WHERE forms.id = form_submissions.form_id
      AND forms.is_published = true
    )
  );

CREATE POLICY "Form owners can view submissions"
  ON form_submissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM forms
      WHERE forms.id = form_submissions.form_id
      AND forms.user_id = auth.uid()
    )
  );

CREATE POLICY "Anonymous form owners can view submissions"
  ON form_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM forms
      WHERE forms.id = form_submissions.form_id
      AND forms.user_id IS NULL
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_forms_updated_at ON forms;
CREATE TRIGGER update_forms_updated_at
  BEFORE UPDATE ON forms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
