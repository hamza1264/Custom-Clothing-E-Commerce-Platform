import React from "react";
import {
  FaTruck,
  FaUndo,
  FaLock,
  FaAward,
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

import "./contactFooter.css";

function ContactFooter() {
  return (
    <section className="contact-footer">

      {/* Top Section */}
      <div className="footer-top">

        {/* Newsletter */}
        <div className="newsletter">

          <h2>Stay Updated</h2>

          <p>
            Subscribe to our newsletter and never miss new
            arrivals, offers & style updates.
          </p>

          <div className="subscribe-box">
            <input
              type="email"
              placeholder="Enter your email"
            />

            <button>
              Subscribe
            </button>
          </div>

        </div>


        {/* Follow Us */}
        <div className="follow-us">

          <h2>Follow Us</h2>

          <p>
            Join our community on social media for style
            inspiration and latest updates.
          </p>

          <div className="social-icons">

            <a
              href="https://wa.me/923710313814"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <FaWhatsapp />
            </a>

            <a
              href="https://www.facebook.com/share/19UX7knCGD/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://www.instagram.com/hamzaansari2985?igsh=MXQ"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>

            <a
              href="https://www.linkedin.com/in/hamza-ansari-a42a80378/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn />
            </a>

          </div>

        </div>

      </div>


      {/* Service Bar */}
      <div className="service-bar">

        <div>
          <FaTruck className="service-icon" />

          <div>
            <h3>Worldwide Shipping</h3>
            <p>Delivering joy worldwide</p>
          </div>
        </div>


        <div>
          <FaUndo className="service-icon" />

          <div>
            <h3>7 Days Return</h3>
            <p>Easy returns & exchanges</p>
          </div>
        </div>


        <div>
          <FaLock className="service-icon" />

          <div>
            <h3>Secure Payment</h3>
            <p>100% secure checkout</p>
          </div>
        </div>


        <div>
          <FaAward className="service-icon" />

          <div>
            <h3>Quality Promise</h3>
            <p>We promise the best quality</p>
          </div>
        </div>

      </div>

    </section>
  );
}

export default ContactFooter;