-- ============================================================
-- Seed Data — AI Hospital Bed Availability System
-- ============================================================

-- Demo Hospitals (Dhaka, Bangladesh area)
INSERT INTO hospitals (id, name, address, lat, lng, total_beds, available_beds, icu_beds, available_icu_beds, contact_phone, contact_email, specialties) VALUES
  (uuid_generate_v4(), 'Dhaka Medical College Hospital',    'Dhaka Medical College Rd, Dhaka 1000', 23.7261, 90.3968, 2400, 120, 120, 8,  '+880-2-55165088', 'info@dmch.gov.bd',    ARRAY['General', 'ICU', 'Cardiology', 'Neurology']),
  (uuid_generate_v4(), 'Square Hospital',                   '18/F Bir Uttam Qazi Nuruzzaman Sarak, Dhaka 1205', 23.7540, 90.3730, 400, 45, 40, 6,   '+880-2-8159457',  'info@squarehospital.com', ARRAY['Cardiology', 'Oncology', 'ICU']),
  (uuid_generate_v4(), 'United Hospital',                   'Plot 15, Rd 71, Dhaka 1212', 23.7974, 90.4168, 500, 62, 50, 10,  '+880-2-8836000',  'info@uhlbd.com',       ARRAY['General', 'ICU', 'Orthopedics']),
  (uuid_generate_v4(), 'Evercare Hospital Dhaka',           'Plot 81, Block E, Bashundhara R/A, Dhaka 1229', 23.8226, 90.4316, 450, 38, 60, 4,   '+880-2-55040110', 'info@evercarebd.com',  ARRAY['Cardiology', 'ICU', 'Neurology']),
  (uuid_generate_v4(), 'Popular Medical Centre',            'House 16, Rd 2, Dhanmondi, Dhaka 1205', 23.7461, 90.3760, 300, 80, 25, 12,  '+880-2-9110081',  'info@popularmedical.com', ARRAY['General', 'Pediatrics','Gynecology']),
  (uuid_generate_v4(), 'Ibn Sina Hospital Dhanmondi',       'House 48, Rd 9/A, Dhanmondi, Dhaka', 23.7381, 90.3723, 200, 22, 20, 3,   '+880-2-9125374',  'info@ibnsinahospital.com', ARRAY['General', 'ICU', 'Surgery']),
  (uuid_generate_v4(), 'National Heart Foundation Hospital','Mirpur Rd, Dhaka 1216',  23.8009, 90.3620, 350, 15, 80, 2,   '+880-2-8016877',  'info@nhf.gov.bd',    ARRAY['Cardiology', 'ICU']),
  (uuid_generate_v4(), 'Chittagong Medical College Hospital','K B Fazlul Kader Rd, Chittagong 4203', 22.3584, 91.8241, 1800, 210, 90, 14,  '+880-31-616293',  'info@cmch.gov.bd',   ARRAY['General', 'ICU', 'Trauma']);

-- Demo Ambulances
INSERT INTO ambulances (vehicle_number, status, current_lat, current_lng, driver_name, driver_phone) VALUES
  ('AMB-001', 'available', 23.7460, 90.3760, 'Karim Ahmed',   '+880-1711-000001'),
  ('AMB-002', 'available', 23.7530, 90.3920, 'Rahim Hossain', '+880-1711-000002'),
  ('AMB-003', 'busy',      23.7980, 90.4170, 'Salam Mia',     '+880-1711-000003'),
  ('AMB-004', 'available', 23.8220, 90.4310, 'Jabbar Khan',   '+880-1711-000004'),
  ('AMB-005', 'offline',   23.7260, 90.3970, 'Noor Islam',    '+880-1711-000005');

-- Demo Admin User  (password: "admin123" - bcrypt hash placeholder; replace with real hash in production)
INSERT INTO users (name, email, password_hash, role) VALUES
  ('System Admin', 'admin@healthbed.com', '$2b$10$PLACEHOLDER_REPLACE_WITH_REAL_HASH', 'admin'),
  ('Dispatcher 1', 'dispatcher@healthbed.com', '$2b$10$PLACEHOLDER_REPLACE_WITH_REAL_HASH', 'dispatcher');
