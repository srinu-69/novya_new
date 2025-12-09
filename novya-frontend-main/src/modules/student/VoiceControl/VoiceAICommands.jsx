// src/modules/student/VoiceAICommands.jsx
import React, { useEffect, useRef, useState } from "react";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;

export default function VoiceAICommands({ 
  onVoiceCommand,
  onTranscript,
  size = "small",
  position = "right"
}) {
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const finalTranscriptRef = useRef("");
  const lastFinalIndexRef = useRef(-1);

  const SILENCE_MS = 1200;

  useEffect(() => {
    if (!SpeechRecognition) {
      console.warn("SpeechRecognition not supported in this browser.");
      return;
    }

    const rec = new SpeechRecognition();
    recognitionRef.current = rec;

    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      finalTranscriptRef.current = "";
      lastFinalIndexRef.current = -1;
      setIsListening(true);
    };

    rec.onresult = (event) => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

      let hasNewFinal = false;

      for (let i = Math.max(event.resultIndex, lastFinalIndexRef.current + 1); i < event.results.length; i++) {
        const result = event.results[i];
        
        if (result.isFinal) {
          finalTranscriptRef.current += result[0].transcript + " ";
          lastFinalIndexRef.current = i;
          hasNewFinal = true;
        }
      }

      if (hasNewFinal) {
        silenceTimerRef.current = setTimeout(() => {
          processFinalTranscript(finalTranscriptRef.current);
          finalTranscriptRef.current = "";
          lastFinalIndexRef.current = -1;
        }, SILENCE_MS);
      }
    };

    rec.onerror = (err) => {
      console.error("SpeechRecognition error", err);
      if (finalTranscriptRef.current.trim()) {
        processFinalTranscript(finalTranscriptRef.current);
      }
      cleanup();
      setIsListening(false);
    };

    rec.onend = () => {
      if (finalTranscriptRef.current.trim()) {
        processFinalTranscript(finalTranscriptRef.current);
      }
      cleanup();
      setIsListening(false);
    };

    return () => {
      cleanup();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  const cleanup = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    finalTranscriptRef.current = "";
    lastFinalIndexRef.current = -1;
  };

  const processFinalTranscript = (raw) => {
    const transcript = cleanRepeatedWords(raw.trim());
    if (!transcript) return;

    // Send transcript for input field
    if (typeof onTranscript === 'function') {
      onTranscript(transcript);
    }

    // Classify command type
    const normalized = transcript.toLowerCase();
    let type = "general";

    if (normalized.includes("study plan") || normalized.includes("plan")) {
      type = "study_plan";
    } else if (normalized.includes("notes") || normalized.includes("make notes") || normalized.includes("note")) {
      type = "notes";
    } else if (normalized.includes("explain") || normalized.includes("explain this")) {
      type = "explanation";
    } else if (normalized.includes("practice") || normalized.includes("practice questions") || normalized.includes("questions")) {
      type = "practice";
    }

    // Send command callback
    if (typeof onVoiceCommand === 'function') {
      onVoiceCommand(type, transcript);
    }
  };

  const cleanRepeatedWords = (text) => {
    const words = text.split(/\s+/);
    const cleanedWords = [];
    
    for (let i = 0; i < words.length; i++) {
      if (i === 0 || words[i] !== words[i - 1]) {
        cleanedWords.push(words[i]);
      }
    }
    
    return cleanedWords.join(" ");
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      console.warn("Speech recognition not available");
      return;
    }
    
    try {
      recognitionRef.current.start();
    } catch (e) {
      try {
        recognitionRef.current.stop();
        setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.start();
          }
        }, 100);
      } catch (err) {
        console.warn("Start error:", err);
      }
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    
    try {
      recognitionRef.current.stop();
    } catch (e) {
      // Ignore
    }
    
    cleanup();
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const buttonSize = size === "large" ? 24 : 20;
  const buttonPadding = size === "large" ? "10px" : "8px";

  return (
    <button
      type="button"
      onClick={toggleListening}
      title={isListening ? "Stop voice input" : "Start voice input"}
      className="voice-input-button"
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: buttonPadding,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: isListening ? '#ef4444' : '#6b7280',
        transition: 'all 0.2s ease',
        position: position === 'absolute' ? 'absolute' : 'static',
        right: position === 'absolute' ? '8px' : 'auto',
        top: position === 'absolute' ? '50%' : 'auto',
        transform: position === 'absolute' ? 'translateY(-50%)' : 'none',
        zIndex: 10,
      }}
    >
      {isListening ? (
        <svg width={buttonSize} height={buttonSize} viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="5" fill="#ef4444" />
          <circle cx="12" cy="12" r="9" stroke="#ef4444" strokeWidth="2" fill="none">
            <animate
              attributeName="r"
              from="9"
              to="11"
              dur="1s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              from="1"
              to="0"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      ) : (
        <svg width={buttonSize} height={buttonSize} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
        </svg>
      )}
    </button>
  );
}