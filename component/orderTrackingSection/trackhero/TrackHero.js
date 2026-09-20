import { FaTruck } from "react-icons/fa";
import "./TrackHero.css";

function TrackHero() {
  return (
    <section className="track-hero">

      <div className="track-hero-content">

        <div className="track-hero-icon">
          <FaTruck />
        </div>

        <span>ORDER TRACKING</span>

        <h1>
          Track Your <strong>Order</strong>
        </h1>

        <p>
          Enter your order details below to check the current
          status of your order.
        </p>

      </div>

    </section>
  );
}

export default TrackHero;