'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import './ImageGallery.css';

export default function ImageGallery({ images, title }) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="product-gallery">
      <div className="thumbnail-list">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`thumbnail-box ${selectedImage === img ? 'active' : ''}`}
            onClick={() => setSelectedImage(img)}
          >
            <Image src={img} alt="thumbnail" width={60} height={75} />
          </div>
        ))}
      </div>
      <div className="main-image-wrapper">
        <Image
          src={selectedImage}
          alt={title}
          width={420}
          height={520}
          priority
          className="main-image"
        />
      </div>
    </div>
  );
}