import express from "express";
import { getEmployees, createEmployee, updateEmployee, getEmployee } from "../controllers/employeeController.js";
import upload from "../config/multerConfig.js";
const router = express.Router();

router.get("/", getEmployees).post("/",upload.single('image'), createEmployee);
router.get("/:id", getEmployee).put("/:id", upload.single('image'), updateEmployee);

export default router