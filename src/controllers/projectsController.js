import {
  createProject,
  getCategoriesByProjectId,
  getProjectDetails,
  getUpcomingProjects,
} from "../models/projects.js";
import { getAllOrganizations } from "../models/organizations.js";
import { body, validationResult } from "express-validator";

const NUMBER_OF_UPCOMING_PROJECTS = 5;

export const projectValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Project title is required")
    .isLength({ min: 3, max: 120 })
    .withMessage("Project title must be between 3 and 120 characters")
    .escape(),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Project description is required")
    .isLength({ max: 1000 })
    .withMessage("Project description cannot exceed 1000 characters")
    .escape(),
  body("location")
    .trim()
    .notEmpty()
    .withMessage("Project location is required")
    .isLength({ max: 120 })
    .withMessage("Project location cannot exceed 120 characters")
    .escape(),
  body("date")
    .notEmpty()
    .withMessage("Project date is required")
    .isISO8601()
    .withMessage("Please provide a valid date"),
  body("organizationId")
    .notEmpty()
    .withMessage("Organization is required")
    .isInt({ min: 1 })
    .withMessage("Please choose a valid organization"),
];

export const getProjectsPage = async (_req, res) => {
  const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

  res.render("projects", {
    title: "Upcoming Service Projects",
    heading: "Next Five Upcoming Service Projects",
    description:
      "These are the next upcoming opportunities. Select a project for full details.",
    items: projects,
  });
};

export const getProjectDetailsPage = async (req, res) => {
  const projectId = Number(req.params.id);
  const project = await getProjectDetails(projectId);

  if (!project) {
    res.status(404).render("404", {
      title: "Not Found",
      heading: "Project Not Found",
      message: "We could not find that service project.",
    });
    return;
  }

  const categories = await getCategoriesByProjectId(projectId);

  res.render("project-detail", {
    title: project.title,
    heading: project.title,
    project,
    categories,
  });
};

export const showNewProjectForm = async (_req, res) => {
  const organizations = await getAllOrganizations();

  res.render("new-project", {
    title: "Add New Service Project",
    organizations,
  });
};

export const processNewProjectForm = async (req, res) => {
  const results = validationResult(req);
  if (!results.isEmpty()) {
    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    return res.redirect("/new-project");
  }

  const { organizationId, title, description, location, date } = req.body;
  await createProject(title, description, location, date, Number(organizationId));
  req.flash("success", "Service project added successfully!");
  res.redirect("/projects");
};
