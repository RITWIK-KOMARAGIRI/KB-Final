
import express from 'express';
import { auth, permit } from '../middleware/auth.js';
import Notification from '../models/Notification.js';
import Employee from '../models/Employee.js';
import User from '../models/User.js';

const router = express.Router();

// HR notifications
router.get('/notifications', auth, permit('HR'), async (req, res) => {
  const notifs = await Notification.find({ to: req.user.id }).sort({ createdAt: -1 });
  res.json(notifs);
});

// View details for a specific employee notification
router.get('/employee/:id', auth, permit('HR'), async (req, res) => {
  const emp = await Employee.findById(req.params.id).populate('assignedManager assignedHR');
  if (!emp) return res.status(404).json({ message: 'Employee not found' });
  res.json(emp);
});

router.get('/employees/hr/:hrId',  async (req, res) => {
  try {
    const { hrId } = req.params; // coming from route /employees/hr/:hrId  
    console.log("HR ID from params:", hrId); // Debug log 
    const employees = await Employee.find({ assignedHr: hrId });
    if (!employees || employees.length === 0) {
      return res.status(404).json({ message: "No employees found for this HR" });
    }   
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees by HR:", error);
    res.status(500).json({ message: "Server error" });
  }
});




// Create credentials for employee (HR)
router.post('/employee/:id/credentials', auth, permit('HR'), async (req, res) => {
  const { email, password } = req.body;
  const emp = await Employee.findById(req.params.id);
  if (!emp) return res.status(404).json({ message: 'Employee not found' });

  
  // create user with EMPLOYEE role and link
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already in use' });
  const user = await User.create({ name: emp.name, email, password, role: 'EMPLOYEE' });
  emp.user = user._id;
  await emp.save();
  user.employee = emp._id;
  await user.save();
  res.json({ message: 'Credentials created', userId: user._id });
});

export default router;
