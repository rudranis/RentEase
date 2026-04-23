import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/axios";
import toast from "react-hot-toast";
import {
  FiLock,
  FiArrowLeft,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/");
    if (!token) {
      toast.error("Invalid reset link");
      navigate("/login");
    }
    window.scrollTo(0, 0);
  }, [isAuthenticated, navigate, token]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      await api.post("/auth/reset-password", {
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      setSuccess(true);
      toast.success("Password reset successful!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
      if (error.response?.data?.message?.includes("expired")) {
        navigate("/forgot-password");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-blue-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <FiCheckCircle className="text-green-600" size={32} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Password Reset Successful
            </h2>
            <p className="text-gray-600 mb-8">
              Your password has been successfully reset. You can now login with
              your new password.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition"
            >
              Go to Login
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-blue-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-6"
            >
              <FiArrowLeft size={20} />
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Reset Password
            </h1>
            <p className="text-gray-600">Enter your new password below.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <FiLock
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-lg focus:outline-none transition ${
                    errors.password
                      ? "border-red-500 focus:border-red-600"
                      : "border-gray-300 focus:border-purple-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm mt-2">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-lg focus:outline-none transition ${
                    errors.confirmPassword
                      ? "border-red-500 focus:border-red-600"
                      : "border-gray-300 focus:border-purple-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm mt-2">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                Password Requirements:
              </p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ At least 6 characters long</li>
                <li>✓ Must match confirmation password</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
