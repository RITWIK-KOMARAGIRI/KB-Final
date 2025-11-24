
import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  title: { type: String, required: true },
  body: { type: String },
  data: { type: Object },
  read: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Notification', NotificationSchema);
