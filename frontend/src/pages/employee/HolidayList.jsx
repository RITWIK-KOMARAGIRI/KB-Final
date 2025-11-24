import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext"; // Correct path based on folder structure

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5173";

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ✨ NEW Year Calendar Component (as per documentation)
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const YearCalendar = () => {
  const { theme } = useContext(ThemeContext);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [displayYear, setDisplayYear] = useState(new Date().getFullYear());
  const [calendarData, setCalendarData] = useState([]);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonthIndex = today.getMonth(); // 0-11
  const currentDay = today.getDate();

  // Helper function to generate data for a single month
  const getMonthData = (year, monthIndex) => {
    const monthName = new Date(year, monthIndex).toLocaleString('default', { month: 'long' });
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, monthIndex, 1).getDay(); // 0 (Sun) - 6 (Sat)
    
    const days = [];
    // Add empty cells for days before the 1st
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    // Add day numbers
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return { monthName, days };
  };

  // Generate all 12 months when displayYear changes
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

  // --- Theme-based styles for Calendar ---
  const cardStyle = `rounded-lg shadow ${theme === 'dark' ? 'bg-slate-700 border border-slate-600' : 'bg-white border border-gray-200'}`;
  const monthHeaderStyle = "p-2 text-center font-semibold text-white bg-blue-700 rounded-t-md";
  const dayHeaderStyle = `p-2 text-xs font-bold grid grid-cols-7 gap-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`;
  const dayGridStyle = "p-2 grid grid-cols-7 gap-1 text-sm";
  const dayBaseStyle = "flex items-center justify-center w-8 h-8 rounded-full";
  const dayTextStyle = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';
  const todayStyle = "bg-red-500 text-white"; // Highlight for today

  return (
    <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}>
      <h2 className={`text-2xl font-bold mb-6 border-b pb-3 ${theme === 'dark' ? 'text-gray-100 border-slate-700' : 'text-gray-800 border-gray-200'}`}>
        📅 Year Calendar Generator
      </h2>
      
      {/* Year Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center justify-center mb-6 space-x-3">
        <label htmlFor="yearInput" className="text-sm font-medium">
          Enter Year:
        </label>
        <input
          type="number"
          id="yearInput"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className={`w-24 p-2 border rounded-md text-sm ${theme === 'dark' ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
          placeholder="e.g., 2025"
        />
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Generate Calendar
        </button>
      </form>

      {/* Calendar Display */}
      <h3 className="text-xl font-semibold text-center mb-6">{displayYear}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calendarData.map((month, monthIndex) => (
          <div key={month.monthName} className={cardStyle}>
            <div className={monthHeaderStyle}>{month.monthName}</div>
            <div className={dayHeaderStyle}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center">{day}</div>
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
                      <span className={`${dayBaseStyle} ${isToday ? todayStyle : dayTextStyle}`}>
                        {day}
                      </span>
                    ) : (
                      <span></span> // Empty cell
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
// Modified Holiday List Page Component
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const HolidayList = () => {
  const { theme } = useContext(ThemeContext); // Get theme from context

  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    branch: "Hyderabad", // Default branch
    month: "All Months",
    type: "All Types"
  });

  // UPDATED: Sample data structure matching the latest image (image_610154.png)
  const mockHolidays = [
    { branch: "Hyderabad", date: "05-Dec-2025", day: "Friday", description: "Huttari Festival", type: "Optional" },
    { branch: "Hyderabad", date: "24-Nov-2025", day: "Monday", description: "Guru Teg Bahadur's Martyrdom Day", type: "Optional" },
    { branch: "Hyderabad", date: "05-Nov-2025", day: "Wednesday", description: "Gurunak Jayanti", type: "Optional" },
    { branch: "Hyderabad", date: "15-Aug-2025", day: "Friday", description: "Independence Day", type: "Mandatory" },
    { branch: "Hyderabad", date: "02-Oct-2025", day: "Thursday", description: "Gandhi Jayanti", type: "Mandatory" },
    // Adding other holidays for filtering purposes
    { branch: "Bangalore", date: "01-Jan-2026", day: "Thursday", description: "New Year's Day", type: "Mandatory" },
    { branch: "Bangalore", date: "14-Apr-2025", day: "Monday", description: "Ambedkar Jayanti", type: "Optional" },
  ];

  useEffect(() => {
    const fetchHolidays = async () => {
      setLoading(true); setError("");
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setHolidays(mockHolidays); // Using mock data

      } catch (err) {
        setError("Failed to load holidays. Please try again later.");
        console.error(err);
      } finally { setLoading(false); }
    };
    fetchHolidays();
  }, []); // Fetch only once on mount

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Helper function to get month name from date string 'DD-MMM-YYYY' or 'DD-Mon-YYYY'
  const getMonthFromDateString = (dateStr) => {
     try {
         const parts = dateStr.split('-');
         if (parts.length !== 3) throw new Error("Invalid date format");
         const monthDate = new Date(`${parts[1]} 1, ${parts[2]}`);
         if (isNaN(monthDate)) throw new Error("Could not parse month");
         return monthDate.toLocaleString('default', { month: 'long' });
     } catch (e) {
         console.error("Error parsing date:", dateStr, e);
         return null;
     }
  };


  // Uses theme variable for styling tags
  const getTypeStyle = (type) => {
    switch (type?.toLowerCase()) {
      case 'mandatory':
        return `rounded-full px-3 py-1 text-xs font-medium ${theme === 'dark' ? 'bg-blue-900 bg-opacity-50 text-blue-300' : 'bg-blue-100 text-blue-700'}`;
      case 'optional':
        return `rounded-full px-3 py-1 text-xs font-medium ${theme === 'dark' ? 'bg-green-900 bg-opacity-50 text-green-300' : 'bg-green-100 text-green-700'}`;
      default:
        return `rounded-full px-3 py-1 text-xs font-medium ${theme === 'dark' ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`;
    }
  };

  const filteredHolidays = holidays.filter(holiday => {
     if (filters.branch !== "All Branches" && holiday.branch !== filters.branch) return false;
     if (filters.month !== "All Months") {
       const holidayMonth = getMonthFromDateString(holiday.date);
       if (!holidayMonth || holidayMonth !== filters.month) return false;
     }
     if (filters.type !== "All Types" && holiday.type !== filters.type) return false;
     return true;
  });

    const availableMonths = [ ...new Set(holidays.map(h => getMonthFromDateString(h.date)).filter(Boolean)) ];
    availableMonths.sort((a, b) => new Date(`1 ${a} 2000`) - new Date(`1 ${b} 2000`));
    const availableBranches = [ ...new Set(holidays.map(h => h.branch)) ];

    // --- Theme-based styles for Holiday List ---
    const baseSelectStyle = "w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2";
    const lightSelectStyle = "bg-white border-gray-300 text-gray-800 focus:ring-blue-500";
    const darkSelectStyle = "bg-slate-600 border-slate-500 text-white focus:ring-teal-500";
    const selectStyle = `${baseSelectStyle} ${theme === 'dark' ? darkSelectStyle : lightSelectStyle}`;

    const baseLabelStyle = "block text-sm font-medium mb-1";
    const lightLabelStyle = "text-gray-700";
    const darkLabelStyle = "text-gray-300";
    const labelStyle = `${baseLabelStyle} ${theme === 'dark' ? darkLabelStyle : lightLabelStyle}`;

    const baseTableHeadStyle = "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider";
    const lightTableHeadStyle = "bg-blue-900 text-white"; 
    const darkTableHeadStyle = "bg-slate-700 text-gray-300";
    const tableHeadStyle = `${baseTableHeadStyle} ${theme === 'dark' ? darkTableHeadStyle : lightTableHeadStyle}`;

    const baseTableCellStyle = "px-6 py-4 whitespace-nowrap text-sm";
    const lightTableCellStyle = "text-gray-500";
    const darkTableCellStyle = "text-gray-300";
    const tableCellStyle = `${baseTableCellStyle} ${theme === 'dark' ? darkTableCellStyle : lightTableCellStyle}`;
    const primaryTableCellStyle = `${baseTableCellStyle} ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`;

  // UPDATED: Return renders both components
  return (
    <>
      {/* --- Holiday List Section --- */}
      <div className={`p-6 md:p-8 rounded-xl shadow-lg max-w-6xl mx-auto ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
        <h2 className={`text-2xl font-bold mb-6 border-b pb-3 ${theme === 'dark' ? 'text-gray-100 border-slate-700' : 'text-gray-800 border-gray-200'}`}>
          <span className="mr-2">🗓️</span> Holidays List 
        </h2>

        {/* Filter Section */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-4 rounded-lg border shadow-sm ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-200'}`}>
          <div>
            <label htmlFor="branchFilter" className={labelStyle}>Branch Name</label>
            <select id="branchFilter" name="branch" value={filters.branch} onChange={handleFilterChange} className={selectStyle}>
              <option>All Branches</option>
              {availableBranches.map(branch => <option key={branch} value={branch}>{branch}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="monthFilter" className={labelStyle}>Month</label>
            <select id="monthFilter" name="month" value={filters.month} onChange={handleFilterChange} className={selectStyle}>
              <option>All Months</option>
              {availableMonths.map(month => <option key={month} value={month}>{month}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="typeFilter" className={labelStyle}>Holiday Type</label>
            <select id="typeFilter" name="type" value={filters.type} onChange={handleFilterChange} className={selectStyle}>
              <option>All Types</option>
              <option>Mandatory</option>
              <option>Optional</option>
            </select>
          </div>
        </div>

        {/* Holiday Table Section */}
        {loading ? ( <div className={`text-center py-10 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Loading holidays...</div> )
          : error ? ( <div className={`text-center py-10 rounded-md p-4 ${theme === 'dark' ? 'text-red-400 bg-red-900 bg-opacity-30' : 'text-red-600 bg-red-50'}`}>{error}</div> )
          : (
          <div className={`overflow-x-auto shadow rounded-lg border ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
            <table className={`min-w-full divide-y ${theme === 'dark' ? 'divide-slate-700' : 'divide-gray-200'}`}>
              <thead>
                <tr>
                  <th className={tableHeadStyle}>Branch Name</th>
                  <th className={tableHeadStyle}>Date</th>
                  <th className={tableHeadStyle}>Day</th>
                  <th className={tableHeadStyle}>Description</th>
                  {/* ✅ FIXED: Removed the '...' typo */}
                  <th className={tableHeadStyle}>Holiday Type</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${theme === 'dark' ? 'bg-slate-800 divide-slate-700' : 'bg-white divide-gray-200'}`}>
                {filteredHolidays.length > 0 ? (
                  filteredHolidays.map((holiday, idx) => (
                  <tr key={idx} className={`transition-colors ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-50'}`}>
                    <td className={primaryTableCellStyle}>{holiday.branch}</td>
                    <td className={tableCellStyle}>{holiday.date}</td>
                    <td className={tableCellStyle}>{holiday.day}</td>
                    <td className={`${primaryTableCellStyle} whitespace-normal px-6 py-4 text-sm`}>{holiday.description}</td>
                    <td className={tableCellStyle}> <span className={getTypeStyle(holiday.type)}>{holiday.type}</span> </td>
                  </tr>
                  ))
                ) : (
                  <tr> <td colSpan="5" className={`text-center py-10 ${tableCellStyle}`}>No holidays found for the selected filters.</td> </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- NEW Calendar Section --- */}
      <div className={`p-6 md:p-8 rounded-xl shadow-lg max-w-6xl mx-auto mt-8 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
        <YearCalendar />
      </div>
    </>
  );
};

export default HolidayList;