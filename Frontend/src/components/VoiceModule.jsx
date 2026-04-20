import "../styles/voice-module.css";
import { sendMessage } from "../states/chat";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect, useRef } from "react";

const VoiceModule = () => {
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);

  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.chat);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputText(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleFinalSubmission = (text) => {
    if (text.trim() && status !== "loading") {
      dispatch(sendMessage(text));
      setInputText("");
    }
  };

  const toggleMic = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      handleFinalSubmission(inputText);
    } else {
      setInputText("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleInputChange = (e) => setInputText(e.target.value);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputText.trim()) {
      if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
      handleFinalSubmission(inputText);
    }
  };

  return (
    <footer className="voice-footer">
      <div className="input-container">
        <div
          className={`input-row ${status === "loading" ? "row-disabled" : ""}`}
        >
          <input
            type="text"
            className="voice-to-text-input"
            placeholder={
              status === "loading"
                ? "Tutor is thinking..."
                : isListening
                  ? "Listening..."
                  : "Talk to your tutor..."
            }
            value={inputText}
            onKeyDown={handleKeyDown}
            onChange={handleInputChange}
            disabled={status === "loading"}
          />

          <button
            onClick={toggleMic}
            disabled={status === "loading"}
            aria-label="Activate Microphone"
            className={`mic-trigger ${isListening ? "listening" : ""}`}
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
