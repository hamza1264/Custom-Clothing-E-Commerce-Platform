import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import "./CustomCTA.css";

function CustomCTA() {
  return (
    <section className="custom-cta">

      <div className="custom-cta-content">

        <h2>
          Ready to Create Your Outfit?
        </h2>

        <p>
          Your style, your measurements, your design.
          Let&apos;s create something unique for you.
        </p>

        <Link href="/shop" className="custom-cta-btn">
          <ShoppingBag />
          Explore Collection
        </Link>

      </div>

    </section>
  );
}

export default CustomCTA;