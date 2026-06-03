import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";
import { authenticateUser, createUser } from "../models/users.js";

const SALT_ROUNDS = 10;

const flashValidationErrors = (req, results) => {
  if (results.isEmpty()) {
    return false;
  }

  for (const error of results.array()) {
    req.flash("error", error.msg);
  }

  return true;
};

export const registrationValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters")
    .escape(),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

export const showUserRegistrationForm = async (_req, res) => {
  res.render("register", {
    title: "Register",
  });
};

export const processUserRegistrationForm = async (req, res) => {
  const validationResults = validationResult(req);
  if (flashValidationErrors(req, validationResults)) {
    return res.redirect("/register");
  }

  const { name, email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    await createUser(name, email, passwordHash);
    req.flash("success", "Registration successful. You can now log in.");
    return res.redirect("/login");
  } catch (error) {
    if (error?.code === "23505") {
      req.flash("error", "That email is already registered.");
      return res.redirect("/register");
    }

    throw error;
  }
};

export const showLoginForm = async (_req, res) => {
  res.render("login", {
    title: "Login",
  });
};

export const processLoginForm = async (req, res) => {
  const validationResults = validationResult(req);
  if (flashValidationErrors(req, validationResults)) {
    return res.redirect("/login");
  }

  const { email, password } = req.body;
  const user = await authenticateUser(email, password);

  if (!user) {
    req.flash("error", "Login failed. Please check your email and password.");
    return res.redirect("/login");
  }

  req.session.user = user;
  req.flash("success", "Login successful.");
  console.log("User logged in:", user);
  res.redirect("/dashboard");
};

export const processLogout = (req, res) => {
  if (req.session?.user) {
    delete req.session.user;
  }

  req.flash("success", "You have logged out.");
  res.redirect("/login");
};

export const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    req.flash("error", "Please log in to access that page.");
    res.redirect("/login");
    return;
  }

  next();
};

export const showDashboard = async (req, res) => {
  const { name, email } = req.session.user;

  res.render("dashboard", {
    title: "Dashboard",
    name,
    email,
  });
};