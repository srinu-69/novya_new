
// ////lokesh
// import React, { useState } from "react";
// import { useQuiz } from "./QuizContext";
// import { useTranslation } from "react-i18next";

// function QuizSubject({
//   subjects,
//   subtopics,
//   selectedSubject,
//   selectedClass,
//   onClassClick,
//   onSubjectClick,
//   onSubtopicClick,
// }) {
//   const { startQuiz } = useQuiz();
//   const { t } = useTranslation();
//   const [activeChapter, setActiveChapter] = useState(null);
//   const [hoveredSubtopic, setHoveredSubtopic] = useState(null);
//   const [showInstructions, setShowInstructions] = useState(false);
//   const [selectedTopic, setSelectedTopic] = useState(null);
//   const [selectedLanguage, setSelectedLanguage] = useState("English");

//   const subjectIcons = ["💻", "📜", "🏛️", "🧮", "🌍", "🔬", "⚙️", "🎨"];
//   const subjectColors = {
//     Computers: "#3498db",
//     History: "#e74c3c",
//     Civics: "#9b59b6",
//     Maths: "#f39c12",
//     Mathematics: "#f39c12",
//     Geography: "#27ae60",
//     Science: "#e67e22",
//     English: "#8e44ad",
//   };

//   const handleSubtopicClick = (topic) => {
//     setSelectedTopic(topic);
//     setShowInstructions(true);
//   };

//   const handleStartQuiz = () => {
//     setShowInstructions(false);
//     startQuiz(selectedLanguage);
//     onSubtopicClick(selectedTopic, selectedLanguage);
//   };

//   const backToSubtopics = () => {
//     setShowInstructions(false);
//   };

//   const backToGrades = () => {
//     if (onClassClick) onClassClick(null);
//   };

//   const backToSubjects = () => {
//     if (onSubjectClick) onSubjectClick(null);
//   };

//   // Subject selection screen
//   if (!selectedSubject) {
//     return (
//       <section
//         style={{
//           padding: "3rem 1rem",
//           background: "#f9fbfd",
//           minHeight: "100vh",
//         }}
//       >
//         <button
//           onClick={backToGrades}
//           style={{
//             marginBottom: "1.5rem",
//             padding: "0.5rem 1rem",
//             borderRadius: "8px",
//             border: "1px solid #ccc",
//             background: "#fff",
//             cursor: "pointer",
//             fontWeight: "600",
//           }}
//         >
//           ← {t("back_to_grades")}
//         </button>

//         <div style={{ textAlign: "center", marginBottom: "3rem" }}>
//           <h2
//             style={{
//               fontSize: "2.5rem",
//               fontWeight: "800",
//               color: "#2c3e50",
//               margin: 0,
//             }}
//           >
//             {t("Select Your Subject")}
//           </h2>
//           <p
//             style={{
//               color: "#2c3e50",
//               fontSize: "1.2rem",
//               margin: "0.8rem 0 0",
//               fontWeight: "500",
//             }}
//           >
//             {t("choose_subject_for_grade", { grade: selectedClass })}
//           </p>
//         </div>

//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
//             gap: "2rem",
//             maxWidth: "1200px",
//             margin: "0 auto",
//           }}
//         >
//           {(subjects || []).map((sub, i) => (
//             <div
//               key={i}
//               onClick={() => onSubjectClick(sub)}
//               style={{
//                 background: "white",
//                 borderRadius: "20px",
//                 padding: "2rem",
//                 cursor: "pointer",
//                 textAlign: "center",
//                 boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
//                 transition: "all 0.3s ease",
//                 border: "1px solid #eee",
//               }}
//             >
//               <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
//                 {subjectIcons[i % subjectIcons.length]}
//               </div>
//               <h3
//                 style={{
//                   fontSize: "1.5rem",
//                   fontWeight: "700",
//                   background: `linear-gradient(135deg, ${
//                     subjectColors[sub] || "#6c5ce7"
//                   }, #e84393)`,
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                   marginBottom: "1rem",
//                 }}
//               >
//                 {t(`quiz-subjects.${sub.toLowerCase()}`) || sub}
//               </h3>
//             </div>
//           ))}
//         </div>
//       </section>
//     );
//   }

//   // Instructions screen
//   if (showInstructions) {
//     return (
//       <section
//         style={{
//           padding: "2rem",
//           background: "#f1f2f6",
//           minHeight: "100vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <div
//           style={{
//             background: "white",
//             borderRadius: "20px",
//             padding: "3rem",
//             maxWidth: "800px",
//             width: "100%",
//             boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
//           }}
//         >
//           <div
//             style={{
//               textAlign: "center",
//               marginBottom: "2rem",
//               fontSize: "3rem",
//             }}
//           >
//             📚
//           </div>
//           <h2
//             style={{
//               textAlign: "center",
//               fontSize: "2rem",
//               fontWeight: "700",
//               color: "#2c3e50",
//               marginBottom: "2rem",
//             }}
//           >
//             {t('quick_practice_instructions')}
//           </h2>

//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               gap: "1.5rem",
//               marginBottom: "2rem",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "flex-start",
//                 gap: "1rem",
//               }}
//             >
//               <span
//                 style={{
//                   fontSize: "1.5rem",
//                   marginTop: "0.2rem",
//                 }}
//               >
//                 ❓
//               </span>
//               <div>
//                 <h3
//                   style={{
//                     fontSize: "1.2rem",
//                     fontWeight: "600",
//                     margin: "0 0 0.5rem 0",
//                   }}
//                 >
//                   {t('question_format')}
//                 </h3>
//                 <p>{t('question_format_description')}</p>
//               </div>
//             </div>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "flex-start",
//                 gap: "1rem",
//               }}
//             >
//               <span
//                 style={{
//                   fontSize: "1.5rem",
//                   marginTop: "0.2rem",
//                 }}
//               >
//                 📊
//               </span>
//               <div>
//                 <h3
//                   style={{
//                     fontSize: "1.2rem",
//                     fontWeight: "600",
//                     margin: "0 0 0.5rem 0",
//                   }}
//                 >
//                   {t('progressive_difficulty')}
//                 </h3>
//                 <p>{t('progressive_difficulty_description')}</p>
//               </div>
//             </div>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "flex-start",
//                 gap: "1rem",
//               }}
//             >
//               <span
//                 style={{
//                   fontSize: "1.5rem",
//                   marginTop: "0.2rem",
//                 }}
//               >
//                 ⏱️
//               </span>
//               <div>
//                 <h3
//                   style={{
//                     fontSize: "1.2rem",
//                     fontWeight: "600",
//                     margin: "0 0 0.5rem 0",
//                   }}
//                 >
//                   {t('no_time_limit')}
//                 </h3>
//                 <p>{t('no_time_limit_description')}</p>
//               </div>
//             </div>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "flex-start",
//                 gap: "1rem",
//               }}
//             >
//               <span
//                 style={{
//                   fontSize: "1.5rem",
//                   marginTop: "0.2rem",
//                 }}
//               >
//                 📝
//               </span>
//               <div>
//                 <h3
//                   style={{
//                     fontSize: "1.2rem",
//                     fontWeight: "600",
//                     margin: "0 0 0.5rem 0",
//                   }}
//                 >
//                   {t('immediate_feedback')}
//                 </h3>
//                 <p>{t('immediate_feedback_description')}</p>
//               </div>
//             </div>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "flex-start",
//                 gap: "1rem",
//               }}
//             >
//               <span
//                 style={{
//                   fontSize: "1.5rem",
//                   marginTop: "0.2rem",
//                 }}
//               >
//                 🎯
//               </span>
//               <div>
//                 <h3
//                   style={{
//                     fontSize: "1.2rem",
//                     fontWeight: "600",
//                     margin: "0 0 0.5rem 0",
//                   }}
//                 >
//                   {t('level_up')}
//                 </h3>
//                 <p>{t('level_up_description')}</p>
//               </div>
//             </div>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "flex-start",
//                 gap: "1rem",
//               }}
//             >
//               <span
//                 style={{
//                   fontSize: "1.5rem",
//                   marginTop: "0.2rem",
//                 }}
//               >
//                 🌐
//               </span>
//               <div>
//                 <h3
//                   style={{
//                     fontSize: "1.2rem",
//                     fontWeight: "600",
//                     margin: "0 0 0.5rem 0",
//                   }}
//                 >
//                   {t('language')}
//                 </h3>
//                 <p>{t('language_description')}</p>
//               </div>
//             </div>
//           </div>

//           <div
//             style={{
//               background: "#f8f9fa",
//               borderRadius: "10px",
//               padding: "1.5rem",
//               marginBottom: "2rem",
//             }}
//           >
//             <h3
//               style={{
//                 fontSize: "1.3rem",
//                 fontWeight: "600",
//                 marginBottom: "1rem",
//                 color: "#2c3e50",
//               }}
//             >
//               {t('practice_details')}
//             </h3>
//             <p>
//               <strong>{t('class')}:</strong> {selectedClass}
//             </p>
//             <p>
//               <strong>{t('subject')}:</strong> {selectedSubject}
//             </p>
//             <p>
//               <strong>{t('chapter')}:</strong> {activeChapter}
//             </p>
//             <p>
//               <strong>{t('topic')}:</strong> {selectedTopic}
//             </p>
//             <p>
//               <strong>{t('total_questions')}:</strong> 10
//             </p>
//             <p>
//               <strong>{t('passing_score')}:</strong> 7/10
//             </p>
//             <p>
//               <strong>{t('language')}:</strong> {selectedLanguage}
//             </p>
//           </div>

//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               marginBottom: "2rem",
//               gap: "1rem",
//             }}
//           >
//             <label
//               htmlFor="language"
//               style={{
//                 fontWeight: "600",
//                 marginRight: "8px",
//                 fontSize: "16px",
//               }}
//             >
//               🌐 {t('select_language')}:
//             </label>
//             <select
//               id="language"
//               value={selectedLanguage}
//               onChange={(e) => setSelectedLanguage(e.target.value)}
//               style={{
//                 padding: "10px 15px",
//                 fontSize: "15px",
//                 borderRadius: "8px",
//                 border: "2px solid #007bff",
//                 backgroundColor: "white",
//                 cursor: "pointer",
//                 minWidth: "180px",
//                 fontWeight: "500",
//               }}
//             >
//               <option value="English">English</option>
//               <option value="తెలుగు">తెలుగు (Telugu)</option>
//               <option value="हिंदी">हिंदी (Hindi)</option>
//               <option value="தமிழ்">தமிழ் (Tamil)</option>
//               <option value="ಕನ್ನಡ">ಕನ್ನಡ (Kannada)</option>
//               <option value="മലയാളം">മലയാളം (Malayalam)</option>
//             </select>
//           </div>

//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               gap: "1rem",
//             }}
//           >
//             <button
//               onClick={backToSubtopics}
//               style={{
//                 padding: "0.7rem 1.5rem",
//                 border: "none",
//                 borderRadius: "8px",
//                 background: "#ccc",
//                 cursor: "pointer",
//                 fontWeight: "600",
//               }}
//             >
//               ← {t('back_to_topics')}
//             </button>
//             <button
//               onClick={handleStartQuiz}
//               style={{
//                 padding: "0.7rem 1.5rem",
//                 border: "none",
//                 borderRadius: "8px",
//                 background: "#27ae60",
//                 color: "white",
//                 cursor: "pointer",
//                 fontWeight: "600",
//               }}
//             >
//               🚀 {t('start_practice_now')}
//             </button>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   // Subtopic selection
//   return (
//     <section style={{ display: "flex", minHeight: "100vh", background: "#f1f2f6" }}>
//       <aside
//         style={{
//           width: "300px",
//           background: "white",
//           padding: "2rem",
//           borderRight: "1px solid #eee",
//         }}
//       >
//         <button
//           onClick={backToSubjects}
//           style={{
//             marginBottom: "1rem",
//             padding: "0.5rem 1rem",
//             borderRadius: "8px",
//             border: "1px solid #ccc",
//             background: "#fff",
//             cursor: "pointer",
//             fontWeight: "600",
//           }}
//         >
//           ← {t("back_to_subjects")}
//         </button>

//         <h3
//           style={{
//             fontSize: "1.2rem",
//             fontWeight: "700",
//             marginBottom: "1rem",
//           }}
//         >
//           {t("chapters for Subject", { subject: selectedSubject, grade: selectedClass })}
//         </h3>

//         <ul style={{ listStyle: "none", padding: 0 }}>
//           {Object.keys(subtopics || {}).map((chapter, i) => (
//             <li key={i} style={{ marginBottom: "1rem" }}>
//               <button
//                 onClick={() =>
//                   setActiveChapter(activeChapter === chapter ? null : chapter)
//                 }
//                 style={{
//                   width: "100%",
//                   textAlign: "left",
//                   padding: "0.8rem 1rem",
//                   borderRadius: "8px",
//                   border:
//                     activeChapter === chapter
//                       ? `2px solid ${
//                           subjectColors[selectedSubject] || "#6c5ce7"
//                         }`
//                       : "1px solid #ddd",
//                   background:
//                     activeChapter === chapter ? "#ecf0f1" : "#fff",
//                   fontWeight: "600",
//                   cursor: "pointer",
//                 }}
//               >
//                 {chapter}
//               </button>
//             </li>
//           ))}
//         </ul>
//       </aside>

//       <main style={{ flex: 1, padding: "2rem" }}>
//         {!activeChapter ? (
//           <p
//             style={{
//               textAlign: "center",
//               marginTop: "4rem",
//               fontSize: "1.2rem",
//             }}
//           >
//             {t("select_chapter_to_view_subtopics")}
//           </p>
//         ) : (
//           <div>
//             <h2
//               style={{
//                 fontSize: "1.5rem",
//                 fontWeight: "700",
//                 marginBottom: "1rem",
//               }}
//             >
//               {activeChapter}
//             </h2>
//             <div
//               style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
//             >
//               {(subtopics[activeChapter] || []).map((topic, j) => (
//                 <button
//                   key={j}
//                   onClick={() => handleSubtopicClick(topic)}
//                   onMouseEnter={() => setHoveredSubtopic(j)}
//                   onMouseLeave={() => setHoveredSubtopic(null)}
//                   style={{
//                     padding: "1rem 1.5rem",
//                     borderRadius: "10px",
//                     border: "1px solid #ddd",
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     cursor: "pointer",
//                     background:
//                       hoveredSubtopic === j ? "#ecf0f1" : "white",
//                     transition: "all 0.3s ease",
//                   }}
//                 >
//                   <span style={{ fontWeight: "600" }}>{topic}</span>
//                   <span
//                     style={{
//                       background: "#0984e3",
//                       color: "white",
//                       padding: "0.4rem 0.8rem",
//                       borderRadius: "8px",
//                       fontSize: "0.85rem",
//                       fontWeight: "600",
//                     }}
//                   >
//                     ⏱️ {t("start_quiz")}
//                   </span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}
//       </main>
//     </section>
//   );
// }

// export default QuizSubject;










import React, { useState } from "react";
import { useQuiz } from "./QuizContext";
import { useTranslation } from "react-i18next";

function QuizSubject({
  subjects,
  subtopics,
  selectedSubject,
  selectedClass,
  onClassClick,
  onSubjectClick,
  onSubtopicClick,
}) {
  const { startQuiz } = useQuiz();
  const { t } = useTranslation();
  const [activeChapter, setActiveChapter] = useState(null);
  const [hoveredSubtopic, setHoveredSubtopic] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Mobile detection
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const subjectIcons = ["💻", "📜", "🏛️", "🧮", "🌍", "🔬", "⚙️", "🎨"];
  const subjectColors = {
    Computers: "#3498db",
    History: "#e74c3c",
    Civics: "#9b59b6",
    Maths: "#f39c12",
    Mathematics: "#f39c12",
    Geography: "#27ae60",
    Science: "#e67e22",
    English: "#8e44ad",
  };

  const handleSubtopicClick = (topic) => {
    setSelectedTopic(topic);
    setShowInstructions(true);
  };

  const handleStartQuiz = () => {
    setShowInstructions(false);
    startQuiz(selectedLanguage);
    onSubtopicClick(selectedTopic, selectedLanguage);
  };

  const backToSubtopics = () => {
    setShowInstructions(false);
  };

  const backToGrades = () => {
    if (onClassClick) onClassClick(null);
  };

  const backToSubjects = () => {
    if (onSubjectClick) onSubjectClick(null);
  };

  // Mobile responsive styles
  const mobileStyles = {
    pageStyle: {
      padding: isMobile ? "1rem" : "3rem 1rem",
      background: "#f9fbfd",
      minHeight: "100vh",
    },
    backButton: {
      marginBottom: isMobile ? "1rem" : "1.5rem",
      padding: isMobile ? "0.4rem 0.8rem" : "0.5rem 1rem",
      borderRadius: "8px",
      border: "1px solid #ccc",
      background: "#fff",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: isMobile ? "14px" : "16px",
    },
    title: {
      fontSize: isMobile ? "1.8rem" : "2.5rem",
      fontWeight: "800",
      color: "#2c3e50",
      margin: 0,
      textAlign: "center",
      lineHeight: 1.3,
    },
    subtitle: {
      color: "#2c3e50",
      fontSize: isMobile ? "1rem" : "1.2rem",
      margin: isMobile ? "0.5rem 0 0" : "0.8rem 0 0",
      fontWeight: "500",
      textAlign: "center",
      lineHeight: 1.4,
      padding: isMobile ? "0 0.5rem" : "0",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))",
      gap: isMobile ? "1rem" : "2rem",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    subjectCard: {
      background: "white",
      borderRadius: isMobile ? "16px" : "20px",
      padding: isMobile ? "1.5rem" : "2rem",
      cursor: "pointer",
      textAlign: "center",
      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      transition: "all 0.3s ease",
      border: "1px solid #eee",
      minHeight: isMobile ? "140px" : "auto",
    },
    subjectIcon: {
      fontSize: isMobile ? "2.5rem" : "3rem",
      marginBottom: isMobile ? "0.8rem" : "1rem",
    },
    subjectTitle: {
      fontSize: isMobile ? "1.3rem" : "1.5rem",
      fontWeight: "700",
      background: `linear-gradient(135deg, ${subjectColors[selectedSubject] || "#6c5ce7"}, #e84393)`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: isMobile ? "0.8rem" : "1rem",
      lineHeight: 1.3,
      wordWrap: "break-word",
      overflowWrap: "break-word",
      hyphens: "auto",
    },
    instructionsContainer: {
      background: "white",
      borderRadius: isMobile ? "16px" : "20px",
      padding: isMobile ? "1.5rem" : "3rem",
      maxWidth: "800px",
      width: "100%",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      margin: isMobile ? "0.5rem" : "0",
    },
    instructionsTitle: {
      textAlign: "center",
      fontSize: isMobile ? "1.5rem" : "2rem",
      fontWeight: "700",
      color: "#2c3e50",
      marginBottom: isMobile ? "1.5rem" : "2rem",
      lineHeight: 1.3,
    },
    instructionItem: {
      display: "flex",
      alignItems: "flex-start",
      gap: isMobile ? "0.8rem" : "1rem",
      marginBottom: isMobile ? "1rem" : "1.5rem",
    },
    instructionIcon: {
      fontSize: isMobile ? "1.3rem" : "1.5rem",
      marginTop: "0.2rem",
      flexShrink: 0,
    },
    instructionContent: {
      flex: 1,
    },
    instructionHeading: {
      fontSize: isMobile ? "1.1rem" : "1.2rem",
      fontWeight: "600",
      margin: "0 0 0.3rem 0",
      lineHeight: 1.3,
    },
    instructionText: {
      fontSize: isMobile ? "0.9rem" : "1rem",
      lineHeight: 1.5,
      color: "#555",
    },
    practiceDetails: {
      background: "#f8f9fa",
      borderRadius: "10px",
      padding: isMobile ? "1rem" : "1.5rem",
      marginBottom: isMobile ? "1.5rem" : "2rem",
      fontSize: isMobile ? "0.9rem" : "1rem",
    },
    languageSelector: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "center",
      alignItems: isMobile ? "stretch" : "center",
      marginBottom: isMobile ? "1.5rem" : "2rem",
      gap: isMobile ? "0.8rem" : "1rem",
    },
    languageLabel: {
      fontWeight: "600",
      fontSize: isMobile ? "15px" : "16px",
      textAlign: isMobile ? "center" : "left",
    },
    languageSelect: {
      padding: isMobile ? "8px 12px" : "10px 15px",
      fontSize: isMobile ? "14px" : "15px",
      borderRadius: "8px",
      border: "2px solid #007bff",
      backgroundColor: "white",
      cursor: "pointer",
      minWidth: isMobile ? "100%" : "180px",
      fontWeight: "500",
    },
    buttonGroup: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "center",
      gap: isMobile ? "0.8rem" : "1rem",
    },
    button: {
      padding: isMobile ? "0.6rem 1.2rem" : "0.7rem 1.5rem",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: isMobile ? "14px" : "16px",
      width: isMobile ? "100%" : "auto",
    },
    sidebar: {
      width: isMobile ? "100%" : "300px",
      background: "white",
      padding: isMobile ? "1rem" : "2rem",
      borderRight: isMobile ? "none" : "1px solid #eee",
      borderBottom: isMobile ? "1px solid #eee" : "none",
      marginBottom: isMobile ? "1rem" : "0",
    },
    mainContent: {
      flex: 1,
      padding: isMobile ? "1rem" : "2rem",
    },
    chapterButton: {
      width: "100%",
      textAlign: "left",
      padding: isMobile ? "0.6rem 0.8rem" : "0.8rem 1rem",
      borderRadius: "8px",
      border: "1px solid #ddd",
      background: "#fff",
      fontWeight: "600",
      cursor: "pointer",
      fontSize: isMobile ? "14px" : "16px",
      marginBottom: isMobile ? "0.5rem" : "1rem",
    },
    subtopicButton: {
      padding: isMobile ? "0.8rem 1rem" : "1rem 1.5rem",
      borderRadius: "10px",
      border: "1px solid #ddd",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
      background: "white",
      transition: "all 0.3s ease",
      width: "100%",
      marginBottom: isMobile ? "0.5rem" : "0",
    },
    subtopicText: {
      fontWeight: "600",
      fontSize: isMobile ? "14px" : "16px",
      textAlign: "left",
      flex: 1,
      wordWrap: "break-word",
      overflowWrap: "break-word",
      hyphens: "auto",
    },
    startQuizBadge: {
      background: "#0984e3",
      color: "white",
      padding: isMobile ? "0.3rem 0.6rem" : "0.4rem 0.8rem",
      borderRadius: "8px",
      fontSize: isMobile ? "0.8rem" : "0.85rem",
      fontWeight: "600",
      marginLeft: isMobile ? "0.5rem" : "0",
      flexShrink: 0,
    },
  };

  // Subject selection screen
  if (!selectedSubject) {
    return (
      <section style={mobileStyles.pageStyle}>
        <button
          onClick={backToGrades}
          style={mobileStyles.backButton}
        >
          ← {t("back_to_grades")}
        </button>

        <div style={{ textAlign: "center", marginBottom: isMobile ? "2rem" : "3rem" }}>
          <h2 style={mobileStyles.title}>
            {t("Select Your Subject")}
          </h2>
          <p style={mobileStyles.subtitle}>
            {t("choose_subject_for_grade", { grade: selectedClass })}
          </p>
        </div>

        <div style={mobileStyles.grid}>
          {(subjects || []).map((sub, i) => (
            <div
              key={i}
              onClick={() => onSubjectClick(sub)}
              style={{
                ...mobileStyles.subjectCard,
                ...(hoveredSubtopic === `subject-${i}` ? {
                  background: "#ecf0f1",
                  transform: "translateY(-4px)",
                } : {})
              }}
              onMouseEnter={() => !isMobile && setHoveredSubtopic(`subject-${i}`)}
              onMouseLeave={() => !isMobile && setHoveredSubtopic(null)}
            >
              <div style={mobileStyles.subjectIcon}>
                {subjectIcons[i % subjectIcons.length]}
              </div>
              <h3 style={mobileStyles.subjectTitle}>
                {t(`quiz-subjects.${sub.toLowerCase()}`) || sub}
              </h3>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Instructions screen
  if (showInstructions) {
    return (
      <section
        style={{
          padding: isMobile ? "1rem" : "2rem",
          background: "#f1f2f6",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={mobileStyles.instructionsContainer}>
          <div
            style={{
              textAlign: "center",
              marginBottom: isMobile ? "1.5rem" : "2rem",
              fontSize: isMobile ? "2.5rem" : "3rem",
            }}
          >
            📚
          </div>
          <h2 style={mobileStyles.instructionsTitle}>
            {t('quick_practice_instructions')}
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: isMobile ? "1rem" : "1.5rem",
              marginBottom: isMobile ? "1.5rem" : "2rem",
            }}
          >
            {[
              {
                icon: "❓",
                title: t('question_format'),
                desc: t('question_format_description')
              },
              {
                icon: "📊",
                title: t('progressive_difficulty'),
                desc: t('progressive_difficulty_description')
              },
              {
                icon: "⏱️",
                title: t('no_time_limit'),
                desc: t('no_time_limit_description')
              },
              {
                icon: "📝",
                title: t('immediate_feedback'),
                desc: t('immediate_feedback_description')
              },
              {
                icon: "🎯",
                title: t('level_up'),
                desc: t('level_up_description')
              },
              {
                icon: "🌐",
                title: t('language'),
                desc: t('language_description')
              }
            ].map((item, index) => (
              <div key={index} style={mobileStyles.instructionItem}>
                <span style={mobileStyles.instructionIcon}>
                  {item.icon}
                </span>
                <div style={mobileStyles.instructionContent}>
                  <h3 style={mobileStyles.instructionHeading}>
                    {item.title}
                  </h3>
                  <p style={mobileStyles.instructionText}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={mobileStyles.practiceDetails}>
            <h3
              style={{
                fontSize: isMobile ? "1.1rem" : "1.3rem",
                fontWeight: "600",
                marginBottom: isMobile ? "0.8rem" : "1rem",
                color: "#2c3e50",
              }}
            >
              {t('practice_details')}
            </h3>
            <p><strong>{t('class')}:</strong> {selectedClass}</p>
            <p><strong>{t('subject')}:</strong> {selectedSubject}</p>
            <p><strong>{t('chapter')}:</strong> {activeChapter}</p>
            <p><strong>{t('topic')}:</strong> {selectedTopic}</p>
            <p><strong>{t('total_questions')}:</strong> 10</p>
            <p><strong>{t('passing_score')}:</strong> 7/10</p>
            <p><strong>{t('language')}:</strong> {selectedLanguage}</p>
          </div>

          <div style={mobileStyles.languageSelector}>
            <label htmlFor="language" style={mobileStyles.languageLabel}>
              🌐 {t('select_language')}:
            </label>
            <select
              id="language"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              style={mobileStyles.languageSelect}
            >
              <option value="English">English</option>
              <option value="తెలుగు">తెలుగు (Telugu)</option>
              <option value="हिंदी">हिंदी (Hindi)</option>
              <option value="தமிழ்">தமிழ் (Tamil)</option>
              <option value="ಕನ್ನಡ">ಕನ್ನಡ (Kannada)</option>
              <option value="മലയാളം">മലയാളം (Malayalam)</option>
            </select>
          </div>

          <div style={mobileStyles.buttonGroup}>
            <button
              onClick={backToSubtopics}
              style={{
                ...mobileStyles.button,
                background: "#ccc",
              }}
            >
              ← {t('back_to_topics')}
            </button>
            <button
              onClick={handleStartQuiz}
              style={{
                ...mobileStyles.button,
                background: "#27ae60",
                color: "white",
              }}
            >
              🚀 {t('start_practice_now')}
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Subtopic selection - Mobile layout
  if (isMobile) {
    return (
      <section style={{ minHeight: "100vh", background: "#f1f2f6" }}>
        <div style={mobileStyles.sidebar}>
          <button
            onClick={backToSubjects}
            style={mobileStyles.backButton}
          >
            ← {t("back_to_subjects")}
          </button>

          <h3
            style={{
              fontSize: "1.1rem",
              fontWeight: "700",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            {t("chapters for Subject", { subject: selectedSubject, grade: selectedClass })}
          </h3>

          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {Object.keys(subtopics || {}).map((chapter, i) => (
              <button
                key={i}
                onClick={() => setActiveChapter(activeChapter === chapter ? null : chapter)}
                style={{
                  ...mobileStyles.chapterButton,
                  border: activeChapter === chapter ? `2px solid ${subjectColors[selectedSubject] || "#6c5ce7"}` : "1px solid #ddd",
                  background: activeChapter === chapter ? "#ecf0f1" : "#fff",
                }}
              >
                {chapter}
              </button>
            ))}
          </div>
        </div>

        <div style={mobileStyles.mainContent}>
          {!activeChapter ? (
            <p
              style={{
                textAlign: "center",
                marginTop: "2rem",
                fontSize: "1.1rem",
                color: "#666",
              }}
            >
              {t("select_chapter_to_view_subtopics")}
            </p>
          ) : (
            <div>
              <h2
                style={{
                  fontSize: "1.3rem",
                  fontWeight: "700",
                  marginBottom: "1rem",
                  textAlign: "center",
                }}
              >
                {activeChapter}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {(subtopics[activeChapter] || []).map((topic, j) => (
                  <button
                    key={j}
                    onClick={() => handleSubtopicClick(topic)}
                    style={{
                      ...mobileStyles.subtopicButton,
                      background: hoveredSubtopic === j ? "#ecf0f1" : "white",
                    }}
                    onMouseEnter={() => !isMobile && setHoveredSubtopic(j)}
                    onMouseLeave={() => !isMobile && setHoveredSubtopic(null)}
                  >
                    <span style={mobileStyles.subtopicText}>{topic}</span>
                    <span style={mobileStyles.startQuizBadge}>
                      ⏱️ {t("start_quiz")}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Desktop layout for subtopic selection
  return (
    <section style={{ display: "flex", minHeight: "100vh", background: "#f1f2f6" }}>
      <aside style={mobileStyles.sidebar}>
        <button
          onClick={backToSubjects}
          style={mobileStyles.backButton}
        >
          ← {t("back_to_subjects")}
        </button>

        <h3
          style={{
            fontSize: "1.2rem",
            fontWeight: "700",
            marginBottom: "1rem",
          }}
        >
          {t("chapters for Subject", { subject: selectedSubject, grade: selectedClass })}
        </h3>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {Object.keys(subtopics || {}).map((chapter, i) => (
            <li key={i} style={{ marginBottom: "1rem" }}>
              <button
                onClick={() => setActiveChapter(activeChapter === chapter ? null : chapter)}
                style={{
                  ...mobileStyles.chapterButton,
                  border: activeChapter === chapter ? `2px solid ${subjectColors[selectedSubject] || "#6c5ce7"}` : "1px solid #ddd",
                  background: activeChapter === chapter ? "#ecf0f1" : "#fff",
                }}
              >
                {chapter}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main style={mobileStyles.mainContent}>
        {!activeChapter ? (
          <p
            style={{
              textAlign: "center",
              marginTop: "4rem",
              fontSize: "1.2rem",
              color: "#666",
            }}
          >
            {t("select_chapter_to_view_subtopics")}
          </p>
        ) : (
          <div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                marginBottom: "1rem",
              }}
            >
              {activeChapter}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {(subtopics[activeChapter] || []).map((topic, j) => (
                <button
                  key={j}
                  onClick={() => handleSubtopicClick(topic)}
                  onMouseEnter={() => setHoveredSubtopic(j)}
                  onMouseLeave={() => setHoveredSubtopic(null)}
                  style={{
                    ...mobileStyles.subtopicButton,
                    background: hoveredSubtopic === j ? "#ecf0f1" : "white",
                  }}
                >
                  <span style={mobileStyles.subtopicText}>{topic}</span>
                  <span style={mobileStyles.startQuizBadge}>
                    ⏱️ {t("start_quiz")}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </section>
  );
}

export default QuizSubject;