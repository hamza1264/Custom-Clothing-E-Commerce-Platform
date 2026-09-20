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

        <Link
          href="/customStitch"
          className="cta-secondary"
        >
          Custom Stitch
        </Link>

      </div>

    </section>
  );
}

export default HowCTA;