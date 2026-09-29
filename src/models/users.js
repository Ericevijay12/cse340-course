import db from './db.js';
import bcrypt from 'bcrypt';

/**
 * Inserts a new user into the database with default 'user' role
 */
export const createUser = async (name, email, passwordHash) => {
  const defaultRole = 'user';
  const query = `
    INSERT INTO users (name, email, password_hash, role_id) 
    VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4)) 
    RETURNING user_id;
  `;
  const queryParams = [name, email, passwordHash, defaultRole];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error('Failed to create user');
  }

  return result.rows[0].user_id;
};

/**
 * Finds user by email and joins role_name
 */
export const findUserByEmail = async (email) => {
  const query = `
    SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name 
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    WHERE u.email = $1;
  `;
  const result = await db.query(query, [email]);
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
};

/**
 * Verifies submitted plaintext password against hashed password
 */
export const verifyPassword = async (password, passwordHash) => {
  return await bcrypt.compare(password, passwordHash);
};

/**
 * Authenticates user credentials and strips password_hash before returning
 */
export const authenticateUser = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) {
    return null;
  }

  const isMatch = await verifyPassword(password, user.password_hash);
  if (!isMatch) {
    return null;
  }

  delete user.password_hash;
  return user;
};

/**
 * Retrieves all registered users along with their role names for admin viewing
 */
export const getAllUsersWithRoles = async () => {
  const query = `
    SELECT u.user_id, u.name, u.email, r.role_name, u.created_at
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    ORDER BY u.user_id ASC;
  `;
  const result = await db.query(query);
  return result.rows;
};
