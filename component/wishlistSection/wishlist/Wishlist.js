'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import './Wishlist.css';

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: "Embroidered Lawn Suit",
      price: 4500,
      description:
        "Beautiful embroidered lawn suit made with premium quality fabric.",
      image: "/category/femail01.jpg",
    },
    {
      id: 2,
      name: "Silk Party Dress",
      price: 6500,
      description:
        "Elegant silk party dress with beautiful detailing for special occasions.",
      image: "/category/femail02.jpg",
    },
    {
      id: 3,
      name: "Printed Lawn Dress",
      price: 3200,
      description:
        "Comfortable printed lawn dress with a stylish and modern design.",
      image: "/category/femail03.jpg",
    },
  ]);

  const handleRemove = (id) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
  };

  const handleMoveToCart = (item) => {
    console.log('Moved to cart:', item);
  };

  return (
    <div className="wishlist-container">
      <h2 className="wishlist-heading">
        My Wishlist ({wishlistItems.length})
      </h2>

      <div className="wishlist-list">
        {wishlistItems.length === 0 ? (
          <p className="wishlist-empty">Your wishlist is empty.</p>
        ) : (
          wishlistItems.map((item) => (
            <div key={item.id} className="wishlist-card">
              <div className="wishlist-left">
                <div className="wishlist-image-wrapper">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={70}
                    height={85}
                    className="wishlist-image"
                  />
                </div>
                <div className="wishlist-details">
                  <h4 className="wishlist-title">{item.name}</h4>
                  <p className="wishlist-price">PKR {item.price.toLocaleString()}</p>
                </div>
              </div>

              <div className="wishlist-actions">
                <button
                  className="btn-move-cart"
                  onClick={() => handleMoveToCart(item)}
                >
                  <ShoppingBag size={16} />
                  Move to Cart
                </button>
                <button
                  className="btn-remove"
                  onClick={() => handleRemove(item.id)}
                  title="Remove item"
                >
                  ❤️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}