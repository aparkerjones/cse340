DROP TABLE IF EXISTS project_volunteers;
DROP TABLE IF EXISTS project_categories;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS organizations;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

-- RBAC tables
CREATE TABLE roles (
  role_id SERIAL PRIMARY KEY,
  role_name VARCHAR(50) UNIQUE NOT NULL,
  role_description TEXT
);

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role_id INTEGER REFERENCES roles (role_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Core service network tables
CREATE TABLE organizations (
  organization_id SERIAL PRIMARY KEY,
  organization_name VARCHAR(100) NOT NULL UNIQUE,
  logo_filename VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  website_url VARCHAR(255)
);

CREATE TABLE projects (
  project_id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES organizations (organization_id),
  title VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(120) NOT NULL,
  project_date DATE NOT NULL
);

CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  category_name VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE project_categories (
  project_id INTEGER NOT NULL REFERENCES projects (project_id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories (category_id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, category_id)
);

CREATE TABLE project_volunteers (
  user_id    INTEGER NOT NULL REFERENCES users (user_id)    ON DELETE CASCADE,
  project_id INTEGER NOT NULL REFERENCES projects (project_id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, project_id)
);

-- Seed organizations and role metadata
INSERT INTO organizations (organization_id, organization_name, logo_filename, contact_email, description, website_url)
VALUES
  (1, 'BrightFuture Builders', 'brightfuture-logo.png', 'info@brightfuturebuilders.org', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', NULL),
  (2, 'GreenHarvest Growers', 'greenharvest-logo.png', 'contact@greenharvest.org', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', NULL),
  (3, 'UnityServe Volunteers', 'unityserve-logo.png', 'hello@unityserve.org', 'A volunteer coordination group supporting local charities and service initiatives.', NULL);

INSERT INTO roles (role_id, role_name, role_description)
VALUES
  (1, 'user', 'Standard user with basic access'),
  (2, 'admin', 'Administrator with full system access');

INSERT INTO users (user_id, name, email, password_hash, role_id)
VALUES
  (1, 'Admin User', 'admin@example.com', '$2b$10$lbY/pBsC8H2Q71OlEDTpo.YFhQMAKK4BAfWo3xsSU.Rq5vqwh4tUS', 2);

-- Seed sample project and category data
INSERT INTO projects (project_id, organization_id, title, description, location, project_date)
VALUES
  (1, 1, 'Neighborhood Repair Blitz', 'Assist with minor home repairs for longtime residents.', 'Riverside District', '2026-06-06'),
  (2, 1, 'Playhouse Build Day', 'Assemble backyard play structures for two local families.', 'Northside Build Site', '2026-06-13'),
  (3, 1, 'Tool Drive and Sorting', 'Collect donated tools and organize them for future housing projects.', 'Downtown Warehouse', '2026-06-20'),
  (4, 1, 'Community Paint Project', 'Paint exterior trim and porches for aging homes.', 'Maple Street', '2026-06-27'),
  (5, 1, 'Accessibility Ramp Install', 'Build wheelchair ramps for homeowners with mobility needs.', 'Elm Grove', '2026-07-11'),
  (6, 2, 'Weekend Pantry Packing', 'Sort produce and pack family meal boxes for distribution.', 'Food Bank Hub', '2026-06-05'),
  (7, 2, 'Mobile Market Support', 'Load and distribute food at neighborhood pop-up sites.', 'Westview Park', '2026-06-12'),
  (8, 2, 'Summer Produce Pickup', 'Collect surplus produce from partner farms for local distribution.', 'County Fairgrounds', '2026-06-19'),
  (9, 2, 'School Snack Assembly', 'Prepare take-home snack kits for students during summer break.', 'Central Volunteer Center', '2026-06-26'),
  (10, 2, 'Senior Grocery Delivery', 'Deliver grocery boxes to homebound older adults.', 'Citywide Routes', '2026-07-10'),
  (11, 3, 'After-School Tutoring', 'Support students with reading, math, and homework help.', 'Lincoln Community Center', '2026-06-09'),
  (12, 3, 'STEM Night Mentoring', 'Guide youth through hands-on robotics and science stations.', 'Boys & Girls Club Main Campus', '2026-06-16'),
  (13, 3, 'Career Day Prep', 'Help students practice interviews and resume basics.', 'Eastside Clubhouse', '2026-06-23'),
  (14, 3, 'Summer Sports Clinic', 'Coach youth in teamwork and sports fundamentals.', 'Jefferson Gym', '2026-07-07'),
  (15, 3, 'Creative Arts Showcase', 'Set up displays and mentor participants for a community arts night.', 'Riverfront Arts Hall', '2026-07-14');

INSERT INTO categories (category_id, category_name)
VALUES
  (1, 'Housing'),
  (2, 'Food Security'),
  (3, 'Education'),
  (4, 'Community Support');

INSERT INTO project_categories (project_id, category_id)
VALUES
  (1, 1),
  (1, 4),
  (2, 1),
  (3, 1),
  (3, 4),
  (4, 1),
  (5, 1),
  (5, 4),
  (6, 2),
  (7, 2),
  (7, 4),
  (8, 2),
  (9, 2),
  (9, 3),
  (10, 2),
  (10, 4),
  (11, 3),
  (12, 3),
  (12, 4),
  (13, 3),
  (14, 3),
  (14, 4),
  (15, 3),
  (15, 4);