// src/components/Layout.jsx
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleCollapse = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
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
