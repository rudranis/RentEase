import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiUpload,
  FiTrash2,
  FiPlus,
  FiCheck,
  FiArrowRight,
  FiArrowLeft,
  FiImage,
  FiMapPin,
  FiPackage,
  FiDollarSign,
} from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CreateListing = () => {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "electronics",
    pricePerDay: "",
    pricePerWeek: "",
    deposit: "",
    deliveryAvailable: false,
    deliveryRadius: "",
    deliveryCharge: "",
    amenities: [],
    rules: [],
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [amenityInput, setAmenityInput] = useState("");
  const [ruleInput, setRuleInput] = useState("");

  const categories = [
    "apartment",
    "bike",
    "car",
    "tools",
    "electronics",
    "furniture",
    "books",
    "sports",
    "other",
  ];

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    window.scrollTo(0, 0);
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const previewUrl = URL.createObjectURL(file);
      setImages((prev) => [...prev, previewUrl]);
      setImageFiles((prev) => [...prev, file]);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addAmenity = (e) => {
    if (e) e.preventDefault();
    if (amenityInput.trim()) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenityInput.trim()],
      });
      setAmenityInput("");
    }
  };

  const addRule = (e) => {
    if (e) e.preventDefault();
    if (ruleInput.trim()) {
      setFormData({
        ...formData,
        rules: [...formData.rules, ruleInput.trim()],
      });
      setRuleInput("");
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (imageFiles.length === 0) {
        toast.error("Please upload at least one image");
        setLoading(false);
        return;
      }

      const pricePerDay = Number(formData.pricePerDay);
      const deposit = Number(formData.deposit);

      if (Number.isNaN(pricePerDay) || pricePerDay <= 0) {
        toast.error("Daily rental price must be greater than ₹0");
        setLoading(false);
        return;
      }

      if (Number.isNaN(deposit) || deposit < 0) {
        toast.error("Deposit cannot be negative");
        setLoading(false);
        return;
      }

      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("category", formData.category);
      submitData.append("pricePerDay", pricePerDay);
      if (formData.pricePerWeek)
        submitData.append("pricePerWeek", Number(formData.pricePerWeek));
      submitData.append("deposit", deposit);
      submitData.append(
        "location",
        JSON.stringify({
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        }),
      );
      submitData.append("deliveryAvailable", formData.deliveryAvailable);
      if (formData.deliveryAvailable) {
        submitData.append("deliveryRadius", formData.deliveryRadius);
        submitData.append("deliveryCharge", formData.deliveryCharge);
      }
      submitData.append("amenities", JSON.stringify(formData.amenities));
      submitData.append("rules", JSON.stringify(formData.rules));

      imageFiles.forEach((file) => submitData.append("images", file));

      await axios.post(`${import.meta.env.VITE_API_URL}/listings`, submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Item listed successfully!");
      navigate("/my-listings");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to list item");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, name: "Details", icon: <FiPackage /> },
    { id: 2, name: "Pricing", icon: <FiDollarSign /> },
    { id: 3, name: "Location", icon: <FiMapPin /> },
    { id: 4, name: "Guidelines", icon: <FiCheck /> },
    { id: 5, name: "Media", icon: <FiImage /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-32 pb-20">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
            New Listing
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
            Share Your Item
          </h1>
          <p className="text-gray-500 font-medium">
            Turn your unused goods into active earnings
          </p>
        </div>

        {/* Stepper */}
        <div className="flex justify-between mb-16 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 -translate-y-1/2" />
          {steps.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg transition-all duration-500 ${
                  s.id < step
                    ? "bg-primary text-white scale-90"
                    : s.id === step
                      ? "bg-white text-primary border-2 border-primary scale-110 shadow-primary/20"
                      : "bg-white text-gray-400 border border-gray-100"
                }`}
              >
                {s.id < step ? <FiCheck /> : s.icon}
              </div>
              <span
                className={`text-[10px] font-black uppercase tracking-widest ${
                  s.id === step ? "text-primary" : "text-gray-400"
                }`}
              >
                {s.name}
              </span>
            </div>
          ))}
        </div>

        {/* Form Sections */}
        <div className="glass p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-purple-500/5">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black mb-8">Basic Details</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-primary mb-2 italic">
                    Product Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Professional Cinema Camera Kit"
                    className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-primary font-bold placeholder:text-gray-300"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-primary mb-2 italic">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-primary font-bold capitalize"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-primary mb-2 italic">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tell your renters about the item's features, usage, and condition..."
                    rows={6}
                    className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-primary font-bold placeholder:text-gray-300"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black mb-8">Pricing Strategy</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-primary mb-2 italic">
                    Daily Rate (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    name="pricePerDay"
                    value={formData.pricePerDay}
                    onChange={handleInputChange}
                    placeholder="500"
                    className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-primary font-black text-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-primary mb-2 italic">
                    Refundable Deposit (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="deposit"
                    value={formData.deposit}
                    onChange={handleInputChange}
                    placeholder="2000"
                    className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-primary font-black text-xl"
                  />
                </div>
              </div>
              <div className="mt-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100 italic">
                <p className="text-sm text-blue-600 font-bold">
                  Tip: Most successful users set their deposit to 10-20% of the
                  item's original value.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black mb-8">Availability Area</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-primary mb-2 italic">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-primary font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-primary mb-2 italic">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-primary mb-2 italic">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-primary mb-2 italic">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl"
                    />
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100">
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="deliveryAvailable"
                      checked={formData.deliveryAvailable}
                      onChange={handleInputChange}
                      className="w-6 h-6 rounded-lg text-primary focus:ring-primary border-gray-200"
                    />
                    <span className="text-lg font-black text-gray-700 group-hover:text-primary transition-colors italic">
                      I can provide Item Delivery
                    </span>
                  </label>

                  {formData.deliveryAvailable && (
                    <div className="mt-6 grid grid-cols-2 gap-6 p-6 bg-primary/5 rounded-3xl animate-in zoom-in-95 duration-200">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-2">
                          Max Radius (km)
                        </label>
                        <input
                          type="number"
                          name="deliveryRadius"
                          value={formData.deliveryRadius}
                          onChange={handleInputChange}
                          className="w-full bg-white border-none px-4 py-3 rounded-xl shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-2">
                          Service Fee (₹)
                        </label>
                        <input
                          type="number"
                          name="deliveryCharge"
                          value={formData.deliveryCharge}
                          onChange={handleInputChange}
                          className="w-full bg-white border-none px-4 py-3 rounded-xl shadow-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black mb-8">Guidelines & Perks</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-primary mb-4 italic">
                    Included Amenities
                  </label>
                  <form onSubmit={addAmenity} className="flex gap-2 mb-6">
                    <input
                      type="text"
                      value={amenityInput}
                      onChange={(e) => setAmenityInput(e.target.value)}
                      placeholder="e.g. Extra Battery"
                      className="flex-1 bg-gray-50 border-none px-4 py-3 rounded-xl text-sm"
                    />
                    <button
                      type="submit"
                      className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center hover:scale-105 transition-transform"
                    >
                      <FiPlus size={20} />
                    </button>
                  </form>
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-white border border-gray-100 py-1.5 px-4 rounded-full text-xs font-bold text-gray-600 flex items-center gap-2"
                      >
                        {item}{" "}
                        <FiTrash2
                          onClick={() =>
                            setFormData({
                              ...formData,
                              amenities: formData.amenities.filter(
                                (_, i) => i !== idx,
                              ),
                            })
                          }
                          className="text-red-400 cursor-pointer hover:text-red-600"
                        />
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-primary mb-4 italic">
                    Item Usage Rules
                  </label>
                  <form onSubmit={addRule} className="flex gap-2 mb-6">
                    <input
                      type="text"
                      value={ruleInput}
                      onChange={(e) => setRuleInput(e.target.value)}
                      placeholder="e.g. Handle with care"
                      className="flex-1 bg-gray-50 border-none px-4 py-3 rounded-xl text-sm"
                    />
                    <button
                      type="submit"
                      className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center hover:scale-105 transition-transform"
                    >
                      <FiPlus size={20} />
                    </button>
                  </form>
                  <div className="flex flex-wrap gap-2">
                    {formData.rules.map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-white border border-gray-100 py-1.5 px-4 rounded-full text-xs font-bold text-gray-600 flex items-center gap-2"
                      >
                        {item}{" "}
                        <FiTrash2
                          onClick={() =>
                            setFormData({
                              ...formData,
                              rules: formData.rules.filter((_, i) => i !== idx),
                            })
                          }
                          className="text-red-400 cursor-pointer hover:text-red-600"
                        />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black mb-8">Showcases Card</h2>

              <div className="mb-10 text-center">
                <label className="group relative border-2 border-dashed border-primary/20 bg-primary/5 p-12 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-all">
                  <FiUpload className="text-4xl text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <p className="text-gray-500 font-black tracking-tight">
                    Drop your product images here
                  </p>
                  <p className="text-xs text-gray-400 font-bold uppercase mt-2">
                    Support: .jpg, .png (Max 10MB)
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                  {images.map((image, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square group shadow-lg rounded-3xl overflow-hidden ring-4 ring-white"
                    >
                      <img
                        src={image}
                        alt={`upload ${idx}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-xl scale-0 group-hover:scale-100 transition-transform"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Nav Buttons */}
          <div className="mt-12 pt-12 border-t border-gray-100 flex gap-4">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="btn-secondary flex items-center gap-2 px-8"
              >
                <FiArrowLeft /> Previous
              </button>
            )}
            {step < 5 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="btn-primary flex-1 flex items-center justify-center gap-2 text-lg italic shadow-purple-500/20"
              >
                Continue <FiArrowRight />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary flex-1 flex items-center justify-center gap-2 text-lg italic shadow-purple-500/40"
              >
                {loading ? "Registering Item..." : "Publish Listing"}{" "}
                <FiCheck size={24} />
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CreateListing;
