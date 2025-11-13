import {
  FaHome,
  FaUserPlus,
  FaUsers,
  FaChartBar,
  FaMoneyBillWave,
  FaCog,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaBullhorn,
  FaPlaneDeparture,
   
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = ({
  isOpen = true,
  isCollapsed = false,
  toggleCollapse = () => {},
  activeKey = "dashboard",
}) => {
  const navigate = useNavigate();

  // ✅ Get current user role
  const storedUser = JSON.parse(localStorage.getItem("users"));
  const role = storedUser?.role || "Guest";

  const itemClass = (active) =>
    `flex items-center gap-3 px-5 py-3 text-gray-800 transition-all duration-300 
     border-l-4 ${
       active
         ? "bg-gray-100 text-blue-700 border-blue-700"
         : "border-transparent hover:bg-gray-100 hover:text-blue-700 hover:border-blue-700"
     } whitespace-nowrap`;

  const Title = ({ children }) => (
    <div
      className={`px-5 pt-4 pb-2 text-[11px] uppercase tracking-[0.08em] text-gray-500 transition-all duration-300 ${
        isCollapsed ? "hidden" : "block"
      }`}
    >
      {children}
    </div>
  );

  const handleLogout = () => {
    localStorage.removeItem("users");
    navigate("/");
  };

  const Item = ({ icon: Icon, label, active }) => (
    <div className={itemClass(active)}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      {!isCollapsed && <span className="menu-text">{label}</span>}
    </div>
  );

  return (
    <aside
      className={`h-screen bg-white shadow-[2px_0_10px_rgba(0,0,0,0.05)]
      transition-all duration-300 ease-in-out
      ${isCollapsed ? "w-16" : "w-64"}
      hidden md:flex flex-col fixed top-0 left-0`}
    >
      {/* MAIN NAV */}
      <Title>Main Navigation</Title>

      {/* Always visible */}

      
      <div className="mt-6">
        <Title>MAIN</Title>
        <Item icon={FaHome} label="Dashboard" active={activeKey === "dashboard"} />
      </div>

      {/* ✅ Role-specific sections */}
      {role === "director" && (
        <>

         

         <NavLink to="/director/Announcement" className="w-full text-left">
          <Item icon={FaBullhorn} label="Messenger/Announcemnt" active={activeKey === "Messenger/Announcemnt"} />
          </NavLink>
          

         <Title>MANAGEMENT</Title>
          <NavLink to="/director/create-employee" className="w-full text-left">
            <Item icon={FaUserPlus} label="Create Employee" active={activeKey === "create"} />
          </NavLink>
           <NavLink to="/director/HrCredentials" className="w-full text-left">
            <Item icon={FaUserPlus} label="Create Hr Credentials" active={activeKey === "create"} />
          </NavLink>
          
          <NavLink to="/director/project-overview" className="w-full text-left">
          <Item icon={FaChartBar} label="Project Overview" active={activeKey === "perf"} />
          </NavLink>
          
          <NavLink to="/director/report" className="w-full text-left">
          <Item icon={FaChartBar} label="Report & Analytics" active={activeKey === "perf"} />
          </NavLink>



          <Title>COMPANY</Title>
          <NavLink to="/director/holiday" className="w-full text-left">
          <Item icon={FaPlaneDeparture} label="Holiday List" active={activeKey === "Holiday List"} />
          </NavLink>

          <NavLink to="/director/notice" className="w-full text-left">
          <Item icon={FaBullhorn} label="Important Notice" active={activeKey === "Important Notice"} />
          </NavLink>

        </>
      )}

      {role === "hr" && (
        <>
          <NavLink to="/hr/add-credentials" className="w-full text-left">
            <Item icon={FaUserPlus} label="Add Credentials" active={activeKey === "create"} />
          </NavLink>
          <NavLink to="/hr/employee-records" className="w-full text-left">  
          <Item icon={FaUsers} label="Employee Records" active={activeKey === "team"} />
          </NavLink>
          <NavLink to="/hr/pm-records" className="w-full text-left">  
          <Item icon={FaUsers} label="pm records" active={activeKey === "team"} />
          </NavLink>
        </>
      )}

      {role === "project managers" && (
        <>
           <NavLink to="/pm/my-team" className="w-full text-left">  

          <Item icon={FaUsers} label="My Team" active={activeKey === "team"} />
          </NavLink>
          <Item icon={FaChartBar} label="Project Reports" active={activeKey === "perf"} />
        </>
      )}

      {role === "employee" && (
        <>
        <NavLink to="/employee/my-profile" className="w-full text-left">
          <Item icon={FaUsers} label="My Profile" active={activeKey === "team"} />
          </NavLink>
          <NavLink to="/employee/my-tasks" className="w-full text-left">
          <Item icon={FaUsers} label="Tasks Assigned" active={activeKey === "team"} />
          </NavLink>
          
          <Item icon={FaChartBar} label="My Performance" active={activeKey === "perf"} />

        </>
      )}

      {/* SETTINGS */}
      <Title>Settings</Title>
      <Item icon={FaCog} label="Account Settings" active={activeKey === "settings"} />

      {/* LOGOUT */}
      <button onClick={handleLogout} className="w-full text-left">
        <Item icon={FaSignOutAlt} label="Logout" active={false} />
      </button>

      {/* COLLAPSE TOGGLE */}
      <button
        type="button"
        onClick={toggleCollapse}
        className="mt-auto w-full flex justify-end px-5 py-4 text-gray-500 hover:text-gray-700 transition"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <FaChevronRight className="w-4 h-4" />
        ) : (
          <FaChevronLeft className="w-4 h-4" />
        )}
      </button>
    </aside>
  );
};

export default Sidebar;
