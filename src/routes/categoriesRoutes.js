import { Router } from "express";
import {
  getCategoriesPage,
  getCategoryDetailsPage,
} from "../controllers/categoriesController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/categories", asyncHandler(getCategoriesPage));
router.get("/category/:id", asyncHandler(getCategoryDetailsPage));

export default router;
