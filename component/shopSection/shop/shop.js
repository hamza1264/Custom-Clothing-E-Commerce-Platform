"use client";

import React, { useState } from "react";
import "./shop.css";
import ProductCard from "@/component/productcard/productCard";
import Filter from "@/component/filter/filter";

function Shop() {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="shop-container">

      <div className="shop-layout">

        {/* Left Filter */}
        <div className="filter-container">
          <Filter />
        </div>

        {/* Right Side */}
        <div className="products-area">

          {/* Products */}
          <div className="products-container">
            <ProductCard />
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