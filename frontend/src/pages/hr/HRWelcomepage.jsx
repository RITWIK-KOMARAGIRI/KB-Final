/*import React from 'react';
import api from '../../api.js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function HRDashboard() {
  const qc = useQueryClient();

  // Notifications for HR
  const { data: notifications } = useQuery({
    queryKey: ['hr-notifs'],
    queryFn: async () => (await api.get('/hr/notifications')).data
  });

  // Mutation: create employee credentials
  const createCreds = useMutation({
    mutationFn: async ({ empId, email, password }) =>
      (await api.post('/hr/employee/' + empId + '/credentials', { email, password })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['hr-notifs'] })
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">HR Dashboard</h1>
      <div className="space-y-3">
        {notifications?.map((n) => (
          <div key={n._id} className="bg-white p-4 rounded-2xl shadow border">
            <div className="font-medium">{n.title}</div>
            <div className="text-sm text-gray-600">{n.body}</div>
            {n.data?.employeeId && (
              <HREmployeeCard
                empId={n.data.employeeId}
                onCreate={(email, password) =>
                  createCreds.mutate({ empId: n.data.employeeId, email, password })
                }
              />
            )}
          </div>
        ))}
        {!notifications?.length && (
          <div className="text-gray-600">No notifications</div>
        )}
      </div>
    </div>
  );
}

// Sub-component to fetch employee info & create credentials
function HREmployeeCard({ empId, onCreate }) {
  const { data: emp } = useQuery({
    queryKey: ['employee', empId],
    queryFn: async () => (await api.get('/hr/employee/' + empId)).data
  });

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  React.useEffect(() => {
    if (emp?.email) {
      setEmail(emp.email); // prefill with employee's real email from DB
    }
  }, [emp]);

  if (!emp) return <div className="text-gray-500 text-sm mt-2">Loading employee...</div>;

  return (
    <div className="mt-3 flex items-end gap-2 flex-wrap">
      <div>
        <label className="block text-sm text-gray-600">Employee Name</label>
        <input
          value={emp.name}
          disabled
          className="mt-1 border rounded-xl px-3 py-2 bg-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600">Employee Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 border rounded-xl px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600">Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 border rounded-xl px-3 py-2"
        />
      </div>
      <button
        className="rounded-xl bg-black text-white px-3 py-2"
        onClick={() => onCreate(email, password)}
      >
        Create
      </button>
    </div>
  );
}
*/
import React from "react";

const HrWelcomePage = () => {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 border border-blue-200 mt-4">
      <h1 className="text-3xl font-bold text-blue-700">
        Welcome to the HR Dashboard
      </h1>
      <p className="mt-3 text-gray-600 leading-relaxed">
        Here you can manage employee records, view notifications,
        and perform HR-related tasks.
      </p>
    </div>
  );
};

export default HrWelcomePage;


