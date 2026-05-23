import { Router } from "express";
import {
  getOrganizationDetailsPage,
  getOrganizationsPage,
} from "../controllers/organizationsController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/organizations", asyncHandler(getOrganizationsPage));
router.get("/organization/:id", asyncHandler(getOrganizationDetailsPage));

export default router;
