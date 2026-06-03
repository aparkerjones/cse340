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
} from "../controllers/users.js";
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

export default router;