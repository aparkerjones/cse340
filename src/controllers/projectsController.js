import {
  getCategoriesByProjectId,
  getProjectDetails,
  getUpcomingProjects,
} from "../models/projects.js";

const NUMBER_OF_UPCOMING_PROJECTS = 5;

export async function getProjectsPage(_req, res) {
  const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

  res.render("projects", {
    title: "Upcoming Service Projects",
    heading: "Next Five Upcoming Service Projects",
    description:
      "These are the next upcoming opportunities. Select a project for full details.",
    items: projects,
  });
}

export async function getProjectDetailsPage(req, res) {
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
}
