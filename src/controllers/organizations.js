import { body, validationResult } from 'express-validator';
import { 
  getAllOrganizations, 
  getOrganizationDetails, 
  createOrganization, 
  updateOrganization 
} from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

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

export const showOrganizationsPage = async (req, res, next) => {
  try {
    const organizations = await getAllOrganizations();
    res.render('organizations', {
      title: 'Our Partner Organizations',
      organizations
    });
  } catch (error) {
    next(error);
  }
};

export const showOrganizationDetailsPage = async (req, res, next) => {
  try {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);

    if (!organizationDetails) {
      const err = new Error('Organization Not Found');
      err.status = 404;
      return next(err);
    }

    const projects = await getProjectsByOrganizationId(organizationId);
    res.render('organization', {
      title: 'Organization Details',
      organizationDetails,
      projects
    });
  } catch (error) {
    next(error);
  }
};

export const showNewOrganizationForm = async (req, res) => {
  res.render('new-organization', { title: 'Add New Organization' });
};

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
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);

    if (!organizationDetails) {
      const err = new Error('Organization Not Found');
      err.status = 404;
      return next(err);
    }

    res.render('edit-organization', {
      title: 'Edit Organization',
      organizationDetails
    });
  } catch (error) {
    next(error);
  }
};

export const processEditOrganizationForm = async (req, res, next) => {
  try {
    const organizationId = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errors.array().forEach(err => req.flash('error', err.msg));
      return res.redirect(`/edit-organization/${organizationId}`);
    }

    const { name, description, contactEmail, logoFilename } = req.body;
    const logoPath = logoFilename || '/images/placeholder-logo.png';

    await updateOrganization(organizationId, name, description, contactEmail, logoPath);
    req.flash('success', 'Organization updated successfully!');
    res.redirect(`/organization/${organizationId}`);
  } catch (error) {
    next(error);
  }
};
