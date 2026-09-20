import React from "react";
import "./contactHero.css";

function ContactHero() {
  return (
    <section className="contact-hero">

      <div className="contact-hero-content">

        <p className="contact-small-title">
          Contact Us
        </p>

        <h1>
          We're Here to <span>Help You!</span>
        </h1>

        <p>
          Have a question, custom request, or just want to say hello?
          <br />
          We'd love to hear from you.
        </p>

      </div>

      <div className="contact-hero-image">
        <img
          src="/contact-main.jpeg"
          alt="Contact Us"
        />
      </div>

    </section>
  );
}

export default ContactHero;