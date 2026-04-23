import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch, FiArrowRight, FiRefreshCw, FiZap,
  FiShield, FiHeart, FiStar, FiUsers, FiPackage
} from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ListingCard from "../components/ListingCard";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedListings();
  }, []);

  const fetchFeaturedListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/listings?limit=6");
      setFeaturedListings(res.data.listings || []);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to load listings";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    navigate(`/listings?search=${encodeURIComponent(searchQuery)}`);
  };

  const categories = [
    { name: "Apartment", icon: "🏠", color: "from-blue-400 to-blue-600", query: "apartment" },
    { name: "Bike", icon: "🏍️", color: "from-orange-400 to-orange-600", query: "bike" },
    { name: "Car", icon: "🚗", color: "from-red-400 to-red-600", query: "car" },
    { name: "Tools", icon: "🔧", color: "from-gray-500 to-gray-700", query: "tools" },
    { name: "Electronics", icon: "💻", color: "from-purple-400 to-purple-600", query: "electronics" },
    { name: "Furniture", icon: "🪑", color: "from-amber-400 to-amber-600", query: "furniture" },
    { name: "Books", icon: "📚", color: "from-emerald-400 to-emerald-600", query: "books" },
    { name: "Sports", icon: "⚽", color: "from-sky-400 to-sky-600", query: "sports" },
  ];

  const stats = [
    { icon: <FiUsers />, value: "10,000+", label: "Active Users" },
    { icon: <FiPackage />, value: "5,000+", label: "Items Listed" },
    { icon: <FiStar />, value: "4.9/5", label: "Avg Rating" },
    { icon: <FiShield />, value: "100%", label: "Secure Payments" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-52 md:pb-36 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-15%] w-[45%] h-[60%] bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[50%] bg-blue-400/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-5%] left-[30%] w-[40%] h-[40%] bg-purple-300/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm shadow-md border border-primary/10 mb-10">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-black text-gray-600 tracking-widest uppercase">
              India's #1 Peer-to-Peer Rental Platform
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight text-gray-900 leading-none">
            Rent{" "}
            <span className="relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                Anything
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary to-blue-500 rounded-full opacity-30" />
            </span>
            <br />
            from <em className="not-italic text-gray-700">Anyone</em>.
          </h1>

          <p className="text-xl md:text-2xl text-gray-500 mb-14 max-w-2xl mx-auto leading-relaxed font-medium">
            Discover a community-driven marketplace. Get what you need without the commitment of ownership.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex gap-2 max-w-2xl mx-auto p-2.5 bg-white rounded-3xl shadow-2xl shadow-gray-200/80 border border-gray-100 mb-16"
          >
            <div className="flex-1 flex items-center px-4 gap-3">
              <FiSearch className="text-gray-400 flex-shrink-0" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cameras, bikes, furniture..."
                className="w-full bg-transparent border-none focus:ring-0 text-gray-700 placeholder-gray-400 font-bold py-2 text-lg"
              />
            </div>
            <button
              type="submit"
              className="bg-primary text-white font-black px-8 py-3 rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 text-sm"
            >
              Search
              <FiArrowRight />
            </button>
          </form>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  {stat.icon}
                </div>
                <div className="text-left">
                  <p className="font-black text-gray-900 text-lg leading-none">{stat.value}</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 max-w-4xl mx-auto">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => navigate(`/listings?category=${cat.query}`)}
                className="group flex flex-col items-center gap-2.5 p-3 bg-white rounded-2xl hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/10 border border-gray-50"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-xl shadow-md`}>
                  {cat.icon}
                </div>
                <span className="text-xs font-black text-gray-600 group-hover:text-primary transition-colors">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
              ✨ Handpicked For You
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
              Featured Listings
            </h2>
            <p className="text-gray-500 font-medium">Top-rated items from verified owners</p>
          </div>
          <button
            onClick={() => navigate("/listings")}
            className="flex items-center gap-2 font-black text-primary group bg-primary/5 px-5 py-2.5 rounded-xl hover:bg-primary/10 transition-all"
          >
            View All Items
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-96 bg-white rounded-[2rem] animate-pulse border border-gray-100" />
            ))
          ) : error ? (
            <div className="col-span-full bg-white p-12 text-center rounded-[2rem] border border-red-100">
              <p className="text-red-500 font-bold text-lg mb-6">{error}</p>
              <button onClick={fetchFeaturedListings} className="bg-primary text-white font-black px-8 py-3 rounded-xl hover:bg-primary/90 flex items-center gap-2 mx-auto">
                <FiRefreshCw /> Retry
              </button>
            </div>
          ) : featuredListings.length > 0 ? (
            featuredListings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))
          ) : (
            <div className="col-span-full bg-white p-20 text-center rounded-[2rem] border border-gray-100">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">📦</div>
              <p className="text-gray-400 font-bold text-xl mb-2">No listings yet</p>
              <p className="text-gray-400 mb-8 max-w-sm mx-auto">Be the first to share something with your community!</p>
              <button onClick={() => navigate("/create-listing")} className="bg-primary text-white font-black px-8 py-3 rounded-xl shadow-lg shadow-primary/20">
                Create First Listing
              </button>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-24 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
              Simple Process
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">How RentEase Works</h2>
            <p className="text-gray-500 font-medium max-w-md mx-auto">Three simple steps to rent anything you need</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            <div className="hidden md:block absolute top-12 left-[25%] right-[25%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20" />
            {[
              { step: "01", icon: <FiSearch size={28} />, title: "Find Your Item", desc: "Browse thousands of listings across categories. Filter by location, price, and more." },
              { step: "02", icon: <FiShield size={28} />, title: "Book Securely", desc: "Reserve your item with our secure OTP-verified booking system and Razorpay payments." },
              { step: "03", icon: <FiHeart size={28} />, title: "Enjoy & Return", desc: "Use the item, then return it. Your deposit is refunded after safe return." },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 rounded-2xl bg-primary/5 border-2 border-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 shadow-lg">
                    {item.icon}
                  </div>
                  <span className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-white rounded-xl flex items-center justify-center text-xs font-black shadow-lg">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Why Choose RentEase?</h2>
          <p className="text-gray-500 font-medium">The safest and most reliable rental platform in India</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <FiZap className="text-yellow-500" />, bg: "bg-yellow-50", title: "Instant Booking", desc: "No back-and-forth. Book in seconds with real-time availability and instant confirmation." },
            { icon: <FiShield className="text-blue-500" />, bg: "bg-blue-50", title: "Secure Payments", desc: "Razorpay-powered checkout. Your money stays safe until the rental is confirmed." },
            { icon: <FiHeart className="text-red-500" />, bg: "bg-red-50", title: "Verified Community", desc: "Real reviews and verified profiles ensure a trustworthy experience every time." },
          ].map((item, i) => (
            <div key={i} className={`${item.bg} rounded-[2rem] p-8 group hover:-translate-y-2 transition-all duration-300`}>
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-r from-primary via-purple-600 to-blue-600 p-12 md:p-20 text-center">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-40 -mt-40" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl -ml-40 -mb-40" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-xs font-black uppercase tracking-widest mb-8 border border-white/20">
              🚀 Join 10,000+ Happy Users
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-tight">
              Start earning from <br /> your idle items today.
            </h2>
            <p className="text-white/70 font-medium text-lg mb-10 max-w-md mx-auto">
              Turn unused items into income. List for free, earn instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/register")}
                className="bg-white text-primary font-black py-4 px-10 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20 text-lg"
              >
                Join for Free →
              </button>
              <button
                onClick={() => navigate("/listings")}
                className="bg-white/10 text-white font-black py-4 px-10 rounded-2xl border-2 border-white/20 hover:bg-white/20 transition-all text-lg"
              >
                Browse Items
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}