'use client';

import React, { useState } from 'react';
import { ShoppingBag, Heart } from 'lucide-react';
import './ActionButton.css';

export default function ActionButtons({ onAddToCart, onBuyNow, onWishlist }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlistClick = () => {
    setIsWishlisted(!isWishlisted);
    if (onWishlist) onWishlist(!isWishlisted);
  };

  return (
    <div className="action-buttons">
      <button className="btn-add-cart" onClick={onAddToCart}>
        <ShoppingBag size={18} /> Add to Cart
      </button>
      <button className="btn-buy-now" onClick={onBuyNow}>
        Buy Now
      </button>
      <button
        className={`btn-wishlist ${isWishlisted ? 'active' : ''}`}
        onClick={handleWishlistClick}
      >
        <Heart
          size={18}
          fill={isWishlisted ? '#d32f2f' : 'none'}
          color={isWishlisted ? '#d32f2f' : '#333'}
        />
        {isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
      </button>
    </div>
  );
}