import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiHome, FiCalendar, FiArrowRight } from "react-icons/fi";
import Navbar from "../components/Navbar";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <div className="max-w-lg mx-auto px-4 pt-40 pb-20 text-center">
        {/* Success Animation */}
        <div className="relative mb-10">
          <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <FiCheckCircle className="text-green-500 w-16 h-16" />
          </div>
          <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full border-4 border-green-300 animate-ping opacity-30" />
        </div>

        <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">
          Payment <br />
          <span className="text-green-500">Successful!</span>
        </h1>
        <p className="text-gray-500 font-medium mb-3 text-lg">
          Your booking has been confirmed and the owner has been notified.
        </p>
        <p className="text-gray-400 font-bold text-sm mb-10">
          A confirmation email has been sent to your inbox.
        </p>

        {/* Info Card */}
        <div className="bg-white rounded-[2rem] border border-gray-100 p-6 mb-8 shadow-sm text-left">
          <div className="flex items-start gap-4 p-4 bg-green-50 rounded-2xl border border-green-100">
            <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-black text-green-800 text-sm mb-1">What happens next?</p>
              <ul className="text-sm font-bold text-green-700 space-y-1 list-none">
                <li>• The owner will finalize your booking</li>
                <li>• You'll receive pickup/delivery details via email</li>
                <li>• Your security deposit is refundable after return</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => navigate("/my-bookings")}
            className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 text-lg"
          >
            <FiCalendar />
            View My Bookings
            <FiArrowRight />
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full py-4 bg-white border-2 border-gray-200 text-gray-700 font-black rounded-2xl hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
          >
            <FiHome />
            Back to Home
          </button>
        </div>

        <p className="text-xs text-gray-400 font-bold mt-8">
          Need help?{" "}
          <button className="text-primary hover:underline">Contact support</button>
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;