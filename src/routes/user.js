import express from "express";
import { check } from "express-validator";
import auth from '../middleware/auth.js'
import { getUser, login, register, logout } from "../controllers/user.js";
import jwt from "jsonwebtoken";

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

router.get('/check-auth', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ isAuthenticated: false });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ isAuthenticated: true, user: decoded.user });
  } catch (err) {
    res.status(401).json({ isAuthenticated: false });
  }
});

export default router