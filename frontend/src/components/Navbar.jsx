import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { FiMenu, FiX, FiMessageCircle, FiUser, FiLogOut, FiPlusCircle } from "react-icons/fi";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications || { unreadCount: 0 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "py-2 px-4" : "py-4 px-4"
    }`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-2xl transition-all duration-300 ${
        scrolled ? "glass shadow-xl py-2" : "bg-transparent py-2"
      }`}>
        <div className="flex justify-between items-center h-12 md:h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-purple-500/30 transform group-hover:rotate-12 transition-transform">
              R
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-900">
              Rent<span className="text-primary">Ease</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-1 items-center">
            <Link
              to="/listings"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive("/listings") 
                ? "bg-primary/10 text-primary" 
                : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Browse
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/create-listing"
                  className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                    isActive("/create-listing")
                    ? "bg-primary/10 text-primary"
                    : "text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <FiPlusCircle /> Post Item
                </Link>
                <Link
                  to="/my-listings"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive("/my-listings")
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Inventory
                </Link>
                <Link
                  to="/my-bookings"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive("/my-bookings")
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Bookings
                </Link>
                <Link to="/chat" className={`p-2 rounded-lg transition-all relative ${
                  scrolled ? "text-gray-600 hover:bg-gray-100" : "text-gray-600 hover:bg-gray-100"
                }`}>
                  <FiMessageCircle size={22} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold border-2 border-white">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* Auth Buttons */}
            <div className="ml-4 flex gap-2 items-center border-l border-gray-200 pl-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                      scrolled ? "bg-gray-100 text-gray-700" : "bg-white/10 text-white"
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold">{user?.name?.split(' ')[0]}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`p-2 rounded-lg transition-all ${
                      scrolled ? "text-gray-400 hover:text-red-500 hover:bg-red-50" : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                    title="Logout"
                  >
                    <FiLogOut size={20} />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                      scrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary"
                  >
                    Join Now
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 rounded-lg transition-all ${
              scrolled ? "text-gray-900 bg-gray-100" : "text-white bg-white/10"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 border-t border-gray-100 pt-4">
            <Link to="/listings" className="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-xl">
              Browse
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/create-listing"
                  className="block px-4 py-3 text-primary font-bold hover:bg-primary/5 rounded-xl"
                >
                  + Post Item
                </Link>
                <Link to="/my-listings" className="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-xl">
                  Inventory
                </Link>
                <Link to="/my-bookings" className="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-xl">
                  Bookings
                </Link>
                <Link to="/chat" className="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-xl">
                  Messages
                </Link>
              </>
            )}
            <div className="border-t border-gray-100 pt-4 mt-4 px-4 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="flex items-center gap-3 py-2 text-gray-800">
                    <FiUser /> Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl flex items-center justify-center gap-2"
                  >
                    <FiLogOut /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block text-center py-3 text-gray-700 font-bold border border-gray-200 rounded-xl">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block text-center py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-purple-500/30"
                  >
                    Join Now
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
