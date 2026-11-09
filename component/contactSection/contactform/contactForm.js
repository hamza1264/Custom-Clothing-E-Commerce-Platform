"use client";

import React from "react";
import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import "./contactForm.css";

function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          subject: formData.get("subject"),
          message: formData.get("message"),
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        setSubmissionStatus({
          type: "error",
          message: result.error || "Your message could not be sent. Please try again.",
        });
        return;
      }

      form.reset();
      setSubmissionStatus({
        type: "success",
        message: "Thanks for reaching out. Your message has been sent successfully.",
      });
    } catch {
      setSubmissionStatus({
        type: "error",
        message: "We couldn't reach the server. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="contact-form-section">

      {/* Form */}
      <div className="contact-form-box">

        <h2>Get in Touch</h2>

        <form onSubmit={handleSubmit}>

          <label htmlFor="contact-name">Full Name</label>
          <input
            type="text"
            id="contact-name"
            name="name"
            placeholder="Enter your full name"
            autoComplete="name"
            minLength={2}
            maxLength={100}
            required
          />

          <label htmlFor="contact-email">Email Address</label>
          <input
            type="email"
            id="contact-email"
            name="email"
            placeholder="Enter your email"
            autoComplete="email"
            maxLength={254}
            required
          />

          <label htmlFor="contact-phone">Phone Number (optional)</label>
          <input
            type="tel"
            id="contact-phone"
            name="phone"
            placeholder="Enter your phone number"
            autoComplete="tel"
            pattern="[0-9+()\s-]{0,30}"
            maxLength={30}
          />

          <label htmlFor="contact-subject">Subject</label>
          <select id="contact-subject" name="subject" defaultValue="" required>
            <option value="" disabled>Select subject</option>
            <option>General Inquiry</option>
            <option>Custom Stitching</option>
            <option>Order Issue</option>
            <option>Delivery</option>
          </select>

          <label htmlFor="contact-message">Your Message</label>
          <textarea
            id="contact-message"
            name="message"
            placeholder="Type your message here..."
            rows="5"
            minLength={10}
            maxLength={3000}
            required
          />

          <button type="submit" disabled={isSubmitting}>
            <Send aria-hidden="true" />
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>

          {submissionStatus && (
            <p
              className={`contact-form-status ${submissionStatus.type}`}
              role={submissionStatus.type === "error" ? "alert" : "status"}
            >
              {submissionStatus.message}
            </p>
          )}

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