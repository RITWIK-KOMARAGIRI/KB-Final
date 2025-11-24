import Settings from "../models/Settings.js";
import multer from "multer";

// File storage
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

export const upload = multer({ storage }).single("logo");

// Get settings
export const getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne({ directorId: req.params.id });
    res.status(200).json(settings);
  } catch (err) {
    res.status(500).json({ message: "Error loading settings" });
  }
};

// Update settings
export const updateSettings = async (req, res) => {
  try {
    const updateData = req.body;

    if (req.file) updateData.logo = "/uploads/" + req.file.filename;

    const updated = await Settings.findOneAndUpdate(
      { directorId: req.params.id },
      updateData,
      { new: true, upsert: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating settings" });
  }
};
