import express from "express";
import {
    getEmployees,
    createEmployee,
    updateEmployee,
    getEmployee,
    deleteEmployee,
    loginEmployee,
    getCurrentEmployee,
    logoutEmployee,
    changeEmployeeCode
} from "../controllers/employeeController.js";
import upload from "../config/multerConfig.js";

const router = express.Router();

const ensureAuthenticated = (req, res, next) => {
    const employeeId = req.cookies.employeeId;
    if (employeeId) {
        req.employeeId = employeeId;
        next();
    } else {
        res.status(401).json({ msg: 'Unauthorized' });
    }
};

router.get("/", getEmployees);
router.post("/", upload.single('image'), createEmployee);
router.post('/login', loginEmployee);
router.get('/current', ensureAuthenticated, getCurrentEmployee);
router.post('/logout', logoutEmployee);
router.put('/code/:id', changeEmployeeCode);
router.get('/protected-route', ensureAuthenticated, (req, res) => {
    res.status(200).json({ msg: 'You have access to this route' });
});

router.get("/:id", getEmployee).delete("/:id", deleteEmployee);
router.put("/:id", upload.single('image'), updateEmployee);

export default router;
