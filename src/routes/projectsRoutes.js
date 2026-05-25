import { Router } from "express";
import {
  getProjectDetailsPage,
  getProjectsPage,
  processNewProjectForm,
  projectValidation,
  showNewProjectForm,
} from "../controllers/projectsController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/projects", asyncHandler(getProjectsPage));
router.get("/project/:id", asyncHandler(getProjectDetailsPage));
router.get("/new-project", asyncHandler(showNewProjectForm));
router.post(
  "/new-project",
  projectValidation,
  asyncHandler(processNewProjectForm),
);

export default router;
