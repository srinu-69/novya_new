
// import React, { useState, useEffect, useRef } from "react";
// import {
//   Button,
//   Form,
//   ProgressBar,
//   Card,
//   Badge,
//   Row,
//   Col,
//   Alert,
// } from "react-bootstrap";
// import { useTranslation } from 'react-i18next';
// // import { useQuiz } from './QuizContext'; // ADDED: Import QuizContext
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./Keyboard.css";
// import { useQuiz } from "../QuizContext";

// const TypingMaster = () => {
//   const { t } = useTranslation();
//   const { trackLearningActivity } = useQuiz(); // ADDED: Get tracking function from context
  
//   const [difficulty, setDifficulty] = useState("Beginner");
//   const [text, setText] = useState("");
//   const [input, setInput] = useState("");
//   const [startTime, setStartTime] = useState(null);
//   const [finished, setFinished] = useState(false);
//   const [accuracy, setAccuracy] = useState(0);
//   const [speed, setSpeed] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(60);
//   const [isRunning, setIsRunning] = useState(false);
//   const [pressedKey, setPressedKey] = useState(null);
//   const [showTutorial, setShowTutorial] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [liveWPM, setLiveWPM] = useState(0);
//   const [totalKeystrokes, setTotalKeystrokes] = useState(0);
//   const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
//   const [lessonCount, setLessonCount] = useState(0);
//   const timerRef = useRef(null);
//   const wpmTimerRef = useRef(null);
  

//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth < 768);
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   useEffect(() => {
//     loadLesson();
//   }, [difficulty, lessonCount]);

//   // NEW: Function to track typing activity in learning history
//   const trackTypingActivity = (finalSpeed, finalAccuracy, duration) => {
//     try {
//       const activityData = {
//         activityType: 'typing_practice',
//         title: `Typing Practice - ${difficulty} Level`,
//         subject: 'Typing',
//         chapter: 'Keyboard Skills',
//         duration: Math.round(duration / 60), // Convert to minutes
//         rewardPoints: calculateTypingReward(finalSpeed, finalAccuracy),
//         speed: finalSpeed,
//         accuracy: finalAccuracy,
//         difficulty: difficulty,
//         keystrokes: totalKeystrokes,
//         correctKeystrokes: correctKeystrokes
//       };

//       // Track the activity
//       trackLearningActivity(activityData);
//       console.log('⌨️ Typing activity tracked in learning history');
//     } catch (error) {
//       console.error('Error tracking typing activity:', error);
//     }
//   };

//   // NEW: Function to calculate reward points based on performance
//   const calculateTypingReward = (speed, accuracy) => {
//     let points = 0;
    
//     // Base points for completion
//     points += 5;
    
//     // Speed bonus
//     if (speed >= 40) points += 3;
//     if (speed >= 60) points += 5;
//     if (speed >= 80) points += 7;
    
//     // Accuracy bonus
//     if (accuracy >= 85) points += 3;
//     if (accuracy >= 90) points += 5;
//     if (accuracy >= 95) points += 7;
    
//     return points;
//   };

//   const generateTypingLesson = async (level) => {
//   try {
//     setLoading(true);
//     setError("");
    
//     console.log("🔧 Attempting to generate lesson for:", level);

//     // ✅ FIXED: Ensure correct API URL for all levels
//     const response = await fetch("http://127.0.0.1:8000/generate-typing-lesson", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       // ✅ FIXED: Use clear prompt for AI
//       body: JSON.stringify({
//         prompt: `Generate a realistic ${level} level typing practice paragraph containing at least 80-100 words.`,
//         difficulty: level,
//       }),
//     });

//     // ✅ Handle HTTP errors
//     if (!response.ok) {
//       console.error(`❌ Server error: ${response.status}`);
//       throw new Error(`Server error: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log("✅ API Response received:", data);

//     // ✅ Ensure text is valid before using
//     if (data.success && data.lessonText && data.lessonText.trim().length > 20) {
//       console.log(`🧠 Using AI lesson for ${level}`);
//       return data.lessonText.trim();
//     } else {
//       throw new Error("Empty or invalid AI response");
//     }
//   } catch (err) {
//     console.error("❌ Error with AI lesson generation:", err);
//     // ✅ Use local fallback when AI fails
//     return getLocalFallbackLesson(level);
//   } finally {
//     setLoading(false);
//   }
// };

//   const getLocalFallbackLesson = (level) => {
//     const fallbackLessons = {
//       Beginner: [
//         "The quick brown fox jumps over the lazy dog. Practice typing every day to improve your speed and accuracy. Start with simple words and gradually move to longer sentences. Keep your fingers on the home row and maintain good posture while typing. Regular practice will help you develop muscle memory and become a faster typist.",
//         "Learning to type quickly takes consistent effort and proper technique. Begin with basic exercises focusing on home row keys. Remember to keep your wrists straight and fingers curved over the keyboard. Accuracy matters more than speed when starting out. Build good habits from the beginning for long term success in typing.",
//         "Typing is an essential modern skill that everyone should master. Start with simple texts and progress to more complex ones over time. Focus on proper finger placement and maintaining a steady rhythm. Daily practice builds confidence and competence. Soon you will type without looking at the keyboard at all."
//       ],
//       Intermediate: [
//         "Typing proficiency requires dedicated practice and proper technique. Intermediate typists should focus on maintaining accuracy while gradually increasing speed. Incorporate punctuation and capital letters into your practice sessions. Challenge yourself with varied sentence structures and vocabulary from different subjects.",
//         "Effective typing skills enhance productivity in many professional and academic settings. Practice with different types of content including emails, reports, and creative writing. Pay attention to rhythm and flow while typing complex sentences. Regular practice sessions will significantly improve your overall performance and efficiency.",
//         "Developing consistent typing rhythm helps maintain both speed and accuracy over longer texts. Practice with materials that include numbers, special characters, and varied punctuation marks. Focus on reducing errors rather than maximizing speed initially. Quality practice sessions yield better long-term results than rushed attempts at typing quickly."
//       ],
//       Advanced: [
//         "Advanced typing mastery involves complex textual content with technical terminology and sophisticated sentence structures. Professional typists maintain exceptional accuracy at high speeds through disciplined practice regimens and proper ergonomic setup. Challenge yourself with difficult vocabulary and complex grammatical constructions.",
//         "Mastering advanced typing techniques requires analyzing your performance metrics and identifying specific areas for improvement. Incorporate specialized vocabulary from various academic and professional fields into your practice. Develop the ability to maintain consistency across different writing styles and document formats while typing rapidly.",
//         "Elite typing performance combines rapid cognitive processing with precise motor execution. Practice with challenging materials that include technical jargon, numerical data, and complex punctuation patterns. Develop the mental stamina to maintain focus and accuracy during extended typing sessions across diverse subject matters."
//       ]
//     };
    
//     const lessons = fallbackLessons[level] || fallbackLessons.Beginner;
//     const randomIndex = Math.floor(Math.random() * lessons.length);
//     console.log(`🎲 Using local fallback lesson ${randomIndex + 1} for ${level}`);
//     return lessons[randomIndex];
//   };

//   const loadLesson = async () => {
//     try {
//       console.log("📥 Loading lesson for difficulty:", difficulty);
//       const lessonText = await generateTypingLesson(difficulty);
      
//       if (lessonText && lessonText.trim()) {
//         setText(lessonText);
//         console.log("✅ Lesson loaded successfully, length:", lessonText.length);
//         setError(""); // Clear any previous errors
//       } else {
//         throw new Error('Received empty lesson text');
//       }
//     } catch (error) {
//       console.error('❌ Error in loadLesson:', error);
//       // Ultimate fallback
//       const ultimateFallback = "The quick brown fox jumps over the lazy dog. Practice typing regularly to improve your skills. Focus on accuracy and proper technique for best results. Consistent practice will make you a typing expert in no time.";
//       setText(ultimateFallback);
//       setError(t('typing.aiUnavailable'));
//     } finally {
//       resetTestState();
//     }
//   };

//   const resetTestState = () => {
//     setInput("");
//     setFinished(false);
//     setTimeLeft(60);
//     setIsRunning(false);
//     setAccuracy(0);
//     setSpeed(0);
//     setLiveWPM(0);
//     setTotalKeystrokes(0);
//     setCorrectKeystrokes(0);
//     setStartTime(null);
//     clearInterval(timerRef.current);
//     clearInterval(wpmTimerRef.current);
//   };

//   const forceNewRandomLesson = () => {
//     console.log("🎲 Forcing new random lesson");
//     setLessonCount(prev => prev + 1);
//   };

//   const completeTest = () => {
//     if (input.length === 0) {
//       alert(t('typing.typeSomethingAlert'));
//       return;
//     }
    
//     clearInterval(timerRef.current);
//     clearInterval(wpmTimerRef.current);
//     calculateResults(input);
//     setFinished(true);
//     setIsRunning(false);
//   };

//   useEffect(() => {
//     if (isRunning && timeLeft > 0) {
//       timerRef.current = setInterval(() => {
//         setTimeLeft((prev) => {
//           if (prev <= 1) {
//             clearInterval(timerRef.current);
//             calculateResults(input);
//             setFinished(true);
//             setIsRunning(false);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }
//     return () => clearInterval(timerRef.current);
//   }, [isRunning, timeLeft,]);

//   useEffect(() => {
//     if (isRunning && startTime) {
//       wpmTimerRef.current = setInterval(() => {
//         calculateLiveWPM();
//       }, 1000);
//     }
//     return () => clearInterval(wpmTimerRef.current);
//   }, [isRunning, startTime, input]);

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (showTutorial && e.key === "Enter") {
//         setShowTutorial(false);
//       } else if (!showTutorial && !finished && e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
//         // Ctrl+Enter or Cmd+Enter to complete test
//         e.preventDefault();
//         completeTest();
//       } else {
//         setPressedKey(e.key.toLowerCase());
//       }
//     };
//     const handleKeyUp = () => setPressedKey(null);
//     window.addEventListener("keydown", handleKeyDown);
//     window.addEventListener("keyup", handleKeyUp);
//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//       window.removeEventListener("keyup", handleKeyUp);
//     };
//   }, [showTutorial, finished, input]);

//   const handleChange = (e) => {
//     if (!isRunning && e.target.value.length > 0) {
//       setStartTime(Date.now());
//       setIsRunning(true);
//     }
    
//     const value = e.target.value;
//     setInput(value);
//     setTotalKeystrokes(prev => prev + 1);
//     calculateLiveAccuracy(value);

//     if (value === text) {
//       calculateResults(value);
//       setFinished(true);
//       setIsRunning(false);
//       clearInterval(timerRef.current);
//       clearInterval(wpmTimerRef.current);
//     }
//   };

//   const handlePaste = (e) => {
//     e.preventDefault();
//     alert(t('typing.pastingDisabled'));
//   };

//   const calculateLiveAccuracy = (typedText) => {
//     let correctChars = 0;
//     for (let i = 0; i < typedText.length; i++) {
//       if (typedText[i] === text[i]) {
//         correctChars++;
//       }
//     }
//     setCorrectKeystrokes(correctChars);
//     const accuracyPercent = (correctChars / (typedText.length || 1)) * 100;
//     setAccuracy(Number(accuracyPercent.toFixed(1)));
//   };

//   const calculateLiveWPM = () => {
//     if (!startTime) return;
    
//     const timeElapsed = (Date.now() - startTime) / 1000 / 60;
//     const wordsTyped = input.trim().split(/\s+/).length;
//     const currentWPM = Math.round(wordsTyped / timeElapsed) || 0;
//     setLiveWPM(currentWPM);
//   };

//   const calculateResults = (typedText) => {
//     const timeTaken = (Date.now() - startTime) / 1000 / 60;
//     const wordsTyped = typedText.trim().split(/\s+/).length;
//     const speedWPM = Math.round(wordsTyped / timeTaken) || 0;
    
//     let correctChars = 0;
//     for (let i = 0; i < typedText.length; i++) {
//       if (typedText[i] === text[i]) correctChars++;
//     }
//     const accuracyPercent = (correctChars / text.length) * 100;
//     const finalAccuracy = Number(accuracyPercent.toFixed(1));
    
//     setAccuracy(finalAccuracy);
//     setSpeed(speedWPM);

//     // NEW: Track typing activity when results are calculated
//     const duration = (Date.now() - startTime) / 1000; // Duration in seconds
//     trackTypingActivity(speedWPM, finalAccuracy, duration);
//   };

//   const renderColoredText = () =>
//     text.split("").map((char, i) => {
//       let color = "";
//       if (i < input.length) {
//         color = input[i] === char ? "text-success" : "text-danger";
//       }
//       return (
//         <span key={i} className={color}>
//           {char}
//         </span>
//       );
//     });

//   const renderKeyboardRow = (keys) => (
//     <div className="keyboard-row">
//       {keys.map((key) => (
//         <div
//           key={key}
//           className={`keyboard-key ${
//             pressedKey === key.toLowerCase() ? "active" : ""
//           }`}
//         >
//           {key}
//         </div>
//       ))}
//     </div>
//   );

//   const DifficultySelector = () => (
//     <div className="mb-3">
//       <Form.Label className="fw-bold">{t('typing.selectDifficulty')}:</Form.Label>
//       <div>
//         {["Beginner", "Intermediate", "Advanced"].map((level) => (
//           <Button
//             key={level}
//             variant={difficulty === level ? "primary" : "outline-primary"}
//             size="sm"
//             className="me-2 mb-2"
//             onClick={() => setDifficulty(level)}
//             disabled={loading}
//           >
//             {t(`typing.levels.${level.toLowerCase()}`)}
//           </Button>
//         ))}
//       </div>
//     </div>
//   );

//   if (showTutorial) {
//     return (
//       <div className="tutorial-container">
//         <div className="keyboard-bg">
//           {[...'ASDFJKL;'].map((key, i) => (
//             <span key={i} className="flying-key">
//               {key}
//             </span>
//           ))}
//         </div>

//                 {/* ✅ ADDED: Back button in tutorial page */}
//         <Button
//           variant="outline-light"
//           className="position-absolute top-0 start-0 m-3"
//           onClick={() => window.history.back()}
//         >
//           🔙 {t('typing.back')}
//         </Button>

//         <div className="tutorial-content text-center text-light">
//           <h1 className="fw-bold mb-3">💡 {t('typing.welcomeTitle')}</h1>
//           <p className="lead mb-4">
//             {t('typing.welcomeSubtitle')}
//           </p>

//           <DifficultySelector />

//           <ul className="tutorial-list mx-auto">
//             <li>{t('typing.tip1')}</li>
//             <li>{t('typing.tip2')}</li>
//             <li>{t('typing.tip3')}</li>
//             <li>{t('typing.tip4')}</li>
//             <li>{t('typing.tip5')}</li>
//             <li>{t('typing.tip6')}</li>
//             <li>{t('typing.tip7')}</li>
//           </ul>

//           <div className="mt-5">
//             <Button
//               variant="success"
//               size="lg"
//               className="px-4 py-2 start-btn"
//               onClick={() => setShowTutorial(false)}
//             >
//               🚀 {t('typing.startButton')}
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const TypingResult = ({ accuracy, speed, onRestart }) => {
//     let message = "";
//     if (accuracy >= 95 && speed >= 60) message = t('typing.results.excellent');
//     else if (accuracy >= 85) message = t('typing.results.great');
//     else if (accuracy >= 70) message = t('typing.results.good');
//     else message = t('typing.results.keepPracticing');

//     return (
//       <div className="text-center">
//         <h4 className="fw-bold text-success mb-3">🎯 {t('typing.results.title')}</h4>
//         <Row className="justify-content-center mb-3">
//           <Col md={3}>
//             <Card className="p-3 shadow-sm">
//               <h5>{t('typing.results.speed')}</h5>
//               <h2 className="text-primary">{speed}</h2>
//               <p className="small text-muted">{t('typing.results.wpm')}</p>
//             </Card>
//           </Col>
//           <Col md={3}>
//             <Card className="p-3 shadow-sm">
//               <h5>{t('typing.results.accuracy')}</h5>
//               <h2 className={accuracy >= 90 ? "text-success" : accuracy >= 80 ? "text-warning" : "text-danger"}>
//                 {accuracy.toFixed(1)}%
//               </h2>
//               <p className="small text-muted">{t('typing.results.accuracyDesc')}</p>
//             </Card>
//           </Col>
//           <Col md={3}>
//             <Card className="p-3 shadow-sm">
//               <h5>{t('typing.results.keystrokes')}</h5>
//               <h2 className="text-info">{totalKeystrokes}</h2>
//               <p className="small text-muted">{t('typing.results.keystrokesDesc', { correct: correctKeystrokes })}</p>
//             </Card>
//           </Col>
//         </Row>

//         <Alert variant="info" className="mx-auto w-75">
//           {message}
//         </Alert>

//         <div className="text-start mx-auto" style={{ maxWidth: "600px" }}>
//           <h6 className="fw-bold">📊 {t('typing.results.improvementTips')}:</h6>
//           <ul>
//             <li>{t('typing.results.tip1')}</li>
//             <li>{t('typing.results.tip2')}</li>
//             <li>{t('typing.results.tip3')}</li>
//             <li>{t('typing.results.tip4')}</li>
//             <li>{t('typing.results.tip5')}</li>
//           </ul>
//         </div>

//         <Button variant="outline-success" className="mt-3 me-2" onClick={onRestart}>
//           🔁 {t('typing.results.tryAgain')}
//         </Button>
//       </div>
//     );
//   };

//   return (
//     <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-white overflow-hidden position-relative">
//       <Button
//         variant="outline-secondary"
//         className="position-absolute top-0 start-0 m-3"
//         onClick={() => setShowTutorial(true)}
//       >
//         🔙 {t('typing.backToInstructions')}
//       </Button>

//       <div className="text-center mb-3">
//         <h2>⌨️ {t('typing.title')}</h2>
//         <h5 className="text-primary mt-2">⏱ {t('typing.timeLeft')}: {timeLeft}s</h5>
//         <ProgressBar
//           now={(timeLeft / 60) * 100}
//           variant={timeLeft > 20 ? "success" : timeLeft > 10 ? "warning" : "danger"}
//           style={{ width: "300px", margin: "0 auto" }}
//         />
//         <div className="mt-2">
//           <Badge bg="info">{t('typing.liveWPM')}: {liveWPM}</Badge>{" "}
//           <Badge bg={accuracy >= 90 ? "success" : accuracy >= 80 ? "warning" : "danger"}>
//             {t('typing.accuracy')}: {accuracy}%
//           </Badge>{" "}
//           <Badge bg="secondary">{t('typing.level')}: {t(`typing.levels.${difficulty.toLowerCase()}`)}</Badge>
//         </div>
//       </div>

//       <Card
//         className="p-4 shadow-lg border-0 bg-light text-center"
//         style={{ width: "70%", maxWidth: "800px" }}
//       >
//         {loading && (
//           <Alert variant="info" className="text-center">
//             ⏳ {t('typing.generatingLesson')}
//           </Alert>
//         )}
        
//         {error && (
//           <Alert variant="warning" className="text-center">
//             ⚠️ {error}
//           </Alert>
//         )}

//         <p
//           className="lead mb-3"
//           style={{ lineHeight: "1.8", fontFamily: "monospace", minHeight: "120px" }}
//         >
//           {renderColoredText()}
//         </p>

//         {!finished ? (
//           <>
//             <Form.Control
//               as="textarea"
//               rows={3}
//               value={input}
//               onChange={handleChange}
//               onPaste={handlePaste}
//               placeholder={isRunning ? t('typing.placeholderRunning') : t('typing.placeholderStart')}
//               disabled={loading}
//               autoFocus
//             />

//             <div className="mt-3">
//               <Button
//                 variant={isRunning ? "outline-warning" : "outline-success"}
//                 className="me-2 mb-2"
//                 onClick={() => setIsRunning((r) => !r)}
//                 disabled={loading}
//               >
//                 {isRunning ? "⏸ " + t('typing.pause') : "▶️ " + t('typing.start')}
//               </Button>
//               <Button variant="outline-info" className="me-2 mb-2" onClick={forceNewRandomLesson} disabled={loading}>
//                 🎲 {t('typing.randomLesson')}
//               </Button>
//               <Button 
//                 variant="success" 
//                 className="mb-2" 
//                 onClick={completeTest}
//                 disabled={loading || input.length === 0}
//               >
//                 {t('typing.completeTest')}
//               </Button>
//             </div>
//             <div className="text-muted small">
//               💡 {t('typing.completeTip')}
//             </div>
//           </>
//         ) : (
//           <TypingResult accuracy={accuracy} speed={speed} onRestart={loadLesson} />
//         )}
//       </Card>

//       {!isMobile && (
//         <div className="keyboard mt-4">
//           {renderKeyboardRow(["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"])}
//           {renderKeyboardRow(["A", "S", "D", "F", "G", "H", "J", "K", "L"])}
//           {renderKeyboardRow(["Z", "X", "C", "V", "B", "N", "M"])}
//         </div>
//       )}    
//     </div>
//   );
// };

// export default TypingMaster;















import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Form,
  ProgressBar,
  Card,
  Badge,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import "bootstrap/dist/css/bootstrap.min.css";
import "./Keyboard.css";
import { useQuiz } from "../QuizContext";

const TypingMaster = () => {
  const { t } = useTranslation();
  const { trackLearningActivity } = useQuiz(); // ADDED: Get tracking function from context
  
  const [difficulty, setDifficulty] = useState("Beginner");
  const [text, setText] = useState("");
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [finished, setFinished] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [pressedKey, setPressedKey] = useState(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [liveWPM, setLiveWPM] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
  const [lessonCount, setLessonCount] = useState(0);
  const timerRef = useRef(null);
  const wpmTimerRef = useRef(null);
  

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    loadLesson();
  }, [difficulty, lessonCount]);

  // NEW: Function to track typing activity in learning history
  const trackTypingActivity = (finalSpeed, finalAccuracy, duration) => {
    try {
      const activityData = {
        activityType: 'typing_practice',
        title: `Typing Practice - ${difficulty} Level`,
        subject: 'Typing',
        chapter: 'Keyboard Skills',
        duration: Math.round(duration / 60), // Convert to minutes
        rewardPoints: calculateTypingReward(finalSpeed, finalAccuracy),
        speed: finalSpeed,
        accuracy: finalAccuracy,
        difficulty: difficulty,
        keystrokes: totalKeystrokes,
        correctKeystrokes: correctKeystrokes
      };

      // Track the activity
      trackLearningActivity(activityData);
      console.log('⌨️ Typing activity tracked in learning history');
    } catch (error) {
      console.error('Error tracking typing activity:', error);
    }
  };

  // NEW: Function to calculate reward points based on performance
  const calculateTypingReward = (speed, accuracy) => {
    let points = 0;
    
    // Base points for completion
    points += 5;
    
    // Speed bonus
    if (speed >= 40) points += 3;
    if (speed >= 60) points += 5;
    if (speed >= 80) points += 7;
    
    // Accuracy bonus
    if (accuracy >= 85) points += 3;
    if (accuracy >= 90) points += 5;
    if (accuracy >= 95) points += 7;
    
    return points;
  };

  const generateTypingLesson = async (level) => {
  try {
    setLoading(true);
    setError("");
    
    console.log("🔧 Attempting to generate lesson for:", level);

    // ✅ FIXED: Ensure correct API URL for all levels
    const response = await fetch("http://127.0.0.1:8000/generate-typing-lesson", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // ✅ FIXED: Use clear prompt for AI
      body: JSON.stringify({
        prompt: `Generate a realistic ${level} level typing practice paragraph containing at least 80-100 words.`,
        difficulty: level,
      }),
    });

    // ✅ Handle HTTP errors
    if (!response.ok) {
      console.error(`❌ Server error: ${response.status}`);
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ API Response received:", data);

    // ✅ Ensure text is valid before using
    if (data.success && data.lessonText && data.lessonText.trim().length > 20) {
      console.log(`🧠 Using AI lesson for ${level}`);
      return data.lessonText.trim();
    } else {
      throw new Error("Empty or invalid AI response");
    }
  } catch (err) {
    console.error("❌ Error with AI lesson generation:", err);
    // ✅ Use local fallback when AI fails
    return getLocalFallbackLesson(level);
  } finally {
    setLoading(false);
  }
};

  const getLocalFallbackLesson = (level) => {
    const fallbackLessons = {
      Beginner: [
        "The quick brown fox jumps over the lazy dog. Practice typing every day to improve your speed and accuracy. Start with simple words and gradually move to longer sentences. Keep your fingers on the home row and maintain good posture while typing. Regular practice will help you develop muscle memory and become a faster typist.",
        "Learning to type quickly takes consistent effort and proper technique. Begin with basic exercises focusing on home row keys. Remember to keep your wrists straight and fingers curved over the keyboard. Accuracy matters more than speed when starting out. Build good habits from the beginning for long term success in typing.",
        "Typing is an essential modern skill that everyone should master. Start with simple texts and progress to more complex ones over time. Focus on proper finger placement and maintaining a steady rhythm. Daily practice builds confidence and competence. Soon you will type without looking at the keyboard at all."
      ],
      Intermediate: [
        "Typing proficiency requires dedicated practice and proper technique. Intermediate typists should focus on maintaining accuracy while gradually increasing speed. Incorporate punctuation and capital letters into your practice sessions. Challenge yourself with varied sentence structures and vocabulary from different subjects.",
        "Effective typing skills enhance productivity in many professional and academic settings. Practice with different types of content including emails, reports, and creative writing. Pay attention to rhythm and flow while typing complex sentences. Regular practice sessions will significantly improve your overall performance and efficiency.",
        "Developing consistent typing rhythm helps maintain both speed and accuracy over longer texts. Practice with materials that include numbers, special characters, and varied punctuation marks. Focus on reducing errors rather than maximizing speed initially. Quality practice sessions yield better long-term results than rushed attempts at typing quickly."
      ],
      Advanced: [
        "Advanced typing mastery involves complex textual content with technical terminology and sophisticated sentence structures. Professional typists maintain exceptional accuracy at high speeds through disciplined practice regimens and proper ergonomic setup. Challenge yourself with difficult vocabulary and complex grammatical constructions.",
        "Mastering advanced typing techniques requires analyzing your performance metrics and identifying specific areas for improvement. Incorporate specialized vocabulary from various academic and professional fields into your practice. Develop the ability to maintain consistency across different writing styles and document formats while typing rapidly.",
        "Elite typing performance combines rapid cognitive processing with precise motor execution. Practice with challenging materials that include technical jargon, numerical data, and complex punctuation patterns. Develop the mental stamina to maintain focus and accuracy during extended typing sessions across diverse subject matters."
      ]
    };
    
    const lessons = fallbackLessons[level] || fallbackLessons.Beginner;
    const randomIndex = Math.floor(Math.random() * lessons.length);
    console.log(`🎲 Using local fallback lesson ${randomIndex + 1} for ${level}`);
    return lessons[randomIndex];
  };

  const loadLesson = async () => {
    try {
      console.log("📥 Loading lesson for difficulty:", difficulty);
      const lessonText = await generateTypingLesson(difficulty);
      
      if (lessonText && lessonText.trim()) {
        setText(lessonText);
        console.log("✅ Lesson loaded successfully, length:", lessonText.length);
        setError(""); // Clear any previous errors
      } else {
        throw new Error('Received empty lesson text');
      }
    } catch (error) {
      console.error('❌ Error in loadLesson:', error);
      // Ultimate fallback
      const ultimateFallback = "The quick brown fox jumps over the lazy dog. Practice typing regularly to improve your skills. Focus on accuracy and proper technique for best results. Consistent practice will make you a typing expert in no time.";
      setText(ultimateFallback);
      setError(t('typing.aiUnavailable'));
    } finally {
      resetTestState();
    }
  };

  const resetTestState = () => {
    setInput("");
    setFinished(false);
    setTimeLeft(60);
    setIsRunning(false);
    setAccuracy(0);
    setSpeed(0);
    setLiveWPM(0);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    setStartTime(null);
    clearInterval(timerRef.current);
    clearInterval(wpmTimerRef.current);
  };

  const forceNewRandomLesson = () => {
    console.log("🎲 Forcing new random lesson");
    setLessonCount(prev => prev + 1);
  };

  const completeTest = () => {
    if (input.length === 0) {
      alert(t('typing.typeSomethingAlert'));
      return;
    }
    
    clearInterval(timerRef.current);
    clearInterval(wpmTimerRef.current);
    calculateResults(input);
    setFinished(true);
    setIsRunning(false);
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            calculateResults(input);
            setFinished(true);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft,]);

  useEffect(() => {
    if (isRunning && startTime) {
      wpmTimerRef.current = setInterval(() => {
        calculateLiveWPM();
      }, 1000);
    }
    return () => clearInterval(wpmTimerRef.current);
  }, [isRunning, startTime, input]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showTutorial && e.key === "Enter") {
        setShowTutorial(false);
      } else if (!showTutorial && !finished && e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        // Ctrl+Enter or Cmd+Enter to complete test
        e.preventDefault();
        completeTest();
      } else {
        setPressedKey(e.key.toLowerCase());
      }
    };
    const handleKeyUp = () => setPressedKey(null);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [showTutorial, finished, input]);

  const handleChange = (e) => {
    if (!isRunning && e.target.value.length > 0) {
      setStartTime(Date.now());
      setIsRunning(true);
    }
    
    const value = e.target.value;
    setInput(value);
    setTotalKeystrokes(prev => prev + 1);
    calculateLiveAccuracy(value);

    if (value === text) {
      calculateResults(value);
      setFinished(true);
      setIsRunning(false);
      clearInterval(timerRef.current);
      clearInterval(wpmTimerRef.current);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    alert(t('typing.pastingDisabled'));
  };

  const calculateLiveAccuracy = (typedText) => {
    let correctChars = 0;
    for (let i = 0; i < typedText.length; i++) {
      if (typedText[i] === text[i]) {
        correctChars++;
      }
    }
    setCorrectKeystrokes(correctChars);
    const accuracyPercent = (correctChars / (typedText.length || 1)) * 100;
    setAccuracy(Number(accuracyPercent.toFixed(1)));
  };

  const calculateLiveWPM = () => {
    if (!startTime) return;
    
    const timeElapsed = (Date.now() - startTime) / 1000 / 60;
    const wordsTyped = input.trim().split(/\s+/).length;
    const currentWPM = Math.round(wordsTyped / timeElapsed) || 0;
    setLiveWPM(currentWPM);
  };

  const calculateResults = (typedText) => {
    const timeTaken = (Date.now() - startTime) / 1000 / 60;
    const wordsTyped = typedText.trim().split(/\s+/).length;
    const speedWPM = Math.round(wordsTyped / timeTaken) || 0;
    
    let correctChars = 0;
    for (let i = 0; i < typedText.length; i++) {
      if (typedText[i] === text[i]) correctChars++;
    }
    const accuracyPercent = (correctChars / text.length) * 100;
    const finalAccuracy = Number(accuracyPercent.toFixed(1));
    
    setAccuracy(finalAccuracy);
    setSpeed(speedWPM);

    // NEW: Track typing activity when results are calculated
    const duration = (Date.now() - startTime) / 1000; // Duration in seconds
    trackTypingActivity(speedWPM, finalAccuracy, duration);
  };

  const renderColoredText = () =>
    text.split("").map((char, i) => {
      let color = "";
      if (i < input.length) {
        color = input[i] === char ? "text-success" : "text-danger";
      }
      return (
        <span key={i} className={color}>
          {char}
        </span>
      );
    });

  const renderKeyboardRow = (keys) => (
    <div className="keyboard-row">
      {keys.map((key) => (
        <div
          key={key}
          className={`keyboard-key ${
            pressedKey === key.toLowerCase() ? "active" : ""
          }`}
        >
          {key}
        </div>
      ))}
    </div>
  );

  const DifficultySelector = () => (
    <div className="mb-3">
      <Form.Label className="fw-bold">{t('typing.selectDifficulty')}:</Form.Label>
      <div>
        {["Beginner", "Intermediate", "Advanced"].map((level) => (
          <Button
            key={level}
            variant={difficulty === level ? "primary" : "outline-primary"}
            size="sm"
            className="me-2 mb-2"
            onClick={() => setDifficulty(level)}
            disabled={loading}
          >
            {t(`typing.levels.${level.toLowerCase()}`)}
          </Button>
        ))}
      </div>
    </div>
  );

  if (showTutorial) {
    return (
      <div className="tutorial-container">
        <div className="keyboard-bg">
          {[...'ASDFJKL;'].map((key, i) => (
            <span key={i} className="flying-key">
              {key}
            </span>
          ))}
        </div>

                {/* ✅ ADDED: Back button in tutorial page */}
        <Button
          variant="outline-light"
          className="position-absolute top-0 start-0 m-3"
          onClick={() => window.history.back()}
        >
          🔙 {t('typing.back')}
        </Button>

        <div className="tutorial-content text-center text-light">
          <h1 className="fw-bold mb-3">💡 {t('typing.welcomeTitle')}</h1>
          <p className="lead mb-4">
            {t('typing.welcomeSubtitle')}
          </p>

          <DifficultySelector />

          <ul className="tutorial-list mx-auto">
            <li>{t('typing.tip1')}</li>
            <li>{t('typing.tip2')}</li>
            <li>{t('typing.tip3')}</li>
            <li>{t('typing.tip4')}</li>
            <li>{t('typing.tip5')}</li>
            <li>{t('typing.tip6')}</li>
            <li>{t('typing.tip7')}</li>
          </ul>

          <div className="mt-5">
            <Button
              variant="success"
              size="lg"
              className="px-4 py-2 start-btn"
              onClick={() => setShowTutorial(false)}
            >
              🚀 {t('typing.startButton')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const TypingResult = ({ accuracy, speed, onRestart }) => {
    let message = "";
    if (accuracy >= 95 && speed >= 60) message = t('typing.results.excellent');
    else if (accuracy >= 85) message = t('typing.results.great');
    else if (accuracy >= 70) message = t('typing.results.good');
    else message = t('typing.results.keepPracticing');

    return (
      <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
        <Card className="p-4 shadow-lg border-0" style={{ width: "90%", maxWidth: "800px" }}>
          <div className="text-center">
            <h4 className="fw-bold text-success mb-3">🎯 {t('typing.results.title')}</h4>
            <Row className="justify-content-center mb-3">
              <Col md={4}>
                <Card className="p-3 shadow-sm border-0 bg-primary text-black">
                  <h5>{t('typing.results.speed')}</h5>
                  <h2>{speed}</h2>
                  <p className="small">{t('typing.results.wpm')}</p>
                </Card>
              </Col>
              <Col md={4}>
                <Card className={`p-3 shadow-sm border-0 ${
                  accuracy >= 90 ? "bg-success" : accuracy >= 80 ? "bg-warning" : "bg-danger"
                } text-black`}>
                  <h5>{t('typing.results.accuracy')}</h5>
                  <h2>{accuracy.toFixed(1)}%</h2>
                  <p className="small">{t('typing.results.accuracyDesc')}</p>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="p-3 shadow-sm border-0 bg-info text-black">
                  <h5>{t('typing.results.keystrokes')}</h5>
                  <h2>{totalKeystrokes}</h2>
                  <p className="small">{t('typing.results.keystrokesDesc', { correct: correctKeystrokes })}</p>
                </Card>
              </Col>
            </Row>

            <Alert variant="info" className="mx-auto" style={{ maxWidth: "600px" }}>
              <strong>{message}</strong>
            </Alert>

            <div className="text-start mx-auto mb-4" style={{ maxWidth: "600px" }}>
              <h6 className="fw-bold">📊 {t('typing.results.improvementTips')}:</h6>
              <ul className="mb-0">
                <li>{t('typing.results.tip1')}</li>
                <li>{t('typing.results.tip2')}</li>
                <li>{t('typing.results.tip3')}</li>
                <li>{t('typing.results.tip4')}</li>
                <li>{t('typing.results.tip5')}</li>
              </ul>
            </div>

            <div className="mt-3">
              <Button variant="success" className="me-2 px-4" onClick={onRestart}>
                🔁 {t('typing.results.tryAgain')}
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={() => setShowTutorial(true)}
              >
                📚 {t('typing.backToInstructions')}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  // If test is finished, only show the results component
  if (finished) {
    return <TypingResult accuracy={accuracy} speed={speed} onRestart={loadLesson} />;
  }

  // Show the normal typing interface when test is not finished
  return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-white overflow-hidden position-relative">
      <Button
        variant="outline-secondary"
        className="position-absolute top-0 start-0 m-3"
        onClick={() => setShowTutorial(true)}
      >
        🔙 {t('typing.backToInstructions')}
      </Button>

      <div className="text-center mb-3">
        <h2>⌨️ {t('typing.title')}</h2>
        <h5 className="text-primary mt-2">⏱ {t('typing.timeLeft')}: {timeLeft}s</h5>
        <ProgressBar
          now={(timeLeft / 60) * 100}
          variant={timeLeft > 20 ? "success" : timeLeft > 10 ? "warning" : "danger"}
          style={{ width: "300px", margin: "0 auto" }}
        />
        <div className="mt-2">
          <Badge bg="info">{t('typing.liveWPM')}: {liveWPM}</Badge>{" "}
          <Badge bg={accuracy >= 90 ? "success" : accuracy >= 80 ? "warning" : "danger"}>
            {t('typing.accuracy')}: {accuracy}%
          </Badge>{" "}
          <Badge bg="secondary">{t('typing.level')}: {t(`typing.levels.${difficulty.toLowerCase()}`)}</Badge>
        </div>
      </div>

      <Card
        className="p-4 shadow-lg border-0 bg-light text-center"
        style={{ width: "70%", maxWidth: "800px" }}
      >
        {loading && (
          <Alert variant="info" className="text-center">
            ⏳ {t('typing.generatingLesson')}
          </Alert>
        )}
        
        {error && (
          <Alert variant="warning" className="text-center">
            ⚠️ {error}
          </Alert>
        )}

        <p
          className="lead mb-3"
          style={{ lineHeight: "1.8", fontFamily: "monospace", minHeight: "120px" }}
        >
          {renderColoredText()}
        </p>

        <Form.Control
          as="textarea"
          rows={3}
          value={input}
          onChange={handleChange}
          onPaste={handlePaste}
          placeholder={isRunning ? t('typing.placeholderRunning') : t('typing.placeholderStart')}
          disabled={loading}
          autoFocus
        />

        <div className="mt-3">
          <Button
            variant={isRunning ? "outline-warning" : "outline-success"}
            className="me-2 mb-2"
            onClick={() => setIsRunning((r) => !r)}
            disabled={loading}
          >
            {isRunning ? "⏸ " + t('typing.pause') : "▶️ " + t('typing.start')}
          </Button>
          <Button variant="outline-info" className="me-2 mb-2" onClick={forceNewRandomLesson} disabled={loading}>
            🎲 {t('typing.randomLesson')}
          </Button>
          <Button 
            variant="success" 
            className="mb-2" 
            onClick={completeTest}
            disabled={loading || input.length === 0}
          >
            {t('typing.completeTest')}
          </Button>
        </div>
        <div className="text-muted small">
          💡 {t('typing.completeTip')}
        </div>
      </Card>

      {!isMobile && (
        <div className="keyboard mt-4">
          {renderKeyboardRow(["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"])}
          {renderKeyboardRow(["A", "S", "D", "F", "G", "H", "J", "K", "L"])}
          {renderKeyboardRow(["Z", "X", "C", "V", "B", "N", "M"])}
        </div>
      )}    
    </div>
  );
};

export default TypingMaster;