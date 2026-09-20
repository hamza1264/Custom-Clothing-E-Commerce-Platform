"use client";

import { useState } from "react";
import { FaSearch, FaBox } from "react-icons/fa";
import "./TrackForm.css";

function TrackForm() {

  const [orderNumber, setOrderNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!orderNumber.trim()) {
      alert("Please enter your order number.");
      return;
    }

    alert(`Searching for order: ${orderNumber}`);
  };

  return (
    <section className="track-form-section">

      <div className="track-form-box">

        <div className="track-form-icon">
          <FaBox />
        </div>

        <h2>Track Your Order</h2>

        <p>
          Enter your order number to see your order status.
        </p>

        <form onSubmit={handleSubmit}>

          <label>Order Number</label>

          <div className="track-input-box">

            <input
              type="text"
              placeholder="e.g. UNS-10025"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
            />

            <FaSearch />

          </div>

          <button type="submit">
            Track Order
          </button>

        </form>

        <small>
          You can find your order number in your order confirmation.
        </small>

      </div>

    </section>
  );
}

export default TrackForm;