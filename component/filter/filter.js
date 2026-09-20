import React from "react";
import "./filter.css";

function Filter() {
  return (
    <aside className="filter-sidebar">

      <div className="filter-header">
        <h2>Filters</h2>

        <button className="clear-filter">
          Clear All
        </button>
      </div>


      {/* Category */}
      <div className="filter-section">

        <h3>Category</h3>

        <label>
          <input type="checkbox" />
          Unstitched
        </label>

        <label>
          <input type="checkbox" />
          Stitched / Ready-Made
        </label>

        <label>
          <input type="checkbox" />
          Custom Design
        </label>

      </div>


      {/* Price */}
      <div className="filter-section">

        <h3>Price Range</h3>

        <div className="price-inputs">

          <input
            type="number"
            placeholder="Min"
          />

          <span>-</span>

          <input
            type="number"
            placeholder="Max"
          />

        </div>

      </div>


      {/* Size */}
      <div className="filter-section">

        <h3>Size</h3>

        <div className="size-options">

          <button>XS</button>
          <button>S</button>
          <button>M</button>
          <button>L</button>
          <button>XL</button>

        </div>

      </div>


      {/* Color */}
      <div className="filter-section">

        <h3>Color</h3>

        <label>
          <input type="checkbox" />
          Black
        </label>

        <label>
          <input type="checkbox" />
          White
        </label>

        <label>
          <input type="checkbox" />
          Pink
        </label>

        <label>
          <input type="checkbox" />
          Blue
        </label>

      </div>

    </aside>
  );
}

export default Filter;