import express from 'express';
import { 
  homePage, 
  aboutPage, 
  contactPage 
} from './controllers/pages.js';
import { 
  organizationsPage, 
  organizationDetailPage,
  newOrganizationPage,
  processNewOrganizationForm,
  showEditOrganizationForm,
  processEditOrganizationForm,
  organizationValidation 
} from './controllers/organizations.js';
import { 
  projectsPage, 
  projectDetailPage,
  showNewProjectForm,
  processNewProjectForm,
  showEditProjectForm,
  processEditProjectForm,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
  projectValidation 
} from './controllers/projects.js';
import { 
  categoriesPage, 
  categoryDetailPage,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  categoryValidation 
} from './controllers/categories.js';
import {
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  showDashboard,
  showUsersList,
  requireLogin,
  requireRole
} from './controllers/users.js';

const router = express.Router();

// Static Pages
router.get('/', homePage);
router.get('/about', aboutPage);
router.get('/contact', contactPage);

// Auth Routes
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// Protected User Routes
router.get('/dashboard', requireLogin, showDashboard);

// Admin-Only Registered Users Page (Week 5 Assignment)
router.get('/users', requireRole('admin'), showUsersList);

// Organizations (Public views, Admin CRUD)
router.get('/organizations', organizationsPage);
router.get('/organization/:id', organizationDetailPage);
router.get('/new-organization', requireRole('admin'), newOrganizationPage);
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);

// Projects (Public views, Admin CRUD)
router.get('/projects', projectsPage);
router.get('/project/:id', projectDetailPage);
router.get('/new-project', requireRole('admin'), showNewProjectForm);
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditProjectForm);
router.get('/assign-categories/:id', requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:id', requireRole('admin'), processAssignCategoriesForm);

// Categories (Public views, Admin CRUD)
router.get('/categories', categoriesPage);
router.get('/category/:id', categoryDetailPage);
router.get('/new-category', requireRole('admin'), showNewCategoryForm);
router.post('/new-category', requireRole('admin'), categoryValidation, processNewCategoryForm);
router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), categoryValidation, processEditCategoryForm);

export default router;
