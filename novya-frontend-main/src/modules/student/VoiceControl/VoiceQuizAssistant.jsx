import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  IconButton,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Avatar,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  Mic,
  MicOff,
  SettingsVoice,
  VolumeUp,
  VolumeOff,
  Help,
  KeyboardVoice,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import { useTranslation } from 'react-i18next';

// Animation for listening pulse
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
  }
  70% {
    box-shadow: 0 0 0 20px rgba(76, 175, 80, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
`;

// Animation for thinking indicator
const thinking = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 1; }
`;

// Animation for voice wave
const wave = keyframes`
  0%, 100% { height: 10px; opacity: 0.5; }
  50% { height: 25px; opacity: 1; }
`;

const VoiceQuizAssistant = ({
  // Navigation state
  currentPage = 'class_selection', // 'class_selection', 'subject_selection', 'chapter_selection', 'quiz'
  selectedClass = null,
  selectedSubject = null,
  selectedChapter = null,
  selectedSubtopic = null,
  currentQuestion = 0,
  totalQuestions = 0,
  quizStarted = false,
  quizFinished = false,
  
  // Callbacks for navigation
  onSelectClass = () => {},
  onSelectSubject = () => {},
  onSelectChapter = () => {},
  onSelectSubtopic = () => {},
  onStartQuiz = () => {},
  onAnswerQuestion = () => {},
  onNextQuestion = () => {},
  onPreviousQuestion = () => {},
  onSkipQuestion = () => {},
  onFinishQuiz = () => {},
  onRetryQuiz = () => {},
  onNextLevel = () => {},
  onBackToChapters = () => {},
  onBackToSubjects = () => {},
  onBackToClasses = () => {},
  onBackToPractice = () => {},
  onChangeLanguage = () => {},
  
  // Quiz specific
  currentOptions = [], // ['Option A text', 'Option B text', ...]
  currentScore = 0,
  showHint = () => {},
  showInstructions = () => {},
  
  // Available data
  availableClasses = [],
  availableSubjects = [],
  availableChapters = [],
  availableSubtopics = [],
  availableLanguages = ['English', 'Telugu', 'Hindi', 'Tamil', 'Kannada', 'Malayalam']
}) => {
  const { t } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [lastCommand, setLastCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [confirmationDialog, setConfirmationDialog] = useState({ open: false, message: '', action: null });
  const [audioLevel, setAudioLevel] = useState(0);
  const [activeCommands, setActiveCommands] = useState([]);
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported');
      setVoiceEnabled(false);
      showSnackbar('Voice assistant is not supported in your browser', 'warning');
      return;
    }

    const newRecognition = new SpeechRecognition();
    newRecognition.continuous = true;
    newRecognition.interimResults = false;
    newRecognition.lang = 'en-IN'; // Indian English
    newRecognition.maxAlternatives = 1;

    // Create grammar for better recognition
    if (SpeechGrammarList) {
      const grammar = `#JSGF V1.0; grammar commands; public <command> = 
        select | choose | open | go to | start | begin | answer | option |
        next | previous | skip | finish | submit | back | return |
        class | grade | subject | chapter | topic | subtopic |
        test | quiz | practice | exam | hint | help | language |
        a | b | c | d | one | two | three | four | five | six | seven | eight | nine | ten |
        english | telugu | hindi | tamil | kannada | malayalam |
        mocktest | quickpractice | classroom | learn | career | studyroom;
      `;
      const speechRecognitionList = new SpeechGrammarList();
      speechRecognitionList.addFromString(grammar, 1);
      newRecognition.grammars = speechRecognitionList;
    }

    newRecognition.onresult = handleSpeechResult;
    newRecognition.onerror = handleSpeechError;
    newRecognition.onend = handleSpeechEnd;

    setRecognition(newRecognition);
    recognitionRef.current = newRecognition;

    // Initialize audio analysis for visual feedback
    initializeAudioAnalysis();

    // Set available commands based on current page
    updateActiveCommands();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [currentPage]);

  // Update active commands when page changes
  useEffect(() => {
    updateActiveCommands();
  }, [currentPage, selectedClass, selectedSubject, selectedChapter, quizStarted, quizFinished]);

  const initializeAudioAnalysis = async () => {
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      microphoneRef.current.connect(analyserRef.current);
      
      // Start audio level monitoring
      monitorAudioLevel();
    } catch (error) {
      console.warn('Audio analysis not available:', error);
    }
  };

  const monitorAudioLevel = () => {
    if (!analyserRef.current) return;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const updateLevel = () => {
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        setAudioLevel(Math.min(average / 2, 100)); // Normalize to 0-100
        animationFrameRef.current = requestAnimationFrame(updateLevel);
      }
    };
    
    updateLevel();
  };

  const updateActiveCommands = () => {
    let commands = [];
    
    switch (currentPage) {
      case 'class_selection':
        commands = [
          'Select class [7th/8th/9th/10th]',
          'Class [7th/8th/9th/10th]',
          'Class [7/8/9/10]',
          'Open Grade [7/8/9/10]',
          'Choose grade [7/8/9/10]',
          'Go back to dashboard',
          'Show help',
          'Toggle voice on/off'
        ];
        break;
        
      case 'subject_selection':
        commands = [
          'Select subject [computers/english/maths/science]',
          'Back to classes',
          'Show subjects for class [class]',
          'What subjects are available?',
          'Help'
        ];
        break;
        
      case 'chapter_selection':
        commands = [
          'Select chapter [1/2/3]',
          'Open chapter [name]',
          'Show chapters',
          'Back to subjects',
          'Start mock test',
          'Quick practice'
        ];
        break;
        
      case 'subtopic_selection':
        commands = [
          'Select subtopic [name]',
          'Start quiz',
          'Back to chapters',
          'Change language to [language]',
          'Show instructions'
        ];
        break;
        
      case 'quiz':
        if (!quizStarted) {
          commands = [
            'Start quiz',
            'Begin test',
            'Back to topics',
            'Change language',
            'Show instructions'
          ];
        } else if (!quizFinished) {
          commands = [
            'Option A/B/C/D',
            'Select option [A/B/C/D]',
            'Next question',
            'Previous question',
            'Skip question',
            'Show hint',
            'Finish test',
            'Submit answers'
          ];
        } else {
          commands = [
            'Back to chapters',
            'Retry quiz',
            'Next level',
            'Share results',
            'Download report',
            'Show explanations'
          ];
        }
        break;
        
      default:
        commands = ['Help', 'Start voice assistant', 'Show commands'];
    }
    
    setActiveCommands(commands);
  };

  const handleSpeechResult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
    console.log('Voice command detected:', transcript);
    setLastCommand(transcript);
    
    // Process command
    processVoiceCommand(transcript);
    
    // Add to history
    setCommandHistory(prev => [...prev.slice(-9), transcript]);
  };

  const handleSpeechError = (event) => {
    console.error('Speech recognition error:', event.error);
    if (event.error === 'no-speech') {
      showSnackbar('No speech detected. Try again.', 'warning');
    } else if (event.error === 'audio-capture') {
      showSnackbar('Microphone not available. Please check permissions.', 'error');
    } else if (event.error === 'not-allowed') {
      showSnackbar('Microphone access denied. Please enable permissions.', 'error');
      setVoiceEnabled(false);
    }
    setIsListening(false);
  };

  const handleSpeechEnd = () => {
    if (isListening) {
      // Automatically restart listening
      setTimeout(() => {
        if (recognitionRef.current && isListening) {
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.error('Error restarting recognition:', error);
          }
        }
      }, 100);
    }
  };

  const processVoiceCommand = useCallback((command) => {
    if (!command.trim()) return;
    
    setIsProcessing(true);
    
    // Normalize command
    const normalizedCmd = command.toLowerCase().trim();
    
    // Extract numbers from command
    const numbers = normalizedCmd.match(/\d+/g);
    const firstNumber = numbers ? parseInt(numbers[0]) : null;
    
    // Extract words for matching
    const words = normalizedCmd.split(' ');
    
    // Log for debugging
    console.log('Processing command:', {
      command: normalizedCmd,
      currentPage,
      numbers,
      words
    });

    let actionTaken = false;
    let responseMessage = '';
    
    try {
      // 1. NAVIGATION COMMANDS
      if (normalizedCmd.includes('back to') || normalizedCmd.includes('go back')) {
        if (normalizedCmd.includes('class') || normalizedCmd.includes('grade')) {
          if (onBackToClasses) {
            onBackToClasses();
            responseMessage = 'Going back to class selection';
            actionTaken = true;
          }
        } else if (normalizedCmd.includes('subject')) {
          if (onBackToSubjects) {
            onBackToSubjects();
            responseMessage = 'Going back to subject selection';
            actionTaken = true;
          }
        } else if (normalizedCmd.includes('chapter') || normalizedCmd.includes('topic')) {
          if (onBackToChapters) {
            onBackToChapters();
            responseMessage = 'Going back to chapter selection';
            actionTaken = true;
          }
        } else if (normalizedCmd.includes('practice') || normalizedCmd.includes('home')) {
          if (onBackToPractice) {
            onBackToPractice();
            responseMessage = 'Going back to practice menu';
            actionTaken = true;
          }
        }
      }
      
      // 2. SELECTION COMMANDS
      else if (normalizedCmd.includes('select') || normalizedCmd.includes('choose') || normalizedCmd.includes('open')) {
        // Class selection
        if (normalizedCmd.includes('class') || normalizedCmd.includes('grade')) {
          const classMatch = normalizedCmd.match(/class\s+(\d+)/) || normalizedCmd.match(/grade\s+(\d+)/);
          const classNum = classMatch ? parseInt(classMatch[1]) : firstNumber;
          
    // ✅ FORCE CLASS STRING MATCH
if (normalizedCmd.includes("class") || normalizedCmd.includes("grade")) {
  const num = firstNumber;

  if (!num) {
    responseMessage = "Please say a class number like 7, 8, 9 or 10";
    return;
  }

  const formatted = `${num}th`;

  console.log("✅ FINAL CLASS STRING:", formatted);

  if (availableClasses.includes(formatted)) {
    onSelectClass(formatted);   // ✅ THIS FIXES NAVIGATION
    responseMessage = `Class ${formatted} opened`;
    actionTaken = true;
  } else {
    responseMessage = `Class ${formatted} not available`;
  }

  return;
}


        }
        
        // Subject selection
        else if (normalizedCmd.includes('subject')) {
          const subjectMap = {
            'computer': 'Computers',
            'computers': 'Computers',
            'english': 'English',
            'math': 'Mathematics',
            'maths': 'Mathematics',
            'mathematics': 'Mathematics',
            'science': 'Science',
            'history': 'History',
            'civics': 'Civics',
            'geography': 'Geography',
            'economics': 'Economics'
          };
          
          for (const [key, value] of Object.entries(subjectMap)) {
            if (normalizedCmd.includes(key)) {
              if (availableSubjects.includes(value)) {
                if (onSelectSubject) {
                  onSelectSubject(value);
                  responseMessage = `${value} subject selected`;
                  actionTaken = true;
                }
              } else {
                responseMessage = `${value} not available for this class`;
              }
              break;
            }
          }
        }
        
        // Chapter selection
        else if (normalizedCmd.includes('chapter')) {
          const chapterNum = firstNumber;
         if (chapterNum) {
  const chapterMatch = availableChapters.find(ch =>
    ch.toLowerCase().includes(`chapter ${chapterNum}`)
  );

  if (chapterMatch) {
    onSelectChapter(chapterMatch);
    responseMessage = `Chapter ${chapterNum} selected`;
    actionTaken = true;
  } else {
    responseMessage = `Chapter ${chapterNum} not found`;
  }
}
        }
        
        // Subtopic selection
        else if (normalizedCmd.includes('subtopic') || normalizedCmd.includes('topic')) {
          if (availableSubtopics.length > 0) {
            // Try to match subtopic by name or number
           let matchedSubtopic = availableSubtopics.find(topic =>
  normalizedCmd.includes(topic.toLowerCase())
);

if (!matchedSubtopic && firstNumber) {
  matchedSubtopic = availableSubtopics[firstNumber - 1];
}

if (matchedSubtopic) {
  onSelectSubtopic(matchedSubtopic);
  responseMessage = `Subtopic selected: ${matchedSubtopic}`;
  actionTaken = true;
}

          }
        }
      }
      
      // 3. QUIZ CONTROL COMMANDS
      else if (normalizedCmd.includes('start') || normalizedCmd.includes('begin')) {
        if (normalizedCmd.includes('quiz') || normalizedCmd.includes('test') || normalizedCmd.includes('practice')) {
          if (onStartQuiz) {
            onStartQuiz();
            responseMessage = 'Starting quiz. Good luck!';
            actionTaken = true;
          }
        }
      }
      
      else if (normalizedCmd.includes('next question') || normalizedCmd.includes('next')) {
        if (onNextQuestion) {
          onNextQuestion();
          responseMessage = 'Moving to next question';
          actionTaken = true;
        }
      }
      
      else if (normalizedCmd.includes('previous question') || normalizedCmd.includes('previous') || normalizedCmd.includes('back question')) {
        if (onPreviousQuestion) {
          onPreviousQuestion();
          responseMessage = 'Moving to previous question';
          actionTaken = true;
        }
      }
      
      else if (normalizedCmd.includes('skip question') || normalizedCmd.includes('skip')) {
        if (onSkipQuestion) {
          onSkipQuestion();
          responseMessage = 'Skipping current question';
          actionTaken = true;
        }
      }
      
      else if (normalizedCmd.includes('finish test') || normalizedCmd.includes('submit') || normalizedCmd.includes('end test')) {
        setConfirmationDialog({
          open: true,
          message: 'Are you sure you want to finish the test?',
          action: () => {
            if (onFinishQuiz) onFinishQuiz();
            setConfirmationDialog({ open: false, message: '', action: null });
          }
        });
        actionTaken = true;
      }
      
      // 4. ANSWER SELECTION
      else if (normalizedCmd.includes('option') || normalizedCmd.includes('answer') || 
               normalizedCmd.includes('select a') || normalizedCmd.includes('select b') ||
               normalizedCmd.includes('select c') || normalizedCmd.includes('select d')) {
        
        let selectedOption = null;
        
        if (normalizedCmd.includes('option a') || normalizedCmd.includes('select a') || normalizedCmd.includes('a is correct')) {
          selectedOption = currentOptions[0];
        } else if (normalizedCmd.includes('option b') || normalizedCmd.includes('select b') || normalizedCmd.includes('b is correct')) {
          selectedOption = currentOptions[1];
        } else if (normalizedCmd.includes('option c') || normalizedCmd.includes('select c') || normalizedCmd.includes('c is correct')) {
          selectedOption = currentOptions[2];
        } else if (normalizedCmd.includes('option d') || normalizedCmd.includes('select d') || normalizedCmd.includes('d is correct')) {
          selectedOption = currentOptions[3];
        }
        
        if (selectedOption && onAnswerQuestion) {
          onAnswerQuestion(selectedOption);
          responseMessage = `Selected: ${selectedOption}`;
          actionTaken = true;
        }
      }
      
      // 5. POST-QUIZ COMMANDS
      else if (normalizedCmd.includes('retry') || normalizedCmd.includes('try again')) {
        if (onRetryQuiz) {
          onRetryQuiz();
          responseMessage = 'Retrying the quiz with new questions';
          actionTaken = true;
        }
      }
      
      else if (normalizedCmd.includes('next level')) {
        if (onNextLevel) {
          onNextLevel();
          responseMessage = 'Moving to next difficulty level';
          actionTaken = true;
        }
      }
      
      // 6. LANGUAGE COMMANDS
      else if (normalizedCmd.includes('change language') || normalizedCmd.includes('switch language')) {
        const languageMap = {
          'english': 'English',
          'telugu': 'Telugu',
          'hindi': 'Hindi',
          'tamil': 'Tamil',
          'kannada': 'Kannada',
          'malayalam': 'Malayalam'
        };
        
        for (const [key, value] of Object.entries(languageMap)) {
          if (normalizedCmd.includes(key)) {
            if (onChangeLanguage) {
              onChangeLanguage(value);
              responseMessage = `Language changed to ${value}`;
              actionTaken = true;
            }
            break;
          }
        }
      }
      
      // 7. HELP COMMANDS
      else if (normalizedCmd.includes('help') || normalizedCmd.includes('what can i say')) {
        setShowHelp(true);
        responseMessage = 'Showing available commands';
        actionTaken = true;
      }
      
      else if (normalizedCmd.includes('show hint') || normalizedCmd.includes('get hint')) {
        if (showHint) {
          showHint();
          responseMessage = 'Showing hint for current question';
          actionTaken = true;
        }
      }
      
      else if (normalizedCmd.includes('show instructions')) {
        if (showInstructions) {
          showInstructions();
          responseMessage = 'Showing quiz instructions';
          actionTaken = true;
        }
      }
      
      // 8. SYSTEM COMMANDS
      else if (normalizedCmd.includes('turn off voice') || normalizedCmd.includes('stop listening')) {
        setVoiceEnabled(false);
        stopListening();
        responseMessage = 'Voice assistant turned off';
        actionTaken = true;
      }
      
      else if (normalizedCmd.includes('turn on voice') || normalizedCmd.includes('start listening')) {
        setVoiceEnabled(true);
        startListening();
        responseMessage = 'Voice assistant turned on';
        actionTaken = true;
      }
      
      // 9. INFORMATION COMMANDS
      else if (normalizedCmd.includes('what is selected') || normalizedCmd.includes('where am i')) {
        let status = 'Current selection: ';
        if (selectedClass) status += `Class ${selectedClass}. `;
        if (selectedSubject) status += `Subject ${selectedSubject}. `;
        if (selectedChapter) status += `Chapter ${selectedChapter}. `;
        if (selectedSubtopic) status += `Subtopic ${selectedSubtopic}. `;
        if (quizStarted) status += 'You are currently taking a quiz. ';
        if (quizFinished) status += 'Quiz completed. ';
        
        responseMessage = status || 'Please select a class to begin.';
        actionTaken = true;
      }
      
      else if (normalizedCmd.includes('show score') || normalizedCmd.includes('my score')) {
        if (quizStarted || quizFinished) {
          responseMessage = `Your current score is ${currentScore} out of ${totalQuestions}`;
          actionTaken = true;
        }
      }
      
      // Default response if no command matched
      if (!actionTaken) {
        responseMessage = `I heard: "${command}". Try saying "help" to see available commands.`;
      }
      
    } catch (error) {
      console.error('Error processing voice command:', error);
      responseMessage = 'Sorry, I encountered an error processing that command.';
    } finally {
      setIsProcessing(false);
      
      // Show snackbar with response
      if (responseMessage) {
        showSnackbar(responseMessage, actionTaken ? 'success' : 'info');
        
        // Speak response if voice is enabled
        if (voiceEnabled && actionTaken) {
          speakText(responseMessage);
        }
      }
    }
  }, [
    currentPage, selectedClass, selectedSubject, selectedChapter, selectedSubtopic,
    availableClasses, availableSubjects, availableChapters, availableSubtopics,
    currentOptions, currentScore, totalQuestions, quizStarted, quizFinished,
    onSelectClass, onSelectSubject, onSelectChapter, onSelectSubtopic,
    onStartQuiz, onAnswerQuestion, onNextQuestion, onPreviousQuestion,
    onSkipQuestion, onFinishQuiz, onRetryQuiz, onNextLevel, onBackToChapters,
    onBackToSubjects, onBackToClasses, onBackToPractice, onChangeLanguage,
    showHint, showInstructions
  ]);

  const startListening = () => {
    if (!recognitionRef.current || !voiceEnabled) return;
    
    try {
      recognitionRef.current.start();
      setIsListening(true);
      showSnackbar('Listening... Speak now', 'info');
    } catch (error) {
      console.error('Error starting recognition:', error);
      showSnackbar('Error starting voice recognition', 'error');
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    
    try {
      recognitionRef.current.stop();
      setIsListening(false);
      showSnackbar('Stopped listening', 'info');
    } catch (error) {
      console.error('Error stopping recognition:', error);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const speakText = (text) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    
    setIsSpeaking(true);
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = (error) => {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleConfirmDialog = () => {
    if (confirmationDialog.action) {
      confirmationDialog.action();
    }
    setConfirmationDialog({ open: false, message: '', action: null });
  };

  const handleCloseDialog = () => {
    setConfirmationDialog({ open: false, message: '', action: null });
  };

  if (!voiceEnabled) {
    return (
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 9999,
        }}
      >
        <Tooltip title="Voice assistant not available">
          <Avatar
            sx={{
              bgcolor: 'error.main',
              cursor: 'pointer',
              width: 56,
              height: 56,
            }}
            onClick={() => {
              setVoiceEnabled(true);
              showSnackbar('Voice assistant enabled. Please refresh the page.', 'info');
            }}
          >
            <MicOff />
          </Avatar>
        </Tooltip>
      </Box>
    );
  }

  return (
    <>
      {/* Voice Assistant Floating Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {/* Audio Level Visualization */}
        {isListening && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              height: 30,
              mb: 1,
              px: 2,
              py: 1,
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              borderRadius: 2,
              backdropFilter: 'blur(10px)',
            }}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <Box
                key={i}
                sx={{
                  width: 4,
                  height: `${10 + (audioLevel / 20) * i}px`,
                  bgcolor: 'primary.main',
                  borderRadius: 1,
                  animation: `${wave} ${0.5 + i * 0.1}s infinite ease-in-out`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </Box>
        )}

        {/* Status Chip */}
        {isProcessing && (
          <Chip
            icon={<CircularProgress size={16} />}
            label="Processing..."
            size="small"
            sx={{
              bgcolor: 'warning.main',
              color: 'white',
              fontWeight: 'bold',
              animation: `${thinking} 1s infinite`,
            }}
          />
        )}

        {/* Main Voice Button */}
        <Tooltip title={isListening ? "Stop listening" : "Start voice assistant"} arrow>
          <Avatar
            sx={{
              bgcolor: isListening ? 'success.main' : 'primary.main',
              cursor: 'pointer',
              width: 64,
              height: 64,
              animation: isListening ? `${pulse} 2s infinite` : 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: '0 6px 25px rgba(0,0,0,0.4)',
              },
              transition: 'all 0.3s ease',
            }}
            onClick={toggleListening}
          >
            {isListening ? <Mic /> : <SettingsVoice />}
          </Avatar>
        </Tooltip>

        {/* Helper Buttons */}
        <Stack direction="row" spacing={1}>
          <Tooltip title="Show help">
            <IconButton
              size="small"
              sx={{
                bgcolor: 'background.paper',
                boxShadow: 1,
              }}
              onClick={() => setShowHelp(true)}
            >
              <Help fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={isSpeaking ? "Speaking..." : "Text-to-speech"}>
            <IconButton
              size="small"
              sx={{
                bgcolor: 'background.paper',
                boxShadow: 1,
              }}
              onClick={() => speakText('Voice assistant ready. Say "help" for commands.')}
              disabled={isSpeaking}
            >
              {isSpeaking ? <VolumeOff fontSize="small" /> : <VolumeUp fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Last Command Display */}
        {lastCommand && (
          <Chip
            label={`"${lastCommand}"`}
            size="small"
            sx={{
              mt: 1,
              maxWidth: 200,
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              backdropFilter: 'blur(10px)',
            }}
          />
        )}
      </Box>

      {/* Help Dialog */}
      <Dialog
        open={showHelp}
        onClose={() => setShowHelp(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
          <Box display="flex" alignItems="center" gap={1}>
            <KeyboardVoice />
            <Typography variant="h6">Voice Assistant Commands</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="subtitle1" gutterBottom color="primary" fontWeight="bold">
            Available Commands for {currentPage.replace('_', ' ').toUpperCase()}
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            {activeCommands.map((cmd, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 1,
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: index % 2 === 0 ? 'action.hover' : 'transparent',
                }}
              >
                <CheckCircle fontSize="small" color="success" />
                <Typography variant="body2">{cmd}</Typography>
              </Box>
            ))}
          </Box>
          
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 3, color: 'primary', fontWeight: 'bold' }}>
            Tips:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Speak clearly and at a normal pace<br/>
            • Use simple phrases like "Select class 7th" or "Option A"<br/>
            • The assistant understands both full sentences and short commands<br/>
            • You can say "back" to navigate to previous screens<br/>
            • Say "what is selected" to hear your current position
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHelp(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmationDialog.open}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>{confirmationDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDialog} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          icon={
            snackbar.severity === 'success' ? <CheckCircle /> :
            snackbar.severity === 'warning' ? <Warning /> : undefined
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default VoiceQuizAssistant;
