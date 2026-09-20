'use client';

import React from 'react';
import './ProductOption.css';

export default function ProductOptions({
  colors,
  selectedColor,
  setSelectedColor,
  sizes,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
}) {
  const handleQuantityChange = (type) => {
    if (type === 'inc') setQuantity((prev) => prev + 1);
    if (type === 'dec' && quantity > 1) setQuantity((prev) => prev - 1);
  };

  return (
    <div className="product-options">
      {/* Color Selection */}
      <div className="option-section">
        <label className="option-label">
          Color: <span>{selectedColor}</span>
        </label>
        <div className="color-options">
          {colors.map((c) => (
            <button
              key={c.name}
              className={`color-circle ${selectedColor === c.name ? 'active' : ''}`}
              style={{ backgroundColor: c.hex }}
              onClick={() => setSelectedColor(c.name)}
            />
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div className="option-section">
        <div className="size-header">
          <label className="option-label">Size:</label>
          <button className="size-guide-btn">Size Guide</button>
        </div>
        <div className="size-options">
          {sizes.map((sz) => (
            <button
              key={sz}
              className={`size-box ${selectedSize === sz ? 'active' : ''}`}
              onClick={() => setSelectedSize(sz)}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="option-section">
        <div className="quantity-selector">
          <button onClick={() => handleQuantityChange('dec')}>-</button>
          <span>{quantity}</span>
          <button onClick={() => handleQuantityChange('inc')}>+</button>
        </div>
      </div>
    </div>
  );
}