import "./HowSteps.css";

import {
  FaSearch,
  FaShoppingCart,
  FaRulerCombined,
  FaCut,
  FaCheckCircle,
  FaTruck,
} from "react-icons/fa";

function HowSteps() {
  const steps = [
    {
      number: "01",
      icon: <FaSearch />,
      title: "Explore Our Collection",
      description:
        "Browse our collection of unstitched and ready-made clothing and find an outfit you love.",
    },
    {
      number: "02",
      icon: <FaShoppingCart />,
      title: "Choose Your Outfit",
      description:
        "Select your favorite product, choose available options, and add it to your shopping cart.",
    },
    {
      number: "03",
      icon: <FaRulerCombined />,
      title: "Customize Your Size",
      description:
        "Provide your measurements and select the size according to your requirements.",
    },
    {
      number: "04",
      icon: <FaCut />,
      title: "Custom Stitching",
      description:
        "Send your design or reference and select fabric, color, and other details.",
    },
    {
      number: "05",
      icon: <FaCheckCircle />,
      title: "Confirm Your Order",
      description:
        "Review your selected items and customization details before confirming your order.",
    },
    {
      number: "06",
      icon: <FaTruck />,
      title: "Delivery",
      description:
        "Your order will be securely packed and delivered to your address.",
    },
  ];

  return (
    <section className="steps-section">

      <div className="section-heading">
        <span>OUR PROCESS</span>

        <h2>How to Order</h2>

        <p>
          Follow these simple steps to shop or create your customized outfit.
        </p>
      </div>

      <div className="steps-container">

        {steps.map((step) => (
          <div className="step-card" key={step.number}>

            <div className="step-top">
              <span className="step-number">
                {step.number}
              </span>

              <div className="step-icon">
                {step.icon}
              </div>
            </div>

            <h3>{step.title}</h3>

            <p>{step.description}</p>

          </div>
        ))}

      </div>

    </section>
  );
}

export default HowSteps;