import React, { useEffect, useState, useContext } from "react"; // Added useContext
import axios from "axios";
import { FaUser, FaIdBadge, FaEnvelope, FaMars, FaPhone, FaBriefcase, FaBuilding, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext"; // Correct path based on folder structure

// InfoCard sub-component, now theme-aware
const InfoCard = ({ title, value, icon: Icon }) => {
  const { theme } = useContext(ThemeContext); // Get theme

  return (
    <div className={`relative rounded-lg shadow-sm p-4 ${theme === 'dark' ? 'bg-slate-700' : 'bg-white'}`}>
       {/* Accent line color based on theme */}
      <div className={`absolute left-0 top-0 h-full w-1 rounded-l-md ${theme === 'dark' ? 'bg-teal-500' : 'bg-blue-600'}`} />
      <div className="ml-4">
        <div className={`flex items-center gap-2 text-xs mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          {/* Icon color based on theme */}
          {Icon && <Icon className={`w-3 h-3 ${theme === 'dark' ? 'text-teal-400' : 'text-blue-600'}`} />} <span>{title}</span>
        </div>
         {/* Value text color based on theme */}
        <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>{value ?? "-"}</div>
      </div>
    </div>
  );
};


const Profile = () => {
  const { theme } = useContext(ThemeContext); // Get theme for main component

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true); setError(""); // Reset state on fetch
      try {
        const stored = localStorage.getItem("users");
        if (!stored) throw new Error("No user data found in storage.");
        const storedObj = JSON.parse(stored);
        
        // Prioritize specific ID fields if available
        const userId = storedObj.employeeId || storedObj._id || storedObj.id || storedObj.userId;
        
        let fetchedProfile = null;
        
        if (userId) {
          // Fetch by ID
          const response = await axios.get(`http://localhost:5000/api/employees/${userId}`);
           // Ensure we handle cases where API might return empty success or just the ID back
          fetchedProfile = (response.data && typeof response.data === 'object' && Object.keys(response.data).length > 1) ? response.data : null;
        } else if (storedObj.email) {
          // Fallback to fetch by email if no ID found
          const email = storedObj.email;
          const resByEmail = await axios.get(`http://localhost:5000/api/employees?email=${encodeURIComponent(email)}`);
          // Assuming API returns an array when searching by email
          fetchedProfile = Array.isArray(resByEmail.data) ? resByEmail.data[0] : null; 
        } else {
           throw new Error("No identifier (ID or email) found for user in storage.");
        }

        // Use fetched profile if valid, otherwise fallback gracefully to stored data
        setProfile(fetchedProfile || storedObj); 

      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("⚠️ Failed to load profile details. Displaying locally stored data.");
        // Fallback to localStorage data if fetch fails but local data exists
        try {
          const local = localStorage.getItem("users");
          if (local) setProfile(JSON.parse(local));
           else setError("⚠️ Failed to load profile and no local data available."); // Update error if no local data either
        } catch (parseError) {
             console.error("Error parsing local storage data:", parseError);
             setError("⚠️ Failed to load profile and local data is corrupted.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // --- Helper Functions (Format Date, Compute Experience) ---
  const formatDate = (d) => { /* ... remains the same ... */ 
     if (!d) return "-"; try { const date = new Date(d); if (isNaN(date)) return d; return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); } catch { return d; }
  };
  const computeExperience = (startDate, endDate = new Date()) => { /* ... remains the same ... */ 
      if (!startDate) return profile?.experience || "-"; try { const start = new Date(startDate); const end = new Date(endDate); if (isNaN(start) || isNaN(end)) return "-"; let years = end.getFullYear() - start.getFullYear(); let months = end.getMonth() - start.getMonth(); if (months < 0) { years -= 1; months += 12; } return `${years} yr${years !== 1 ? "s" : ""} ${months} mo${months !== 1 ? "s" : ""}`; } catch { return "-"; } // Shorter format
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        {/* Spinner color based on theme */}
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${theme === 'dark' ? 'border-teal-400' : 'border-blue-600'}`}></div>
      </div>
    );
  }

  // --- Error State (Only if profile is also null) ---
  // If fetch failed but we have local data, we show local data + error message below
   if (error && !profile) {
     return (
       <div className={`p-6 rounded-lg shadow-md max-w-2xl mx-auto mt-6 ${theme === 'dark' ? 'bg-red-900 bg-opacity-40 text-red-300' : 'bg-red-50 text-red-700'}`}>
         {error}
       </div>
     );
   }
   
   // --- Profile Data Mapping (Ensure fallbacks) ---
   const fullName = profile?.name || profile?.fullName || profile?.employeeName || "N/A";
   const initials = fullName !== "N/A" ? fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() : "?";
   const arrowId = profile?.employeeId || profile?.arrowGlobalId || profile?.id || "N/A";
   const email = profile?.email || profile?.workEmail || "N/A";
   const gender = profile?.gender || "N/A";
   const mobile = profile?.mobile || profile?.mobileNumber || profile?.phone || "N/A";
   const designation = profile?.position || profile?.designation || profile?.jobTitle || "N/A";
   const reportingAuthority = profile?.reportingTo || profile?.reportingAuthority || "N/A";
   const birthDate = formatDate(profile?.dob || profile?.birthdate);
   const joiningDate = formatDate(profile?.joiningDate || profile?.joinDate);
   const experience = profile?.experience || computeExperience(profile?.joiningDate || profile?.doj); // Use computed only if not directly provided
   const branch = profile?.branch || profile?.location || "N/A";
   const fullMobile = profile?.mobileFull || mobile; // Assuming a field might exist


  return (
    // Overall page background adjusted by Layout.jsx
    <div className="p-4 sm:p-6">
      <div className="max-w-7xl mx-auto"> 
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
             {/* Title color based on theme */}
            <h2 className={`text-xl font-bold tracking-wide ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>EMPLOYEE PROFILE</h2>
             {/* Accent line color based on theme */}
            <div className={`h-1 w-16 rounded mt-1 ${theme === 'dark' ? 'bg-teal-500' : 'bg-blue-600'}`} />
          </div>
          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button type="button" 
              className={`px-4 py-2 rounded-md text-sm shadow transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme === 'dark' ? 'bg-teal-600 hover:bg-teal-700 text-white focus:ring-teal-500 focus:ring-offset-slate-900' : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 focus:ring-offset-gray-100'}`}>
              My Information
            </button>
            <button type="button" 
               className={`px-4 py-2 rounded-md text-sm shadow-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-gray-300 hover:bg-slate-600 focus:ring-slate-500 focus:ring-offset-slate-900' : 'bg-white border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 focus:ring-offset-gray-100'}`}>
               Generate Signature
            </button>
          </div>
        </div>

        {/* Display error message if fetch failed but we have fallback data */}
        {error && profile && (
             <div className={`p-4 rounded-lg shadow-md max-w-2xl mx-auto mb-6 text-sm ${theme === 'dark' ? 'bg-yellow-900 bg-opacity-40 text-yellow-300' : 'bg-yellow-50 text-yellow-800'}`}>
                 {error}
             </div>
        )}

        {/* Main Profile Card */}
        <div className={`rounded-lg shadow-lg p-6 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            
            {/* Left Section: Avatar and Basic Info */}
            <div className="flex items-start gap-4 md:col-span-1 border-b md:border-b-0 md:border-r pb-6 md:pb-0 md:pr-6 md:mr-[-1px] ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}">
               {/* Avatar */}
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex-shrink-0 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-md ${theme === 'dark' ? 'bg-teal-600' : 'bg-blue-600'}`}>
                {initials}
              </div>
               {/* Name, Title, ID, Email */}
              <div className="pt-1">
                <div className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>{fullName}</div>
                <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{designation}</div>
                <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>ID: {arrowId}</div>
                <div className={`text-sm mt-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Email: <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>{email}</span>
                </div>
              </div>
            </div>

            {/* Right Section: Grid of Info Cards */}
            <div className="md:col-span-2 pt-6 md:pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Pass theme implicitly via context */}
                  <InfoCard title="Employee Name" value={fullName} icon={FaUser} />
                  <InfoCard title="Employee ID" value={arrowId} icon={FaIdBadge} />
                  <InfoCard title="Email Address" value={email} icon={FaEnvelope} />
                  <InfoCard title="Gender" value={gender} icon={FaMars} />
                  <InfoCard title="Mobile Number" value={mobile} icon={FaPhone} />
                  <InfoCard title="Designation" value={designation} icon={FaBriefcase} />
                  <InfoCard title="Reporting To" value={reportingAuthority} icon={FaUser} />
                  <InfoCard title="Birthdate" value={birthDate} icon={FaCalendarAlt} />
                  <InfoCard title="Joining Date" value={joiningDate} icon={FaCalendarAlt} />
                  <InfoCard title="Experience" value={experience} icon={FaBriefcase} />
                  <InfoCard title="Branch" value={branch} icon={FaBuilding} />
                  <InfoCard title="Full Mobile" value={fullMobile} icon={FaPhone} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;