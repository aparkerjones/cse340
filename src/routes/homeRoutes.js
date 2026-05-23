import { Router } from "express";
import { getHomePage } from "../controllers/homeController.js";

const router = Router();

router.get("/", getHomePage);

export default router;
