'use client';

import React from 'react';
import './ProductInfo.css';

export default function ProductInfo({
    title,
    price,
    originalPrice,
    discount,
    rating,
    reviewsCount,
    fabric,
    features,
}) {
    return (
        <div className="product-info-header">
            <h1 className="product-title">{title}</h1>

            <div className="price-section">
                <span className="current-price">PKR {price.toLocaleString()}</span>
                {originalPrice && (
                    <>
                        <span className="original-price">
                            PKR {originalPrice.toLocaleString()}
                        </span>
                        <span className="discount-badge">{discount}</span>
                    </>
                )}
            </div>

            <div className="rating-row">
                <span className="stars">⭐⭐⭐⭐⭐</span>
                <span className="rating-text">
                    {rating} ({reviewsCount} reviews)
                </span>
            </div>

            <ul className="product-features">
                <li>✔ {fabric}</li>
                {features.map((feat, index) => (
                    <li key={index}>✔ {feat}</li>
                ))}
            </ul>
        </div>
    );
}