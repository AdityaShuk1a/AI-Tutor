import React, { useState } from 'react';
import '../styles/voice-module.css';

const VoiceModule = ({ onSend }) => {
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);

  // Simulation of the Mic Toggle
  const toggleMic = () => {
    setIsListening(!isListening);
    // In the future, you'll trigger the Web Speech API here
  };

  return (
    <footer className="voice-footer">
      <div className="input-container">
        {/* The text field that shows what the user is saying */}
        <div className="input-row">
          <input 
            type="text" 
            className="voice-to-text-input"
            placeholder="Talk to your tutor..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          
          {/* Professional Mic Button */}
          <button 
            className={`mic-trigger ${isListening ? 'listening' : ''}`}
            onClick={toggleMic}
            aria-label="Activate Microphone"
          >
            <div className="pulse-ring"></div>
            <svg viewBox="0 0 24 24" className="mic-icon">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default VoiceModule;