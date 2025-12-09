import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import './VoiceAssistant.css';

const VoiceAssistant = ({ 
  onVoiceCommand, 
  currentState = {},
  disabled = false
}) => {
  const { t } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  
  const speechSynthesis = window.speechSynthesis;
  
  // Initialize speech recognition
  useEffect(() => {
    if (disabled) return;
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onstart = () => {
        console.log('Voice recognition started');
        setIsListening(true);
        setVoiceFeedback("Listening...");
      };
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Voice command received:', transcript);
        setVoiceFeedback(`Heard: "${transcript}"`);
        handleVoiceCommand(transcript);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error !== 'aborted') {
          speak("Sorry, I didn't catch that. Please try again.");
        }
      };
      
      recognitionInstance.onend = () => {
        console.log('Voice recognition ended');
        setIsListening(false);
        setVoiceFeedback('');
      };
      
      setRecognition(recognitionInstance);
    } else {
      console.warn('Speech recognition not supported');
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
    };
  }, [disabled]);

  // Speech synthesis function
  const speak = useCallback((text) => {
    if (!speechSynthesis || disabled) return;

    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setVoiceFeedback(text);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setTimeout(() => setVoiceFeedback(''), 2000);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      setVoiceFeedback('');
    };
    
    speechSynthesis.speak(utterance);
  }, [speechSynthesis, disabled]);

  // Handle voice commands
  const handleVoiceCommand = async (command) => {
    console.log('Processing command:', command, 'Current state:', currentState);
    
    // Help command
    if (command.toLowerCase().includes('help')) {
      setShowHelp(true);
      speak("Available commands: Class 7, Computer, Chapter 1, Start Test, Back to Chapters. Say Help anytime.");
      return;
    }
    
    // Send command to backend
    try {
      const response = await fetch('http://localhost:8000/voice-command/mocktest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: command,
          current_state: currentState
        })
      });
      
      const data = await response.json();
      console.log('Backend response:', data);
      
      if (data.success) {
        // Speak the response message
        if (data.message) {
          speak(data.message);
        }
        
        // Pass the action to parent component
        if (onVoiceCommand) {
          onVoiceCommand(data);
        }
      } else {
        speak(data.message || "Sorry, I didn't understand. Try 'Help' for commands.");
      }
    } catch (error) {
      console.error('Error sending voice command:', error);
      speak("Connection error. Please check your internet.");
    }
  };

  // Start listening
  const startListening = () => {
    if (disabled) {
      speak("Voice assistant is disabled during the test. Please use the on-screen controls.");
      return;
    }
    
    if (recognition && !isListening) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        speak("Sorry, I couldn't start listening.");
      }
    }
  };

  // Stop listening
  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  // Toggle listening
  const toggleListening = () => {
    if (disabled) {
      speak("Voice commands are disabled during the test. Focus on your exam!");
      return;
    }
    
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Read current state
  const readCurrentState = () => {
    if (disabled) return;
    
    let stateMessage = '';
    
    if (currentState.selected_class) {
      stateMessage += `Class: ${currentState.selected_class}. `;
    }
    
    if (currentState.selected_subject) {
      stateMessage += `Subject: ${currentState.selected_subject}. `;
    }
    
    if (currentState.selected_chapter) {
      stateMessage += `Chapter: ${currentState.selected_chapter}. `;
    }
    
    if (currentState.inTest) {
      stateMessage += `You are in a test. `;
    }
    
    if (stateMessage) {
      speak(stateMessage);
    } else {
      speak("Please select a class to begin. Say 'Class 7'.");
    }
  };

  // Don't render if disabled and in test
  if (disabled && currentState.inTest) {
    return null;
  }

  return (
    <div className="voice-assistant-container">
      {/* Main Voice Assistant Button */}
      <div className="voice-assistant-main">
        <button
          className={`voice-toggle-btn ${isListening ? 'listening' : ''} ${isSpeaking ? 'speaking' : ''} ${disabled ? 'disabled' : ''}`}
          onClick={toggleListening}
          title={disabled ? "Voice assistant disabled during test" : (isListening ? "Stop Listening" : "Start Voice Command")}
          disabled={disabled}
        >
          <span className="voice-icon">
            {disabled ? '🚫' : (isListening ? '🎤' : isSpeaking ? '🔊' : '🎤')}
          </span>
          <span className="voice-status">
            {disabled ? 'Voice Disabled' : (isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Voice Assist')}
          </span>
        </button>
        
        {!disabled && (
          <div className="voice-controls">
            <button
              className="voice-control-btn read-state-btn"
              onClick={readCurrentState}
              title="Read Current State"
            >
              📢 Current
            </button>
            <button
              className="voice-control-btn help-btn"
              onClick={() => setShowHelp(!showHelp)}
              title="Show Help"
            >
              ❓ Help
            </button>
          </div>
        )}
      </div>

      {/* Voice Feedback Display */}
      {voiceFeedback && !disabled && (
        <div className="voice-feedback">
          <div className="feedback-icon">💬</div>
          <div className="feedback-text">{voiceFeedback}</div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && !disabled && (
        <div className="help-modal" onClick={() => setShowHelp(false)}>
          <div className="help-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="help-header">
              <h3>🎤 NOVYA Voice Assistant - Available Commands</h3>
              <button className="close-help" onClick={() => setShowHelp(false)}>×</button>
            </div>
            <div className="help-body">
              <div className="commands-section">
                <h4>📚 NAVIGATION:</h4>
                <ul>
                  <li><strong>"Select Class 7th"</strong> - Choose class</li>
                  <li><strong>"Select Subject Computer"</strong> - Choose subject</li>
                  <li><strong>"Select Chapter 1"</strong> - Choose chapter</li>
                  <li><strong>"Start Test" or "Begin Exam"</strong> - Start mock test</li>
                </ul>
              </div>
              
              <div className="commands-section">
                <h4>↩️ BACK NAVIGATION:</h4>
                <ul>
                  <li><strong>"Back to Chapters"</strong></li>
                  <li><strong>"Back to Subjects"</strong></li>
                  <li><strong>"Back to Classes"</strong></li>
                  <li><strong>"Back to Practice" or "Home"</strong></li>
                </ul>
              </div>
              
              <div className="commands-section">
                <h4>📝 TEST CONTROL:</h4>
                <ul>
                  <li><strong>"Next Question" / "Previous Question"</strong></li>
                  <li><strong>"Skip Question"</strong></li>
                  <li><strong>"Option A" / "Select Option B"</strong></li>
                  <li><strong>"Finish Test" / "Submit Answers"</strong></li>
                </ul>
              </div>
              
              <div className="commands-section">
                <h4>⚙️ SETTINGS:</h4>
                <ul>
                  <li><strong>"Change Language to English"</strong></li>
                  <li><strong>"Show Instructions"</strong></li>
                  <li><strong>"Show Score" / "Show Time"</strong></li>
                </ul>
              </div>
              
              <div className="commands-section">
                <h4>💡 FEATURES:</h4>
                <ul>
                  <li><strong>"Show Hint"</strong> (Costs 5 points)</li>
                  <li><strong>"Review Questions"</strong></li>
                  <li><strong>"What is selected?"</strong></li>
                  <li><strong>"Retry Test" / "Next Level"</strong></li>
                </ul>
              </div>
              
              <div className="commands-section">
                <h4>💡 TIPS:</h4>
                <ul>
                  <li>Voice commands are disabled during tests</li>
                  <li>Speak clearly and naturally</li>
                  <li>Say "Help" anytime for commands list</li>
                  <li>Example: "Select Class 7th" or "Option B"</li>
                </ul>
              </div>
            </div>
            <div className="help-footer">
              <button className="close-help-btn" onClick={() => setShowHelp(false)}>
                Close Help
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
