// // src/DirectorDashboard.jsx
// import { useState } from 'react';
// import Header from '../components/Header';
// import Sidebar from '../components/Sidebar';
// import Footer from '../components/Footer';
// import ProfileCard from '../components/ProfileCard';
// import QuickActions from '../components/QuickActions';

// function DirectorDashboard() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   const toggleCollapse = () => {
//     setSidebarCollapsed(!sidebarCollapsed);
//   };

//   return (
//     <div className="min-h-screen bg-blue-50 flex flex-col">
//       <Header toggleSidebar={toggleSidebar} />
      
//       <div className="flex flex-1 mt-16 relative min-h-[calc(100vh-4rem)]">
//         <Sidebar 
//           isOpen={sidebarOpen} 
//           isCollapsed={sidebarCollapsed} 
//           toggleCollapse={toggleCollapse} 
//         />
        
//         <main className={`main-content flex-1 p-6 min-h-[calc(100vh-4rem)] flex flex-col transition-all duration-300
//           ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}`}
//         >
//           <div className="content-area flex-1">
//             {/* Welcome Banner */}
//             <div className="welcome-banner bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6 rounded-xl mb-6 shadow-md">
//               <h1 className="text-2xl md:text-3xl font-semibold mb-2">Welcome back, Prabhakaran!</h1>
//               <p className="opacity-90">Here's your dashboard overview</p>
//             </div>
            
//             <ProfileCard />
//             <QuickActions />
//           </div>
          
//           <Footer />
//         </main>
//       </div>
//     </div>
//   );
// }

// export default DirectorDashboard;

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ProfileCard from "../components/ProfileCard";
import QuickActions from "../components/QuickActions";

const DirectorDashboard = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-4 flex flex-col gap-4">
          <div className="content-area flex-1">
           {/* Welcome Banner */}
           <div className="welcome-banner bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6 rounded-xl mb-6 shadow-md">
             <h1 className="text-2xl md:text-3xl font-semibold mb-2">Welcome back, Prabhakaran!</h1>
               <p className="opacity-90">Here's your dashboard overview</p>
             </div>
          <ProfileCard />
          <QuickActions />
          </div>
        </main>
        
      </div>
    </div>
  
  );
};

export default DirectorDashboard;
