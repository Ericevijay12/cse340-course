DROP TABLE IF EXISTS project_categories CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

CREATE TABLE organizations (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    logo_path VARCHAR(255)
);

CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    location VARCHAR(150),
    project_date DATE NOT NULL,
    CONSTRAINT fk_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations (organization_id)
        ON DELETE CASCADE
);

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE project_categories (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project
        FOREIGN KEY (project_id)
        REFERENCES projects (project_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES categories (category_id)
        ON DELETE CASCADE
);

INSERT INTO organizations (name, email, logo_path) VALUES
('BrightFuture Builders', 'info@brightfuture.org', '/images/brightfuture-logo.png'),
('GreenHarvest Growers', 'contact@greenharvest.org', '/images/greenharvest-logo.png'),
('UnityServe Volunteers', 'hello@unityserve.org', '/images/unityserve-logo.png');

INSERT INTO projects (organization_id, title, description, location, project_date) VALUES
(1, 'Community Center Renovation', 'Repairing and painting community gathering space', 'Downtown Community Center', '2026-10-05'),
(1, 'Shelter Roof Repair', 'Restoring roofs for family temporary housing', 'Eastside Shelter', '2026-10-12'),
(1, 'Playground Assembly', 'Installing swing sets and safe turf', 'Oak Park', '2026-10-19'),
(1, 'Wheelchair Ramp Build', 'Constructing access ramps for senior center', 'Maple Senior Living', '2026-10-26'),
(1, 'Library Bookshelf Construction', 'Building shelving units for local public branch', 'City Central Library', '2026-11-02'),
(2, 'Urban Community Garden Planting', 'Planting seasonal vegetables and herbs', 'Riverfront Garden', '2026-10-08'),
(2, 'Neighborhood Tree Planting', 'Planting native shade trees along walkways', 'North District Boulevard', '2026-10-15'),
(2, 'Community Orchard Pruning', 'Maintaining and pruning fruit orchard trees', 'South Orchard', '2026-10-22'),
(2, 'Compost Bin Workshop', 'Building sustainable compost stations for locals', 'Eco Center', '2026-10-29'),
(2, 'Pollinator Habitat Creation', 'Installing wildflower beds for native pollinators', 'Meadow Park', '2026-11-05'),
(3, 'Weekly Food Drive Distribution', 'Sorting and distributing essential food hampers', 'Westside Depot', '2026-10-10'),
(3, 'Senior Meal Delivery', 'Delivering hot meals to homebound elderly residents', 'Highland County', '2026-10-17'),
(3, 'Back-to-School Backpack Drive', 'Packing school supplies for elementary students', 'Civic Auditorium', '2026-10-24'),
(3, 'Winter Coat Collection & Sorting', 'Sorting warm clothing donations for families', 'Faith Assembly Hall', '2026-10-31'),
(3, 'Disaster Relief Kit Assembly', 'Packing emergency hygiene and medical supplies', 'Red Cross Depot', '2026-11-07');

INSERT INTO categories (name) VALUES
('Construction & Maintenance'),
('Environment & Agriculture'),
('Community Outreach & Food Security'),
('Youth & Education');

INSERT INTO project_categories (project_id, category_id) VALUES
(1, 1), (1, 3),
(2, 1),
(3, 1), (3, 4),
(4, 1), (4, 3),
(5, 1), (5, 4),
(6, 2),
(7, 2),
(8, 2),
(9, 2),
(10, 2),
(11, 3),
(12, 3),
(13, 3), (13, 4),
(14, 3),
(15, 3);