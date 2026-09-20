import Link from "next/link";
import "./CustomHow.css";

function CustomHow() {
  return (
    <section className="custom-how-section">

      <div className="custom-how-content">

        <span className="how-small-title">
          CUSTOM CLOTHING
        </span>

        <h2>
          Create Your Outfit,
          <br />
          <span>Your Way</span>
        </h2>

        <p>
          Have a specific design in mind? Send us your reference design,
          select your fabric and color, provide your measurements, and
          let us create an outfit according to your requirements.
        </p>

        <Link
          href="/customStitch"
          className="custom-how-btn"
        >
          Start Custom Stitching
        </Link>

      </div>

      <div className="custom-how-image">
        <img
          src="/unstiched-design.jpeg"
          alt="Custom Clothing"
        />
      </div>

    </section>
  );
}

export default CustomHow;