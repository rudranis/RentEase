import React from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="bg-white rounded-lg shadow p-8 max-w-md w-full text-center">
        <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">
          Your booking has been confirmed. You will receive a confirmation email
          shortly with all the details.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-green-800">
            <span className="font-semibold">Booking ID:</span> #BK123456789
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/my-bookings")}
            className="w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700"
          >
            View My Bookings
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full border-2 border-purple-600 text-purple-600 font-semibold py-2 rounded-lg hover:bg-purple-50"
          >
            Continue Shopping
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Need help?{" "}
          <a href="#" className="text-purple-600 hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
