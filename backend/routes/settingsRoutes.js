import express from "express";
import {
  getSettings,
  updateSettings,
  upload
} from "../controllers/settingsController.js";

const router = express.Router();

router.get("/:id", getSettings);
router.put("/update/:id", upload, updateSettings);

export default router;
