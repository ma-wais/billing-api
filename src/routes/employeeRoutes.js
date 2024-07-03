import express from "express";
import { getEmployees, createEmployee } from "../controllers/employeeController.js";
import upload from "../config/multerConfig.js";
const router = express.Router();

router.get("/", getEmployees);
router.post("/",upload.single('image'), createEmployee);

export default router