import "../styles/mascot.css";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { expressions } from "../utils/expressions";

const Mascot = () => {
  const { mascotData, status } = useSelector((state) => state.chat);

  useEffect(() => {
    const messageToSpeak = mascotData?.msg;

    if (!messageToSpeak || status === "loading") return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(messageToSpeak);

    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      utterance.voice =
        voices.find(
          (v) => v.name.includes("Google") || v.name.includes("Female"),
        ) || voices[0];
      utterance.pitch = 1.1;
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      setVoice();
    } else {
      window.speechSynthesis.onvoiceschanged = setVoice;
    }

    return () => window.speechSynthesis.cancel();
  }, [mascotData?.msg, status]);

  const getExpression = () => {
    if (status === "loading") return expressions.thinking;
    const exprKey = mascotData?.expression || "teaching";
    return expressions[exprKey] || expressions.teaching;
  };

  const apiImage = mascotData?.image;
  const hasImage = !!apiImage;

  return (
    <div className="main-content">
      {status === "loading" && (
        <div className="status-indicator">Tutor is thinking...</div>
      )}

      <div
        className={`display-stage ${hasImage ? "layout-split" : "layout-centered"}`}
      >
        <div className="mascot-wrapper">
          <div className="mascot-frame">
            <img src={getExpression()} alt="Mascot" className="mascot-gif" />
          </div>
        </div>

        {hasImage && (
          <div className="mcq-corner">
            <div className="mcq-card">
              <img
                src={apiImage}
                alt="Question visual"
                style={{ maxWidth: "100%", borderRadius: "12px" }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="speech-container">
        <div className="speech-bubble">
          <p className="mascot-text">
            {status === "loading" ? "Hmm, let me think..." : mascotData?.msg}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Mascot;
