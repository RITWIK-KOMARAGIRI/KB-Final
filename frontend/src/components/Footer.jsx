import { useState, useEffect } from "react";
import { FaEnvelope, FaPhone, FaFacebookF, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // Format time
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");

      setCurrentTime(`${formattedHours}:${minutes}:${seconds} ${ampm}`);

      // Format date
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
    <footer className="w-full bg-[#121223] text-white mt-auto">
      {/* Footer Top Content */}
      <div className="relative container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Hyderabad Office */}
        <div>
          <h3 className="text-blue-500 font-semibold text-lg mb-3">
            Hyderabad Office
          </h3>
          <p className="text-sm leading-relaxed">
            KodeBloom Technology and Services Pvt. Ltd.<br />
            Second floor, Plot No. 1, Street Number 5,<br />
            Gandhi Nagar, Sarvasukhi Colony,<br />
            West Marredpally, Secunderabad,<br />
            Telangana–500026.
          </p>
        </div>

        {/* Vijayawada Office */}
        <div>
          <h3 className="text-blue-500 font-semibold text-lg mb-3">
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

        {/* Contact Info + Clock */}
        <div className="relative">
          <h3 className="text-blue-500 font-semibold text-lg mb-3">
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

          <h3 className="text-blue-500 font-semibold text-lg mb-3">
            Follow Us
          </h3>
          <div className="flex space-x-3">
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center bg-gray-700 rounded-full hover:bg-blue-500 transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center bg-gray-700 rounded-full hover:bg-blue-500 transition"
            >
              <FaLinkedinIn />
            </a>
          </div>

          {/* Clock Section */}
          <div className="absolute top-0 right-0 bg-gray-700 px-4 py-2 rounded-lg text-right">
            <div className="text-blue-400 text-lg font-bold">{currentTime}</div>
            <div className="text-xs text-gray-200">{currentDate}</div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-700 text-center py-2 text-gray-400 text-sm">
        © 2025. All Rights Reserved. KodeBloom Technology and Services Pvt. Ltd.
      </div>
    </footer>
  );
};

export default Footer;
