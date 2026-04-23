import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { FiShield, FiClock, FiCheckCircle, FiLock, FiCalendar, FiTag, FiTruck } from "react-icons/fi";

const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Payment = () => {
  const { listingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [bookingCreated, setBookingCreated] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [loadedListing, setLoadedListing] = useState(null);
  const [step, setStep] = useState(1); // 1: review, 2: otp, 3: payment

  const bookingData = location.state || {};

  useEffect(() => {
    if (
      !bookingData.bookingId &&
      (!bookingData.listing || !bookingData.startDate || !bookingData.endDate)
    ) {
      toast.error("Invalid booking data. Please try again.");
      navigate("/listings");
      return;
    }

    if (bookingData.bookingId) {
      setBookingId(bookingData.bookingId);
      setBookingCreated(true);
      setStep(2);
      fetchExistingBooking(bookingData.bookingId);
    }

    if (!bookingData.listing && listingId) {
      fetchListing();
    }
  }, []);

  const fetchExistingBooking = async (bId) => {
    if (!token) return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/bookings/${bId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentBooking(response.data);
      if (response.data.otpVerified) {
        setOtpVerified(true);
        setStep(3);
      }
      if (response.data.paymentStatus === "paid") {
        toast.success("Payment already completed!");
        navigate("/payment-success");
      }
    } catch (error) {
      toast.error("Unable to load booking details.");
    }
  };

  const fetchListing = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/listings/${listingId}`
      );
      setLoadedListing(response.data);
    } catch (error) {
      console.error("Failed to load listing:", error);
    }
  };

  const listing = currentBooking?.listing || bookingData.listing || loadedListing || {};
  const startDate = currentBooking?.startDate
    ? new Date(currentBooking.startDate)
    : bookingData.startDate ? new Date(bookingData.startDate) : null;
  const endDate = currentBooking?.endDate
    ? new Date(currentBooking.endDate)
    : bookingData.endDate ? new Date(bookingData.endDate) : null;
  const totalDays = currentBooking?.totalDays ||
    (startDate && endDate ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) : 0);
  const rentalAmount = totalDays * (listing.pricePerDay || 0);
  const depositAmount = listing.deposit || currentBooking?.deposit || 0;
  const totalAmount = currentBooking?.totalAmount && currentBooking.totalAmount > 0
    ? currentBooking.totalAmount
    : rentalAmount + depositAmount;

  const handleCreateBooking = async () => {
    if (!listing.pricePerDay || listing.pricePerDay <= 0) {
      toast.error("This listing has invalid pricing.");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/bookings`,
        {
          listingId,
          startDate: bookingData.startDate,
          endDate: bookingData.endDate,
          deliveryRequired: false,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookingId(res.data.booking._id);
      setBookingCreated(true);
      setCurrentBooking(res.data.booking);
      setStep(2);
      toast.success("Booking created! Check your email for the OTP.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP.");
      return;
    }
    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/bookings/${bookingId}/verify-otp`,
        { otp },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOtpVerified(true);
      setStep(3);
      toast.success("OTP verified! Proceed to payment.");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!bookingId || !otpVerified) {
      toast.error("Please complete OTP verification first.");
      return;
    }
    if (totalAmount <= 0) {
      toast.error("Invalid payment amount.");
      return;
    }

    try {
      setLoading(true);

      // Load Razorpay script
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error("Failed to load payment gateway. Please check your internet connection.");
        setLoading(false);
        return;
      }

      // Create order
      const orderRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/payments/create-order`,
        { bookingId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { orderId, amount, paymentId } = orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency: "INR",
        order_id: orderId,
        name: "RentEase",
        description: `Booking for ${listing.title || "Rental Item"}`,
        image: "https://via.placeholder.com/150?text=RE",
        handler: async function (response) {
          try {
            await axios.post(
              `${import.meta.env.VITE_API_URL}/payments/verify`,
              {
                razorpayOrderId: orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                paymentId,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Payment successful!");
            navigate("/payment-success");
          } catch (err) {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: { color: "#7C3AED" },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled.");
            setLoading(false);
          },
          confirm_close: true,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        toast.error(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to initiate payment");
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, label: "Review Order" },
    { id: 2, label: "Verify OTP" },
    { id: 3, label: "Pay Securely" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 pt-32 pb-20">
        <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Complete Booking</h1>
        <p className="text-gray-500 font-medium mb-10">Secure checkout powered by Razorpay</p>

        {/* Step Indicator */}
        <div className="flex items-center gap-0 mb-12 max-w-md">
          {steps.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all ${
                  step > s.id ? "bg-green-500 text-white" :
                  step === s.id ? "bg-primary text-white ring-4 ring-primary/20" :
                  "bg-gray-100 text-gray-400"
                }`}>
                  {step > s.id ? <FiCheckCircle /> : s.id}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
                  step === s.id ? "text-primary" : "text-gray-400"
                }`}>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mb-5 mx-2 transition-all ${step > s.id ? "bg-green-500" : "bg-gray-200"}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Step 1: Review */}
            {step === 1 && (
              <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
                <h2 className="text-xl font-black mb-6 text-gray-900">Booking Details</h2>

                <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-200 flex-shrink-0">
                    {listing.images?.[0] ? (
                      <img src={listing.images[0]} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-gray-900">{listing.title || "Loading..."}</h3>
                    <p className="text-sm font-bold text-gray-400 capitalize">{listing.category}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <FiCalendar className="text-primary" />
                    <div className="flex-1 flex justify-between">
                      <span className="text-sm font-bold text-gray-600">Check-in</span>
                      <span className="text-sm font-black text-gray-900">
                        {startDate?.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <FiCalendar className="text-primary" />
                    <div className="flex-1 flex justify-between">
                      <span className="text-sm font-bold text-gray-600">Check-out</span>
                      <span className="text-sm font-black text-gray-900">
                        {endDate?.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <FiClock className="text-primary" />
                    <div className="flex-1 flex justify-between">
                      <span className="text-sm font-bold text-gray-600">Duration</span>
                      <span className="text-sm font-black text-gray-900">{totalDays} day{totalDays !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCreateBooking}
                  disabled={loading || totalDays <= 0}
                  className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20 text-lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : "Confirm & Get OTP →"}
                </button>
              </div>
            )}

            {/* Step 2: OTP */}
            {step === 2 && (
              <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FiLock className="text-primary text-2xl" />
                  </div>
                  <h2 className="text-xl font-black text-gray-900 mb-2">Verify Your Identity</h2>
                  <p className="text-gray-500 font-medium">
                    We sent a 6-digit OTP to <span className="font-black text-gray-900">{user?.email}</span>
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-black uppercase tracking-widest text-primary mb-3">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="● ● ● ● ● ●"
                    maxLength={6}
                    className="w-full text-center text-3xl font-black tracking-[0.5em] bg-gray-50 border-2 border-gray-200 focus:border-primary rounded-2xl py-5 focus:outline-none transition-all"
                  />
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.length !== 6}
                  className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20 text-lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Verifying...
                    </span>
                  ) : "Verify OTP →"}
                </button>

                <p className="text-center text-sm text-gray-400 font-bold mt-4">
                  Didn't receive it? Check your spam folder.
                </p>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6 p-4 bg-green-50 rounded-2xl border border-green-100">
                  <FiCheckCircle className="text-green-500 text-xl flex-shrink-0" />
                  <div>
                    <p className="font-black text-green-800 text-sm">Identity Verified</p>
                    <p className="text-green-600 text-xs font-bold">Your OTP has been verified successfully</p>
                  </div>
                </div>

                <h2 className="text-xl font-black mb-6 text-gray-900">Complete Payment</h2>

                <div className="p-5 bg-gray-50 rounded-2xl mb-6 border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <FiShield className="text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest text-primary">Secured by Razorpay</span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">
                    Your payment is 100% secure. We use 256-bit SSL encryption and Razorpay's verified payment gateway.
                  </p>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full py-5 bg-gradient-to-r from-primary to-blue-600 text-white font-black rounded-2xl hover:opacity-95 disabled:opacity-50 transition-all shadow-xl shadow-primary/20 text-xl"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Opening Payment...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <FiLock />
                      Pay ₹{totalAmount.toLocaleString("en-IN")} Securely
                    </span>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center mt-4 font-bold">
                  By proceeding, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            )}
          </div>

          {/* Price Summary Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm sticky top-32">
              <h3 className="font-black text-gray-900 mb-6 text-lg">Price Breakdown</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-500 flex items-center gap-2">
                    <FiTag size={14} className="text-primary" />
                    ₹{listing.pricePerDay || 0} × {totalDays} days
                  </span>
                  <span className="font-black text-gray-900">₹{rentalAmount.toLocaleString("en-IN")}</span>
                </div>

                {depositAmount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-500 flex items-center gap-2">
                      <FiShield size={14} className="text-green-500" />
                      Security Deposit
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-black">REFUNDABLE</span>
                    </span>
                    <span className="font-black text-gray-900">₹{depositAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-black text-gray-900 text-lg">Total Due</span>
                  <span className="text-2xl font-black text-primary">₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { icon: <FiShield className="text-blue-500" />, text: "RentEase Guarantee" },
                  { icon: <FiLock className="text-green-500" />, text: "Secure Payment" },
                  { icon: <FiTruck className="text-purple-500" />, text: "Verified Owner" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs font-bold text-gray-500">
                    {item.icon}
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;