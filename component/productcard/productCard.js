"use client";

import React, { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  getServerWishlistSnapshot,
  getWishlistSnapshot,
  saveWishlist,
  subscribeToWishlist,
} from "@/data/wishlistStore";
import "./productCard.css";

function ProductCard({ limit, searchTerm = '', filters }) {
  const wishlist = JSON.parse(
    useSyncExternalStore(
      subscribeToWishlist,
      getWishlistSnapshot,
      getServerWishlistSnapshot
    )
  );

  const products = [
    {
      id: 1,
      name: "Embroidered Lawn Suit",
      price: 4500,
      description:
        "Beautiful embroidered lawn suit made with premium quality fabric.",
      image: "/category/femail01.jpg",
      category: "Unstitched",
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Blue", "Pink"],
    },
    {
      id: 2,
      name: "Silk Party Dress",
      price: 6500,
      description:
        "Elegant silk party dress with beautiful detailing for special occasions.",
      image: "/category/femail02.jpg",
      category: "Unstitched",
      sizes: ["S", "M", "L"],
      colors: ["Pink"],
    },
    {
      id: 3,
      name: "Printed Lawn Dress",
      price: 3200,
      description:
        "Comfortable printed lawn dress with a stylish and modern design.",
      image: "/category/femail03.jpg",
      category: "Unstitched",
      sizes: ["M", "L"],
      colors: ["Blue"],
    },
    {
      id: 4,
      name: "Cotton Casual Suit",
      price: 3800,
      description:
        "Soft cotton casual suit perfect for everyday wear and summer days.",
      image: "/category/femail04.jpg",
      category: "Stitched / Ready-Made",
      sizes: ["S", "M", "L", "XL"],
      colors: ["White"],
    },
    {
      id: 5,
      name: "Chiffon Formal Dress",
      price: 7200,
      description:
        "Premium chiffon formal dress designed for weddings and special events.",
      image: "/category/femail05.jpg",
      category: "Stitched / Ready-Made",
      sizes: ["S", "M", "L"],
      colors: ["Pink"],
    },
    {
      id: 6,
      name: "Velvet Winter Suit",
      price: 8500,
      description:
        "Luxury velvet winter suit with a comfortable fabric and elegant look.",
      image: "/category/femail01.jpg",
      category: "Stitched / Ready-Made",
      sizes: ["M", "L", "XL"],
      colors: ["Black"],
    },


  ];

  const toggleWishlist = (product) => {
    const isSaved = wishlist.some((item) => item.id === product.id);
    const nextWishlist = isSaved
      ? wishlist.filter((item) => item.id !== product.id)
      : [
          ...wishlist,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.image,
          },
        ];

    saveWishlist(nextWishlist);
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const visibleProducts = products
    .filter((product) => product.name.toLowerCase().includes(normalizedSearch))
    .filter((product) => {
      if (!filters) return true;

      const { categories, minPrice, maxPrice, sizes, colors } = filters;
      const matchesCategory =
        categories.length === 0 || categories.includes(product.category);
      const matchesMinPrice = minPrice === '' || product.price >= Number(minPrice);
      const matchesMaxPrice = maxPrice === '' || product.price <= Number(maxPrice);
      const matchesSize =
        sizes.length === 0 || sizes.some((size) => product.sizes.includes(size));
      const matchesColor =
        colors.length === 0 || colors.some((color) => product.colors.includes(color));

      return (
        matchesCategory &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesSize &&
        matchesColor
      );
    })
    .slice(0, limit ?? products.length);

  if (visibleProducts.length === 0) {
    return <p className="no-products-found">No products found for “{searchTerm}”.</p>;
  }

  return (
    <>
      {visibleProducts.map((product) => {
        const isSaved = wishlist.some((item) => item.id === product.id);

        return (
        <div className="product-card" key={product.id}>
          <div className="product-image">
            <img src={product.image} alt={product.name} />
            <button
              type="button"
              className={`product-wishlist-button ${isSaved ? "is-saved" : ""}`}
              onClick={() => toggleWishlist(product)}
              aria-label={isSaved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
              aria-pressed={isSaved}
            >
              <span aria-hidden="true">❤️</span>
            </button>
          </div>

          <div className="product-info">
            <h3>{product.name}</h3>
            <p className="product-description">{product.description}</p>
            <div className="product-bottom">
              <span className="product-price">Rs. {product.price}</span>
              <Link
                className="add-cart-btn"
                href={`/detailPage/${product.id}`}
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
        );
      })}
    </>
  );
}

export default ProductCard;