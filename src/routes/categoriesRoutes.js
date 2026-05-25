import { Router } from "express";
import {
  processAssignCategoriesForm,
  getCategoriesPage,
  getCategoryDetailsPage,
  showAssignCategoriesForm,
} from "../controllers/categoriesController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/categories", asyncHandler(getCategoriesPage));
router.get("/category/:id", asyncHandler(getCategoryDetailsPage));
router.get(
  "/project/:projectId/assign-categories",
  asyncHandler(showAssignCategoriesForm),
);
router.post(
  "/project/:projectId/assign-categories",
  asyncHandler(processAssignCategoriesForm),
);

export default router;
