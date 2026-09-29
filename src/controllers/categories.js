import { body, validationResult } from 'express-validator';
import { 
  getAllCategories, 
  getCategoryById, 
  createCategory, 
  updateCategory 
} from '../models/categories.js';

export const categoryValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Category name must be between 2 and 100 characters')
];

export const categoriesPage = async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    res.render('categories', {
      title: 'Categories',
      categories
    });
  } catch (error) {
    next(error);
  }
};

export const categoryDetailPage = async (req, res, next) => {
  try {
    const categoryId = parseInt(req.params.id, 10);
    const category = await getCategoryById(categoryId);
    if (!category) {
      const err = new Error('Category Not Found');
      err.status = 404;
      return next(err);
    }
    res.render('category', {
      title: category.name,
      category
    });
  } catch (error) {
    next(error);
  }
};

export const showNewCategoryForm = (req, res) => {
  res.render('new-category', {
    title: 'Add New Category',
    category: {}
  });
};

export const processNewCategoryForm = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errors.array().forEach(err => req.flash('error', err.msg));
      return res.redirect('/new-category');
    }

    const { name } = req.body;
    const newId = await createCategory(name);
    req.flash('success', 'Category created successfully!');
    res.redirect(`/category/${newId}`);
  } catch (error) {
    next(error);
  }
};

export const showEditCategoryForm = async (req, res, next) => {
  try {
    const categoryId = parseInt(req.params.id, 10);
    const category = await getCategoryById(categoryId);
    if (!category) {
      const err = new Error('Category Not Found');
      err.status = 404;
      return next(err);
    }
    res.render('edit-category', {
      title: `Edit ${category.name}`,
      category
    });
  } catch (error) {
    next(error);
  }
};

export const processEditCategoryForm = async (req, res, next) => {
  try {
    const categoryId = parseInt(req.params.id, 10);
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
