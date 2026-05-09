import dotenv from "dotenv";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = Number(process.env.PORT) || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

const buildPageModel = async (title, heading, description, items = []) => ({
  title,
  heading,
  description,
  items,
});

app.get("/", async (_req, res) => {
  const model = await buildPageModel(
    "Home",
    "CSE 340 Service Portal",
    "Welcome to the home page for organizations and service projects.",
  );

  res.render("index", model);
});

app.get("/organizations", async (_req, res) => {
  const model = await buildPageModel(
    "Organizations",
    "Partner Organizations",
    "These are the organizations that support our service opportunities.",
    [
      "Habitat for Humanity",
      "The Nature Conservancy",
      "Boys & Girls Club",
      "Local Food Bank",
    ],
  );

  res.render("organizations", model);
});

app.get("/projects", async (_req, res) => {
  const model = await buildPageModel(
    "Service Projects",
    "Current Service Projects",
    "Browse active projects and find a place to serve.",
    [
      "Neighborhood Cleanup Day",
      "After-School Tutoring",
      "Community Garden Build",
      "Senior Center Tech Help",
    ],
  );

  res.render("projects", model);
});

app.get("/categories", async (_req, res) => {
  const model = await buildPageModel(
    "Categories",
    "Service Project Categories",
    "Explore service opportunities by category.",
    [
      "Environmental",
      "Educational",
      "Community Service",
      "Health and Wellness",
    ],
  );

  res.render("categories", model);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
