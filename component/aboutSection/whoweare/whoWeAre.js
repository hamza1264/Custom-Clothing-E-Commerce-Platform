import React from "react";
import "./whoWeAre.css";

import { Crown, Gem, Heart, Scissors } from "lucide-react";

function WhoWeAre() {
  const features = [
    {
      icon: <Gem />,
      title: "Premium Quality",
      text: "We use the finest fabrics and ensure top-notch stitching quality.",
    },
    {
      icon: <Scissors />,
      title: "Custom Made",
      text: "Your design, your size, your style — we stitch it exactly how you want.",
    },
    {
      icon: <Heart />,
      title: "Customer First",
      text: "Our customers' satisfaction is our top priority. We are here for you.",
    },
    {
      icon: <Crown />,
      title: "Trusted by Thousands",
      text: "Thousands of happy customers trust us for their everyday & special looks.",
    },
  ];

  return (
    <section className="who-section">

      <div className="who-heading">
        <h2>Who We Are</h2>

        <p>
          We are a team of passionate designers and tailors who love
          creating outfits that make you feel your best.
        </p>
      </div>

      <div className="feature-grid">

        {features.map((item, index) => (
          <div className="feature-card" key={index}>

            <div className="feature-icon">
              {item.icon}
            </div>

            <h3>{item.title}</h3>

            <p>{item.text}</p>

          </div>
        ))}

      </div>

    </section>
  );
}

export default WhoWeAre;