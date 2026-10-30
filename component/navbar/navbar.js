"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  getCartSnapshot,
  getServerCartSnapshot,
  subscribeToCart,
} from "@/data/cartStore";
import {
  getServerWishlistSnapshot,
  getWishlistSnapshot,
  subscribeToWishlist,
} from "@/data/wishlistStore";
import "./navbar.css";

import {
  FaTruck,
  FaSearch,
  FaUser,
  FaHeart,
  FaShoppingCart,
  FaBars,
  FaTimes,
} from "react-icons/fa";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cart = JSON.parse(
    useSyncExternalStore(subscribeToCart, getCartSnapshot, getServerCartSnapshot)
  );
  const wishlist = JSON.parse(
    useSyncExternalStore(
      subscribeToWishlist,
      getWishlistSnapshot,
      getServerWishlistSnapshot
    )
  );
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      {/* Top Shipping Bar */}
      <div className="shipping-bar">
        <FaTruck className="shipping-icon" />
        Free Shipping on all orders above Rs. 5000
      </div>

      <nav className="navbar">
        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Logo */}
        <Link href="/" className="logo">
          UnStage<span>✦</span>
        </Link>

        {/* Search */}
        <form action="/shop" method="get" className="search-box">
          <input
            type="text"
            name="search"
            placeholder="Search for outfits, categories..."
            aria-label="Search products"
          />

          <button
            type="submit"
            aria-label="Search products"
          >
            <FaSearch />
          </button>
        </form>

        {/* Right Icons */}
        <div className="nav-actions">

          <Link href="/orderTracking" className="track-order">
            Track Order
          </Link>

          <Link href="/login" className="nav-icon" aria-label="Account">
            <FaUser />
          </Link>

          <Link
            href="/wishlist"
            className="nav-icon nav-icon-with-count"
            aria-label={`Wishlist, ${wishlist.length} items`}
          >
            <FaHeart />
            <span className="nav-count">{wishlist.length}</span>
          </Link>

          <Link
            href="/cart"
            className="nav-icon nav-icon-with-count"
            aria-label={`Cart, ${cartCount} items`}
          >
            <FaShoppingCart />
            <span className="nav-count">{cartCount}</span>
          </Link>

        </div>
      </nav>

      {/* Navigation Links */}
      {isMenuOpen && (
        <button
          type="button"
          className="mobile-menu-backdrop"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close navigation menu"
        />
      )}
      <div
        className={`nav-links ${isMenuOpen ? "open" : ""}`}
        id="primary-navigation"
      >
        <Link
          href="/"
          className="mobile-drawer-logo"
          onClick={() => setIsMenuOpen(false)}
        >
          UnStage<span>✦</span>
        </Link>
        <Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
        <Link href="/shop" onClick={() => setIsMenuOpen(false)}>Shop</Link>
        <Link href="/customStitch" onClick={() => setIsMenuOpen(false)}>Custom Stitch</Link>
        <Link href="/howItWork" onClick={() => setIsMenuOpen(false)}>How It Works</Link>
        <Link href="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link>
        <Link href="/contect" onClick={() => setIsMenuOpen(false)}>Contact</Link>
      </div>
    </>
  );
}

export default Navbar;