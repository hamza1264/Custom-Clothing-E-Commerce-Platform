'use client';

import React, { useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { getCartSnapshot, saveCart } from '@/data/cartStore';
import {
  getServerWishlistSnapshot,
  getWishlistSnapshot,
  saveWishlist,
  subscribeToWishlist,
} from '@/data/wishlistStore';
import './Wishlist.css';

export default function Wishlist() {
  const router = useRouter();
  const [error, setError] = useState('');
  const wishlistItems = JSON.parse(
    useSyncExternalStore(
      subscribeToWishlist,
      getWishlistSnapshot,
      getServerWishlistSnapshot
    )
  );

  const handleRemove = (id) => {
    saveWishlist(wishlistItems.filter((item) => String(item.id) !== String(id)));
  };

  const handleMoveToCart = async (item) => {
    setError('');
    try {
      const response = await fetch(
        `/api/products/${encodeURIComponent(String(item.id))}`,
        { cache: 'no-store' }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Could not load this product.');
      }

      const product = result.product;
      const cartItem = {
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        size: product.sizes[0],
        color: product.colors[0]?.name,
        quantity: 1,
      };
      const currentCart = JSON.parse(getCartSnapshot());
      const existingItem = currentCart.find(
        (cartEntry) =>
          String(cartEntry.productId) === cartItem.productId &&
          cartEntry.size === cartItem.size &&
          cartEntry.color === cartItem.color
      );

      if (existingItem) {
        existingItem.quantity += cartItem.quantity;
      } else {
        currentCart.push(cartItem);
      }

      saveCart(currentCart);
      saveWishlist(
        wishlistItems.filter(
          (wishlistItem) => String(wishlistItem.id) !== String(item.id)
        )
      );
      router.push('/cart');
    } catch (requestError) {
      setError(requestError.message || 'Could not move this product to your cart.');
    }
  };

  return (
    <div className="wishlist-container">
      <h2 className="wishlist-heading">
        My Wishlist ({wishlistItems.length})
      </h2>
      {error && <p role="alert">{error}</p>}

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
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}