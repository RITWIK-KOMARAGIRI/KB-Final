import express from "express";
import {
  submitPerformanceReport,
  getAllReports,
} from "../controllers/performanceController.js";

const router = express.Router();

// Employee submits performance
router.post("/submit", submitPerformanceReport);

// HR fetches all performance reports
router.get("/all", getAllReports);

export default router;
