import db from './db.js';

export const getAllOrganizations = async () => {
  try {
    const query = 'SELECT * FROM organizations ORDER BY name ASC';
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error in getAllOrganizations:', error);
    throw error;
  }
};
