import express from "express";
import { getFormulas, createFormula } from "../controllers/formulaController.js";

const router = express.Router();

router.get("/", getFormulas);
router.post("/", createFormula);

export default router;