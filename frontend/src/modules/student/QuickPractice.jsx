// ////old code
// import { useState, useEffect } from "react";
// import QuizGrade from "./QuizGrade";
// import QuizSubject from "./QuizSubject";
// import QuizQuestion from "./QuizQuestion";
// import Navbar from "./Navbarrr";
// import { useQuiz } from "./QuizContext";
// import { useTranslation } from "react-i18next";
// import "./Quiz.css";

// function Quiz() {
//   const { 
//     updateQuizResults, 
//     rewardPoints, 
//     updateRewardPoints,
//     calculateEarnedPoints,
//     startQuiz,
//     resetQuiz,
//     addEarnedPoints,
//     hasAwardedPoints
//   } = useQuiz();
  
//   const { t } = useTranslation();
  
//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [subtopics, setSubtopics] = useState({});
//   const [quiz, setQuiz] = useState([]);
//   const [currentQ, setCurrentQ] = useState(0);
//   const [selected, setSelected] = useState(null);
//   const [score, setScore] = useState(0);
//   const [isFinished, setIsFinished] = useState(false);
//   const [selectedClass, setSelectedClass] = useState(null);
//   const [selectedSubject, setSelectedSubject] = useState(null);
//   const [selectedSubtopic, setSelectedSubtopic] = useState(null);
//   const [selectedLanguage, setSelectedLanguage] = useState("English");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showAnswer, setShowAnswer] = useState(false);
//   const [currentLevel, setCurrentLevel] = useState(1);
//   const [userAnswers, setUserAnswers] = useState([]);
//   const [isFullScreen, setIsFullScreen] = useState(false);

//   // Sync reward points from localStorage and other components
//   useEffect(() => {
//     // Sync reward points from localStorage on component mount
//     const savedPoints = parseInt(localStorage.getItem('rewardPoints')) || 0;
//     if (savedPoints !== rewardPoints) {
//       console.log(`Quiz: Syncing points from localStorage: ${savedPoints}`);
//       updateRewardPoints(savedPoints);
//     }

//     // Listen for reward points updates from other components
//     const handleRewardPointsUpdate = (event) => {
//       if (event.detail && event.detail.rewardPoints !== undefined) {
//         console.log(`Quiz: Received points update from event: ${event.detail.rewardPoints}`);
//         updateRewardPoints(event.detail.rewardPoints);
//       }
//     };

//     window.addEventListener('rewardPointsUpdated', handleRewardPointsUpdate);

//     return () => {
//       window.removeEventListener('rewardPointsUpdated', handleRewardPointsUpdate);
//     };
//   }, [updateRewardPoints, rewardPoints]);

//   // Fetch classes
//   useEffect(() => {
//     fetch("http://127.0.0.1:8000/classes")
//       .then((res) => res.json())
//       .then((data) => setClasses(data.classes))
//       .catch(() => setError(t('quiz_data_issue')));
//   }, [t]);

//   const fetchSubjects = (className) => {
//     if (!className) return;
//     setLoading(true);
//     fetch(`http://127.0.0.1:8000/chapters?class_name=${className}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setSubjects(data.chapters || []);
//         setLoading(false);
//       })
//       .catch(() => {
//         setError(t('quiz_data_issue'));
//         setLoading(false);
//       });
//   };

//   const fetchSubtopics = (className, subject) => {
//     if (!className || !subject) return;
//     setLoading(true);
//     fetch(`http://127.0.0.1:8000/subtopics?class_name=${className}&subject=${subject}`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (Array.isArray(data.subtopics)) {
//           setSubtopics({ "Chapter 1": data.subtopics });
//         } else if (typeof data.subtopics === "object" && data.subtopics !== null) {
//           setSubtopics(data.subtopics);
//         } else {
//           setSubtopics({});
//           setError(t('quiz_data_issue'));
//         }
//         setLoading(false);
//       })
//       .catch(() => {
//         setError(t('quiz_data_issue'));
//         setLoading(false);
//       });
//   };

//   const fetchQuiz = (subtopic, level = 1, retry = false, language = "English") => {
//     if (!subtopic) return;
//     setLoading(true);

//     const url = `http://127.0.0.1:8000/quiz?subtopic=${encodeURIComponent(
//       subtopic
//     )}&currentLevel=${level}&retry=${retry}&language=${encodeURIComponent(language)}`;

//     console.log("Fetching quiz with URL:", url);
//     console.log("Language being sent:", language);

//     fetch(url)
//       .then((res) => {
//         if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//         return res.json();
//       })
//       .then((data) => {
//         console.log("Quiz data received:", data);
//         if (data.error) setError(data.error);
//         else {
//           const cleanedQuiz = data.quiz.map((q) => {
//             q.options = q.options.map((opt) => opt.replace(/^[A-D][).]\s*/, ""));
//             q.answer = q.answer.replace(/^[A-D][).]\s*/, "");
//             return q;
//           });
//           setQuiz(cleanedQuiz);
//           setCurrentLevel(data.currentLevel || level);
//           setCurrentQ(0);
//           setSelected(null);
//           setScore(0);
//           setIsFinished(false);
//           setShowAnswer(false);
//           setUserAnswers([]);
//           setError(null);
          
//           // Start the quiz in context
//           startQuiz();
//         }
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Fetch error:", error);
//         setError(`${t('quiz_data_issue')}: ${error.message}`);
//         setLoading(false);
//       });
//   };

//   const handleClassClick = (className) => {
//     setSelectedClass(className);
//     setSelectedSubject(null);
//     setSelectedSubtopic(null);
//     fetchSubjects(className);
//   };

//   const handleSubjectClick = (subject) => {
//     setSelectedSubject(subject);
//     setSelectedSubtopic(null);
//     fetchSubtopics(selectedClass, subject);
//   };

//   const handleSubtopicClick = (subtopic, language = "English") => {
//     setSelectedSubtopic(subtopic);
//     setSelectedLanguage(language);
//     setCurrentLevel(1);
//     enterFullScreen();
//     fetchQuiz(subtopic, 1, false, language);
//   };

//   const handleAnswer = (option) => {
//     setSelected(option);
//     setShowAnswer(true);

//     const newAnswers = [...userAnswers];
//     newAnswers[currentQ] = option;
//     setUserAnswers(newAnswers);

//     if (option === quiz[currentQ].answer) setScore(score + 1);
//   };

//   const nextQuestion = () => {
//     if (currentQ < quiz.length - 1) {
//       setCurrentQ(currentQ + 1);
//       setSelected(null);
//       setShowAnswer(false);
//     } else {
//       setIsFinished(true);
      
//       // Calculate and award points using context - FIXED: Only calculate, don't award here
//       if (score >= 5 && !hasAwardedPoints) {
//         const earnedPoints = calculateEarnedPoints(score, quiz.length);
//         console.log(`Quiz completed! Score: ${score}/${quiz.length}, Points to be earned: ${earnedPoints.totalPoints}`);
        
//         // Award points through context
//         const pointsWereAwarded = addEarnedPoints(earnedPoints);
//         console.log(`Points actually awarded: ${pointsWereAwarded ? 'Yes' : 'No'}`);
//       }

//       updateQuizResults(
//         score,
//         quiz.length,
//         currentLevel,
//         selectedClass,
//         selectedSubject,
//         selectedSubtopic
//       );
//       exitFullScreen();
//     }
//   };

//   const prevQuestion = () => {
//     if (currentQ > 0) {
//       setCurrentQ(currentQ - 1);
//       setSelected(userAnswers[currentQ - 1] || null);
//       setShowAnswer(false);
//     }
//   };

//   const backToChapters = () => {
//     setSelectedSubtopic(null);
//     setQuiz([]);
//     setCurrentQ(0);
//     setSelected(null);
//     setScore(0);
//     setIsFinished(false);
//     setShowAnswer(false);
//     setUserAnswers([]);
//     resetQuiz();
//     exitFullScreen();
//   };

//   const retryQuiz = () => {
//     enterFullScreen();
//     fetchQuiz(selectedSubtopic, currentLevel, true, selectedLanguage);
//   };

//   const nextLevel = () => {
//     const nextLvl = currentLevel + 1;
//     setCurrentLevel(nextLvl);
//     fetchQuiz(selectedSubtopic, nextLvl, false, selectedLanguage);
//     enterFullScreen();
//   };

//   const enterFullScreen = () => {
//     const elem = document.documentElement;
//     if (elem.requestFullscreen) elem.requestFullscreen().catch(() => {});
//     else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
//     else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
//     else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
//     setIsFullScreen(true);
//   };

//   const exitFullScreen = () => {
//     if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
//     else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
//     else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
//     else if (document.msExitFullscreen) document.msExitFullscreen();
//     setIsFullScreen(false);
//   };

//   const handlePause = () => {
//     // Handle quiz pause if needed
//     console.log("Quiz paused");
//   };

//   // Get chapter name from subtopics object
//   const getChapterName = () => {
//     if (!subtopics || Object.keys(subtopics).length === 0) return "Chapter 1";
    
//     const chapterKey = Object.keys(subtopics)[0];
//     return chapterKey || "Chapter 1";
//   };

//   if (loading)
//     return (
//       <div className="loading-container">
//         <div className="edu-loader">
//           <span role="img" aria-label="books" className="edu-icon">
//             📚
//           </span>
//           <span role="img" aria-label="pencil" className="edu-icon">
//             ✏️
//           </span>
//           <span role="img" aria-label="globe" className="edu-icon">
//             🌍
//           </span>
//         </div>
//         <p>{t('preparing_your_quiz')}</p>
//       </div>
//     );

//   return (
//     <>
//       <Navbar isFullScreen={isFullScreen} />
//       {error && (
//         <div className="error-container">
//           <div className="error-icon">⚠️</div>
//           <p>{error}</p>
//           <button className="retry-btn" onClick={() => window.location.reload()}>
//             {t('retry_quiz')}
//           </button>
//         </div>
//       )}

//       {!selectedClass && !error && (
//         <QuizGrade classes={classes} onClassClick={handleClassClick} />
//       )}

//       {selectedClass && !selectedSubtopic && !error && (
//         <QuizSubject
//           subjects={subjects}
//           subtopics={subtopics}
//           selectedSubject={selectedSubject}
//           selectedClass={selectedClass}
//           onClassClick={() => setSelectedClass(null)}
//           onSubjectClick={handleSubjectClick}
//           onSubtopicClick={handleSubtopicClick}
//         />
//       )}

//       {selectedSubtopic && !error && (
//         <QuizQuestion
//           quiz={quiz}
//           currentQ={currentQ}
//           selected={selected}
//           showAnswer={showAnswer}
//           score={score}
//           isFinished={isFinished}
//           handleAnswer={handleAnswer}
//           nextQuestion={nextQuestion}
//           prevQuestion={prevQuestion}
//           retryQuiz={retryQuiz}
//           nextLevel={nextLevel}
//           backToChapters={backToChapters}
//           currentLevel={currentLevel}
//           userAnswers={userAnswers}
//           handlePause={handlePause}
//           selectedLanguage={selectedLanguage}
//           selectedSubtopic={selectedSubtopic}
//           classLevel={selectedClass}
//           subject={selectedSubject}
//           chapter={getChapterName()}
//           rewardPoints={rewardPoints}
//         />
//       )}
//     </>
//   );
// }

// export default Quiz;









import { useState, useEffect } from "react";
import QuizGrade from "./QuizGrade";
import QuizSubject from "./QuizSubject";
import QuizQuestion from "./QuizQuestion";
import Navbar from "./Navbarrr";
import { useQuiz } from "./QuizContext";
import { useScreenTime } from "./ScreenTime";
import { useTranslation } from "react-i18next";
import "./Quiz.css";

function Quiz() {
  const { 
    updateQuizResults, 
    rewardPoints, 
    updateRewardPoints,
    calculateEarnedPoints,
    startQuiz,
    resetQuiz,
    addEarnedPoints,
    hasAwardedPoints
  } = useQuiz();
  
  const { 
    startActivityTracking, 
    stopActivityTracking 
  } = useScreenTime();
  
  const { t } = useTranslation();
  
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subtopics, setSubtopics] = useState({});
  const [quiz, setQuiz] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentActivityId, setCurrentActivityId] = useState(null);

  // Sync reward points from localStorage and other components
  useEffect(() => {
    // Sync reward points from localStorage on component mount
    const savedPoints = parseInt(localStorage.getItem('rewardPoints')) || 0;
    if (savedPoints !== rewardPoints) {
      console.log(`Quiz: Syncing points from localStorage: ${savedPoints}`);
      updateRewardPoints(savedPoints);
    }

    // Listen for reward points updates from other components
    const handleRewardPointsUpdate = (event) => {
      if (event.detail && event.detail.rewardPoints !== undefined) {
        console.log(`Quiz: Received points update from event: ${event.detail.rewardPoints}`);
        updateRewardPoints(event.detail.rewardPoints);
      }
    };

    window.addEventListener('rewardPointsUpdated', handleRewardPointsUpdate);

    return () => {
      window.removeEventListener('rewardPointsUpdated', handleRewardPointsUpdate);
    };
  }, [updateRewardPoints, rewardPoints]);

  // Start time tracking when quiz begins
  useEffect(() => {
    if (selectedSubtopic && quiz.length > 0 && !isFinished) {
      console.log("Starting quiz time tracking...");
      const activityId = startActivityTracking('quiz', {
        quizId: `quiz-${selectedSubtopic}-level-${currentLevel}`,
        topic: selectedSubtopic,
        subject: selectedSubject,
        class: selectedClass,
        level: currentLevel,
        totalQuestions: quiz.length,
        language: selectedLanguage
      });
      setCurrentActivityId(activityId);
      console.log("Quiz activity started with ID:", activityId);
    }
  }, [selectedSubtopic, quiz.length, isFinished, currentLevel]);

  // Stop time tracking when component unmounts or quiz finishes
  useEffect(() => {
    return () => {
      if (currentActivityId && !isFinished) {
        console.log("Stopping quiz time tracking (component unmount)...");
        stopActivityTracking(currentActivityId, {
          score: score,
          totalQuestions: quiz.length,
          completed: false,
          reason: 'navigated_away'
        });
        setCurrentActivityId(null);
      }
    };
  }, [currentActivityId, isFinished, score, quiz.length]);

  // Fetch classes
  useEffect(() => {
    fetch("http://127.0.0.1:8000/classes")
      .then((res) => res.json())
      .then((data) => setClasses(data.classes))
      .catch(() => setError(t('quiz_data_issue')));
  }, [t]);

  const fetchSubjects = (className) => {
    if (!className) return;
    setLoading(true);
    fetch(`http://127.0.0.1:8000/chapters?class_name=${className}`)
      .then((res) => res.json())
      .then((data) => {
        setSubjects(data.chapters || []);
        setLoading(false);
      })
      .catch(() => {
        setError(t('quiz_data_issue'));
        setLoading(false);
      });
  };

  const fetchSubtopics = (className, subject) => {
    if (!className || !subject) return;
    setLoading(true);
    fetch(`http://127.0.0.1:8000/subtopics?class_name=${className}&subject=${subject}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.subtopics)) {
          setSubtopics({ "Chapter 1": data.subtopics });
        } else if (typeof data.subtopics === "object" && data.subtopics !== null) {
          setSubtopics(data.subtopics);
        } else {
          setSubtopics({});
          setError(t('quiz_data_issue'));
        }
        setLoading(false);
      })
      .catch(() => {
        setError(t('quiz_data_issue'));
        setLoading(false);
      });
  };

  const fetchQuiz = (subtopic, level = 1, retry = false, language = "English") => {
    if (!subtopic) return;
    setLoading(true);

    const url = `http://127.0.0.1:8000/quiz?subtopic=${encodeURIComponent(
      subtopic
    )}&currentLevel=${level}&retry=${retry}&language=${encodeURIComponent(language)}`;

    console.log("Fetching quiz with URL:", url);
    console.log("Language being sent:", language);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Quiz data received:", data);
        if (data.error) setError(data.error);
        else {
          const cleanedQuiz = data.quiz.map((q) => {
            q.options = q.options.map((opt) => opt.replace(/^[A-D][).]\s*/, ""));
            q.answer = q.answer.replace(/^[A-D][).]\s*/, "");
            return q;
          });
          setQuiz(cleanedQuiz);
          setCurrentLevel(data.currentLevel || level);
          setCurrentQ(0);
          setSelected(null);
          setScore(0);
          setIsFinished(false);
          setShowAnswer(false);
          setUserAnswers([]);
          setError(null);
          
          // Start the quiz in context
          startQuiz();
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setError(`${t('quiz_data_issue')}: ${error.message}`);
        setLoading(false);
      });
  };

  const handleClassClick = (className) => {
    setSelectedClass(className);
    setSelectedSubject(null);
    setSelectedSubtopic(null);
    fetchSubjects(className);
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    setSelectedSubtopic(null);
    fetchSubtopics(selectedClass, subject);
  };

  const handleSubtopicClick = (subtopic, language = "English") => {
    setSelectedSubtopic(subtopic);
    setSelectedLanguage(language);
    setCurrentLevel(1);
    enterFullScreen();
    fetchQuiz(subtopic, 1, false, language);
  };

  const handleAnswer = (option) => {
    setSelected(option);
    setShowAnswer(true);

    const newAnswers = [...userAnswers];
    newAnswers[currentQ] = option;
    setUserAnswers(newAnswers);

    if (option === quiz[currentQ].answer) setScore(score + 1);
  };

  const nextQuestion = () => {
    if (currentQ < quiz.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setShowAnswer(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsFinished(true);
    
    // Stop time tracking when quiz finishes
    if (currentActivityId) {
      console.log("Stopping quiz time tracking (quiz finished)...");
      stopActivityTracking(currentActivityId, {
        score: score,
        totalQuestions: quiz.length,
        completed: true,
        finalScore: `${score}/${quiz.length}`,
        percentage: Math.round((score / quiz.length) * 100)
      });
      setCurrentActivityId(null);
    }

    // Calculate and award points using context - FIXED: Only calculate, don't award here
    if (score >= 5 && !hasAwardedPoints) {
      const earnedPoints = calculateEarnedPoints(score, quiz.length);
      console.log(`Quiz completed! Score: ${score}/${quiz.length}, Points to be earned: ${earnedPoints.totalPoints}`);
      
      // Award points through context
      const pointsWereAwarded = addEarnedPoints(earnedPoints);
      console.log(`Points actually awarded: ${pointsWereAwarded ? 'Yes' : 'No'}`);
    }

    updateQuizResults(
      score,
      quiz.length,
      currentLevel,
      selectedClass,
      selectedSubject,
      selectedSubtopic
    );
    exitFullScreen();
  };

  const prevQuestion = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
      setSelected(userAnswers[currentQ - 1] || null);
      setShowAnswer(false);
    }
  };

  const backToChapters = () => {
    // Stop time tracking if user navigates away
    if (currentActivityId && !isFinished) {
      console.log("Stopping quiz time tracking (back to chapters)...");
      stopActivityTracking(currentActivityId, {
        score: score,
        totalQuestions: quiz.length,
        completed: false,
        reason: 'navigated_away',
        progress: `${currentQ + 1}/${quiz.length}`
      });
      setCurrentActivityId(null);
    }

    setSelectedSubtopic(null);
    setQuiz([]);
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setIsFinished(false);
    setShowAnswer(false);
    setUserAnswers([]);
    resetQuiz();
    exitFullScreen();
  };

  const retryQuiz = () => {
    // Stop current time tracking for retry
    if (currentActivityId) {
      console.log("Stopping quiz time tracking (retry)...");
      stopActivityTracking(currentActivityId, {
        score: score,
        totalQuestions: quiz.length,
        completed: false,
        reason: 'retry'
      });
      setCurrentActivityId(null);
    }

    enterFullScreen();
    fetchQuiz(selectedSubtopic, currentLevel, true, selectedLanguage);
  };

  const nextLevel = () => {
    // Stop current time tracking for level change
    if (currentActivityId) {
      console.log("Stopping quiz time tracking (next level)...");
      stopActivityTracking(currentActivityId, {
        score: score,
        totalQuestions: quiz.length,
        completed: true,
        levelCompleted: currentLevel
      });
      setCurrentActivityId(null);
    }

    const nextLvl = currentLevel + 1;
    setCurrentLevel(nextLvl);
    fetchQuiz(selectedSubtopic, nextLvl, false, selectedLanguage);
    enterFullScreen();
  };

  const enterFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen().catch(() => {});
    else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    setIsFullScreen(true);
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
    setIsFullScreen(false);
  };

  const handlePause = () => {
    // Handle quiz pause - we can pause time tracking if needed
    console.log("Quiz paused");
    // Note: For simplicity, we're not pausing time tracking
    // If you need pause functionality, we can enhance the ScreenTimeContext
  };

  // Get chapter name from subtopics object
  const getChapterName = () => {
    if (!subtopics || Object.keys(subtopics).length === 0) return "Chapter 1";
    
    const chapterKey = Object.keys(subtopics)[0];
    return chapterKey || "Chapter 1";
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="edu-loader">
          <span role="img" aria-label="books" className="edu-icon">
            📚
          </span>
          <span role="img" aria-label="pencil" className="edu-icon">
            ✏️
          </span>
          <span role="img" aria-label="globe" className="edu-icon">
            🌍
          </span>
        </div>
        <p>{t('preparing_your_quiz')}</p>
      </div>
    );

  return (
    <>
      <Navbar isFullScreen={isFullScreen} />
      {error && (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            {t('retry_quiz')}
          </button>
        </div>
      )}

      {!selectedClass && !error && (
        <QuizGrade classes={classes} onClassClick={handleClassClick} />
      )}

      {selectedClass && !selectedSubtopic && !error && (
        <QuizSubject
          subjects={subjects}
          subtopics={subtopics}
          selectedSubject={selectedSubject}
          selectedClass={selectedClass}
          onClassClick={() => {
            // Stop any ongoing activity tracking
            if (currentActivityId) {
              stopActivityTracking(currentActivityId, {
                completed: false,
                reason: 'navigated_away_from_class'
              });
              setCurrentActivityId(null);
            }
            setSelectedClass(null);
          }}
          onSubjectClick={handleSubjectClick}
          onSubtopicClick={handleSubtopicClick}
        />
      )}

      {selectedSubtopic && !error && (
        <QuizQuestion
          quiz={quiz}
          currentQ={currentQ}
          selected={selected}
          showAnswer={showAnswer}
          score={score}
          isFinished={isFinished}
          handleAnswer={handleAnswer}
          nextQuestion={nextQuestion}
          prevQuestion={prevQuestion}
          retryQuiz={retryQuiz}
          nextLevel={nextLevel}
          backToChapters={backToChapters}
          currentLevel={currentLevel}
          userAnswers={userAnswers}
          handlePause={handlePause}
          selectedLanguage={selectedLanguage}
          selectedSubtopic={selectedSubtopic}
          classLevel={selectedClass}
          subject={selectedSubject}
          chapter={getChapterName()}
          rewardPoints={rewardPoints}
          currentActivityId={currentActivityId}
        />
      )}
    </>
  );
}

export default Quiz;
