import { body, validationResult } from 'express-validator';
import { 
  getUpcomingProjects, 
  getProjectDetails, 
  createProject, 
  updateProject 
} from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';
import { getCategoriesByProjectId } from '../models/categories.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

export const projectValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required')
    .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Date must be a valid date format'),
  body('organizationId')
    .notEmpty().withMessage('Organization is required')
    .isInt().withMessage('Organization must be a valid integer')
];

export const showProjectsPage = async (req, res, next) => {
  try {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    res.render('projects', {
      title: 'Upcoming Service Projects',
      projects
    });
  } catch (error) {
    next(error);
  }
};

export const showProjectDetailsPage = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);

    if (!project) {
      const err = new Error('Project Not Found');
      err.status = 404;
      return next(err);
    }

    const categories = await getCategoriesByProjectId(projectId);
    res.render('project', {
      title: project.title,
      project,
      categories
    });
  } catch (error) {
    next(error);
  }
};

export const showNewProjectForm = async (req, res, next) => {
  try {
    const organizations = await getAllOrganizations();
    res.render('new-project', {
      title: 'Add New Service Project',
      organizations
    });
  } catch (error) {
    next(error);
  }
};

export const processNewProjectForm = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errors.array().forEach(err => req.flash('error', err.msg));
      return res.redirect('/new-project');
    }

    const { title, description, location, date, organizationId } = req.body;
    const newProjectId = await createProject(title, description, location, date, organizationId);

    req.flash('success', 'New service project created successfully!');
    res.redirect(`/project/${newProjectId}`);
  } catch (error) {
    next(error);
  }
};

export const showEditProjectForm = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);

    if (!project) {
      const err = new Error('Project Not Found');
      err.status = 404;
      return next(err);
    }

    const organizations = await getAllOrganizations();
    res.render('edit-project', {
      title: 'Edit Service Project',
      project,
      organizations
    });
  } catch (error) {
    next(error);
  }
};

export const processEditProjectForm = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errors.array().forEach(err => req.flash('error', err.msg));
      return res.redirect(`/edit-project/${projectId}`);
    }

    const { title, description, location, date, organizationId } = req.body;
    await updateProject(projectId, title, description, location, date, organizationId);

    req.flash('success', 'Service project updated successfully!');
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    next(error);
  }
};
