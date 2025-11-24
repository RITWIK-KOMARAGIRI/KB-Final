
import express from 'express';
import { auth, permit } from '../middleware/auth.js';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import Notification from '../models/Notification.js';
import { exportEmployeesToWorkbook } from '../utils/exportExcel.js';

const router = express.Router();

// Create Employee (Director)
router.post('/employees', auth, permit('DIRECTOR'), async (req, res) => {
  const { name, dob, contactNumber, email, employeeId, designation, assignedManager, assignedHR } = req.body;
  const emp = await Employee.create({ name, dob, contactNumber, email, employeeId, designation, assignedManager, assignedHR });
  // Notify HR and PM
  if (assignedHR) {
    await Notification.create({
      to: assignedHR,
      title: 'New Employee Assigned to You',
      body: 'A new employee has been created under your supervision.',
      data: { employeeId: emp._id }
    });
  }
  if (assignedManager) {
    await Notification.create({
      to: assignedManager,
      title: 'New Employee Assigned to You',
      body: 'A new employee has been assigned under your supervision.',
      data: { employeeId: emp._id }
    });
  }
  res.status(201).json(emp);
});

// List Employees (Director)
router.get('/employees', auth, permit('DIRECTOR'), async (req, res) => {
  const employees = await Employee.find().sort({ createdAt: -1 }).populate('assignedManager assignedHR');
  res.json(employees);
});

// Export Employees to Excel
router.get('/employees/export', auth, permit('DIRECTOR'), async (req, res) => {
  const employees = await Employee.find().sort({ createdAt: -1 }).populate('assignedManager assignedHR');
  const wb = await exportEmployeesToWorkbook(employees);
  const dt = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `employees-${dt}.xlsx`;
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  await wb.xlsx.write(res);
  res.end();
});

// Get all HRs
router.get('/hrs', auth, permit('DIRECTOR'), async (req, res) => {
  const hrs = await User.find({ role: 'HR' }).select('_id name email');
  res.json(hrs);
});

// Get all PMs
router.get('/pms', auth, permit('DIRECTOR'), async (req, res) => {
  const pms = await User.find({ role: 'PM' }).select('_id name email');
  res.json(pms);
});



// Create HR
router.post('/create-hr', auth, permit('DIRECTOR'), async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password required' });
  }
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already exists' });

  const user = await User.create({ name, email, password, role: 'HR' });
  res.status(201).json(user);
});

// Create PM
router.post('/create-pm', auth, permit('DIRECTOR'), async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password required' });
  }
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already exists' });

  const user = await User.create({ name, email, password, role: 'PM' });
  res.status(201).json(user);
});



// Seed minimal users (Director/HR/PM) for quick start
router.post('/seed', async (req, res) => {
  const { directorEmail='director@icms.test', directorPass='director123',
          hrEmail='hr@icms.test', hrPass='hr123',
          pmEmail='pm@icms.test', pmPass='pm123' } = req.body || {};
  const ensure = async (email, pass, role, name) => {
    let u = await User.findOne({ email });
    if (!u) u = await User.create({ email, password: pass, role, name: name || role });
    return u;
  };
  const d = await ensure(directorEmail, directorPass, 'DIRECTOR', 'Director');
  const h = await ensure(hrEmail, hrPass, 'HR', 'HR User');
  const p = await ensure(pmEmail, pmPass, 'PM', 'Project Manager');
  res.json({ director: d, hr: h, pm: p });
});

export default router;
