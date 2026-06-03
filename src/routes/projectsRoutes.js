import { Router } from "express";
import {
  getProjectDetailsPage,
  getProjectsPage,
  processEditProjectForm,
  processNewProjectForm,
  projectValidation,
  showEditProjectForm,
  showNewProjectForm,
} from "../controllers/projectsController.js";
import requireRole from "../middleware/requireRole.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/projects", asyncHandler(getProjectsPage));
router.get("/project/:id", asyncHandler(getProjectDetailsPage));
router.get("/new-project", requireRole("admin"), asyncHandler(showNewProjectForm));
router.post(
  "/new-project",
  requireRole("admin"),
  projectValidation,
  asyncHandler(processNewProjectForm),
);
router.get(
  "/edit-project/:id",
  requireRole("admin"),
  asyncHandler(showEditProjectForm),
);
router.post(
  "/edit-project/:id",
  requireRole("admin"),
  projectValidation,
  asyncHandler(processEditProjectForm),
);

export default router;
