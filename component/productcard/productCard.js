"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  getServerWishlistSnapshot,
  getWishlistSnapshot,
  saveWishlist,
  subscribeToWishlist,
} from "@/data/wishlistStore";
import "./productCard.css";

function ProductCard({ limit, searchTerm = "", filters }) {
  const [products, setProducts] = useState([]);
  const [catalogError, setCatalogError] = useState("");
  const wishlist = JSON.parse(
    useSyncExternalStore(
      subscribeToWishlist,
      getWishlistSnapshot,
      getServerWishlistSnapshot
    )
  );

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      const response = await fetch("/api/products", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Could not load products.");
      }
      if (active) setProducts(result.products);
    }

    loadProducts().catch((error) => {
      if (active) setCatalogError(error.message);
    });

    return () => {
      active = false;
    };
  }, []);

  const toggleWishlist = (product) => {
    const isSaved = wishlist.some((item) => String(item.id) === product.id);
    const nextWishlist = isSaved
      ? wishlist.filter((item) => String(item.id) !== product.id)
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
      const matchesMinPrice = minPrice === "" || product.price >= Number(minPrice);
      const matchesMaxPrice = maxPrice === "" || product.price <= Number(maxPrice);
      const matchesSize =
        sizes.length === 0 || sizes.some((size) => product.sizes.includes(size));
      const matchesColor =
        colors.length === 0 ||
        colors.some((color) => product.colors.some((item) => item.name === color));

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
    if (catalogError) {
      return <p className="no-products-found" role="alert">{catalogError}</p>;
    }
    if (products.length === 0) {
      return <p className="no-products-found" role="status">Loading products...</p>;
    }
    return <p className="no-products-found">No products found for “{searchTerm}”.</p>;
  }

  return (
    <>
      {visibleProducts.map((product) => {
        const isSaved = wishlist.some(
          (item) => String(item.id) === product.id
        );

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
