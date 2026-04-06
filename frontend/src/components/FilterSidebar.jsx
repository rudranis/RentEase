import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../features/listings/listingsSlice";

export default function FilterSidebar() {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.listings);

  const categories = [
    "apartment",
    "bike",
    "car",
    "tools",
    "electronics",
    "furniture",
    "books",
    "sports",
  ];

  const cities = ["Mumbai", "Bangalore", "Delhi", "Pune", "Hyderabad"];

  const handleCategoryChange = (category) => {
    dispatch(
      setFilters({ category: filters.category === category ? "" : category }),
    );
  };

  const handleCityChange = (city) => {
    dispatch(setFilters({ city: filters.city === city ? "" : city }));
  };

  const handlePriceChange = (minPrice, maxPrice) => {
    dispatch(setFilters({ minPrice, maxPrice }));
  };

  const handleDeliveryChange = () => {
    dispatch(setFilters({ deliveryAvailable: !filters.deliveryAvailable }));
  };

  return (
    <aside className="bg-white rounded-lg p-6 shadow-md h-fit">
      <h2 className="text-xl font-bold mb-6 text-dark">Filters</h2>

      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-dark mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.category === cat}
                onChange={() => handleCategoryChange(cat)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-gray-700 capitalize">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* City Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-dark mb-3">City</h3>
        <div className="space-y-2">
          {cities.map((city) => (
            <label
              key={city}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.city === city}
                onChange={() => handleCityChange(city)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-gray-700">{city}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="font-semibold text-dark mb-3">Price Range</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice === 0 ? "" : filters.minPrice}
            onChange={(e) =>
              handlePriceChange(
                e.target.value ? parseInt(e.target.value) : 0,
                filters.maxPrice,
              )
            }
            className="w-1/2 px-3 py-2 border border-gray-300 rounded text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice === Infinity ? "" : filters.maxPrice}
            onChange={(e) =>
              handlePriceChange(
                filters.minPrice,
                e.target.value ? parseInt(e.target.value) : Infinity,
              )
            }
            className="w-1/2 px-3 py-2 border border-gray-300 rounded text-sm"
          />
        </div>
      </div>

      {/* Delivery Filter */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.deliveryAvailable}
            onChange={handleDeliveryChange}
            className="w-4 h-4 cursor-pointer"
          />
          <span className="text-gray-700">Delivery Available</span>
        </label>
      </div>
    </aside>
  );
}
