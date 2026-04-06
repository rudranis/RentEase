import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiArrowRight, FiRefreshCw, FiZap, FiShield, FiHeart } from "react-icons/fi";
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
    { name: "Apartment", icon: "🏠", color: "bg-blue-500" },
    { name: "Bike", icon: "🏍️", color: "bg-orange-500" },
    { name: "Car", icon: "🚗", color: "bg-red-500" },
    { name: "Tools", icon: "🔧", color: "bg-gray-600" },
    { name: "Electronics", icon: "💻", color: "bg-purple-600" },
    { name: "Furniture", icon: "🪑", color: "bg-amber-700" },
    { name: "Books", icon: "📚", color: "bg-emerald-600" },
    { name: "Sports", icon: "⚽", color: "bg-sky-500" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/40 rounded-full blur-[120px] animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-gray-100 mb-8 animate-float">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            <span className="text-sm font-bold text-gray-600 tracking-wide uppercase">The Future of Renting</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-gray-900">
            Rent <span className="gradient-text">Anything</span> <br /> 
            from <span className="underline decoration-blue-500/30">Anyone</span>.
          </h1>
          
          <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Discover a world of possibilities. From high-end gear to everyday essentials, 
            get what you need without the commitment of ownership.
          </p>

          {/* Premium Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex gap-2 max-w-2xl mx-auto p-2 glass rounded-2xl shadow-2xl shadow-purple-500/10 mb-16"
          >
            <div className="flex-1 flex items-center px-4">
              <FiSearch className="text-gray-400 mr-2" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What are you looking for today?"
                className="w-full bg-transparent border-none focus:ring-0 text-gray-700 placeholder-gray-400 font-medium py-3"
              />
            </div>
            <button
              type="submit"
              className="btn-primary flex items-center gap-2"
            >
              Search Now
            </button>
          </form>

          {/* Animated Categories */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 max-w-6xl mx-auto">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => navigate(`/listings?category=${cat.name.toLowerCase()}`)}
                className="group flex flex-col items-center gap-3 p-4 bg-white rounded-2xl hover:bg-primary transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-purple-500/20"
              >
                <div className={`w-12 h-12 rounded-xl ${cat.color} bg-opacity-10 group-hover:bg-opacity-100 flex items-center justify-center text-2xl transition-all duration-300 group-hover:scale-110`}>
                  {cat.icon}
                </div>
                <span className="text-sm font-bold text-gray-600 group-hover:text-white transition-colors">
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
            <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
              Featured Listings
            </h2>
            <p className="text-gray-500 font-medium">Handpicked items from our trusted community</p>
          </div>
          <button
            onClick={() => navigate("/listings")}
            className="flex items-center gap-2 font-bold text-primary group"
          >
            Explore all items <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 glass rounded-2xl animate-pulse" />
              ))}
            </>
          ) : error ? (
            <div className="col-span-full glass border-red-100 p-12 text-center rounded-3xl">
              <p className="text-red-500 font-bold text-lg mb-6">{error}</p>
              <button
                onClick={fetchFeaturedListings}
                className="btn-primary bg-red-500 shadow-red-500/20"
              >
                <FiRefreshCw className="inline mr-2" /> Try Again
              </button>
            </div>
          ) : featuredListings.length > 0 ? (
            featuredListings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))
          ) : (
            <div className="col-span-full glass p-20 text-center rounded-3xl">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">📦</div>
              <p className="text-gray-400 font-bold text-xl mb-2">No listings yet</p>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">Be the first to share something amazing with your neighborhood!</p>
              <button
                onClick={() => navigate("/create-listing")}
                className="btn-primary"
              >
                Create Listing
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-white py-24 mb-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Why RentEase?</h2>
            <p className="text-gray-500 font-medium">Building the safest marketplace for everyone</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <FiZap className="text-yellow-500" />,
                title: "Instant Booking",
                desc: "No back-and-forth. Find what you need and book it in seconds with real-time updates."
              },
              {
                icon: <FiShield className="text-blue-500" />,
                title: "Secure Payments",
                desc: "Your money is safe with us. We hold payments until the rental is successfully completed."
              },
              {
                icon: <FiHeart className="text-red-500" />,
                title: "Verified Community",
                desc: "Real reviews and verified profiles ensure a trustworthy experience for every member."
              }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl mb-6 group-hover:bg-primary/5 group-hover:scale-110 transition-all">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="relative rounded-[2.5rem] overflow-hidden bg-primary p-12 md:p-20 text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -ml-32 -mb-32" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
              Start your rental <br /> journey today.
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/register")}
                className="bg-white text-primary font-black py-4 px-10 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
              >
                Join for Free
              </button>
              <button
                onClick={() => navigate("/listings")}
                className="bg-primary-foreground/10 text-white font-bold py-4 px-10 rounded-2xl border-2 border-white/20 hover:bg-white/10 transition-all"
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
