import Link from "next/link";
import "./HowCTA.css";

function HowCTA() {
  return (
    <section className="how-cta">

      <h2>Ready to Find Your Style?</h2>

      <p>
        Explore our collection or create your own customized outfit.
      </p>

      <div className="cta-buttons">

        <Link
          href="/shop"
          className="cta-primary"
        >
          Shop Collection
        </Link>

        <a
          href="https://wa.me/923710313814?text=Assalam-o-Alaikum%2C%20I%20would%20like%20to%20ask%20about%20custom%20stitching."
          target="_blank"
          rel="noopener noreferrer"
          className="cta-secondary"
        >
          Ask About Custom Stitching
        </a>

      </div>

    </section>
  );
}

export default HowCTA;