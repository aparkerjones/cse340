import { Router } from "express";
import {
  loginValidation,
  processLoginForm,
  processLogout,
  processUserRegistrationForm,
  registrationValidation,
  requireLogin,
  showDashboard,
  showLoginForm,
  showUserRegistrationForm,
  showUsersPage,
} from "../controllers/users.js";
import requireRole from "../middleware/requireRole.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/register", asyncHandler(showUserRegistrationForm));
router.post(
  "/register",
  registrationValidation,
  asyncHandler(processUserRegistrationForm),
);

router.get("/login", asyncHandler(showLoginForm));
router.post("/login", loginValidation, asyncHandler(processLoginForm));

router.get("/logout", processLogout);

router.get("/dashboard", requireLogin, asyncHandler(showDashboard));
router.get(
  "/users",
  requireLogin,
  requireRole("admin"),
  asyncHandler(showUsersPage),
);

export default router;