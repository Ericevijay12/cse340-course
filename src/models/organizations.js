import pool from './db.js';

export async function getAllOrganizations() {
  const query = `
    SELECT organization_id, name, description, email, logo_path 
    FROM organizations 
    ORDER BY name ASC;
  `;
  const result = await pool.query(query);
  return result.rows;
}

export async function getOrganizationDetails(organizationId) {
  const query = `
    SELECT organization_id, name, description, email, logo_path 
    FROM organizations 
    WHERE organization_id = $1;
  `;
  const result = await pool.query(query, [organizationId]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function createOrganization(name, description, email, logoPath = '/images/placeholder-logo.png') {
  const query = `
    INSERT INTO organizations (name, description, email, logo_path)
    VALUES ($1, $2, $3, $4)
    RETURNING organization_id;
  `;
  const result = await pool.query(query, [name, description, email, logoPath]);
  if (result.rows.length === 0) {
    throw new Error('Failed to create organization');
  }
  return result.rows[0].organization_id;
}

export async function updateOrganization(organizationId, name, description, email, logoPath) {
  const query = `
    UPDATE organizations
    SET name = $1, description = $2, email = $3, logo_path = $4
    WHERE organization_id = $5
    RETURNING organization_id;
  `;
  const result = await pool.query(query, [name, description, email, logoPath, organizationId]);
  if (result.rows.length === 0) {
    throw new Error('Organization not found');
  }
  return result.rows[0].organization_id;
}
