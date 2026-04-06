import React from "react";
import { Link } from "react-router-dom";
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiLayers } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="relative bg-white border-t border-gray-100 pb-16 pt-24 mt-20 overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -mb-48 -mr-48 pointer-events-none" />
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] -mt-32 -ml-32 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          {/* Brand Column */}
          <div className="md:col-span-4 lg:col-span-5">
            <Link to="/" className="flex items-center gap-3 mb-8 group">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                <FiLayers size={24} />
              </div>
              <span className="text-2xl font-black text-gray-900 tracking-tighter">RentEase</span>
            </Link>
            <p className="text-gray-500 font-bold max-w-sm leading-relaxed mb-10">
              The premium peer-to-peer marketplace. Redefining how we own and share everyday items through trust and quality.
            </p>
            <div className="flex gap-4">
              {[FiFacebook, FiTwitter, FiInstagram, FiLinkedin].map((Icon, idx) => (
                <Link key={idx} to="" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all shadow-sm">
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-8">Marketplace</h4>
              <ul className="space-y-4">
                <li><Link to="/listings" className="text-sm font-bold text-gray-600 hover:text-primary transition-colors">All Listings</Link></li>
                <li><Link to="/listings?category=electronics" className="text-sm font-bold text-gray-600 hover:text-primary transition-colors">Electronics</Link></li>
                <li><Link to="/listings?category=bike" className="text-sm font-bold text-gray-600 hover:text-primary transition-colors">Travel & Gear</Link></li>
                <li><Link to="/create-listing" className="text-sm font-bold text-primary hover:underline">Start Hosting</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-8">Community</h4>
              <ul className="space-y-4">
                <li><Link to="" className="text-sm font-bold text-gray-600 hover:text-primary transition-colors">How it Works</Link></li>
                <li><Link to="" className="text-sm font-bold text-gray-600 hover:text-primary transition-colors">Trust & Safety</Link></li>
                <li><Link to="" className="text-sm font-bold text-gray-600 hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link to="" className="text-sm font-bold text-gray-600 hover:text-primary transition-colors">Reviews</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-8">Legals</h4>
              <ul className="space-y-4">
                <li><Link to="" className="text-sm font-bold text-gray-600 hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link to="" className="text-sm font-bold text-gray-600 hover:text-primary transition-colors">Terms of Use</Link></li>
                <li><Link to="" className="text-sm font-bold text-gray-600 hover:text-primary transition-colors">Insurance</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest italic">
            Built with Excellence for Mumbai's Best.
          </p>
          <p className="text-xs font-bold text-gray-400">
            © 2024 RentEase Marketplace PVT LTD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
