import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/axios";
import toast from "react-hot-toast";
import { FiMail, FiArrowLeft, FiCheckCircle } from "react-icons/fi";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate("/");
    window.scrollTo(0, 0);
  }, [isAuthenticated, navigate]);

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });
      setSubmitted(true);
      toast.success("Password reset link sent to your email!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to process request");
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
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
              Check Your Email
            </h2>
            <p className="text-gray-600 mb-6">
              If an account exists with {email}, we've sent a password reset
              link to your email.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              The link will expire in 1 hour. Please check your spam folder if
              you don't see it.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition mb-4"
            >
              Back to Login
            </button>

            <button
              onClick={() => setSubmitted(false)}
              className="w-full border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 transition"
            >
              Try Another Email
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
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-6"
            >
              <FiArrowLeft size={20} />
              Back
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Forgot Password?
            </h1>
            <p className="text-gray-600">
              No worries! We'll help you reset it.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                    error
                      ? "border-red-500 focus:border-red-600"
                      : "border-gray-300 focus:border-purple-500"
                  }`}
                />
              </div>
              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-purple-600 font-semibold hover:text-purple-700"
            >
              Login here
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
