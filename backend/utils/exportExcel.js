
import ExcelJS from 'exceljs';

export const exportEmployeesToWorkbook = async (employees) => {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Employees');

  ws.columns = [
    { header: 'Employee ID', key: 'employeeId', width: 16 },
    { header: 'Name', key: 'name', width: 24 },
    { header: 'Email', key: 'email', width: 28 },
    { header: 'Contact', key: 'contactNumber', width: 16 },
    { header: 'Designation', key: 'designation', width: 20 },
    { header: 'Assigned Manager', key: 'manager', width: 24 },
    { header: 'Assigned HR', key: 'hr', width: 24 },
    { header: 'Created At', key: 'createdAt', width: 24 }
  ];

  employees.forEach(e => {
    ws.addRow({
      employeeId: e.employeeId,
      name: e.name,
      email: e.email,
      contactNumber: e.contactNumber,
      designation: e.designation,
      manager: e.assignedManager?.name || '',
      hr: e.assignedHR?.name || '',
      createdAt: e.createdAt?.toISOString()
    });
  });

  return wb;
};
