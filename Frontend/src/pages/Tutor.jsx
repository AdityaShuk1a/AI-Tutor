import "../styles/home.css";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Mascot from "../components/Mascot";
import VoiceModule from "../components/VoiceModule";

export function Tutor() {
  const [step, setStep] = useState("teaching");

  return (
    <div className="main-container">
      <Navbar />
      <Mascot />
      <VoiceModule onSend={() => {}} />
    </div>
  );
}
