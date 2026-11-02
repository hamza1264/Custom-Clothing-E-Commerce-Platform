import Link from "next/link";
import { FaCut } from "react-icons/fa";
import "./CustomHero.css";

function CustomHero() {
  return (
    <section className="custom-hero">

      <div className="custom-hero-content">

        <span className="custom-hero-small">
          CUSTOM CLOTHING
        </span>

        <h1>
          Your Design,
          <br />
          <span>Your Perfect Outfit</span>
        </h1>

        <p>
          Have a design in mind? Share your idea, choose your fabric,
          provide your measurements, and we&apos;ll create your outfit
          according to your requirements.
        </p>

        <Link href="#custom-order" className="custom-hero-btn">
          <FaCut />
          Start Your Custom Order
        </Link>

      </div>

      <div className="custom-hero-image">
        <img
          src="/unstiched-design.jpeg"
          alt="Custom Stitching"
        />
      </div>

    </section>
  );
}

export default CustomHero;