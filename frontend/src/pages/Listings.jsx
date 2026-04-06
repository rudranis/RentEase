import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ListingCard from "../components/ListingCard";
import FilterSidebar from "../components/FilterSidebar";
import SkeletonLoader from "../components/SkeletonLoader";
import api from "../api/axios";
import toast from "react-hot-toast";
import { setListings, setPagination } from "../features/listings/listingsSlice";

export default function Listings() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { listings, filters, pagination, isLoading } = useSelector(
    (state) => state.listings,
  );
  const [pageNum, setPageNum] = useState(1);

  useEffect(() => {
    fetchListings();
  }, [searchParams, filters, pageNum]);

  const fetchListings = async () => {
    try {
      const params = {
        page: pageNum,
        limit: 12,
        category: filters.category,
        city: filters.city,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        deliveryAvailable: filters.deliveryAvailable,
        search: searchParams.get("search") || "",
      };

      const res = await api.get("/listings", { params });
      dispatch(setListings(res.data.listings));
      dispatch(setPagination(res.data.pagination));
    } catch (error) {
      toast.error("Failed to load listings");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-dark">Browse Listings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <FilterSidebar />

          {/* Listings Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array(6)
                  .fill(0)
                  .map((_, i) => <SkeletonLoader key={i} />)
              ) : listings.length > 0 ? (
                listings.map((listing) => (
                  <ListingCard key={listing._id} listing={listing} />
                ))
              ) : (
                <div className="col-span-full rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
                  No listings found.
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setPageNum(page)}
                      className={`px-4 py-2 rounded-lg transition ${
                        page === pageNum
                          ? "bg-primary text-white"
                          : "bg-white border border-gray-300 hover:border-primary"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
