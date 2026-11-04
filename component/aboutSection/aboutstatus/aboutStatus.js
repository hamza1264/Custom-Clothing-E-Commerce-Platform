import React from "react";
import "./aboutStatus.css";

import { Scissors, Shirt, Star, Users } from "lucide-react";

function AboutStats() {
  const stats = [
    {
      number: "15K+",
      title: "Happy Customers",
      icon: <Users />,
    },
    {
      number: "25K+",
      title: "Outfits Delivered",
      icon: <Shirt />,
    },
    {
      number: "5K+",
      title: "Custom Designs",
      icon: <Scissors />,
    },
    {
      number: "4.8/5",
      title: "Customer Rating",
      icon: <Star />,
    },
  ];

  return (
    <section className="stats-section">

      <div className="stats-container">

        {stats.map((item, index) => (
          <div className="stat" key={index}>

            <div className="stat-icon">
              {item.icon}
            </div>

            <h2>{item.number}</h2>

            <p>{item.title}</p>

          </div>
        ))}

      </div>

      <div className="bottom-boxes">

        <div>
          <h3>Our Mission</h3>
          <p>
            To provide premium quality outfits with perfect stitching.
          </p>
        </div>

        <div>
          <h3>Our Vision</h3>
          <p>
            To become Pakistan&apos;s most trusted custom stitching brand.
          </p>
        </div>

        <div>
          <h3>Our Promise</h3>
          <p>
            Quality, trust and customer satisfaction — always.
          </p>
        </div>

      </div>

    </section>
  );
}

export default AboutStats;