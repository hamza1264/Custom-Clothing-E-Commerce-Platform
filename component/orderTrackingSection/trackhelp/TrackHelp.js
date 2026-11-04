import Link from "next/link";
import { Headset } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import "./TrackHelp.css";

function TrackHelp() {
  return (
    <section className="track-help">

      <div className="track-help-icon">
        <Headset />
      </div>

      <h2>Need Help With Your Order?</h2>

      <p>
        If you have any questions about your order,
        our support team is here to help.
      </p>

      <Link
        href="https://wa.me/923710313814"
        target="_blank"
        className="track-help-btn"
      >
        <FaWhatsapp />
        Contact Us on WhatsApp
      </Link>

    </section>
  );
}

export default TrackHelp;