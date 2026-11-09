import Image from "next/image";
import "./unstiched.css";

import { Award, Globe2, LockKeyhole, Scissors, Undo2 } from "lucide-react";

export default function CustomStitchBanner() {

  const badges = [
    {
      id: 1,
      icon: <Globe2 />,
      title: "Worldwide Shipping",
      description: "Delivering joy worldwide",
    },
    {
      id: 2,
      icon: <Undo2 />,
      title: "7 Days Return",
      description: "Easy returns & exchanges",
    },
    {
      id: 3,
      icon: <LockKeyhole />,
      title: "Secure Payment",
      description: "100% secure checkout",
    },
    {
      id: 4,
      icon: <Award />,
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

              <a
                href="https://wa.me/923710313814?text=Assalam-o-Alaikum%2C%20I%20would%20like%20to%20place%20a%20custom%20stitching%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="banner-btn"
              >
                <span className="btn-icon">
                  <Scissors />
                </span>

                Start Custom Stitch Order
              </a>

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