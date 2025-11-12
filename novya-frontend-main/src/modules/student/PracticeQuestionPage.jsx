

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import syllabus from "./Syllabus";
import { ArrowLeft, Clock, CheckCircle, XCircle, HelpCircle, BarChart3, Share2 } from "lucide-react";

const PracticeQuestionsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { subjectName, grade, chapter, subtopic } = location.state || {};

  // Find next subtopic logic - corrected to work with the syllabus structure
  const gradeData = syllabus[grade];
  const subjectData = gradeData && gradeData[subjectName];
  const chapterData = subjectData && subjectData.find(ch => ch.chapter === chapter);
  
  const currentSubIndex = chapterData ? chapterData.subtopics.indexOf(subtopic) : -1;
  const nextSubtopic = chapterData && currentSubIndex >= 0 && currentSubIndex < chapterData.subtopics.length - 1
    ? chapterData.subtopics[currentSubIndex + 1]
    : null;

  const [showInstructions, setShowInstructions] = useState(true);
  const [acceptedInstructions, setAcceptedInstructions] = useState(false);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [showResults, setShowResults] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [backHover, setBackHover] = useState(false);
  const [shareHover, setShareHover] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Diverse set of questions with explanations
  const generateMCQs = (sub) => {
    if (sub.toLowerCase().includes("math") || sub.toLowerCase().includes("algebra")) {
      return [
        {
          question: `What is a key concept in "${sub}"?`,
          options: ["Variables and equations", "Geometric shapes", "Statistical analysis", "Number theory"],
          correct: "Variables and equations",
          explanation: "Algebra primarily deals with variables and equations to solve problems.",
        },
        {
          question: `Which of the following is true about "${sub}"?`,
          options: ["It only deals with numbers", "It focuses on abstract concepts", "It avoids using symbols", "It's not applicable in real life"],
          correct: "It focuses on abstract concepts",
          explanation: "Mathematics often deals with abstract concepts that represent real-world problems.",
        },
        {
          question: `Choose the correct statement regarding "${sub}"`,
          options: ["It's only for advanced learners", "It builds critical thinking skills", "It has limited applications", "It doesn't require practice"],
          correct: "It builds critical thinking skills",
          explanation: "Math education develops logical reasoning and problem-solving abilities.",
        },
      ];
    } else if (sub.toLowerCase().includes("science") || sub.toLowerCase().includes("physics")) {
      return [
        {
          question: `What is a key concept in "${sub}"?`,
          options: ["Scientific method", "Historical events", "Literary analysis", "Artistic expression"],
          correct: "Scientific method",
          explanation: "Science relies on the scientific method for inquiry and discovery.",
        },
        {
          question: `Which of the following is true about "${sub}"?`,
          options: ["It's based only on theories", "It requires experimentation", "It avoids questioning", "It's not evidence-based"],
          correct: "It requires experimentation",
          explanation: "Scientific knowledge is built through experimentation and observation.",
        },
        {
          question: `Choose the correct statement regarding "${sub}"`,
          options: ["It's static and unchanging", "It evolves with new discoveries", "It ignores real-world applications", "It's not connected to technology"],
          correct: "It evolves with new discoveries",
          explanation: "Science continually evolves as new evidence and discoveries emerge.",
        },
      ];
    } else {
      return [
        {
          question: `What is a key concept in "${sub}"?`,
          options: ["Fundamental principles", "Basic elements", "Core theories", "All of the above"],
          correct: "All of the above",
          explanation: "Most subjects have fundamental principles, basic elements, and core theories.",
        },
        {
          question: `Which of the following is true about "${sub}"?`,
          options: ["It requires memorization only", "It involves critical thinking", "It has no practical use", "It's not connected to other subjects"],
          correct: "It involves critical thinking",
          explanation: "Learning any subject develops critical thinking and analytical skills.",
        },
        {
          question: `Choose the correct statement regarding "${sub}"`,
          options: ["It's easy to master quickly", "It requires consistent practice", "It doesn't relate to real life", "It's only for experts"],
          correct: "It requires consistent practice",
          explanation: "Mastery of any subject requires consistent practice and application.",
        },
      ];
    }
  };

  const mcqs = generateMCQs(subtopic);
  const currentQ = mcqs[currentQuestion];

  // Timer
  useEffect(() => {
    if (showInstructions || showResults || showReview) return;
    if (timeLeft === 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showInstructions, showResults, showReview]);

  const handleOptionChange = (option) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: option }));
  };

  const handleNext = () => {
    if (currentQuestion < mcqs.length - 1) setCurrentQuestion((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentQuestion > 0) setCurrentQuestion((prev) => prev - 1);
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  // Share functionality
  const handleShare = async () => {
    const shareData = {
      title: "Practice Test Results",
      text: `I scored ${scorePercent}% on my ${subtopic} practice test!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support the Web Share API
        await navigator.clipboard.writeText(
          `I scored ${scorePercent}% on my ${subtopic} practice test!`
        );
        alert("Results copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  // Next subtopic functionality
  const handleGoToNextSubtopic = () => {
    if (nextSubtopic) {
      navigate("/practice", {
        state: {
          subjectName,
          grade,
          chapter,
          subtopic: nextSubtopic,
        },
      });
      window.location.reload(); // reload to reset state for new test
    } else {
      navigate(-1); // back to chapters if no more subtopics
    }
  };

  // Results
  const totalQuestions = mcqs.length;
  const correctAnswers = mcqs.filter((q, idx) => answers[idx] === q.correct).length;
  const wrongAnswers = mcqs.filter((q, idx) => answers[idx] && answers[idx] !== q.correct).length;
  const skippedQuestions = mcqs.filter((q, idx) => !answers[idx]).length;
  const scorePercent = Math.round((correctAnswers / totalQuestions) * 100);

  // Performance evaluation
  const getPerformanceMessage = () => {
    if (scorePercent >= 90) return "Outstanding! 🎉";
    if (scorePercent >= 70) return "Great Job! 👍";
    if (scorePercent >= 50) return "Good Effort! 💪";
    return "Keep Practicing! 📚";
  };

  const getPerformanceColor = () => {
    if (scorePercent >= 80) return "#10b981";
    if (scorePercent >= 60) return "#f59e0b";
    return "#ef4444";
  };

  // Review Section
  if (showReview) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",
        fontFamily: "'Inter', sans-serif",
        padding: isMobile ? "5rem 1rem 2rem 1rem" : "6rem 2rem 2rem 2rem",
      }}>
        <div style={{
          maxWidth: "800px",
          margin: "0 auto"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "flex-start",
            marginBottom: "2rem"
          }}>
      <button
  onClick={() => setShowReview(false)}
  style={{
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: backHover ? "#7e57c2" : "transparent",
    border: "1px solid #7e57c2",
    color: backHover ? "white" : "#7e57c2",
    borderRadius: "6px",
    padding: "8px 16px",
    cursor: "pointer",
    marginTop: "3rem",
    fontWeight: 600,
    transition: "all 0.2s ease",
  }}
  onMouseEnter={() => setBackHover(true)}
  onMouseLeave={() => setBackHover(false)}
>
  <ArrowLeft size={18} /> Back to Results
</button>
          </div>

          <h2 style={{
            textAlign: "center",
            fontSize: isMobile ? "1.8rem" : "2.2rem",
            color: "#4527a0",
            fontWeight: 700,
            marginBottom: "2rem"
          }}>
            Answer Review - {subtopic}
          </h2>

          {mcqs.map((question, index) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer === question.correct;
            const isSkipped = !userAnswer;

            let cardStyle = {
              background: "#fff",
              borderRadius: "12px",
              padding: "1.5rem",
              marginBottom: "1.5rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "1px solid #e0e0e0",
            };

            if (isCorrect) {
              cardStyle = { 
                ...cardStyle, 
                borderLeft: "4px solid #10b981",
                background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
              };
            } else if (isSkipped) {
              cardStyle = { 
                ...cardStyle, 
                borderLeft: "4px solid #64748b",
                background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
              };
            } else {
              cardStyle = { 
                ...cardStyle, 
                borderLeft: "4px solid #ef4444",
                background: "linear-gradient(135deg, #fef2f2, #fee2e2)",
              };
            }

            return (
              <div key={index} style={cardStyle}>
                <div style={{
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#64748b",
                  marginBottom: "0.5rem",
                }}>
                  Question {index + 1} • {isCorrect ? "Correct ✓" : isSkipped ? "Skipped" : "Wrong ✗"}
                </div>

                <div style={{
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  color: "#1e293b",
                  marginBottom: "1rem",
                  lineHeight: "1.5",
                }}>
                  {question.question}
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  {question.options.map((option, optIndex) => {
                    let optionStyle = {
                      padding: "0.75rem",
                      borderRadius: "8px",
                      marginBottom: "0.5rem",
                      fontSize: "0.95rem",
                    };

                    if (option === question.correct) {
                      optionStyle = { 
                        ...optionStyle, 
                        background: "#dcfce7",
                        color: "#166534",
                        border: "1px solid #bbf7d0",
                      };
                    } else if (option === userAnswer && !isCorrect) {
                      optionStyle = { 
                        ...optionStyle, 
                        background: "#fee2e2",
                        color: "#991b1b",
                        border: "1px solid #fecaca",
                      };
                    } else {
                      optionStyle = { 
                        ...optionStyle, 
                        background: "#f8fafc", 
                        border: "1px solid #e2e8f0" 
                      };
                    }

                    return (
                      <div key={optIndex} style={optionStyle}>
                        {option === question.correct && "✓ "}
                        {option === userAnswer && option !== question.correct && "✗ "}
                        {option}
                        {option === userAnswer && <span style={{fontWeight: "600"}}> (Your Answer)</span>}
                      </div>
                    );
                  })}
                </div>

                <div style={{
                  background: "#f0f9ff",
                  border: "1px solid #bae6fd",
                  borderRadius: "8px",
                  padding: "1rem",
                  marginTop: "1rem",
                  fontSize: "0.9rem",
                  color: "#0369a1",
                  lineHeight: "1.5",
                }}>
                  <strong>Explanation:</strong> {question.explanation}
                </div>
              </div>
            );
          })}

          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <button
              onClick={handleGoToNextSubtopic}
              style={{
                background: "linear-gradient(135deg, #7e57c2, #5e35b1)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: "1rem 2rem",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "1rem",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(126, 87, 194, 0.4)",
             
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 15px rgba(126, 87, 194, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(126, 87, 194, 0.4)";
              }}
            >
              {nextSubtopic ? "Go to Next Subtopic" : "Back to Chapters"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Instructions
  if (showInstructions) {
    const instructionsList = [
      "Focus on one subtopic at a time.",
      "You will have 3 minutes to complete the test.",
      "Answer all questions to the best of your ability.",
      "Once started, you cannot pause the timer.",
      "Avoid switching tabs during the test.",
      "Review your answers carefully before submission.",
    ];
    
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0f7fa 0%, #afbecaff 100%)",
        fontFamily: "'Inter', sans-serif",
        padding: isMobile ? "4rem 1rem" : "6rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          maxWidth: "600px",
          width: "100%"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "flex-start",
            marginBottom: "2rem"
          }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: backHover ? "#7e57c2" : "transparent",
                border: "1px solid #7e57c2",
                color: backHover ? "white" : "#7e57c2",
                borderRadius: "6px",
                padding: "8px 16px",
                cursor: "pointer",
                marginTop:"3rem",
                fontWeight: 600,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={() => setBackHover(true)}
              onMouseLeave={() => setBackHover(false)}
            >
              <ArrowLeft size={18} /> Back
            </button>
          </div>

          <h2 style={{
            textAlign: "center",
            marginBottom: "2rem",
            fontSize: isMobile ? "1.8rem" : "2.2rem",
            color: "#4527a0",
            fontWeight: 700
          }}>
            Practice Instructions - {subtopic}
          </h2>
          
          <div style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "2rem",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            marginBottom: "2rem",
          }}>
            <ul style={{ 
              lineHeight: "1.8", 
              color: "#37474f",
              paddingLeft: "1.2rem",
              marginBottom: "1.5rem"
            }}>
              {instructionsList.map((inst, idx) => (
                <li key={idx} style={{ marginBottom: "0.8rem" }}>
                  {inst}
                </li>
              ))}
            </ul>
            
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              background: "#f3e5f5", 
              padding: "1rem", 
              borderRadius: "8px",
              border: "1px solid #e1bee7"
            }}>
              <input
                type="checkbox"
                id="acceptInstructions"
                checked={acceptedInstructions}
                onChange={() => setAcceptedInstructions(!acceptedInstructions)}
                style={{ marginRight: "0.8rem" }}
              />
              <label
                htmlFor="acceptInstructions"
                style={{ color: "#6a1b9a", fontWeight: 500 }}
              >
                I have read and accept the instructions
              </label>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              disabled={!acceptedInstructions}
              onClick={() => setShowInstructions(false)}
              style={{
                padding: "1rem 2rem",
                background: acceptedInstructions ? "linear-gradient(135deg, #7e57c2, #5e35b1)" : "#bdbdbd",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                cursor: acceptedInstructions ? "pointer" : "not-allowed",
                fontWeight: 600,
                fontSize: "1rem",
                transition: "all 0.3s ease",
                boxShadow: acceptedInstructions ? "0 4px 12px rgba(126, 87, 194, 0.4)" : "none"
              }}
              onMouseEnter={(e) => {
                if (acceptedInstructions) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 6px 15px rgba(126, 87, 194, 0.5)";
                }
              }}
              onMouseLeave={(e) => {
                if (acceptedInstructions) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 12px rgba(126, 87, 194, 0.4)";
                }
              }}
            >
              Start Practice Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results
  if (showResults) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
        fontFamily: "'Inter', sans-serif",
        padding: isMobile ? "2rem 1rem" : "4rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          background: "white",
          borderRadius: "20px",
          padding: isMobile ? "2rem 1.5rem" : "3rem",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          maxWidth: "700px",
          width: "100%",
          textAlign: "center"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "flex-start",
            marginBottom: "1.5rem"
          }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "transparent",
                border: "1px solid #7e57c2",
                color: "#7e57c2",
                borderRadius: "6px",
                padding: "8px 16px",
                cursor: "pointer",
                fontWeight: 600,
                marginTop:"3rem",
              }}
            >
              <ArrowLeft size={18} /> Back to Chapters
            </button>
          </div>

          <h2 style={{
            fontSize: isMobile ? "1.8rem" : "2.2rem",
            color: "#4527a0",
            fontWeight: 700,
            marginBottom: "0.5rem"
          }}>
            Practice Complete!
          </h2>
          
          <p style={{
            fontSize: "1.1rem",
            color: "#616161",
            marginBottom: "2.5rem"
          }}>
            Here's how you performed in your practice session
          </p>

          {/* Score Circle */}
          <div style={{
            width: isMobile ? "140px" : "160px",
            height: isMobile ? "140px" : "160px",
            borderRadius: "50%",
            background: `conic-gradient(${getPerformanceColor()} ${scorePercent * 3.6}deg, #e0e0e0 0deg)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 2rem",
            position: "relative",
            boxShadow: `0 8px 20px ${getPerformanceColor()}40`
          }}>
            <div style={{
              width: isMobile ? "100px" : "120px",
              height: isMobile ? "100px" : "120px",
              borderRadius: "50%",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isMobile ? "1.8rem" : "2.2rem",
              fontWeight: "700",
              color: "#4527a0"
            }}>
              {scorePercent}%
            </div>
          </div>

          <h3 style={{
            fontSize: "1.4rem",
            color: getPerformanceColor(),
            marginBottom: "2rem",
            fontWeight: 600
          }}>
            {getPerformanceMessage()}
          </h3>

          {/* Stats */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
            gap: "1rem",
            marginBottom: "2.5rem"
          }}>
            <div style={{
              background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
              borderRadius: "12px",
              padding: "1.5rem 1rem",
              textAlign: "center",
              border: "1px solid #90caf9"
            }}>
              <div style={{ fontSize: "1.8rem", fontWeight: "700", color: "#1976d2", marginBottom: "0.5rem" }}>
                {totalQuestions}
              </div>
              <div style={{ fontSize: "0.9rem", color: "#616161", fontWeight: "500" }}>Total Questions</div>
            </div>
            
            <div style={{
              background: "linear-gradient(135deg, #e8f5e9, #c8e6c9)",
              borderRadius: "12px",
              padding: "1.5rem 1rem",
              textAlign: "center",
              border: "1px solid #a5d6a7"
            }}>
              <CheckCircle size={24} color="#388e3c" style={{ margin: "0 auto 0.5rem" }} />
              <div style={{ fontSize: "1.8rem", fontWeight: "700", color: "#388e3c", marginBottom: "0.5rem" }}>
                {correctAnswers}
              </div>
              <div style={{ fontSize: "0.9rem", color: "#616161", fontWeight: "500" }}>Correct</div>
            </div>
            
            <div style={{
              background: "linear-gradient(135deg, #ffebee, #ffcdd2)",
              borderRadius: "12px",
              padding: "1.5rem 1rem",
              textAlign: "center",
              border: "1px solid #ef9a9a"
            }}>
              <XCircle size={24} color="#d32f2f" style={{ margin: "0 auto 0.5rem" }} />
              <div style={{ fontSize: "1.8rem", fontWeight: "700", color: "#d32f2f", marginBottom: "0.5rem" }}>
                {wrongAnswers}
              </div>
              <div style={{ fontSize: "0.9rem", color: "#616161", fontWeight: "500" }}>Wrong</div>
            </div>
            
            <div style={{
              background: "linear-gradient(135deg, #f5f5f5, #e0e0e0)",
              borderRadius: "12px",
              padding: "1.5rem 1rem",
              textAlign: "center",
              border: "1px solid #bdbdbd"
            }}>
              <HelpCircle size={24} color="#ded3d3ff" style={{ margin: "0 auto 0.5rem" }} />
              <div style={{ fontSize: "1.8rem", fontWeight: "700", color: "#757575", marginBottom: "0.5rem" }}>
                {skippedQuestions}
              </div>
              <div style={{ fontSize: "0.9rem", color: "#616161", fontWeight: "500" }}>Skipped</div>
            </div>
          </div>

          <div style={{
            background: "linear-gradient(135deg, #f3e5f5, #e1bee7)",
            borderRadius: "12px",
            padding: "1.2rem",
            marginBottom: "2rem",
            border: "1px solid #ce93d8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.8rem"
          }}>
            <Clock size={20} color="#7b1fa2" />
            <div style={{ fontSize: "1rem", color: "#7b1fa2", fontWeight: "500" }}>
              Time Taken: {formatTime(180 - timeLeft)} | Score: {correctAnswers}/{totalQuestions}
            </div>
          </div>

        <div
  style={{
    display: "flex",
    justifyContent: "center", // center horizontally
    alignItems: "center",     // center vertically (optional)
    marginBottom: "1.5rem",
  }}
>
  <button
    onClick={handleShare}
    style={{
      background: shareHover
        ? "linear-gradient(135deg, #3b82f6, #2563eb)"
        : "linear-gradient(135deg, #60a5fa, #3b82f6)",
      color: "white",
      border: "none",
      borderRadius: "12px",
      padding: "0.75rem 1.5rem",  // smaller size
      fontWeight: "600",
      cursor: "pointer",
      fontSize: "1rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
      width: "auto",   // ✅ shrink to fit content
      minWidth: "180px", // ✅ optional fixed min size
    }}
    onMouseEnter={(e) => {
      setShareHover(true);
      e.target.style.transform = "translateY(-2px)";
      e.target.style.boxShadow = "0 6px 15px rgba(59, 130, 246, 0.5)";
    }}
    onMouseLeave={(e) => {
      setShareHover(false);
      e.target.style.transform = "translateY(0)";
      e.target.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.4)";
    }}
  >
    <Share2 size={18} /> Share Results
  </button>
</div>

          <div style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexDirection: isMobile ? "column" : "row"
          }}>
            <button
              onClick={() => setShowReview(true)}
              style={{
                background: "linear-gradient(135deg, #7e57c2, #5e35b1)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: "1rem 1.5rem",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "1rem",
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(126, 87, 194, 0.4)"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 15px rgba(126, 87, 194, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(126, 87, 194, 0.4)";
              }}
            >
              <BarChart3 size={18} /> Review Answers
            </button>
            
            <button
              onClick={handleGoToNextSubtopic}
              style={{
                background: "transparent",
                color: "#7e57c2",
                border: "2px solid #7e57c2",
                borderRadius: "12px",
                padding: "1rem 1.5rem",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "1rem",
                flex: 1,
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#7e57c2";
                e.target.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "#7e57c2";
              }}
            >
              {nextSubtopic ? "Next Subtopic" : "Practice Another Topic"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Page
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",
      fontFamily: "'Inter', sans-serif",
      padding: isMobile ? "5rem 1rem 2rem 1rem" : "6rem 2rem 2rem 2rem",
    }}>
      <div style={{
        maxWidth: "800px",
        margin: "0 auto"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "flex-start",
          marginBottom: "1.5rem"
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "transparent",
              border: "1px solid #7e57c2",
              color: "#7e57c2",
              borderRadius: "6px",
              padding: "8px 16px",
              cursor: "pointer",
              fontWeight: 600,
              marginTop:"3rem",
            }}
          >
            <ArrowLeft size={18} /> Back
          </button>
        </div>

        {/* Header */}
        <div style={{
          textAlign: "center",
          marginBottom: "2rem"
        }}>
          <h2 style={{
            fontSize: isMobile ? "1.5rem" : "1.8rem",
            color: "#4527a0",
            fontWeight: 700,
            marginBottom: "0.5rem"
          }}>
            {subtopic} Practice
          </h2>
          <p style={{
            color: "#616161",
            marginBottom: "1rem"
          }}>
            {subjectName} • {chapter}
          </p>
        </div>

        {/* Timer and Progress */}
        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2rem",
          background: "white",
          borderRadius: "12px",
          padding: "1.5rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: timeLeft <= 60 ? "#d32f2f" : "#7e57c2",
            fontWeight: 600
          }}>
            <Clock size={20} />
            <span>Time Left: {formatTime(timeLeft)}</span>
            {timeLeft <= 60 && <span style={{fontSize: "0.9rem"}}>⏰ Hurry!</span>}
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.8rem"
          }}>
            <span style={{fontSize: "0.9rem", color: "#616161"}}>
              Question {currentQuestion + 1} of {mcqs.length}
            </span>
            <div style={{
              width: "100px",
              height: "8px",
              background: "#e0e0e0",
              borderRadius: "4px",
              overflow: "hidden"
            }}>
              <div style={{
                width: `${((currentQuestion + 1) / mcqs.length) * 100}%`,
                height: "100%",
                background: "linear-gradient(90deg, #7e57c2, #5e35b1)",
                borderRadius: "4px",
                transition: "width 0.3s ease"
              }}></div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "2rem",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          marginBottom: "2rem"
        }}>
          <h3 style={{
            fontSize: "1.2rem",
            fontWeight: 600,
            color: "#37474f",
            marginBottom: "1.5rem",
            lineHeight: "1.5"
          }}>
            Q{currentQuestion + 1}. {currentQ.question}
          </h3>
          
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.8rem"
          }}>
            {currentQ.options.map((opt) => (
              <label
                key={opt}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "1rem",
                  borderRadius: "10px",
                  border: answers[currentQuestion] === opt ? "2px solid #7e57c2" : "1px solid #e0e0e0",
                  background: answers[currentQuestion] === opt ? "#f3e5f5" : "#fafafa",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <input
                  type="radio"
                  name={`q-${currentQuestion}`}
                  value={opt}
                  checked={answers[currentQuestion] === opt}
                  onChange={() => handleOptionChange(opt)}
                  style={{ marginRight: "0.8rem" }}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem"
        }}>
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            style={{
              padding: "1rem 1.5rem",
              background: currentQuestion === 0 ? "#e0e0e0" : "linear-gradient(135deg, #bdbdbd, #9e9e9e)",
              color: currentQuestion === 0 ? "#9e9e9e" : "white",
              border: "none",
              borderRadius: "10px",
              cursor: currentQuestion === 0 ? "not-allowed" : "pointer",
              fontWeight: 600,
              flex: 1,
              transition: "all 0.2s ease"
            }}
          >
            ← Previous
          </button>
          
          {currentQuestion < mcqs.length - 1 ? (
            <button
              onClick={handleNext}
              style={{
                padding: "1rem 1.5rem",
                background: "linear-gradient(135deg, #7e57c2, #5e35b1)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: 600,
                flex: 2,
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 4px 10px rgba(126, 87, 194, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              Next Question →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              style={{
                padding: "1rem 1.5rem",
                background: "linear-gradient(135deg, #66bb6a, #43a047)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: 600,
                flex: 2,
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 4px 10px rgba(76, 175, 80, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              Submit Practice Test
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeQuestionsPage;