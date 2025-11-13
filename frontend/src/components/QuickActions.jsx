// src/components/QuickActions.jsx
const QuickActions = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 mb-6">
      <div className="card-title flex justify-between items-center pb-3 mb-4 border-b border-gray-200">
        <span className="text-blue-900 text-lg font-semibold">Quick Actions</span>
        <i className="fas fa-bolt text-blue-900"></i>
      </div>
      <div className="quick-actions grid grid-cols-2 gap-3">
        <div className="action-btn flex flex-col items-center justify-center py-4 bg-blue-50 rounded-xl text-center transition-all duration-300 cursor-pointer hover:bg-blue-900 hover:text-white hover:-translate-y-1">
          <i className="fas fa-user-plus text-2xl mb-2"></i>
          <span>Add Employee</span>
        </div>
        <div className="action-btn flex flex-col items-center justify-center py-4 bg-blue-50 rounded-xl text-center transition-all duration-300 cursor-pointer hover:bg-blue-900 hover:text-white hover:-translate-y-1">
          <i className="fas fa-file-invoice-dollar text-2xl mb-2"></i>
          <span>Approve Expenses</span>
        </div>
        <div className="action-btn flex flex-col items-center justify-center py-4 bg-blue-50 rounded-xl text-center transition-all duration-300 cursor-pointer hover:bg-blue-900 hover:text-white hover:-translate-y-1">
          <i className="fas fa-chart-line text-2xl mb-2"></i>
          <span>View Reports</span>
        </div>
        <div className="action-btn flex flex-col items-center justify-center py-4 bg-blue-50 rounded-xl text-center transition-all duration-300 cursor-pointer hover:bg-blue-900 hover:text-white hover:-translate-y-1">
          <i className="fas fa-calendar-check text-2xl mb-2"></i>
          <span>Schedule Meeting</span>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;