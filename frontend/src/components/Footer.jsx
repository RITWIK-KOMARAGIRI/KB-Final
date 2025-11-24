import { useState, useEffect, useContext } from "react";
import { FaEnvelope, FaPhone, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

const Footer = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const { theme } = useContext(ThemeContext);

  const isDark = theme === "dark";

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");

      setCurrentTime(`${formattedHours}:${minutes}:${seconds} ${ampm}`);

      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      setCurrentDate(now.toLocaleDateString("en-US", options));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer
      className={`w-full mt-auto transition-all duration-300
      ${isDark ? "bg-slate-900 text-gray-300" : "bg-white text-gray-400"}`}
    >
      {/* Top Footer */}
      <div className="relative container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Hyderabad Office */}
        <div>
          <h3 className={`${isDark ? "text-blue-400" : "text-blue-600"} font-semibold text-lg mb-3`}>
            Hyderabad Office
          </h3>
          <p className="text-sm leading-relaxed">
            KodeBloom Technology and Services Pvt. Ltd.<br />
            Second floor, Plot No. 1, Street Number 5,<br />
            Gandhi Nagar, Sarvasukhi Colony,<br />
            West Marredpally, Secunderabad,<br />
            Telangana – 500026.
          </p>
        </div>

        {/* Vijayawada Office */}
        <div>
          <h3 className={`${isDark ? "text-blue-400" : "text-blue-600"} font-semibold text-lg mb-3`}>
            Vijayawada Office
          </h3>
          <p className="text-sm leading-relaxed">
            KodeBloom Technology and Services Pvt. Ltd.<br />
            2nd Floor, D. No. 48-11-5A,<br />
            Revenue Ward No. 2A, Currency Nagar,<br />
            Vijayawada – 2, Krishna District,<br />
            Andhra Pradesh – 520008, India.
          </p>
        </div>

        {/* Contact + Social + Clock */}
        <div className="relative">
          <h3 className={`${isDark ? "text-blue-400" : "text-blue-600"} font-semibold text-lg mb-3`}>
            Contact Info
          </h3>

          <p className="flex items-center text-sm mb-2">
            <FaEnvelope className="mr-2 text-blue-400" />
            info@kodebloom.com
          </p>

          <p className="flex items-center text-sm mb-6">
            <FaPhone className="mr-2 text-blue-400" />
            +91-9063097733
          </p>

          <h3 className={`${isDark ? "text-blue-400" : "text-blue-600"} font-semibold text-lg mb-3`}>
            Follow Us
          </h3>

          <div className="flex space-x-3">
            <a
              href="#"
              className={`w-9 h-9 flex items-center justify-center rounded-full transition
              ${isDark ? "bg-slate-700 hover:bg-blue-500 text-white" : "bg-gray-200 hover:bg-blue-500 text-gray-900"}`}
            >
              <FaFacebookF />
            </a>

            <a
              href="#"
              className={`w-9 h-9 flex items-center justify-center rounded-full transition
              ${isDark ? "bg-slate-700 hover:bg-blue-500 text-white" : "bg-gray-200 hover:bg-blue-500 text-gray-900"}`}
            >
              <FaLinkedinIn />
            </a>
          </div>

          {/* Clock */}
          <div
            className="absolute top-0 right-0 px-4 py-2 rounded-lg text-right shadow-md"
            style={{
              backgroundColor: isDark ? "#1f2937" : "#e5e7eb",
            }}
          >
            <div className={`${isDark ? "text-blue-400" : "text-blue-700"} text-lg font-bold`}>
              {currentTime}
            </div>
            <div className={`${isDark ? "text-gray-300" : "text-gray-600"} text-xs`}>
              {currentDate}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div
        className={`text-center py-3 text-sm 
        ${isDark ? "border-t border-gray-700 text-gray-400" : "border-t border-gray-200 text-gray-600"}`}
      >
        © 2025. All Rights Reserved. KodeBloom Technology and Services Pvt. Ltd.
      </div>
    </footer>
  );
};

export default Footer;
