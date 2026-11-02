import Image from "next/image";
import Link from "next/link";
import "./unstiched.css";

import {
  FaGlobe,
  FaUndo,
  FaLock,
  FaAward,
  FaCut,
} from "react-icons/fa";

export default function CustomStitchBanner() {

  const badges = [
    {
      id: 1,
      icon: <FaGlobe />,
      title: "Worldwide Shipping",
      description: "Delivering joy worldwide",
    },
    {
      id: 2,
      icon: <FaUndo />,
      title: "7 Days Return",
      description: "Easy returns & exchanges",
    },
    {
      id: 3,
      icon: <FaLock />,
      title: "Secure Payment",
      description: "100% secure checkout",
    },
    {
      id: 4,
      icon: <FaAward />,
      title: "Quality Promise",
      description: "We promise the best quality",
    },
  ];

  return (
    <>
      {/* WANT SOMETHING UNIQUE BANNER */}

      <div className="container">

        <section className="custom-banner-section">

          <div className="custom-banner-container">

            {/* Left Decorative Image */}

            <div className="banner-decor left-decor">

              <Image
                src="/unstitched.jpeg"
                alt="Measuring Tape"
                fill
                sizes="(max-width: 650px) 0px, 220px"
                className="banner-image-fill"
              />

            </div>


            {/* Center Text Content */}

            <div className="banner-content">

              <h2 className="banner-title">
                Want Something Unique?
              </h2>

              <span className="banner-subtitle-badge">
                Get Your Own Design Stitched
              </span>

              <p className="banner-description">
                Send us your design, size & details on WhatsApp
                <br />
                and we&apos;ll stitch it exactly how you want.
              </p>

              <Link
                href="/customStitch"
                className="banner-btn"
              >
                <span className="btn-icon">
                  <FaCut />
                </span>

                Start Custom Stitch Order
              </Link>

            </div>


            {/* Right Decorative Image */}

            <div className="banner-decor right-decor">

              <Image
                src="/unstiched-design.jpeg"
                alt="Custom Stitching Mannequin"
                width={240}
                height={240}
                className="banner-image"
              />

            </div>

          </div>

        </section>

      </div>


      {/* TRUST BADGES / FEATURES SECTION */}

      <div className="container">

        <section className="trust-badges-section">

          <div className="trust-badges-grid">

            {badges.map((badge) => (

              <div
                key={badge.id}
                className="badge-card"
              >

                <div className="badge-icon-wrapper">

                  <span className="badge-icon">
                    {badge.icon}
                  </span>

                </div>

                <div className="badge-info">

                  <h4 className="badge-title">
                    {badge.title}
                  </h4>

                  <p className="badge-desc">
                    {badge.description}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </section>

      </div>

    </>
  );
}