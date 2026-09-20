import React from "react";
import "./aboutHero.css";

function AboutHero() {
    return (
        <section className="about-hero">
            <div className="about-hero-content">
                <p className="about-small-title">About Us</p>

                <h1>
                    Stitching Dreams,
                    <br />
                    <span>Delivering Happiness</span>
                </h1>

                <p className="about-description">
                    At UnStage, we believe fashion is more than just clothing —
                    it's about you. We stitch happiness with every thread.
                </p>

                <button>Our Journey</button>
            </div>

            <div className="about-hero-image">
                <img src="/about-main.jpeg" alt="Fashion Collection" />
            </div>
        </section>
    );
}

export default AboutHero;