import express from "express";
import { getFormulas, createFormula, getFormula, updateFormula } from "../controllers/formulaController.js";

const router = express.Router();

router.get("/", getFormulas).post("/", createFormula);
router.get("/:id", getFormula).put("/:id", updateFormula);

export default router;