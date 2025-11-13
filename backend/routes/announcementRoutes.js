import express from "express";
import Announcement from "../models/Announcement.js";

const router = express.Router();

// Get all announcements
router.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: "Error fetching announcements" });
  }
});

// Create new announcement
router.post("/", async (req, res) => {
  try {
    const newAnnounce = new Announcement(req.body);
    await newAnnounce.save();
    res.status(201).json(newAnnounce);
  } catch (err) {
    res.status(500).json({ message: "Error creating announcement" });
  }
});

// Delete an announcement
router.delete("/:id", async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: "Announcement deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting announcement" });
  }
});

export default router;
