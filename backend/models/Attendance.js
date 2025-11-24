// backend/models/Attendance.js
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    loginAt: {
      type: Date,
      required: true,
    },
    logoutAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "On Leave"],
      default: "Present",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);