import {
  FaGem,
  FaRulerCombined,
  FaCut,
  FaTruck,
} from "react-icons/fa";

import "./CustomBenefit.css";

function CustomBenefits() {
  const benefits = [
    {
      icon: <FaGem />,
      title: "Premium Fabric",
      text: "We use quality fabrics for comfortable and beautiful outfits.",
    },
    {
      icon: <FaRulerCombined />,
      title: "Custom Size",
      text: "Provide your own measurements for a personalized fit.",
    },
    {
      icon: <FaCut />,
      title: "Your Design",
      text: "Customize your outfit according to your preferred design.",
    },
    {
      icon: <FaTruck />,
      title: "Safe Delivery",
      text: "Your custom outfit is carefully prepared and delivered safely.",
    },
  ];

  return (
    <section className="custom-benefits">

      <div className="benefits-heading">
        <span>WHY CHOOSE US</span>

        <h2>
          Made Especially For You
        </h2>
      </div>

      <div className="benefits-grid">

        {benefits.map((item, index) => (
          <div className="benefit-card" key={index}>

            <div className="benefit-icon">
              {item.icon}
            </div>

            <h3>{item.title}</h3>

            <p>{item.text}</p>

          </div>
        ))}

      </div>

    </section>
  );
}

export default CustomBenefits;