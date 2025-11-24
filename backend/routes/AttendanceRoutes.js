import express from "express";
import {
  getAttendanceForEmployee,
  getAllAttendance
} from "../controllers/AttendanceController.js";

const router = express.Router();

// employee specific
router.get("/employee/:employeeId", getAttendanceForEmployee);

// HR / Director → fetch all
router.get("/all", getAllAttendance);

export default router;