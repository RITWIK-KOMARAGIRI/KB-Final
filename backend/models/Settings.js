import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  directorId: { type: mongoose.Schema.Types.ObjectId, ref: "Director", required: true },

  fullName: String,
  email: String,
  mobile: String,

  theme: { type: String, default: "light" },
  accentColor: { type: String, default: "#1d4ed8" },

  twoStepLogin: { type: Boolean, default: false },

  emailNotifications: { type: Boolean, default: true },
  systemNotifications: { type: Boolean, default: true },

  companyName: String,
  logo: String, // image path

});

export default mongoose.model("Settings", settingsSchema);
