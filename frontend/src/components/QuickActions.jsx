import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const QuickActions = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`rounded-xl shadow-md p-5 mb-6 transition-all duration-300
        ${theme === "dark" ? "bg-[#0d0f27] text-gray-200" : "bg-white text-gray-900"}
      `}
    >
      {/* Card Header */}
      <div
        className={`card-title flex justify-between items-center pb-3 mb-4 border-b transition-all duration-300
          ${theme === "dark" ? "border-gray-700 text-blue-400" : "border-gray-200 text-blue-900"}
        `}
      >
        <span className="text-lg font-semibold">Quick Actions</span>
        <i
          className={`fas fa-bolt text-xl 
          ${theme === "dark" ? "text-blue-400" : "text-blue-900"}`}
        ></i>
      </div>

      {/* Action Grid */}
      <div className="quick-actions grid grid-cols-2 gap-3">
        {[
          { icon: "fa-user-plus", label: "Add Employee" },
          { icon: "fa-file-invoice-dollar", label: "Approve Expenses" },
          { icon: "fa-chart-line", label: "View Reports" },
          { icon: "fa-calendar-check", label: "Schedule Meeting" },
        ].map((item, index) => (
          <div
            key={index}
            className={`action-btn flex flex-col items-center justify-center py-4 rounded-xl text-center 
              transition-all duration-300 cursor-pointer hover:-translate-y-1 
              ${
                theme === "dark"
                  ? "bg-blue-900 text-blue-200 hover:bg-blue-600 hover:text-white"
                  : "bg-blue-50 text-blue-900 hover:bg-blue-900 hover:text-white"
              }
            `}
          >
            <i className={`fas ${item.icon} text-2xl mb-2`}></i>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
