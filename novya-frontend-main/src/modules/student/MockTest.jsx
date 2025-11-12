import { useState, useEffect } from "react";
import './MockTest.css';
import Navbar from "./Navbarrr";
import { useQuiz } from "./QuizContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import html2canvas from "html2canvas";
import { API_CONFIG, fastAPI } from "../../config/api";


function MockTest() {
  const { t, i18n } = useTranslation();
  const { updateMockTestResults } = useQuiz();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [quiz, setQuiz] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [skippedQuestions, setSkippedQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [isPassed, setIsPassed] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [rewardPoints, setRewardPoints] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState('');
  const [hintLoading, setHintLoading] = useState(false);
  const [pointsBreakdown, setPointsBreakdown] = useState({ basePoints: 0, bonusPoints: 0, totalPoints: 0 });
  const [explanations, setExplanations] = useState([]);
  const [explanationsLoading, setExplanationsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [mockTestStartTime, setMockTestStartTime] = useState(null);


  const optionLabels = ["A", "B", "C", "D"];
  const classIcons = ["🏫", "📚", "🎓", "💼", "🔬", "📊"];
  const subjectIcons = ["📖", "🧮", "🔭", "🧪", "🌍", "📜", "💻", "🎨"];
  const chapterIcons = ["📝", "🔍", "💡", "⚡", "🌟", "🎯", "📊", "🔬"];

  // MARK: ADDED - Function to add reward points with history tracking
  const addRewardPointsWithHistory = (points, reason, source = 'system') => {
    const currentPoints = parseInt(localStorage.getItem('rewardPoints') || '0');
    const newPoints = currentPoints + points;
    
    // Update points in localStorage
    localStorage.setItem('rewardPoints', newPoints.toString());
    setRewardPoints(newPoints);
    
    // Add to history
    const historyEntry = {
      id: `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      points: points,
      totalPoints: newPoints,
      reason: reason,
      source: source,
      timestamp: new Date().toISOString()
    };
    
    const existingHistory = JSON.parse(localStorage.getItem('rewardsHistory') || '[]');
    const updatedHistory = [historyEntry, ...existingHistory];
    localStorage.setItem('rewardsHistory', JSON.stringify(updatedHistory));
    
    // Dispatch event to update other components
    window.dispatchEvent(new CustomEvent('rewardPointsUpdated', { 
      detail: { rewardPoints: newPoints } 
    }));
    
    // Also dispatch storage event for cross-tab synchronization
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'rewardPoints',
      newValue: newPoints.toString(),
      oldValue: currentPoints.toString()
    }));
    
    return historyEntry;
  };

  // WhatsApp Share Function - Direct to WhatsApp app or web
// NEW: Generate and share result as image via WhatsApp

const shareResultAsImage = async () => {

  setIsGeneratingImage(true);

  try {

    // Create a hidden result image element for capture

    const resultImageElement = document.createElement('div');

    resultImageElement.id = 'result-image-capture';

    resultImageElement.style.cssText = `

      position: fixed;

      top: 0;

      left: 0;

      width: 400px;

      height: 500px;

      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

      color: white;

      padding: 30px;

      border-radius: 20px;

      box-shadow: 0 10px 30px rgba(0,0,0,0.3);

      z-index: 10000;

      display: flex;

      flex-direction: column;

      align-items: center;

      justify-content: center;

      font-family: 'Arial', sans-serif;

      text-align: center;

      opacity: 0;

      pointer-events: none;

    `;
 
    const currentDate = new Date();

    const formattedDate = currentDate.toLocaleDateString('en-GB');

    const formattedTime = currentDate.toLocaleTimeString('en-GB', { 

      hour: '2-digit', 

      minute: '2-digit',

      second: '2-digit',

      hour12: true 

    });
 
    const percentage = Math.round((score / quiz.length) * 100);

    const status = isPassed ? t('pass') : t('fail');

    const subjectName = t(`mock-subjects.${selectedSubject.toLowerCase()}`);

    const className = t(`classes.${selectedClass}`);
 
    resultImageElement.innerHTML = `
<div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 20px;">
<div style="text-align: center;">
<h1 style="font-size: 28px; font-weight: bold; margin: 0 0 10px 0; color: white;">${t('quizResult') || 'Quiz Result'}</h1>
<div style="font-size: 20px; font-weight: bold; margin: 10px 0; color: ${isPassed ? '#4CAF50' : '#FF6B6B'}">

            ${status}
</div>
</div>
<div style="display: flex; flex-direction: column; align-items: center; gap: 15px;">
<div style="font-size: 48px; font-weight: bold; color: white;">

            ${score}/${quiz.length}
</div>
<div style="font-size: 24px; font-weight: bold; color: white;">

            ${percentage}%
</div>
</div>
<div style="text-align: center; margin: 15px 0;">
<div style="font-size: 16px; margin-bottom: 5px;"><strong>${className} - ${subjectName}</strong></div>
<div style="font-size: 14px;">${selectedChapter}</div>
</div>
<div style="margin-top: 10px; font-size: 18px; font-weight: bold;">

          ${t('rewardPoints')}: ${rewardPoints}
</div>
<div style="margin-top: auto; font-size: 10px; color: rgba(255,255,255,0.7); text-align: center;">

          ${t('generatedOn') || 'Generated on'} ${formattedDate} ${t('at') || 'at'} ${formattedTime}
</div>
</div>

    `;
 
    document.body.appendChild(resultImageElement);
 
    // Capture the image

    const canvas = await html2canvas(resultImageElement, {

      backgroundColor: null,

      scale: 2,

      useCORS: true,

      logging: false,

      width: 400,

      height: 500,

      onclone: (clonedDoc) => {

        const clonedElement = clonedDoc.getElementById('result-image-capture');

        if (clonedElement) {

          clonedElement.style.opacity = '1';

        }

      }

    });
 
    // Convert canvas to blob

    const blob = await new Promise(resolve => {

      canvas.toBlob(resolve, 'image/png', 1.0);

    });
 
    // Clean up

    document.body.removeChild(resultImageElement);
 
    if (!blob) {

      throw new Error('Failed to create image blob');

    }
 
    // Convert blob to File

    const file = new File([blob], 'quiz-result.png', { type: 'image/png' });

    // Check if Web Share API is available and supports files

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {

      // Use Web Share API for mobile devices

      await navigator.share({

        files: [file],

        title: 'My Quiz Results',

        text: generateShareText(),

      });

    } else {

      // Fallback: Share via WhatsApp Web

      shareViaWhatsAppWeb(blob);

    }
 
  } catch (error) {

    console.error('Error sharing image:', error);

    // Ultimate fallback: Share text via WhatsApp

    shareTextViaWhatsApp();

  } finally {

    setIsGeneratingImage(false);

  }

};
 
// Helper function to generate share text

const generateShareText = () => {

  const percentage = Math.round((score / quiz.length) * 100);

  const status = isPassed ? t('pass') : t('fail');

  const subjectName = t(`mock-subjects.${selectedSubject.toLowerCase()}`);

  const className = t(`classes.${selectedClass}`);

  return `🎯 ${t('quizResult') || 'Quiz Result'}\n\n` +

         `📊 ${t('score')}: ${score}/${quiz.length} (${percentage}%)\n` +

         `📚 ${className} - ${subjectName}\n` +

         `📖 ${t('chapter')}: ${selectedChapter}\n` +

         `🌐 ${t('testLanguage')}: ${selectedLanguage}\n` +

         `⭐ ${t('rewardPoints')}: ${rewardPoints}\n` +

         `${isPassed ? '🎉 ' + t('congratulations') + '!' : '💪 ' + t('retrySameLevel') + '!'}`;

};
 
// Fallback: Share via WhatsApp Web with image

const shareViaWhatsAppWeb = (blob) => {

  const percentage = Math.round((score / quiz.length) * 100);

  const shareText = generateShareText();

  // Create a temporary link to download the image first

  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement('a');

  downloadLink.href = url;

  downloadLink.download = 'quiz-result.png';

  document.body.appendChild(downloadLink);

  downloadLink.click();

  document.body.removeChild(downloadLink);

  URL.revokeObjectURL(url);

  // Then open WhatsApp with the share text

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + '\n\n📸 ' + (t('imageDownloaded') || 'Check your downloads for the result image!'))}`;

  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

};
 
// Ultimate fallback: Share only text via WhatsApp

const shareTextViaWhatsApp = () => {

  const shareText = generateShareText();

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

};
  // WhatsApp Share Function - Direct to WhatsApp app or web (kept as fallback)
  const shareViaWhatsApp = () => {
    shareResultAsImage(); // Now redirects to image sharing
  };
 

  // Load reward points from localStorage
  useEffect(() => {
    const loadRewardPoints = () => {
      const savedPoints = parseInt(localStorage.getItem('rewardPoints')) || 0;
      setRewardPoints(savedPoints);
    };

    loadRewardPoints();

    const handleRewardPointsUpdate = (event) => {
      if (event.detail && event.detail.rewardPoints !== undefined) {
        setRewardPoints(event.detail.rewardPoints);
      }
    };

    const handleStorageChange = (e) => {
      if (e.key === 'rewardPoints') {
        loadRewardPoints();
      }
    };

    window.addEventListener('rewardPointsUpdated', handleRewardPointsUpdate);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('rewardPointsUpdated', handleRewardPointsUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Update reward points
  const updateRewardPoints = (newPoints) => {
    const points = Math.max(0, newPoints); // Ensure points don't go negative
    localStorage.setItem('rewardPoints', points.toString());
    setRewardPoints(points);
    window.dispatchEvent(new CustomEvent('rewardPointsUpdated', {
      detail: { rewardPoints: points }
    }));
  };

  // Generate explanations when review popup is opened or after finishing quiz
  const generateExplanations = async () => {
    if (!quiz.length || explanations.length > 0 || explanationsLoading) return;
   
    setExplanationsLoading(true);
    try {
      const questionsWithUserAnswers = quiz.map((q, index) => ({
        question: q.question,
        options: Object.values(q.options),
        correct_answer: q.options[q.answer], // Send the actual answer text
        user_answer: userAnswers[index] ? q.options[userAnswers[index]] : 'Not attempted'
      }));

      console.log('Sending questions for explanations:', questionsWithUserAnswers);

      const data = await fastAPI.post(API_CONFIG.FASTAPI.AI_ASSISTANT.GENERATE_EXPLANATIONS, {
        questions: questionsWithUserAnswers,
        class_level: selectedClass,
        subject: selectedSubject,
        chapter: selectedChapter
      });

      console.log('Explanations response:', data);
     
      if (data.success && data.explanations) {
        setExplanations(data.explanations);
      } else {
        console.error('Failed to generate explanations:', data);
        // Create fallback explanations
        const fallbackExplanations = quiz.map((q, index) => ({
          question_index: index,
          question: q.question,
          correct_answer: q.options[q.answer],
          user_answer: userAnswers[index] ? q.options[userAnswers[index]] : 'Not attempted',
          explanation: t('aiExplanationFallback', { correctAnswer: q.options[q.answer], chapter: selectedChapter }),
          is_correct: userAnswers[index] === q.answer
        }));
        setExplanations(fallbackExplanations);
      }
    } catch (error) {
      console.error('Error generating explanations:', error);
      // Fallback: Generate basic explanations
      const fallbackExplanations = quiz.map((q, index) => ({
        question_index: index,
        question: q.question,
        correct_answer: q.options[q.answer],
        user_answer: userAnswers[index] ? q.options[userAnswers[index]] : 'Not attempted',
        explanation: t('aiExplanationErrorFallback', { correctAnswer: q.options[q.answer], chapter: selectedChapter }),
        is_correct: userAnswers[index] === q.answer
      }));
      setExplanations(fallbackExplanations);
    } finally {
      setExplanationsLoading(false);
    }
  };

  // Hide chatbot widget
  useEffect(() => {
    const chatWidget = document.querySelector('iframe[src*="tawk"], iframe[src*="crisp"], iframe[src*="chat"], iframe[src*="bot"], iframe[src*="dialogflow"]');
    if (chatWidget) {
      chatWidget.style.display = "none";
    }

    const chatButton = document.querySelector('div[style*="z-index"][style*="bottom"][style*="right"]');
    if (chatButton && chatButton.querySelector("svg, img")) {
      chatButton.style.display = "none";
    }

    return () => {
      if (chatWidget) {
        chatWidget.style.display = "block";
      }
      if (chatButton) {
        chatButton.style.display = "block";
      }
    };
  }, []);

  // Fetch classes - Using API Config
  useEffect(() => {
    fastAPI.get(API_CONFIG.FASTAPI.MOCK_TEST.GET_CLASSES)
      .then(data => setClasses(data.classes || []))
      .catch(() => setError("Failed to load classes"));
  }, []);

  // Handle visibility change
  useEffect(() => {
    if (!quiz.length || isFinished || showInstructions) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setWarningCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            finishQuiz();
            return newCount;
          } else {
            setShowWarning(true);
            return newCount;
          }
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [quiz, isFinished, showInstructions]);

  // Handle full-screen change
  useEffect(() => {
    const handleFullScreenChange = () => {
      const isCurrentlyFullScreen = !!document.fullscreenElement || !!document.webkitFullscreenElement || !!document.mozFullScreenElement || !!document.msFullscreenElement;
      setIsFullScreen(isCurrentlyFullScreen);

      if (!isCurrentlyFullScreen && quiz.length > 0 && !isFinished && !showInstructions) {
        setWarningCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            finishQuiz();
            return newCount;
          } else {
            setShowWarning(true);
            enterFullScreen();
            return newCount;
          }
        });
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
    document.addEventListener("mozfullscreenchange", handleFullScreenChange);
    document.addEventListener("MSFullscreenChange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullScreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullScreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullScreenChange);
    };
  }, [quiz, isFinished, showInstructions]);

  // Auto-hide warning
  useEffect(() => {
    if (showWarning) {
      const timer = setTimeout(() => {
        setShowWarning(false);
      }, 3000);
      return () => clearTimeout(timer);
    };
  }, [showWarning]);

  // Timer for quiz
  useEffect(() => {
    if (quiz.length > 0 && !isFinished && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            finishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quiz, isFinished, timeLeft]);

  // Finish quiz function - UPDATED to fetch explanations after finishing
  const finishQuiz = async () => {
    const passed = score > 20;
    setIsPassed(passed);
    setIsFinished(true);
   
    // Calculate coins based on new logic:
    // Below 20: 0 coins
    // 20-39: 1 coin per mark (e.g., 20 marks = 20 coins, 39 = 39 coins)
    // 40-50: 1 coin per mark + 10 bonus (e.g., 40 = 50 coins, 50 = 60 coins)
    let basePoints = 0;
    let bonusPoints = 0;
    let totalPoints = 0;
   
    if (score < 20) {
      // Below 20: 0 coins
      basePoints = 0;
      bonusPoints = 0;
      totalPoints = 0;
    } else if (score >= 20 && score <= 39) {
      // 20-39: 1 coin per mark
      basePoints = score;
      bonusPoints = 0;
      totalPoints = score;
    } else if (score >= 40 && score <= 50) {
      // 40-50: 1 coin per mark + 10 bonus
      basePoints = score;
      bonusPoints = 10;
      totalPoints = score + 10;
    }
   
    setPointsBreakdown({
      basePoints: basePoints,
      bonusPoints: bonusPoints,
      totalPoints: totalPoints
    });
   
    // NOTE: Coins are added by QuizContext.updateMockTestResults() which calls addCoinsForMockTest()
    // This function uses the same logic (below 20 = 0, 20-39 = 1 per mark, 40-50 = 1 per mark + 10 bonus)
    // So we don't need to add coins here to avoid duplication

    // Prepare mock test data for database submission
    try {
      const startTime = mockTestStartTime || Date.now(); // Fallback to current time if not tracked
      const timeTakenSeconds = Math.floor((Date.now() - startTime) / 1000);
      const mockTestData = {
        // Use the field names expected by MockTestAttemptSubmissionSerializer
        testType: 'mock_test',
        subject: selectedSubject || 'Unknown',
        chapter: selectedChapter || 'Unknown',
        topic: selectedChapter || 'Unknown',
        subtopic: `${selectedSubject || 'Unknown'} - ${selectedChapter || 'Unknown'}`,
        className: selectedClass || 'Unknown',
        difficultyLevel: 'medium',
        language: selectedLanguage || 'English',
        totalQuestions: quiz.length,
        correctAnswers: score,
        wrongAnswers: quiz.length - score,
        unansweredQuestions: 0,
        timeTakenSeconds: timeTakenSeconds,
        score: score,
        testQuestions: quiz || [], // Backend serializer expects testQuestions, not quizQuestions
        userAnswers: (userAnswers || []).filter(answer => answer !== null)
      };
      
      // Update results with database save
      await updateMockTestResults(
        score,
        quiz.length,
        selectedClass,
        selectedSubject,
        selectedChapter,
        mockTestData // Pass mock test data for database save
      );
      
      // Dispatch event for Career page to refresh (QuizContext already dispatches, but this ensures it)
      window.dispatchEvent(new CustomEvent('mockTestCompleted', {
        detail: { score, totalQuestions: quiz.length, type: 'mock_test' }
      }));
      console.log('✅ Mock test completed event dispatched');
    } catch (error) {
      console.error('❌ Error preparing mock test data:', error);
      // Fallback: update without database save
      updateMockTestResults(score, quiz.length, selectedClass, selectedSubject, selectedChapter);
      
      // Still dispatch event even on error
      window.dispatchEvent(new CustomEvent('mockTestCompleted', {
        detail: { score, totalQuestions: quiz.length, type: 'mock_test' }
      }));
    }
   
    // Fetch explanations after finishing the quiz for all questions
    await generateExplanations();
   
    exitFullScreen();
    setShowWarning(false);
  };

  // FIXED: Handle Hint function with AI-generated hints
  const handleHint = async () => {
    if (rewardPoints < 5) {
      alert(t('notEnoughPoints'));
      return;
    }

    const currentQuestion = quiz[currentQ];
    if (!currentQuestion) return;

    setHintLoading(true);
    try {
      // Check if hint already exists in question data
      if (currentQuestion.hint) {
        // IMPORTANT: Deduct coins FIRST before showing hint
        // Only show hint if deduction succeeds
        try {
          const { addCoins } = await import('../../utils/coinTracking');
          const coinResult = await addCoins(-5, 'mock_test_hint', t('hintUsed'), null, 'mock_test_hint', {
            action: 'hint_used',
            coinsDeducted: 5
          });
          if (coinResult && coinResult.balance) {
            const newBalance = coinResult.balance.total_coins || 0;
            localStorage.setItem('rewardPoints', newBalance.toString());
            setRewardPoints(newBalance);
            window.dispatchEvent(new CustomEvent('rewardPointsUpdated', {
              detail: { rewardPoints: newBalance }
            }));
            // If deduction succeeds, show hint
            setCurrentHint(currentQuestion.hint);
            setShowHint(true);
            console.log('✅ Hint deduction successful, balance:', newBalance);
          } else {
            throw new Error(coinResult?.error || 'Failed to deduct coins');
          }
        } catch (error) {
          console.error('❌ Error syncing hint deduction to database:', error);
          alert('Failed to deduct coins. Please check your balance and try again.');
          // Don't show hint if deduction fails
        } finally {
          setHintLoading(false);
        }
      } else {
        // Generate hint dynamically using AI assistant
        try {
          const hintPrompt = `Provide a helpful hint for this quiz question. The hint should guide the student toward the answer without giving it away directly. Keep it concise (1-2 sentences) and educational.

Question: "${currentQuestion.question}"
Options: ${currentQuestion.options ? Object.values(currentQuestion.options).join(', ') : 'N/A'}

Provide only the hint text, no extra formatting.`;

          const data = await fastAPI.post(API_CONFIG.FASTAPI.AI_ASSISTANT.CHAT, {
            class_level: selectedClass || 'Unknown',
            subject: selectedSubject || 'Unknown',
            chapter: selectedChapter || 'Unknown',
            student_question: hintPrompt,
            chat_history: []
          });

          if (data.success && data.response) {
            // Extract just the hint text (remove any formatting)
            let hintText = data.response.trim();
            
            // Remove common formatting prefixes and emojis
            hintText = hintText.replace(/^💡\s*[Hh]int[:\s]*/i, '');
            hintText = hintText.replace(/^[💡🔍💭]\s*/i, '');
            hintText = hintText.replace(/^Hint[:\s]*/i, '');
            hintText = hintText.replace(/^─+\s*/g, ''); // Remove separator lines
            hintText = hintText.replace(/^[\*\-\•]\s*/g, ''); // Remove bullet points
            
            // Extract first meaningful sentence/paragraph (first 1-2 sentences)
            const sentences = hintText.split(/[.!?]+/).filter(s => s.trim().length > 10);
            hintText = sentences.slice(0, 2).join('. ').trim();
            
            // If still empty or too long, use fallback
            if (!hintText || hintText.length < 10) {
              hintText = 'Think carefully about the key concepts related to this question. Review what you know about the topic.';
            } else if (hintText.length > 200) {
              // Truncate if too long
              hintText = hintText.substring(0, 197) + '...';
            }

            // IMPORTANT: Deduct coins FIRST before showing hint
            // Only show hint if deduction succeeds
            try {
              const { addCoins } = await import('../../utils/coinTracking');
              const coinResult = await addCoins(-5, 'mock_test_hint', t('hintUsed'), null, 'mock_test_hint', {
                action: 'hint_used',
                coinsDeducted: 5
              });
              if (coinResult && coinResult.balance) {
                const newBalance = coinResult.balance.total_coins || 0;
                localStorage.setItem('rewardPoints', newBalance.toString());
                setRewardPoints(newBalance);
                window.dispatchEvent(new CustomEvent('rewardPointsUpdated', {
                  detail: { rewardPoints: newBalance }
                }));
                // If deduction succeeds, show hint
                setCurrentHint(hintText);
                setShowHint(true);
                console.log('✅ Hint deduction successful, balance:', newBalance);
              } else {
                throw new Error(coinResult?.error || 'Failed to deduct coins');
              }
            } catch (error) {
              console.error('❌ Error syncing hint deduction to database:', error);
              alert('Failed to deduct coins. Please check your balance and try again.');
              // Don't show hint if deduction fails
            } finally {
              setHintLoading(false);
            }
          } else {
            setHintLoading(false);
            throw new Error('Failed to generate hint');
          }
        } catch (aiError) {
          console.error('Error generating hint with AI:', aiError);
          // Fallback: provide a generic helpful hint
          const fallbackHint = 'Review the key concepts related to this question. Consider what you know about the topic and eliminate options that don\'t seem relevant.';
          // IMPORTANT: Deduct coins FIRST before showing hint
          // Only show hint if deduction succeeds
          try {
            const { addCoins } = await import('../../utils/coinTracking');
            const coinResult = await addCoins(-5, 'mock_test_hint', t('hintUsed'), null, 'mock_test_hint', {
              action: 'hint_used',
              coinsDeducted: 5
            });
            if (coinResult && coinResult.balance) {
              const newBalance = coinResult.balance.total_coins || 0;
              localStorage.setItem('rewardPoints', newBalance.toString());
              setRewardPoints(newBalance);
              window.dispatchEvent(new CustomEvent('rewardPointsUpdated', {
                detail: { rewardPoints: newBalance }
              }));
              // If deduction succeeds, show hint
              setCurrentHint(fallbackHint);
              setShowHint(true);
              console.log('✅ Hint deduction successful, balance:', newBalance);
            } else {
              throw new Error(coinResult?.error || 'Failed to deduct coins');
            }
          } catch (error) {
            console.error('❌ Error syncing hint deduction to database:', error);
            alert('Failed to deduct coins. Please check your balance and try again.');
            // Don't show hint if deduction fails
          } finally {
            setHintLoading(false);
          }
        }
      }
    } catch (error) {
      console.error('Error using hint:', error);
      setHintLoading(false);
      alert(t('hintError'));
    } finally {
      setHintLoading(false);
    }
  };

  // Close hint function
  const closeHint = () => {
    setShowHint(false);
    setCurrentHint('');
  };

  const fetchSubjects = (className) => {
    setLoading(true);
    setError(null);
    fastAPI.get(API_CONFIG.FASTAPI.MOCK_TEST.GET_SUBJECTS(className))
      .then(data => {
        setSubjects(data.subjects || []);
        setChapters([]);
        setSelectedSubject(null);
        setSelectedChapter(null);
        setQuiz([]);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load subjects: " + err.message);
        setLoading(false);
      });
  };

  const fetchChapters = (className, subject) => {
    setLoading(true);
    setError(null);
    fastAPI.get(API_CONFIG.FASTAPI.MOCK_TEST.GET_CHAPTERS(className, subject))
      .then(data => {
        const chaptersData = Array.isArray(data.chapters) ? data.chapters : [];
        setChapters(chaptersData);
        setSelectedChapter(null);
        setQuiz([]);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load chapters: " + err.message);
        setChapters([]);
        setLoading(false);
      });
  };

  const fetchMockTest = (chapter, difficulty = "normal", retry = false) => {
    setLoading(true);
    setError(null);
    setShowInstructions(false);
    setTimeLeft(20 * 60);
    setSkippedQuestions([]);
    setUserAnswers(Array(50).fill(null));
    setShowHint(false);
    setCurrentHint('');
    setExplanations([]); // Reset explanations when new test starts
    setMockTestStartTime(Date.now()); // Start timing the mock test
   
    const params = {
      class_name: selectedClass,
      subject: selectedSubject,
      chapter: chapter,
      difficulty: difficulty,
      retry: retry,
      language: selectedLanguage
    };
    
    fastAPI.get(API_CONFIG.FASTAPI.MOCK_TEST.GENERATE_TEST(params))
      .then(data => {
        let questions = [];
       
        if (Array.isArray(data)) {
          questions = data;
        } else if (data && Array.isArray(data.questions)) {
          questions = data.questions;
        } else if (data && Array.isArray(data.quiz)) {
          questions = data.quiz;
        } else if (data && data.questions) {
          questions = Object.values(data.questions);
        } else {
          throw new Error("Invalid response format: " + JSON.stringify(data));
        }
       
        if (questions.length === 0) {
          throw new Error("No questions received from server");
        }

        const validQuestions = questions
          .filter(q => q && q.question && q.answer && q.options)
          .map((q, index) => ({
            id: index,
            question: q.question.trim(),
            options: q.options,
            answer: q.answer,
            hint: q.hint // Include hint from backend response
          }))
          .slice(0, 50);

        while (validQuestions.length < 50) {
          validQuestions.push({
            id: validQuestions.length,
            question: `Placeholder Question ${validQuestions.length + 1}`,
            options: { A: "Option A", B: "Option B", C: "Option C", D: "Option D" },
            answer: "A",
            hint: t('defaultHint')
          });
        }

        setQuiz(validQuestions);
        setCurrentQ(0);
        setSelected(null);
        setScore(0);
        setIsFinished(false);
        setIsPassed(false);
        setShowAnswer(false);
        setShowReviewPopup(false);
        setWarningCount(0);
        setShowWarning(false);
        setShowAnswerKey(false);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to load mock test: " + err.message);
        setLoading(false);
        setQuiz([]);
        setShowInstructions(true);
      });
  };

  const handleClassClick = (className) => {
    setSelectedClass(className);
    setSelectedSubject(null);
    setSelectedChapter(null);
    setSubjects([]);
    setChapters([]);
    setQuiz([]);
    setShowInstructions(true);
    fetchSubjects(className);
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    setSelectedChapter(null);
    setChapters([]);
    setQuiz([]);
    setShowInstructions(true);
    fetchChapters(selectedClass, subject);
  };

  const handleChapterClick = (chapter) => {
    setSelectedChapter(chapter);
    setShowInstructions(true);
  };

  const startQuiz = () => {
    setShowInstructions(false);
    if (quiz.length === 0) {
      fetchMockTest(selectedChapter);
      enterFullScreen();
    }
  };

  const handleAnswer = (label) => {
    setSelected(label);
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQ] = label;
    setUserAnswers(newUserAnswers);

    const newSkipped = skippedQuestions.filter(q => q !== currentQ);
    setSkippedQuestions(newSkipped);

    if (label === quiz[currentQ]?.answer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    setShowHint(false);
    setCurrentHint('');
    if (currentQ < quiz.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(userAnswers[currentQ + 1] || null);
      setShowAnswer(false);
      setShowAnswerKey(false);
    } else {
      finishQuiz();
    }
  };

  const prevQuestion = () => {
    setShowHint(false);
    setCurrentHint('');
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
      setSelected(userAnswers[currentQ - 1] || null);
      setShowAnswer(false);
      setShowAnswerKey(false);
    }
  };

  const skipQuestion = () => {
    const newSkipped = [...skippedQuestions];
    if (!newSkipped.includes(currentQ)) {
      newSkipped.push(currentQ);
      setSkippedQuestions(newSkipped);
    }
   
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQ] = null;
    setUserAnswers(newUserAnswers);
    setSelected(null);
   
    nextQuestion();
  };

  const goToQuestion = (index) => {
    setShowHint(false);
    setCurrentHint('');
    setCurrentQ(index);
    setSelected(userAnswers[index] || null);
    setShowAnswer(false);
    setShowAnswerKey(false);
  };

  const retryQuiz = () => {
    // Reset all quiz state before retrying
    setWarningCount(0);
    setShowWarning(false);
    setScore(0);
    setCurrentQ(0);
    setSelected(null);
    setUserAnswers(Array(50).fill(null));
    setIsFinished(false);
    setIsPassed(false);
    setShowAnswer(false);
    setShowReviewPopup(false);
    setShowAnswerKey(false);
    setShowHint(false);
    setCurrentHint('');
    setExplanations([]);
    setPointsBreakdown({ basePoints: 0, bonusPoints: 0, totalPoints: 0 });
    
    // Fetch new mock test with retry flag
    fetchMockTest(selectedChapter, "normal", true);
    enterFullScreen();
  };

  const nextLevel = () => {
    if (isPassed) {
      setWarningCount(0);
      setShowWarning(false);
      fetchMockTest(selectedChapter, "hard");
      enterFullScreen();
    }
  };

  const backToChapters = () => {
    setSelectedChapter(null);
    setQuiz([]);
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setIsFinished(false);
    setIsPassed(false);
    setShowAnswer(false);
    setUserAnswers([]);
    setShowInstructions(true);
    setShowReviewPopup(false);
    setWarningCount(0);
    setShowWarning(false);
    setShowAnswerKey(false);
    setShowHint(false);
    setCurrentHint('');
    setExplanations([]);
    exitFullScreen();
  };

  const backToSubjects = () => {
    setSelectedSubject(null);
    setSelectedChapter(null);
    setChapters([]);
    setQuiz([]);
    setShowInstructions(true);
    setExplanations([]);
  };

  const backToClasses = () => {
    setSelectedClass(null);
    setSelectedSubject(null);
    setSelectedChapter(null);
    setSubjects([]);
    setChapters([]);
    setQuiz([]);
    setShowInstructions(true);
    setExplanations([]);
  };

  const backToPractice = () => {
    navigate('/practice');
  };

  const enterFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => {});
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestfullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
    setIsFullScreen(true);
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    setIsFullScreen(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleReviewPopup = () => {
    setShowReviewPopup(!showReviewPopup);
    if (!showReviewPopup && explanations.length === 0) {
      generateExplanations();
    }
  };

  const getBackButtonConfig = () => {
    if (quiz.length > 0 && !isFinished && !showInstructions) {
        return null;
    }
   
    if (selectedSubject && !selectedChapter) {
        return {
            text: t('backToSubjects'),
            action: backToSubjects
        };
    }
   
    if (selectedClass && !selectedSubject) {
        return {
            text: t('backToClasses'),
            action: backToClasses
        };
    }
   
    if (!selectedClass) {
        return {
            text: t('backToPractice'),
            action: backToPractice
        };
    }
  };

  const backButtonConfig = getBackButtonConfig();

  if (loading) return (
    <div className="loading-container">
      <div className="edu-loader">
        <span role="img" aria-label="book" className="edu-icon">📚</span>
        <span role="img" aria-label="graduation" className="edu-icon">🎓</span>
        <span role="img" aria-label="lightbulb" className="edu-icon">💡</span>
      </div>
      <p style={{ color: "black", fontWeight: "bold" }}>
        {t('preparingTest', { language: selectedLanguage })}
      </p>
    </div>
  );

  return (
    <>
      <Navbar
        isFullScreen={isFullScreen && quiz.length > 0 && !showInstructions}
        rewardPoints={rewardPoints}
      />
     
      {!isFullScreen && backButtonConfig && (
        <div className="navbar-back-wrapper">
          <div className="navbar-back-container">


            <button
    onClick={backButtonConfig.action}
    style={{
      position: "absolute", // or "fixed" if you want it to stay visible when scrolling
      top: "20px",
      left: "20px",
      background: "linear-gradient(to right, #6a5af9, #8364e8)",
      color: "#fff",
      border: "none",
      padding: "10px 20px",
      borderRadius: "8px",
      fontWeight: 600,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.2s ease",
      zIndex: 1000 // ensures it appears above other elements
    }}
    onMouseOver={(e) => (e.currentTarget.style.transform = "translateX(-2px)")}
    onMouseOut={(e) => (e.currentTarget.style.transform = "translateX(0)")}
>
<span
      style={{
        fontSize: "18px",
        marginRight: "5px"
      }}
>
      ←
</span>
    {backButtonConfig.text}
</button>
            



          </div>
        </div>
      )}
     
      {error && !showInstructions && (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            {t('retrySameLevel')}
          </button>
        </div>
      )}
      {showWarning && !isFinished && (
        <div className="warning-container">
          <div className="warning-icon">⚠️</div>
          <p>
            {t('warningMessage', { count: warningCount })}
          </p>
        </div>
      )}
      {!selectedClass && !error && (
        <div className="selection-container">
          <div className="header">
            <h2>{t('selectClassTitle')}</h2>
            <p>{t('selectClassSubtitle')}</p>
          </div>
          <div className="cards-grid">
            {classes.map((cl, i) => (
              <div
                key={i}
                className="selection-card"
                onClick={() => handleClassClick(cl)}
              >
                <div className="card-icon">{classIcons[i % classIcons.length]}</div>
                <h3>{t(`classes.${cl}`)}</h3>
                <p>{t('classCardDesc')}</p>
                <div className="card-hover"></div>
              </div>
            ))}
          </div>
        </div>
      )}
      {!selectedSubject && selectedClass && !error && (
        <div className="selection-container">
          <div className="header">
            <h2>{t('selectSubjectTitle')}</h2>
            <p>{t('selectSubjectSubtitle', { class: t(`classes.${selectedClass}`) })}</p>
          </div>
          <div className="cards-grid">
            {subjects.map((sub, i) => (
              <div
                key={i}
                className="selection-card subject-card"
                onClick={() => handleSubjectClick(sub)}
              >
                <div className="card-icon">{subjectIcons[i % subjectIcons.length]}</div>
                <h3>{t(`mock-subjects.${sub.toLowerCase()}`)}</h3>
                <p>{t('subjectCardDesc')}</p>
                <div className="card-hover"></div>
              </div>
            ))}
          </div>
        </div>
      )}
      {!selectedChapter && selectedSubject && !error && (
        <div className="selection-container chapter-select">
          <div className="header">
            <h2>{t('selectChapterTitle')}</h2>
            <p>{t('selectChapterSubtitle', { selectedSubject: t(`mock-subjects.${selectedSubject.toLowerCase()}`) })}</p>
          </div>
          <div className="cards-grid">
            {Array.isArray(chapters) && chapters.map((chap, i) => (
              <div
                key={i}
                className={`selection-card chapter-card ${selectedChapter === chap ? 'selected' : ''}`}
                onClick={() => handleChapterClick(chap)}
              >
                <div className="card-icon">{chapterIcons[i % chapterIcons.length]}</div>
                <h3>{chap}</h3>
                <p>{selectedChapter === chap ? t('chapterSelected') : t('chapterCardDesc')}</p>
                <div className="card-hover"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(quiz.length === 0 || showInstructions) && !error && selectedChapter && (
        <div style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem"
        }}>
          <div style={{
            background: "white",
            borderRadius: "20px",
            padding: "3rem",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            maxWidth: "800px",
            width: "100%",
            margin: "2rem"
          }}>
            <div style={{
              textAlign: "center",
              fontSize: "4rem",
              marginBottom: "1rem"
            }}>📋</div>
           
            <h2 style={{
              textAlign: "center",
              color: "#2d3748",
              marginBottom: "2rem",
              fontSize: "2rem",
              fontWeight: "700"
            }}>{t('instructionsTitle')}</h2>
           
            <div style={{
              marginBottom: "2rem"
            }}>
              <div style={{
                display: "flex",
                alignItems: "flex-start",
                marginBottom: "1.5rem",
                padding: "1rem",
                borderRadius: "12px",
                transition: "all 0.3s ease",
                border: "1px solid #e2e8f0"
              }}>
                <span style={{
                  fontSize: "1.5rem",
                  marginRight: "1rem",
                  marginTop: "0.25rem"
                }}>💡</span>
                <div>
                  <h3 style={{
                    margin: "0 0 0.5rem 0",
                    color: "#2d3748",
                    fontWeight: "600"
                  }}>{t('hintFeature')}</h3>
                  <p style={{
                    margin: "0",
                    color: "#4a5568",
                    lineHeight: "1.6"
                  }}>{t('hintDescription')}</p>
                </div>
              </div>

              <div style={{
                display: "flex",
                alignItems: "flex-start",
                marginBottom: "1.5rem",
                padding: "1rem",
                borderRadius: "12px",
                transition: "all 0.3s ease",
                border: "1px solid #e2e8f0"
              }}>
                <span style={{
                  fontSize: "1.5rem",
                  marginRight: "1rem",
                  marginTop: "0.25rem"
                }}>⏱️</span>
                <div>
                  <h3 style={{
                    margin: "0 0 0.5rem 0",
                    color: "#2d3748",
                    fontWeight: "600"
                  }}>{t('timeLimitTitle')}</h3>
                  <p style={{
                    margin: "0",
                    color: "#4a5568",
                    lineHeight: "1.6"
                  }}>{t('timeLimitDesc')}</p>
                </div>
              </div>

              <div style={{
                display: "flex",
                alignItems: "flex-start",
                marginBottom: "1.5rem",
                padding: "1rem",
                borderRadius: "12px",
                transition: "all 0.3s ease",
                border: "1px solid #e2e8f0"
              }}>
                <span style={{
                  fontSize: "1.5rem",
                  marginRight: "1rem",
                  marginTop: "0.25rem"
                }}>❓</span>
                <div>
                  <h3 style={{
                    margin: "0 0 0.5rem 0",
                    color: "#2d3748",
                    fontWeight: "600"
                  }}>{t('questionFormatTitle')}</h3>
                  <p style={{
                    margin: "0",
                    color: "#4a5568",
                    lineHeight: "1.6"
                  }}>{t('questionFormatDesc')}</p>
                </div>
              </div>

              <div style={{
                display: "flex",
                alignItems: "flex-start",
                marginBottom: "1.5rem",
                padding: "1rem",
                borderRadius: "12px",
                transition: "all 0.3s ease",
                border: "1px solid #e2e8f0"
              }}>
                <span style={{
                  fontSize: "1.5rem",
                  marginRight: "1rem",
                  marginTop: "0.25rem"
                }}>📊</span>
                <div>
                  <h3 style={{
                    margin: "0 0 0.5rem 0",
                    color: "#2d3748",
                    fontWeight: "600"
                  }}>{t('passingCriteriaTitle')}</h3>
                  <p style={{
                    margin: "0",
                    color: "#4a5568",
                    lineHeight: "1.6"
                  }}>{t('passingCriteriaDesc')}</p>
                </div>
              </div>
            </div>

            <div style={{
              background: "#f7fafc",
              padding: "1.5rem",
              borderRadius: "12px",
              marginBottom: "2rem",
              border: "1px solid #e2e8f0"
            }}>
              <h3 style={{
                margin: "0 0 1rem 0",
                color: "#2d3748",
                fontWeight: "600"
              }}>{t('testDetailsTitle')}</h3>
              <p style={{ margin: "0.5rem 0", color: "#4a5568" }}>
                <strong style={{ color: "#2d3748" }}>{t('testClass')}</strong> {t(`classes.${selectedClass}`)}
              </p>
              <p style={{ margin: "0.5rem 0", color: "#4a5568" }}>
                <strong style={{ color: "#2d3748" }}>{t('testSubject')}</strong> {t(`mock-subjects.${selectedSubject.toLowerCase()}`)}
              </p>
              <p style={{ margin: "0.5rem 0", color: "#4a5568" }}>
                <strong style={{ color: "#2d3748" }}>{t('testChapter')}</strong> {selectedChapter}
              </p>
              <p style={{ margin: "0.5rem 0", color: "#4a5568" }}>
                <strong style={{ color: "#2d3748" }}>{t('testTotalQuestions')}</strong> 50
              </p>
              <p style={{ margin: "0.5rem 0", color: "#4a5568" }}>
                <strong style={{ color: "#2d3748" }}>{t('testPassingScore')}</strong> 20+
              </p>
              <p style={{ margin: "0.5rem 0", color: "#4a5568" }}>
                <strong style={{ color: "#2d3748" }}>{t('testLanguage')}</strong> {selectedLanguage}
              </p>
              <p style={{ margin: "0.5rem 0", color: "#4a5568" }}>
                <strong style={{ color: "#2d3748" }}>{t('currentRewardPoints')}</strong> {rewardPoints}
              </p>
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "2rem",
              gap: "1rem"
            }}>
              <label htmlFor="language" style={{
                fontWeight: "600",
                fontSize: "16px",
                color: "#2d3748"
              }}>
                {t('languageSelectLabel')}
              </label>
              <select
                id="language"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                style={{
                  padding: "10px 15px",
                  fontSize: "15px",
                  borderRadius: "8px",
                  border: "2px solid #007bff",
                  backgroundColor: "white",
                  cursor: "pointer",
                  minWidth: "180px",
                  fontWeight: "500"
                }}
              >
                <option value="English">English</option>
                <option value="Telugu">తెలుగు (Telugu)</option>
                <option value="Hindi">हिंदी (Hindi)</option>
                <option value="Tamil">தமிழ் (Tamil)</option>
                <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
                <option value="Malayalam">മലയാളം (Malayalam)</option>
              </select>
            </div>

            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginTop: "2rem"
            }}>
              <button
                onClick={backToChapters}
                style={{
                  padding: "12px 24px",
                  border: "2px solid #4a5568",
                  background: "transparent",
                  color: "#4a5568",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "16px",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#4a5568";
                  e.target.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "#4a5568";
                }}
              >
                {t('backToChapters')}
              </button>
             
              <button
                onClick={startQuiz}
                style={{
                  padding: "12px 24px",
                  border: "none",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "16px",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 6px 15px rgba(102, 126, 234, 0.6)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)";
                }}
              >
                {t('startTestNow')}
              </button>
            </div>
          </div>
        </div>
      )}

      {isFinished && !error && (
        <div className={`finished-container ${isFullScreen ? "fullscreen-mode" : ""}`}>
          <div className="result-card">
            <div className={`result-icon ${isPassed ? 'pass' : 'fail'}`}>
              {isPassed ? '🎉' : '😔'}
            </div>
            <h2>{isPassed ? t('congratulations') : t('mockCompleted')}</h2>
           
            <div className={`status-badge ${isPassed ? 'pass-badge' : 'fail-badge'}`}>
              {isPassed ? t('pass') : t('fail')}
            </div>
           
            <div className="score-display">
              <div className="score-section">
                <div className={`score-circle ${isPassed ? 'pass-score' : 'fail-score'}`}>
                  <span className="score">{score}</span>
                  <span className="total">/{quiz.length}</span>
                </div>
                {/* WhatsApp Share Button placed beside the score */}
                <button 
                  className="share-btn whatsapp-share"
                  onClick={shareViaWhatsApp}
                >
                  💬 {t('shareViaWhatsApp')}
                </button>
              </div>
              <p>{Math.round((score / quiz.length) * 100)}% {t('percentage')}</p>
              <p className={`pass-fail-text ${isPassed ? 'pass-text' : 'fail-text'}`}>
                {isPassed
                  ? t('passMessage', { score: score })
                  : t('failMessage', { score: score })}
              </p>
              <p className="language-info">{t('testTakenIn')} <strong>{selectedLanguage}</strong></p>
             
              {isPassed ? (
                <>
                  <div className="points-breakdown">
                    <div className="points-item">
                      <span>{t('basePoints')}:</span>
                      <strong>{pointsBreakdown.basePoints} {t('points')}</strong>
                      <span>({t('forPassing')})</span>
                    </div>
                    {pointsBreakdown.bonusPoints > 0 && (
                      <>
                        <div className="points-item bonus">
                          <span>{t('bonusPoints')}:</span>
                          <strong>+{pointsBreakdown.bonusPoints} {t('points')}</strong>
                          <span>({t('scored80Percent')})</span>
                        </div>
                        <div className="bonus-congrats">
                          <span className="bonus-icon">🎉</span>
                          <p>{t('amazingBonus')}</p>
                        </div>
                      </>
                    )}
                    <div className="points-item total">
                      <span>{t('totalPointsEarned')}:</span>
                      <strong>{pointsBreakdown.totalPoints} {t('points')}</strong>
                    </div>
                  </div>
                </>
              ) : (
                <p className="reward-info no-points">
                  {t('noPointsAwarded')}
                </p>
              )}
              <p className="overall-reward">{t('totalRewardPoints')}: <strong>{rewardPoints}</strong></p>
            </div>
           
            <div className="time-result">
              <p>{t('timeTaken')}: {formatTime(20 * 60 - timeLeft)}</p>
            </div>
           
            <div className="result-actions">
              <button className="review-btn" onClick={toggleReviewPopup}>
                📋 {t('reviewQuestions')}
              </button>
              <button className="retry-btn" onClick={retryQuiz}>
                🔄 {t('retrySameLevel')}
              </button>
              {isPassed && (
                <button className="next-btn" onClick={nextLevel}>
                  🚀 {t('nextLevel')}
                </button>
              )}
              <button className="chapters-btn" onClick={backToChapters}>
                📚 {t('backToChapters')}
              </button>
            </div>

            <div className="answers-section">
              <h3>{t('quickReview')}:</h3>
              <div className="answers-grid">
                {quiz.slice(0, 10).map((q, i) => (
                  <div key={i} className={`answer-item ${userAnswers[i] === q.answer ? 'correct' : 'incorrect'}`}>
                    <span className="q-number">Q{i + 1}</span>
                    <span className="correct-answer">{q.answer}</span>
                    <span className="user-answer">{userAnswers[i] || t('skipped')}</span>
                  </div>
                ))}
              </div>
              <button className="view-all-btn" onClick={toggleReviewPopup}>
                {t('viewAllQuestions')}
              </button>
            </div>

          </div>
        </div>
      )}
      {quiz.length > 0 && !isFinished && !showInstructions && !error && (
        <div className={`modern-quiz-container ${isFullScreen ? "fullscreen-mode" : ""}`}>
          {/* Main Content Area */}
          <div className="quiz-main-content">
            {/* Quiz Header with Chapter Name */}
            <div className="quiz-header">
              {/* Chapter Name Display */}
              <div className="chapter-info">
                <h3 className="chapter-name">
                  📖 {selectedChapter}
                </h3>
                <p className="chapter-subtitle">
                  {t(`classes.${selectedClass}`)} - {t(`mock-subjects.${selectedSubject.toLowerCase()}`)}
                </p>
              </div>
              
              <div className="progress-section">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{width: `${((currentQ + 1) / quiz.length) * 100}%`}}
                  ></div>
                </div>
                <div className="quiz-stats">
                  <span>{t('questionProgress', { current: currentQ + 1, total: quiz.length })}</span>
                  <span className="timer">⏱️ {formatTime(timeLeft)}</span>
                  <span className="language-badge">🌐 {selectedLanguage}</span>
                  <span className="reward-badge">{t('rewardPoints', { points: rewardPoints })}</span>
                </div>
              </div>
            </div>

            <div className="question-nav">
              {quiz.map((_, index) => (
                <button
                  key={index}
                  className={`nav-dot ${index === currentQ ? 'active' : ''} ${
                    userAnswers[index] ? 'answered' : ''
                  } ${skippedQuestions.includes(index) ? 'skipped' : ''}`}
                  onClick={() => goToQuestion(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="question-section">
              <h3 className="question">{currentQ + 1}. {quiz[currentQ].question}</h3>
             
              {/* Hint Box */}
              {showHint && (
                <div className="hint-box">
                  <div className="hint-header">
                    <span className="hint-icon">💡</span>
                    <strong>{t('hintFeature')}</strong>
                    <span className="hint-cost">-5 {t('points')}</span>
                  </div>
                  <p className="hint-text">{currentHint}</p>
                </div>
              )}
             
              {/* Hint Button */}
              <button
                className={`hint-btn ${rewardPoints < 5 ? 'disabled' : ''}`}
                onClick={handleHint}
                disabled={rewardPoints < 5 || hintLoading}
              >
                {hintLoading ? t('loadingHint') : `💡 ${t('useHint')} (-5 ${t('points')}) ${rewardPoints < 5 ? t('insufficientPoints') : ''}`}
              </button>

              <div className="options-grid">
                {quiz[currentQ].options && Object.entries(quiz[currentQ].options).map(([label, opt]) => (
                  <button
                    key={label}
                    className={`option-card ${
                      selected === label ? 'selected' : ''
                    } ${showAnswer ? (label === quiz[currentQ].answer ? 'correct-answer' : '') : ''}`}
                    onClick={() => handleAnswer(label)}
                    disabled={showAnswer}
                  >
                    <span className="option-text">{opt}</span>
                    {showAnswer && label === quiz[currentQ].answer && (
                      <span className="correct-indicator">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="quiz-navigation">
              <button
                className="nav-btn prev-btn"
                onClick={prevQuestion}
                disabled={currentQ === 0}
              >
                {t('previousQuestion')}
              </button>
              <button
                className="nav-btn skip-btn"
                onClick={skipQuestion}
              >
                {t('skipQuestion')}
              </button>
              <button
                className="nav-btn next-btn"
                onClick={nextQuestion}
              >
                {currentQ < quiz.length - 1 ? t('nextQuestion') : t('finishTest')}
              </button>
            </div>
          </div>


        </div>
      )}
      {showReviewPopup && (
        <div className="popup-overlay">
          <div className="review-popup">
            <div className="popup-header">
              <h2>{t('questionsExplanations')}</h2>
              <button className="close-popup" onClick={toggleReviewPopup}>×</button>
            </div>
            <div className="popup-content">
              <div className="review-summary">
                <p><strong>{t('class')}:</strong> {selectedClass} | <strong>{t('subject')}:</strong> {selectedSubject} | <strong>{t('chapter')}:</strong> {selectedChapter}</p>
                <p><strong>{t('testLanguage')}:</strong> {selectedLanguage}</p>
                <p><strong>{t('score')}:</strong> {score}/{quiz.length} ({Math.round((score / quiz.length) * 100)}%)</p>
                <p><strong>{t('status')}:</strong> <span className={isPassed ? 'pass-text' : 'fail-text'}>{isPassed ? t('pass') : t('fail')}</span></p>
                <p><strong>{t('totalRewardPoints')}:</strong> {rewardPoints}</p>
              </div>
             
              {explanationsLoading ? (
                <div className="explanations-loading">
                  <div className="loading-spinner"></div>
                  <p>{t('generatingExplanations')}</p>
                  <p className="loading-subtext">{t('helpUnderstand')}</p>
                </div>
              ) : (
                <div className="questions-review">
                  {quiz.map((q, index) => {
                    const explanation = explanations.find(exp => exp.question_index === index);
                    const userAnswerText = userAnswers[index] ? q.options[userAnswers[index]] : t('notAttempted');
                    const correctAnswerText = q.options[q.answer];
                   
                    return (
                      <div key={index} className="question-review-item">
                        <div className="question-review-header">
                          <span className="question-number">{t('question')} {index + 1}:</span>
                          <span className={`answer-status ${userAnswers[index] === q.answer ? 'correct' : 'incorrect'}`}>
                            {userAnswers[index] === q.answer ? '✓ ' + t('correct') : userAnswers[index] ? '✗ ' + t('incorrect') : '⏭️ ' + t('skipped')}
                          </span>
                        </div>
                        <p className="review-question">{q.question}</p>
                       
                        {/* Explanation Section */}
                        <div className="explanation-section">
                          <div className="explanation-header">
                            <strong>📝 {t('aiExplanation')}:</strong>
                          </div>
                          <div className="explanation-text">
                            {explanation ? (
                              <div>
                                {explanation.explanation.split('\n').map((line, i) => (
                                  <p key={i} className="explanation-line">{line}</p>
                                ))}
                              </div>
                            ) : (
                              <div className="fallback-explanation">
                                <p><strong>{t('correctAnswer')}:</strong> {correctAnswerText}</p>
                                <p><strong>{t('yourAnswer')}:</strong> {userAnswerText}</p>
                                <p className="fallback-text">
                                  {t('detailedExplanationPending')}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                       
                        <div className="review-options">
                          {Object.entries(q.options).map(([label, option]) => (
                            <div
                              key={label}
                              className={`review-option ${
                                label === q.answer ? 'correct-answer' :
                                label === userAnswers[index] && label !== q.answer ? 'user-incorrect' : ''
                              }`}
                            >
                              <span className="option-label">{label}:</span>
                              <span className="option-text">{option}</span>
                              {label === q.answer && <span className="correct-mark"> ✓ {t('correctAnswer')}</span>}
                              {label === userAnswers[index] && label !== q.answer && <span className="incorrect-mark"> ✗ {t('yourAnswer')}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="popup-actions">
              <button className="popup-close-btn" onClick={toggleReviewPopup}>
                {t('closeReview')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MockTest;