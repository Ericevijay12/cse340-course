import pool from './db.js';

export async function getAllProjects() {
  const query = `
    SELECT 
      p.project_id,
      p.title,
      p.description,
      p.location,
      p.project_date,
      p.organization_id,
      o.name AS organization_name
    FROM projects p
    JOIN organizations o ON p.organization_id = o.organization_id
    ORDER BY p.project_date ASC;
  `;
  const result = await pool.query(query);
  return result.rows;
}

export async function getUpcomingProjects(numberOfProjects = 5) {
  const query = `
    SELECT 
      p.project_id,
      p.title,
      p.description,
      p.location,
      p.project_date,
      p.organization_id,
      o.name AS organization_name
    FROM projects p
    JOIN organizations o ON p.organization_id = o.organization_id
    ORDER BY p.project_date ASC
    LIMIT $1;
  `;
  const result = await pool.query(query, [numberOfProjects]);
  return result.rows;
}

export async function getProjectDetails(id) {
  const query = `
    SELECT 
      p.project_id,
      p.title,
      p.description,
      p.location,
      p.project_date,
      p.organization_id,
      o.name AS organization_name
    FROM projects p
    JOIN organizations o ON p.organization_id = o.organization_id
    WHERE p.project_id = $1;
  `;
  const result = await pool.query(query, [id]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function getProjectsByOrganizationId(organizationId) {
  const query = `
    SELECT 
      project_id,
      title,
      description,
      location,
      project_date
    FROM projects
    WHERE organization_id = $1
    ORDER BY project_date ASC;
  `;
  const result = await pool.query(query, [organizationId]);
  return result.rows;
}

export async function getProjectsByCategoryId(categoryId) {
  const query = `
    SELECT 
      p.project_id,
      p.title,
      p.description,
      p.location,
      p.project_date,
      p.organization_id,
      o.name AS organization_name
    FROM projects p
    JOIN organizations o ON p.organization_id = o.organization_id
    JOIN project_categories pc ON p.project_id = pc.project_id
    WHERE pc.category_id = $1
    ORDER BY p.project_date ASC;
  `;
  const result = await pool.query(query, [categoryId]);
  return result.rows;
}
