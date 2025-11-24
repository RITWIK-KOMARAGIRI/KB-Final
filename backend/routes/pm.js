
import express from 'express';
import { auth, permit } from '../middleware/auth.js';
import Notification from '../models/Notification.js';
import Employee from '../models/Employee.js';

const router = express.Router();

// PM notifications
router.get('/notifications', auth, permit('PM'), async (req, res) => {
  const notifs = await Notification.find({ to: req.user.id }).sort({ createdAt: -1 });
  res.json(notifs);
});

router.get('/employees/pm/:pmId',  async (req, res) => {
  try {
    const { pmId } = req.params; // coming from route /employees/hr/:hrId  
    console.log("PM ID from params:", pmId); // Debug log 
    const employees = await Employee.find({ assignedPm: pmId });
    if (!employees || employees.length === 0) {
      return res.status(404).json({ message: "No employees found for this PM" });
    }   
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees by PM:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// List employees assigned to this PM
router.get('/employees', auth, permit('PM'), async (req, res) => {
  const list = await Employee.find({ assignedManager: req.user.id }).sort({ createdAt: -1 });
  res.json(list);
});

export default router;
