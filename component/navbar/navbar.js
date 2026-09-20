"use client";

import React from "react";
import Link from "next/link";
import "./navbar.css";

import {
  FaTruck,
  FaSearch,
  FaUser,
  FaHeart,
  FaShoppingCart,
} from "react-icons/fa";

function Navbar() {
  return (
    <>
      {/* Top Shipping Bar */}
      <div className="shipping-bar">
        <FaTruck className="shipping-icon" />
        Free Shipping on all orders above Rs. 5000
      </div>

      <nav className="navbar">

        {/* Logo */}
        <Link href="/" className="logo">
          UnStage<span>✦</span>
        </Link>

        {/* Search */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search for outfits, categories..."
          />

          <button aria-label="Search">
            <FaSearch />
          </button>
        </div>

        {/* Right Icons */}
        <div className="nav-actions">

          <Link href="/orderTracking" className="track-order">
            Track Order
          </Link>

          <Link href="/login" className="nav-icon" aria-label="Account">
            <FaUser />
          </Link>

          <Link href="/wishlist" className="nav-icon" aria-label="Wishlist">
            <FaHeart />
          </Link>

          <Link href="/cart" className="nav-icon" aria-label="Cart">
            <FaShoppingCart />
          </Link>

        </div>
      </nav>

      {/* Navigation Links */}
      <div className="nav-links">
        <Link href="/">Home</Link>
        <Link href="/shop">Shop</Link>
        <Link href="/customStitch">Custom Stitch</Link>
        <Link href="/howItWork">How It Works</Link>
        <Link href="/about">About Us</Link>
        <Link href="/contect">Contact</Link>
      </div>
    </>
  );
}

export default Navbar;