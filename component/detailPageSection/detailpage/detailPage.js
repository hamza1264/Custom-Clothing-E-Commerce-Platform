'use client';

import React, { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getCartSnapshot, saveCart } from '@/data/cartStore';
import './detailpage.css';

// --- Mock Database ---
const PRODUCTS_DATA = [
  {
    id: 1,
    title: 'Embroidered Lawn Suit',
    price: 4500,
    originalPrice: 6000,
    discount: '25% OFF',
    rating: 4.8,
    reviewsCount: 124,
    images: [
      '/category/femail01.jpg',
      '/category/femail02.jpg',
      '/category/femail03.jpg',
    ],
    fabric: 'Premium Lawn Fabric',
    features: ['Comfortable & Breathable', 'Perfect for Summertime'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Navy', hex: '#1c2d42' },
      { name: 'Maroon', hex: '#631322' },
      { name: 'Green', hex: '#1d4838' },
    ],
    description:
      'Elegant 3 piece embroidered suit, made with premium lawn fabric. Perfect for casual and semi-formal wear.',
    fabricCare:
      'Dry clean recommended. Do not bleach. Iron at moderate temperature. Avoid direct sunlight when drying.',
    reviews: [
      {
        id: 1,
        user: 'Sarah Khan',
        verified: true,
        rating: 5,
        date: '14 Sep 2025',
        comment: 'Absolutely loved the quality and perfect fitting! Highly recommend.',
      },
      {
        id: 2,
        user: 'Ayesha Malik',
        verified: true,
        rating: 5,
        date: '10 Sep 2025',
        comment: 'Great service and beautiful design. Will order again!',
      },
    ],
  },
  {
    id: 2,
    title: 'Silk Party Dress',
    price: 6500,
    originalPrice: 8000,
    discount: '18% OFF',
    rating: 4.9,
    reviewsCount: 88,
    images: ['/category/femail02.jpg'],
    fabric: 'Pure Silk',
    features: ['Soft texture', 'Elegant design'],
    sizes: ['S', 'M', 'L'],
    colors: [{ name: 'Red', hex: '#ff0000' }],
    description: 'Elegant silk party dress with beautiful detailing for special occasions.',
    fabricCare: 'Dry clean only.',
    reviews: [],
  },
  {
    id: 3,
    title: 'Printed Lawn Dress',
    price: 3200,
    originalPrice: 4000,
    discount: '20% OFF',
    rating: 4.6,
    reviewsCount: 45,
    images: ['/category/femail03.jpg'],
    fabric: 'Printed Lawn',
    features: ['Lightweight', 'Cool colors'],
    sizes: ['M', 'L'],
    colors: [{ name: 'Blue', hex: '#0000ff' }],
    description: 'Comfortable printed lawn dress with a stylish and modern design.',
    fabricCare: 'Machine wash cold.',
    reviews: [],
  },
  {
    id: 4,
    title: 'Cotton Casual Suit',
    price: 3800,
    originalPrice: 4500,
    discount: '15% OFF',
    rating: 4.7,
    reviewsCount: 62,
    images: ['/category/femail04.jpg'],
    fabric: '100% Cotton',
    features: ['Daily wear', 'Soft touch'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'White', hex: '#ffffff' }],
    description: 'Soft cotton casual suit perfect for everyday wear and summer days.',
    fabricCare: 'Hand wash.',
    reviews: [],
  },
  {
    id: 5,
    title: 'Chiffon Formal Dress',
    price: 7200,
    originalPrice: 9000,
    discount: '20% OFF',
    rating: 4.9,
    reviewsCount: 110,
    images: ['/category/femail05.jpg'],
    fabric: 'Chiffon',
    features: ['Wedding wear', 'Embroidered'],
    sizes: ['S', 'M', 'L'],
    colors: [{ name: 'Gold', hex: '#ffd700' }],
    description: 'Premium chiffon formal dress designed for weddings and special events.',
    fabricCare: 'Dry clean only.',
    reviews: [],
  },
  {
    id: 6,
    title: 'Velvet Winter Suit',
    price: 8500,
    originalPrice: 10000,
    discount: '15% OFF',
    rating: 4.8,
    reviewsCount: 95,
    images: ['/category/femail01.jpg'],
    fabric: 'Micro Velvet',
    features: ['Warm & Cozy', 'Royal look'],
    sizes: ['M', 'L', 'XL'],
    colors: [{ name: 'Black', hex: '#000000' }],
    description: 'Luxury velvet winter suit with a comfortable fabric and elegant look.',
    fabricCare: 'Dry clean only.',
    reviews: [],
  },
];

export default function Page({ params }) {
  const resolvedParams = use(params);
  const productId = Number(resolvedParams.id);
  const product = PRODUCTS_DATA.find((item) => item.id === productId);

  // States
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]?.name || 'Navy');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product?.images?.[0] || '');
  const [activeTab, setActiveTab] = useState('description');
  const [cartMessage, setCartMessage] = useState('');

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <p>URL ID ({resolvedParams.id}) ke mutabiq koi product nahi mila.</p>
        <Link href="/shop" className="back-to-shop">
          ← Back to Shop
        </Link>
      </div>
    );
  }

  const handleQuantityChange = (type) => {
    if (type === 'inc') setQuantity((prev) => prev + 1);
    if (type === 'dec' && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(getCartSnapshot());
    const existingItem = cart.find(
      (item) =>
        item.productId === product.id &&
        item.size === selectedSize &&
        item.color === selectedColor
    );

    const nextCart = existingItem
      ? cart.map((item) =>
          item === existingItem
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      : [
          ...cart,
          {
            productId: product.id,
            title: product.title,
            price: product.price,
            image: product.images[0],
            size: selectedSize,
            color: selectedColor,
            quantity,
          },
        ];

    saveCart(nextCart);
    setCartMessage(`${quantity} item(s) added to your cart.`);
  };

  return (
    <div className="detail-page">
      
      {/* Top Main Section */}
      <div className="product-detail-main">
        
        {/* 1. Image Gallery Component */}
        <div className="product-gallery">
          <div className="thumbnail-list">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                className={`thumbnail-box ${selectedImage === img ? 'active' : ''}`}
                onClick={() => setSelectedImage(img)}
                aria-label={`View ${product.title} image ${idx + 1}`}
              >
                <Image src={img} alt="thumbnail" width={60} height={75} />
              </button>
            ))}
          </div>
          <div className="main-image-wrapper">
            <Image
              src={selectedImage || product.images[0]}
              alt={product.title}
              width={420}
              height={520}
              priority
              className="main-image"
            />
          </div>
        </div>

        {/* Right Side Grouping */}
        <div className="product-info-wrapper">
          
          {/* 2. Product Info Component */}
          <div className="product-info-header">
            <h1 className="product-title">{product.title}</h1>

            <div className="price-section">
              <span className="current-price">PKR {product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <>
                  <span className="original-price">
                    PKR {product.originalPrice.toLocaleString()}
                  </span>
                  <span className="discount-badge">{product.discount}</span>
                </>
              )}
            </div>

            <div className="rating-row">
              <span className="stars">⭐⭐⭐⭐⭐</span>
              <span className="rating-text">
                {product.rating} ({product.reviewsCount} reviews)
              </span>
            </div>

            <ul className="product-features">
              <li>✔ {product.fabric}</li>
              {product.features.map((feat, index) => (
                <li key={index}>✔ {feat}</li>
              ))}
            </ul>
          </div>

          {/* 3. Product Options Component */}
          <div className="product-options">
            {/* Color Selection */}
            <div className="option-section">
              <label className="option-label">
                Color: <span className="selected-option">{selectedColor}</span>
              </label>
              <div className="color-options">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    className={`color-circle ${selectedColor === c.name ? 'active' : ''}`}
                    style={{ '--swatch-color': c.hex }}
                    onClick={() => setSelectedColor(c.name)}
                    aria-label={c.name}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="option-section">
              <div className="size-header">
                <label className="option-label">Size:</label>
              </div>
              <div className="size-options">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    className={`size-box ${selectedSize === sz ? 'active' : ''}`}
                    onClick={() => setSelectedSize(sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="option-section">
              <div className="quantity-selector">
                <button type="button" onClick={() => handleQuantityChange('dec')} aria-label="Decrease quantity">-</button>
                <span>{quantity}</span>
                <button type="button" onClick={() => handleQuantityChange('inc')} aria-label="Increase quantity">+</button>
              </div>
            </div>
          </div>

          {/* 4. Action Buttons Component */}
          <div className="action-buttons">
            <button
              type="button"
              onClick={handleAddToCart}
              className="add-to-cart-button"
            >
              Add to Cart
            </button>
            <Link
              href={`https://wa.me/923710313814?text=Hi,%20I%20want%20to%20order%20${encodeURIComponent(product.title)}%20(Size:%20${selectedSize},%20Color:%20${selectedColor},%20Qty:%20${quantity})`}
              target="_blank"
              className="whatsapp-order-button"
            >
              Order on WhatsApp
            </Link>
          </div>
          {cartMessage && (
            <p className="cart-feedback" role="status">
              {cartMessage} <Link href="/cart">View cart</Link>
            </p>
          )}

        </div>
      </div>

      {/* 5. Product Tabs Section */}
      <div className="tabs-container">
        <div className="tabs-header">
          {['description', 'fabric', 'reviews'].map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'reviews' ? `Reviews (${product.reviewsCount})` : tab === 'fabric' ? 'Fabric & Care' : 'Description'}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === 'description' && <p>{product.description}</p>}
          {activeTab === 'fabric' && <p>{product.fabricCare}</p>}
          {activeTab === 'reviews' && (
            <div className="reviews-list">
              {product.reviews.length === 0 ? (
                <p>No reviews yet for this product.</p>
              ) : (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="review-card">
                    <div className="review-top">
                      <span className="review-user">{rev.user}</span>
                      <span className="review-date">{rev.date}</span>
                    </div>
                    <div className="stars">{"⭐".repeat(rev.rating)}</div>
                    <p className="review-comment">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}