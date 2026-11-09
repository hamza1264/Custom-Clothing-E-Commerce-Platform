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

        <a
          href="https://wa.me/923710313814?text=Assalam-o-Alaikum%2C%20I%20would%20like%20to%20ask%20about%20custom%20stitching."
          target="_blank"
          rel="noopener noreferrer"
          className="custom-how-btn"
        >
          Ask About Custom Stitching
        </a>

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