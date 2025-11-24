import React, { useState, useEffect } from "react";
import axios from "axios";

const DirectorSettings = () => {
  const directorId = JSON.parse(localStorage.getItem("users"))?._id;

  const [settings, setSettings] = useState({
    fullName: "",
    email: "",
    mobile: "",
    theme: "light",
    accentColor: "#1d4ed8",
    twoStepLogin: false,
    emailNotifications: true,
    systemNotifications: true,
    companyName: "",
    logo: ""
  });

  const [logoPreview, setLogoPreview] = useState("");

  // Load settings
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/settings/${directorId}`)
      .then((res) => {
        if (res.data) {
          setSettings(res.data);
          setLogoPreview(res.data.logo);
        }
      })
      .catch(() => console.log("Settings not found"));
  }, [directorId]);

  // Handle update
  const handleSave = async () => {
    const formData = new FormData();

    Object.entries(settings).forEach(([key, val]) => {
      formData.append(key, val);
    });

    try {
      await axios.put(
        `http://localhost:5000/api/settings/update/${directorId}`,
        formData
      );
      alert("Settings updated successfully!");
    } catch (err) {
      alert("Failed to update settings");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-blue-700 mb-6">
        Director Settings
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Profile Info */}
        <div className="p-4 border rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-blue-600">Profile</h2>

          <label>Name</label>
          <input
            className="w-full p-2 border rounded mb-3"
            value={settings.fullName}
            onChange={(e) =>
              setSettings({ ...settings, fullName: e.target.value })
            }
          />

          <label>Email</label>
          <input
            className="w-full p-2 border rounded mb-3"
            value={settings.email}
            onChange={(e) =>
              setSettings({ ...settings, email: e.target.value })
            }
          />

          <label>Mobile</label>
          <input
            className="w-full p-2 border rounded"
            value={settings.mobile}
            onChange={(e) =>
              setSettings({ ...settings, mobile: e.target.value })
            }
          />
        </div>

        {/* Company Settings */}
        <div className="p-4 border rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-blue-600">
            Company Settings
          </h2>

          <label>Company Name</label>
          <input
            className="w-full p-2 border rounded mb-3"
            value={settings.companyName}
            onChange={(e) =>
              setSettings({ ...settings, companyName: e.target.value })
            }
          />

          <label>Upload Logo</label>
          <input
            type="file"
            className="w-full p-2 border rounded mb-3"
            onChange={(e) => {
              setSettings({ ...settings, logo: e.target.files[0] });
              setLogoPreview(URL.createObjectURL(e.target.files[0]));
            }}
          />

          {logoPreview && (
            <img
              src={logoPreview}
              alt="Company Logo"
              className="h-20 mt-2 rounded-md border"
            />
          )}
        </div>

        {/* Security Settings */}
        <div className="p-4 border rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-blue-600">
            Security
          </h2>

          <label>Change Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded mb-3"
            placeholder="New Password"
          />

          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={settings.twoStepLogin}
              onChange={(e) =>
                setSettings({ ...settings, twoStepLogin: e.target.checked })
              }
            />
            <span>Enable Two-Step Login</span>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="p-4 border rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-blue-600">
            Notifications
          </h2>

          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  emailNotifications: e.target.checked,
                })
              }
            />
            <span>Email Notifications</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.systemNotifications}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  systemNotifications: e.target.checked,
                })
              }
            />
            <span>System Notifications</span>
          </div>
        </div>

      </div>

      <button
        onClick={handleSave}
        className="mt-6 px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
      >
        Save Settings
      </button>
    </div>
  );
};

export default DirectorSettings;
