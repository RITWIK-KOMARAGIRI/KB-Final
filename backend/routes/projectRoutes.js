import express from "express";
import Employee from "../models/Employee.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// ------------------- Multer config -------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Unique filename: timestamp + original extension
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ------------------- Assign new task -------------------
router.post("/assignProject", upload.array("files"), async (req, res) => {
  try {
    const { employeeId, title, description, timeline, links } = req.body;

    // Uploaded files paths
    const uploadedFiles = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    // Links (comma-separated)
    const linkFiles = links
      ? typeof links === "string"
        ? links.split(",").map(l => l.trim())
        : Array.isArray(links)
        ? links
        : []
      : [];

    const allFiles = [...uploadedFiles, ...linkFiles];

    const newTask = {
      title,
      description,
      timeline,
      status: "Pending",
      files: allFiles,
    };

    const employee = await Employee.findByIdAndUpdate(
      employeeId,
      { $push: { projects: newTask } },
      { new: true }
    );

    res.json({ success: true, message: "Task assigned", employee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error assigning task" });
  }
});

// ------------------- Update existing task -------------------
router.post("/updateProject/:employeeId/:taskId", upload.array("files"), async (req, res) => {
  try {
    const { employeeId, taskId } = req.params;
    const { title, description, timeline, links } = req.body;

    let updateData = {
      "projects.$.title": title,
      "projects.$.description": description,
      "projects.$.timeline": timeline,
    };

    const uploadedFiles = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    const linkFiles = links
      ? typeof links === "string"
        ? links.split(",").map(l => l.trim())
        : Array.isArray(links)
        ? links
        : []
      : [];

    if (uploadedFiles.length || linkFiles.length) {
      updateData["projects.$.files"] = [...uploadedFiles, ...linkFiles];
    }

    const employee = await Employee.findOneAndUpdate(
      { _id: employeeId, "projects._id": taskId },
      { $set: updateData },
      { new: true }
    );

    res.json({ success: true, message: "Task updated", employee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error updating task" });
  }
});

// ------------------- Fetch tasks for employee -------------------
router.get("/task/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    res.json(employee.projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching tasks" });
  }
});

// ------------------- Update task status -------------------
router.patch("/updateTaskStatus/:employeeId/:taskId", async (req, res) => {
  const { employeeId, taskId } = req.params;
  const { status } = req.body;

  if (!["Pending", "In Progress", "Completed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const employee = await Employee.findOneAndUpdate(
      { _id: employeeId, "projects._id": taskId },
      { $set: { "projects.$.status": status } },
      { new: true }
    );

    if (!employee) return res.status(404).json({ message: "Employee or task not found" });

    res.json({ message: "Task status updated successfully", employee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- Fetch employees for PM -------------------
router.get("/employees/pm/:pmId", async (req, res) => {
  try {
    const employees = await Employee.find({ assignedPm: req.params.pmId });
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching employees" });
  }
});


export default router;
