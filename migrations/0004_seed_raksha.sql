-- Delete any existing profile/education/experience data
DELETE FROM profiles;
DELETE FROM educations;
DELETE FROM experiences;
DELETE FROM stats;
DELETE FROM social_profiles;
DELETE FROM interests;

-- Insert Profile
INSERT INTO profiles (name, nickname, bio, current_address, phone, public_email) VALUES (
  'Raksha Mishra',
  'Raksha',
  'Highly motivated and results-driven Software Developer with 1+ year of experience in developing and executing successful websites and web applications for companies. A creative problem-solver with proper time management and multi-tasking skills. Seeking a challenging position to leverage technical expertise and problem-solving skills to contribute to the success of a dynamic organization.',
  'Tikathali, Lalitpur, Nepal',
  '+977 9840032616',
  'rakshamishra556@gmail.com'
);

-- Insert Education
INSERT INTO educations (degree, institution, year, "order") VALUES (
  'Bachelor in Information Management',
  'Nagarjuna College of IT, Sankhamul, Kathmandu',
  '2017 - 2022',
  1
);

-- Insert Experiences
INSERT INTO experiences (role, organization, duration, description, "order") VALUES (
  'Software Developer',
  'Sita Software - Kathmandu, Nepal',
  'April 2023 – Present',
  'Collaborate with cross-functional teams to design, develop, and maintain software applications. Write clean, efficient, and maintainable code in various programming languages. Participate in the complete software development lifecycle, from requirements gathering to deployment and maintenance. Implement security best practices to protect sensitive data and prevent vulnerabilities.',
  1
),
(
  'Web Developer',
  'Bentray Technology - Lalitpur, Nepal',
  'Feb 2022 – Jan 2023',
  'Assisted in the development of software applications and features under the guidance of senior developers. Wrote code, conducted unit testing, and fixed bugs in collaboration with the team. Gained experience with version control systems (e.g., Git).',
  2
);

-- Insert Stats
INSERT INTO stats (label, value, icon, "order") VALUES (
  'Years Experience', '1+', 'Calendar', 1
),
(
  'Projects Delivered', '4+', 'Briefcase', 2
),
(
  'Tech Stack', '10+', 'BookOpen', 3
),
(
  'Qualifications', '1', 'GraduationCap', 4
);

-- Insert Social Profiles
INSERT INTO social_profiles (platform, url, icon) VALUES (
  'LinkedIn', 'https://linkedin.com/in/rakshamishra', 'linkedin'
),
(
  'GitHub', 'https://github.com/rakshamishra', 'github'
);

-- Insert Interests (Skills mapped to interests for UI)
INSERT INTO interests (name, category) VALUES 
('.Net MVC', 'Tech'),
('ASP.Net Framework', 'Tech'),
('JavaScript', 'Tech'),
('PHP', 'Tech'),
('Restful APIs', 'Tech'),
('JSON', 'Tech'),
('jQuery', 'Tech'),
('MySQL', 'Database'),
('MSSQL', 'Database'),
('Git', 'Tools');
