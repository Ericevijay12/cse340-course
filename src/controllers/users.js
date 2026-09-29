import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import { 
  createUser, 
  findUserByEmail, 
  authenticateUser, 
  getAllUsersWithRoles 
} from '../models/users.js';

/**
 * Middleware: require user to be logged in
 */
export const requireLogin = (req, res, next) => {
  if (!req.session || !req.session.user) {
    req.flash('error', 'You must be logged in to access that page.');
    return res.redirect('/login');
  }
  next();
};

/**
 * Middleware factory: require specific role (e.g. 'admin')
 */
export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      req.flash('error', 'You must be logged in to access this page.');
      return res.redirect('/login');
    }

    if (req.session.user.role_name !== role) {
      req.flash('error', 'You do not have permission to access this page.');
      return res.redirect('/dashboard');
    }

    next();
  };
};

/**
 * Render registration form
 */
export const showUserRegistrationForm = (req, res) => {
  res.render('register', { title: 'Register Account' });
};

/**
 * Process registration form
 */
export const processUserRegistrationForm = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const existing = await findUserByEmail(email);
    if (existing) {
      req.flash('error', 'An account with that email already exists.');
      return res.redirect('/register');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await createUser(name, email, passwordHash);

    req.flash('success', 'Registration successful! Please log in.');
    res.redirect('/login');
  } catch (error) {
    console.error('Registration error:', error);
    req.flash('error', 'An error occurred during registration. Please try again.');
    res.redirect('/register');
  }
};

/**
 * Render login form
 */
export const showLoginForm = (req, res) => {
  res.render('login', { title: 'Login' });
};

/**
 * Process login form
 */
export const processLoginForm = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authenticateUser(email, password);
    if (user) {
      req.session.user = user;
      req.flash('success', 'Login successful!');
      res.redirect('/dashboard');
    } else {
      req.flash('error', 'Invalid email or password.');
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error during login:', error);
    req.flash('error', 'An error occurred during login. Please try again.');
    res.redirect('/login');
  }
};

/**
 * Process logout
 */
export const processLogout = (req, res) => {
  if (req.session) {
    delete req.session.user;
  }
  req.flash('success', 'Logout successful!');
  res.redirect('/login');
};

/**
 * Render user dashboard
 */
export const showDashboard = (req, res) => {
  const user = req.session.user;
  res.render('dashboard', {
    title: 'My Dashboard',
    name: user.name,
    email: user.email,
    role_name: user.role_name
  });
};

/**
 * Render admin registered users list
 */
export const showUsersList = async (req, res, next) => {
  try {
    const users = await getAllUsersWithRoles();
    res.render('users', {
      title: 'Registered Users',
      users
    });
  } catch (error) {
    next(error);
  }
};
