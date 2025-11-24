// backend/controllers/authController.js
import User from "../models/User.js";
import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";
import bcrypt from "bcryptjs";

// SIGNIN + record login time / attendance
export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("SIGNIN REQUEST:", email);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    let isMatch = false;

    if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = user.password === password;
    }

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ LOGIN SUCCESS — record login time + attendance if this user is linked to an Employee
    const now = new Date();
    let employeeDoc = null;

    if (user.employee) {
      employeeDoc = await Employee.findById(user.employee);
      if (employeeDoc) {
        // last login time
        employeeDoc.lastLoginAt = now;
        await employeeDoc.save();

        // Attendance record for today
        const startOfDay = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

        let record = await Attendance.findOne({
          employee: employeeDoc._id,
          date: startOfDay,
        });

        if (!record) {
          // first login of the day: create new record
          await Attendance.create({
            employee: employeeDoc._id,
            date: startOfDay,
            loginAt: now,
            status: "Present",
          });
        } else if (!record.loginAt) {
          // edge case: record exists but loginAt missing
          record.loginAt = now;
          record.status = "Present";
          await record.save();
        }
      }
    }

    // Response sent to frontend (same as before)
    res.json({
      _id: user._id,
      name: user.name,
      role: user.role,
      email: user.email,
  employeeId: user.role === "employee" ? user.employee : null,    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Logout: record logout time / attendance
export const logout = async (req, res) => {
  try {
    const { employeeId } = req.body; // Expect Employee _id from frontend

    if (!employeeId) {
      return res.status(400).json({ message: "employeeId is required" });
    }

    const employeeDoc = await Employee.findById(employeeId);
    if (!employeeDoc) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const now = new Date();
    employeeDoc.lastLogoutAt = now;
    await employeeDoc.save();

    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const record = await Attendance.findOne({
      employee: employeeDoc._id,
      date: startOfDay,
    });

    if (record && !record.logoutAt) {
      record.logoutAt = now;
      await record.save();
    }

    res.json({ message: "Logout tracked" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Save credentials - NOW using Employee _id in URL
export const credentialsSent = async (req, res) => {
  try {
    const { id } = req.params; // this is Employee _id from URL
    const { email, password, role } = req.body;

    console.log("CREDENTIALS REQUEST:", id, email, role);

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find employee by _id
    const employeeDoc = await Employee.findById(id);
    if (!employeeDoc) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check if credentials already exist for this employee
    const existingUser = await User.findOne({ employee: employeeDoc._id });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Credentials already created for this employee" });
    }

    // Update credentialstatus
    await Employee.findByIdAndUpdate(
      id,
      { credentialstatus: "Completed" },
      { new: true }
    );

    // ✅ Safe employeeId: use business employeeId if present, else fallback to _id
    const safeEmployeeId =
      employeeDoc.employeeId && employeeDoc.employeeId.trim() !== ""
        ? employeeDoc.employeeId
        : employeeDoc._id.toString();

    // Create User entry for login
    const user = await User.create({
      employeeId: safeEmployeeId, // ✅ never empty now
      name: employeeDoc.name,
      email,
      password, // plain text for testing
      role,
      employee: employeeDoc._id,
    });

    res.status(201).json({ message: "Credentials created", user });
  } catch (error) {
    console.error("Error creating credentials:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const employeesAssigned = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).populate("employee");
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const projectManagersAssigned = async (req, res) => {
  try {
    const pms = await Employee.find({ role: "project managers" });
    res.json(pms);
  } catch (error) {
    console.error("Error fetching project managers:", error);
    res.status(500).json({ message: "Server error" });
  }
};
