import {
  getAllCategories,
  getCategoryById,
  getProjectsByCategoryId,
} from "../models/categories.js";

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
