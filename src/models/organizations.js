import pool from './db.js';

export async function getAllOrganizations() {
  const query = `
    SELECT 
      organization_id, 
      name, 
      email, 
      logo_path 
    FROM organizations 
    ORDER BY name ASC;
  `;
  const result = await pool.query(query);
  return result.rows;
}

export async function getOrganizationDetails(organizationId) {
  const query = `
    SELECT 
      organization_id, 
      name, 
      email, 
      logo_path 
    FROM organizations 
    WHERE organization_id = $1;
  `;
  const result = await pool.query(query, [organizationId]);
  return result.rows.length > 0 ? result.rows[0] : null;
}
