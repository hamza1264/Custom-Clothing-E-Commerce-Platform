"use client";

import { MapPin, Phone, Upload, UserRound } from "lucide-react";
import { useState } from "react";
import "./CustomForm.css";

function CustomForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    category: "",
    fabric: "",
    color: "",
    size: "",
    measurements: "",
    requirements: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Custom order submitted successfully!");
  };

  return (
    <section className="custom-form-section" id="custom-order">

      <div className="custom-form-heading">
        <span>START YOUR ORDER</span>

        <h2>
          Customize Your Outfit
        </h2>

        <p>
          Fill in your details below and tell us exactly how you want
          your outfit to be made.
        </p>
      </div>

      <div className="custom-form-container">

        <form onSubmit={handleSubmit}>

          {/* Personal Details */}

          <div className="form-group-title">
            <UserRound />
            <h3>Personal Details</h3>
          </div>

          <div className="form-row">

            <div className="form-field">
              <label>Your Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label>Phone Number</label>

              <input
                type="tel"
                name="phone"
                placeholder="03XX XXXXXXX"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          {/* Outfit Details */}

          <div className="form-group-title">
            <h3>Outfit Details</h3>
          </div>

          <div className="form-row">

            <div className="form-field">
              <label>Outfit Type</label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Outfit</option>
                <option value="2-piece">2 Piece</option>
                <option value="3-piece">3 Piece</option>
                <option value="dress">Dress</option>
                <option value="formal">Formal</option>
              </select>
            </div>

            <div className="form-field">
              <label>Fabric</label>

              <select
                name="fabric"
                value={formData.fabric}
                onChange={handleChange}
                required
              >
                <option value="">Select Fabric</option>
                <option value="lawn">Lawn</option>
                <option value="cotton">Cotton</option>
                <option value="silk">Silk</option>
                <option value="chiffon">Chiffon</option>
                <option value="velvet">Velvet</option>
              </select>
            </div>

          </div>

          <div className="form-row">

            <div className="form-field">
              <label>Preferred Color</label>

              <input
                type="text"
                name="color"
                placeholder="e.g. Pink, Black, Blue"
                value={formData.color}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>Size</label>

              <select
                name="size"
                value={formData.size}
                onChange={handleChange}
                required
              >
                <option value="">Select Size</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="custom">Custom Measurements</option>
              </select>
            </div>

          </div>

          {/* Measurements */}

          <div className="form-field">
            <label>Measurements</label>

            <textarea
              name="measurements"
              placeholder="Enter your measurements..."
              value={formData.measurements}
              onChange={handleChange}
              rows="4"
            />
          </div>

          {/* Design Upload */}

          <div className="form-field">
            <label>Upload Design / Reference</label>

            <label className="upload-box">

              <Upload />

              <span>
                Click to upload your design
              </span>

              <input
                type="file"
                accept="image/*"
              />

            </label>
          </div>

          {/* Requirements */}

          <div className="form-field">
            <label>Special Requirements</label>

            <textarea
              name="requirements"
              placeholder="Tell us about embroidery, sleeves, neckline or any other requirements..."
              value={formData.requirements}
              onChange={handleChange}
              rows="5"
            />
          </div>

          {/* Address */}

          <div className="form-group-title">
            <MapPin />
            <h3>Delivery Address</h3>
          </div>

          <div className="form-field">

            <textarea
              name="address"
              placeholder="Enter your complete delivery address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              required
            />

          </div>

          <button
            type="submit"
            className="custom-submit-btn"
          >
            Submit Custom Order
          </button>

        </form>

      </div>

    </section>
  );
}

export default CustomForm;