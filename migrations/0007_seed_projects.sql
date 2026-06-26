DELETE FROM projects;

INSERT INTO projects (title, description, organization, tech_stack, "order") VALUES 
  (
    'Centralized Government Accounting System (CGAS / EFT)', 
    'Provides support assistance at the Officer level for the Electronic Funds Transfer (EFT) module under the Integrated Public Finance Management System (IPFMS). Verifies transactions, handles Oracle TOD for EFT issues, and communicates with government offices, DTCO, NCHL (clearing house in Nepal), and banks regarding EFT resolutions.', 
    'Financial Comptroller General Office (FCGO)', 
    'Oracle TOD, Banking/EFT Systems', 
    1
  ),
  (
    'Integrated Pension Management System (IPMS)', 
    'Upgraded the legacy IPMS to the latest .NET framework with UI/UX, technical flow, and feature enhancements for the Pension Management Office. Successfully integrated IPMS with the CGAS (IPFMS) system to automatically send pensioners'' monthly generated amounts and required details for EFT processing.', 
    'SitaSoft (Pension Management Office)', 
    '.NET Framework, API Integration', 
    2
  ),
  (
    'Hospital Insurance Billing System', 
    'Developed a hospital billing system for Narayani Hospital, Chitwan, specifically tailored to integrate government requirements and processes for insured patient billing.', 
    'SitaSoft (Narayani Hospital)', 
    '.NET Framework', 
    3
  ),
  (
    'Cooperative Management Software', 
    'Upgraded and maintained a widely-used cooperative management system, utilized by around 120 leading cooperatives inside and outside Kathmandu. Enhanced the system with better interest calculation algorithms and credit management features.', 
    'SitaSoft', 
    '.NET Framework', 
    4
  ),
  (
    'Custom CMS & Web Applications', 
    'Began as an intern and transitioned to a developer role, creating scalable, tailored Content Management Systems and small-scale websites for news agencies and small organizations.', 
    'BentRay', 
    'Core PHP, Laravel, Backend Development', 
    5
  ),
  (
    'Modern Developer Portfolio', 
    'A high-performance, edge-rendered portfolio website built with modern web technologies. Integrated Cloudflare D1 (SQLite) for the database and R2/S3 for object storage, ensuring global low latency.', 
    'Personal Project', 
    'Next.js, React, Cloudflare Edge, D1 (SQLite), R2/S3', 
    6
  );
