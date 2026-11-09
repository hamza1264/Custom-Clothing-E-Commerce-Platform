"use client";

import React, { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import "./shop.css";
import ProductCard from "@/component/productcard/productCard";
import Filter from "@/component/filter/filter";

const SHOP_CATEGORIES = ["Unstitched", "Stitched / Ready-Made"];

function Shop({ searchTerm = '', categoryTerm = '' }) {
  const [showMore, setShowMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    categories: SHOP_CATEGORIES.includes(categoryTerm) ? [categoryTerm] : [],
    minPrice: '',
    maxPrice: '',
    sizes: [],
  });
  const normalizedSearch = searchTerm.trim();

  const clearFilters = () => {
    setFilters({
      categories: [],
      minPrice: '',
      maxPrice: '',
      sizes: [],
    });
  };

  useEffect(() => {
    if (!showFilters) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setShowFilters(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    document.body.classList.add("filter-drawer-open");

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.classList.remove("filter-drawer-open");
    };
  }, [showFilters]);

  return (
    <div className="shop-container">

      <div className="shop-layout">

        {/* Left Filter */}
        <div className="filter-container">
          <button
            type="button"
            className="mobile-filter-toggle"
            aria-expanded={showFilters}
            aria-controls="shop-filters"
            onClick={() => setShowFilters((isOpen) => !isOpen)}
          >
            <SlidersHorizontal aria-hidden="true" />
            Filters
          </button>
          <div
            className={`mobile-filter-backdrop ${showFilters ? "is-open" : ""}`}
            onClick={() => setShowFilters(false)}
            aria-hidden="true"
          />
          <div
            id="shop-filters"
            className={`filter-content ${showFilters ? "is-open" : ""}`}
          >
            <Filter
              filters={filters}
              onChange={setFilters}
              onClear={clearFilters}
              onClose={() => setShowFilters(false)}
            />
          </div>
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