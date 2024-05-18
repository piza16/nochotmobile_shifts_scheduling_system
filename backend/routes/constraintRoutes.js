import express from "express";
import {
  getEmployeeWeeklyConstraint,
  getAllEmployeesWeeklyConstraint,
  updateConstraint,
} from "../controllers/constraintController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getEmployeeWeeklyConstraint);

router.route("/all").get(protect, admin, getAllEmployeesWeeklyConstraint);

router.route("/:id").put(protect, updateConstraint);

export default router;
