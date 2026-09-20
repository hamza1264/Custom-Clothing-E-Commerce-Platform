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

import React, { useState } from 'react';
import ImageGallery from '@/component/detailPageSection/imageGallery/ImageGallery';
import ProductInfo from '@/component/detailPageSection/productinfo/ProductInfo';
import ProductOptions from '@/component/detailPageSection/productoption/ProductOption';
import ActionButtons from '@/component/detailPageSection/actionbutton/ActionButton';
import ProductTabs from '@/component/detailPageSection/producttab/ProductTab';
import './Detail.css';

function Page() {
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Navy');
  const [quantity, setQuantity] = useState(1);

  // Mock Data (Design Mockup Screen 3)
  const product = {
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
  };

  return (
    <div className="product-detail-container">
      {/* Top Main Section */}
      <div className="product-detail-main">
        {/* Left Side */}
        <ImageGallery images={product.images} title={product.title} />

        {/* Right Side Grouping */}
        <div className="product-info-wrapper">
          <ProductInfo
            title={product.title}
            price={product.price}
            originalPrice={product.originalPrice}
            discount={product.discount}
            rating={product.rating}
            reviewsCount={product.reviewsCount}
            fabric={product.fabric}
            features={product.features}
          />

          <ProductOptions
            colors={product.colors}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            sizes={product.sizes}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            quantity={quantity}
            setQuantity={setQuantity}
          />

          <ActionButtons
            onAddToCart={() => console.log('Add to cart clicked')}
            onBuyNow={() => console.log('Buy now clicked')}
          />
        </div>
      </div>

      {/* Bottom Tabs Section */}
      <ProductTabs
        description={product.description}
        fabricCare={product.fabricCare}
        reviews={product.reviews}
        reviewsCount={product.reviewsCount}
      />
    </div>
  );
}

export default Page;