import express from "express";
import { getCompanies, createCompany, getCompany, updateCompany } from "../controllers/companyController.js";
const router = express.Router();

router.get("/", getCompanies).post("/", createCompany);
router.get("/:id", getCompany).put("/:id", updateCompany)

export default router