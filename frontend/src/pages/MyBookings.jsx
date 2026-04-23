import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiPackage,
  FiArrowRight,
  FiChevronRight,
  FiCreditCard,
  FiRefreshCw,
} from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const statusConfig = {
  pending: {
    color: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
    icon: <FiClock size={14} />,
  },
  confirmed: {
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dot: "bg-indigo-400",
    icon: <FiCheckCircle size={14} />,
  },
  active: {
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-400",
    icon: <FiCheckCircle size={14} />,
  },
  completed: {
    color: "bg-gray-100 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
    icon: <FiPackage size={14} />,
  },
  cancelled: {
    color: "bg-rose-50 text-rose-600 border-rose-200",
    dot: "bg-rose-400",
    icon: <FiXCircle size={14} />,
  },
  rejected: {
    color: "bg-rose-50 text-rose-600 border-rose-200",
    dot: "bg-rose-400",
    icon: <FiXCircle size={14} />,
  },
};

const MyBookings = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [tab, setTab] = useState("renter");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchBookings();
    window.scrollTo(0, 0);
  }, [tab, user]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const endpoint =
        tab === "renter" ? "/bookings/my/renter" : "/bookings/my/owner";
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setBookings(res.data.bookings || []);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    setActionLoading(bookingId);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/bookings/${bookingId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(`Booking ${status}`);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${status} booking`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;
    setActionLoading(bookingId);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/bookings/${bookingId}/cancel`,
        { reason: "Cancelled by renter" },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Booking cancelled");
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel");
    } finally {
      setActionLoading(null);
    }
  };

  // Navigate to payment with correct state
  const handlePayment = (booking) => {
    navigate(`/payment/${booking.listing?._id}`, {
      state: {
        startDate: booking.startDate,
        endDate: booking.endDate,
        listing: booking.listing,
        bookingId: booking._id,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-32 pb-20">
        {/* Header */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 mb-10 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-3">
                Booking History
              </div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-1">
                My Bookings
              </h1>
              <p className="text-gray-500 font-medium">
                Track and manage all your rental transactions
              </p>
            </div>

            <div className="flex gap-1 p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
              {[
                { id: "renter", label: "As Renter" },
                { id: "owner", label: "As Owner" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-6 py-2.5 rounded-xl font-black text-sm transition-all ${
                    tab === t.id
                      ? "bg-white text-primary shadow-sm ring-1 ring-black/5"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-36 bg-white rounded-[2rem] animate-pulse border border-gray-100"
              />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-20 text-center shadow-sm">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl">
              📅
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">
              No bookings yet
            </h2>
            <p className="text-gray-500 font-medium max-w-xs mx-auto mb-10 leading-relaxed">
              {tab === "renter"
                ? "Items you book for rent will appear here."
                : "Booking requests for your listings will appear here."}
            </p>
            {tab === "renter" && (
              <button
                onClick={() => navigate("/listings")}
                className="bg-primary text-white font-black px-10 py-4 rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
              >
                Browse Marketplace
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const cfg = statusConfig[booking.status] || statusConfig.pending;
              const isLoading = actionLoading === booking._id;
              const showPayBtn =
                tab === "renter" &&
                booking.status === "pending" &&
                booking.paymentStatus === "pending";

              return (
                <div
                  key={booking._id}
                  className="group bg-white rounded-[2rem] border border-gray-100 p-6 hover:shadow-lg hover:shadow-primary/5 transition-all"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Item Image + Info */}
                    <div className="md:col-span-4 flex items-center gap-4">
                      <div className="w-18 h-16 w-16 rounded-2xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                        {booking.listing?.images?.[0] ? (
                          <img
                            src={booking.listing.images[0]}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">
                            📦
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3
                          className="font-black text-gray-900 truncate group-hover:text-primary transition-colors cursor-pointer text-base"
                          onClick={() =>
                            navigate(`/listing/${booking.listing?._id}`)
                          }
                        >
                          {booking.listing?.title || "Removed Item"}
                        </h3>
                        <p className="text-xs font-bold text-gray-400 mt-0.5">
                          {tab === "renter"
                            ? `Owner: ${booking.owner?.name}`
                            : `Renter: ${booking.renter?.name}`}
                        </p>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="md:col-span-3">
                      <div className="flex items-center gap-2 text-sm">
                        <FiCalendar
                          size={14}
                          className="text-primary flex-shrink-0"
                        />
                        <span className="font-bold text-gray-600">
                          {new Date(booking.startDate).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short" },
                          )}
                          {" → "}
                          {new Date(booking.endDate).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-gray-400 mt-1 ml-6">
                        {booking.totalDays} days
                      </p>
                    </div>

                    {/* Amount + Status */}
                    <div className="md:col-span-2 flex flex-col gap-2">
                      <p className="text-xl font-black text-gray-900">
                        ₹{booking.totalAmount?.toLocaleString("en-IN")}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border ${cfg.color} w-fit`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
                        />
                        {booking.status}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-3 flex flex-wrap gap-2">
                      {/* Owner: confirm/reject */}
                      {booking.status === "pending" && tab === "owner" && (
                        <>
                          <button
                            disabled={isLoading}
                            onClick={() =>
                              handleStatusUpdate(booking._id, "confirmed")
                            }
                            className="flex-1 py-2.5 bg-emerald-500 text-white rounded-xl font-black text-xs hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
                          >
                            {isLoading ? "..." : "✓ Confirm"}
                          </button>
                          <button
                            disabled={isLoading}
                            onClick={() =>
                              handleStatusUpdate(booking._id, "rejected")
                            }
                            className="flex-1 py-2.5 bg-rose-50 text-rose-600 rounded-xl font-black text-xs hover:bg-rose-100 transition-all border border-rose-200 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {/* Renter: pay */}
                      {showPayBtn && (
                        <button
                          onClick={() => handlePayment(booking)}
                          className="w-full py-3 bg-primary text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                        >
                          <FiCreditCard size={16} />
                          Pay ₹{booking.totalAmount?.toLocaleString("en-IN")}
                        </button>
                      )}

                      {/* Renter: cancel */}
                      {["pending", "confirmed"].includes(booking.status) &&
                        tab === "renter" && (
                          <button
                            disabled={isLoading}
                            onClick={() => handleCancel(booking._id)}
                            className="w-full py-2.5 border-2 border-rose-100 text-rose-500 rounded-xl font-black text-xs hover:bg-rose-50 transition-all disabled:opacity-50"
                          >
                            {isLoading ? "Cancelling..." : "Cancel Booking"}
                          </button>
                        )}

                      {/* View details */}
                      {!["pending"].includes(booking.status) && (
                        <button
                          onClick={() =>
                            navigate(`/listing/${booking.listing?._id}`)
                          }
                          className="w-full py-2.5 bg-gray-50 text-gray-500 rounded-xl font-black text-xs hover:bg-primary/5 hover:text-primary transition-all flex items-center justify-center gap-1"
                        >
                          View Details <FiChevronRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MyBookings;
