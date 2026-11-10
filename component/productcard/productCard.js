"use client";

import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import {
  getServerWishlistSnapshot,
  getWishlistSnapshot,
  saveWishlist,
  subscribeToWishlist,
} from "@/data/wishlistStore";
import "./productCard.css";

function ProductCard({ limit, searchTerm = "", filters, infiniteScroll = false }) {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [catalogError, setCatalogError] = useState("");
  const loadMoreRef = useRef(null);
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

  const matchingProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return products
      .filter((product) => product.name.toLowerCase().includes(normalizedSearch))
      .filter((product) => {
        if (!filters) return true;

        const { categories, minPrice, maxPrice, sizes } = filters;
        const matchesCategory =
          categories.length === 0 || categories.includes(product.category);
        const matchesMinPrice = minPrice === "" || product.price >= Number(minPrice);
        const matchesMaxPrice = maxPrice === "" || product.price <= Number(maxPrice);
        const matchesSize =
          sizes.length === 0 || sizes.some((size) => product.sizes.includes(size));
        return (
          matchesCategory &&
          matchesMinPrice &&
          matchesMaxPrice &&
          matchesSize
        );
      });
  }, [products, searchTerm, filters]);

  const displayedProducts = infiniteScroll
    ? matchingProducts.slice(0, visibleCount)
    : matchingProducts.slice(0, limit ?? matchingProducts.length);

  useEffect(() => {
    if (
      !infiniteScroll ||
      catalogError ||
      visibleCount >= matchingProducts.length ||
      !loadMoreRef.current
    ) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((count) => Math.min(count + 12, matchingProducts.length));
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [catalogError, infiniteScroll, matchingProducts.length, visibleCount]);

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

  if (displayedProducts.length === 0) {
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
      {displayedProducts.map((product) => {
        const isSaved = wishlist.some(
          (item) => String(item.id) === product.id
        );

        return (
          <article className="product-card" key={product.id}>
            <Link
              className="product-card-link"
              href={`/detailPage/${product.id}`}
              aria-label={`View details for ${product.name}`}
            >
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>

              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-bottom">
                  <span className="product-price">Rs. {product.price}</span>
                  <span className="add-cart-btn">View Details</span>
                </div>
              </div>
            </Link>

            <button
              type="button"
              className={`product-wishlist-button ${isSaved ? "is-saved" : ""}`}
              onClick={() => toggleWishlist(product)}
              aria-label={isSaved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
              aria-pressed={isSaved}
            >
              <Heart
                size={18}
                strokeWidth={1.8}
                fill={isSaved ? "currentColor" : "none"}
                aria-hidden="true"
              />
            </button>
          </article>
        );
      })}
      {infiniteScroll && displayedProducts.length < matchingProducts.length && (
        <div
          ref={loadMoreRef}
          className="product-load-sentinel"
          role="status"
          aria-label="Loading more products"
        />
      )}
    </>
  );
}

export default ProductCard;
