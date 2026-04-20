import React from "react";
import "../styles/mascot.css";
import { expressions } from "../utils/expressions";

const Mascot = ({}) => {
  const data = {
    msg: "Let's learn about the Pythagorean theorem!",
    image: null,
  };
  // data object contains: { msg: string, image: string | null }
  const hasImage = !!data.image;

  return (
    <div className="main-content">
      {/* 1. Mascot & Image Container */}
      <div
        className={`display-stage ${hasImage ? "layout-split" : "layout-centered"}`}
      >
        {/* Mascot Column */}
        <div className="mascot-wrapper">
          <div className="mascot-frame">
            {/* Replace with your dynamic GIF logic */}
            <img src={expressions.happy} alt="Mascot" className="mascot-gif" />
          </div>
        </div>

        {/* Concept Image Column (Conditional) */}
        {hasImage && (
          <div className="content-image-wrapper">
            <img
              src={data.image}
              alt="Learning Material"
              className="concept-visual"
            />
          </div>
        )}
      </div>

      {/* 2. Mascot Speech/Text Field */}
      <div className="speech-container">
        <div className="speech-bubble">
          <p className="mascot-text">{data.msg}</p>
        </div>
      </div>
    </div>
  );
};

export default Mascot;
