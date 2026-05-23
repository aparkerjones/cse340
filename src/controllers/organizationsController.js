import {
  getAllOrganizations,
  getOrganizationById,
  getProjectsByOrganizationId,
} from "../models/organizations.js";

export async function getOrganizationsPage(_req, res) {
  const organizations = await getAllOrganizations();

  res.render("organizations", {
    title: "Organizations",
    heading: "Partner Organizations",
    description: "Select an organization to view details and current projects.",
    items: organizations,
  });
}

export async function getOrganizationDetailsPage(req, res) {
  const organizationId = Number(req.params.id);
  const organization = await getOrganizationById(organizationId);

  if (!organization) {
    res.status(404).render("404", {
      title: "Not Found",
      heading: "Organization Not Found",
      message: "We could not find that organization.",
    });
    return;
  }

  const projects = await getProjectsByOrganizationId(organizationId);

  res.render("organization-detail", {
    title: organization.organization_name,
    heading: organization.organization_name,
    organization,
    projects,
  });
}
