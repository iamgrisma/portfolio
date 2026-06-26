-- Clear old data
DELETE FROM profiles;
DELETE FROM educations;
DELETE FROM experiences;
DELETE FROM stats;
DELETE FROM interests;

-- Insert Raksha's Profile
INSERT INTO profiles (name, nickname, tagline, bio, current_address, permanent_address, phone, public_email) VALUES (
  'Raksha Mishra',
  'Raksha',
  'Software Engineer & IT Professional',
  'I am a Software Engineer based in Lalitpur, originally from Jhapa. I have extensive experience in building robust web applications, particularly in government systems like the Integrated Pension Management System and CGAS. I specialize in a diverse tech stack including Angular, .NET, Laravel, and React.',
  'Lalitpur, Nepal',
  'Jhapa, Nepal',
  '+977 9840032616',
  'contact@raksha.com.np'
);

-- Insert Educations
INSERT INTO educations (degree, institution, year, "order") VALUES 
  ('Masters in Business Studies (MBS)', 'Nepal Commerce Campus (NCC)', '2025 AD', 1),
  ('Bachelor in Business Information Management (BIM)', 'Nagarjuna College of IT (NCIT)', '2022 AD', 2),
  ('+2', 'Bright Future College', '2017 AD', 3);

-- Insert Experiences
INSERT INTO experiences (role, organization, duration, description, "order") VALUES 
  ('Software Engineer', 'Financial Comptroller General Office (FCGO)', '2025 - Present', 'Developing and maintaining the central accounting system (TSA/CGAS) using Angular and Oracle (TOD).', 1),
  ('Software Developer', 'SitaSoft', '2023 - 2024', 'Upgraded the Integrated Pension Management System (.NET, Gov of Nepal) and Cooperative Management Software. Developed a Hospital Billing system integrating government insurance requirements. Provided technical assistance and integrated CGAS API for the Pension Management Office.', 2),
  ('Web Developer', 'BentRay', '2022 - 2023', 'Developed and maintained custom Content Management Systems (CMS) utilizing core PHP and Laravel frameworks.', 3);

-- Insert Stats
INSERT INTO stats (label, value, icon, "order") VALUES 
  ('Years Experience', '4+', 'Briefcase', 1),
  ('Projects Delivered', '10+', 'Code', 2),
  ('Tech Stacks', '6+', 'Laptop', 3);

-- Insert Interests (Tech Stack / Skills)
INSERT INTO interests (name, category) VALUES 
  ('Angular', 'Frontend'),
  ('React & Next.js', 'Frontend'),
  ('.NET Framework', 'Backend'),
  ('Laravel (PHP)', 'Backend'),
  ('Oracle DB', 'Database'),
  ('System Integration', 'Architecture');
