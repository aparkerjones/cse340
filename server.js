import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import path from "node:path";
import { fileURLToPath } from "node:url";
import homeRoutes from "./src/routes/homeRoutes.js";
import organizationsRoutes from "./src/routes/organizationsRoutes.js";
import projectsRoutes from "./src/routes/projectsRoutes.js";
import categoriesRoutes from "./src/routes/categoriesRoutes.js";
import flash from "./src/middleware/flash.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = Number(process.env.PORT) || 3000;
const sessionSecret = process.env.SESSION_SECRET || "dev-session-secret";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 },
  }),
);
app.use(flash);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(homeRoutes);
app.use(organizationsRoutes);
app.use(projectsRoutes);
app.use(categoriesRoutes);

// Global error handler for async route failures
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).render("500", {
    title: "Server Error",
    heading: "Something Went Wrong",
    message: "A server error occurred while loading the requested page.",
  });
});

app.use((_req, res) => {
  res.status(404).render("404", {
    title: "Not Found",
    heading: "Page Not Found",
    message: "The page you requested does not exist.",
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});