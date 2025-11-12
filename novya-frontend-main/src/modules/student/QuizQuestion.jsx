
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Container,
  Alert,
  Fade,
  Zoom,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Menu,
  MenuItem,
  IconButton,
  CircularProgress,
  Stack,
  Divider
} from '@mui/material';
import {
  CheckCircle,
  RadioButtonUnchecked,
  NavigateNext,
  NavigateBefore,
  Replay,
  EmojiEvents,
  Psychology,
  MenuBook,
  Lightbulb,
  Share,
  Download,
  WhatsApp,
  Email,
  Telegram,
  Instagram,
  Star,
  TrendingUp,
  School
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuiz } from './QuizContext';
import html2canvas from 'html2canvas';
import { FaSnapchat } from 'react-icons/fa';
import { API_CONFIG, fastAPI, djangoAPI } from '../../config/api';
import { addCoins } from '../../utils/coinTracking';

// Modern Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(108, 92, 231, 0.3); }
  50% { box-shadow: 0 0 40px rgba(108, 92, 231, 0.6); }
`;

function QuizQuestion({
  quiz,
  currentQ,
  selected,
  showAnswer,
  score,
  isFinished,
  handleAnswer,
  nextQuestion,
  prevQuestion,
  retryQuiz,
  nextLevel,
  backToChapters,
  currentLevel,
  userAnswers = [],
  handlePause,
  selectedLanguage,
  selectedSubtopic,
  classLevel,
  subject,
  chapter,
  rewardPoints
}) {
  const { t } = useTranslation();
  const optionLabels = ["A", "B", "C", "D"];
  const passed = score >= 5;
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [hintsUsed, setHintsUsed] = useState({});
  const [hintContent, setHintContent] = useState({});
  const [loadingHint, setLoadingHint] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [shareAnchorEl, setShareAnchorEl] = useState(null);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [explanations, setExplanations] = useState([]);
  const [loadingExplanations, setLoadingExplanations] = useState(false);
  const resultRef = useRef(null);
 
  const {
    updateRewardPoints,
    calculateEarnedPoints,
    earnedPoints: contextEarnedPoints,
    resetPointsAwarded,
    hasAwardedPoints
  } = useQuiz();
 
  const [showPointsMessage, setShowPointsMessage] = useState(false);
  const [quizPointsAwarded, setQuizPointsAwarded] = useState(false);

  const navigate = useNavigate();

  const addRewardPointsWithHistory = (points, reason, source = 'system') => {
    // Read current balance from localStorage (source of truth) to avoid stale state
    const currentPoints = parseInt(localStorage.getItem('rewardPoints') || '0');
    const newPoints = Math.max(0, currentPoints + points); // Ensure balance doesn't go negative
   
    localStorage.setItem('rewardPoints', newPoints.toString());
    updateRewardPoints(newPoints);
   
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
   
    // Dispatch event to sync across components
    window.dispatchEvent(new CustomEvent('rewardPointsUpdated', {
      detail: { rewardPoints: newPoints }
    }));
   
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'rewardPoints',
      newValue: newPoints.toString(),
      oldValue: currentPoints.toString()
    }));
   
    return historyEntry;
  };

  // Sync hint deduction to database
  const syncHintDeductionToDatabase = async (coins, reason) => {
    try {
      console.log(`💰 Deducting ${Math.abs(coins)} coins for hint usage...`);
      // Note: Negative coins represent deduction
      const coinResult = await addCoins(coins, 'quiz_hint', reason, null, 'quiz_hint', {
        action: 'hint_used',
        coinsDeducted: Math.abs(coins)
      });
      
      if (coinResult && coinResult.balance) {
        // Update localStorage with database balance (source of truth)
        const newBalance = coinResult.balance.total_coins || 0;
        localStorage.setItem('rewardPoints', newBalance.toString());
        updateRewardPoints(newBalance);
        console.log('✅ Hint deduction synced to database, balance:', newBalance);
        console.log(`   Coins deducted: ${Math.abs(coins)}, New balance: ${newBalance}`);
        
        // Dispatch event to sync across components
        window.dispatchEvent(new CustomEvent('rewardPointsUpdated', {
          detail: { rewardPoints: newBalance }
        }));
        
        // Return success
        return { success: true, balance: newBalance };
      } else {
        console.error('❌ Invalid response from hint deduction:', coinResult);
        const errorMessage = coinResult?.error || 'Failed to deduct coins. Please try again.';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('❌ Error syncing hint deduction to database:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to deduct coins';
      // Re-throw error so calling code knows it failed
      throw new Error(errorMessage);
    }
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleHint = async () => {
    if (rewardPoints < 5) {
      showSnackbar(t('not_enough_points'), 'warning');
      return;
    }

    const currentQuestion = quiz[currentQ];
    if (!currentQuestion) return;

    if (hintsUsed[currentQ]) {
      return;
    }

    setLoadingHint(true);
    try {
      // IMPORTANT: Deduct coins FIRST before marking hint as used
      // Only mark as used if deduction succeeds
      
      // Check if hint already exists in question data
      if (currentQuestion.hint) {
        // IMPORTANT: Deduct coins FIRST before showing hint
        // Only show hint if deduction succeeds
        try {
          console.log('💰 Deducting 5 coins for hint...');
          const result = await syncHintDeductionToDatabase(-5, "Hint used in quiz");
          console.log('✅ Coins deducted successfully:', result);
          
          // If deduction succeeds, mark hint as used and show hint
          setHintsUsed(prev => ({
            ...prev,
            [currentQ]: true
          }));
          
          setHintContent(prev => ({
            ...prev,
            [currentQ]: currentQuestion.hint
          }));
          showSnackbar(t('hint_unlocked'), 'success');
          console.log('✅ Hint displayed after successful coin deduction');
        } catch (error) {
          // If deduction fails, don't show hint and display error
          console.error('❌ Failed to deduct coins for hint:', error);
          showSnackbar(`Failed to deduct coins: ${error.message || 'Please check your balance and try again.'}`, 'error');
          // Don't mark hint as used since deduction failed
        } finally {
          setLoadingHint(false);
        }
      } else {
        // Generate hint dynamically using AI assistant
        try {
          const hintPrompt = `Provide a helpful hint for this quiz question. The hint should guide the student toward the answer without giving it away directly. Keep it concise (1-2 sentences) and educational.

Question: "${currentQuestion.question}"
Options: ${currentQuestion.options?.join(', ') || 'N/A'}

Provide only the hint text, no extra formatting.`;

          const data = await fastAPI.post(API_CONFIG.FASTAPI.AI_ASSISTANT.CHAT, {
            class_level: classLevel || 'Unknown',
            subject: subject || 'Unknown',
            chapter: chapter || selectedSubtopic || 'Unknown',
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
              console.log('💰 Deducting 5 coins for AI-generated hint...');
              const result = await syncHintDeductionToDatabase(-5, "Hint used in quiz");
              console.log('✅ Coins deducted successfully for AI hint:', result);
              
              // If deduction succeeds, mark hint as used and show hint
              setHintsUsed(prev => ({
                ...prev,
                [currentQ]: true
              }));
              
              setHintContent(prev => ({
                ...prev,
                [currentQ]: hintText
              }));
              showSnackbar(t('hint_unlocked'), 'success');
              console.log('✅ AI-generated hint displayed after successful coin deduction');
            } catch (error) {
              // If deduction fails, don't show hint and display error
              console.error('❌ Failed to deduct coins for AI hint:', error);
              showSnackbar(`Failed to deduct coins: ${error.message || 'Please check your balance and try again.'}`, 'error');
              // Don't mark hint as used since deduction failed
            } finally {
              setLoadingHint(false);
            }
          } else {
            setLoadingHint(false);
            throw new Error('Failed to generate hint');
          }
        } catch (aiError) {
          console.error('Error generating hint with AI:', aiError);
          // Fallback: provide a generic helpful hint
          const fallbackHint = 'Review the key concepts related to this question. Consider what you know about the topic and eliminate options that don\'t seem relevant.';
          // IMPORTANT: Deduct coins FIRST before showing hint
          // Only show hint if deduction succeeds
          try {
            console.log('💰 Deducting 5 coins for fallback hint...');
            const result = await syncHintDeductionToDatabase(-5, "Hint used in quiz");
            console.log('✅ Coins deducted successfully for fallback hint:', result);
            
            // If deduction succeeds, mark hint as used and show hint
            setHintsUsed(prev => ({
              ...prev,
              [currentQ]: true
            }));
            
            setHintContent(prev => ({
              ...prev,
              [currentQ]: fallbackHint
            }));
            showSnackbar(t('hint_unlocked'), 'success');
            console.log('✅ Fallback hint displayed after successful coin deduction');
          } catch (error) {
            // If deduction fails, don't show hint and display error
            console.error('❌ Failed to deduct coins for fallback hint:', error);
            showSnackbar(`Failed to deduct coins: ${error.message || 'Please check your balance and try again.'}`, 'error');
            // Don't mark hint as used since deduction failed
          } finally {
            setLoadingHint(false);
          }
        }
      }

    } catch (error) {
      console.error('Error using hint:', error);
      setLoadingHint(false);
      showSnackbar(t('hint_error'), 'error');
      setHintsUsed(prev => {
        const newHints = { ...prev };
        delete newHints[currentQ];
        return newHints;
      });
    } finally {
      setLoadingHint(false);
    }
  };

  const isHintUsed = hintsUsed[currentQ] || false;
  const currentHint = hintContent[currentQ] || quiz[currentQ]?.hint;

  useEffect(() => {
    if (isFinished && retryQuiz) {
      setHintsUsed({});
      setHintContent({});
      resetPointsAwarded();
      setQuizPointsAwarded(false);
    }
  }, [isFinished, retryQuiz, resetPointsAwarded]);

  const handleNextQuestion = () => {
    nextQuestion();
  };

  // Calculate earned points when quiz finishes
  useEffect(() => {
    if (isFinished && quiz.length > 0) {
      // Calculate earned points using new logic (below 5 = 0, 5-7 = score coins, 8-10 = score + 10 bonus)
      calculateEarnedPoints(score, quiz.length, false); // false = not mock test
    }
  }, [isFinished, score, quiz.length, calculateEarnedPoints]);

  useEffect(() => {
    if (isFinished && !showPointsMessage && !quizPointsAwarded) {
      // Note: Coins are already added by QuizContext.updateQuizResults via addEarnedPoints
      // We only show the message here, don't add coins again to avoid double counting
      
      if (contextEarnedPoints.totalPoints > 0) {
        let pointsMessage = `🎉 ${t('quiz_passed_points', { points: contextEarnedPoints.basePoints })}`;
        if (contextEarnedPoints.bonusPoints > 0) {
          pointsMessage += ` + ${t('above_80_bonus_points', { points: contextEarnedPoints.bonusPoints })}`;
        }
        pointsMessage += ` = ${contextEarnedPoints.totalPoints} ${t('total_points')}!`;
       
        showSnackbar(pointsMessage, 'success');
      } else if (score < 5) {
        // Score below 5: no coins awarded
        showSnackbar(`Score ${score}/${quiz.length} is below the minimum threshold (5) for earning coins.`, 'info');
      }
      setQuizPointsAwarded(true);
      setShowPointsMessage(true);
    }
  }, [isFinished, score, quiz.length, contextEarnedPoints, t, showPointsMessage, currentLevel, quizPointsAwarded]);

  useEffect(() => {
    if (isFinished && quiz.length > 0 && !loadingExplanations && explanations.length === 0) {
      fetchExplanations();
    }
  }, [isFinished, quiz, loadingExplanations, explanations.length]);

  const fetchExplanations = async () => {
    setLoadingExplanations(true);
    try {
      const questionsData = quiz.map((q, index) => ({
        question: q.question,
        correct_answer: q.answer,
        user_answer: userAnswers[index] || '',
        options: q.options || []
      }));

      const data = await fastAPI.post(API_CONFIG.FASTAPI.AI_ASSISTANT.GENERATE_EXPLANATIONS, {
        questions: questionsData,
        class_level: classLevel,
        subject: subject,
        chapter: chapter
      });
     
      if (data.success && data.explanations) {
        setExplanations(data.explanations);
        showSnackbar(t('explanations_loaded'), 'success');
      } else {
        throw new Error('No explanations received');
      }
    } catch (error) {
      console.error('Error fetching explanations:', error);
      showSnackbar(t('explanations_error'), 'error');
      const fallbackExplanations = quiz.map((q, index) => ({
        question_index: index,
        question: q.question,
        correct_answer: q.answer,
        user_answer: userAnswers[index] || '',
        explanation: t('explanation_not_available'),
        is_correct: userAnswers[index] === q.answer
      }));
      setExplanations(fallbackExplanations);
    } finally {
      setLoadingExplanations(false);
    }
  };

  useEffect(() => {
    // Sync from localStorage on mount only
    const savedPoints = parseInt(localStorage.getItem('rewardPoints')) || 0;
    if (savedPoints > 0 && rewardPoints === 0) {
      console.log(`Syncing points from localStorage: ${savedPoints}`);
      updateRewardPoints(savedPoints);
    }
  }, []); // Only run on mount

  useEffect(() => {
    const handleRewardPointsUpdate = (event) => {
      if (event.detail && event.detail.rewardPoints !== undefined) {
        const newPoints = event.detail.rewardPoints;
        const currentPoints = parseInt(localStorage.getItem('rewardPoints') || '0');
        // Only update if different to avoid infinite loop
        if (newPoints !== currentPoints) {
          console.log(`Received points update from event: ${newPoints} (current: ${currentPoints})`);
          updateRewardPoints(newPoints);
        }
      }
    };

    window.addEventListener('rewardPointsUpdated', handleRewardPointsUpdate);

    return () => {
      window.removeEventListener('rewardPointsUpdated', handleRewardPointsUpdate);
    };
  }, [updateRewardPoints]); // Only updateRewardPoints as dependency

  useEffect(() => {
    if (document.fullscreenEnabled) document.documentElement.requestFullscreen().catch(() => {});

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setExitDialogOpen(true);
        handlePause && handlePause();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'F12' || (e.ctrlKey && e.key === 't')) {
        e.preventDefault();
        setExitDialogOpen(true);
        handlePause && handlePause();
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setExitDialogOpen(true);
        handlePause && handlePause();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [handlePause]);

  const handleExitConfirm = () => {
    setExitDialogOpen(false);
    if (backToChapters) backToChapters();
    else navigate("/chapters");
  };

  const handleExitCancel = () => {
    setExitDialogOpen(false);
    if (document.fullscreenEnabled) document.documentElement.requestFullscreen().catch(() => {});
  };

  const generateResultImage = async () => {
    if (!resultRef.current) return null;
   
    setGeneratingImage(true);
    try {
      const canvas = await html2canvas(resultRef.current, {
        scale: 2,
        backgroundColor: passed ?
          (score === quiz.length ? '#27ae60' : '#6c5ce7') :
          '#e74c3c',
        useCORS: true,
        allowTaint: true,
        logging: false
      });
     
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error generating image:', error);
      showSnackbar(t('image_generation_error'), 'error');
      return null;
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleShare = async () => {
    try {
      setGeneratingImage(true);
      showSnackbar(t('generating_image'), 'info');
     
      const imageDataUrl = await generateResultImage();
      if (!imageDataUrl) {
        showSnackbar('Failed to generate result card', 'error');
        return;
      }

      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
     
      const percentage = Math.round((score / quiz.length) * 100);
      const fileName = `quiz-result-level-${currentLevel}-${Date.now()}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });
     
      const shareText = `🎯 I scored ${score}/${quiz.length} (${percentage}%) in Level ${currentLevel} Quiz! 🚀`;
     
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: `Quiz Result - Level ${currentLevel}`,
            text: shareText,
            files: [file]
          });
          showSnackbar('Result shared successfully! Select WhatsApp to send.', 'success');
          return;
        } catch (err) {
          console.warn('Native share failed:', err);
          const link = document.createElement('a');
          link.download = fileName;
          link.href = imageDataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
         
          const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
          window.open(whatsappUrl, '_blank');
         
          showSnackbar('Image downloaded and WhatsApp opened. Please attach the image manually.', 'info');
        }
      } else {
        const link = document.createElement('a');
        link.download = fileName;
        link.href = imageDataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
       
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        window.open(whatsappUrl, '_blank');
       
        showSnackbar('Native sharing not supported. Image downloaded and WhatsApp opened. Please attach the image manually.', 'info');
      }
     
    } catch (error) {
      console.error('Error sharing result:', error);
      showSnackbar(t('share_error'), 'error');
    } finally {
      setGeneratingImage(false);
    }
  };

  const downloadImage = async (imageDataUrl = null) => {
    try {
      const dataUrl = imageDataUrl || await generateResultImage();
      if (!dataUrl) return;

      const link = document.createElement('a');
      link.download = `quiz-result-level-${currentLevel}-${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
     
      showSnackbar(t('result_downloaded'), 'success');
    } catch (error) {
      console.error('Error downloading image:', error);
      showSnackbar(t('download_error'), 'error');
    }
  };

  const downloadTextReport = () => {
    const percentage = Math.round((score / quiz.length) * 100);
    const isPerfectScore = score === quiz.length;
   
    let content = `QUIZ RESULT REPORT\n`;
    content += `==================\n\n`;
    content += `Level: ${currentLevel}\n`;
    content += `Date: ${new Date().toLocaleDateString()}\n`;
    content += `Time: ${new Date().toLocaleTimeString()}\n\n`;
    content += `📊 PERFORMANCE SUMMARY\n`;
    content += `-------------------\n`;
    content += `Score: ${score}/${quiz.length}\n`;
    content += `Percentage: ${percentage}%\n`;
    content += `Status: ${passed ? 'PASSED' : 'FAILED'}\n`;
    content += `Reward Points: ${rewardPoints}\n\n`;
   
    if (passed) {
      content += `🪙 POINTS BREAKDOWN\n`;
      content += `-----------------\n`;
      content += `Correct Answers: ${score} × 1 point = ${contextEarnedPoints.basePoints} points\n`;
      if (contextEarnedPoints.bonusPoints > 0) {
        content += `Above 80% Bonus: +${contextEarnedPoints.bonusPoints} points\n`;
      }
      content += `Total Earned: ${contextEarnedPoints.totalPoints} points\n\n`;
    }
   
    content += `📝 QUESTION REVIEW\n`;
    content += `-----------------\n\n`;
   
    quiz.forEach((q, i) => {
      const isCorrect = userAnswers[i] === q?.answer;
      const wasHintUsed = hintsUsed[i];
      const explanation = explanations[i]?.explanation || t('explanation_not_available');
     
      content += `Q${i + 1}: ${q?.question || t('question_not_available')}\n`;
      content += `${t('your_answer')}: ${userAnswers[i] || t('not_answered')} ${isCorrect ? '✓' : '✗'}\n`;
      content += `${t('correct_answer')}: ${q?.answer || t('not_available_short')}\n`;
      content += `${t('status')}: ${isCorrect ? t('correct') : t('incorrect')}\n`;
      content += `${t('explanation')}: ${explanation}\n`;
      if (wasHintUsed) {
        content += `${t('hint_used')}: ${t('yes')}\n`;
        if (q?.hint) {
          content += `${t('hint')}: ${q.hint}\n`;
        }
      }
      content += `\n`;
    });
   
    content += `\n${t('keep_learning')} 🚀`;
   
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz_result_level_${currentLevel}_${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
   
    showSnackbar(t('report_downloaded'), 'success');
  };

  const ResultImageComponent = () => (
    <Box
      ref={resultRef}
      sx={{
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
        width: '400px',
        minHeight: '300px',
        p: 4,
        background: passed ?
          (score === quiz.length ?
            'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)' :
            'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)') :
          'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
        color: 'white',
        borderRadius: 3,
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ fontSize: '2rem', mb: 2 }}>
        🎯 {t('quiz_result')}
      </Typography>
     
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ fontSize: '1.5rem', mb: 3 }}>
        {t('level')} {currentLevel} {passed ? t('completed') : t('failed')}
      </Typography>

      {passed && score === quiz.length && (
        <Typography variant="h6" gutterBottom sx={{ fontSize: '1.2rem', mb: 2, color: '#FFD700' }}>
          🏆 {t('perfect_score')}
        </Typography>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, my: 3, width: '100%' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" fontWeight="bold" sx={{ fontSize: '2.5rem' }}>
            {score}/{quiz.length}
          </Typography>
          <Typography variant="h6" sx={{ fontSize: '1rem' }}>{t('score')}</Typography>
        </Box>
       
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" fontWeight="bold" sx={{ fontSize: '2.5rem' }}>
            {Math.round((score / quiz.length) * 100)}%
          </Typography>
          <Typography variant="h6" sx={{ fontSize: '1rem' }}>{t('accuracy')}</Typography>
        </Box>
      </Box>

      <Box sx={{
        background: 'rgba(255,255,255,0.2)',
        p: 2,
        borderRadius: 2,
        my: 2,
        width: '100%',
        backdropFilter: 'blur(10px)'
      }}>
        <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem', mb: 2 }}>
          ⭐ {t('points')}: {rewardPoints}
        </Typography>
       
        {passed && (
          <Box sx={{ textAlign: 'left', pl: 1 }}>
            <Typography variant="body1" sx={{ fontSize: '0.9rem', mb: 0.5 }}>
              ✅ {t('correct')}: {score} × 1 = {contextEarnedPoints.basePoints} {t('pts')}
            </Typography>
            {contextEarnedPoints.bonusPoints > 0 && (
              <Typography variant="body1" sx={{ fontSize: '0.9rem', mb: 0.5 }}>
                🎁 {t('bonus')}: +{contextEarnedPoints.bonusPoints} {t('pts')}
              </Typography>
            )}
            <Typography variant="body1" fontWeight="bold" sx={{ fontSize: '1rem' }}>
              💰 {t('earned')}: {contextEarnedPoints.totalPoints} {t('pts')}
            </Typography>
          </Box>
        )}
      </Box>

      <Typography variant="body2" sx={{ mt: 2, opacity: 0.9, fontSize: '0.8rem' }}>
        {new Date().toLocaleDateString()} {t('at')} {new Date().toLocaleTimeString()}
      </Typography>
    </Box>
  );

  // Modern Top Header with Subject Info in Middle
  const ModernHeader = () => (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.95) 0%, rgba(162, 155, 254, 0.95) 100%)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
    }}>
      <Container maxWidth="lg">
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2
        }}>
          {/* Left: Level Badge */}
          <Chip
            icon={<School />}
            label={`${t('level')} ${currentLevel}`}
            sx={{
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem',
              px: 2,
              py: 2.5,
              border: '1px solid rgba(255,255,255,0.3)',
              '& .MuiChip-icon': { color: 'white' }
            }}
          />

          {/* Middle: Subject Information */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
            mx: 3,
            textAlign: 'center'
          }}>
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                mb: 0.5,
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              {classLevel} • {subject}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: '0.9rem',
                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}
            >
              {chapter} • {selectedSubtopic}
            </Typography>
          </Box>

          {/* Right: Points and Actions */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Chip
              icon={<Star sx={{ animation: `${pulse} 2s infinite` }} />}
              label={`${rewardPoints} ${t('points')}`}
              sx={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                px: 2,
                py: 2.5,
                border: '2px solid rgba(255,255,255,0.5)',
                boxShadow: '0 4px 15px rgba(255,215,0,0.4)',
                animation: `${glow} 2s infinite`,
                '& .MuiChip-icon': { color: '#000' }
              }}
            />
           
            {isFinished && (
              <>
                <IconButton
                  onClick={handleShare}
                  disabled={generatingImage}
                  sx={{
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.3)',
                      transform: 'scale(1.1)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                    },
                    '&:disabled': {
                      opacity: 0.5,
                      background: 'rgba(255,255,255,0.1)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <WhatsApp />
                </IconButton>
               
                <IconButton
                  onClick={() => downloadImage()}
                  disabled={generatingImage}
                  sx={{
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.3)',
                      transform: 'scale(1.1)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                    },
                    '&:disabled': {
                      opacity: 0.5,
                      background: 'rgba(255,255,255,0.1)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Download />
                </IconButton>
              </>
            )}
          </Stack>
        </Box>
      </Container>
    </Box>
  );

  if (!quiz || !Array.isArray(quiz) || quiz.length === 0) {
    return (
      <>
        <ModernHeader />
        <Container maxWidth="md" sx={{ pt: 12, pb: 4 }}>
          <Fade in={true}>
            <Paper elevation={0} sx={{
              p: 5,
              textAlign: 'center',
              borderRadius: 4,
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              border: '1px solid rgba(108,92,231,0.1)'
            }}>
              <Psychology sx={{ fontSize: 80, color: '#6c5ce7', mb: 3, animation: `${float} 3s infinite` }} />
              <Typography variant="h4" gutterBottom fontWeight="bold" color="text.primary">
                {t('not_available')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem' }}>
                {t('data_issue')}
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={retryQuiz}
                startIcon={<Replay />}
                sx={{
                  borderRadius: 3,
                  px: 5,
                  py: 1.5,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
                  boxShadow: '0 8px 25px rgba(108,92,231,0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5b4cd8, #9188fd)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 35px rgba(108,92,231,0.4)'
                  }
                }}
              >
                {t('retry_quiz')}
              </Button>
            </Paper>
          </Fade>
        </Container>
      </>
    );
  }

  if (isFinished) {
    const percentage = Math.round((score / quiz.length) * 100);
    const isPerfectScore = score === quiz.length;
    const hasBonus = contextEarnedPoints.bonusPoints > 0;

    return (
      <>
        <ModernHeader />
        <Container maxWidth="lg" sx={{ pt: 12, pb: 6 }}>
          <ResultImageComponent />
         
          {generatingImage && (
            <Alert
              severity="info"
              sx={{
                mb: 3,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                border: '1px solid #90caf9'
              }}
            >
              {t('generating_image')}
            </Alert>
          )}

          <Fade in={true}>
            <Box>
              {/* Modern Result Card */}
              <Paper elevation={0} sx={{
                p: 5,
                textAlign: 'center',
                borderRadius: 4,
                background: passed ?
                  (isPerfectScore ?
                    'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)' :
                    'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)') :
                  'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                color: 'white',
                mb: 4,
                position: 'relative',
                overflow: 'hidden',
                border: '2px solid rgba(255,255,255,0.2)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  animation: `${shimmer} 3s infinite`
                }
              }}>
                <Zoom in={true}>
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    {passed && isPerfectScore && (
                      <Box sx={{ mb: 3 }}>
                        <EmojiEvents sx={{
                          fontSize: 100,
                          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))',
                          animation: `${float} 3s infinite`
                        }} />
                      </Box>
                    )}
                   
                    <Typography variant="h2" gutterBottom fontWeight="900" sx={{
                      fontSize: { xs: '2rem', md: '3rem' },
                      textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                      mb: 2
                    }}>
                      {passed ? (isPerfectScore ? `🎉 ${t('perfect_score')}` : `✨ ${t('well_done')}`) : `💪 ${t('try_again')}`}
                    </Typography>
                   
                    <Typography variant="h5" sx={{
                      mb: 4,
                      opacity: 0.95,
                      fontSize: { xs: '1.2rem', md: '1.5rem' }
                    }}>
                      {t('level')} {currentLevel} {passed ? t('completed') : t('failed')}
                    </Typography>

                    {/* Score Display */}
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 3,
                      mb: 4,
                      flexWrap: 'wrap'
                    }}>
                      <Box sx={{
                        background: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 3,
                        p: 3,
                        minWidth: '140px',
                        border: '2px solid rgba(255,255,255,0.3)'
                      }}>
                        <Typography variant="h2" fontWeight="900" sx={{
                          fontSize: { xs: '2.5rem', md: '3.5rem' }
                        }}>
                          {score}/{quiz.length}
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
                          {t('score')}
                        </Typography>
                      </Box>
                     
                      <Box sx={{
                        background: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 3,
                        p: 3,
                        minWidth: '140px',
                        border: '2px solid rgba(255,255,255,0.3)'
                      }}>
                        <Typography variant="h2" fontWeight="900" sx={{
                          fontSize: { xs: '2.5rem', md: '3.5rem' }
                        }}>
                          {percentage}%
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
                          {t('accuracy')}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Points Breakdown */}
                    {passed && (
                      <Box sx={{
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: 3,
                        p: 3,
                        border: '2px solid rgba(255,255,255,0.25)',
                        maxWidth: '500px',
                        mx: 'auto'
                      }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                          🎁 {t('points_earned')}
                        </Typography>
                        <Stack spacing={1.5}>
                          <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.1)',
                            p: 2,
                            borderRadius: 2
                          }}>
                            <Typography>✅ {t('correct_answers')} ({score})</Typography>
                            <Typography fontWeight="bold">+{contextEarnedPoints.basePoints} {t('pts')}</Typography>
                          </Box>
                          {hasBonus && (
                            <Box sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              background: 'rgba(255,215,0,0.2)',
                              p: 2,
                              borderRadius: 2,
                              border: '1px solid rgba(255,215,0,0.4)'
                            }}>
                              <Typography>🌟 {t('above_80_bonus')}</Typography>
                              <Typography fontWeight="bold">+{contextEarnedPoints.bonusPoints} {t('pts')}</Typography>
                            </Box>
                          )}
                          <Divider sx={{ borderColor: 'rgba(255,255,255,0.3)', my: 1 }} />
                          <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.2)',
                            p: 2.5,
                            borderRadius: 2,
                            border: '2px solid rgba(255,255,255,0.4)'
                          }}>
                            <Typography variant="h6" fontWeight="bold">💰 {t('total_earned')}</Typography>
                            <Typography variant="h5" fontWeight="900">{contextEarnedPoints.totalPoints} {t('pts')}</Typography>
                          </Box>
                        </Stack>
                      </Box>
                    )}

                    {!passed && (
                      <Alert
                        severity="warning"
                        sx={{
                          background: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderRadius: 2,
                          mt: 3,
                          '& .MuiAlert-icon': { color: 'white' }
                        }}
                      >
                        {t('score_warning')}
                      </Alert>
                    )}
                  </Box>
                </Zoom>
              </Paper>

              {/* Questions Review Section - Updated with 10 cards */}
              <Box sx={{
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                borderRadius: 4,
                p: 4,
                mb: 4
              }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 4
                }}>
                  <TrendingUp sx={{ fontSize: 40, color: '#6c5ce7' }} />
                  <Typography variant="h4" fontWeight="bold" color="text.primary">
                    {t('review_questions_answers')}
                  </Typography>
                </Box>

                {loadingExplanations && (
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: 4,
                    p: 3,
                    background: 'white',
                    borderRadius: 3
                  }}>
                    <CircularProgress sx={{ mr: 2, color: '#6c5ce7' }} />
                    <Typography variant="h6" color="text.primary">
                      {t('loading_explanations')}
                    </Typography>
                  </Box>
                )}

                <Stack spacing={3}>
                  {quiz.slice(0, 10).map((q, i) => {
                    const isCorrect = userAnswers[i] === q?.answer;
                    const wasHintUsed = hintsUsed[i];
                    const explanation = explanations[i]?.explanation || '';

                    return (
                      <Zoom in={true} key={i} style={{ transitionDelay: `${i * 50}ms` }}>
                        <Card elevation={0} sx={{
                          borderRadius: 3,
                          border: `3px solid ${isCorrect ? '#27ae60' : '#e74c3c'}`,
                          overflow: 'hidden',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                          }
                        }}>
                          {/* Question Header */}
                          <Box sx={{
                            background: isCorrect ?
                              'linear-gradient(135deg, #27ae60, #2ecc71)' :
                              'linear-gradient(135deg, #e74c3c, #c0392b)',
                            color: 'white',
                            p: 2.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Chip
                                label={`Q${i + 1}`}
                                sx={{
                                  background: 'rgba(255,255,255,0.25)',
                                  color: 'white',
                                  fontWeight: 'bold',
                                  fontSize: '1rem'
                                }}
                              />
                              {isCorrect ? (
                                <CheckCircle sx={{ fontSize: 30 }} />
                              ) : (
                                <Typography sx={{ fontSize: 30 }}>✗</Typography>
                              )}
                            </Box>
                            {wasHintUsed && (
                              <Chip
                                icon={<Lightbulb sx={{ color: 'white !important' }} />}
                                label={t('hint_used')}
                                size="small"
                                sx={{
                                  background: 'rgba(255,255,255,0.25)',
                                  color: 'white',
                                  fontWeight: 'bold'
                                }}
                              />
                            )}
                          </Box>

                          <CardContent sx={{ p: 3 }}>
                            {/* Question Text */}
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, lineHeight: 1.6, color: '#000000' }}>
                              {q?.question || t('question_not_available')}
                            </Typography>

                            {/* Options List */}
                            <Stack spacing={1.5} sx={{ mb: 3 }}>
                              {q?.options?.map((opt, j) => {
                                const isSelected = userAnswers[i] === opt;
                                const isAnswer = opt === q.answer;
                                return (
                                  <Box key={j} sx={{
                                    background: isAnswer
                                      ? 'linear-gradient(135deg, #27ae60, #2ecc71)'
                                      : isSelected && !isAnswer
                                      ? 'linear-gradient(135deg, #e74c3c, #c0392b)'
                                      : '#f8f9fa',
                                    color: isAnswer || (isSelected && !isAnswer) ? 'white' : '#000000',
                                    borderRadius: 2,
                                    p: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    border: '2px solid',
                                    borderColor: isAnswer || (isSelected && !isAnswer) ? 'transparent' : '#e9ecef',
                                    transition: 'all 0.3s ease'
                                  }}>
                                    <Box sx={{
                                      width: 32,
                                      height: 32,
                                      borderRadius: '50%',
                                      background: isAnswer || (isSelected && !isAnswer) ?
                                        'rgba(255,255,255,0.25)' : '#6c5ce7',
                                      color: isAnswer || (isSelected && !isAnswer) ? 'white' : 'white',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontWeight: 'bold',
                                      flexShrink: 0
                                    }}>
                                      {optionLabels[j]}
                                    </Box>
                                    <Typography sx={{
                                      fontWeight: isAnswer ? 'bold' : 'normal',
                                      flex: 1,
                                      color: isAnswer || (isSelected && !isAnswer) ? 'white' : '#000000'
                                    }}>
                                      {opt}
                                    </Typography>
                                    {isAnswer && <CheckCircle />}
                                  </Box>
                                );
                              })}
                            </Stack>

                            {/* Answer Summary */}
                            <Box sx={{
                              display: 'flex',
                              gap: 2,
                              mb: 2,
                              flexWrap: 'wrap'
                            }}>
                              <Chip
                                label={`${t('your_answer')}: ${userAnswers[i] || t('not_answered')}`}
                                color={isCorrect ? "success" : "error"}
                                variant="outlined"
                                sx={{ fontWeight: 'bold' }}
                              />
                              <Chip
                                label={`${t('correct_answer')}: ${q?.answer || t('not_available_short')}`}
                                sx={{
                                  background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
                                  color: 'white',
                                  fontWeight: 'bold'
                                }}
                              />
                            </Box>

                            {/* Hint Display */}
                            {wasHintUsed && (hintContent[i] || q?.hint) && (
                              <Alert
                                severity="info"
                                icon={<Lightbulb />}
                                sx={{
                                  mb: 2,
                                  borderRadius: 2,
                                  background: 'linear-gradient(135deg, #fff9e6, #ffe8a1)',
                                  border: '2px solid #ffd54f'
                                }}
                              >
                                <Typography variant="body2" fontWeight="600" color="#000000">
                                  💡 {t('hint')}: {hintContent[i] || q?.hint}
                                </Typography>
                              </Alert>
                            )}

                            {/* Explanation */}
                            {explanation && (
                              <Box sx={{
                                background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
                                borderRadius: 2,
                                p: 3,
                                border: '2px solid #90caf9'
                              }}>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight="bold"
                                  sx={{
                                    mb: 1.5,
                                    color: '#1976d2',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                  }}
                                >
                                  📚 {t('Explanation')}
                                </Typography>
                                <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#000000' }}>
                                  {explanation}
                                </Typography>
                              </Box>
                            )}

                            {loadingExplanations && !explanation && (
                              <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                p: 2,
                                background: '#f8f9fa',
                                borderRadius: 2
                              }}>
                                <CircularProgress size={20} />
                                <Typography variant="body2" color="text.secondary">
                                  {t('loading_explanation')}
                                </Typography>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      </Zoom>
                    );
                  })}
                </Stack>

                {/* Show message if there are more than 10 questions */}
                {quiz.length > 10 && (
                  <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      {t('showing_questions', { count: 10, total: quiz.length })}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Action Buttons */}
              <Box sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                flexWrap: 'wrap',
                mb: 4
              }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => backToChapters && backToChapters()}
                  startIcon={<MenuBook />}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    borderWidth: 2,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    borderColor: '#6c5ce7',
                    color: '#6c5ce7',
                    '&:hover': {
                      borderWidth: 2,
                      background: 'rgba(108,92,231,0.05)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  {t('back_to_subjects')}
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={retryQuiz}
                  startIcon={<Replay />}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    borderWidth: 2,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    borderColor: '#e74c3c',
                    color: '#e74c3c',
                    '&:hover': {
                      borderWidth: 2,
                      background: 'rgba(231,76,60,0.05)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  {t('retry_level', { level: currentLevel })}
                </Button>

                {passed && (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={nextLevel}
                    endIcon={<NavigateNext />}
                    sx={{
                      borderRadius: 3,
                      px: 5,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
                      boxShadow: '0 8px 25px rgba(39,174,96,0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #229954, #27ae60)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 35px rgba(39,174,96,0.4)'
                      }
                    }}
                  >
                    {t('go_to_level', { level: currentLevel + 1 })}
                  </Button>
                )}
              </Box>
            </Box>
          </Fade>
        </Container>
      </>
    );
  }

  // Question Page
  const question = quiz[currentQ];
  if (!question) return null;

  const progress = ((currentQ + 1) / quiz.length) * 100;

  return (
    <>
      <ModernHeader />
      <Container maxWidth="md" sx={{ pt: 12, pb: 6 }}>
        <Fade in={true}>
          <Box>
            {/* Modern Progress Bar */}
            <Box sx={{ mb: 5 }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
              }}>
                <Typography variant="h6" fontWeight="bold" color="text.primary">
                  {t('question')} {currentQ + 1} {t('of')} {quiz.length}
                </Typography>
               
                <Chip
                  label={`${Math.round(progress)}%`}
                  sx={{
                    background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1rem'
                  }}
                />
              </Box>
              <Box sx={{ position: 'relative' }}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 12,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
                      borderRadius: 3,
                      boxShadow: '0 0 20px rgba(108,92,231,0.5)'
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Modern Question Card */}
            <Card elevation={0} sx={{
              borderRadius: 4,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              mb: 4,
              border: '2px solid #e9ecef',
              boxShadow: '0 15px 50px rgba(0,0,0,0.08)',
              overflow: 'hidden'
            }}>
              <Box sx={{
                background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
                p: 0.5
              }} />
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  component="div"
                  fontWeight="bold"
                  sx={{
                    lineHeight: 1.6,
                    color: '#000000',
                    mb: 3
                  }}
                >
                  {currentQ + 1}. {question.question}
                </Typography>
               
                {/* Hint Section */}
                <Box sx={{ mt: 3 }}>
                  {!isHintUsed ? (
                    <Box>
                      <Button
                        variant="outlined"
                        startIcon={<Lightbulb />}
                        onClick={handleHint}
                        disabled={rewardPoints < 5 || loadingHint}
                        sx={{
                          borderRadius: 2,
                          px: 3,
                          py: 1.5,
                          borderWidth: 2,
                          borderColor: '#ffd54f',
                          color: '#f57c00',
                          fontWeight: 'bold',
                          '&:hover': {
                            borderWidth: 2,
                            background: '#fff9e6',
                            borderColor: '#ffb300'
                          },
                          '&:disabled': {
                            opacity: 0.5,
                            borderColor: '#ddd'
                          }
                        }}
                      >
                        {loadingHint ? t('loading_hint') : `💡 ${t('get_hint')} (5 ${t('points')})`}
                      </Button>
                      {rewardPoints < 5 && (
                        <Typography variant="body2" color="error" sx={{ mt: 1, fontWeight: 500 }}>
                          {t('not_enough_points_for_hint')}
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <Alert
                      severity="info"
                      icon={<Lightbulb />}
                      sx={{
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #fff9e6, #ffe8a1)',
                        border: '2px solid #ffd54f'
                      }}
                    >
                      <Typography fontWeight="600" color="#000000">
                        💡 {currentHint || t('no_hint_available')}
                      </Typography>
                    </Alert>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Modern Options */}
            <Stack spacing={2.5} sx={{ mb: 5 }}>
              {question.options?.map((opt, i) => {
                const isSelected = selected === opt;
                return (
                  <Zoom in={true} key={i} style={{ transitionDelay: `${i * 80}ms` }}>
                    <Button
                      fullWidth
                      variant={isSelected ? "contained" : "outlined"}
                      onClick={() => handleAnswer(opt)}
                      sx={{
                        py: 3,
                        px: 3,
                        borderRadius: 3,
                        borderWidth: isSelected ? 0 : 2,
                        textTransform: 'none',
                        justifyContent: 'flex-start',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        background: isSelected ?
                          'linear-gradient(135deg, #4028f5ff, #a29bfe)' :
                          'white',
                        color: isSelected ? 'white' : '#000000',
                        borderColor: '#e9ecef',
                        boxShadow: isSelected ?
                          '0 10px 30px rgba(108,92,231,0.3)' :
                          '0 4px 15px rgba(0,0,0,0.05)',
                        '&:hover': {
                          borderWidth: 2,
                          background: isSelected ?
                            'linear-gradient(135deg, #4028f5ff, #9188fd)' :
                            '#f8f9fa',
                          transform: 'translateY(-2px)',
                          boxShadow: isSelected ?
                            '0 15px 40px rgba(108,92,231,0.4)' :
                            '0 8px 25px rgba(0,0,0,0.1)'
                        },
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        gap: 2.5
                      }}
                    >
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: isSelected ?
                          'rgba(255,255,255,0.25)' :
                          'linear-gradient(135deg, #6c5ce7, #a29bfe)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        flexShrink: 0,
                        border: isSelected ? '2px solid rgba(255,255,255,0.5)' : 'none'
                      }}>
                        {optionLabels[i]}
                      </Box>
                      <Typography sx={{
                        flex: 1,
                        textAlign: 'left',
                        lineHeight: 1.5,
                        color: isSelected ? 'white' : '#000000'
                      }}>
                        {opt}
                      </Typography>
                    </Button>
                  </Zoom>
                );
              })}
            </Stack>

            {/* Modern Navigation */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 3
            }}>
              <Button
                variant="outlined"
                size="large"
                onClick={prevQuestion}
                disabled={currentQ === 0}
                startIcon={<NavigateBefore />}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  minWidth: '150px',
                  borderWidth: 2,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  borderColor: '#6c5ce7',
                  color: '#6c5ce7',
                  '&:hover': {
                    borderWidth: 2,
                    background: 'rgba(108,92,231,0.05)',
                    transform: 'translateY(-2px)'
                  },
                  '&:disabled': {
                    opacity: 0.4,
                    borderColor: '#ddd',
                    color: '#999'
                  }
                }}
              >
                {t('previous')}
              </Button>
             
              <Button
                variant="contained"
                size="large"
                onClick={handleNextQuestion}
                endIcon={<NavigateNext />}
                sx={{
                  borderRadius: 3,
                  px: 5,
                  py: 1.5,
                  minWidth: '150px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #00b894, #00cec9)',
                  boxShadow: '0 8px 25px rgba(0,184,148,0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #00a085, #00b894)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 35px rgba(0,184,148,0.4)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {currentQ + 1 === quiz.length ? t('submit') : t('next')}
              </Button>
            </Box>
          </Box>
        </Fade>

        {/* Exit Confirmation Dialog */}
        <Dialog
          open={exitDialogOpen}
          onClose={handleExitCancel}
          PaperProps={{
            sx: {
              borderRadius: 4,
              minWidth: '400px',
              overflow: 'hidden'
            }
          }}
        >
          <Box sx={{
            background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
            p: 3
          }}>
            <DialogTitle sx={{ p: 0, color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {t('exit_quiz')}
            </DialogTitle>
          </Box>
          <DialogContent sx={{ p: 3, mt: 2 }}>
            <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
              {t('exit_quiz_confirmation')}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              onClick={handleExitCancel}
              variant="outlined"
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                borderWidth: 2,
                fontWeight: 'bold',
                '&:hover': {
                  borderWidth: 2
                }
              }}
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={handleExitConfirm}
              variant="contained"
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #c0392b, #a93226)'
                }
              }}
            >
              {t('exit')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modern Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{
              borderRadius: 2,
              minWidth: '300px',
              fontSize: '1rem',
              fontWeight: 500
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}

export default QuizQuestion;
