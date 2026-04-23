import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/axios";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }

    const phoneRegex = /^\d{10}$/;
    if (
      !formData.phone.trim() ||
      !phoneRegex.test(formData.phone.replace(/\D/g, ""))
    ) {
      newErrors.phone = "Valid 10-digit phone number is required";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Avatar image must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      setAvatarFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setLoading(true);
      const payload = new FormData();
      payload.append("name", formData.name.trim());
      payload.append("email", formData.email.trim());
      payload.append("phone", formData.phone.replace(/\D/g, ""));
      payload.append("password", formData.password);
      payload.append("confirmPassword", formData.confirmPassword);
      if (avatarFile) {
        payload.append("avatar", avatarFile);
      }

      console.log("📤 Sending registration request...");
      const response = await api.post("/auth/register", payload);

      console.log("✅ Registration successful response:", response.data);
      toast.success(
        response.data.message || "Registration successful! You can now login.",
      );
      navigate("/login");
    } catch (error) {
      console.error("❌ Register error full object:", error);
      console.error("❌ Response data:", error.response?.data);
      console.error("❌ Response status:", error.response?.status);
      console.error("❌ Error message:", error.message);

      // Extract error message with better fallbacks
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Registration failed. Please try again.";

      console.log("📢 Showing error toast:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div className="max-w-md mx-auto py-8 px-4 md:py-12">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-2 text-center text-gray-900">
            Create Account
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Join our rental community today
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none transition ${
                  errors.name
                    ? "border-red-500 focus:border-red-600"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none transition ${
                  errors.email
                    ? "border-red-500 focus:border-red-600"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none transition ${
                  errors.phone
                    ? "border-red-500 focus:border-red-600"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Avatar Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture (Optional)
              </label>
              {avatarPreview && (
                <div className="mb-3 flex justify-center">
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
                  />
                </div>
              )}
              <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition bg-gray-50">
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <span className="text-sm text-gray-600">
                  Click to upload or drag & drop
                </span>
              </label>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className={`w-full pr-12 px-4 py-2.5 border-2 rounded-lg focus:outline-none transition ${
                    errors.password
                      ? "border-red-500 focus:border-red-600"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className={`w-full pr-12 px-4 py-2.5 border-2 rounded-lg focus:outline-none transition ${
                    errors.confirmPassword
                      ? "border-red-500 focus:border-red-600"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff size={20} />
                  ) : (
                    <FiEye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 font-semibold hover:text-blue-800 transition"
            >
              Login
            </button>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
