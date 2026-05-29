import {
  createCategory,
  getAllCategories,
  getCategoryById,
  getProjectsByCategoryId,
  updateCategory,
  updateCategoryAssignments,
} from "../models/categories.js";
import { getProjectDetails, getCategoriesByProjectId } from "../models/projects.js";
import { body, validationResult } from "express-validator";

export const categoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Category name must be between 3 and 100 characters")
    .escape(),
];

export const getCategoriesPage = async (_req, res) => {
  const categories = await getAllCategories();

  res.render("categories", {
    title: "Categories",
    heading: "Service Project Categories",
    description: "Explore service opportunities by category.",
    items: categories,
  });
};

export const getCategoryDetailsPage = async (req, res) => {
  const categoryId = Number(req.params.id);
  const category = await getCategoryById(categoryId);

  if (!category) {
    res.status(404).render("404", {
      title: "Not Found",
      heading: "Category Not Found",
      message: "We could not find that service project category.",
    });
    return;
  }

  const projects = await getProjectsByCategoryId(categoryId);

  res.render("category-detail", {
    title: category.category_name,
    heading: `Category: ${category.category_name}`,
    category,
    projects,
  });
};

export const showNewCategoryForm = async (_req, res) => {
  res.render("new-category", {
    title: "Add New Category",
  });
};

export const processNewCategoryForm = async (req, res) => {
  const results = validationResult(req);
  if (!results.isEmpty()) {
    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    return res.redirect("/new-category");
  }

  const { name } = req.body;

  try {
    const categoryId = await createCategory(name);
    req.flash("success", "Category added successfully!");
    return res.redirect(`/category/${categoryId}`);
  } catch (error) {
    if (error?.code === "23505") {
      req.flash("error", "That category already exists.");
      return res.redirect("/new-category");
    }

    throw error;
  }
};

export const showEditCategoryForm = async (req, res) => {
  const categoryId = Number(req.params.id);
  const category = await getCategoryById(categoryId);

  if (!category) {
    res.status(404).render("404", {
      title: "Not Found",
      heading: "Category Not Found",
      message: "We could not find that service project category.",
    });
    return;
  }

  res.render("edit-category", {
    title: `Edit ${category.category_name}`,
    category,
  });
};

export const processEditCategoryForm = async (req, res) => {
  const categoryId = Number(req.params.id);
  const results = validationResult(req);

  if (!results.isEmpty()) {
    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    return res.redirect(`/edit-category/${categoryId}`);
  }

  const { name } = req.body;

  try {
    await updateCategory(categoryId, name);
    req.flash("success", "Category updated successfully!");
    return res.redirect(`/category/${categoryId}`);
  } catch (error) {
    if (error?.code === "23505") {
      req.flash("error", "That category name is already in use.");
      return res.redirect(`/edit-category/${categoryId}`);
    }

    throw error;
  }
};

export const showAssignCategoriesForm = async (req, res) => {
  const projectId = Number(req.params.projectId);
  const project = await getProjectDetails(projectId);

  if (!project) {
    res.status(404).render("404", {
      title: "Not Found",
      heading: "Project Not Found",
      message: "We could not find that service project.",
    });
    return;
  }

  const allCategories = await getAllCategories();
  const assignedCategories = await getCategoriesByProjectId(projectId);

  res.render("assign-categories", {
    title: "Assign Categories to Project",
    project,
    allCategories,
    assignedCategoryIds: assignedCategories.map((category) => category.category_id),
  });
};

export const processAssignCategoriesForm = async (req, res) => {
  const projectId = Number(req.params.projectId);
  const categoryIds = req.body.categoryIds;

  const categoryList = Array.isArray(categoryIds)
    ? categoryIds
    : categoryIds
      ? [categoryIds]
      : [];

  await updateCategoryAssignments(projectId, categoryList);
  req.flash("success", "Project categories updated successfully!");
  res.redirect(`/project/${projectId}`);
};
