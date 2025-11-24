import React from "react";
import DirectorSettings from "../director/Account";

// Reuse the Director settings screen for Project Managers as well.
// The component already reads the logged-in user from localStorage and
// stores settings by user id, so it will work for PM users too.
const Settings = () => {
  return <DirectorSettings />;
};

export default Settings;
