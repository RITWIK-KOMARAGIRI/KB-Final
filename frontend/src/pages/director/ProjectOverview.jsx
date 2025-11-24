import React, { useEffect, useState } from "react";
import axios from "axios";

function ProjectOverview() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/performance/all")
      .then(res => setData(res.data))
      .catch(() => alert("Error fetching performance"));
  }, []);

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold text-blue-700 mb-4">
        Project Performance Overview
      </h1>

      <table className="min-w-full border rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Employee</th>
            <th className="p-2 border">Project</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Submitted On</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => (
            <tr key={i} className="border">
              <td className="p-2 border">{r.employeeId?.name}</td>
              <td className="p-2 border">{r.title}</td>
              <td className="p-2 border">{r.description}</td>
              <td className="p-2 border">{r.status}</td>
              <td className="p-2 border">
                {new Date(r.submittedAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default ProjectOverview;
