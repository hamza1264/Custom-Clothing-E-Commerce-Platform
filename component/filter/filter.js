import React from "react";
import "./filter.css";

const CATEGORIES = ["Unstitched", "Stitched / Ready-Made", "Custom Design"];
const COLORS = ["Black", "White", "Pink", "Blue"];
const SIZES = ["XS", "S", "M", "L", "XL"];

function Filter({ filters, onChange, onClear }) {
  const toggleValue = (key, value) => {
    const selected = filters[key];
    onChange({
      ...filters,
      [key]: selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    });
  };

  return (
    <aside className="filter-sidebar">

      <div className="filter-header">
        <h2>Filters</h2>

        <button type="button" className="clear-filter" onClick={onClear}>
          Clear All
        </button>
      </div>


      {/* Category */}
      <div className="filter-section">

        <h3>Category</h3>

        {CATEGORIES.map((category) => (
          <label key={category}>
            <input
              type="checkbox"
              checked={filters.categories.includes(category)}
              onChange={() => toggleValue("categories", category)}
            />
            {category}
          </label>
        ))}

      </div>


      {/* Price */}
      <div className="filter-section">

        <h3>Price Range</h3>

        <div className="price-inputs">

          <input
            type="number"
            placeholder="Min"
            min="0"
            aria-label="Minimum price"
            value={filters.minPrice}
            onChange={(event) => onChange({ ...filters, minPrice: event.target.value })}
          />

          <span>-</span>

          <input
            type="number"
            placeholder="Max"
            min="0"
            aria-label="Maximum price"
            value={filters.maxPrice}
            onChange={(event) => onChange({ ...filters, maxPrice: event.target.value })}
          />

        </div>

      </div>


      {/* Size */}
      <div className="filter-section">

        <h3>Size</h3>

        <div className="size-options">

          {SIZES.map((size) => (
            <button
              type="button"
              key={size}
              className={filters.sizes.includes(size) ? "selected" : ""}
              aria-pressed={filters.sizes.includes(size)}
              onClick={() => toggleValue("sizes", size)}
            >
              {size}
            </button>
          ))}

        </div>

      </div>


      {/* Color */}
      <div className="filter-section">

        <h3>Color</h3>

        {COLORS.map((color) => (
          <label key={color}>
            <input
              type="checkbox"
              checked={filters.colors.includes(color)}
              onChange={() => toggleValue("colors", color)}
            />
            {color}
          </label>
        ))}

      </div>

    </aside>
  );
}

export default Filter;