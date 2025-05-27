/*
  # Initial Schema Setup

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - role (text)
      - created_at (timestamp)
    
    - patients
      - id (uuid, primary key)
      - first_name (text)
      - surname (text)
      - gender (text)
      - date_of_birth (date)
      - id_type (text)
      - id_number (text)
      - address (text)
      - primary_contact (text)
      - secondary_contact (text)
      - created_at (timestamp)
      - updated_at (timestamp)
      - created_by (uuid, references users)
      - synced (boolean)
      - sync_error (text)
    
    - appointments
      - id (uuid, primary key)
      - patient_id (uuid, references patients)
      - date (date)
      - time_slot (text)
      - category (text)
      - notes (text)
      - created_at (timestamp)
      - updated_at (timestamp)
      - created_by (uuid, references users)
      - synced (boolean)
      - sync_error (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name text NOT NULL,
  surname text NOT NULL,
  gender text NOT NULL,
  date_of_birth date NOT NULL,
  id_type text NOT NULL,
  id_number text NOT NULL,
  address text NOT NULL,
  primary_contact text NOT NULL,
  secondary_contact text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id),
  synced boolean DEFAULT false,
  sync_error text
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  date date NOT NULL,
  time_slot text NOT NULL,
  category text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id),
  synced boolean DEFAULT false,
  sync_error text
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read all patients"
  ON patients
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert patients"
  ON patients
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update patients"
  ON patients
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can read all appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert appointments"
  ON appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update appointments"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (true);