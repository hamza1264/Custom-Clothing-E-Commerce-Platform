import React from 'react';
import Link from 'next/link';
import ProductCard from '@/component/productcard/productCard';
import "./shopByCategory.css";

export default function ShopByCategory() {
    return (
        <div className="container">
            {/* SHOP BY CATEGORY SECTION */}
            <section className="category-section">
                {/* Section Header */}
                <div className="category-header">
                    <div>
                        <h2 className="category-title">Shop by Category</h2>
                        <p className="category-subtitle">Explore our wide range of collections</p>
                    </div>
                    <Link href="/shop" className="view-all-btn">
                        View All
                    </Link>
                </div>

                <div className="home-products-grid">
                    <ProductCard limit={4} />
                </div>
            </section>
        </div>
    );
}