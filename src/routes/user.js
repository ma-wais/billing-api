import express from "express";
import { check } from "express-validator";
import auth from '../middleware/auth.js'
import { getUser, login, register, logout } from "../controllers/user.js";
const router = express.Router();


router.post(
  '/register',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
  ],
  register
);

router.post('/login', login);

router.get('/user', auth, getUser);

router.post('/logout', logout);

export default router