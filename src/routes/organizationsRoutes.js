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
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/organizations", asyncHandler(getOrganizationsPage));
router.get("/organization/:id", asyncHandler(getOrganizationDetailsPage));
router.get("/new-organization", asyncHandler(showNewOrganizationForm));
router.post(
  "/new-organization",
  organizationValidation,
  asyncHandler(processNewOrganizationForm),
);
router.get("/edit-organization/:id", asyncHandler(showEditOrganizationForm));
router.post(
  "/edit-organization/:id",
  organizationValidation,
  asyncHandler(processEditOrganizationForm),
);

export default router;
