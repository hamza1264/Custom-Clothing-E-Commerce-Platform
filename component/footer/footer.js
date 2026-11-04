import Link from "next/link";
import "./footer.css";

import { CreditCard } from "lucide-react";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer-section">

      <div className="container">

        <div className="footer-grid">

          {/* Brand Info Column */}
          <div className="footer-col brand-col">

            <h2 className="footer-logo">
              Nayab Clothes.
            </h2>

            <p className="brand-desc">
              Your destination for premium quality fabrics and custom-stitched
              clothing tailored perfectly to your style.
            </p>

            <div className="social-links">

              <a
                href="https://www.instagram.com/hamzaansari2985?igsh=MXQ"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>

              <a
                href="https://www.facebook.com/share/19UX7knCGD/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>

              <a
                href="https://wa.me/923710313814"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="WhatsApp"
              >
                <FaWhatsapp />
              </a>

            </div>

          </div>


          {/* Quick Links Column */}
          <div className="footer-col">

            <h4 className="footer-heading">
              Quick Links
            </h4>

            <ul className="footer-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/shop">Shop Collection</Link></li>
              <li><Link href="/customStitch">Custom Stitching</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contect">Contact Us</Link></li>
            </ul>

          </div>


          {/* Categories Column */}
          <div className="footer-col">

            <h4 className="footer-heading">
              Categories
            </h4>

            <ul className="footer-links">
              <li><Link href="/shop/unstitched">Unstitched</Link></li>
              <li><Link href="/shop/3-piece">3 Piece Suits</Link></li>
              <li><Link href="/shop/2-piece">2 Piece Suits</Link></li>
              <li><Link href="/shop/pret">Pret Collection</Link></li>
              <li><Link href="/shop/formals">Luxury Formals</Link></li>
            </ul>

          </div>


          {/* Help & Support Column */}
          <div className="footer-col">

            <h4 className="footer-heading">
              Customer Care
            </h4>

            <ul className="footer-links">
              <li><Link href="#">How It Works</Link></li>
              <li><Link href="#">Shipping Policy</Link></li>
              <li><Link href="#">Returns & Exchange</Link></li>
              <li><Link href="#">Size Guide</Link></li>
              <li><Link href="#">Track Your Order</Link></li>
            </ul>

          </div>

        </div>


        {/* Bottom Bar */}
        <div className="footer-bottom">

          <p>
            © {new Date().getFullYear()}{" "}
            <strong>Hamza Ansari</strong>. All Rights Reserved.
          </p>

          <p>
            <strong>Nayab Clothes</strong> — Custom Clothing & Fashion
          </p>

          <div className="payment-badges">

            <span className="payment-icon">
              <CreditCard />
            </span>

            <span>
              Secure Checkout
            </span>

          </div>

        </div>

      </div>

    </footer>
  );
}