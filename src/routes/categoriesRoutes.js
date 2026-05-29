import { Router } from "express";
import {
  categoryValidation,
  processEditCategoryForm,
  processNewCategoryForm,
  processAssignCategoriesForm,
  getCategoriesPage,
  getCategoryDetailsPage,
  showEditCategoryForm,
  showAssignCategoriesForm,
  showNewCategoryForm,
} from "../controllers/categoriesController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/categories", asyncHandler(getCategoriesPage));
router.get("/category/:id", asyncHandler(getCategoryDetailsPage));
router.get("/new-category", asyncHandler(showNewCategoryForm));
router.post(
  "/new-category",
  categoryValidation,
  asyncHandler(processNewCategoryForm),
);
router.get("/edit-category/:id", asyncHandler(showEditCategoryForm));
router.post(
  "/edit-category/:id",
  categoryValidation,
  asyncHandler(processEditCategoryForm),
);
router.get(
  "/project/:projectId/assign-categories",
  asyncHandler(showAssignCategoriesForm),
);
router.post(
  "/project/:projectId/assign-categories",
  asyncHandler(processAssignCategoriesForm),
);

export default router;
