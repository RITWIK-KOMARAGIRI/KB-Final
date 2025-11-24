import Employee from "../models/Employee.js";

export const getAllEmployeesBasic = async (req, res) => {
  try {
    const employees = await Employee.find({}, "name email department position");
    res.json(employees);
  } catch (error) {
    console.error("getAllEmployeesBasic error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
