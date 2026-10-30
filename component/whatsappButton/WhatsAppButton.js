import { FaWhatsapp } from "react-icons/fa";
import "./WhatsAppButton.css";

export default function WhatsAppButton() {
  return (
    <a
      className="whatsapp-floating-button"
      href="https://wa.me/923710313814?text=Assalam%20o%20Alaikum%2C%20mujhe%20aapke%20products%20ke%20bare%20mein%20maloomat%20chahiye."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <FaWhatsapp aria-hidden="true" />
      <span>Chat with us</span>
    </a>
  );
}
