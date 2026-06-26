UPDATE profiles 
SET 
  tagline = 'IT Professional',
  bio = 'I am an IT Professional based in Lalitpur, originally from Jhapa. I have extensive experience providing technical support and integration for robust web applications, particularly in government systems like the Integrated Pension Management System and CGAS. I have a diverse technical background spanning .NET, PHP, and modern web frameworks.'
WHERE name = 'Raksha Mishra';

UPDATE experiences
SET 
  role = 'IT Officer',
  description = 'Provides support assistance for the Electronic Funds Transfer (EFT) module under the Integrated Public Finance Management System (IPFMS). Verifies transactions, handles Oracle TOD for EFT issues, and communicates with government offices, DTCO, NCHL, and banks regarding EFT resolutions.'
WHERE organization = 'Financial Comptroller General Office (FCGO)';

UPDATE experiences
SET role = 'IT Professional'
WHERE organization = 'SitaSoft';
