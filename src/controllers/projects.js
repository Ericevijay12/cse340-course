import { body, validationResult } from 'express-validator';
import { 
  getAllProjects, 
  getProjectDetails, 
  createProject, 
  updateProject, 
  getProjectCategories, 
  updateProjectCategories 
} from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';
import { getAllCategories } from '../models/categories.js';

export const projectValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Project title is required')
    .isLength({ min: 3, max: 150 }).withMessage('Project title must be between 3 and 150 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Project description is required')
    .isLength({ max: 500 }).withMessage('Project description cannot exceed 500 characters'),
  body('location')
    .trim()
    .notEmpty().withMessage('Project location is required'),
  body('date')
    .notEmpty().withMessage('Project date is required')
    .isISO8601().withMessage('Please provide a valid date'),
  body('organizationId')
    .notEmpty().withMessage('Partner organization is required')
    .isInt().withMessage('Invalid organization selected')
];

export const projectsPage = async (req, res, next) => {
  try {
    const projects = await getAllProjects();
    res.render('projects', {
      title: 'Upcoming Service Projects',
      projects
    });
  } catch (error) {
    next(error);
  }
};

export const projectDetailPage = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = await getProjectDetails(id);
    if (!data || !data.project) {
      const err = new Error('Project Not Found');
      err.status = 404;
      return next(err);
    }
    res.render('project', {
      title: data.project.title,
      project: data.project,
      categories: data.categories || []
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
      project: {},
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
    const id = parseInt(req.params.id, 10);
    const data = await getProjectDetails(id);
    if (!data || !data.project) {
      const err = new Error('Project Not Found');
      err.status = 404;
      return next(err);
    }
    const organizations = await getAllOrganizations();
    res.render('edit-project', {
      title: `Edit ${data.project.title}`,
      project: data.project,
      organizations
    });
  } catch (error) {
    next(error);
  }
};

export const processEditProjectForm = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errors.array().forEach(err => req.flash('error', err.msg));
      return res.redirect(`/edit-project/${id}`);
    }

    const { title, description, location, date, organizationId } = req.body;
    await updateProject(id, title, description, location, date, organizationId);
    req.flash('success', 'Project updated successfully!');
    res.redirect(`/project/${id}`);
  } catch (error) {
    next(error);
  }
};

export const showAssignCategoriesForm = async (req, res, next) => {
  try {
    const projectId = parseInt(req.params.id, 10);
    const data = await getProjectDetails(projectId);
    if (!data || !data.project) {
      const err = new Error('Project Not Found');
      err.status = 404;
      return next(err);
    }

    const allCategories = await getAllCategories();
    const assigned = await getProjectCategories(projectId);
    const assignedIds = (assigned || []).map(c => c.category_id);

    res.render('assign-categories', {
      title: `Assign Categories: ${data.project.title}`,
      project: data.project,
      categories: allCategories,
      assignedIds
    });
  } catch (error) {
    next(error);
  }
};

export const processAssignCategoriesForm = async (req, res, next) => {
  try {
    const projectId = parseInt(req.params.id, 10);
    let { categoryIds } = req.body;

    if (!categoryIds) {
      categoryIds = [];
    } else if (!Array.isArray(categoryIds)) {
      categoryIds = [categoryIds];
    }

    const parsedIds = categoryIds.map(id => parseInt(id, 10)).filter(id => !isNaN(id));
    await updateProjectCategories(projectId, parsedIds);
    req.flash('success', 'Categories updated successfully!');
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    next(error);
  }
};
