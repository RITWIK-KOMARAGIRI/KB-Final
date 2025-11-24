import React from "react";

const EMWelcomePage = () => {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 border border-blue-200 mt-4">
      <h1 className="text-3xl font-bold text-blue-700">
        Welcome to the EM Dashboard
      </h1>
      <p className="mt-3 text-gray-600 leading-relaxed">
        Here you can view notifications,Assigned Tasks
        and perform EM-related tasks.
      </p>
    </div>
  );
};

export default EMWelcomePage;
