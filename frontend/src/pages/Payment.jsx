import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

// ✅ FIX: Removed invalid TypeScript 'declare global { interface Window {...} }' syntax
// This is a JSX file, not TypeScript. window.Razorpay is accessed directly.

const Payment = () => {
  const { listingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [bookingCreated, setBookingCreated] = useState(false);
  const bookingData = location.state || {};

  // ✅ FIX: Load Razorpay script dynamically if not present
  useEffect(() => {
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => toast.error("Failed to load payment gateway");
    document.body.appendChild(script);
    return () => {
      // cleanup only if we added it
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Redirect if no booking data
  useEffect(() => {
    if (
      !bookingData.listing ||
      !bookingData.startDate ||
      !bookingData.endDate
    ) {
      toast.error("Invalid booking data. Please try again.");
      navigate("/listings");
    }
  }, []);

  const handleCreateBooking = async () => {
    try {
      setLoading(true);
      const bookingResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/bookings`,
        {
          listingId,
          startDate: bookingData.startDate,
          endDate: bookingData.endDate,
          deliveryRequired: false,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setBookingId(bookingResponse.data.booking._id);
      setBookingCreated(true);
      toast.success(
        bookingResponse.data.message ||
          "Booking request created. Check your email for the OTP.",
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create booking request",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP sent to your email.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/bookings/${bookingId}/verify-otp`,
        { otp },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setOtpVerified(true);
      toast.success("OTP verified successfully. You may proceed to payment.");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      toast.error("Payment gateway is loading, please wait...");
      return;
    }

    if (!bookingId || !otpVerified) {
      toast.error("Please complete OTP verification before payment.");
      return;
    }

    try {
      setLoading(true);

      const orderResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/payments/create-order`,
        { bookingId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const { orderId, amount, paymentId } = orderResponse.data;

      const rzp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency: "INR",
        order_id: orderId,
        name: "RentEase",
        description: bookingData.listing?.title || "Rental Booking",
        handler: async (paymentResult) => {
          try {
            await axios.post(
              `${import.meta.env.VITE_API_URL}/payments/verify`,
              {
                razorpayOrderId: orderId,
                razorpayPaymentId: paymentResult.razorpay_payment_id,
                razorpaySignature: paymentResult.razorpay_signature,
                paymentId,
              },
              { headers: { Authorization: `Bearer ${token}` } },
            );

            toast.success("Payment successful!");
            navigate("/payment-success");
          } catch (error) {
            toast.error("Payment verification failed. Contact support.");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: { color: "#7C3AED" },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled");
            setLoading(false);
          },
        },
      });

      rzp.open();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to initiate payment",
      );
    } finally {
      setLoading(false);
    }
  };

  const listing = bookingData.listing || {};
  const startDate = bookingData.startDate
    ? new Date(bookingData.startDate)
    : null;
  const endDate = bookingData.endDate ? new Date(bookingData.endDate) : null;
  const totalDays =
    startDate && endDate
      ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
      : 0;
  const rentalAmount = totalDays * (listing.pricePerDay || 0);
  const depositAmount = listing.deposit || 0;
  const deliveryAmount =
    listing.deliveryAvailable && bookingData.withDelivery
      ? listing.deliveryCharge || 0
      : 0;
  const totalAmount = rentalAmount + depositAmount + deliveryAmount;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-xl font-bold mb-6 pb-4 border-b">
            Order Summary
          </h2>

          <div className="mb-6">
            <h3 className="font-bold text-lg mb-4 text-purple-700">
              {listing.title}
            </h3>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-500">Check-in</span>
                <span className="font-medium">
                  {startDate?.toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Check-out</span>
                <span className="font-medium">
                  {endDate?.toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Duration</span>
                <span className="font-medium">
                  {totalDays} day{totalDays !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-sm mb-6 pb-6 border-b">
            <div className="flex justify-between">
              <span className="text-gray-600">
                ₹{listing.pricePerDay} × {totalDays} day
                {totalDays !== 1 ? "s" : ""}
              </span>
              <span>₹{rentalAmount}</span>
            </div>

            {depositAmount > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>
                  Security deposit{" "}
                  <span className="text-xs text-green-600">(refundable)</span>
                </span>
                <span>₹{depositAmount}</span>
              </div>
            )}

            {deliveryAmount > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Delivery charge</span>
                <span>₹{deliveryAmount}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between text-xl font-bold mb-8">
            <span>Total Amount</span>
            <span className="text-purple-700">₹{totalAmount}</span>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">🔒 Secure Payment:</span> Your
              payment is processed securely by Razorpay. The security deposit
              will be refunded after the rental period.
            </p>
          </div>

          {!bookingCreated ? (
            <button
              onClick={handleCreateBooking}
              disabled={loading || totalDays <= 0}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition"
            >
              {loading ? "Processing..." : `Reserve & Send OTP`}
            </button>
          ) : !otpVerified ? (
            <>
              <div className="mb-4">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP sent to your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                />
              </div>
              <button
                onClick={handleVerifyOtp}
                disabled={loading || !bookingId}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          ) : (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-800">
                  OTP verified! Complete your payment to finalize the booking.
                </p>
              </div>
              <button
                onClick={handlePayment}
                disabled={loading || !razorpayLoaded || totalDays <= 0}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition"
              >
                {loading
                  ? "Processing..."
                  : !razorpayLoaded
                    ? "Loading gateway..."
                    : `Pay ₹${totalAmount}`}
              </button>
            </>
          )}

          <p className="text-xs text-gray-400 text-center mt-4">
            By proceeding, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
