"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  ChevronDown,
  Menu,
  Search,
  ShoppingCart,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import { getCartSnapshot, getServerCartSnapshot, subscribeToCart, } from "@/data/cartStore";
import {
  getServerWishlistSnapshot, getWishlistSnapshot, subscribeToWishlist,
} from "@/data/wishlistStore";
import LogoutButton from "@/component/auth/LogoutButton";
import "./navbar.css";

import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
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
        <Truck className="shipping-icon" />
        <span>Enjoy an Exclusive 25% OFF on All Your Favourite Styles, with Fast & Reliable Delivery Within 48 Hours! </span>
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
          {isMenuOpen ? <X /> : <Menu />}
        </button>

        {/* Logo */}
        <Link href="/" className="logo" aria-label="ILHAM COLLECTION home">
          <Image
            src="/ilham-collection-no-flower.png"
            alt="ILHAM COLLECTION"
            width={226}
            height={146}
            priority
          />
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
            <Search />
          </button>
        </form>

        {/* Right Icons */}
        <div className="nav-actions">

          <Link href="/orderTracking" className="track-order">
            Track Order
          </Link>

          <Link href="/login" className="nav-icon" aria-label="Account">
            <UserRound />
          </Link>

          <Link
            href="/wishlist"
            className="nav-icon nav-icon-with-count"
            aria-label={`Wishlist, ${wishlist.length} items`}
          >
            <Heart />
            <span className="nav-count">{wishlist.length}</span>
          </Link>

          <Link
            href="/cart"
            className="nav-icon nav-icon-with-count"
            aria-label={`Cart, ${cartCount} items`}
          >
            <ShoppingCart />
            <span className="nav-count">{cartCount}</span>
          </Link>

        </div>

        <div className="desktop-nav-links">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link href="/shop" onClick={() => setIsMenuOpen(false)}>Shop</Link>
          <div className="nav-category">
            <button
              type="button"
              className="category-toggle"
              aria-expanded={isCategoriesOpen}
              aria-controls="desktop-category-menu"
              onClick={() => setIsCategoriesOpen((isOpen) => !isOpen)}
            >
              Categories
              <ChevronDown aria-hidden="true" />
            </button>
            <div
              className={`category-menu desktop-category-menu ${isCategoriesOpen ? "is-open" : ""}`}
              id="desktop-category-menu"
              hidden={!isCategoriesOpen}
            >
              <Link
                href={{ pathname: "/shop", query: { category: "Unstitched" } }}
                onClick={() => setIsCategoriesOpen(false)}
              >
                Unstitched
              </Link>
              <Link
                href={{ pathname: "/shop", query: { category: "Stitched / Ready-Made" } }}
                onClick={() => setIsCategoriesOpen(false)}
              >
                Stitched / Ready-Made
              </Link>
            </div>
          </div>
          <Link href="/howItWork" onClick={() => setIsMenuOpen(false)}>How It Works</Link>
          <Link href="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link>
          <Link href="/contect" onClick={() => setIsMenuOpen(false)}>Contact</Link>
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
        <form action="/shop" method="get" className="mobile-drawer-search">
          <input
            type="text"
            name="search"
            placeholder="Search products"
            aria-label="Search products"
          />
          <button type="submit" aria-label="Search products">
            <Search />
          </button>
        </form>

        <section className="mobile-drawer-pages" aria-label="Pages">
          <div className="mobile-page-links">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="/shop" onClick={() => setIsMenuOpen(false)}>Shop</Link>
            <div className="mobile-category-group">
              <button
                type="button"
                className="category-toggle mobile-category-toggle"
                aria-expanded={isCategoriesOpen}
                aria-controls="mobile-category-menu"
                onClick={() => setIsCategoriesOpen((isOpen) => !isOpen)}
              >
                Categories
                <ChevronDown aria-hidden="true" />
              </button>
              <div
                className={`category-menu mobile-category-menu ${isCategoriesOpen ? "is-open" : ""}`}
                id="mobile-category-menu"
                hidden={!isCategoriesOpen}
              >
                <Link
                  href={{ pathname: "/shop", query: { category: "Unstitched" } }}
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsCategoriesOpen(false);
                  }}
                >
                  Unstitched
                </Link>
                <Link
                  href={{ pathname: "/shop", query: { category: "Stitched / Ready-Made" } }}
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsCategoriesOpen(false);
                  }}
                >
                  Stitched / Ready-Made
                </Link>
              </div>
            </div>
            <Link href="/howItWork" onClick={() => setIsMenuOpen(false)}>How It Works</Link>
            <Link href="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link>
            <Link href="/contect" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            <Link href="/orderTracking" onClick={() => setIsMenuOpen(false)}>Track Order</Link>
          </div>
        </section>

        <div className="mobile-drawer-auth">
          <Link href="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
          <Link href="/login?mode=signup" onClick={() => setIsMenuOpen(false)}>Sign up</Link>
        </div>

        <div className="mobile-drawer-socials" aria-label="Social media">
          <a
            href="https://www.facebook.com/share/19UX7knCGD/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="facebook"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://www.instagram.com/hamzaansari2985?igsh=MXQ"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="https://wa.me/923710313814"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="whatsapp"
          >
            <FaWhatsapp />
          </a>
        </div>

        <div className="mobile-drawer-logout">
          <LogoutButton onLoggedOut={() => setIsMenuOpen(false)} />
        </div>

      </div>
    </>
  );
}

export default Navbar;