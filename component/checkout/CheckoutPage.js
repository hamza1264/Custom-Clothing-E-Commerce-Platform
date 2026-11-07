"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleCheck } from "lucide-react";
import {
  getCartSnapshot,
  getServerCartSnapshot,
  getShippingCost,
  saveCart,
  subscribeToCart,
} from "@/data/cartStore";
import "@/app/checkout/checkout.css";

export default function CheckoutPage({ isBuyNow = false }) {
  const router = useRouter();
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
  const [buyNowItem, setBuyNowItem] = useState(null);
  const [isResolvingBuyNow, setIsResolvingBuyNow] = useState(isBuyNow);

  useEffect(() => {
    if (!isBuyNow) return;
    let active = true;

    Promise.resolve()
      .then(() => sessionStorage.getItem("maintainiq-buy-now"))
      .then((value) => {
        if (!active) return;
        if (!value) {
          setOrderError("This quick checkout has expired. Please select Buy Now again.");
          setIsResolvingBuyNow(false);
          return;
        }

        const item = JSON.parse(value);
        if (
          item &&
          typeof item.productId === "string" &&
          typeof item.title === "string" &&
          Number.isFinite(item.price) &&
          Number.isInteger(item.quantity) &&
          item.quantity > 0 &&
          typeof item.size === "string" &&
          typeof item.color === "string"
        ) {
          setBuyNowItem(item);
        } else {
          setOrderError("This quick checkout is invalid. Please select Buy Now again.");
        }
        setIsResolvingBuyNow(false);
      }).catch(() => {
        if (!active) return;
        setOrderError("Could not load this quick checkout. Please try again.");
        setIsResolvingBuyNow(false);
      });
    return () => {
      active = false;
    };
  }, [isBuyNow]);

  const checkoutItems = isBuyNow ? (buyNowItem ? [buyNowItem] : []) : cart;

  const subtotal = checkoutItems.reduce(
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
    if (checkoutItems.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    setOrderError("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          items: checkoutItems.map(({ productId, size, color, quantity }) => ({
            productId: String(productId),
            size,
            color,
            quantity,
          })),
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401 && result.loginRequired === true) {
          const checkoutPath = isBuyNow
            ? "/checkout?buyNow=1"
            : "/checkout";
          router.push(`/login?returnTo=${encodeURIComponent(checkoutPath)}`);
          return;
        }
        setOrderError(result.error || "Could not place your order.");
        return;
      }

      if (isBuyNow) {
        sessionStorage.removeItem("maintainiq-buy-now");
      } else {
        saveCart([]);
      }
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
        <span className="checkout-success-mark" aria-hidden="true">
          <CircleCheck size={30} strokeWidth={1.8} />
        </span>
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

  if (isBuyNow && isResolvingBuyNow) {
    return (
      <main className="checkout-page checkout-empty">
        <p className="checkout-eyebrow">CHECKOUT</p>
        <h1>Preparing your order...</h1>
      </main>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <main className="checkout-page checkout-empty">
        <p className="checkout-eyebrow">CHECKOUT</p>
        <h1>{isBuyNow ? "Quick checkout unavailable" : "Your cart is empty"}</h1>
        <p>
          {orderError || "Add an outfit to your cart before checking out."}
        </p>
        <Link href="/shop" className="checkout-submit">
          {isBuyNow ? "Back to the collection" : "Browse the collection"}
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
          {checkoutItems.map((item) => (
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
