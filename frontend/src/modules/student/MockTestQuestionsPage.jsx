// // MAIN FUNCTIONALITIES:

// // 1. MOCK TEST SYSTEM
// // - Dynamic question generation based on subject/topic
// // - Multiple question sets for different subjects (Math, Science, History, English, General)
// // - Timer-based test with 5-minute countdown

// // 2. TEST FLOW MANAGEMENT
// // - Instructions screen with acceptance checkbox
// // - Question navigation (previous/next)
// // - Answer selection and tracking
// // - Auto-submit when time expires

// // 3. RESULTS & ANALYTICS
// // - Score calculation and percentage
// // - Performance categorization (Outstanding, Excellent, Good, etc.)
// // - Detailed breakdown: correct/wrong/skipped answers
// // - Time taken analysis

// // 4. ANSWER REVIEW SYSTEM
// // - Comprehensive review of all questions
// // - Shows correct answers with explanations
// // - Highlights user's answers (correct/wrong/skipped)
// // - Detailed explanations for each question

// // 5. SHARING & SOCIAL FEATURES
// // - Share results via Web Share API or clipboard fallback
// // - Performance-based messaging and icons
// // - Visual score representation with circular progress

// // 6. RESPONSIVE DESIGN
// // - Mobile and desktop layouts
// // - Adaptive styling based on screen size
// // - Touch-friendly interface

// // 7. SUBJECT-SPECIFIC CONTENT
// // - Math: Algebra, geometry, calculations
// // - Science: Physics, chemistry, biology
// // - History: Dates, events, civilizations
// // - English: Grammar, literature, spelling
// // - General Knowledge: Geography, current affairs

// // DATA FLOW:
// // Subject Selection → Instructions → Question Display → Answer Tracking → 
// // Results Calculation → Review/Share Options


// import { useState, useEffect } from "react"
// import { useLocation, useNavigate } from "react-router-dom"
// import { ArrowLeft, Clock, CheckCircle, XCircle, HelpCircle, Award, BarChart3, Share2 } from "lucide-react"

// const NAVBAR_HEIGHT_DESKTOP = 70  // adjust if your navbar is taller
// const NAVBAR_HEIGHT_MOBILE = 90   // adjust if your navbar is taller on mobile

// const MockTestQuestionsPage = () => {
//   const location = useLocation()
//   const navigate = useNavigate()
//   const { subjectName, grade, chapterName, subtopic } = location.state || {}

//   const [showInstructions, setShowInstructions] = useState(true)
//   const [acceptedInstructions, setAcceptedInstructions] = useState(false)
//   const [answers, setAnswers] = useState({})
//   const [currentQuestion, setCurrentQuestion] = useState(0)
//   const [timeLeft, setTimeLeft] = useState(300) // 5 min timer
//   const [showResults, setShowResults] = useState(false)
//   const [showReview, setShowReview] = useState(false)
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
//   const [shareHover, setShareHover] = useState(false)

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768)
//     window.addEventListener("resize", handleResize)
//     return () => window.removeEventListener("resize", handleResize)
//   }, [])

//   // Question sets for subjects
//   const generateMCQs = (title) => {
//     if (title.toLowerCase().includes("math") || title.toLowerCase().includes("algebra")) {
//       return [
//         {
//           question: "What is the value of π (pi) rounded to two decimal places?",
//           options: ["3.14", "3.15", "3.16", "3.17"],
//           correct: "3.14",
//           explanation: "π (pi) is approximately 3.14159, which rounds to 3.14 when rounded to two decimal places.",
//         },
//         {
//           question: "Solve for x: 2x + 5 = 15",
//           options: ["x = 5", "x = 7", "x = 10", "x = 12"],
//           correct: "x = 5",
//           explanation: "Subtract 5 from both sides: 2x = 10. Then divide both sides by 2: x = 5.",
//         },
//         {
//           question: "What is the area of a circle with radius 5 units?",
//           options: ["25π", "10π", "5π", "50π"],
//           correct: "25π",
//           explanation: "The area of a circle is calculated using the formula A = πr². With r = 5, A = π(5)² = 25π.",
//         },
//         {
//           question: "Which of these is a prime number?",
//           options: ["21", "29", "33", "39"],
//           correct: "29",
//           explanation: "29 is only divisible by 1 and itself, making it a prime number.",
//         },
//         {
//           question: "What is the square root of 144?",
//           options: ["12", "14", "16", "18"],
//           correct: "12",
//           explanation: "12 × 12 = 144, so the square root of 144 is 12.",
//         },
//       ]
//     } else if (title.toLowerCase().includes("science") || title.toLowerCase().includes("physics")) {
//       return [
//         {
//           question: "What is the chemical symbol for gold?",
//           options: ["Go", "Gd", "Au", "Ag"],
//           correct: "Au",
//           explanation: "The chemical symbol for gold is Au, derived from the Latin word 'aurum' meaning gold.",
//         },
//         {
//           question: "Which planet is known as the Red Planet?",
//           options: ["Venus", "Mars", "Jupiter", "Saturn"],
//           correct: "Mars",
//           explanation: "Mars is called the Red Planet due to its reddish appearance caused by iron oxide (rust) on its surface.",
//         },
//         {
//           question: "What is the smallest unit of life?",
//           options: ["Atom", "Cell", "Molecule", "Tissue"],
//           correct: "Cell",
//           explanation: "The cell is the basic structural and functional unit of all living organisms.",
//         },
//         {
//           question: "Which gas do plants absorb from the atmosphere?",
//           options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
//           correct: "Carbon Dioxide",
//           explanation: "Plants absorb carbon dioxide during photosynthesis to produce glucose and oxygen.",
//         },
//         {
//           question: "What is the hardest natural substance on Earth?",
//           options: ["Gold", "Iron", "Diamond", "Platinum"],
//           correct: "Diamond",
//           explanation: "Diamond is the hardest known natural material, scoring 10 on the Mohs scale of mineral hardness.",
//         },
//       ]
//     } else if (title.toLowerCase().includes("history") || title.toLowerCase().includes("social")) {
//       return [
//         {
//           question: "In which year did World War II end?",
//           options: ["1943", "1945", "1947", "1950"],
//           correct: "1945",
//           explanation: "World War II ended in 1945 with the surrender of Germany in May and Japan in September.",
//         },
//         {
//           question: "Who was the first President of the United States?",
//           options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
//           correct: "George Washington",
//           explanation: "George Washington was unanimously elected as the first President of the United States and served from 1789 to 1797.",
//         },
//         {
//           question: "The ancient Egyptian writing system is called:",
//           options: ["Cuneiform", "Hieroglyphics", "Sanskrit", "Latin"],
//           correct: "Hieroglyphics",
//           explanation: "Hieroglyphics was the formal writing system used in Ancient Egypt, combining logographic, syllabic and alphabetic elements.",
//         },
//         {
//           question: "Which civilization built the Machu Picchu?",
//           options: ["Aztec", "Maya", "Inca", "Olmec"],
//           correct: "Inca",
//           explanation: "Machu Picchu was built by the Inca civilization in the 15th century, located in modern-day Peru.",
//         },
//         {
//           question: "The Magna Carta was signed in which year?",
//           options: ["1066", "1215", "1453", "1776"],
//           correct: "1215",
//           explanation: "The Magna Carta was signed by King John of England in 1215, establishing the principle that everyone, including the king, was subject to the law.",
//         },
//       ]
//     } else if (title.toLowerCase().includes("english") || title.toLowerCase().includes("grammar")) {
//       return [
//         {
//           question: "Which of these is a proper noun?",
//           options: ["city", "london", "country", "river"],
//           correct: "london",
//           explanation: "Proper nouns refer to specific people, places, or things and are capitalized. London is a specific city.",
//         },
//         {
//           question: "What is the past tense of 'bring'?",
//           options: ["brang", "brought", "bringed", "brung"],
//           correct: "brought",
//           explanation: "The correct past tense of 'bring' is 'brought'.",
//         },
//         {
//           question: "Which sentence is correctly punctuated?",
//           options: [
//             "I went to the store, and bought apples.",
//             "I went to the store and bought apples.",
//             "I went to the store, and, bought apples.",
//             "I went to the store and, bought apples."
//           ],
//           correct: "I went to the store and bought apples.",
//           explanation: "When connecting two independent clauses with a conjunction, use a comma. But here 'bought apples' is not an independent clause, so no comma is needed.",
//         },
//         {
//           question: "What is the literary term for giving human qualities to non-human things?",
//           options: ["Metaphor", "Simile", "Personification", "Hyperbole"],
//           correct: "Personification",
//           explanation: "Personification is the attribution of human characteristics to something non-human.",
//         },
//         {
//           question: "Which word is spelled correctly?",
//           options: ["Recieve", "Receive", "Receeve", "Resieve"],
//           correct: "Receive",
//           explanation: "'Receive' follows the 'i before e except after c' rule.",
//         },
//       ]
//     } else {
//       // General knowledge questions
//       return [
//         {
//           question: "What is the capital of Japan?",
//           options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
//           correct: "Tokyo",
//           explanation: "Tokyo is the capital and largest city of Japan, located on the island of Honshu.",
//         },
//         {
//           question: "How many elements are in the periodic table?",
//           options: ["108", "118", "128", "138"],
//           correct: "118",
//           explanation: "As of 2023, there are 118 confirmed elements in the periodic table.",
//         },
//         {
//           question: "Which ocean is the largest?",
//           options: ["Atlantic", "Indian", "Arctic", "Pacific"],
//           correct: "Pacific",
//           explanation: "The Pacific Ocean is the largest and deepest ocean, covering about 30% of the Earth's surface.",
//         },
//         {
//           question: "Who painted the Mona Lisa?",
//           options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
//           correct: "Leonardo da Vinci",
//           explanation: "Leonardo da Vinci painted the Mona Lisa between 1503 and 1506, during the Renaissance period.",
//         },
//         {
//           question: "What is the currency of the United Kingdom?",
//           options: ["Euro", "Dollar", "Pound", "Yen"],
//           correct: "Pound",
//           explanation: "The currency of the United Kingdom is the Pound Sterling, denoted by the symbol £.",
//         },
//       ]
//     }
//   }

//   const mcqs = generateMCQs(subtopic || chapterName || subjectName || "General Knowledge")
//   const currentQ = mcqs[currentQuestion]

//   useEffect(() => {
//     if (showInstructions || showResults || showReview) return
//     if (timeLeft <= 0) {
//       handleSubmit()
//       return
//     }
//     const t = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
//     return () => clearInterval(t)
//   }, [timeLeft, showInstructions, showResults, showReview])

//   const handleOptionChange = (opt) => setAnswers((prev) => ({ ...prev, [currentQuestion]: opt }))
//   const handleNext = () => {
//     if (currentQuestion < mcqs.length - 1) setCurrentQuestion((p) => p + 1)
//   }
//   const handlePrev = () => {
//     if (currentQuestion > 0) setCurrentQuestion((p) => p - 1)
//   }
//   const handleSubmit = () => setShowResults(true)

//   const formatTime = (s) => {
//     const m = Math.floor(s / 60)
//     const sec = s % 60
//     return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
//   }

//   // Share functionality
//   const handleShare = async () => {
//     const shareData = {
//       title: "Mock Test Results",
//       text: `I scored ${scorePercent}% on my ${subtopic || chapterName} mock test!`,
//       url: window.location.href,
//     };

//     try {
//       if (navigator.share) {
//         await navigator.share(shareData);
//       } else {
//         // Fallback for browsers that don't support the Web Share API
//         await navigator.clipboard.writeText(
//           `I scored ${scorePercent}% on my ${subtopic || chapterName} mock test!`
//         );
//         alert("Results copied to clipboard!");
//       }
//     } catch (err) {
//       console.error("Error sharing:", err);
//     }
//   };

//   const totalQuestions = mcqs.length
//   const correctAnswers = mcqs.filter((q, i) => answers[i] === q.correct).length
//   const wrongAnswers = mcqs.filter((q, i) => answers[i] && answers[i] !== q.correct).length
//   const skipped = mcqs.filter((_, i) => !answers[i]).length
//   const scorePercent = totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0

//   const getPerformanceMessage = () => {
//     if (scorePercent >= 90) return "Outstanding! 🎉"
//     if (scorePercent >= 80) return "Excellent Work! 👏"
//     if (scorePercent >= 70) return "Good Job! 👍"
//     if (scorePercent >= 60) return "Solid Effort! 💪"
//     if (scorePercent >= 50) return "Keep Practicing! 📚"
//     return "Let's Try Again! 🔄"
//   }

//   const getPerformanceColor = () => {
//     if (scorePercent >= 80) return "#10b981" // Green
//     if (scorePercent >= 60) return "#f59e0b" // Amber
//     return "#ef4444" // Red
//   }

//   const getPerformanceIcon = () => {
//     if (scorePercent >= 80) return <Award size={24} />
//     if (scorePercent >= 60) return <BarChart3 size={24} />
//     return <HelpCircle size={24} />
//   }

//   // Styles with sufficient top padding for fixed navbar
//   const styles = {
//     container: {
//       minHeight: "100vh",
//       background: "linear-gradient(180deg, #f0f8ff, #ffffff)",
//       fontFamily: "'Inter', sans-serif",
//       paddingTop: isMobile ? `${NAVBAR_HEIGHT_MOBILE + 20}px` : `${NAVBAR_HEIGHT_DESKTOP + 20}px`,
//       paddingBottom: "2rem",
//       paddingLeft: "1rem",
//       paddingRight: "1rem",
//     },
//     innerContainer: {
//       maxWidth: 700,
//       margin: "0 auto",
//     },
//     backWrapper: {
//       display: "flex",
//       justifyContent: "flex-start",
//       margin: "20px 0 32px",
//     },
//     backBtn: {
//       display: "flex",
//       alignItems: "center",
//       gap: "6px",
//       background: "transparent",
//       border: "1px solid #2563eb",
//       color: "#2563eb",
//       borderRadius: "6px",
//       padding: "6px 12px",
//       cursor: "pointer",
//       fontWeight: 600,
//     },
//     card: {
//       background: "#fff",
//       borderRadius: "12px",
//       padding: "2rem 2.5rem",
//       boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
//       marginBottom: "2rem",
//     },
//     button: {
//       background: "#2563eb",
//       color: "#fff",
//       border: "none",
//       borderRadius: "8px",
//       padding: "12px 24px",
//       fontWeight: 600,
//       cursor: "pointer",
//     },
//     disabledButton: {
//       background: "#cbd5e1",
//       color: "#fff",
//       border: "none",
//       borderRadius: "8px",
//       padding: "12px 24px",
//       fontWeight: 600,
//       cursor: "not-allowed",
//     },
//     reviewContainer: {
//       minHeight: "100vh",
//       background: "linear-gradient(180deg, #f0f8ff, #ffffff)",
//       fontFamily: "'Inter', sans-serif",
//       paddingTop: isMobile ? `${NAVBAR_HEIGHT_MOBILE + 20}px` : `${NAVBAR_HEIGHT_DESKTOP + 20}px`,
//       paddingBottom: "2rem",
//       paddingLeft: "1rem",
//       paddingRight: "1rem",
//     },
//     reviewCard: {
//       background: "#fff",
//       borderRadius: "12px",
//       padding: "1.5rem",
//       marginBottom: "1.5rem",
//       boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//       border: "1px solid #e2e8f0",
//     },
//     correctAnswer: {
//       borderLeft: "4px solid #10b981",
//       background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
//     },
//     wrongAnswer: {
//       borderLeft: "4px solid #ef4444",
//       background: "linear-gradient(135deg, #fef2f2, #fee2e2)",
//     },
//     skippedAnswer: {
//       borderLeft: "4px solid #64748b",
//       background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
//     },
//     questionNumber: {
//       fontSize: "0.875rem",
//       fontWeight: "600",
//       color: "#64748b",
//       marginBottom: "0.5rem",
//     },
//     questionText: {
//       fontSize: "1.1rem",
//       fontWeight: "600",
//       color: "#1e293b",
//       marginBottom: "1rem",
//       lineHeight: "1.5",
//     },
//     answerOption: {
//       padding: "0.75rem",
//       borderRadius: "8px",
//       marginBottom: "0.5rem",
//       fontSize: "0.95rem",
//     },
//     correctOption: {
//       background: "#dcfce7",
//       color: "#166534",
//       border: "1px solid #bbf7d0",
//     },
//     wrongOption: {
//       background: "#fee2e2",
//       color: "#991b1b",
//       border: "1px solid #fecaca",
//     },
//     userAnswer: {
//       fontWeight: "600",
//     },
//     explanation: {
//       background: "#f0f9ff",
//       border: "1px solid #bae6fd",
//       borderRadius: "8px",
//       padding: "1rem",
//       marginTop: "1rem",
//       fontSize: "0.9rem",
//       color: "#0369a1",
//       lineHeight: "1.5",
//     },
//   }

//   // REVIEW SECTION
//   if (showReview) {
//     return (
//       <div style={styles.reviewContainer}>
//         <div style={styles.innerContainer}>
//           <div style={styles.backWrapper}>
//             <button onClick={() => setShowReview(false)} style={styles.backBtn}>
//               <ArrowLeft size={18} /> Back to Results
//             </button>
//           </div>
//           <h2
//             style={{
//               textAlign: "center",
//               color: "#2563eb",
//               marginBottom: "2rem",
//               fontSize: isMobile ? "1.5rem" : "2rem",
//             }}
//           >
//             Answer Review
//           </h2>
//           {mcqs.map((question, index) => {
//             const userAnswer = answers[index]
//             const isCorrect = userAnswer === question.correct
//             const isSkipped = !userAnswer
//             let cardStyle = { ...styles.reviewCard }
//             if (isCorrect) cardStyle = { ...cardStyle, ...styles.correctAnswer }
//             else if (isSkipped) cardStyle = { ...cardStyle, ...styles.skippedAnswer }
//             else cardStyle = { ...cardStyle, ...styles.wrongAnswer }
//             return (
//               <div key={index} style={cardStyle}>
//                 <div style={styles.questionNumber}>
//                   Question {index + 1} • {isCorrect ? "Correct ✓" : isSkipped ? "Skipped" : "Wrong ✗"}
//                 </div>
//                 <div style={styles.questionText}>{question.question}</div>
//                 <div style={{ marginBottom: "1rem" }}>
//                   {question.options.map((option, optIndex) => {
//                     let optionStyle = { ...styles.answerOption }
//                     if (option === question.correct) {
//                       optionStyle = { ...optionStyle, ...styles.correctOption }
//                     } else if (option === userAnswer && !isCorrect) {
//                       optionStyle = { ...optionStyle, ...styles.wrongOption }
//                     } else {
//                       optionStyle = { ...optionStyle, background: "#f8fafc", border: "1px solid #e2e8f0" }
//                     }
//                     return (
//                       <div key={optIndex} style={optionStyle}>
//                         {option === question.correct && "✓ "}
//                         {option === userAnswer && option !== question.correct && "✗ "}
//                         {option}
//                         {option === userAnswer && <span style={styles.userAnswer}> (Your Answer)</span>}
//                       </div>
//                     )
//                   })}
//                 </div>
//                 <div style={styles.explanation}>
//                   <strong>Explanation:</strong> {question.explanation}
//                 </div>
//               </div>
//             )
//           })}
//           <div style={{ textAlign: "center", marginTop: "2rem" }}>
//             <button onClick={() => navigate(-1)} style={styles.button}>
//               Back to Chapter
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // INSTRUCTIONS SECTION
//   if (showInstructions) {
//     return (
//       <div style={styles.container}>
//         <div style={styles.innerContainer}>
//           <div style={styles.backWrapper}>
//             <button onClick={() => navigate(-1)} style={styles.backBtn}>
//               <ArrowLeft size={18} /> Back to Chapters
//             </button>
//           </div>
//           <h2 style={{ textAlign: "center", color: "#2563eb", marginBottom: "1rem" }}>
//             Mock Test Instructions
//           </h2>
//           <div style={styles.card}>
//             <ul style={{ lineHeight: 1.8, color: "#1e293b" }}>
//               <li>You have 5 minutes to complete the test.</li>
//               <li>Do not switch tabs during the test.</li>
//               <li>Answer all questions carefully.</li>
//               <li>Once started, timer cannot be paused.</li>
//               <li>Review answers before submission.</li>
//             </ul>
//             <div style={{ marginTop: "1rem" }}>
//               <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                 <input
//                   type="checkbox"
//                   checked={acceptedInstructions}
//                   onChange={() => setAcceptedInstructions(!acceptedInstructions)}
//                 />
//                 I accept the instructions
//               </label>
//             </div>
//           </div>
//           <div style={{ textAlign: "center", marginTop: "2rem" }}>
//             <button
//               disabled={!acceptedInstructions}
//               onClick={() => setShowInstructions(false)}
//               style={acceptedInstructions ? styles.button : styles.disabledButton}
//             >
//               Start Test
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // RESULTS SECTION
//   if (showResults) {
//     return (
//       <div style={{
//         minHeight: "100vh",
//         background: "linear-gradient(135deg, #aff3e7ff 0%, #d1c6dbff 100%)",
//         fontFamily: "'Inter', sans-serif",
//         padding: isMobile ? "2rem 1rem" : "3rem 2rem",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center"
//       }}>
//         <div style={{
//           background: "white",
//           borderRadius: "20px",
//           padding: isMobile ? "2rem 1.5rem" : "3rem",
//           boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
//           maxWidth: "800px",
//           width: "100%",
//           position: "relative",
//           overflow: "hidden"
//         }}>
//           <div style={{
//             textAlign: "center",
//             marginBottom: "2rem",
//             paddingBottom: "1.5rem",
//             borderBottom: "1px solid #e2e8f0"
//           }}>
//             <div style={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               marginBottom: "1rem",
//               color: getPerformanceColor()
//             }}>
//               {getPerformanceIcon()}
//             </div>
//             <h1 style={{
//               fontSize: isMobile ? "1.5rem" : "2rem",
//               fontWeight: "700",
//               color: "#1e293b",
//               marginBottom: "0.5rem"
//             }}>
//               {getPerformanceMessage()}
//             </h1>
//             <p style={{
//               fontSize: "1rem",
//               color: "#64748b",
//               marginBottom: "1.5rem"
//             }}>
//               {subjectName} • {chapterName} • {subtopic}
//             </p>
//             <div style={{
//               width: isMobile ? "120px" : "150px",
//               height: isMobile ? "120px" : "150px",
//               borderRadius: "50%",
//               background: `conic-gradient(${getPerformanceColor()} ${scorePercent * 3.6}deg, #e5e7eb 0deg)`,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               margin: "0 auto",
//               position: "relative",
//               boxShadow: `0 10px 30px ${getPerformanceColor()}40`
//             }}>
//               <div style={{
//                 width: isMobile ? "90px" : "110px",
//                 height: isMobile ? "90px" : "110px",
//                 borderRadius: "50%",
//                 background: "#fff",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: isMobile ? "1.5rem" : "2rem",
//                 fontWeight: "700",
//                 color: "#1e293b"
//               }}>
//                 {scorePercent}%
//               </div>
//             </div>
//           </div>
//           <div style={{
//             display: "grid",
//             gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
//             gap: "1rem",
//             marginBottom: "2rem"
//           }}>
//             <div style={{
//               background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
//               borderRadius: "12px",
//               padding: "1.5rem 1rem",
//               textAlign: "center",
//               border: "1px solid #bbf7d0"
//             }}>
//               <CheckCircle size={24} color="#10b981" style={{ margin: "0 auto 0.5rem" }} />
//               <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#10b981", marginBottom: "0.25rem" }}>
//                 {correctAnswers}
//               </div>
//               <div style={{ fontSize: "0.875rem", color: "#64748b", fontWeight: "500" }}>Correct</div>
//             </div>
//             <div style={{
//               background: "linear-gradient(135deg, #fef2f2, #fee2e2)",
//               borderRadius: "12px",
//               padding: "1.5rem 1rem",
//               textAlign: "center",
//               border: "1px solid #fecaca"
//             }}>
//               <XCircle size={24} color="#ef4444" style={{ margin: "0 auto 0.5rem" }} />
//               <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#ef4444", marginBottom: "0.25rem" }}>
//                 {wrongAnswers}
//               </div>
//               <div style={{ fontSize: "0.875rem", color: "#64748b", fontWeight: "500" }}>Wrong</div>
//             </div>
//             <div style={{
//               background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
//               borderRadius: "12px",
//               padding: "1.5rem 1rem",
//               textAlign: "center",
//               border: "1px solid #e2e8f0"
//             }}>
//               <HelpCircle size={24} color="#64748b" style={{ margin: "0 auto 0.5rem" }} />
//               <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#64748b", marginBottom: "0.25rem" }}>
//                 {skipped}
//               </div>
//               <div style={{ fontSize: "0.875rem", color: "#64748b", fontWeight: "500" }}>Skipped</div>
//             </div>
//           </div>
//           <div style={{
//             background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
//             borderRadius: "12px",
//             padding: "1.25rem",
//             marginBottom: "2rem",
//             border: "1px solid #bae6fd",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: "0.75rem"
//           }}>
//             <Clock size={20} color="#0369a1" />
//             <div style={{ fontSize: "0.95rem", color: "#0369a1", fontWeight: "500" }}>
//               Time Taken: {formatTime(300 - timeLeft)} | Total Questions: {totalQuestions}
//             </div>
//           </div>
          
//           {/* Share Button */}
//           <div style={{
//         display: "flex",       // ✅ use flex instead of "center"
    
//     alignItems: "center",
//             gap: "1rem",
//             justifyContent: "center",
//             flexDirection: isMobile ? "column" : "row",
//             marginBottom: "1.5rem"
//           }}>
//             <button
//               onClick={handleShare}
//               style={{
//                 background: shareHover ? "linear-gradient(135deg, #3b82f6, #2563eb)" : "linear-gradient(135deg, #60a5fa, #3b82f6)",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "12px",
//                 padding: "1rem 1.5rem",
//                 fontWeight: "600",
//                 cursor: "pointer",
//                 fontSize: "1rem",
//                 flex: 1,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 gap: "0.5rem",
//                 transition: "all 0.3s ease",
//                 boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)"
//               }}
//               onMouseEnter={(e) => {
//                 setShareHover(true);
//                 e.target.style.transform = "translateY(-2px)";
//                 e.target.style.boxShadow = "0 6px 15px rgba(59, 130, 246, 0.5)";
//               }}
//               onMouseLeave={(e) => {
//                 setShareHover(false);
//                 e.target.style.transform = "translateY(0)";
//                 e.target.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.4)";
//               }}
//             >
//               <Share2 size={18} /> Share Results
//             </button>
//           </div>

//           <div style={{
//             display: "flex",
//             gap: "1rem",
//             flexDirection: isMobile ? "column" : "row"
//           }}>
//             <button
//               onClick={() => setShowReview(true)}
//               style={{
//                 background: "linear-gradient(135deg, #667eea, #764ba2)",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "12px",
//                 padding: "1rem 1.5rem",
//                 fontWeight: "600",
//                 cursor: "pointer",
//                 fontSize: "1rem",
//                 flex: 1,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 gap: "0.5rem",
//                 transition: "transform 0.2s ease, box-shadow 0.2s ease"
//               }}
//               onMouseEnter={e => {
//                 e.target.style.transform = "translateY(-2px)"
//                 e.target.style.boxShadow = "0 6px 12px rgba(102, 126, 234, 0.4)"
//               }}
//               onMouseLeave={e => {
//                 e.target.style.transform = "translateY(0)"
//                 e.target.style.boxShadow = "none"
//               }}
//             >
//               <BarChart3 size={18} /> Review Answers
//             </button>
//             <button
//               onClick={() => navigate(-1)}
//               style={{
//                 background: "transparent",
//                 color: "#667eea",
//                 border: "2px solid #667eea",
//                 borderRadius: "12px",
//                 padding: "1rem 1.5rem",
//                 fontWeight: "600",
//                 cursor: "pointer",
//                 fontSize: "1rem",
//                 flex: 1,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 gap: "0.5rem",
//                 transition: "all 0.2s ease"
//               }}
//               onMouseEnter={e => {
//                 e.target.style.background = "#667eea"
//                 e.target.style.color = "white"
//               }}
//               onMouseLeave={e => {
//                 e.target.style.background = "transparent"
//                 e.target.style.color = "#667eea"
//               }}
//             >
//               <ArrowLeft size={18} /> Back to Chapters
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // MAIN TEST PAGE
//   return (
//     <div style={styles.container}>
//       <div style={styles.innerContainer}>
//         <div
//           style={{
//             textAlign: "center",
//             marginBottom: "1.5rem",
//             marginTop: "0.5rem", // extra margin for safety
//             background: "#fff",
//             borderRadius: "12px",
//             padding: "1rem",
//             boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//             border: timeLeft <= 60 ? "2px solid #ef4444" : "1px solid #e2e8f0",
//             animation: timeLeft <= 30 ? "pulse 1s infinite" : "none",
//           }}
//         >
//           <div
//             style={{
//               fontSize: "1.2rem",
//               fontWeight: 600,
//               color: timeLeft <= 60 ? "#ef4444" : "#2563eb",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: "0.5rem",
//             }}
//           >
//             ⏱ Time Left: {formatTime(timeLeft)}
//             {timeLeft <= 60 && <span style={{ fontSize: "0.9rem" }}>⚠️ Hurry Up!</span>}
//           </div>
//         </div>
//         <div
//           style={{
//             background: "#fff",
//             borderRadius: "12px",
//             padding: "1rem",
//             marginBottom: "1.5rem",
//             boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               marginBottom: "0.5rem",
//             }}
//           >
//             <span style={{ fontSize: "0.875rem", color: "#64748b", fontWeight: "500" }}>
//               Question {currentQuestion + 1} of {mcqs.length}
//             </span>
//             <span style={{ fontSize: "0.875rem", color: "#2563eb", fontWeight: "600" }}>
//               {Math.round(((currentQuestion + 1) / mcqs.length) * 100)}% Complete
//             </span>
//           </div>
//           <div
//             style={{
//               height: "10px",
//               background: "#e2e8f0",
//               borderRadius: "8px",
//               overflow: "hidden",
//               position: "relative",
//             }}
//           >
//             <div
//               style={{
//                 width: `${((currentQuestion + 1) / mcqs.length) * 100}%`,
//                 height: "100%",
//                 background: "linear-gradient(90deg, #2563eb, #3b82f6)",
//                 borderRadius: "8px",
//                 transition: "width 0.3s ease",
//                 boxShadow: "0 2px 4px rgba(37, 99, 235, 0.3)",
//               }}
//             ></div>
//           </div>
//         </div>
//         <div style={styles.card}>
//           <h4 style={{ marginBottom: "1.5rem", fontSize: "1.2rem", lineHeight: "1.6" }}>
//             Q{currentQuestion + 1}. {currentQ.question}
//           </h4>
//           {currentQ.options.map((opt) => (
//             <label
//               key={opt}
//               style={{
//                 display: "block",
//                 marginBottom: "1rem",
//                 padding: "1rem",
//                 borderRadius: "12px",
//                 border: answers[currentQuestion] === opt ? "2px solid #2563eb" : "1px solid #e2e8f0",
//                 background: answers[currentQuestion] === opt ? "#dbeafe" : "#fff",
//                 cursor: "pointer",
//                 transition: "all 0.2s ease",
//               }}
//             >
//               <input
//                 type="radio"
//                 name={`q-${currentQuestion}`}
//                 value={opt}
//                 checked={answers[currentQuestion] === opt}
//                 onChange={() => handleOptionChange(opt)}
//                 style={{ marginRight: "0.75rem" }}
//               />
//               {opt}
//             </label>
//           ))}
//         </div>
//         <div
//           style={{ marginTop: "1.5rem", textAlign: "center", display: "flex", gap: "1rem", justifyContent: "center" }}
//         >
//           <button
//             onClick={handlePrev}
//             disabled={currentQuestion === 0}
//             style={currentQuestion === 0 ? styles.disabledButton : styles.button}
//           >
//             ← Previous
//           </button>
//           {currentQuestion < mcqs.length - 1 ? (
//             <button onClick={handleNext} style={styles.button}>
//               Next →
//             </button>
//           ) : (
//             <button onClick={handleSubmit} style={{ ...styles.button, background: "#16a34a" }}>
//               Submit Test
//             </button>
//           )}
//         </div>
//       </div>
//       <style jsx>{`
//         @keyframes pulse {
//           0%, 100% { transform: scale(1); }
//           50% { transform: scale(1.02); }
//         }
//       `}</style>
//     </div>
//   )
// }

// export default MockTestQuestionsPage









import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ArrowLeft, Clock, CheckCircle, XCircle, HelpCircle, Award, BarChart3, Share2 } from "lucide-react"

const NAVBAR_HEIGHT_DESKTOP = 70  // adjust if your navbar is taller
const NAVBAR_HEIGHT_MOBILE = 90   // adjust if your navbar is taller on mobile

const MockTestQuestionsPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { subjectName, grade, chapterName, subtopic } = location.state || {}

  const [showInstructions, setShowInstructions] = useState(true)
  const [acceptedInstructions, setAcceptedInstructions] = useState(false)
  const [answers, setAnswers] = useState({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeLeft, setTimeLeft] = useState(300) // 5 min timer
  const [showResults, setShowResults] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [shareHover, setShareHover] = useState(false)
  const [closeHover, setCloseHover] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Question sets for subjects
  const generateMCQs = (title) => {
    if (title.toLowerCase().includes("math") || title.toLowerCase().includes("algebra")) {
      return [
        {
          question: "What is the value of π (pi) rounded to two decimal places?",
          options: ["3.14", "3.15", "3.16", "3.17"],
          correct: "3.14",
          explanation: "π (pi) is approximately 3.14159, which rounds to 3.14 when rounded to two decimal places.",
        },
        {
          question: "Solve for x: 2x + 5 = 15",
          options: ["x = 5", "x = 7", "x = 10", "x = 12"],
          correct: "x = 5",
          explanation: "Subtract 5 from both sides: 2x = 10. Then divide both sides by 2: x = 5.",
        },
        {
          question: "What is the area of a circle with radius 5 units?",
          options: ["25π", "10π", "5π", "50π"],
          correct: "25π",
          explanation: "The area of a circle is calculated using the formula A = πr². With r = 5, A = π(5)² = 25π.",
        },
        {
          question: "Which of these is a prime number?",
          options: ["21", "29", "33", "39"],
          correct: "29",
          explanation: "29 is only divisible by 1 and itself, making it a prime number.",
        },
        {
          question: "What is the square root of 144?",
          options: ["12", "14", "16", "18"],
          correct: "12",
          explanation: "12 × 12 = 144, so the square root of 144 is 12.",
        },
      ]
    } else if (title.toLowerCase().includes("science") || title.toLowerCase().includes("physics")) {
      return [
        {
          question: "What is the chemical symbol for gold?",
          options: ["Go", "Gd", "Au", "Ag"],
          correct: "Au",
          explanation: "The chemical symbol for gold is Au, derived from the Latin word 'aurum' meaning gold.",
        },
        {
          question: "Which planet is known as the Red Planet?",
          options: ["Venus", "Mars", "Jupiter", "Saturn"],
          correct: "Mars",
          explanation: "Mars is called the Red Planet due to its reddish appearance caused by iron oxide (rust) on its surface.",
        },
        {
          question: "What is the smallest unit of life?",
          options: ["Atom", "Cell", "Molecule", "Tissue"],
          correct: "Cell",
          explanation: "The cell is the basic structural and functional unit of all living organisms.",
        },
        {
          question: "Which gas do plants absorb from the atmosphere?",
          options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
          correct: "Carbon Dioxide",
          explanation: "Plants absorb carbon dioxide during photosynthesis to produce glucose and oxygen.",
        },
        {
          question: "What is the hardest natural substance on Earth?",
          options: ["Gold", "Iron", "Diamond", "Platinum"],
          correct: "Diamond",
          explanation: "Diamond is the hardest known natural material, scoring 10 on the Mohs scale of mineral hardness.",
        },
      ]
    } else if (title.toLowerCase().includes("history") || title.toLowerCase().includes("social")) {
      return [
        {
          question: "In which year did World War II end?",
          options: ["1943", "1945", "1947", "1950"],
          correct: "1945",
          explanation: "World War II ended in 1945 with the surrender of Germany in May and Japan in September.",
        },
        {
          question: "Who was the first President of the United States?",
          options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
          correct: "George Washington",
          explanation: "George Washington was unanimously elected as the first President of the United States and served from 1789 to 1797.",
        },
        {
          question: "The ancient Egyptian writing system is called:",
          options: ["Cuneiform", "Hieroglyphics", "Sanskrit", "Latin"],
          correct: "Hieroglyphics",
          explanation: "Hieroglyphics was the formal writing system used in Ancient Egypt, combining logographic, syllabic and alphabetic elements.",
        },
        {
          question: "Which civilization built the Machu Picchu?",
          options: ["Aztec", "Maya", "Inca", "Olmec"],
          correct: "Inca",
          explanation: "Machu Picchu was built by the Inca civilization in the 15th century, located in modern-day Peru.",
        },
        {
          question: "The Magna Carta was signed in which year?",
          options: ["1066", "1215", "1453", "1776"],
          correct: "1215",
          explanation: "The Magna Carta was signed by King John of England in 1215, establishing the principle that everyone, including the king, was subject to the law.",
        },
      ]
    } else if (title.toLowerCase().includes("english") || title.toLowerCase().includes("grammar")) {
      return [
        {
          question: "Which of these is a proper noun?",
          options: ["city", "london", "country", "river"],
          correct: "london",
          explanation: "Proper nouns refer to specific people, places, or things and are capitalized. London is a specific city.",
        },
        {
          question: "What is the past tense of 'bring'?",
          options: ["brang", "brought", "bringed", "brung"],
          correct: "brought",
          explanation: "The correct past tense of 'bring' is 'brought'.",
        },
        {
          question: "Which sentence is correctly punctuated?",
          options: [
            "I went to the store, and bought apples.",
            "I went to the store and bought apples.",
            "I went to the store, and, bought apples.",
            "I went to the store and, bought apples."
          ],
          correct: "I went to the store and bought apples.",
          explanation: "When connecting two independent clauses with a conjunction, use a comma. But here 'bought apples' is not an independent clause, so no comma is needed.",
        },
        {
          question: "What is the literary term for giving human qualities to non-human things?",
          options: ["Metaphor", "Simile", "Personification", "Hyperbole"],
          correct: "Personification",
          explanation: "Personification is the attribution of human characteristics to something non-human.",
        },
        {
          question: "Which word is spelled correctly?",
          options: ["Recieve", "Receive", "Receeve", "Resieve"],
          correct: "Receive",
          explanation: "'Receive' follows the 'i before e except after c' rule.",
        },
      ]
    } else {
      // General knowledge questions
      return [
        {
          question: "What is the capital of Japan?",
          options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
          correct: "Tokyo",
          explanation: "Tokyo is the capital and largest city of Japan, located on the island of Honshu.",
        },
        {
          question: "How many elements are in the periodic table?",
          options: ["108", "118", "128", "138"],
          correct: "118",
          explanation: "As of 2023, there are 118 confirmed elements in the periodic table.",
        },
        {
          question: "Which ocean is the largest?",
          options: ["Atlantic", "Indian", "Arctic", "Pacific"],
          correct: "Pacific",
          explanation: "The Pacific Ocean is the largest and deepest ocean, covering about 30% of the Earth's surface.",
        },
        {
          question: "Who painted the Mona Lisa?",
          options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
          correct: "Leonardo da Vinci",
          explanation: "Leonardo da Vinci painted the Mona Lisa between 1503 and 1506, during the Renaissance period.",
        },
        {
          question: "What is the currency of the United Kingdom?",
          options: ["Euro", "Dollar", "Pound", "Yen"],
          correct: "Pound",
          explanation: "The currency of the United Kingdom is the Pound Sterling, denoted by the symbol £.",
        },
      ]
    }
  }

  const mcqs = generateMCQs(subtopic || chapterName || subjectName || "General Knowledge")
  const currentQ = mcqs[currentQuestion]

  useEffect(() => {
    if (showInstructions || showResults || showReview) return
    if (timeLeft <= 0) {
      handleSubmit()
      return
    }
    const t = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
    return () => clearInterval(t)
  }, [timeLeft, showInstructions, showResults, showReview])

  const handleOptionChange = (opt) => setAnswers((prev) => ({ ...prev, [currentQuestion]: opt }))
  const handleNext = () => {
    if (currentQuestion < mcqs.length - 1) setCurrentQuestion((p) => p + 1)
  }
  const handlePrev = () => {
    if (currentQuestion > 0) setCurrentQuestion((p) => p - 1)
  }
  const handleSubmit = () => setShowResults(true)

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
  }

  // Share functionality
  const handleShare = async () => {
    const shareData = {
      title: "Mock Test Results",
      text: `I scored ${scorePercent}% on my ${subtopic || chapterName} mock test!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support the Web Share API
        await navigator.clipboard.writeText(
          `I scored ${scorePercent}% on my ${subtopic || chapterName} mock test!`
        );
        alert("Results copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const totalQuestions = mcqs.length
  const correctAnswers = mcqs.filter((q, i) => answers[i] === q.correct).length
  const wrongAnswers = mcqs.filter((q, i) => answers[i] && answers[i] !== q.correct).length
  const skipped = mcqs.filter((_, i) => !answers[i]).length
  const scorePercent = totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0

  const getPerformanceMessage = () => {
    if (scorePercent >= 90) return "Outstanding! 🎉"
    if (scorePercent >= 80) return "Excellent Work! 👏"
    if (scorePercent >= 70) return "Good Job! 👍"
    if (scorePercent >= 60) return "Solid Effort! 💪"
    if (scorePercent >= 50) return "Keep Practicing! 📚"
    return "Let's Try Again! 🔄"
  }

  const getPerformanceColor = () => {
    if (scorePercent >= 80) return "#10b981" // Green
    if (scorePercent >= 60) return "#f59e0b" // Amber
    return "#ef4444" // Red
  }

  const getPerformanceIcon = () => {
    if (scorePercent >= 80) return <Award size={24} />
    if (scorePercent >= 60) return <BarChart3 size={24} />
    return <HelpCircle size={24} />
  }

  // Styles with sufficient top padding for fixed navbar
  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(180deg, #f0f8ff, #ffffff)",
      fontFamily: "'Inter', sans-serif",
      paddingTop: isMobile ? `${NAVBAR_HEIGHT_MOBILE + 20}px` : `${NAVBAR_HEIGHT_DESKTOP + 20}px`,
      paddingBottom: "2rem",
      paddingLeft: "1rem",
      paddingRight: "1rem",
    },
    innerContainer: {
      maxWidth: 700,
      margin: "0 auto",
    },
    backWrapper: {
      display: "flex",
      justifyContent: "flex-start",
      margin: "20px 0 32px",
    },
    backBtn: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      background: "transparent",
      border: "1px solid #2563eb",
      color: "#2563eb",
      borderRadius: "6px",
      padding: "6px 12px",
      cursor: "pointer",
      fontWeight: 600,
    },
    card: {
      background: "#fff",
      borderRadius: "12px",
      padding: "2rem 2.5rem",
      boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
      marginBottom: "2rem",
    },
    button: {
      background: "#2563eb",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      padding: "12px 24px",
      fontWeight: 600,
      cursor: "pointer",
    },
    disabledButton: {
      background: "#cbd5e1",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      padding: "12px 24px",
      fontWeight: 600,
      cursor: "not-allowed",
    },
    reviewContainer: {
      minHeight: "100vh",
      background: "linear-gradient(180deg, #f0f8ff, #ffffff)",
      fontFamily: "'Inter', sans-serif",
      paddingTop: isMobile ? `${NAVBAR_HEIGHT_MOBILE + 20}px` : `${NAVBAR_HEIGHT_DESKTOP + 20}px`,
      paddingBottom: "2rem",
      paddingLeft: "1rem",
      paddingRight: "1rem",
    },
    reviewCard: {
      background: "#fff",
      borderRadius: "12px",
      padding: "1.5rem",
      marginBottom: "1.5rem",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      border: "1px solid #e2e8f0",
    },
    correctAnswer: {
      borderLeft: "4px solid #10b981",
      background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
    },
    wrongAnswer: {
      borderLeft: "4px solid #ef4444",
      background: "linear-gradient(135deg, #fef2f2, #fee2e2)",
    },
    skippedAnswer: {
      borderLeft: "4px solid #64748b",
      background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
    },
    questionNumber: {
      fontSize: "0.875rem",
      fontWeight: "600",
      color: "#64748b",
      marginBottom: "0.5rem",
    },
    questionText: {
      fontSize: "1.1rem",
      fontWeight: "600",
      color: "#1e293b",
      marginBottom: "1rem",
      lineHeight: "1.5",
    },
    answerOption: {
      padding: "0.75rem",
      borderRadius: "8px",
      marginBottom: "0.5rem",
      fontSize: "0.95rem",
    },
    correctOption: {
      background: "#dcfce7",
      color: "#166534",
      border: "1px solid #bbf7d0",
    },
    wrongOption: {
      background: "#fee2e2",
      color: "#991b1b",
      border: "1px solid #fecaca",
    },
    userAnswer: {
      fontWeight: "600",
    },
    explanation: {
      background: "#f0f9ff",
      border: "1px solid #bae6fd",
      borderRadius: "8px",
      padding: "1rem",
      marginTop: "1rem",
      fontSize: "0.9rem",
      color: "#0369a1",
      lineHeight: "1.5",
    },
    // NEW STYLES FOR FIXED POPUP
    popupOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999,
      padding: '1rem'
    },
    reviewPopup: {
      position: 'fixed',
      top: '5%',
      left: '5%',
      right: '5%',
      bottom: '5%',
      background: '#fff',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      zIndex: 1000,
      overflow: 'auto'
    },
    closePopup: {
      position: 'fixed',
      top: '6%',
      right: '6%',
      background: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      fontSize: '1.5rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1002,
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      transition: 'all 0.3s ease'
    },
    closePopupHover: {
      background: '#dc2626',
      transform: 'scale(1.1)'
    },
    popupHeader: {
      position: 'sticky',
      top: 0,
      background: '#fff',
      padding: '1rem 0',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1001
    }
  }
// REVIEW SECTION
if (showReview) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999,
      padding: '1rem'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        zIndex: 1000,
        maxHeight: '80vh',
        width: '90%',
        maxWidth: '800px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* FIXED HEADER WITH CLOSE BUTTON */}
        <div style={{
          position: 'sticky',
          top: 0,
          background: '#fff',
          padding: '1.5rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 1001
        }}>
          <h2 style={{ 
            margin: 0, 
            color: '#2563eb',
            fontSize: isMobile ? '1.5rem' : '2rem'
          }}>
            Answer Review
          </h2>
          <button 
            onClick={() => setShowReview(false)} 
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '1.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#dc2626';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#ef4444';
              e.target.style.transform = 'scale(1)';
            }}
          >
            ×
          </button>
        </div>
        
        {/* SCROLLABLE CONTENT */}
        <div style={{ 
          flex: 1,
          overflow: 'auto',
          padding: '0 1.5rem 1.5rem 1.5rem'
        }}>
          {mcqs.map((question, index) => {
            const userAnswer = answers[index]
            const isCorrect = userAnswer === question.correct
            const isSkipped = !userAnswer
            let cardStyle = { ...styles.reviewCard }
            if (isCorrect) cardStyle = { ...cardStyle, ...styles.correctAnswer }
            else if (isSkipped) cardStyle = { ...cardStyle, ...styles.skippedAnswer }
            else cardStyle = { ...cardStyle, ...styles.wrongAnswer }
            return (
              <div key={index} style={cardStyle}>
                <div style={styles.questionNumber}>
                  Question {index + 1} • {isCorrect ? "Correct ✓" : isSkipped ? "Skipped" : "Wrong ✗"}
                </div>
                <div style={styles.questionText}>{question.question}</div>
                <div style={{ marginBottom: "1rem" }}>
                  {question.options.map((option, optIndex) => {
                    let optionStyle = { ...styles.answerOption }
                    if (option === question.correct) {
                      optionStyle = { ...optionStyle, ...styles.correctOption }
                    } else if (option === userAnswer && !isCorrect) {
                      optionStyle = { ...optionStyle, ...styles.wrongOption }
                    } else {
                      optionStyle = { ...optionStyle, background: "#f8fafc", border: "1px solid #e2e8f0" }
                    }
                    return (
                      <div key={optIndex} style={optionStyle}>
                        {option === question.correct && "✓ "}
                        {option === userAnswer && option !== question.correct && "✗ "}
                        {option}
                        {option === userAnswer && <span style={styles.userAnswer}> (Your Answer)</span>}
                      </div>
                    )
                  })}
                </div>
                <div style={styles.explanation}>
                  <strong>Explanation:</strong> {question.explanation}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
  // // REVIEW SECTION
  // if (showReview) {
  //   return (
  //     <div style={styles.reviewContainer}>
  //       <div style={styles.popupOverlay}>
  //         <div style={styles.reviewPopup}>
  //           <div style={styles.popupHeader}>
  //             <h2 style={{ 
  //               margin: 0, 
  //               color: '#2563eb',
  //               fontSize: isMobile ? '1.5rem' : '2rem'
  //             }}>
  //               Answer Review
  //             </h2>
  //           </div>
            
  //           {/* FIXED CLOSE BUTTON */}
  //           <button 
  //             onClick={() => setShowReview(false)} 
  //             style={{
  //               ...styles.closePopup,
  //               ...(closeHover && styles.closePopupHover)
  //             }}
  //             onMouseEnter={() => setCloseHover(true)}
  //             onMouseLeave={() => setCloseHover(false)}
  //           >
  //             ×
  //           </button>
            
  //           <div style={{ 
  //             marginTop: '1rem',
  //             maxHeight: 'calc(80vh - 120px)',
  //             overflow: 'auto',
  //             padding: '0 0.5rem'
  //           }}>
  //             {mcqs.map((question, index) => {
  //               const userAnswer = answers[index]
  //               const isCorrect = userAnswer === question.correct
  //               const isSkipped = !userAnswer
  //               let cardStyle = { ...styles.reviewCard }
  //               if (isCorrect) cardStyle = { ...cardStyle, ...styles.correctAnswer }
  //               else if (isSkipped) cardStyle = { ...cardStyle, ...styles.skippedAnswer }
  //               else cardStyle = { ...cardStyle, ...styles.wrongAnswer }
  //               return (
  //                 <div key={index} style={cardStyle}>
  //                   <div style={styles.questionNumber}>
  //                     Question {index + 1} • {isCorrect ? "Correct ✓" : isSkipped ? "Skipped" : "Wrong ✗"}
  //                   </div>
  //                   <div style={styles.questionText}>{question.question}</div>
  //                   <div style={{ marginBottom: "1rem" }}>
  //                     {question.options.map((option, optIndex) => {
  //                       let optionStyle = { ...styles.answerOption }
  //                       if (option === question.correct) {
  //                         optionStyle = { ...optionStyle, ...styles.correctOption }
  //                       } else if (option === userAnswer && !isCorrect) {
  //                         optionStyle = { ...optionStyle, ...styles.wrongOption }
  //                       } else {
  //                         optionStyle = { ...optionStyle, background: "#f8fafc", border: "1px solid #e2e8f0" }
  //                       }
  //                       return (
  //                         <div key={optIndex} style={optionStyle}>
  //                           {option === question.correct && "✓ "}
  //                           {option === userAnswer && option !== question.correct && "✗ "}
  //                           {option}
  //                           {option === userAnswer && <span style={styles.userAnswer}> (Your Answer)</span>}
  //                         </div>
  //                       )
  //                     })}
  //                   </div>
  //                   <div style={styles.explanation}>
  //                     <strong>Explanation:</strong> {question.explanation}
  //                   </div>
  //                 </div>
  //               )
  //             })}
  //           </div>
            
  //           <div style={{ 
  //             textAlign: "center", 
  //             marginTop: "2rem",
  //             paddingTop: "1rem",
  //             borderTop: "1px solid #e2e8f0"
  //           }}>
  //             <button 
  //               onClick={() => setShowReview(false)} 
  //               style={styles.button}
  //             >
  //               Close Review
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  // INSTRUCTIONS SECTION
  if (showInstructions) {
    return (
      <div style={styles.container}>
        <div style={styles.innerContainer}>
          <div style={styles.backWrapper}>
            <button onClick={() => navigate(-1)} style={styles.backBtn}>
              <ArrowLeft size={18} /> Back to Chapters
            </button>
          </div>
          <h2 style={{ textAlign: "center", color: "#2563eb", marginBottom: "1rem" }}>
            Mock Test Instructions
          </h2>
          <div style={styles.card}>
            <ul style={{ lineHeight: 1.8, color: "#1e293b" }}>
              <li>You have 5 minutes to complete the test.</li>
              <li>Do not switch tabs during the test.</li>
              <li>Answer all questions carefully.</li>
              <li>Once started, timer cannot be paused.</li>
              <li>Review answers before submission.</li>
            </ul>
            <div style={{ marginTop: "1rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  checked={acceptedInstructions}
                  onChange={() => setAcceptedInstructions(!acceptedInstructions)}
                />
                I accept the instructions
              </label>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button
              disabled={!acceptedInstructions}
              onClick={() => setShowInstructions(false)}
              style={acceptedInstructions ? styles.button : styles.disabledButton}
            >
              Start Test
            </button>
          </div>
        </div>
      </div>
    )
  }

  // RESULTS SECTION
  if (showResults) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #aff3e7ff 0%, #d1c6dbff 100%)",
        fontFamily: "'Inter', sans-serif",
        padding: isMobile ? "2rem 1rem" : "3rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          background: "white",
          borderRadius: "20px",
          padding: isMobile ? "2rem 1.5rem" : "3rem",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          maxWidth: "800px",
          width: "100%",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            textAlign: "center",
            marginBottom: "2rem",
            paddingBottom: "1.5rem",
            borderBottom: "1px solid #e2e8f0"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "1rem",
              color: getPerformanceColor()
            }}>
              {getPerformanceIcon()}
            </div>
            <h1 style={{
              fontSize: isMobile ? "1.5rem" : "2rem",
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: "0.5rem"
            }}>
              {getPerformanceMessage()}
            </h1>
            <p style={{
              fontSize: "1rem",
              color: "#64748b",
              marginBottom: "1.5rem"
            }}>
              {subjectName} • {chapterName} • {subtopic}
            </p>
            <div style={{
              width: isMobile ? "120px" : "150px",
              height: isMobile ? "120px" : "150px",
              borderRadius: "50%",
              background: `conic-gradient(${getPerformanceColor()} ${scorePercent * 3.6}deg, #e5e7eb 0deg)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              position: "relative",
              boxShadow: `0 10px 30px ${getPerformanceColor()}40`
            }}>
              <div style={{
                width: isMobile ? "90px" : "110px",
                height: isMobile ? "90px" : "110px",
                borderRadius: "50%",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: isMobile ? "1.5rem" : "2rem",
                fontWeight: "700",
                color: "#1e293b"
              }}>
                {scorePercent}%
              </div>
            </div>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: "1rem",
            marginBottom: "2rem"
          }}>
            <div style={{
              background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
              borderRadius: "12px",
              padding: "1.5rem 1rem",
              textAlign: "center",
              border: "1px solid #bbf7d0"
            }}>
              <CheckCircle size={24} color="#10b981" style={{ margin: "0 auto 0.5rem" }} />
              <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#10b981", marginBottom: "0.25rem" }}>
                {correctAnswers}
              </div>
              <div style={{ fontSize: "0.875rem", color: "#64748b", fontWeight: "500" }}>Correct</div>
            </div>
            <div style={{
              background: "linear-gradient(135deg, #fef2f2, #fee2e2)",
              borderRadius: "12px",
              padding: "1.5rem 1rem",
              textAlign: "center",
              border: "1px solid #fecaca"
            }}>
              <XCircle size={24} color="#ef4444" style={{ margin: "0 auto 0.5rem" }} />
              <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#ef4444", marginBottom: "0.25rem" }}>
                {wrongAnswers}
              </div>
              <div style={{ fontSize: "0.875rem", color: "#64748b", fontWeight: "500" }}>Wrong</div>
            </div>
            <div style={{
              background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
              borderRadius: "12px",
              padding: "1.5rem 1rem",
              textAlign: "center",
              border: "1px solid #e2e8f0"
            }}>
              <HelpCircle size={24} color="#64748b" style={{ margin: "0 auto 0.5rem" }} />
              <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#64748b", marginBottom: "0.25rem" }}>
                {skipped}
              </div>
              <div style={{ fontSize: "0.875rem", color: "#64748b", fontWeight: "500" }}>Skipped</div>
            </div>
          </div>
          <div style={{
            background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
            borderRadius: "12px",
            padding: "1.25rem",
            marginBottom: "2rem",
            border: "1px solid #bae6fd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem"
          }}>
            <Clock size={20} color="#0369a1" />
            <div style={{ fontSize: "0.95rem", color: "#0369a1", fontWeight: "500" }}>
              Time Taken: {formatTime(300 - timeLeft)} | Total Questions: {totalQuestions}
            </div>
          </div>
          
          {/* Share Button */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            justifyContent: "center",
            flexDirection: isMobile ? "column" : "row",
            marginBottom: "1.5rem"
          }}>
            <button
              onClick={handleShare}
              style={{
                background: shareHover ? "linear-gradient(135deg, #3b82f6, #2563eb)" : "linear-gradient(135deg, #60a5fa, #3b82f6)",
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
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)"
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
            flexDirection: isMobile ? "column" : "row"
          }}>
            <button
              onClick={() => setShowReview(true)}
              style={{
                background: "linear-gradient(135deg, #667eea, #764ba2)",
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
                transition: "transform 0.2s ease, box-shadow 0.2s ease"
              }}
              onMouseEnter={e => {
                e.target.style.transform = "translateY(-2px)"
                e.target.style.boxShadow = "0 6px 12px rgba(102, 126, 234, 0.4)"
              }}
              onMouseLeave={e => {
                e.target.style.transform = "translateY(0)"
                e.target.style.boxShadow = "none"
              }}
            >
              <BarChart3 size={18} /> Review Answers
            </button>
            <button
              onClick={() => navigate(-1)}
              style={{
                background: "transparent",
                color: "#667eea",
                border: "2px solid #667eea",
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
                transition: "all 0.2s ease"
              }}
              onMouseEnter={e => {
                e.target.style.background = "#667eea"
                e.target.style.color = "white"
              }}
              onMouseLeave={e => {
                e.target.style.background = "transparent"
                e.target.style.color = "#667eea"
              }}
            >
              <ArrowLeft size={18} /> Back to Chapters
            </button>
          </div>
        </div>
      </div>
    )
  }

  // MAIN TEST PAGE
  return (
    <div style={styles.container}>
      <div style={styles.innerContainer}>
        <div
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            marginTop: "0.5rem", // extra margin for safety
            background: "#fff",
            borderRadius: "12px",
            padding: "1rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            border: timeLeft <= 60 ? "2px solid #ef4444" : "1px solid #e2e8f0",
            animation: timeLeft <= 30 ? "pulse 1s infinite" : "none",
          }}
        >
          <div
            style={{
              fontSize: "1.2rem",
              fontWeight: 600,
              color: timeLeft <= 60 ? "#ef4444" : "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            ⏱ Time Left: {formatTime(timeLeft)}
            {timeLeft <= 60 && <span style={{ fontSize: "0.9rem" }}>⚠️ Hurry Up!</span>}
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "1rem",
            marginBottom: "1.5rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ fontSize: "0.875rem", color: "#64748b", fontWeight: "500" }}>
              Question {currentQuestion + 1} of {mcqs.length}
            </span>
            <span style={{ fontSize: "0.875rem", color: "#2563eb", fontWeight: "600" }}>
              {Math.round(((currentQuestion + 1) / mcqs.length) * 100)}% Complete
            </span>
          </div>
          <div
            style={{
              height: "10px",
              background: "#e2e8f0",
              borderRadius: "8px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                width: `${((currentQuestion + 1) / mcqs.length) * 100}%`,
                height: "100%",
                background: "linear-gradient(90deg, #2563eb, #3b82f6)",
                borderRadius: "8px",
                transition: "width 0.3s ease",
                boxShadow: "0 2px 4px rgba(37, 99, 235, 0.3)",
              }}
            ></div>
          </div>
        </div>
        <div style={styles.card}>
          <h4 style={{ marginBottom: "1.5rem", fontSize: "1.2rem", lineHeight: "1.6" }}>
            Q{currentQuestion + 1}. {currentQ.question}
          </h4>
          {currentQ.options.map((opt) => (
            <label
              key={opt}
              style={{
                display: "block",
                marginBottom: "1rem",
                padding: "1rem",
                borderRadius: "12px",
                border: answers[currentQuestion] === opt ? "2px solid #2563eb" : "1px solid #e2e8f0",
                background: answers[currentQuestion] === opt ? "#dbeafe" : "#fff",
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
                style={{ marginRight: "0.75rem" }}
              />
              {opt}
            </label>
          ))}
        </div>
        <div
          style={{ marginTop: "1.5rem", textAlign: "center", display: "flex", gap: "1rem", justifyContent: "center" }}
        >
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            style={currentQuestion === 0 ? styles.disabledButton : styles.button}
          >
            ← Previous
          </button>
          {currentQuestion < mcqs.length - 1 ? (
            <button onClick={handleNext} style={styles.button}>
              Next →
            </button>
          ) : (
            <button onClick={handleSubmit} style={{ ...styles.button, background: "#16a34a" }}>
              Submit Test
            </button>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>
    </div>
  )
}

export default MockTestQuestionsPage