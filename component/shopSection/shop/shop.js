"use client";

import React, { useState } from "react";
import "./shop.css";
import ProductCard from "@/component/productcard/productCard";
import Filter from "@/component/filter/filter";

function Shop({ searchTerm = '' }) {
  const [showMore, setShowMore] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    minPrice: '',
    maxPrice: '',
    sizes: [],
    colors: [],
  });
  const normalizedSearch = searchTerm.trim();
  const clearFilters = () => {
    setFilters({
      categories: [],
      minPrice: '',
      maxPrice: '',
      sizes: [],
      colors: [],
    });
  };

  return (
    <div className="shop-container">

      <div className="shop-layout">

        {/* Left Filter */}
        <div className="filter-container">
          <Filter filters={filters} onChange={setFilters} onClear={clearFilters} />
        </div>

        {/* Right Side */}
        <div className="products-area">
          {normalizedSearch && (
            <p className="search-results-message" aria-live="polite">
              {`Search results for "${normalizedSearch}"`}
            </p>
          )}

          {/* Products */}
          <div className="products-container">
            <ProductCard searchTerm={normalizedSearch} filters={filters} />
          </div>

          {/* Button - Products ke neeche */}
          <div className="load-more-container">
            <button
              className="load-more-btn"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? "Show Less" : "Load More Products"}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Shop;