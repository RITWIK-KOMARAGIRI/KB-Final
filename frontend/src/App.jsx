// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import axios from "axios";
import Signin from "./auth/Signin";
import DirectorDashboard from "./pages/DirectorDashboard";
import PMDashboard from "./pages/pm/Dashboard";
import HrDashboard from "./pages/hr/HrDashboard";
import EMDashboard from "./pages/employee/Dashboard";
import PrivateRoute from "./utils/PrivateRoute";
import Layout from "./components/Layout"; // new wrapper
import Footer from "./components/Footer";
import EmployeeAdd from "./pages/director/EmployeeADD";
import Announcement from "./pages/director/Announcement";
import Holiday from "./pages/director/Holiday";
import Notice from "./pages/director/Notice";
import Report from "./pages/director/Report";
import ProjectOverview from "./pages/director/ProjectOverview";
import Account from "./pages/director/Account";
import AddEmployeeCredentials from "./pages/hr/AddEmployeeCredentials";
import Credentials from "./pages/hr/credentials";
import Attendace from "./pages/hr/Attendance";
import HrCredentialsAdd from "./pages/director/HrCredentialsAdd";
import AssignCredentials from "./pages/director/AssignCredentials";
import EmployeeDetails from "./pages/hr/employeeDetails";
import PmDetails from "./pages/hr/pmDetails";
import HrMessages from "./pages/hr/Messages";
import DirectorMessages from "./pages/director/Messages";
import MyTeam from "./pages/pm/MyTeam";
import CreateProject from "./pages/pm/CreateProject";
import MonitorProgress from "./pages/pm/MonitorProgress";
import TeamManagement from "./pages/pm/TeamManagement";
import PMReports from "./pages/pm/Reports";
import PMImportantNotices from "./pages/pm/ImportantNotices";
import InventoryResources from "./pages/pm/InventoryResources";
import HolidayCalendar from "./pages/pm/HolidayCalendar";
import PMSettings from "./pages/pm/Settings";
import ManageEmployee from "./pages/hr/manageEmployee";
import Profile from "./pages/employee/Profile";
import TasksAssigned from "./pages/employee/TaskAssigned";
import HolidayList from "./pages/employee/HolidayList";
import ImportantNotices from "./pages/employee/Importantnotices";
import LeaveApplication from "./pages/employee/LeaveApplication";
import Messenger from "./pages/employee/Messenger";
import PmMessages from "./pages/pm/Messages"; // <-- added import
function App() {
  // Ensure axios sends JWT if user already logged in
  try {
    const raw = localStorage.getItem("users");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${parsed.token}`;
      }
    }
  } catch (_e) {}

  return (
            <ThemeProvider>

    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Signin />} />

        {/* Protected Routes with Layout */}
        <Route
          path="/director"
          element={
            <PrivateRoute role="director">
              <Layout>
                <DirectorDashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route path="/director/create-employee" element={
          <PrivateRoute role="director">
            <Layout>
              <EmployeeAdd/>
            </Layout>
          </PrivateRoute>
        } />
       
       <Route path="/director/HrCredentials" element={
          <PrivateRoute role="director">
            <Layout>
              <HrCredentialsAdd/>
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/director/assign-credentials/:employeeId" element={
          <PrivateRoute role="director">
            <Layout>
              <AssignCredentials/>
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/director/account" element={
          <PrivateRoute role="director">
            <Layout>
              <Account/>
            </Layout>
          </PrivateRoute>
        } />
      <Route path="/director/announcement" element={
          <PrivateRoute role="director">
            <Layout>
              <Announcement/>
            </Layout>
          </PrivateRoute>
        } />

         <Route path="/director/holiday" element={
          <PrivateRoute role="director">
            <Layout>
              <Holiday/>
            </Layout>
          </PrivateRoute>
        } />
      <Route path="/director/Notice" element={
          <PrivateRoute role="director">
            <Layout>
              <Notice/>
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/director/messages" element={
          <PrivateRoute role="director">
            <Layout>
              <DirectorMessages />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/director/project-overview" element={
          <PrivateRoute role="director">
            <Layout>
              <ProjectOverview/>
            </Layout>
          </PrivateRoute>
        } />

         <Route path="/director/report" element={
          <PrivateRoute role="director">
            <Layout>
              <Report/>
            </Layout>
          </PrivateRoute>
        } />

         
       
<Route
          path="/projectmanager"
          element={
            <PrivateRoute role="project managers">
              <Layout>
                <PMDashboard />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/pm/create-project"
          element={
            <PrivateRoute role="project managers">
              <Layout>
                <CreateProject />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/pm/my-team"
          element={
            <PrivateRoute role="project managers">
              <Layout>
                <MyTeam />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/pm/monitor-progress"
          element={
            <PrivateRoute role="project managers">
              <Layout>
                <MonitorProgress />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/pm/team-management"
          element={
            <PrivateRoute role="project managers">
              <Layout>
                <TeamManagement />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/pm/reports"
          element={
            <PrivateRoute role="project managers">
              <Layout>
                <PMReports />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/pm/important-notices"
          element={
            <PrivateRoute role="project managers">
              <Layout>
                <PMImportantNotices />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/pm/inventory-resources"
          element={
            <PrivateRoute role="project managers">
              <Layout>
                <InventoryResources />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/pm/holiday-calendar"
          element={
            <PrivateRoute role="project managers">
              <Layout>
                <HolidayCalendar />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/pm/settings"
          element={
            <PrivateRoute role="project managers">
              <Layout>
                <PMSettings />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/pm/messages"
          element={
            <PrivateRoute role="project managers">
              <Layout>
                <PmMessages />
              </Layout>
            </PrivateRoute>
          }
        />
         <Route 
          path="/pm/my-team"
          element={
            <PrivateRoute role="project managers">
              <Layout>
                <MyTeam />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/hr"
          element={
            <PrivateRoute role="hr">
              <Layout>
                <HrDashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/hr/add-credentials"
          element={
            <PrivateRoute role="hr">
              <Layout>
                <AddEmployeeCredentials/>
              </Layout>
            </PrivateRoute>
          }
        />
        <Route 
          path="/hr/employee-records"
          element={
            <PrivateRoute role="hr">
              <Layout>
                <EmployeeDetails />
              </Layout>
            </PrivateRoute>
          }
        />  
          <Route 
          path="/hr/pm-records"
          element={
            <PrivateRoute role="hr">
              <Layout>
                <PmDetails />
              </Layout>
            </PrivateRoute>
          }
        />  
        
        <Route
          path="/hr/Attendance"
          element={
            <PrivateRoute role="hr">
              <Layout>
                <Attendace />
              </Layout>
            </PrivateRoute>
          }
        />
         <Route 
          path="/hr/credentials"
          element={
            <PrivateRoute role="hr">
              <Layout>
                <Credentials />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/hr/manage-employee"
          element={
            <PrivateRoute role="hr">
              <Layout>
                <ManageEmployee />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/hr/messages"
          element={
            <PrivateRoute role="hr">
              <Layout>
                <HrMessages />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/employee"
          element={
            <PrivateRoute role="employee">
              <Layout>
                <EMDashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route 
          path="/employee/my-profile"
          element={
            <PrivateRoute role="employee">
              <Layout>
                <Profile />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route 
          path="/employee/holiday-list"
          element={
            <PrivateRoute role="employee">
              <Layout>
                <HolidayList />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route 
          path="/employee/important-notice"
          element={
            <PrivateRoute role="employee">
              <Layout>
                <ImportantNotices />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route 
          path="/employee/leave-application"
          element={
            <PrivateRoute role="employee">
              <Layout>
                <LeaveApplication />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route 
          path="/employee/messenger"
          element={
            <PrivateRoute role="employee">
              <Layout>
                <Messenger/>
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/employee/my-tasks"
          element={
            <PrivateRoute role="employee">
              <Layout>
                <TasksAssigned />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer/>
    </Router>
    </ThemeProvider>
  );
}

export default App;
