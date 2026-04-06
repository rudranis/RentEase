import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/axios";
import toast from "react-hot-toast";
import { loginSuccess } from "../features/auth/authSlice";
import { FiMail, FiLock, FiArrowRight, FiShield } from "react-icons/fi";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) navigate("/");
    window.scrollTo(0, 0);
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) newErrors.email = "Valid email is required";
    if (formData.password.length < 6) newErrors.password = "Password must be 6+ chars";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      const res = await api.post("/auth/login", formData);
      dispatch(loginSuccess({ token: res.data.token, user: res.data.user }));
      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -mt-24 -mr-24 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] -mb-24 -ml-24 pointer-events-none" />

      <div className="flex-1 flex items-center justify-center px-4 pt-32 pb-20 relative z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Welcome <span className="gradient-text">Back.</span></h1>
            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Sign in to manage your rentals.</p>
          </div>

          <div className="glass p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-purple-500/5 border border-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-2">Email Address</label>
                <div className="relative group">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className="w-full pl-11 pr-4 py-4 bg-white rounded-2xl border border-gray-100 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-gray-700"
                    disabled={loading}
                  />
                  {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 px-2">{errors.email}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Password</label>
                  <Link to="/forgot-password" size="xs" className="text-[10px] font-black uppercase text-primary hover:underline">Forgot?</Link>
                </div>
                <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-4 bg-white rounded-2xl border border-gray-100 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-gray-700"
                    disabled={loading}
                  />
                  {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1 px-2">{errors.password}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 text-lg font-black shadow-purple-500/20 flex items-center justify-center gap-2 group"
              >
                {loading ? "Authorizing..." : "Sign In"}
                {!loading && <FiArrowRight className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="mt-10 pt-10 border-t border-gray-100 flex flex-col items-center gap-6">
              <p className="text-sm font-bold text-gray-400">
                New to RentEase? <Link to="/register" className="text-primary hover:underline font-black">Create Account</Link>
              </p>
              
              <div className="flex items-center gap-4 w-full">
                <div className="h-px bg-gray-100 flex-1" />
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Demo Access</span>
                <div className="h-px bg-gray-100 flex-1" />
              </div>

              <div className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3">
                <FiShield className="text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">Root Admin Login</p>
                  <p className="text-xs font-bold text-gray-600">admin@demo.com <span className="opacity-30 mx-1">|</span> admin123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
