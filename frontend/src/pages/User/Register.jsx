import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        user_name: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        console.log("Submitting:", formData);
        try {
            const res = await axios.post("/user/register", formData);
            console.log("✅ Registered:", res.data);
            navigate("/login"); 
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#eaf4fc] px-4">
            <div className="w-full max-w-md p-8 bg-[#eaf4fc] border border-[#d0e6f6] rounded-3xl shadow-2xl animate-fade-in transition-all duration-1000">
                <h2 className="text-3xl font-bold text-center text-[#3a506b] mb-6 tracking-wide font-serif">
                    💍 Create an account 💍
                </h2>
                <form onSubmit={handleRegister} className="space-y-5">
                    <div className="transition-all duration-300 hover:scale-[1.02]">
                        <label className="block text-sm font-medium text-[#3a506b] mb-1">First Name</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            placeholder="Enter your first name"
                            className="w-full px-4 py-2 border border-[#bdd5ea] rounded-lg bg-white text-[#3a506b] placeholder-[#94aebf] outline-none focus:ring-2 focus:ring-[#b8d8f5]"
                            required
                        />
                    </div>

                    <div className="transition-all duration-300 hover:scale-[1.02]">
                        <label className="block text-sm font-medium text-[#3a506b] mb-1">Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            placeholder="Enter your last name"
                            className="w-full px-4 py-2 border border-[#bdd5ea] rounded-lg bg-white text-[#3a506b] placeholder-[#94aebf] outline-none focus:ring-2 focus:ring-[#b8d8f5]"
                            required
                        />
                    </div>

                    <div className="transition-all duration-300 hover:scale-[1.02]">
                        <label className="block text-sm font-medium text-[#3a506b] mb-1">Username</label>
                        <input
                            type="text"
                            name="user_name"
                            value={formData.user_name}
                            onChange={handleChange}
                            placeholder="Choose a username"
                            className="w-full px-4 py-2 border border-[#bdd5ea] rounded-lg bg-white text-[#3a506b] placeholder-[#94aebf] outline-none focus:ring-2 focus:ring-[#b8d8f5]"
                            required
                        />
                    </div>

                    <div className="transition-all duration-300 hover:scale-[1.02]">
                        <label className="block text-sm font-medium text-[#3a506b] mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter a password"
                            className="w-full px-4 py-2 border border-[#bdd5ea] rounded-lg bg-white text-[#3a506b] placeholder-[#94aebf] outline-none focus:ring-2 focus:ring-[#b8d8f5]"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#3a506b] hover:bg-[#1e3247] text-white py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.03]"
                    >
                        Register
                    </button>
                </form>

                <p className="text-center text-sm text-[#5d7583] mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#3a506b] font-medium hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;