import {
  getAllCategories,
  getCategoryById,
  getProjectsByCategoryId,
  updateCategoryAssignments,
} from "../models/categories.js";
import { getProjectDetails, getCategoriesByProjectId } from "../models/projects.js";

export async function getCategoriesPage(_req, res) {
  const categories = await getAllCategories();

  res.render("categories", {
    title: "Categories",
    heading: "Service Project Categories",
    description: "Explore service opportunities by category.",
    items: categories,
  });
}

export async function getCategoryDetailsPage(req, res) {
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
}

export async function showAssignCategoriesForm(req, res) {
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
}

export async function processAssignCategoriesForm(req, res) {
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
}
