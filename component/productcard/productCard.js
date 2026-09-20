import React from "react";
import "./productCard.css";

function ProductCard() {
  const products = [
    {
      name: "Embroidered Lawn Suit",
      price: 4500,
      description:
        "Beautiful embroidered lawn suit made with premium quality fabric.",
      image: "/category/femail01.jpg",
    },
    {
      name: "Silk Party Dress",
      price: 6500,
      description:
        "Elegant silk party dress with beautiful detailing for special occasions.",
      image: "/category/femail02.jpg",
    },
    {
      name: "Printed Lawn Dress",
      price: 3200,
      description:
        "Comfortable printed lawn dress with a stylish and modern design.",
      image: "/category/femail03.jpg",
    },
    {
      name: "Cotton Casual Suit",
      price: 3800,
      description:
        "Soft cotton casual suit perfect for everyday wear and summer days.",
      image: "/category/femail04.jpg",
    },
    {
      name: "Chiffon Formal Dress",
      price: 7200,
      description:
        "Premium chiffon formal dress designed for weddings and special events.",
      image: "/category/femail05.jpg",
    },
    {
      name: "Velvet Winter Suit",
      price: 8500,
      description:
        "Luxury velvet winter suit with a comfortable fabric and elegant look.",
      image: "/category/femail01.jpg",
    },
    
    
  ];

  return (
    <>
      {products.map((product, index) => (
        <div className="product-card" key={index}>

          <div className="product-image">
            <img
              src={product.image}
              alt={product.name}
            />
          </div>

          <div className="product-info">

            <h3>{product.name}</h3>

            <p className="product-description">
              {product.description}
            </p>

            <div className="product-bottom">

              <span className="product-price">
                Rs. {product.price}
              </span>

              <button className="add-cart-btn">
                Add to Cart
              </button>

            </div>

          </div>

        </div>
      ))}
    </>
  );
}

export default ProductCard;