import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signin", {
        email,
        password,
      });

      const data = res.data; // ✅ Correct way

      setSuccess(`Welcome ${data.name}! Role: ${data.role}`);
      localStorage.setItem("users", JSON.stringify(data)); // ✅ Save user info

      if (data.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      }

      // ✅ Navigate based on role
      if (data.role === "director") navigate("/director");
      if (data.role === "project managers") navigate("/projectmanager");
      if (data.role === "hr") navigate("/hr");
      if (data.role === "employee") navigate("/employee");
    } catch (err) {
      setError(err.response?.data?.message || "Signin failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}
        {success && <p className="text-green-500 mb-3">{success}</p>}

        <form onSubmit={handleSignin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
