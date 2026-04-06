import React from "react";
import { useNavigate } from "react-router-dom";

const EditListing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Edit Listing</h1>
        <div className="bg-white rounded-lg shadow p-8">
          <p className="text-gray-600">
            Edit listing functionality coming soon. For now, please delete and
            recreate the listing.
          </p>
          <button
            onClick={() => navigate("/my-listings")}
            className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Back to My Listings
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditListing;
