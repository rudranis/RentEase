import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiCalendar,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiPackage,
  FiArrowRight,
  FiChevronRight,
  FiCreditCard,
  FiTrash2,
} from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MyBookings = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [tab, setTab] = useState("renter");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // bookingId being acted on

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchBookings();
    window.scrollTo(0, 0);
  }, [tab, user, token]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const endpoint =
        tab === "renter" ? "/bookings/my/renter" : "/bookings/my/owner";
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings(response.data.bookings || []);
    } catch (error) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, status, reason = "") => {
    setActionLoading(bookingId);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/bookings/${bookingId}/status`,
        { status, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Booking ${status} successfully`);
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${status} booking`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    setActionLoading(bookingId);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/bookings/${bookingId}/cancel`,
        { reason: "Cancelled by renter" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Booking cancelled");
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: "bg-amber-100 text-amber-700", icon: <FiClock /> },
      confirmed: { color: "bg-indigo-100 text-indigo-700", icon: <FiCheckCircle /> },
      active: { color: "bg-emerald-100 text-emerald-700", icon: <FiCheckCircle /> },
      completed: { color: "bg-slate-100 text-slate-600", icon: <FiPackage /> },
      cancelled: { color: "bg-rose-100 text-rose-700", icon: <FiXCircle /> },
      rejected: { color: "bg-rose-100 text-rose-700", icon: <FiXCircle /> },
    };
    return configs[status] || { color: "bg-gray-100 text-gray-600", icon: <FiClock /> };
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
               Transactional Records
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Booking Logs</h1>
            <p className="text-gray-500 font-medium tracking-tight">Track your rental history and pending requests</p>
          </div>
          
          {/* Custom Tabs */}
          <div className="flex p-1.5 bg-gray-50 rounded-2xl border border-gray-100 w-full md:w-auto">
            <button
              onClick={() => setTab("renter")}
              className={`flex-1 md:flex-none px-8 py-2.5 rounded-xl font-black text-sm tracking-tight transition-all ${
                tab === "renter" 
                ? "bg-white text-primary shadow-sm ring-1 ring-black/5" 
                : "text-gray-400 hover:text-gray-600"
              }`}
            >
              My Rentals
            </button>
            <button
              onClick={() => setTab("owner")}
              className={`flex-1 md:flex-none px-8 py-2.5 rounded-xl font-black text-sm tracking-tight transition-all ${
                tab === "owner" 
                ? "bg-white text-primary shadow-sm ring-1 ring-black/5" 
                : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Outgoing Requests
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-40 glass rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="glass p-20 text-center rounded-[3rem]">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl">📅</div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">No activity found</h2>
            <p className="text-gray-500 font-medium max-w-sm mx-auto mb-10 leading-relaxed text-lg italic">
              {tab === "renter"
                ? "Items you've booked for rent will appear here. Ready for your first one?"
                : "Booking requests for items you've listed will show up here."}
            </p>
            {tab === "renter" && (
              <button
                onClick={() => navigate("/listings")}
                className="btn-primary px-10 py-4 text-lg"
              >
                Browse Marketplace
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const config = getStatusConfig(booking.status);
              return (
                <div
                  key={booking._id}
                  className="group bg-white rounded-[2rem] border border-gray-100 p-6 md:p-8 card-hover relative overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                    {/* Item Info */}
                    <div className="md:col-span-4">
                      <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-2xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                          {booking.listing?.images?.[0] ? (
                            <img src={booking.listing.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-black text-xl text-gray-900 line-clamp-1 mb-1 group-hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/listing/${booking.listing?._id}`)}>
                            {booking.listing?.title || "Removed Item"}
                          </h3>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            {tab === "renter" ? "Owner: " : "Renter: "}
                            <span className="text-primary italic">{tab === "renter" ? booking.owner?.name : booking.renter?.name}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="md:col-span-3">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 text-gray-600">
                          <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center text-primary"><FiCalendar size={14} /></div>
                          <div>
                            <p className="text-[10px] font-black text-gray-400 tracking-wider uppercase">Rental Period</p>
                            <p className="text-sm font-black text-gray-800">
                              {new Date(booking.startDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })} 
                              <FiArrowRight className="inline mx-2 text-gray-300" />
                              {new Date(booking.endDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Financials & Status */}
                    <div className="md:col-span-2 text-center md:text-left flex flex-col gap-4">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 tracking-wider uppercase mb-1">Total Amount</p>
                        <p className="text-2xl font-black text-gray-900 italic">₹{booking.totalAmount}</p>
                      </div>
                      <div className={`inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${config.color}`}>
                        {config.icon}
                        {booking.status}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-3 flex flex-col gap-2">
                      {booking.status === "pending" && tab === "owner" && (
                        <div className="flex gap-2">
                          <button
                            disabled={actionLoading === booking._id}
                            onClick={() => handleStatusUpdate(booking._id, "confirmed")}
                            className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-black text-xs hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all"
                          >
                            {actionLoading === booking._id ? "Processing..." : "Confirm"}
                          </button>
                          <button
                            disabled={actionLoading === booking._id}
                            onClick={() => handleStatusUpdate(booking._id, "rejected")}
                            className="flex-1 py-3 bg-rose-50 text-rose-500 rounded-xl font-black text-xs hover:bg-rose-500 hover:text-white transition-all underline decoration-2 decoration-rose-500/20"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {booking.status === "pending" && booking.paymentStatus === "pending" && tab === "renter" && (
                        <button
                          onClick={() => navigate(`/payment/${booking.listing?._id}`, {
                            state: { startDate: booking.startDate, endDate: booking.endDate, listing: booking.listing, bookingId: booking._id }
                          })}
                          className="w-full py-4 bg-primary text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                          <FiCreditCard size={18} />
                          Secure Payment
                        </button>
                      )}

                      {["pending", "confirmed"].includes(booking.status) && tab === "renter" && (
                        <button
                          disabled={actionLoading === booking._id}
                          onClick={() => handleCancel(booking._id)}
                          className="w-full py-3 bg-white border-2 border-rose-100 text-rose-500 rounded-xl font-black text-xs hover:bg-rose-50 transition-all tracking-widest uppercase"
                        >
                          {actionLoading === booking._id ? "Cancelling..." : "Cancel Booking"}
                        </button>
                      )}

                      {!["pending"].includes(booking.status) && (
                        <button
                          onClick={() => navigate(`/listing/${booking.listing?._id}`)}
                          className="w-full py-3 bg-gray-50 text-gray-500 rounded-xl font-black text-xs hover:bg-primary/5 hover:text-primary transition-all flex items-center justify-center gap-2"
                        >
                          Details <FiChevronRight />
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