import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBars } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Header = ({ toggleSidebar }) => {
  const [lastLoginTime, setLastLoginTime] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState({ name: "", role: "" });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const notificationRef = useRef(null);
  useEffect(() => {
    const now = new Date();
    setLastLoginTime(
      now.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    );

    const storedUser = JSON.parse(localStorage.getItem("users"));
    if (storedUser) setUser({ name: storedUser.name, role: storedUser.role });
  }, []);

  // Close notification dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  const clearNotifications = () => {
    setNotificationCount(0);
    setShowNotifications(false);
  };

  // Fetch notifications from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/fetchnotifications")
      .then((res) => {
        setNotifications(res.data);
        setNotificationCount(res.data.length);
      })
      .catch((err) => console.error("Error fetching notifications:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-900 to-blue-900 text-white px-6 h-16 fixed top-0 left-0 right-0 z-50 flex justify-between items-center shadow-lg">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button className="menu-toggle md:hidden text-white text-2xl" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <div className="logo w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-blue-900 text-lg shadow-md">KB</div>
        <div className="company-name leading-tight">
          <h1 className="text-xl font-bold">KodeBloom</h1>
          <p className="text-xs opacity-90">Technology and Services Pvt. Ltd.</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="header-right flex items-center gap-5">
        <div className="login-time bg-blue-900 text-white py-1 px-4 rounded-full text-sm shadow-md hidden md:block">
          Last login: <span className="font-medium">{lastLoginTime}</span>
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={notificationRef}>
          <button
            className="text-white p-2 rounded-full hover:bg-blue-900 transition-colors relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FontAwesomeIcon icon={faBell} className="text-xl text-white" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          {showNotifications &&  (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
              <div className="p-3 bg-blue-900 text-white font-bold flex justify-between items-center">
                <span>Notifications ({notificationCount})</span>
                <button onClick={clearNotifications} className="text-xs bg-blue-900 hover:bg-blue-800 px-2 py-1 rounded">
                  Clear All
                </button>
              </div>

             <div className="max-h-60 overflow-y-auto">
  {notifications.map((notification) => (
    <button
      key={notification._id}
      onClick={() => {
        console.log("Clicked notification:", notification); // ✅ logs full notification object

        if (user.role === "HR") {
          navigate("/hr/credentials", {
            state: {
              employee: notification, // send full notification object
              empId: notification._id // notification ID if needed
            }
          });
        }
      }}
      className="w-full text-left border-b border-gray-100 last:border-b-0 p-3 hover:bg-gray-50 cursor-pointer"
    >
      <p className="text-gray-800 font-semibold">{notification.title}</p>
      <p className="text-gray-600 text-sm mt-1">{notification.body}</p>
      <p className="text-xs text-gray-400 mt-1">
        {new Date(notification.createdAt).toLocaleString()}
      </p>
    </button>
  ))}
</div>


              <div className="p-2 text-center bg-gray-100">
                <button className="text-blue-900 text-sm hover:text-blue-900">View All Notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="user-profile flex items-center gap-3">
          <div className="profile-img w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow">
            {user.name ? user.name.split(" ").map((n) => n[0]).join("") : "JD"}
          </div>
          <div className="font-medium hidden md:block">{user.name} ({user.role})</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
