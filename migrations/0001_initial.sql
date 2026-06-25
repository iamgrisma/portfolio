-- ============================================================
-- Kamal Baral Portfolio — Cloudflare D1 Database Migration
-- Run with: npx wrangler d1 migrations apply portfolio-db --local   (for local dev)
-- Run with: npx wrangler d1 migrations apply portfolio-db --remote  (for production)
-- ============================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  uid TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at INTEGER DEFAULT (unixepoch())
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#10b981',
  created_at INTEGER DEFAULT (unixepoch())
);

-- Blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  reading_time TEXT,
  published INTEGER NOT NULL DEFAULT 0,
  author_id INTEGER NOT NULL REFERENCES users(id),
  category_id INTEGER REFERENCES categories(id),
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Blog-Tags junction table (many-to-many)
CREATE TABLE IF NOT EXISTS blog_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  blog_id INTEGER NOT NULL REFERENCES blogs(id),
  tag_id INTEGER NOT NULL REFERENCES tags(id)
);

-- Contacts / Messages table
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Social Profiles table
CREATE TABLE IF NOT EXISTS social_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at INTEGER DEFAULT (unixepoch())
);

-- ============================================================
-- Indexes for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published);
CREATE INDEX IF NOT EXISTS idx_blogs_category_id ON blogs(category_id);
CREATE INDEX IF NOT EXISTS idx_blogs_author_id ON blogs(author_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
CREATE INDEX IF NOT EXISTS idx_blog_tags_blog_id ON blog_tags(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_tags_tag_id ON blog_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_contacts_read ON contacts(read);
CREATE INDEX IF NOT EXISTS idx_users_uid ON users(uid);

-- ============================================================
-- Seed Data: Default admin user, categories, tags, sample posts
-- ============================================================

-- Default admin user
INSERT OR IGNORE INTO users (uid, email, role) VALUES
  ('admin-001', 'kamalbaral@mail.com', 'admin');

-- Categories
INSERT OR IGNORE INTO categories (name, slug, color) VALUES
  ('Governance', 'governance', '#3b82f6'),
  ('Community', 'community', '#10b981'),
  ('Policy', 'policy', '#8b5cf6'),
  ('Veterinary', 'veterinary', '#f59e0b'),
  ('Health', 'health', '#ef4444');

-- Tags
INSERT OR IGNORE INTO tags (name, slug) VALUES
  ('Digital', 'digital'),
  ('Government', 'government'),
  ('Technology', 'technology'),
  ('Nepal', 'nepal'),
  ('Outreach', 'outreach'),
  ('Inclusion', 'inclusion'),
  ('Planning', 'planning'),
  ('Future', 'future'),
  ('Innovation', 'innovation'),
  ('Livestock', 'livestock'),
  ('Disease', 'disease'),
  ('Prevention', 'prevention'),
  ('Zoonotic', 'zoonotic'),
  ('Public Health', 'public-health'),
  ('One Health', 'one-health'),
  ('Rural', 'rural'),
  ('Empowerment', 'empowerment'),
  ('Development', 'development');

-- Sample Blog Posts
INSERT OR IGNORE INTO blogs (slug, title, excerpt, content, published, author_id, category_id, reading_time) VALUES
  (
    'digital-governance',
    'Digital Governance in Local Municipalities',
    'Exploring how local governments can leverage digital tools to improve public service delivery and citizen engagement.',
    'Public administration is undergoing a massive shift towards digital governance. By embracing digital tools, local municipalities can significantly improve service delivery, transparency, and citizen engagement.

In Nepal, the transition to digital governance presents both opportunities and challenges. Rural municipalities like those in Sindhuli district are gradually adopting technology for citizen services, land records, and public health tracking.

This shift requires not only technological investment but also a cultural change within government institutions. Training public servants to effectively use new systems is just as important as the systems themselves.

Key areas where digital governance can make an immediate impact include: birth and death registration, property tax collection, veterinary service scheduling, and public health reporting. Each of these services, when digitized, reduces paperwork, speeds up processing, and increases accessibility for citizens.

Looking ahead, the integration of mobile platforms and cloud-based solutions will further democratize access to government services, especially for communities in remote hill districts of Nepal.',
    1, 1, 1, '5 min read'
  ),
  (
    'community-outreach',
    'Community Outreach Strategies for 2024',
    'Effective methods for reaching diverse community groups and ensuring all voices are heard in local decision-making.',
    'Effective community outreach is the backbone of good governance. In 2024, local governments need to adopt multi-channel strategies to ensure all community voices are heard.

Traditional methods like town hall meetings remain important, but they must be supplemented with digital platforms, social media engagement, and targeted awareness campaigns.

In my experience working in Sindhuli, the most successful outreach programs are those that combine local knowledge with modern communication tools. Door-to-door campaigns, community radio broadcasts, and partnership with local organizations create a comprehensive outreach network.

Special attention must be given to marginalized groups — women, indigenous communities, and people with disabilities — to ensure inclusive participation in community decision-making processes.',
    1, 1, 2, '4 min read'
  ),
  (
    'future-public-administration',
    'The Future of Public Administration',
    'How modern technology and data-driven approaches are reshaping the landscape of public administration in Nepal.',
    'The landscape of public administration in Nepal is evolving rapidly. Modern technology and data-driven approaches are reshaping how government services are delivered and how policies are implemented.

Artificial intelligence, big data analytics, and automated workflows are no longer concepts reserved for the private sector. Progressive government agencies worldwide are integrating these technologies into their operations.

For Nepal, the future lies in building robust digital infrastructure that can support e-governance at all levels — from central ministries to rural municipalities. This requires investment in both hardware and human capital.

The role of public administrators is also changing. Beyond traditional bureaucratic functions, modern administrators need to be data-literate, technology-savvy, and citizen-centric in their approach to governance.

The fusion of traditional administrative wisdom with modern technological capabilities will define the next era of public administration in Nepal and across South Asia.',
    1, 1, 3, '6 min read'
  ),
  (
    'livestock-disease-prevention',
    'Livestock Disease Prevention in Rural Nepal',
    'Comprehensive guide to preventing common livestock diseases in rural Nepalese communities through vaccination and hygiene practices.',
    'Livestock health is a critical component of rural livelihoods in Nepal. For communities in districts like Sindhuli, animals are not just economic assets — they are integral to family nutrition, agricultural productivity, and cultural traditions.

As a veterinary technician, I have observed that prevention is always more cost-effective than treatment. Regular vaccination schedules, proper hygiene practices, and early disease detection can dramatically reduce livestock mortality rates.

Key preventive measures include: maintaining clean animal shelters, ensuring proper nutrition and clean water, following government-recommended vaccination schedules, and reporting unusual animal deaths to local veterinary offices.

Community awareness programs play a vital role in disease prevention. When farmers understand the basics of animal health, they can serve as the first line of defense against disease outbreaks.',
    1, 1, 4, '7 min read'
  ),
  (
    'zoonotic-diseases',
    'Zoonotic Diseases: Bridging Animal and Human Health',
    'Understanding the critical link between animal health and human health, and how veterinary professionals play a key role.',
    'The One Health approach recognizes that the health of humans, animals, and the environment are interconnected. Zoonotic diseases — those that can be transmitted between animals and humans — represent a significant public health challenge worldwide.

In Nepal, common zoonotic diseases include rabies, leptospirosis, brucellosis, and avian influenza. Veterinary technicians play a crucial role in surveillance, prevention, and early detection of these diseases.

Our work in Sindhuli involves regular monitoring of livestock populations, vaccination campaigns against rabies, and community education about safe food handling practices. The COVID-19 pandemic has highlighted the importance of this work on a global scale.

Strengthening the veterinary workforce and improving coordination between human health and animal health services is essential for effective zoonotic disease prevention and response.',
    1, 1, 5, '8 min read'
  ),
  (
    'stronger-rural-communities',
    'Building Stronger Rural Communities',
    'Strategies for empowering rural communities through education, infrastructure development, and participatory governance.',
    'Rural communities in Nepal face unique challenges — limited infrastructure, geographic isolation, and resource constraints. Yet these communities also possess incredible resilience, traditional knowledge, and social cohesion.

Building stronger rural communities requires a multi-pronged approach. Education is the foundation — both formal schooling for children and vocational training for adults. Agricultural extension services, including veterinary support, directly impact family incomes and food security.

Infrastructure development — roads, electricity, internet connectivity — opens doors to markets, information, and opportunities. But physical infrastructure must be complemented by institutional capacity building at the local government level.

Participatory governance ensures that community members have a voice in decisions that affect their lives. When people feel ownership over development projects, they are more likely to sustain and protect those investments.',
    1, 1, 2, '5 min read'
  );

-- Blog-Tag associations
INSERT OR IGNORE INTO blog_tags (blog_id, tag_id) VALUES
  (1, 1), (1, 2), (1, 3), (1, 4),  -- digital-governance: Digital, Government, Technology, Nepal
  (2, 5), (2, 6), (2, 7),            -- community-outreach: Outreach, Inclusion, Planning
  (3, 8), (3, 9), (3, 4),            -- future-public-admin: Future, Innovation, Nepal
  (4, 10), (4, 11), (4, 12),         -- livestock-disease: Livestock, Disease, Prevention
  (5, 13), (5, 14), (5, 15),         -- zoonotic: Zoonotic, Public Health, One Health
  (6, 16), (6, 17), (6, 18);         -- rural-communities: Rural, Empowerment, Development

-- Social Profiles
INSERT OR IGNORE INTO social_profiles (platform, url, icon) VALUES
  ('Facebook', 'https://facebook.com/kamalbaral', 'facebook'),
  ('Twitter', 'https://twitter.com/kamalbaral', 'twitter'),
  ('LinkedIn', 'https://linkedin.com/in/kamalbaral', 'linkedin');
