import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5173";

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ✨ Year Calendar Component (No Theme)
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const YearCalendar = () => {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [displayYear, setDisplayYear] = useState(new Date().getFullYear());
  const [calendarData, setCalendarData] = useState([]);

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

  const cardStyle = "rounded-lg shadow bg-white border border-gray-200";
  const monthHeaderStyle =
    "p-2 text-center font-semibold text-white bg-blue-700 rounded-t-md";
  const dayHeaderStyle =
    "p-2 text-xs font-bold grid grid-cols-7 gap-1 text-gray-600";
  const dayGridStyle = "p-2 grid grid-cols-7 gap-1 text-sm";
  const dayBaseStyle = "flex items-center justify-center w-8 h-8 rounded-full";
  const dayTextStyle = "text-gray-700";
  const todayStyle = "bg-red-500 text-white";

  return (
    <div className="text-gray-900">
      <h2 className="text-2xl font-bold mb-6 border-b pb-3 text-gray-800 border-gray-200">
        📅 Year Calendar Generator
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-center mb-6 space-x-3"
      >
        <label htmlFor="yearInput" className="text-sm font-medium">
          Enter Year:
        </label>
        <input
          type="number"
          id="yearInput"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-24 p-2 border rounded-md text-sm bg-white border-gray-300 text-gray-800"
          placeholder="e.g., 2025"
        />
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Generate Calendar
        </button>
      </form>

      <h3 className="text-xl font-semibold text-center mb-6">{displayYear}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calendarData.map((month, monthIndex) => (
          <div key={month.monthName} className={cardStyle}>
            <div className={monthHeaderStyle}>{month.monthName}</div>
            <div className={dayHeaderStyle}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center">
                  {day}
                </div>
              ))}
            </div>
            <div className={dayGridStyle}>
              {month.days.map((day, idx) => {
                const isToday =
                  displayYear === currentYear &&
                  monthIndex === currentMonthIndex &&
                  day === currentDay;

                return (
                  <div key={idx} className="flex items-center justify-center">
                    {day ? (
                      <span
                        className={`${dayBaseStyle} ${
                          isToday ? todayStyle : dayTextStyle
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

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 🗓️ Holiday List Component (Sorted + Tamil Nadu)
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const HolidayList = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    branch: "All Branches",
    month: "All Months",
    type: "All Types",
  });

  // ✅ Added Tamil Nadu holidays
  const mockHolidays = [
    // Hyderabad
    {
      branch: "Hyderabad",
      date: "05-Dec-2025",
      day: "Friday",
      description: "Huttari Festival",
      type: "Optional",
    },
    {
      branch: "Hyderabad",
      date: "15-Aug-2025",
      day: "Friday",
      description: "Independence Day",
      type: "Mandatory",
    },
    {
      branch: "Hyderabad",
      date: "02-Oct-2025",
      day: "Thursday",
      description: "Gandhi Jayanti",
      type: "Mandatory",
    },

    // Bangalore
    {
      branch: "Bangalore",
      date: "01-Jan-2026",
      day: "Thursday",
      description: "New Year's Day",
      type: "Mandatory",
    },
    {
      branch: "Bangalore",
      date: "14-Apr-2025",
      day: "Monday",
      description: "Ambedkar Jayanti",
      type: "Optional",
    },

    // Tamil Nadu
    {
      branch: "Tamil Nadu",
      date: "14-Jan-2025",
      day: "Tuesday",
      description: "Pongal",
      type: "Mandatory",
    },
    {
      branch: "Tamil Nadu",
      date: "15-Jan-2025",
      day: "Wednesday",
      description: "Thiruvalluvar Day",
      type: "Optional",
    },
    {
      branch: "Tamil Nadu",
      date: "17-Jan-2025",
      day: "Friday",
      description: "Kaanum Pongal",
      type: "Optional",
    },
    {
      branch: "Tamil Nadu",
      date: "01-May-2025",
      day: "Thursday",
      description: "May Day",
      type: "Mandatory",
    },
  ];

  useEffect(() => {
    const fetchHolidays = async () => {
      setLoading(true);
      setError("");
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setHolidays(mockHolidays);
      } catch (err) {
        setError("Failed to load holidays. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHolidays();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Parse “DD-MMM-YYYY” → Date
  const parseDate = (dateStr) => {
    const [day, mon, year] = dateStr.split("-");
    return new Date(`${mon} ${day}, ${year}`);
  };

  const getMonthFromDateString = (dateStr) => {
    try {
      const parts = dateStr.split("-");
      if (parts.length !== 3) throw new Error("Invalid date format");
      const monthDate = new Date(`${parts[1]} 1, ${parts[2]}`);
      if (isNaN(monthDate)) throw new Error("Could not parse month");
      return monthDate.toLocaleString("default", { month: "long" });
    } catch (e) {
      console.error("Error parsing date:", dateStr, e);
      return null;
    }
  };

  const getTypeStyle = (type) => {
    switch (type?.toLowerCase()) {
      case "mandatory":
        return "rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700";
      case "optional":
        return "rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-green-700";
      default:
        return "rounded-full px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700";
    }
  };

  // Filter & sort holidays by date
  const filteredHolidays = holidays
    .filter((holiday) => {
      if (filters.branch !== "All Branches" && holiday.branch !== filters.branch)
        return false;
      if (filters.month !== "All Months") {
        const holidayMonth = getMonthFromDateString(holiday.date);
        if (!holidayMonth || holidayMonth !== filters.month) return false;
      }
      if (filters.type !== "All Types" && holiday.type !== filters.type)
        return false;
      return true;
    })
    .sort((a, b) => parseDate(a.date) - parseDate(b.date)); // ✅ sort ascending

  const availableMonths = [
    ...new Set(
      holidays.map((h) => getMonthFromDateString(h.date)).filter(Boolean)
    ),
  ].sort((a, b) => new Date(`1 ${a} 2000`) - new Date(`1 ${b} 2000`));

  const availableBranches = [...new Set(holidays.map((h) => h.branch))];

  return (
    <>
      <div className="p-6 md:p-8 rounded-xl shadow-lg max-w-6xl mx-auto bg-white">
        <h2 className="text-2xl font-bold mb-6 border-b pb-3 text-gray-800 border-gray-200">
          🗓️ Holidays List (Sorted)
        </h2>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-4 rounded-lg border shadow-sm bg-white border-gray-200">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Branch Name
            </label>
            <select
              name="branch"
              value={filters.branch}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md text-sm bg-white border-gray-300 text-gray-800 focus:ring-blue-500"
            >
              <option>All Branches</option>
              {availableBranches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Month
            </label>
            <select
              name="month"
              value={filters.month}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md text-sm bg-white border-gray-300 text-gray-800 focus:ring-blue-500"
            >
              <option>All Months</option>
              {availableMonths.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Holiday Type
            </label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md text-sm bg-white border-gray-300 text-gray-800 focus:ring-blue-500"
            >
              <option>All Types</option>
              <option>Mandatory</option>
              <option>Optional</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">
            Loading holidays...
          </div>
        ) : error ? (
          <div className="text-center py-10 rounded-md p-4 text-red-600 bg-red-50">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider bg-blue-900 text-white">
                    Branch Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider bg-blue-900 text-white">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider bg-blue-900 text-white">
                    Day
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider bg-blue-900 text-white">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider bg-blue-900 text-white">
                    Holiday Type
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y bg-white divide-gray-200">
                {filteredHolidays.length > 0 ? (
                  filteredHolidays.map((holiday, idx) => (
                    <tr
                      key={idx}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {holiday.branch}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {holiday.date}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {holiday.day}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {holiday.description}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <span className={getTypeStyle(holiday.type)}>
                          {holiday.type}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-10 px-6 text-gray-500"
                    >
                      No holidays found for the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="p-6 md:p-8 rounded-xl shadow-lg max-w-6xl mx-auto mt-8 bg-white">
        <YearCalendar />
      </div>
    </>
  );
};

export default HolidayList;
