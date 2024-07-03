import express from 'express';
import { getShops, createShop } from '../controllers/shopController.js';
import upload from '../config/multerConfig.js';

const router = express.Router();

router.get('/', getShops);
router.post('/', upload.single('image'), createShop);

export default router;
