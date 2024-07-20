import express from "express";
import {createCity, getCities, updateCity, getCity, deleteCity} from '../controllers/cityController.js'
const router = express.Router();

router.get("/", getCities).post("/", createCity);
router.get("/:id", getCity).put("/:id", updateCity).delete("/:id", deleteCity);

export default router