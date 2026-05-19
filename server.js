import dotenv from "dotenv";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getAllCategories } from "./src/models/categories.js";
import { getAllOrganizations } from "./src/models/organizations.js";
import { getAllProjects } from "./src/models/projects.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = Number(process.env.PORT) || 3000;

// Wrapper to catch async errors and pass them to error handler
const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Build a consistent page model for rendering
const buildPageModel = async (title, heading, description, items = []) => ({
  title,
  heading,
  description,
  items,
});

app.get("/", asyncHandler(async (_req, res) => {
  const model = await buildPageModel(
    "Home",
    "CSE 340 Service Portal",
    "Welcome to the home page for organizations and service projects.",
  );

  res.render("index", model);
}));

app.get("/organizations", asyncHandler(async (_req, res) => {
  const organizations = await getAllOrganizations();
  const model = await buildPageModel(
    "Organizations",
    "Partner Organizations",
    "These are the organizations that support our service opportunities.",
    organizations.map((organization) => organization.organization_name),
  );

  res.render("organizations", model);
}));

app.get("/projects", asyncHandler(async (_req, res) => {
  const projects = await getAllProjects();
  const model = await buildPageModel(
    "Service Projects",
    "Current Service Projects",
    "Browse active projects and find a place to serve.",
    projects,
  );

  res.render("projects", model);
}));

app.get("/categories", asyncHandler(async (_req, res) => {
  const categories = await getAllCategories();
  const model = await buildPageModel(
    "Categories",
    "Service Project Categories",
    "Explore service opportunities by category.",
    categories.map((category) => category.category_name),
  );

  res.render("categories", model);
}));

// Global error handler for async route failures
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).send("A server error occurred while loading the requested page.");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
