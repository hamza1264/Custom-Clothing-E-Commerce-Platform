import { CircleCheck, House, PackageOpen, Truck } from "lucide-react";

import "./OrderStatus.css";

function OrderStatus() {

  const statuses = [
    {
      icon: <CircleCheck />,
      title: "Order Confirmed",
      text: "Your order has been successfully confirmed.",
      date: "Order placed",
    },
    {
      icon: <PackageOpen />,
      title: "Processing",
      text: "Your outfit is being prepared.",
      date: "Processing",
    },
    {
      icon: <Truck />,
      title: "Out for Delivery",
      text: "Your order is on its way to you.",
      date: "Shipping",
    },
    {
      icon: <House />,
      title: "Delivered",
      text: "Your order has been delivered successfully.",
      date: "Delivery",
    },
  ];

  return (
    <section className="order-status-section">

      <div className="order-status-heading">

        <span>ORDER STATUS</span>

        <h2>Delivery Progress</h2>

        <p>
          Follow your order from confirmation to delivery.
        </p>

      </div>

      <div className="order-timeline">

        {statuses.map((status, index) => (

          <div
            className={`status-item ${
              index === 0 ? "active" : ""
            }`}
            key={index}
          >

            <div className="status-icon">
              {status.icon}
            </div>

            <div className="status-content">

              <span>{status.date}</span>

              <h3>{status.title}</h3>

              <p>{status.text}</p>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default OrderStatus;