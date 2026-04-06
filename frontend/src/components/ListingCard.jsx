import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMapPin, FiStar, FiTruck, FiHeart, FiArrowRight } from "react-icons/fi";

export default function ListingCard({ listing }) {
  if (!listing) return null;
  const [imageError, setImageError] = useState(false);
  const imageUrl = listing.images?.[0]?.trim();
  const showImage = !!imageUrl && !imageError;

  return (
    <Link
      to={`/listing/${listing._id}`}
      className="group bg-white rounded-[2rem] border border-gray-100 p-3 card-hover flex flex-col"
    >
      {/* Image Container */}
      <div className="relative h-64 w-full rounded-[1.5rem] overflow-hidden bg-gray-50">
        {showImage ? (
          <img
            src={imageUrl}
            alt={listing.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
            <span className="text-4xl mb-2">📸</span>
            <span className="text-sm font-semibold">No Preview</span>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 glass py-1.5 px-4 rounded-full text-xs font-black uppercase tracking-wider text-gray-800 shadow-sm">
          {listing.category}
        </div>

        {/* Favorite Button */}
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-white transition-all shadow-sm">
          <FiHeart size={18} />
        </button>

        {/* Delivery Badge */}
        {listing.deliveryAvailable && (
          <div className="absolute bottom-4 left-4 bg-green-500 text-white p-2 rounded-xl shadow-lg border border-white/20">
            <FiTruck size={14} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2 group-hover:text-primary transition-colors">
          <h3 className="font-extrabold text-xl line-clamp-1 flex-1 leading-tight">
            {listing.title}
          </h3>
          <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-600 px-2 py-1 rounded-lg text-xs font-bold">
            <FiStar className="fill-yellow-600" />
            {listing.ratings?.average || 0}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-4 font-medium">
          <FiMapPin className="text-primary" />
          <span className="line-clamp-1">{listing.location?.city}, {listing.location?.state || "India"}</span>
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-gray-50 pt-4">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Price per day</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-gray-900 italic">₹{listing.pricePerDay}</span>
              <span className="text-sm font-bold text-gray-400">/day</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all">
            <FiArrowRight size={20} />
          </div>
        </div>
      </div>
    </Link>
  );
}
