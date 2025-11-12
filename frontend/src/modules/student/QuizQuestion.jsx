
 
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Typography,
//   LinearProgress,
//   Chip,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemIcon,
//   Paper,
//   Container,
//   Alert,
//   Fade,
//   Zoom,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions
// } from '@mui/material';
// import {
//   CheckCircle,
//   RadioButtonUnchecked,
//   NavigateNext,
//   NavigateBefore,
//   Replay,
//   EmojiEvents,
//   Psychology,
//   MenuBook
// } from '@mui/icons-material';
// import { keyframes } from '@emotion/react';
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // <--- Added
 
// // Animation keyframes
// const fadeIn = keyframes`
//   from { opacity: 0; transform: translateY(20px); }
//   to { opacity: 1; transform: translateY(0); }
// `;
 
// const pulse = keyframes`
//   0% { transform: scale(1); }
//   50% { transform: scale(1.05); }
//   100% { transform: scale(1); }
// `;
 
// const slideIn = keyframes`
//   from { opacity: 0; transform: translateX(-20px); }
//   to { opacity: 1; transform: translateX(0); }
// `;
 
// function QuizQuestion({
//   quiz,
//   currentQ,
//   selected,
//   showAnswer,
//   score,
//   isFinished,
//   handleAnswer,
//   nextQuestion,
//   prevQuestion,
//   retryQuiz,
//   nextLevel,
//   backToChapters,
//   currentLevel,
//   userAnswers = [],
//   handlePause // optional function to pause quiz timer
// }) {
//   const optionLabels = ["A", "B", "C", "D"];
//   const passed = score >= 5;
//   const [exitDialogOpen, setExitDialogOpen] = useState(false);
 
//   const navigate = useNavigate(); // <--- Added
 
//   // Fullscreen and restricted mode handlers
//   useEffect(() => {
//     if (document.fullscreenEnabled) {
//       document.documentElement.requestFullscreen().catch(() => {});
//     }
 
//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//         setExitDialogOpen(true);
//         handlePause && handlePause();
//       }
//     };
 
//     const handleKeyDown = (e) => {
//       if (e.key === 'Escape' || e.key === 'F12' || (e.ctrlKey && e.key === 't')) {
//         e.preventDefault();
//         setExitDialogOpen(true);
//         handlePause && handlePause();
//       }
//     };
 
//     const handleFullscreenChange = () => {
//       if (!document.fullscreenElement) {
//         setExitDialogOpen(true);
//         handlePause && handlePause();
//       }
//     };
 
//     document.addEventListener('visibilitychange', handleVisibilityChange);
//     document.addEventListener('keydown', handleKeyDown);
//     document.addEventListener('fullscreenchange', handleFullscreenChange);
 
//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//       document.removeEventListener('keydown', handleKeyDown);
//       document.removeEventListener('fullscreenchange', handleFullscreenChange);
//     };
//   }, [handlePause]);
 
//   // Updated: Exit button navigates back
//   const handleExitConfirm = () => {
//     setExitDialogOpen(false);
//     if (backToChapters) {
//       backToChapters();
//     } else {
//       navigate("/chapters"); // fallback path
//     }
//   };
 
//   const handleExitCancel = () => {
//     setExitDialogOpen(false);
//     if (document.fullscreenEnabled) {
//       document.documentElement.requestFullscreen().catch(() => {});
//     }
//   };
 
//   // If quiz is empty
//   if (!quiz || !Array.isArray(quiz) || quiz.length === 0) {
//     return (
//       <Container maxWidth="md" sx={{ py: 4 }}>
//         <Fade in={true}>
//           <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
//             <Psychology sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
//             <Typography variant="h4" gutterBottom color="text.primary">
//               Quiz Not Available
//             </Typography>
//             <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
//               There seems to be an issue with the quiz data.
//             </Typography>
//             <Button
//               variant="contained"
//               size="large"
//               onClick={retryQuiz}
//               startIcon={<Replay />}
//               sx={{
//                 borderRadius: 2,
//                 px: 4,
//                 py: 1.5,
//                 background: 'linear-gradient(45deg, #6c5ce7, #a29bfe)'
//               }}
//             >
//               Retry Quiz
//             </Button>
//           </Paper>
//         </Fade>
//       </Container>
//     );
//   }
 
//   // If quiz finished
//   if (isFinished) {
//     const percentage = Math.round((score / quiz.length) * 100);
//     const isPerfectScore = score === quiz.length;
 
//     return (
//       <Container maxWidth="lg" sx={{ py: 4 }}>
//         <Fade in={true}>
//           <Box>
//             <Paper
//               elevation={4}
//               sx={{
//                 p: 4,
//                 textAlign: 'center',
//                 borderRadius: 3,
//                 background: passed
//                   ? isPerfectScore
//                     ? 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)'
//                     : 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)'
//                   : 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
//                 color: 'white',
//                 mb: 4
//               }}
//             >
//               <Zoom in={true}>
//                 <Box>
//                   {passed && isPerfectScore && (
//                     <EmojiEvents sx={{ fontSize: 80, mb: 2, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }} />
//                   )}
//                   <Typography variant="h3" gutterBottom fontWeight="bold">
//                     Level {currentLevel} {passed ? 'Completed!' : 'Failed'}
//                   </Typography>
//                   <Typography variant="h6" sx={{ mb: 2 }}>
//                     {passed
//                       ? (isPerfectScore ? 'Perfect Score! 🎉' : 'Great Job! You passed!')
//                       : `You need at least 5 marks to pass. You got ${score} marks.`}
//                   </Typography>
                 
//                   <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
//                     <Chip
//                       label={`${score}/${quiz.length}`}
//                       sx={{
//                         background: 'rgba(255,255,255,0.2)',
//                         color: 'white',
//                         fontSize: '1.5rem',
//                         height: '50px',
//                         '& .MuiChip-label': { px: 3 }
//                       }}
//                     />
//                     <Chip
//                       label={`${percentage}%`}
//                       sx={{
//                         background: 'rgba(255,255,255,0.2)',
//                         color: 'white',
//                         fontSize: '1.5rem',
//                         height: '50px',
//                         '& .MuiChip-label': { px: 3 }
//                       }}
//                     />
//                     <Chip
//                       label={passed ? "PASSED" : "FAILED"}
//                       color={passed ? "success" : "error"}
//                       sx={{
//                         fontSize: '1rem',
//                         height: '50px',
//                         '& .MuiChip-label': { px: 3 }
//                       }}
//                     />
//                   </Box>
 
//                   {!passed && (
//                     <Alert severity="warning" sx={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
//                       You need to score at least 5 marks to proceed to the next level.
//                     </Alert>
//                   )}
//                 </Box>
//               </Zoom>
//             </Paper>
 
//             <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
//               Review Questions & Answers
//             </Typography>
           
//             <List sx={{ mb: 4 }}>
//               {quiz.map((q, i) => {
//                 const isCorrect = userAnswers[i] === q?.answer;
//                 return (
//                   <Zoom in={true} key={i} style={{ transitionDelay: `${i * 100}ms` }}>
//                     <Card
//                       sx={{
//                         mb: 2,
//                         border: isCorrect ? '2px solid #27ae60' : '2px solid #e74c3c',
//                         animation: `${slideIn} 0.5s ease-out`
//                       }}
//                     >
//                       <CardContent sx={{ p: 3 }}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                           <Chip
//                             label={`Q${i + 1}`}
//                             color={isCorrect ? "success" : "error"}
//                             size="small"
//                           />
//                           <Typography variant="h6" sx={{ ml: 2, flex: 1 }}>
//                             {q?.question || "Question not available"}
//                           </Typography>
//                         </Box>
                       
//                         <List dense>
//                           {q?.options?.map((opt, j) => {
//                             const isSelected = userAnswers[i] === opt;
//                             const isAnswer = opt === q.answer;
//                             return (
//                               <ListItem
//                                 key={j}
//                                 sx={{
//                                   background: isAnswer
//                                     ? 'linear-gradient(45deg, #27ae60, #2ecc71)'
//                                     : isSelected && !isAnswer
//                                     ? 'linear-gradient(45deg, #e74c3c, #c0392b)'
//                                     : 'transparent',
//                                   color: isAnswer || (isSelected && !isAnswer) ? 'white' : 'text.primary',
//                                   borderRadius: 1,
//                                   mb: 0.5,
//                                   animation: `${fadeIn} 0.3s ease-out`
//                                 }}
//                               >
//                                 <ListItemIcon sx={{ minWidth: 40 }}>
//                                   {isAnswer ? (
//                                     <CheckCircle sx={{ color: 'white' }} />
//                                   ) : (
//                                     <RadioButtonUnchecked />
//                                   )}
//                                 </ListItemIcon>
//                                 <ListItemText
//                                   primary={`${optionLabels[j]}. ${opt}`}
//                                   primaryTypographyProps={{
//                                     fontWeight: isAnswer ? 'bold' : 'normal'
//                                   }}
//                                 />
//                               </ListItem>
//                             );
//                           })}
//                         </List>
                       
//                         <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
//                           <Chip
//                             label={`Your Answer: ${userAnswers[i] || "Not answered"}`}
//                             color={isCorrect ? "success" : "error"}
//                             variant="outlined"
//                           />
//                           <Chip
//                             label={`Correct: ${q?.answer || "Not available"}`}
//                             color="success"
//                             variant="outlined"
//                           />
//                         </Box>
//                       </CardContent>
//                     </Card>
//                   </Zoom>
//                 );
//               })}
//             </List>
           
//             <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
//               <Button
//                 variant="outlined"
//                 size="large"
//                 onClick={() => backToChapters && backToChapters()}
//                 startIcon={<MenuBook />}
//                 sx={{
//                   borderRadius: 2,
//                   px: 4,
//                   py: 1.5,
//                   borderWidth: 2,
//                   '&:hover': { borderWidth: 2 }
//                 }}
//               >
//                 Back to Subjects
//               </Button>
             
//               <Button
//                 variant="outlined"
//                 size="large"
//                 onClick={retryQuiz}
//                 startIcon={<Replay />}
//                 sx={{
//                   borderRadius: 2,
//                   px: 4,
//                   py: 1.5,
//                   borderWidth: 2,
//                   '&:hover': { borderWidth: 2 }
//                 }}
//               >
//                 Retry Level {currentLevel}
//               </Button>
             
//               {passed && (
//                 <Button
//                   variant="contained"
//                   size="large"
//                   onClick={nextLevel}
//                   endIcon={<NavigateNext />}
//                   sx={{
//                     borderRadius: 2,
//                     px: 4,
//                     py: 1.5,
//                     background: 'linear-gradient(45deg, #27ae60, #2ecc71)',
//                     '&:hover': {
//                       background: 'linear-gradient(45deg, #229954, #27ae60)',
//                       animation: `${pulse} 0.5s ease-in-out`
//                     }
//                   }}
//                 >
//                   Go to Level {currentLevel + 1}
//                 </Button>
//               )}
//             </Box>
//           </Box>
//         </Fade>
//       </Container>
//     );
//   }
 
//   // Current question display
//   const question = quiz[currentQ];
//   if (!question) {
//     return (
//       <Container maxWidth="md" sx={{ py: 4 }}>
//         <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
//           <Typography variant="h4" gutterBottom color="error">
//             Question Not Found
//           </Typography>
//           <Button
//             variant="contained"
//             size="large"
//             onClick={retryQuiz}
//             sx={{ mt: 2, borderRadius: 2, px: 4 }}
//           >
//             Restart Level {currentLevel}
//           </Button>
//         </Paper>
//       </Container>
//     );
//   }
 
//   const progress = ((currentQ + 1) / quiz.length) * 100;
 
//   return (
//     <Container maxWidth="md" sx={{ py: 4 }}>
//       <Fade in={true}>
//         <Box>
//           {/* Progress */}
//           <Box sx={{ mb: 4 }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
//               <Typography variant="body2" color="text.secondary">
//                 Question {currentQ + 1} of {quiz.length}
//               </Typography>
//               <Chip
//                 label={`Level ${currentLevel}`}
//                 color="primary"
//                 variant="outlined"
//               />
//             </Box>
//             <LinearProgress
//               variant="determinate"
//               value={progress}
//               sx={{
//                 height: 8,
//                 borderRadius: 4,
//                 background: 'linear-gradient(45deg, #dfe6e9, #b2bec3)',
//                 '& .MuiLinearProgress-bar': {
//                   background: 'linear-gradient(45deg, #6c5ce7, #a29bfe)',
//                   borderRadius: 4
//                 }
//               }}
//             />
//           </Box>
 
//           {/* Question Card */}
//           <Card
//             elevation={4}
//             sx={{
//               borderRadius: 3,
//               background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
//               mb: 3,
//               animation: `${fadeIn} 0.5s ease-out`
//             }}
//           >
//             <CardContent sx={{ p: 4 }}>
//               <Typography variant="h5" component="div" gutterBottom fontWeight="bold" sx={{ lineHeight: 1.4, color: '#2d3436' }}>
//                 {currentQ + 1}. {question.question}
//               </Typography>
//             </CardContent>
//           </Card>
 
//           {/* Options */}
//           <Box sx={{ display: 'grid', gap: 2, mb: 4 }}>
//             {question.options?.map((opt, i) => {
//               const isSelected = selected === opt;
//               return (
//                 <Zoom in={true} key={i} style={{ transitionDelay: `${i * 100}ms` }}>
//                   <Button
//                     fullWidth
//                     variant={isSelected ? "contained" : "outlined"}
//                     onClick={() => handleAnswer(opt)}
//                     startIcon={<Box sx={{ width: 30, height: 30, borderRadius: '50%', background: isSelected ? 'white' : 'primary.main', color: isSelected ? 'primary.main' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 'bold', border: isSelected ? '2px solid' : 'none', borderColor: isSelected ? 'primary.main' : 'transparent' }}>{optionLabels[i]}</Box>}
//                     sx={{
//                       py: 2.5,
//                       borderRadius: 2,
//                       borderWidth: isSelected ? 0 : 2,
//                       textTransform: 'none',
//                       justifyContent: 'flex-start',
//                       fontSize: '1rem',
//                       fontWeight: 600,
//                       background: isSelected ? 'linear-gradient(45deg, #6c5ce7, #a29bfe)' : 'transparent',
//                       color: isSelected ? 'white' : 'text.primary',
//                       '&:hover': {
//                         borderWidth: 2,
//                         background: isSelected ? 'linear-gradient(45deg, #5b4cd8, #9188fd)' : 'rgba(108, 92, 231, 0.04)'
//                       },
//                       transition: 'all 0.3s ease',
//                       animation: `${fadeIn} 0.3s ease-out`
//                     }}
//                   >
//                     {opt}
//                   </Button>
//                 </Zoom>
//               );
//             })}
//           </Box>
 
//           {/* Navigation */}
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
//             <Button variant="outlined" size="large" onClick={prevQuestion} disabled={currentQ === 0} startIcon={<NavigateBefore />} sx={{ borderRadius: 2, px: 4, py: 1.5, minWidth: '140px', borderWidth: 2, '&:hover': { borderWidth: 2 }, '&:disabled': { opacity: 0.5, borderColor: 'rgba(0, 0, 0, 0.12)', color: 'rgba(0, 0, 0, 0.26)' } }}>Previous</Button>
//             <Button variant="contained" size="large" onClick={nextQuestion} endIcon={<NavigateNext />} sx={{ borderRadius: 2, px: 6, py: 1.5, minWidth: '140px', fontSize: '1.1rem', background: 'linear-gradient(45deg, #00b894, #00cec9)', '&:hover': { background: 'linear-gradient(45deg, #00a085, #00b894)', transform: 'translateY(-2px)', boxShadow: '0 8px 25px rgba(0, 184, 148, 0.3)' }, transition: 'all 0.3s ease', animation: showAnswer ? `${pulse} 2s infinite` : 'none' }}>{currentQ < quiz.length - 1 ? "Next" : "Finish"}</Button>
//           </Box>
 
//           {/* Exit Dialog */}
//           <Dialog open={exitDialogOpen}>
//             <DialogTitle>Exit Test?</DialogTitle>
//             <DialogContent>
//               <Typography>Are you sure you want to exit the test? Your progress may be lost.</Typography>
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={handleExitCancel} variant="outlined">Cancel</Button>
//               <Button onClick={handleExitConfirm} variant="contained" color="error">Exit</Button>
//             </DialogActions>
//           </Dialog>
//         </Box>
//       </Fade>
//     </Container>
//   );
// }
 
// export default QuizQuestion;
 
 
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
  DialogActions
} from '@mui/material';
import {
  CheckCircle,
  RadioButtonUnchecked,
  NavigateNext,
  NavigateBefore,
  Replay,
  EmojiEvents,
  Psychology,
  MenuBook
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
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
  handlePause
}) {
  const { t } = useTranslation();
  const optionLabels = ["A", "B", "C", "D"];
  const passed = score >= 5;
  const [exitDialogOpen, setExitDialogOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (document.fullscreenEnabled) {
      document.documentElement.requestFullscreen().catch(() => {});
    }

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
    if (backToChapters) {
      backToChapters();
    } else {
      navigate("/chapters");
    }
  };

  const handleExitCancel = () => {
    setExitDialogOpen(false);
    if (document.fullscreenEnabled) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  if (!quiz || !Array.isArray(quiz) || quiz.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Fade in={true}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
            <Psychology sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom color="text.primary">
              {t('quiz_not_available')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {t('quiz_data_issue')}
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={retryQuiz}
              startIcon={<Replay />}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                background: 'linear-gradient(45deg, #6c5ce7, #a29bfe)'
              }}
            >
              {t('retry_quiz')}
            </Button>
          </Paper>
        </Fade>
      </Container>
    );
  }

  if (isFinished) {
    const percentage = Math.round((score / quiz.length) * 100);
    const isPerfectScore = score === quiz.length;

    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Fade in={true}>
          <Box>
            <Paper 
              elevation={4} 
              sx={{ 
                p: 4, 
                textAlign: 'center', 
                borderRadius: 3,
                background: passed 
                  ? isPerfectScore 
                    ? 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)'
                    : 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)'
                  : 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                color: 'white',
                mb: 4
              }}
            >
              <Zoom in={true}>
                <Box>
                  {passed && isPerfectScore && (
                    <EmojiEvents sx={{ fontSize: 80, mb: 2, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }} />
                  )}
                  <Typography variant="h3" gutterBottom fontWeight="bold">
                    {t('level')} {currentLevel} {passed ? t('completed') : t('failed')}
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {passed 
                      ? (isPerfectScore ? t('perfect_score') : t('great_job')) 
                      : t('minimum_score', { score })}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
                    <Chip 
                      label={`${score}/${quiz.length}`} 
                      sx={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '1.5rem', height: '50px', '& .MuiChip-label': { px: 3 } }} 
                    />
                    <Chip 
                      label={`${percentage}%`} 
                      sx={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '1.5rem', height: '50px', '& .MuiChip-label': { px: 3 } }} 
                    />
                    <Chip 
                      label={passed ? t('passed') : t('failed')} 
                      color={passed ? "success" : "error"}
                      sx={{ fontSize: '1rem', height: '50px', '& .MuiChip-label': { px: 3 } }} 
                    />
                  </Box>

                  {!passed && (
                    <Alert severity="warning" sx={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                      {t('score_warning')}
                    </Alert>
                  )}
                </Box>
              </Zoom>
            </Paper>

            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
              {t('review_qa')}
            </Typography>

            <List sx={{ mb: 4 }}>
              {quiz.map((q, i) => {
                const isCorrect = userAnswers[i] === q?.answer;
                return (
                  <Zoom in={true} key={i} style={{ transitionDelay: `${i * 100}ms` }}>
                    <Card sx={{ mb: 2, border: isCorrect ? '2px solid #27ae60' : '2px solid #e74c3c', animation: `${slideIn} 0.5s ease-out` }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Chip label={`Q${i + 1}`} color={isCorrect ? "success" : "error"} size="small" />
                          <Typography variant="h6" sx={{ ml: 2, flex: 1 }}>
                            {q?.question || t('question_not_available')}
                          </Typography>
                        </Box>

                        <List dense>
                          {q?.options?.map((opt, j) => {
                            const isSelected = userAnswers[i] === opt;
                            const isAnswer = opt === q.answer;
                            return (
                              <ListItem key={j} sx={{ 
                                background: isAnswer 
                                  ? 'linear-gradient(45deg, #27ae60, #2ecc71)'
                                  : isSelected && !isAnswer
                                  ? 'linear-gradient(45deg, #e74c3c, #c0392b)'
                                  : 'transparent',
                                color: isAnswer || (isSelected && !isAnswer) ? 'white' : 'text.primary',
                                borderRadius: 1,
                                mb: 0.5,
                                animation: `${fadeIn} 0.3s ease-out`
                              }}>
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                  {isAnswer ? <CheckCircle sx={{ color: 'white' }} /> : <RadioButtonUnchecked />}
                                </ListItemIcon>
                                <ListItemText
                                  primary={`${optionLabels[j]}. ${opt}`}
                                  primaryTypographyProps={{ fontWeight: isAnswer ? 'bold' : 'normal' }}
                                />
                              </ListItem>
                            );
                          })}
                        </List>

                        <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          <Chip label={`${t('your_answer')}: ${userAnswers[i] || t('not_answered')}`} color={isCorrect ? "success" : "error"} variant="outlined" />
                          <Chip label={`${t('correct_answer')}: ${q?.answer || t('not_available')}`} color="success" variant="outlined" />
                        </Box>
                      </CardContent>
                    </Card>
                  </Zoom>
                );
              })}
            </List>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => backToChapters && backToChapters()}
                startIcon={<MenuBook />}
                sx={{ borderRadius: 2, px: 4, py: 1.5, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
              >
                {t('back_to_subjects')}
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={retryQuiz}
                startIcon={<Replay />}
                sx={{ borderRadius: 2, px: 4, py: 1.5, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
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
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    background: 'linear-gradient(45deg, #27ae60, #2ecc71)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #229954, #27ae60)',
                      animation: `${pulse} 0.5s ease-in-out`
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
    );
  }

  const question = quiz[currentQ];
  if (!question) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom color="error">
            {t('question_not_found')}
          </Typography>
          <Button variant="contained" size="large" onClick={retryQuiz} sx={{ mt: 2, borderRadius: 2, px: 4 }}>
            {t('restart_level', { level: currentLevel })}
          </Button>
        </Paper>
      </Container>
    );
  }

  const progress = ((currentQ + 1) / quiz.length) * 100;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Fade in={true}>
        <Box>
          {/* Progress */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {t('question_of_total', { current: currentQ + 1, total: quiz.length })}
              </Typography>
              <Chip label={`${t('level')} ${currentLevel}`} color="primary" variant="outlined" />
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4, background: 'linear-gradient(45deg, #dfe6e9, #b2bec3)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(45deg, #6c5ce7, #a29bfe)', borderRadius: 4 }}} />
          </Box>

          {/* Question Card */}
          <Card elevation={4} sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', mb: 3, animation: `${fadeIn} 0.5s ease-out` }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" component="div" gutterBottom fontWeight="bold" sx={{ lineHeight: 1.4, color: '#2d3436' }}>
                {currentQ + 1}. {question.question}
              </Typography>
            </CardContent>
          </Card>

          {/* Options */}
          <Box sx={{ display: 'grid', gap: 2, mb: 4 }}>
            {question.options?.map((opt, i) => {
              const isSelected = selected === opt;
              return (
                <Zoom in={true} key={i} style={{ transitionDelay: `${i * 100}ms` }}>
                  <Button
                    fullWidth
                    variant={isSelected ? "contained" : "outlined"}
                    onClick={() => handleAnswer(opt)}
                    startIcon={
                      <Box sx={{ width: 30, height: 30, borderRadius: '50%', background: isSelected ? 'white' : 'primary.main', color: isSelected ? 'primary.main' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 'bold', border: isSelected ? '2px solid' : 'none', borderColor: isSelected ? 'primary.main' : 'transparent' }}>
                        {optionLabels[i]}
                      </Box>
                    }
                    sx={{
                      py: 2.5,
                      borderRadius: 2,
                      borderWidth: isSelected ? 0 : 2,
                      textTransform: 'none',
                      justifyContent: 'flex-start',
                      fontSize: '1rem',
                      fontWeight: 600,
                      background: isSelected ? 'linear-gradient(45deg, #6c5ce7, #a29bfe)' : 'transparent',
                      color: isSelected ? 'white' : 'text.primary',
                      '&:hover': {
                        borderWidth: 2,
                        background: isSelected ? 'linear-gradient(45deg, #5b4cd8, #9188fd)' : 'rgba(108, 92, 231, 0.04)'
                      },
                      transition: 'all 0.3s ease',
                      animation: `${fadeIn} 0.3s ease-out`
                    }}
                  >
                    {opt}
                  </Button>
                </Zoom>
              );
            })}
          </Box>

          {/* Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
            <Button variant="outlined" size="large" onClick={prevQuestion} disabled={currentQ === 0} startIcon={<NavigateBefore />} sx={{ borderRadius: 2, px: 4, py: 1.5, minWidth: '140px', borderWidth: 2, '&:hover': { borderWidth: 2 }, '&:disabled': { opacity: 0.5, borderColor: 'rgba(0, 0, 0, 0.12)', color: 'rgba(0, 0, 0, 0.26)' } }}>
              {t('previous')}
            </Button>
            <Button variant="contained" size="large" onClick={nextQuestion} endIcon={<NavigateNext />} sx={{ borderRadius: 2, px: 6, py: 1.5, minWidth: '140px', fontSize: '1.1rem', background: 'linear-gradient(45deg, #00b894, #00cec9)', '&:hover': { background: 'linear-gradient(45deg, #00a085, #00b894)', transform: 'translateY(-2px)', boxShadow: '0 8px 25px rgba(0, 184, 148, 0.3)' }, transition: 'all 0.3s ease', animation: showAnswer ? `${pulse} 2s infinite` : 'none' }}>
              {currentQ < quiz.length - 1 ? t('next') : t('finish')}
            </Button>
          </Box>

          {/* Exit Dialog */}
          <Dialog open={exitDialogOpen}>
            <DialogTitle>{t('exit_test')}</DialogTitle>
            <DialogContent>
              <Typography>{t('exit_test_warning')}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleExitCancel} variant="outlined">{t('cancel')}</Button>
              <Button onClick={handleExitConfirm} variant="contained" color="error">{t('exit')}</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Fade>
    </Container>
  );
}

export default QuizQuestion;
