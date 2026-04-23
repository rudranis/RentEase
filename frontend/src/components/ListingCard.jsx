import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMapPin, FiStar, FiTruck, FiHeart, FiArrowRight, FiEye } from "react-icons/fi";

export default function ListingCard({ listing }) {
  if (!listing) return null;
  const [imageError, setImageError] = useState(false);
  const [liked, setLiked] = useState(false);
  const imageUrl = listing.images?.[0]?.trim();
  const showImage = !!imageUrl && !imageError;

  return (
    <Link
      to={`/listing/${listing._id}`}
      className="group bg-white rounded-[2rem] border border-gray-100 p-3 flex flex-col hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-56 w-full rounded-[1.5rem] overflow-hidden bg-gray-50">
        {showImage ? (
          <img
            src={imageUrl}
            alt={listing.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
            <span className="text-5xl mb-2">📸</span>
            <span className="text-sm font-bold">No Image</span>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm py-1 px-3 rounded-full text-[10px] font-black uppercase tracking-wider text-gray-700 shadow-sm">
            {listing.category}
          </span>
        </div>

        {/* Like Button */}
        <button
          onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all ${
            liked ? "bg-red-500 text-white" : "bg-white/90 backdrop-blur-sm text-gray-500 hover:text-red-500"
          }`}
        >
          <FiHeart size={15} className={liked ? "fill-white" : ""} />
        </button>

        {/* Delivery Badge */}
        {listing.deliveryAvailable && (
          <div className="absolute bottom-3 left-3 bg-green-500 text-white text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
            <FiTruck size={10} />
            Delivery
          </div>
        )}

        {/* Rating Overlay */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm py-1 px-2 rounded-full flex items-center gap-1 shadow-sm">
          <FiStar size={11} className="text-yellow-500 fill-yellow-500" />
          <span className="text-[11px] font-black text-gray-800">
            {listing.ratings?.average?.toFixed(1) || "5.0"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-black text-lg text-gray-900 line-clamp-1 mb-1.5 group-hover:text-primary transition-colors">
          {listing.title}
        </h3>

        <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-auto font-medium">
          <FiMapPin size={13} className="text-primary flex-shrink-0" />
          <span className="line-clamp-1">{listing.location?.city}{listing.location?.state ? `, ${listing.location.state}` : ""}</span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4">
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Per Day</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-gray-900">₹{listing.pricePerDay?.toLocaleString("en-IN")}</span>
              <span className="text-xs font-bold text-gray-400">/day</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
              <FiEye size={13} />
              {listing.views || 0}
            </div>
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
              <FiArrowRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}