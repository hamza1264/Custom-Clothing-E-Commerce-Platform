'use client';

import React, { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCartSnapshot, saveCart } from '@/data/cartStore';
import '@/component/detailPageSection/detailpage/detailpage.css';

export default function Page({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const productId = String(resolvedParams.id);
  const [product, setProduct] = useState(null);
  const [productLoaded, setProductLoaded] = useState(false);
  const [productError, setProductError] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Navy');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      const response = await fetch(`/api/products/${encodeURIComponent(productId)}`, {
        cache: 'no-store',
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Could not load this product.');
      }
      if (active) {
        setProduct(result.product);
        setSelectedSize(result.product.sizes[0] ?? 'M');
        setSelectedColor(result.product.colors[0]?.name ?? 'Default');
        setSelectedImage(result.product.images[0] ?? '');
      }
    }

    loadProduct()
      .catch((error) => {
        if (active) {
          setProduct(null);
          setProductError(error.message);
        }
      })
      .finally(() => {
        if (active) setProductLoaded(true);
      });

    return () => {
      active = false;
    };
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;

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
        String(item.productId) === cartItem.productId &&
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

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>{productLoaded ? "Product Not Found" : "Loading product..."}</h2>
        {productError && <p role="alert">{productError}</p>}
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
        </div>

      </div>
    </div>
  );
}