import { Router } from "express";
import {
  getProjectDetailsPage,
  getProjectsPage,
} from "../controllers/projectsController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/projects", asyncHandler(getProjectsPage));
router.get("/project/:id", asyncHandler(getProjectDetailsPage));

export default router;
