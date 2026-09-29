import db from './db.js';

export const getAllProjects = async () => {
  const query = `
    SELECT p.project_id, p.title, p.description, p.location, p.project_date, o.name AS organization_name
    FROM projects p
    LEFT JOIN organizations o ON p.organization_id = o.organization_id
    ORDER BY p.project_date ASC;
  `;
  const result = await db.query(query);
  return result.rows;
};

export const getProjectCategories = async (projectId) => {
  const query = `
    SELECT c.category_id, c.name
    FROM categories c
    JOIN project_categories pc ON c.category_id = pc.category_id
    WHERE pc.project_id = $1
    ORDER BY c.name ASC;
  `;
  const result = await db.query(query, [projectId]);
  return result.rows;
};

export const getProjectDetails = async (id) => {
  const projectQuery = `
    SELECT p.project_id, p.organization_id, p.title, p.description, p.location, p.project_date, o.name AS organization_name
    FROM projects p
    LEFT JOIN organizations o ON p.organization_id = o.organization_id
    WHERE p.project_id = $1;
  `;
  const projectResult = await db.query(projectQuery, [id]);
  if (projectResult.rows.length === 0) return null;

  const categories = await getProjectCategories(id);

  return {
    project: projectResult.rows[0],
    categories
  };
};

export const createProject = async (title, description, location, projectDate, organizationId) => {
  const query = `
    INSERT INTO projects (title, description, location, project_date, organization_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING project_id;
  `;
  const result = await db.query(query, [title, description, location, projectDate, organizationId]);
  return result.rows[0].project_id;
};

export const updateProject = async (id, title, description, location, projectDate, organizationId) => {
  const query = `
    UPDATE projects
    SET title = $1, description = $2, location = $3, project_date = $4, organization_id = $5
    WHERE project_id = $6;
  `;
  await db.query(query, [title, description, location, projectDate, organizationId, id]);
};

export const updateProjectCategories = async (projectId, categoryIds) => {
  await db.query('DELETE FROM project_categories WHERE project_id = $1;', [projectId]);
  if (categoryIds && categoryIds.length > 0) {
    for (const catId of categoryIds) {
      await db.query(
        'INSERT INTO project_categories (project_id, category_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;',
        [projectId, catId]
      );
    }
  }
};
