




INSERT INTO hospitals (id, name, address, lat, lng, total_beds, available_beds, icu_beds, available_icu_beds, contact_phone, contact_email, specialties) VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001', 'Dhaka Medical College Hospital',    'Dhaka Medical College Rd, Dhaka 1000', 23.7261, 90.3968, 2400, 120, 120, 8,  '+880-2-55165088', 'info@dmch.gov.bd',    ARRAY['General', 'ICU', 'Cardiology', 'Neurology']),
  ('a1b2c3d4-0002-0002-0002-000000000002', 'Square Hospital',                   '18/F Bir Uttam Qazi Nuruzzaman Sarak, Dhaka 1205', 23.7540, 90.3730, 400, 45, 40, 6,   '+880-2-8159457',  'info@squarehospital.com', ARRAY['Cardiology', 'Oncology', 'ICU']),
  ('a1b2c3d4-0003-0003-0003-000000000003', 'United Hospital',                   'Plot 15, Rd 71, Dhaka 1212', 23.7974, 90.4168, 500, 62, 50, 10,  '+880-2-8836000',  'info@uhlbd.com',       ARRAY['General', 'ICU', 'Orthopedics']),
  ('a1b2c3d4-0004-0004-0004-000000000004', 'Evercare Hospital Dhaka',           'Plot 81, Block E, Bashundhara R/A, Dhaka 1229', 23.8226, 90.4316, 450, 38, 60, 4,   '+880-2-55040110', 'info@evercarebd.com',  ARRAY['Cardiology', 'ICU', 'Neurology']),
  ('a1b2c3d4-0005-0005-0005-000000000005', 'Popular Medical Centre',            'House 16, Rd 2, Dhanmondi, Dhaka 1205', 23.7461, 90.3760, 300, 80, 25, 12,  '+880-2-9110081',  'info@popularmedical.com', ARRAY['General', 'Pediatrics','Gynecology']),
  ('a1b2c3d4-0006-0006-0006-000000000006', 'Ibn Sina Hospital Dhanmondi',       'House 48, Rd 9/A, Dhanmondi, Dhaka', 23.7381, 90.3723, 200, 22, 20, 3,   '+880-2-9125374',  'info@ibnsinahospital.com', ARRAY['General', 'ICU', 'Surgery']),
  ('a1b2c3d4-0007-0007-0007-000000000007', 'National Heart Foundation Hospital','Mirpur Rd, Dhaka 1216',  23.8009, 90.3620, 350, 15, 80, 2,   '+880-2-8016877',  'info@nhf.gov.bd',    ARRAY['Cardiology', 'ICU']),
  ('a1b2c3d4-0008-0008-0008-000000000008', 'Chittagong Medical College Hospital','K B Fazlul Kader Rd, Chittagong 4203', 22.3584, 91.8241, 1800, 210, 90, 14,  '+880-31-616293',  'info@cmch.gov.bd',   ARRAY['General', 'ICU', 'Trauma']),


  ('b1c2d3e4-0001-0001-0001-000000000001', 'Evercare Hospital Chattogram', 'Ananna R/A, CDA, Hathazari, Chittagong', 22.3789, 91.8080, 470, 80, 50, 10, '+880-31-000001', 'info.ctg@evercare.com', ARRAY['Oncology', 'ICU', 'Cardiology']),
  ('b1c2d3e4-0001-0001-0001-000000000002', 'Imperial Hospital Limited', 'Zakir Hossain Rd, Pahartali, Chittagong', 22.3569, 91.7832, 375, 50, 45, 5, '+880-31-000002', 'info@imperial.com', ARRAY['General', 'Cardiology', 'ICU']),
  ('b1c2d3e4-0001-0001-0001-000000000003', 'Max Hospital & Diagnostic', 'Mehedibag, Chittagong', 22.3580, 91.8220, 200, 30, 20, 2, '+880-31-000003', 'info@maxctg.com', ARRAY['Neurology', 'Pediatrics']),
  ('b1c2d3e4-0001-0001-0001-000000000004', 'Cox''s Bazar Medical College Hospital', 'Cox''s Bazar Sadar', 21.4397, 92.0003, 500, 120, 30, 0, '+880-341-00004', 'info@coxmc.gov.bd', ARRAY['General', 'Trauma']),


  ('b1c2d3e4-0002-0001-0001-000000000001', 'Rajshahi Medical College Hospital', 'Rajpara, Rajshahi', 24.3736, 88.5910, 1200, 350, 60, 15, '+880-721-00001', 'info@rmch.gov.bd', ARRAY['General', 'ICU', 'Surgery']),
  ('b1c2d3e4-0002-0001-0001-000000000002', 'Islami Bank Medical College Hospital', 'Nawdapara, Rajshahi', 24.3745, 88.5980, 250, 45, 15, 3, '+880-721-00002', 'info@ibmch.com', ARRAY['General', 'Cardiology']),
  ('b1c2d3e4-0002-0001-0001-000000000003', 'Rajshahi Royal Hospital', 'Greater Road, Rajshahi', 24.3750, 88.6010, 150, 20, 10, 1, '+880-721-00003', 'royal@rajshahi.com', ARRAY['Pediatrics']),
  ('b1c2d3e4-0002-0001-0001-000000000004', 'Bogra Shaheed Ziaur Rahman Med College', 'Silimpur, Bogra', 24.8115, 89.3625, 500, 90, 40, 8, '+880-51-00004', 'info@szmc.gov.bd', ARRAY['General', 'Trauma', 'Burn']),
  ('b1c2d3e4-0002-0001-0001-000000000005', 'Pabna General Hospital', 'Hospital Rd, Pabna', 24.0084, 89.2435, 250, 60, 10, 0, '+880-731-00005', 'info@pabnagh.gov.bd', ARRAY['General']),


  ('b1c2d3e4-0003-0001-0001-000000000001', 'Khulna Medical College Hospital', 'Boyra, Khulna', 22.8246, 89.5411, 1000, 200, 50, 5, '+880-41-00001', 'info@kmch.gov.bd', ARRAY['General', 'ICU', 'Surgery']),
  ('b1c2d3e4-0003-0001-0001-000000000002', 'Gazi Medical College Hospital', 'Sonadanga, Khulna', 22.8200, 89.5400, 300, 50, 25, 4, '+880-41-00002', 'info@gazimedical.com', ARRAY['Gynecology', 'ICU']),
  ('b1c2d3e4-0003-0001-0001-000000000003', 'Abu Naser Specialised Hospital', 'Mujgunni Highway, Khulna', 22.8360, 89.5385, 200, 30, 30, 2, '+880-41-00003', 'info@abunaser.gov.bd', ARRAY['Cardiology', 'Nephrology']),
  ('b1c2d3e4-0003-0001-0001-000000000004', 'Jessore General Hospital', 'Jessore Sadar', 23.1670, 89.2085, 400, 110, 20, 1, '+880-421-00004', 'info@jessoregh.gov.bd', ARRAY['General', 'Trauma']),
  ('b1c2d3e4-0003-0001-0001-000000000005', 'Satkhira Medical College Hospital', 'Satkhira Sadar', 22.7095, 89.0725, 500, 140, 20, 0, '+880-471-00005', 'info@smc.gov.bd', ARRAY['General']),


  ('b1c2d3e4-0004-0001-0001-000000000001', 'Sylhet MAG Osmani Medical College', 'Kajalshah, Sylhet', 24.9015, 91.8546, 1200, 250, 70, 10, '+880-821-00001', 'info@magomc.gov.bd', ARRAY['General', 'ICU', 'Neurology']),
  ('b1c2d3e4-0004-0001-0001-000000000002', 'Mount Adora Hospital', 'Akhalia, Sylhet', 24.9000, 91.8650, 200, 40, 20, 5, '+880-821-00002', 'info@mountadora.com', ARRAY['General', 'Pediatrics']),
  ('b1c2d3e4-0004-0001-0001-000000000003', 'Al Haramain Hospital', 'Subhanighat, Sylhet', 24.8900, 91.8700, 250, 60, 30, 12, '+880-821-00003', 'info@alharamain.com', ARRAY['Cardiology', 'ICU']),
  ('b1c2d3e4-0004-0001-0001-000000000004', 'Jalalabad Ragib-Rabeya Med College', 'Pathantula, Sylhet', 24.9125, 91.8465, 500, 100, 40, 6, '+880-821-00004', 'info@jrrmc.com', ARRAY['General', 'Surgery']),
  ('b1c2d3e4-0004-0001-0001-000000000005', 'Moulvibazar Sadar Hospital', 'Moulvibazar', 24.4845, 91.7680, 250, 80, 10, 0, '+880-861-00005', 'info@mbgh.gov.bd', ARRAY['General']),


  ('b1c2d3e4-0005-0001-0001-000000000001', 'Sher-e-Bangla Medical College Hospital', 'Alekanda, Barisal', 22.6865, 90.3620, 1000, 180, 40, 4, '+880-431-00001', 'info@sbmch.gov.bd', ARRAY['General', 'ICU', 'Burn']),
  ('b1c2d3e4-0005-0001-0001-000000000002', 'Islami Bank Hospital Barisal', 'Chandmari, Barisal', 22.6900, 90.3550, 100, 25, 10, 2, '+880-431-00002', 'ibhb@islamibank.com', ARRAY['General']),
  ('b1c2d3e4-0005-0001-0001-000000000003', 'Rahat Anwar Hospital', 'Band Road, Barisal', 22.6950, 90.3650, 150, 40, 15, 3, '+880-431-00003', 'info@rahatanwar.com', ARRAY['Surgery', 'Pediatrics']),
  ('b1c2d3e4-0005-0001-0001-000000000004', 'Patuakhali Medical College Hospital', 'Patuakhali Sadar', 22.3667, 90.3333, 250, 80, 10, 0, '+880-441-00004', 'info@pmch.gov.bd', ARRAY['General']),
  ('b1c2d3e4-0005-0001-0001-000000000005', 'Bhola District Hospital', 'Bhola Sadar', 22.6865, 90.6500, 200, 50, 5, 0, '+880-491-00005', 'info@bholahosp.gov.bd', ARRAY['General']),


  ('b1c2d3e4-0006-0001-0001-000000000001', 'Rangpur Medical College Hospital', 'Medical More, Rangpur', 25.7538, 89.2437, 1000, 250, 50, 8, '+880-521-00001', 'info@rmch.gov.bd', ARRAY['General', 'ICU', 'Trauma']),
  ('b1c2d3e4-0006-0001-0001-000000000002', 'Prime Medical College Hospital', 'Pirjabad, Rangpur', 25.7480, 89.2400, 500, 120, 30, 4, '+880-521-00002', 'info@pmch.com', ARRAY['General', 'Endocrinology']),
  ('b1c2d3e4-0006-0001-0001-000000000003', 'Dinajpur M. Abdur Rahim Med College', 'Dinajpur Sadar', 25.5946, 88.6534, 500, 150, 20, 2, '+880-531-00003', 'info@mar-mc.gov.bd', ARRAY['General', 'Pediatrics']),
  ('b1c2d3e4-0006-0001-0001-000000000004', 'Thakurgaon Sadar Hospital', 'Thakurgaon', 26.0270, 88.4630, 200, 70, 5, 0, '+880-561-00004', 'info@tsgh.gov.bd', ARRAY['General']),
  ('b1c2d3e4-0006-0001-0001-000000000005', 'Kurigram Sadar Hospital', 'Kurigram', 25.8090, 89.6515, 150, 40, 5, 0, '+880-581-00005', 'info@ksgh.gov.bd', ARRAY['General']),


  ('b1c2d3e4-0007-0001-0001-000000000001', 'Mymensingh Medical College Hospital', 'Charpara, Mymensingh', 24.7455, 90.4079, 1300, 300, 60, 5, '+880-91-00001', 'info@mmch.gov.bd', ARRAY['General', 'ICU', 'Burn']),
  ('b1c2d3e4-0007-0001-0001-000000000002', 'Community Based Medical College', 'Winnerpar, Mymensingh', 24.7500, 90.4050, 400, 80, 20, 3, '+880-91-00002', 'info@cbmcb.com', ARRAY['General']),
  ('b1c2d3e4-0007-0001-0001-000000000003', 'Jamalpur General Hospital', 'Jamalpur Sadar', 24.9220, 89.9480, 250, 60, 10, 0, '+880-981-00003', 'info@jgh.gov.bd', ARRAY['General']),
  ('b1c2d3e4-0007-0001-0001-000000000004', 'Netrokona Modern District Hospital', 'Netrokona', 24.8810, 90.7250, 150, 30, 5, 0, '+880-951-00004', 'info@netrokona.gov.bd', ARRAY['General']),
  ('b1c2d3e4-0007-0001-0001-000000000005', 'Sherpur District Hospital', 'Sherpur', 25.0190, 90.0150, 100, 20, 2, 0, '+880-931-00005', 'info@sherpur.gov.bd', ARRAY['General'])

ON CONFLICT (id) DO NOTHING;


INSERT INTO ambulances (vehicle_number, status, current_lat, current_lng, driver_name, driver_phone) VALUES
  ('AMB-001', 'available', 23.7460, 90.3760, 'Karim Ahmed',   '+880-1711-000001'),
  ('AMB-002', 'available', 23.7530, 90.3920, 'Rahim Hossain', '+880-1711-000002'),
  ('AMB-003', 'busy',      23.7980, 90.4170, 'Salam Mia',     '+880-1711-000003'),
  ('AMB-004', 'available', 23.8220, 90.4310, 'Jabbar Khan',   '+880-1711-000004'),
  ('AMB-005', 'offline',   23.7260, 90.3970, 'Noor Islam',    '+880-1711-000005')
ON CONFLICT (vehicle_number) DO NOTHING;






INSERT INTO users (name, email, password_hash, role, hospital_id) VALUES

  ('System Admin', 'admin@healthbed.com', '$2b$10$Q6GXzxkC/sPxfNVhGYtDFeH4ewvbcvevr4W1GSFaic55SDfk2XFWS', 'admin', NULL),

  ('DMCH Admin', 'hospital@healthbed.com', '$2b$10$Q6GXzxkC/sPxfNVhGYtDFeH4ewvbcvevr4W1GSFaic55SDfk2XFWS', 'hospital_admin', 'a1b2c3d4-0001-0001-0001-000000000001'),

  ('Test Patient', 'patient@healthbed.com', '$2b$10$Q6GXzxkC/sPxfNVhGYtDFeH4ewvbcvevr4W1GSFaic55SDfk2XFWS', 'user', NULL)
ON CONFLICT (email) DO NOTHING;
