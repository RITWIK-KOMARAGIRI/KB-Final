// backend/models/Employee.js
import mongoose from "mongoose";

const projectSubSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  timeline: String,
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
  files: [String],
});

const employeeSchema = new mongoose.Schema(
  {
    employeeId: { type: String, unique: true }, // business ID like "1234567"
    name: { type: String, required: true },
    dob: { type: Date },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["employee", "project managers", "hr", "director"],
      default: "employee",
    },
    position: { type: String },
    department: { type: String },
    salary: { type: Number },
    mobile: { type: Number },
    status: { type: String, default: "Active" },
    photo: { type: String },

    // 🔹 NEW FIELD: used for pending credentials
    credentialstatus: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },

    assignedPm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
    assignedHr: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
    projects: [projectSubSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);
