import React from "react";
import "./ourJourney.css";

function OurJourney() {
  return (
    <section className="journey-section">

      <div className="journey-images">

        <div className="journey-main-image">
          <img
            src="/about-design.jpeg"
            alt="Our Fashion Journey"
          />
        </div>

        <div className="journey-small-images">
          <img
            src="/about-machine.jpeg"
            alt="Custom Stitching"
          />

          <img
            src="/about-clouth.jpeg"
            alt="Premium Fabric"
          />
        </div>

      </div>

      <div className="journey-content">

        <p className="journey-title">
          OUR JOURNEY
        </p>

        <h2>
          From a Small Idea to
          <br />
          Your Favorite Fashion Destination
        </h2>

        <p>
          UnStage started with a simple idea — to make custom stitching
          easy, affordable, and reliable for everyone. What began as a
          small passion project has now grown into a trusted brand loved
          by customers.
        </p>

        <ul>
          <li>✓ High-quality fabric & stitching</li>
          <li>✓ Unique designs & customization</li>
          <li>✓ On-time delivery & great support</li>
        </ul>

        <button>Read Our Story</button>

      </div>

    </section>
  );
}

export default OurJourney;