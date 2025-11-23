import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import instance from "../../utils/axiosInstance";

const Login = () => {
  const [formData, setFormData] = useState({
    user_name: "",
    password: "",
  });
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await instance.post("/auth/login", formData);

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user_id", user.id);
      localStorage.setItem("role", user.role);

      console.log("✅ Logged in user:", user);

      // Redirect based on role
      if (user.role === "admin") {
        navigate("/admin");
      }
      else if (user.role === "owner") {
        navigate("/owner");
      }
      else {
        navigate("/");
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eaf4fc] px-4">
      <div className="w-full max-w-md p-8 bg-[#eaf4fc] border border-[#d0e6f6] rounded-3xl shadow-2xl animate-fade-in transition-all duration-1000">
        <h2 className="text-3xl font-bold text-center text-[#3a506b] mb-6 tracking-wide font-serif">
          💍 Login 💍
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="transition-all duration-300 hover:scale-[1.02]">
            <label className="block text-sm font-medium text-[#3a506b] mb-1">
              Username
            </label>
            <input
              type="text"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#bdd5ea] rounded-lg bg-white text-[#3a506b] placeholder-[#94aebf] outline-none focus:ring-2 focus:ring-[#b8d8f5] transition-all duration-300"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="transition-all duration-300 hover:scale-[1.02]">
            <label className="block text-sm font-medium text-[#3a506b] mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#bdd5ea] rounded-lg bg-white text-[#3a506b] placeholder-[#94aebf] outline-none focus:ring-2 focus:ring-[#b8d8f5] transition-all duration-300"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#3a506b] hover:bg-[#1e3247] text-white py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.03] ${isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-[#5d7583] mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#3a506b] font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
