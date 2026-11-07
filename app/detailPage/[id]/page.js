'use client';

import React, { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaWhatsapp } from 'react-icons/fa';
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
  const [purchaseError, setPurchaseError] = useState('');

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

  const handleBuyNow = () => {
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

    try {
      sessionStorage.setItem('maintainiq-buy-now', JSON.stringify(cartItem));
      router.push('/checkout?buyNow=1');
    } catch {
      setPurchaseError('Could not start checkout. Please try again.');
    }
  };

  const whatsappMessage = product
    ? [
        'Assalam o Alaikum, I would like to order:',
        `Product: ${product.title}`,
        `Product ID: ${product.id}`,
        `Price: Rs. ${Number(product.price).toLocaleString()}`,
        `Size: ${selectedSize}`,
        `Color: ${selectedColor}`,
        `Quantity: ${quantity}`,
      ].join('\n')
    : '';

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
          {purchaseError && (
            <p className="purchase-error" role="alert">{purchaseError}</p>
          )}
          <div className="detail-purchase-actions">
            <button type="button" className="add-to-cart-button" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button type="button" className="buy-now-button" onClick={handleBuyNow}>
              Buy Now
            </button>
            <a
              className="whatsapp-order-button"
              href={`https://wa.me/923710313814?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp aria-hidden="true" />
              Order on WhatsApp
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}