import express from "express";
import { getCompanies, createCompany, getCompany, updateCompany, deleteCompany } from "../controllers/companyController.js";
const router = express.Router();

router.get("/", getCompanies).post("/", createCompany);
router.get("/:id", getCompany).put("/:id", updateCompany).delete("/:id", deleteCompany);

export default router