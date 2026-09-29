import { body, validationResult } from 'express-validator';
import { 
  getAllOrganizations, 
  getOrganizationDetails, 
  createOrganization, 
  updateOrganization 
} from '../models/organizations.js';

export const organizationValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Organization name is required')
    .isLength({ min: 3, max: 150 }).withMessage('Organization name must be between 3 and 150 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Organization description is required')
    .isLength({ max: 500 }).withMessage('Organization description cannot exceed 500 characters'),
  body('contactEmail')
    .trim()
    .notEmpty().withMessage('Contact email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail()
];

export const organizationsPage = async (req, res, next) => {
  try {
    const organizations = await getAllOrganizations();
    res.render('organizations', {
      title: 'Partner Organizations',
      organizations
    });
  } catch (error) {
    next(error);
  }
};

export const organizationDetailPage = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = await getOrganizationDetails(id);
    if (!data || !data.organization) {
      const err = new Error('Organization Not Found');
      err.status = 404;
      return next(err);
    }
    res.render('organization', {
      title: data.organization.name,
      organization: data.organization,
      projects: data.projects || []
    });
  } catch (error) {
    next(error);
  }
};

export const newOrganizationPage = (req, res) => {
  res.render('new-organization', {
    title: 'Add New Organization',
    organization: {}
  });
};

export const showNewOrganizationForm = newOrganizationPage;

export const processNewOrganizationForm = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errors.array().forEach(err => req.flash('error', err.msg));
      return res.redirect('/new-organization');
    }

    const { name, description, contactEmail } = req.body;
    const logoPath = '/images/placeholder-logo.png';

    const organizationId = await createOrganization(name, description, contactEmail, logoPath);
    req.flash('success', 'Organization added successfully!');
    res.redirect(`/organization/${organizationId}`);
  } catch (error) {
    next(error);
  }
};

export const showEditOrganizationForm = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = await getOrganizationDetails(id);
    if (!data || !data.organization) {
      const err = new Error('Organization Not Found');
      err.status = 404;
      return next(err);
    }
    res.render('edit-organization', {
      title: `Edit ${data.organization.name}`,
      organization: data.organization
    });
  } catch (error) {
    next(error);
  }
};

export const processEditOrganizationForm = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errors.array().forEach(err => req.flash('error', err.msg));
      return res.redirect(`/edit-organization/${id}`);
    }

    const { name, description, contactEmail, logoPath } = req.body;
    await updateOrganization(id, name, description, contactEmail, logoPath);
    req.flash('success', 'Organization updated successfully!');
    res.redirect(`/organization/${id}`);
  } catch (error) {
    next(error);
  }
};
