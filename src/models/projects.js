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
    SELECT project_id, title, description, location, project_date
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

export async function createProject(title, description, location, projectDate, organizationId) {
  const query = `
    INSERT INTO projects (title, description, location, project_date, organization_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING project_id;
  `;
  const result = await pool.query(query, [title, description, location, projectDate, organizationId]);
  if (result.rows.length === 0) {
    throw new Error('Failed to create project');
  }
  return result.rows[0].project_id;
}

export async function updateProject(projectId, title, description, location, projectDate, organizationId) {
  const query = `
    UPDATE projects
    SET title = $1, description = $2, location = $3, project_date = $4, organization_id = $5
    WHERE project_id = $6
    RETURNING project_id;
  `;
  const result = await pool.query(query, [title, description, location, projectDate, organizationId, projectId]);
  if (result.rows.length === 0) {
    throw new Error('Project not found');
  }
  return result.rows[0].project_id;
}
