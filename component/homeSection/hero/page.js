import Image from "next/image";
import Link from "next/link";
import "./hero.css";

import {
  FaGem,
  FaCut,
  FaShoppingBag,
  FaTruck,
  FaHeadset,
} from "react-icons/fa";

export default function Home() {
  return (
    <main className="hero-section">

      {/* Hero Container */}
      <div className="hero-container">

        {/* Left Content */}
        <div className="hero-content">

          <h1 className="hero-title">
            Wear Your Style,<br />
            <span className="highlight-text">
              Stitched Your Way
            </span>
          </h1>

          <p className="hero-description">
            Choose from our exclusive collection or get your dream outfit
            custom stitched exactly the way you want.
          </p>

          <div className="hero-buttons">

            <Link href="/shop" className="btn btn-primary">
              Shop Collection
            </Link>

            <Link href="/customStitch" className="btn btn-secondary">
              Custom Stitch Now
            </Link>

          </div>

        </div>


        {/* Right Image */}
        <div className="hero-image-wrapper">

          <Image
            src="/main.jpeg"
            alt="Stitched Outfit Collection"
            width={500}
            height={380}
            priority
            className="hero-image"
          />

        </div>

      </div>


      {/* Features Bar */}
      <div className="features-bar">

        <div className="feature-item">

          <span className="feature-icon">
            <FaGem />
          </span>

          <div className="feature-text">
            <h4>Premium Quality</h4>
            <p>Finest Fabrics</p>
          </div>

        </div>


        <div className="feature-item">

          <span className="feature-icon">
            <FaCut />
          </span>

          <div className="feature-text">
            <h4>Custom Stitching</h4>
            <p>Exactly Your Design</p>
          </div>

        </div>


        <div className="feature-item">

          <span className="feature-icon">
            <FaShoppingBag />
          </span>

          <div className="feature-text">
            <h4>Easy Ordering</h4>
            <p>Simple 2 Options</p>
          </div>

        </div>


        <div className="feature-item">

          <span className="feature-icon">
            <FaTruck />
          </span>

          <div className="feature-text">
            <h4>Secure Delivery</h4>
            <p>Safe & Fast Delivery</p>
          </div>

        </div>


        <div className="feature-item">

          <span className="feature-icon">
            <FaHeadset />
          </span>

          <div className="feature-text">
            <h4>Customer Support</h4>
            <p>We&apos;re Here For You</p>
          </div>

        </div>

      </div>

    </main>
  );
}