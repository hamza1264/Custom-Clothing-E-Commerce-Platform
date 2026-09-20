'use client';

import React, { useState } from 'react';
import './ProductTab.css';

export default function ProductTabs({
    description,
    fabricCare,
    reviews,
    reviewsCount,
}) {
    const [activeTab, setActiveTab] = useState('description');

    return (
        <div className="tabs-container">
            <div className="tabs-header">
                <button
                    className={activeTab === 'description' ? 'active' : ''}
                    onClick={() => setActiveTab('description')}
                >
                    Description
                </button>
                <button
                    className={activeTab === 'fabric' ? 'active' : ''}
                    onClick={() => setActiveTab('fabric')}
                >
                    Fabric & Care
                </button>
                <button
                    className={activeTab === 'reviews' ? 'active' : ''}
                    onClick={() => setActiveTab('reviews')}
                >
                    Reviews ({reviewsCount})
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'description' && <p>{description}</p>}
                {activeTab === 'fabric' && <p>{fabricCare}</p>}
                {activeTab === 'reviews' && (
                    <div className="reviews-list">
                        {reviews.map((rev) => (
                            <div key={rev.id} className="review-card">
                                <div className="review-top">
                                    <span className="review-user">{rev.user}</span>
                                    {rev.verified && (
                                        <span className="verified-badge">✔ Verified Buyer</span>
                                    )}
                                    <span className="review-date">{rev.date}</span>
                                </div>
                                <div className="stars">{"⭐".repeat(rev.rating)}</div>
                                <p className="review-comment">{rev.comment}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}