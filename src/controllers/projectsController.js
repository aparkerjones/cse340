import {
  addVolunteer,
  createProject,
  getCategoriesByProjectId,
  getProjectDetails,
  getUpcomingProjects,
  isVolunteering,
  removeVolunteer,
  updateProject,
} from "../models/projects.js";
import { getAllOrganizations } from "../models/organizations.js";
import { body, validationResult } from "express-validator";

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const flashValidationErrors = (req, results) => {
  if (results.isEmpty()) {
    return false;
  }

  for (const error of results.array()) {
    req.flash("error", error.msg);
  }

  return true;
};

const renderProjectNotFound = (res) => {
  res.status(404).render("404", {
    title: "Not Found",
    heading: "Project Not Found",
    message: "We could not find that service project.",
  });
};

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
    renderProjectNotFound(res);
    return;
  }

  const categories = await getCategoriesByProjectId(projectId);

  const userId = req.session.user?.user_id ?? null;
  const volunteering = userId ? await isVolunteering(userId, projectId) : false;

  res.render("project-detail", {
    title: project.title,
    heading: project.title,
    project,
    categories,
    volunteering,
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
  const validationResults = validationResult(req);
  if (flashValidationErrors(req, validationResults)) {
    return res.redirect("/new-project");
  }

  const { organizationId, title, description, location, date } = req.body;
  await createProject(title, description, location, date, Number(organizationId));
  req.flash("success", "Service project added successfully!");
  res.redirect("/projects");
};

export const showEditProjectForm = async (req, res) => {
  const projectId = Number(req.params.id);
  const project = await getProjectDetails(projectId);

  if (!project) {
    renderProjectNotFound(res);
    return;
  }

  const organizations = await getAllOrganizations();

  // HTML date inputs expect a YYYY-MM-DD value.
  const projectDate =
    project.project_date instanceof Date
      ? project.project_date.toISOString().slice(0, 10)
      : String(project.project_date).slice(0, 10);

  res.render("edit-project", {
    title: `Edit ${project.title}`,
    project,
    projectDate,
    organizations,
  });
};

export const processEditProjectForm = async (req, res) => {
  const projectId = Number(req.params.id);

  const validationResults = validationResult(req);
  if (flashValidationErrors(req, validationResults)) {
    return res.redirect(`/edit-project/${projectId}`);
  }

  const { organizationId, title, description, location, date } = req.body;
  await updateProject(
    projectId,
    title,
    description,
    location,
    date,
    Number(organizationId),
  );

  req.flash("success", "Service project updated successfully!");
  res.redirect(`/project/${projectId}`);
};

export const addVolunteerHandler = async (req, res) => {
  const projectId = Number(req.params.id);
  const userId = req.session.user.user_id;

  const project = await getProjectDetails(projectId);
  if (!project) {
    renderProjectNotFound(res);
    return;
  }

  await addVolunteer(userId, projectId);
  req.flash("success", "You have signed up to volunteer for this project!");
  res.redirect(`/project/${projectId}`);
};

export const removeVolunteerHandler = async (req, res) => {
  const projectId = Number(req.params.id);
  const userId = req.session.user.user_id;

  const project = await getProjectDetails(projectId);
  if (!project) {
    renderProjectNotFound(res);
    return;
  }

  await removeVolunteer(userId, projectId);
  req.flash("success", "You have been removed as a volunteer from this project.");
  res.redirect(`/project/${projectId}`);
};
