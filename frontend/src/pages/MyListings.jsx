import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2, FiPlus, FiEye, FiStar, FiChevronRight } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MyListings = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchListings();
    window.scrollTo(0, 0);
  }, [user, token]);

  const fetchListings = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/my-listings`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setListings(response.data.listings || []);
    } catch (error) {
      toast.error("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing? This action cannot be undone."))
      return;
    setDeleting(id);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Listing deleted successfully");
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete listing");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
              Merchant Dashboard
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Your Inventory</h1>
            <p className="text-gray-500 font-medium">Manage and monitor your active rental listings</p>
          </div>
          <button
            onClick={() => navigate("/create-listing")}
            className="btn-primary flex items-center gap-2 px-8"
          >
            <FiPlus size={20} />
            Post New Item
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-[450px] glass rounded-[2rem] animate-pulse" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="glass p-20 text-center rounded-[3rem]">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl">🏪</div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">No listings active</h2>
            <p className="text-gray-500 font-medium max-w-sm mx-auto mb-10 leading-relaxed text-lg">
              Unlock the earning potential of your unused items. Start sharing with your community today!
            </p>
            <button
              onClick={() => navigate("/create-listing")}
              className="btn-primary px-10 py-4 text-lg"
            >
              Get Started Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => (
              <div
                key={listing._id}
                className="group bg-white rounded-[2rem] border border-gray-100 p-3 card-hover flex flex-col"
              >
                {/* Image Section */}
                <div className="relative h-60 w-full rounded-[1.5rem] overflow-hidden bg-gray-50">
                  {listing.images && listing.images[0] ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-300">No Image</div>
                  )}
                  
                  <div className={`absolute top-4 left-4 py-1.5 px-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                    listing.isActive ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                  }`}>
                    {listing.isActive ? "Active" : "Hidden"}
                  </div>
                  
                  <div className="absolute top-4 right-4 glass py-1.5 px-3 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-800">
                    {listing.category}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-extrabold text-xl mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {listing.title}
                  </h3>
                  
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-2xl font-black text-gray-900 italic">₹{listing.pricePerDay}</span>
                    <span className="text-gray-400 font-bold text-xs uppercase">/ Day</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-2xl text-center">
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Views</p>
                      <p className="text-lg font-black text-gray-900">{listing.views || 0}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-2xl text-center">
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Rating</p>
                      <p className="text-lg font-black text-gray-900 flex items-center justify-center gap-1">
                        <FiStar className="text-yellow-400 fill-yellow-400" size={14} />
                        {listing.ratings?.average?.toFixed(1) || "0.0"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto pt-4 border-t border-gray-50 flex gap-2">
                    <button
                      onClick={() => navigate(`/listing/${listing._id}`)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-gray-600 rounded-xl font-bold text-sm hover:bg-primary/5 hover:text-primary transition-all"
                    >
                      <FiEye size={16} /> View
                    </button>
                    <button
                      onClick={() => navigate(`/edit-listing/${listing._id}`)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-gray-600 rounded-xl font-bold text-sm hover:bg-blue-50 hover:text-blue-600 transition-all"
                    >
                      <FiEdit2 size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(listing._id)}
                      disabled={deleting === listing._id}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-500 rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default MyListings;