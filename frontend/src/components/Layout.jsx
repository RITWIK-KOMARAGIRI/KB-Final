// src/components/Layout.jsx
import { useState,useContext } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { ThemeContext } from "../context/ThemeContext";


export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);


    const { theme } = useContext(ThemeContext);


  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleCollapse = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${theme === "dark" ? "bg-slate-900 text-gray-100" : "bg-blue-50 text-gray-900"}`}>
      <Header toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 mt-16 relative min-h-[calc(100vh-4rem)]">
        <Sidebar
          isOpen={sidebarOpen}
          isCollapsed={sidebarCollapsed}
          toggleCollapse={toggleCollapse}
        />

        <main
          className={`flex-1 p-6 min-h-[calc(100vh-4rem)] flex flex-col transition-all duration-300 ${
            sidebarCollapsed ? "md:ml-16" : "md:ml-64"
          }`}
        >
          {/* Render the page content */}
          <div className="flex-1">{children}</div>

          {/* Footer always at bottom */}
          {/* <Footer /> */}
        </main>
      </div>
    </div>
  );
}
