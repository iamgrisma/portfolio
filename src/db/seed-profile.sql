-- Seed Profile Data
INSERT INTO profiles (name, nickname, tagline, bio) VALUES
  ('Kamal Baral', 'Anjan Mailo', 'Veterinary Technician & Public Administration Professional', 'Dedicated Veterinary Technician and public servant with a passion for literature, rural empowerment, and effective public administration.');

-- Seed Education
INSERT INTO educations (degree, institution, year, `order`) VALUES
  ('SLC', 'Government of Nepal (GON)', '2012 AD / 2069 BS', 1),
  ('JTA (TSLC)', 'CTEVT', '2015 AD / 2072 BS', 2),
  ('+2 in Management (Computer Science & Accounting)', 'National Examination Board (NEB)', '2015 AD / 2072 BS', 3),
  ('Diploma in Veterinary Science', 'Jiri Technical School (JTS), CTEVT', '2019 AD / 2076 BS', 4),
  ('Bachelor in Political Science', 'Tribhuvan University', '2022 AD', 5),
  ('Masters in Public Administration', 'Tribhuvan University', 'Ongoing', 6);

-- Seed Experience
INSERT INTO experiences (role, organization, duration, `order`) VALUES
  ('Vet JTA', 'Kamalamai Municipality, Sindhuli', '2075 - 2078 BS', 1),
  ('Vet Technician', 'Aamchok Rural Municipality', '2078 - 2080 BS', 2),
  ('Vet Technician', 'Department of Livestock Service, Government of Nepal', '2080 BS - Present', 3);

-- Seed Interests
INSERT INTO interests (name, category) VALUES
  ('Literature', 'Reading'),
  ('Music & Songs', 'Listening'),
  ('Travel', 'Hobby');
