import { CircleCheck, ImageIcon, Ruler, Shirt } from "lucide-react";

import "./CustomSteps.css";

function CustomSteps() {
  const steps = [
    {
      number: "01",
      icon: <ImageIcon />,
      title: "Share Your Design",
      text: "Upload or share a reference image of the outfit you want.",
    },
    {
      number: "02",
      icon: <Shirt />,
      title: "Choose Fabric & Color",
      text: "Select your preferred fabric, color and other outfit details.",
    },
    {
      number: "03",
      icon: <Ruler />,
      title: "Add Your Measurements",
      text: "Provide your measurements so your outfit can be made according to your size.",
    },
    {
      number: "04",
      icon: <CircleCheck />,
      title: "Confirm Your Order",
      text: "Review all your details and confirm your custom stitching order.",
    },
  ];

  return (
    <section className="custom-steps-section">

      <div className="custom-section-heading">
        <span>HOW IT WORKS</span>

        <h2>
          Create Your Custom Outfit
        </h2>

        <p>
          Follow four simple steps to turn your idea into a personalized outfit.
        </p>
      </div>

      <div className="custom-steps-grid">

        {steps.map((step) => (
          <div className="custom-step-card" key={step.number}>

            <div className="custom-step-top">
              <span>{step.number}</span>

              <div className="custom-step-icon">
                {step.icon}
              </div>
            </div>

            <h3>{step.title}</h3>

            <p>{step.text}</p>

          </div>
        ))}

      </div>

    </section>
  );
}

export default CustomSteps;