import { Router } from "express";
import {
  getOrganizationDetailsPage,
  getOrganizationsPage,
  organizationValidation,
  processEditOrganizationForm,
  processNewOrganizationForm,
  showEditOrganizationForm,
  showNewOrganizationForm,
} from "../controllers/organizationsController.js";
import requireRole from "../middleware/requireRole.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/organizations", asyncHandler(getOrganizationsPage));
router.get("/organization/:id", asyncHandler(getOrganizationDetailsPage));
router.get(
  "/new-organization",
  requireRole("admin"),
  asyncHandler(showNewOrganizationForm),
);
router.post(
  "/new-organization",
  requireRole("admin"),
  organizationValidation,
  asyncHandler(processNewOrganizationForm),
);
router.get(
  "/edit-organization/:id",
  requireRole("admin"),
  asyncHandler(showEditOrganizationForm),
);
router.post(
  "/edit-organization/:id",
  requireRole("admin"),
  organizationValidation,
  asyncHandler(processEditOrganizationForm),
);

export default router;
