// import React from 'react'
// import ImageGallery from '@/component/detailPageSection/imageGallery/ImageGallery'
// import ProductInfo from '@/component/detailPageSection/productinfo/ProductInfo'
// import ProductOptions from '@/component/detailPageSection/productoption/ProductOption'
// import ActionButtons from '@/component/detailPageSection/actionbutton/ActionButton'
// import ProductTabs from '@/component/detailPageSection/producttab/ProductTab'

// function page() {
//   return (
//     <div>
//       <ImageGallery />
//       <ProductInfo />
//       <ProductOptions />
//       <ActionButtons />
//       <ProductTabs />

//       {/* <h1>detail page</h1> */}
//     </div>
//   )
// }

// export default page
'use client';

import React, { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCartSnapshot, saveCart } from '@/data/cartStore';
import '@/component/detailPageSection/detailpage/detailpage.css';

// 1. All Products Data Database Mock
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
  const router = useRouter();
  // 2. Next.js 15+ params handling
  const resolvedParams = use(params);
  const productId = Number(resolvedParams.id);

  // 3. Find Product by URL ID
  const product = PRODUCTS_DATA.find((item) => item.id === productId);

  // Default values set
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]?.name || 'Navy');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product?.images?.[0] || '');

  const handleAddToCart = () => {
    const cartItem = {
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity,
    };
    const currentCart = JSON.parse(getCartSnapshot());
    const existingItem = currentCart.find(
      (item) =>
        item.productId === cartItem.productId &&
        item.size === cartItem.size &&
        item.color === cartItem.color
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentCart.push(cartItem);
    }

    saveCart(currentCart);
    router.push('/cart');
  };

  // Safety fallbackagar ID match na hone par blank page na dikhe
  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <p>URL ID: ({resolvedParams.id}) ke mutabiq koi product nahi mila.</p>
        <Link href="/shop" className="back-to-shop">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <div className="product-detail-main">
        <div className="product-gallery">
          <div className="main-image-wrapper">
            <Image
              src={selectedImage || product.images[0]}
              alt={product.title}
              width={500}
              height={600}
              priority
              className="main-image"
            />
          </div>
          <div className="thumbnail-list">
            {product.images.map((image) => (
              <button
                key={image}
                type="button"
                onClick={() => setSelectedImage(image)}
                aria-label={`View ${product.title} image`}
                className={`thumbnail-box ${selectedImage === image ? 'active' : ''}`}
              >
                <Image src={image} alt="" width={60} height={75} />
              </button>
            ))}
          </div>
        </div>

        <div className="product-info-wrapper">
          <h1 className="product-title">{product.title}</h1>
          <p className="current-price">Rs. {product.price.toLocaleString()}</p>
          <p className="detail-description">{product.description}</p>
          <p className="detail-fabric">{product.fabric}</p>
          <ul className="product-features">
            {product.features.map((feature) => <li key={feature}>{feature}</li>)}
          </ul>

          <div className="option-section">
            <strong>Color: {selectedColor}</strong>
            <div className="color-options">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color.name)}
                  aria-label={color.name}
                  title={color.name}
                  className={`color-circle ${selectedColor === color.name ? 'active' : ''}`}
                  style={{ '--swatch-color': color.hex }}
                />
              ))}
            </div>
          </div>

          <div className="option-section">
            <strong>Size</strong>
            <div className="size-options">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`size-box ${selectedSize === size ? 'active' : ''}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <label className="quantity-label">
            Quantity{' '}
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))}
              className="quantity-input"
            />
          </label>
          <button type="button" className="add-to-cart-button" onClick={handleAddToCart}>
            Add to Cart
          </button>
          <p className="detail-fabric-care">Fabric care: {product.fabricCare}</p>
          <p className="detail-reviews-count">{product.reviewsCount} reviews</p>
        </div>
      </div>
    </div>
  );
}