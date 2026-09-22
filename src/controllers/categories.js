import { body, validationResult } from 'express-validator';
import { 
  getAllCategories, 
  getCategoryById, 
  createCategory, 
  updateCategory,
  getCategoriesByProjectId,
  updateCategoryAssignments 
} from '../models/categories.js';
import { getProjectDetails, getProjectsByCategoryId } from '../models/projects.js';

export const categoryValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Category name must be between 3 and 100 characters')
];

export const showCategoriesPage = async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    res.render('categories', {
      title: 'Service Categories',
      categories
    });
  } catch (error) {
    next(error);
  }
};

export const showCategoryDetailsPage = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);

    if (!category) {
      const err = new Error('Category Not Found');
      err.status = 404;
      return next(err);
    }

    const projects = await getProjectsByCategoryId(categoryId);
    res.render('category', {
      title: `${category.name} Projects`,
      category,
      projects
    });
  } catch (error) {
    next(error);
  }
};

export const showNewCategoryForm = (req, res) => {
  res.render('new-category', { title: 'Add New Category' });
};

export const processNewCategoryForm = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errors.array().forEach(err => req.flash('error', err.msg));
      return res.redirect('/new-category');
    }

    const { name } = req.body;
    const categoryId = await createCategory(name);

    req.flash('success', 'Category created successfully!');
    res.redirect(`/category/${categoryId}`);
  } catch (error) {
    next(error);
  }
};

export const showEditCategoryForm = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);

    if (!category) {
      const err = new Error('Category Not Found');
      err.status = 404;
      return next(err);
    }

    res.render('edit-category', {
      title: 'Edit Category',
      category
    });
  } catch (error) {
    next(error);
  }
};

export const processEditCategoryForm = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errors.array().forEach(err => req.flash('error', err.msg));
      return res.redirect(`/edit-category/${categoryId}`);
    }

    const { name } = req.body;
    await updateCategory(categoryId, name);

    req.flash('success', 'Category updated successfully!');
    res.redirect(`/category/${categoryId}`);
  } catch (error) {
    next(error);
  }
};

export const showAssignCategoriesForm = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const projectDetails = await getProjectDetails(projectId);

    if (!projectDetails) {
      const err = new Error('Project Not Found');
      err.status = 404;
      return next(err);
    }

    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    res.render('assign-categories', {
      title: 'Assign Categories to Project',
      projectId,
      projectDetails,
      categories,
      assignedCategories
    });
  } catch (error) {
    next(error);
  }
};

export const processAssignCategoriesForm = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];

    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully!');
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    next(error);
  }
};
