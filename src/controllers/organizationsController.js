import {
  createOrganization,
  getAllOrganizations,
  getOrganizationById,
  getProjectsByOrganizationId,
  updateOrganization,
} from "../models/organizations.js";
import { body, validationResult } from "express-validator";

export const organizationValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Organization name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Organization name must be between 3 and 100 characters")
    .escape(),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters")
    .escape(),
  body("websiteUrl")
    .trim()
    .notEmpty()
    .withMessage("Website URL is required")
    .isURL()
    .withMessage("Please provide a valid URL"),
];

export const getOrganizationsPage = async (_req, res) => {
  const organizations = await getAllOrganizations();

  res.render("organizations", {
    title: "Organizations",
    heading: "Partner Organizations",
    description: "Meet the partner organizations helping make service opportunities happen.",
    items: organizations,
  });
};

export const getOrganizationDetailsPage = async (req, res) => {
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
};

export const showNewOrganizationForm = async (_req, res) => {
  res.render("new-organization", {
    title: "Add New Organization",
  });
};

export const processNewOrganizationForm = async (req, res) => {
  const results = validationResult(req);
  if (!results.isEmpty()) {
    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    return res.redirect("/new-organization");
  }

  const { name, description, websiteUrl } = req.body;
  const organizationId = await createOrganization(name, description, websiteUrl);
  req.flash("success", "Organization added successfully!");
  res.redirect(`/organization/${organizationId}`);
};

export const showEditOrganizationForm = async (req, res) => {
  const organizationId = Number(req.params.id);
  const organizationDetails = await getOrganizationById(organizationId);

  if (!organizationDetails) {
    res.status(404).render("404", {
      title: "Not Found",
      heading: "Organization Not Found",
      message: "We could not find that organization.",
    });
    return;
  }

  res.render("edit-organization", {
    title: `Edit ${organizationDetails.organization_name}`,
    organizationDetails,
  });
};

export const processEditOrganizationForm = async (req, res) => {
  const organizationId = Number(req.params.id);

  const results = validationResult(req);
  if (!results.isEmpty()) {
    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    return res.redirect(`/edit-organization/${organizationId}`);
  }

  const { name, description, websiteUrl } = req.body;
  await updateOrganization(organizationId, name, description, websiteUrl);

  req.flash("success", "Organization updated successfully!");
  res.redirect(`/organization/${organizationId}`);
};
