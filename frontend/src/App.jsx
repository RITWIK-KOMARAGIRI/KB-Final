// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import HrCredentialsAdd from "./pages/director/HrCredentialsAdd";
import AssignCredentials from "./pages/director/AssignCredentials";
import EmployeeDetails from "./pages/hr/employeeDetails";
import PmDetails from "./pages/hr/pmDetails";
import MyTeam from "./pages/pm/MyTeam";
import Profile from "./pages/employee/Profile";
import TasksAssigned from "./pages/employee/TaskAssigned";
function App() {
  return (
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
  );
}

export default App;
