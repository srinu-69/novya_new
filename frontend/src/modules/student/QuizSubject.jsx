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
    startQuiz(selectedLanguage); // Pass language to context
    onSubtopicClick(selectedTopic, selectedLanguage); // Pass language to parent
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

  // Subject selection screen
  if (!selectedSubject) {
    return (
      <section
        style={{
          padding: "3rem 1rem",
          background: "#f9fbfd",
          minHeight: "100vh",
        }}
      >
        <button
          onClick={backToGrades}
          style={{
            marginBottom: "1.5rem",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            background: "#fff",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          ← {t("back_to_grades")}
        </button>

        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "800",
              color: "#2c3e50",
              margin: 0,
            }}
          >
            {t("select_subject")}
          </h2>
          <p
            style={{
              color: "#2c3e50",
              fontSize: "1.2rem",
              margin: "0.8rem 0 0",
              fontWeight: "500",
            }}
          >
            {t("choose_subject_for_grade", { grade: selectedClass })}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {(subjects || []).map((sub, i) => (
            <div
              key={i}
              onClick={() => onSubjectClick(sub)}
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "2rem",
                cursor: "pointer",
                textAlign: "center",
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                border: "1px solid #eee",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                {subjectIcons[i % subjectIcons.length]}
              </div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  background: `linear-gradient(135deg, ${
                    subjectColors[sub] || "#6c5ce7"
                  }, #e84393)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: "1rem",
                }}
              >
                {t(sub)}
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
          padding: "2rem",
          background: "#f1f2f6",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "3rem",
            maxWidth: "800px",
            width: "100%",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "2rem",
              fontSize: "3rem",
            }}
          >
            📚
          </div>
          <h2
            style={{
              textAlign: "center",
              fontSize: "2rem",
              fontWeight: "700",
              color: "#2c3e50",
              marginBottom: "2rem",
            }}
          >
            Quick Practice Instructions
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "1rem",
              }}
            >
              <span
                style={{
                  fontSize: "1.5rem",
                  marginTop: "0.2rem",
                }}
              >
                ❓
              </span>
              <div>
                <h3
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    margin: "0 0 0.5rem 0",
                  }}
                >
                  Question Format
                </h3>
                <p>10 multiple choice questions with 4 options each</p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "1rem",
              }}
            >
              <span
                style={{
                  fontSize: "1.5rem",
                  marginTop: "0.2rem",
                }}
              >
                📊
              </span>
              <div>
                <h3
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    margin: "0 0 0.5rem 0",
                  }}
                >
                  Progressive Difficulty
                </h3>
                <p>Questions get harder as you progress through levels</p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "1rem",
              }}
            >
              <span
                style={{
                  fontSize: "1.5rem",
                  marginTop: "0.2rem",
                }}
              >
                ⏱️
              </span>
              <div>
                <h3
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    margin: "0 0 0.5rem 0",
                  }}
                >
                  No Time Limit
                </h3>
                <p>Take your time to think through each question</p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "1rem",
              }}
            >
              <span
                style={{
                  fontSize: "1.5rem",
                  marginTop: "0.2rem",
                }}
              >
                📝
              </span>
              <div>
                <h3
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    margin: "0 0 0.5rem 0",
                  }}
                >
                  Immediate Feedback
                </h3>
                <p>Get instant feedback after answering each question</p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "1rem",
              }}
            >
              <span
                style={{
                  fontSize: "1.5rem",
                  marginTop: "0.2rem",
                }}
              >
                🎯
              </span>
              <div>
                <h3
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    margin: "0 0 0.5rem 0",
                  }}
                >
                  Level Up
                </h3>
                <p>Score 7 or more to unlock the next difficulty level</p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "1rem",
              }}
            >
              <span
                style={{
                  fontSize: "1.5rem",
                  marginTop: "0.2rem",
                }}
              >
                🌐
              </span>
              <div>
                <h3
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    margin: "0 0 0.5rem 0",
                  }}
                >
                  Language
                </h3>
                <p>Questions will be generated in your selected language</p>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#f8f9fa",
              borderRadius: "10px",
              padding: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            <h3
              style={{
                fontSize: "1.3rem",
                fontWeight: "600",
                marginBottom: "1rem",
                color: "#2c3e50",
              }}
            >
              Practice Details:
            </h3>
            <p>
              <strong>Class:</strong> {selectedClass}
            </p>
            <p>
              <strong>Subject:</strong> {selectedSubject}
            </p>
            <p>
              <strong>Chapter:</strong> {activeChapter}
            </p>
            <p>
              <strong>Topic:</strong> {selectedTopic}
            </p>
            <p>
              <strong>Total Questions:</strong> 10
            </p>
            <p>
              <strong>Passing Score:</strong> 7/10 or more
            </p>
            <p>
              <strong>Language:</strong> {selectedLanguage}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "2rem",
              gap: "1rem",
            }}
          >
            <label
              htmlFor="language"
              style={{
                fontWeight: "600",
                marginRight: "8px",
                fontSize: "16px",
              }}
            >
              🌐 Select Language:
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
                fontWeight: "500",
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

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <button
              onClick={backToSubtopics}
              style={{
                padding: "0.7rem 1.5rem",
                border: "none",
                borderRadius: "8px",
                background: "#ccc",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              ← Back to Topics
            </button>
            <button
              onClick={handleStartQuiz}
              style={{
                padding: "0.7rem 1.5rem",
                border: "none",
                borderRadius: "8px",
                background: "#27ae60",
                color: "white",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              🚀 Start Practice Now
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Subtopic selection
  return (
    <section style={{ display: "flex", minHeight: "100vh", background: "#f1f2f6" }}>
      <aside
        style={{
          width: "300px",
          background: "white",
          padding: "2rem",
          borderRight: "1px solid #eee",
        }}
      >
        <button
          onClick={backToSubjects}
          style={{
            marginBottom: "1rem",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            background: "#fff",
            cursor: "pointer",
            fontWeight: "600",
          }}
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
          📖 {t("chapters_for_subject", { subject: selectedSubject })}
        </h3>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {Object.keys(subtopics || {}).map((chapter, i) => (
            <li key={i} style={{ marginBottom: "1rem" }}>
              <button
                onClick={() =>
                  setActiveChapter(activeChapter === chapter ? null : chapter)
                }
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "0.8rem 1rem",
                  borderRadius: "8px",
                  border:
                    activeChapter === chapter
                      ? `2px solid ${
                          subjectColors[selectedSubject] || "#6c5ce7"
                        }`
                      : "1px solid #ddd",
                  background:
                    activeChapter === chapter ? "#ecf0f1" : "#fff",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                {chapter}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main style={{ flex: 1, padding: "2rem" }}>
        {!activeChapter ? (
          <p
            style={{
              textAlign: "center",
              marginTop: "4rem",
              fontSize: "1.2rem",
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
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {(subtopics[activeChapter] || []).map((topic, j) => (
                <button
                  key={j}
                  onClick={() => handleSubtopicClick(topic)}
                  onMouseEnter={() => setHoveredSubtopic(j)}
                  onMouseLeave={() => setHoveredSubtopic(null)}
                  style={{
                    padding: "1rem 1.5rem",
                    borderRadius: "10px",
                    border: "1px solid #ddd",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    background:
                      hoveredSubtopic === j ? "#ecf0f1" : "white",
                    transition: "all 0.3s ease",
                  }}
                >
                  <span style={{ fontWeight: "600" }}>{topic}</span>
                  <span
                    style={{
                      background: "#0984e3",
                      color: "white",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                    }}
                  >
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