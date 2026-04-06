import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiStar,
  FiMessageCircle,
  FiShield,
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiInfo,
  FiTruck,
} from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchListing();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchListing = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/listings/${id}`
      );
      setListing(response.data);
      const reviewRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/reviews/listing/${id}`
      );
      setReviews(reviewRes.data.reviews || []);
    } catch (error) {
      toast.error("Failed to load listing");
      navigate("/listings");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user._id === listing.owner._id) {
      toast.error("You cannot book your own listing");
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Please select dates");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      toast.error("End date must be after start date");
      return;
    }
    navigate(`/payment/${id}`, {
      state: { startDate, endDate, listing },
    });
  };

  const handleMessage = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(`/chat?userId=${listing.owner._id}&listingId=${listing._id}`);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-white flex flex-col pt-32">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-gray-400">Loading details...</p>
          </div>
        </div>
      </div>
    );

  if (!listing)
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-40 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Listing not found</h2>
          <button onClick={() => navigate("/listings")} className="mt-4 text-primary font-bold">Return to explore</button>
        </div>
      </div>
    );

  const totalDays =
    startDate && endDate
      ? Math.ceil(
          (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
        )
      : 0;
  const totalPrice = totalDays * listing.pricePerDay;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-400 hover:text-primary mb-8 font-bold transition-all"
        >
          <div className="p-2 rounded-full group-hover:bg-primary/10">
            <FiArrowLeft />
          </div>
          Back to Listings
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Media & Info */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative group bg-gray-100 rounded-[2.5rem] overflow-hidden aspect-[16/10] shadow-2xl shadow-purple-500/5">
                {listing.images && listing.images.length > 0 ? (
                  <>
                    <img
                      src={listing.images[currentImageIndex]}
                      alt={listing.title}
                      className="w-full h-full object-cover transition-transform duration-700"
                    />
                    
                    {/* Gallery Navigation */}
                    {listing.images.length > 1 && (
                      <>
                        <button 
                          onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? listing.images.length - 1 : prev - 1))}
                          className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 glass rounded-full flex items-center justify-center text-gray-800 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                        >
                          <FiChevronLeft size={24} />
                        </button>
                        <button 
                          onClick={() => setCurrentImageIndex((prev) => (prev === listing.images.length - 1 ? 0 : prev + 1))}
                          className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 glass rounded-full flex items-center justify-center text-gray-800 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                        >
                          <FiChevronRight size={24} />
                        </button>
                      </>
                    )}

                    <div className="absolute bottom-6 right-6 glass py-1.5 px-4 rounded-full text-xs font-black tracking-widest text-gray-800">
                      {currentImageIndex + 1} / {listing.images.length}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300">No Image</div>
                )}
              </div>

              {/* Thumbnails */}
              {listing.images && listing.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {listing.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden transition-all ${
                        currentImageIndex === idx ? "ring-4 ring-primary ring-offset-4" : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Stats */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="glass py-1.5 px-4 rounded-full text-xs font-black uppercase text-primary tracking-widest">
                  {listing.category}
                </span>
                {listing.deliveryAvailable && (
                  <span className="bg-green-100 text-green-700 py-1.5 px-4 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <FiCheckCircle /> Delivery Available
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
                {listing.title}
              </h1>
              
              <div className="flex items-center gap-6 text-gray-500 font-bold mb-8">
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-primary" />
                  <span>{listing.location?.city}, {listing.location?.state}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiUsers className="text-primary" />
                  <span>{listing.views || 0} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiStar className="text-yellow-400 fill-yellow-400" />
                  <span>{listing.ratings?.average?.toFixed(1)} Rating</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-8">
                <h3 className="text-xl font-black mb-4">Product Overview</h3>
                <p className="text-gray-500 leading-relaxed text-lg font-medium">
                  {listing.description}
                </p>
              </div>

              {/* Amenities Grid */}
              <div className="mt-10 pt-10 border-t border-gray-100">
                <h3 className="text-xl font-black mb-6">Features & Amenities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {listing.amenities?.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl group hover:bg-primary transition-colors">
                      <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-primary group-hover:bg-white transition-colors">
                        <FiCheckCircle />
                      </div>
                      <span className="font-bold text-gray-700 group-hover:text-white transition-colors">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black">Community Reviews</h2>
                <div className="flex items-center gap-2 text-primary font-black">
                  <FiStar className="fill-primary" /> {listing.ratings?.average?.toFixed(1)} / 5.0
                </div>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-8">
                  {reviews.map((review) => (
                    <div key={review._id} className="p-6 bg-gray-50 rounded-[2rem]">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                          {review.reviewer?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-gray-900">{review.reviewer?.name}</p>
                          <p className="text-xs text-gray-400 font-bold uppercase">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="ml-auto flex items-center gap-1 text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <FiStar key={i} className={i < review.rating ? "fill-yellow-400" : "text-gray-200"} size={14} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 font-medium">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 opacity-40">
                  <div className="text-4xl mb-2">💬</div>
                  <p className="font-bold">No reviews for this item yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Reservation Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass p-8 rounded-[2.5rem] shadow-2xl shadow-purple-500/10 sticky top-32">
              <div className="flex items-end gap-1 mb-8">
                <span className="text-4xl font-extrabold text-gray-900 leading-none italic">₹{listing.pricePerDay}</span>
                <span className="text-gray-400 font-bold uppercase text-xs">/ Day</span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="relative">
                  <label className="text-[10px] font-black uppercase text-primary tracking-widest absolute -top-2 left-4 bg-white px-2 py-0.5 rounded-full border border-gray-100 z-10">Start Date</label>
                  <div className="flex items-center gap-2 bg-white p-4 rounded-2xl border border-gray-200 focus-within:border-primary transition-all">
                    <FiCalendar className="text-gray-400" />
                    <input 
                      type="date" 
                      className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-700"
                      value={startDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="text-[10px] font-black uppercase text-primary tracking-widest absolute -top-2 left-4 bg-white px-2 py-0.5 rounded-full border border-gray-100 z-10">End Date</label>
                  <div className="flex items-center gap-2 bg-white p-4 rounded-2xl border border-gray-200 focus-within:border-primary transition-all">
                    <FiCalendar className="text-gray-400" />
                    <input 
                      type="date" 
                      className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-700"
                      value={endDate}
                      min={startDate || new Date().toISOString().split("T")[0]}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {totalDays > 0 && (
                <div className="bg-white/50 rounded-2xl p-6 mb-8 space-y-3 border border-white">
                  <div className="flex justify-between text-sm font-bold text-gray-500">
                    <span>Base Fare (₹{listing.pricePerDay} × {totalDays}d)</span>
                    <span className="text-gray-900">₹{totalPrice}</span>
                  </div>
                  {listing.deposit > 0 && (
                    <div className="flex justify-between text-sm font-bold text-gray-500">
                      <span>Refundable Deposit</span>
                      <span className="text-gray-900">₹{listing.deposit}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="font-black text-gray-900">Total Due</span>
                    <span className="text-2xl font-black text-primary">₹{totalPrice + (listing.deposit || 0)}</span>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <button
                  onClick={handleBooking}
                  className="w-full btn-primary py-4 text-lg font-black shadow-purple-500/30"
                >
                  Reserve Now
                </button>
                <button
                  onClick={handleMessage}
                  className="w-full flex items-center justify-center gap-2 font-bold text-gray-500 hover:text-primary transition-colors py-2"
                >
                  <FiMessageCircle /> Ask owner a question
                </button>
              </div>

              <div className="mt-8 flex items-start gap-3 p-4 bg-blue-50/50 rounded-2xl">
                <FiShield className="text-blue-500 flex-shrink-0 mt-1" />
                <p className="text-[10px] font-bold text-blue-700 leading-relaxed uppercase tracking-tight">
                  Protected by RentEase Guarantee. Your money is held securely until pickup is confirmed.
                </p>
              </div>
            </div>

            {/* Host Section */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h3 className="font-black mb-6">The Owner</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-2xl font-black text-white shadow-lg">
                  {listing.owner?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-black text-lg text-gray-900 leading-none mb-1">{listing.owner?.name}</p>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                    <FiStar className="text-yellow-400 fill-yellow-400" /> 
                    {listing.owner?.ratings?.average?.toFixed(1) || "New Host"}
                  </div>
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6">
                {listing.owner?.bio || "Experienced owner sharing quality items with the community since 2024."}
              </p>
              <button className="w-full py-3 rounded-xl border border-gray-100 text-sm font-black hover:bg-gray-50 transition-colors">
                View Full Inventory
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ListingDetail;