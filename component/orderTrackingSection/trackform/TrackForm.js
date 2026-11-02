"use client";

import { useState } from "react";
import { FaSearch, FaBox } from "react-icons/fa";
import "./TrackForm.css";

function TrackForm() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOrder(null);
    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        orderNumber: orderNumber.trim(),
        phone: phone.trim(),
      });
      const response = await fetch(`/api/orders/track?${params}`);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Could not find your order.");
      }
      setOrder(result.order);
    } catch (requestError) {
      setError(requestError.message || "Could not find your order.");
    } finally {
      setIsLoading(false);
    }
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
              placeholder="e.g. NF-0123456789ABCDEF0123"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
            />

            <FaSearch />

          </div>

          <label htmlFor="tracking-phone">Phone number used at checkout</label>
          <div className="track-input-box">
            <input
              id="tracking-phone"
              type="tel"
              autoComplete="tel"
              placeholder="Enter your phone number"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Searching..." : "Track Order"}
          </button>

        </form>

        {error && <p className="track-error" role="alert">{error}</p>}
        {order && (
          <div className="track-result" role="status">
            <h3>Order {order.orderNumber}</h3>
            <p>Status: <strong>{order.status}</strong></p>
            <p>Placed: {new Date(order.createdAt).toLocaleString()}</p>
            <ul>
              {order.items.map((item, index) => (
                <li key={`${item.title}-${index}`}>
                  {item.title} · Qty {item.quantity}
                </li>
              ))}
            </ul>
            <p>Total: Rs. {order.total.toLocaleString()}</p>
          </div>
        )}

        <small>
          Use the order number and phone number from your order confirmation.
        </small>

      </div>

    </section>
  );
}

export default TrackForm;