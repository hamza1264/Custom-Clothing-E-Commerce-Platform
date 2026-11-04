import React from "react";
import { Headset, PackageOpen, Shirt, Undo2 } from "lucide-react";
import "./contactSupport.css";

function ContactSupport() {

  const supportItems = [
  {
    icon: <Headset />,
    title: "Quick Support",
    text: "Get fast and friendly support anytime.",
  },
  {
    icon: <Shirt />,
    title: "Custom Assistance",
    text: "Need help with custom stitching? We are here.",
  },
  {
    icon: <PackageOpen />,
    title: "Order Updates",
    text: "Stay updated with your order at every step.",
  },
  {
    icon: <Undo2 />,
    title: "Easy Returns",
    text: "Hassle-free returns within 7 days.",
  },
];

  return (
    <section className="support-section">

      <div className="support-heading">

        <h2>We&apos;re Always Here</h2>

        <p>
          Our support team is always ready to assist you with
          your orders, custom stitching, or any other queries.
        </p>

      </div>

      <div className="support-grid">

        {supportItems.map((item, index) => (

          <div className="support-card" key={index}>

            <div className="support-icon">
              {item.icon}
            </div>

            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default ContactSupport;