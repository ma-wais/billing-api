import express from "express";
const router = express.Router();
import {createCity, getCities} from '../controllers/cityController.js'


router.get("/", getCities);
router.post("/", createCity);

export default router