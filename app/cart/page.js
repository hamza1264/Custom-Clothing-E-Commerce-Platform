'use client';

import { useSyncExternalStore } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  getCartSnapshot,
  getServerCartSnapshot,
  saveCart,
  subscribeToCart,
} from '@/data/cartStore';
import './cart.css';

export default function CartPage() {
  const cart = JSON.parse(
    useSyncExternalStore(subscribeToCart, getCartSnapshot, getServerCartSnapshot)
  );

  const updateCart = (nextCart) => {
    saveCart(nextCart);
  };

  const changeQuantity = (itemToUpdate, amount) => {
    const nextCart = cart
      .map((item) =>
        item.productId === itemToUpdate.productId &&
        item.size === itemToUpdate.size &&
        item.color === itemToUpdate.color
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      );
    updateCart(nextCart);
  };

  const removeItem = (itemToRemove) => {
    const nextCart = cart.filter(
      (item) =>
        item.productId !== itemToRemove.productId ||
        item.size !== itemToRemove.size ||
        item.color !== itemToRemove.color
    );
    updateCart(nextCart);
  };

  if (cart.length === 0) {
    return (
      <main className="cart-page">
        <h1>Your Cart</h1>
        <p>Your cart is empty.</p>
        <Link href="/shop" className="cart-continue-shopping">Continue Shopping</Link>
      </main>
    );
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="cart-page">
      <h1>Your Cart</h1>
      <div className="cart-content">
        <div className="cart-items">
          {cart.map((item) => (
            <article
              className="cart-item"
              key={`${item.productId}-${item.size}-${item.color}`}
            >
              <Image
                src={item.image}
                alt={item.title}
                width={120}
                height={140}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h2>{item.title}</h2>
                <p>Size: {item.size} · Color: {item.color}</p>
                <p>Rs. {item.price.toLocaleString()}</p>
                <div className="cart-item-actions">
                  <div className="cart-quantity">
                    <button
                      type="button"
                      onClick={() => changeQuantity(item, -1)}
                      aria-label={`Decrease ${item.title} quantity`}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => changeQuantity(item, 1)}
                      aria-label={`Increase ${item.title} quantity`}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="cart-remove-button"
                    onClick={() => removeItem(item)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <strong className="cart-item-total">
                Rs. {(item.price * item.quantity).toLocaleString()}
              </strong>
            </article>
          ))}
        </div>
        <aside className="cart-summary">
          <h2>Order Summary</h2>
          <p>
            <span>Subtotal</span>
            <strong>Rs. {total.toLocaleString()}</strong>
          </p>
          <Link href="/shop" className="cart-continue-shopping">Continue Shopping</Link>
        </aside>
      </div>
    </main>
  );
}
