import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";

// =======================================================
// 📅 YEAR CALENDAR (with Dark/Light Theme)
// =======================================================
const YearCalendar = () => {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [displayYear, setDisplayYear] = useState(new Date().getFullYear());
  const [calendarData, setCalendarData] = useState([]);

  const { theme } = useContext(ThemeContext);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonthIndex = today.getMonth();
  const currentDay = today.getDate();

  const getMonthData = (year, monthIndex) => {
    const monthName = new Date(year, monthIndex).toLocaleString("default", {
      month: "long",
    });
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, monthIndex, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    return { monthName, days };
  };

  useEffect(() => {
    const allMonths = [];
    for (let i = 0; i < 12; i++) {
      allMonths.push(getMonthData(displayYear, i));
    }
    setCalendarData(allMonths);
  }, [displayYear]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newYear = parseInt(year, 10);
    if (!isNaN(newYear) && newYear > 1900 && newYear < 3000) {
      setDisplayYear(newYear);
    }
  };

  return (
    <div
      className={`transition-all duration-300 ${
        theme === "dark"
          ? "text-gray-200"
          : "text-gray-900"
      }`}
    >
      <h2
        className={`text-2xl font-bold mb-6 border-b pb-3 ${
          theme === "dark"
            ? "border-gray-700 text-blue-300"
            : "border-gray-200 text-blue-800"
        }`}
      >
        📅 Year Calendar Generator
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-center mb-6 space-x-3"
      >
        <label className="text-sm font-medium">Enter Year:</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className={`w-24 p-2 border rounded-md text-sm transition-all duration-300
            ${
              theme === "dark"
                ? "bg-[#11152e] border-gray-600 text-gray-200"
                : "bg-white border-gray-300 text-gray-800"
            }
          `}
        />
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800"
        >
          Generate Calendar
        </button>
      </form>

      <h3 className="text-xl font-semibold text-center mb-6">{displayYear}</h3>

      {/* Calendar GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calendarData.map((month, monthIndex) => (
          <div
            key={month.monthName}
            className={`rounded-lg shadow border transition-all duration-300 ${
              theme === "dark"
                ? "bg-[#0f1330] border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="p-2 text-center font-semibold text-white bg-blue-700 rounded-t-md">
              {month.monthName}
            </div>

            <div
              className={`p-2 text-xs font-bold grid grid-cols-7 gap-1 ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center">
                  {day}
                </div>
              ))}
            </div>

            <div className="p-2 grid grid-cols-7 gap-1 text-sm">
              {month.days.map((day, idx) => {
                const isToday =
                  displayYear === currentYear &&
                  monthIndex === currentMonthIndex &&
                  day === currentDay;

                return (
                  <div key={idx} className="flex items-center justify-center">
                    {day ? (
                      <span
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          isToday
                            ? "bg-red-500 text-white"
                            : theme === "dark"
                            ? "text-gray-200"
                            : "text-gray-700"
                        }`}
                      >
                        {day}
                      </span>
                    ) : (
                      <span></span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =======================================================
// 🗓 HOLIDAY LIST (THEMED)
// =======================================================
const HolidayList = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    branch: "All Branches",
    month: "All Months",
    type: "All Types",
  });

  const { theme } = useContext(ThemeContext);

  // --- Demo Data (Add more later if needed)
  const mockHolidays = [
    { branch: "Hyderabad", date: "05-Dec-2025", day: "Friday", description: "Huttari Festival", type: "Optional" },
    { branch: "Hyderabad", date: "15-Aug-2025", day: "Friday", description: "Independence Day", type: "Mandatory" },

    { branch: "Tamil Nadu", date: "14-Jan-2025", day: "Tuesday", description: "Pongal", type: "Mandatory" },
    { branch: "Tamil Nadu", date: "15-Jan-2025", day: "Wednesday", description: "Thiruvalluvar Day", type: "Optional" },
  ];

  useEffect(() => {
    setTimeout(() => {
      setHolidays(mockHolidays);
      setLoading(false);
    }, 400);
  }, []);

  const parseDate = (dateStr) => {
    const [day, mon, year] = dateStr.split("-");
    return new Date(`${mon} ${day}, ${year}`);
  };

  const getMonth = (dateStr) => {
    const [_, m, y] = dateStr.split("-");
    return new Date(`${m} 1, ${y}`).toLocaleString("default", { month: "long" });
  };

  const filtered = holidays
    .filter((h) => {
      if (filters.branch !== "All Branches" && h.branch !== filters.branch)
        return false;
      if (filters.month !== "All Months" && getMonth(h.date) !== filters.month)
        return false;
      if (filters.type !== "All Types" && h.type !== filters.type)
        return false;
      return true;
    })
    .sort((a, b) => parseDate(a.date) - parseDate(b.date));

  const months = [...new Set(holidays.map((h) => getMonth(h.date)))];
  const branches = [...new Set(holidays.map((h) => h.branch))];

  const typeStyle = (type) =>
    type === "Mandatory"
      ? "bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs"
      : "bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs";

  return (
    <>
      <div
        className={`p-6 md:p-8 rounded-xl shadow-lg max-w-6xl mx-auto transition-all duration-300 ${
          theme === "dark"
            ? "bg-[#0d0f27] text-gray-200"
            : "bg-white text-gray-900"
        }`}
      >
        <h2
          className={`text-2xl font-bold mb-6 border-b pb-3 ${
            theme === "dark"
              ? "border-gray-700 text-blue-300"
              : "border-gray-200 text-blue-800"
          }`}
        >
          🗓 Holidays List (Sorted)
        </h2>

        {/* FILTERS */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-4 rounded-lg shadow-sm transition-all duration-300
          ${
            theme === "dark"
              ? "bg-[#11152e] border border-gray-700"
              : "bg-white border border-gray-200"
          }
        `}
        >
          {/* BRANCH */}
          <div>
            <label className="block text-sm font-medium mb-1">Branch Name</label>
            <select
              name="branch"
              value={filters.branch}
              onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
              className={`w-full p-2 rounded-md text-sm transition-all duration-300
              ${
                theme === "dark"
                  ? "bg-[#0f1330] border border-gray-600 text-gray-200"
                  : "bg-white border border-gray-300 text-gray-800"
              }`}
            >
              <option>All Branches</option>
              {branches.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* MONTH */}
          <div>
            <label className="block text-sm font-medium mb-1">Month</label>
            <select
              name="month"
              value={filters.month}
              onChange={(e) => setFilters({ ...filters, month: e.target.value })}
              className={`w-full p-2 rounded-md text-sm transition-all duration-300
              ${
                theme === "dark"
                  ? "bg-[#0f1330] border border-gray-600 text-gray-200"
                  : "bg-white border border-gray-300 text-gray-800"
              }`}
            >
              <option>All Months</option>
              {months.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* TYPE */}
          <div>
            <label className="block text-sm font-medium mb-1">Holiday Type</label>
            <select
              name="type"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className={`w-full p-2 rounded-md text-sm transition-all duration-300
              ${
                theme === "dark"
                  ? "bg-[#0f1330] border border-gray-600 text-gray-200"
                  : "bg-white border border-gray-300 text-gray-800"
              }`}
            >
              <option>All Types</option>
              <option>Mandatory</option>
              <option>Optional</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div
          className={`overflow-x-auto shadow rounded-lg border transition-all duration-300 ${
            theme === "dark"
              ? "border-gray-700 bg-[#11152e]"
              : "border-gray-200 bg-white"
          }`}
        >
          <table className="min-w-full divide-y">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Branch Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Day
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Holiday Type
                </th>
              </tr>
            </thead>

            <tbody
              className={`divide-y ${
                theme === "dark"
                  ? "divide-gray-700 text-gray-200"
                  : "divide-gray-200 text-gray-900"
              }`}
            >
              {filtered.length > 0 ? (
                filtered.map((h, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      theme === "dark"
                        ? "hover:bg-[#15193b]"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4">{h.branch}</td>
                    <td className="px-6 py-4">{h.date}</td>
                    <td className="px-6 py-4">{h.day}</td>
                    <td className="px-6 py-4">{h.description}</td>
                    <td className="px-6 py-4">
                      <span className={typeStyle(h.type)}>{h.type}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-10">
                    No holidays found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CALENDAR BELOW */}
      <div
        className={`p-6 md:p-8 rounded-xl shadow-lg max-w-6xl mx-auto mt-8 transition-all duration-300 ${
          theme === "dark"
            ? "bg-[#0d0f27] text-gray-200"
            : "bg-white text-gray-900"
        }`}
      >
        <YearCalendar />
      </div>
    </>
  );
};

export default HolidayList;
