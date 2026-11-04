import React from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import "./contactForm.css";

function ContactForm() {
  return (
    <section className="contact-form-section">

      {/* Form */}
      <div className="contact-form-box">

        <h2>Get in Touch</h2>

        <form>

          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
          />

          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
          />

          <label>Phone Number</label>
          <input
            type="text"
            placeholder="Enter your phone number"
          />

          <label>Subject</label>
          <select>
            <option>Select subject</option>
            <option>General Inquiry</option>
            <option>Custom Stitching</option>
            <option>Order Issue</option>
            <option>Delivery</option>
          </select>

          <label>Your Message</label>
          <textarea
            placeholder="Type your message here..."
            rows="5"
          ></textarea>

          <button type="submit">
            <Send aria-hidden="true" />
            Send Message
          </button>

        </form>

      </div>


      {/* Contact Information */}
      <div className="contact-info-box">

        <h2>Contact Information</h2>

        <a
          href="https://wa.me/923710313814"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-whatsapp-link"
        >
          <div className="contact-info-item">
            <FaWhatsapp className="contact-icon whatsapp-icon" />

            <div>
              <h3>WhatsApp</h3>
              <p>Chat with us on WhatsApp</p>
              <small>for quick support</small>
            </div>
          </div>
        </a>

        <a
          href="tel:03710313814"
          className="contact-phone-link"
        >
          <div className="contact-info-item">
            <Phone className="contact-icon phone-icon" />

            <div>
              <h3>Phone</h3>
              <p>+923710313814</p>
              <small>Mon - Sat (10AM - 8PM)</small>
            </div>
          </div>
        </a>
        
        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=hamza.airt.student@gmail.com"
          target="_blank"
          className="contact-email-link"
        >
          <div className="contact-info-item">
            <Mail className="contact-icon email-icon" />

            <div>
              <h3>Email</h3>
              <p>hamza.airt.student@gmail.com</p>
              <small>We reply within 24 hours</small>
            </div>
          </div>
        </a>

        <div className="contact-info-item">
          <MapPin className="contact-icon location-icon" />
          <div>
            <h3>Address</h3>
            <p>House #12, Street 5, Gulshan-e-Iqbal,</p>
            <small>Karachi, Pakistan</small>
          </div>
        </div>

      </div>

    </section>
  );
}

export default ContactForm;