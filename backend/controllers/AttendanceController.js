// backend/controllers/attendanceController.js
import Attendance from "../models/Attendance.js";

export const getAttendanceForEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { month } = req.query;

    if (!employeeId) {
      return res.status(400).json({ message: "employeeId is required" });
    }

    const filter = { employee: employeeId };

    // Month filter
    if (month) {
      const [year, m] = month.split("-").map(Number);
      if (!year || !m) {
        return res.status(400).json({ message: "Invalid month format. Use YYYY-MM." });
      }

      const start = new Date(year, m - 1, 1);
      const end = new Date(year, m, 1);

      filter.date = { $gte: start, $lt: end };
    }

    const records = await Attendance.find(filter)
      .populate("employee", "name email position department") // ➜ employee data
      .sort({ date: -1 });

    res.json(records);
  } catch (error) {
    console.error("getAttendanceForEmployee error:", error);
    res.status(500).json({ message: "Error fetching attendance" });
  }
};
// GET /api/attendance/all?month=YYYY-MM
export const getAllAttendance = async (req, res) => {
  try {
    const { month } = req.query;

    const filter = {};

    // Optional month filter
    if (month) {
      const [year, m] = month.split("-").map(Number);
      const start = new Date(year, m - 1, 1);
      const end = new Date(year, m, 1);

      filter.date = { $gte: start, $lt: end };
    }

    const records = await Attendance.find(filter)
      .populate("employee", "name")  // include employee name
      .sort({ date: -1 });

    res.json(records);
  } catch (error) {
    console.error("getAllAttendance error:", error);
    res.status(500).json({ message: "Error fetching attendance" });
  }
};