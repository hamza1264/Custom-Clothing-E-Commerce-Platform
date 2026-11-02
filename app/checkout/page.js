"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getCartSnapshot,
  getServerCartSnapshot,
  getShippingCost,
  saveCart,
  subscribeToCart,
} from "@/data/cartStore";
import "./checkout.css";

export default function CheckoutPage() {
  const cart = JSON.parse(
    useSyncExternalStore(
      subscribeToCart,
      getCartSnapshot,
      getServerCartSnapshot
    )
  );
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [orderNumber, setOrderNumber] = useState("");
  const [orderError, setOrderError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = getShippingCost(subtotal);
  const total = subtotal + shipping;

  const updateCustomer = (event) => {
    setCustomer({ ...customer, [event.target.name]: event.target.value });
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    if (cart.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    setOrderError("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          items: cart.map(({ productId, size, color, quantity }) => ({
            productId: String(productId),
            size,
            color,
            quantity,
          })),
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Could not place your order.");
      }

      saveCart([]);
      setOrderNumber(result.order.orderNumber);
    } catch (error) {
      setOrderError(error.message || "Could not place your order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderNumber) {
    return (
      <main className="checkout-page checkout-success">
        <span className="checkout-success-mark" aria-hidden="true">✓</span>
        <p className="checkout-eyebrow">ORDER CONFIRMED</p>
        <h1>Thank you, {customer.name}!</h1>
        <p>
          Your order <strong>{orderNumber}</strong> has been placed with Cash
          on Delivery.
        </p>
        <p>Track it using this order number and the phone number you provided.</p>
        <Link href="/shop" className="checkout-submit">
          Continue shopping
        </Link>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="checkout-page checkout-empty">
        <p className="checkout-eyebrow">CHECKOUT</p>
        <h1>Your cart is empty</h1>
        <p>Add an outfit to your cart before checking out.</p>
        <Link href="/shop" className="checkout-submit">
          Browse the collection
        </Link>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-heading">
        <p className="checkout-eyebrow">JUST A FEW MORE DETAILS</p>
        <h1>Checkout</h1>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={placeOrder}>
          <h2>Delivery details</h2>
          <label>
            Full name
            <input
              autoComplete="name"
              name="name"
              onChange={updateCustomer}
              required
              value={customer.name}
            />
          </label>
          <label>
            Phone number
            <input
              autoComplete="tel"
              inputMode="tel"
              name="phone"
              onChange={updateCustomer}
              required
              type="tel"
              value={customer.phone}
            />
          </label>
          <label>
            Delivery address
            <textarea
              autoComplete="street-address"
              name="address"
              onChange={updateCustomer}
              required
              rows="4"
              value={customer.address}
            />
          </label>
          <div className="checkout-payment">
            <span>Payment method</span>
            <strong>Cash on Delivery</strong>
          </div>
          {orderError && <p className="checkout-error" role="alert">{orderError}</p>}
          <button type="submit" className="checkout-submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Placing order..."
              : `Place order · Rs. ${total.toLocaleString()}`}
          </button>
          <Link href="/cart" className="checkout-back">
            Back to cart
          </Link>
        </form>

        <aside className="checkout-summary">
          <h2>Your order</h2>
          {cart.map((item) => (
            <div
              className="checkout-item"
              key={`${item.productId}-${item.size}-${item.color}`}
            >
              <Image src={item.image} alt="" width={56} height={68} />
              <div>
                <h3>{item.title}</h3>
                <p>
                  {item.size} · {item.color} · Qty {item.quantity}
                </p>
              </div>
              <strong>
                Rs. {(item.price * item.quantity).toLocaleString()}
              </strong>
            </div>
          ))}
          <div className="checkout-total-row">
            <span>Subtotal</span>
            <strong>Rs. {subtotal.toLocaleString()}</strong>
          </div>
          <div className="checkout-total-row">
            <span>Delivery</span>
            <strong>
              {shipping === 0 ? "Free" : `Rs. ${shipping.toLocaleString()}`}
            </strong>
          </div>
          <div className="checkout-total-row checkout-grand-total">
            <span>Total</span>
            <strong>Rs. {total.toLocaleString()}</strong>
          </div>
        </aside>
      </div>
    </main>
  );
}
