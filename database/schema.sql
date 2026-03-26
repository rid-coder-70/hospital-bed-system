




DROP TABLE IF EXISTS dispatches CASCADE;
DROP TABLE IF EXISTS ambulances CASCADE;
DROP TABLE IF EXISTS hospitals CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS history_logs CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'hospital_admin', 'dispatcher')),
  hospital_id   UUID,  -- FK set after hospitals table creation (see below)
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);




CREATE TABLE IF NOT EXISTS hospitals (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                TEXT NOT NULL,
  address             TEXT,
  lat                 DOUBLE PRECISION NOT NULL,
  lng                 DOUBLE PRECISION NOT NULL,
  total_beds          INT NOT NULL DEFAULT 0,
  available_beds      INT NOT NULL DEFAULT 0,
  icu_beds            INT NOT NULL DEFAULT 0,
  available_icu_beds  INT NOT NULL DEFAULT 0,
  contact_phone       TEXT,
  contact_email       TEXT,
  specialties         TEXT[],
  is_active           BOOLEAN DEFAULT TRUE,
  ward_details        JSONB DEFAULT '[]'::jsonb,
  last_updated        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_users_hospital'
  ) THEN
    ALTER TABLE users
      ADD CONSTRAINT fk_users_hospital
      FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE SET NULL;
  END IF;
END$$;




CREATE TABLE IF NOT EXISTS ambulances (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_number   TEXT NOT NULL UNIQUE,
  status           TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'busy', 'offline')),
  current_lat      DOUBLE PRECISION,
  current_lng      DOUBLE PRECISION,
  driver_name      TEXT,
  driver_phone     TEXT,
  hospital_id      UUID REFERENCES hospitals(id) ON DELETE SET NULL,
  last_updated     TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);




CREATE TABLE IF NOT EXISTS ambulance_requests (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_lat         DOUBLE PRECISION NOT NULL,
  patient_lng         DOUBLE PRECISION NOT NULL,
  patient_name        TEXT,
  patient_phone       TEXT,
  required_icu        BOOLEAN DEFAULT FALSE,
  priority            TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status              TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'dispatched', 'en_route', 'completed', 'cancelled')),
  assigned_ambulance  UUID REFERENCES ambulances(id) ON DELETE SET NULL,
  assigned_hospital   UUID REFERENCES hospitals(id) ON DELETE SET NULL,
  notes               TEXT,
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);




CREATE TABLE IF NOT EXISTS bed_update_events (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id         UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  prev_available      INT,
  new_available       INT,
  prev_icu_available  INT,
  new_icu_available   INT,
  updated_by          UUID REFERENCES users(id) ON DELETE SET NULL,
  timestamp           TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);




CREATE INDEX IF NOT EXISTS idx_hospitals_location     ON hospitals (lat, lng);
CREATE INDEX IF NOT EXISTS idx_hospitals_available    ON hospitals (available_beds, available_icu_beds);
CREATE INDEX IF NOT EXISTS idx_ambulances_status      ON ambulances (status);
CREATE INDEX IF NOT EXISTS idx_requests_status        ON ambulance_requests (status);
CREATE INDEX IF NOT EXISTS idx_bed_events_hospital    ON bed_update_events (hospital_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_users_hospital         ON users (hospital_id);
