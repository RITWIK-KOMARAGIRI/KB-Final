import React from "react";

const PMWelcomePage = () => {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 border border-blue-200 mt-4">
      <h1 className="text-3xl font-bold text-blue-700">
        Welcome to the PM Dashboard
      </h1>
      <p className="mt-3 text-gray-600 leading-relaxed">
        Here you can manage employee records, view notifications,Assign Tasks
        and perform PM-related tasks.
      </p>
    </div>
  );
};

export default PMWelcomePage;
