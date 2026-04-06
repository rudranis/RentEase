import React from "react";
import { FiStar, FiCheck } from "react-icons/fi";

export default function StarRating({ rating, setRating, interactive = true }) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => interactive && setRating(star)}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          <FiStar
            className={`text-2xl transition ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
