// backend/controllers/employeeController.js
import Employee from "../models/Employee.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

// ✅ GET /api/employees - fetch all employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("assignedHr", "name email") // ✅ show HR details instead of ObjectId
      .sort({ createdAt: -1 });

    res.json(employees);
  } catch (error) {
    console.error("getEmployees error:", error);
    res.status(500).json({ message: "Error fetching employees" });
  }
};
export const getEmployeesByHr = async (req, res) => {
  try {

    const { hrId } = req.params; // coming from route /employees/hr/:hrId

    const employees = await Employee.find({ assignedHr: hrId }).populate("assignedHr", "name email");

    if (!employees || employees.length === 0) {
      return res.status(404).json({ message: "No employees found for this HR" });
    }

    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees by HR:", error);
    res.status(500).json({ message: "Server error" });
  }
}
// ✅ POST /api/employees - create new employee
export const createEmployee = async (req, res) => {
  try {
    const {
      employeeId,
      name,
      dob,
      email,
      role,
      position,
      department,
      salary,
      mobile,
      status,
      photo,
      assignedHr,
      assignedPm,
    } = req.body;

    console.log("CREATE EMPLOYEE REQ.BODY:", req.body);

    if (!name || !dob || !email) {
      return res
        .status(400)
        .json({ message: "name, dob, and email are required" });
    }

    const payload = {
      employeeId,
      name: name.trim(),
      dob: dob ? new Date(dob) : null,
      email: email.toLowerCase().trim(),
      role: role || "employee",
      position: position || "",
      department: department || "",
      salary: salary || 0,
      mobile: mobile || "",
      status: status || "Active",
      photo: photo || "",
      assignedHr: assignedHr || null, // ✅ Save HR reference
      assignedPm: assignedPm || null, // ✅ Save PM reference
    };

    const created = await Employee.create(payload);

    // ✅ Send notification
    try {
      await Notification.create({
        to: created._id,
        title: "New Employee Added",
        body: `Employee ${name} has been added.`,
        data: payload,
      });
    } catch (err) {
      console.error("❌ Notification creation failed:", err);
    }

    // ✅ Populate HR details in response
    const populated = await created.populate("assignedHr", "name email");

    res.status(201).json(populated);
  } catch (error) {
    console.error("❌ createEmployee error:", error);
    if (error?.code === 11000 && error?.keyPattern?.email) {
      return res.status(409).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: error.message || "Error creating employee" });
  }
};

// ✅ PUT /api/employees/:id - update employee
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const update = { ...req.body };
     console.log("Update EMPLOYEE REQ.BODY:", req.body);

    // 🔹 Normalize
    if (update.email) update.email = update.email.toLowerCase().trim();
    if (update.name) update.name = update.name.trim();
    if (update.dob) update.dob = new Date(update.dob);

    const updated = await Employee.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).populate("assignedHr", "name email"); // ✅ return HR details

    if (!updated) return res.status(404).json({ message: "Employee not found" });

    res.json(updated);
  } catch (error) {
    console.error("updateEmployee error:", error);
    if (error?.code === 11000 && error?.keyPattern?.email) {
      return res.status(409).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Error updating employee" });
  }
};

// ✅ DELETE /api/employees/:id - delete employee
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const del = await Employee.findByIdAndDelete(id);

    if (!del) return res.status(404).json({ message: "Employee not found" });

    res.json({ message: "Employee deleted" });
  } catch (error) {
    console.error("deleteEmployee error:", error);
    res.status(500).json({ message: "Error deleting employee" });
  }
};
// ✅ GET /api/employees/:id - get single employee
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id).populate(
      "assignedHr assignedPm",
      "name email"
    );
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (error) {
    console.error("getEmployeeById error:", error);
    res.status(500).json({ message: "Error fetching employee" });
  }
};


