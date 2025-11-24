import PerformanceReport from "../models/Performance.js";

// -------------------------------
// Submit Performance Report (EMPLOYEE)
// -------------------------------
export const submitPerformanceReport = async (req, res) => {
  try {
    const { employeeId, taskId, title, description, status } = req.body;

    if (!employeeId || !taskId || !title || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newReport = new PerformanceReport({
      employeeId,
      taskId,
      title,
      description,
      status,
    });

    await newReport.save();

    res.status(200).json({ message: "Performance submitted successfully!" });
  } catch (err) {
    console.error("Submit Performance Error:", err);
    res.status(500).json({ message: "Server error while submitting performance" });
  }
};

// -------------------------------
// Get all reports for HR
// -------------------------------
export const getAllReports = async (req, res) => {
  try {
    const reports = await PerformanceReport.find()
      .populate("employeeId", "name email");

    res.status(200).json(reports);
  } catch (err) {
    console.error("Fetch Reports Error:", err);
    res.status(500).json({ message: "Failed to fetch performance reports" });
  }
};
