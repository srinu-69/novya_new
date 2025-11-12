
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, PlayCircle } from "lucide-react";
import mockTestSyllabus from "./MockTestSyllabus";

const colors = {
  background: "linear-gradient(180deg, #f0f8ff, #ffffff)",
  cardBackground: "#fff",
  border: "#e2e8f0",
  highlight: "#2563eb",
  textPrimary: "#1e293b",
  textSecondary: "#64748b",
  button: "#2563eb",
  buttonHover: "#1e40af",
};

const MockTestSubjectPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { subjectName, grade } = location.state || {};
  const [backHoverMain, setBackHoverMain] = useState(false);
  const [backHoverNotFound, setBackHoverNotFound] = useState(false);

  const subjectsArray = Object.entries(mockTestSyllabus).map(([id, data]) => ({
    id,
    ...data,
  }));
  const subject = subjectsArray.find((s) => s.name === subjectName);

  if (!subject) {
    return (
      <div
        style={{
          padding: "6rem 1rem 2rem",
          textAlign: "center",
          color: colors.textPrimary,
        }}
      >
        <h2>Subject not found</h2>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: backHoverNotFound ? colors.highlight : "transparent",
            border: `1px solid ${colors.highlight}`,
            color: backHoverNotFound ? "white" : colors.highlight,
            borderRadius: "6px",
            padding: "6px 12px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={() => setBackHoverNotFound(true)}
          onMouseLeave={() => setBackHoverNotFound(false)}
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>
    );
  }

  const chaptersForGrade = subject.classes[grade] || [];

  const startTest = (chapter) => {
    navigate("/mock-test-questions", {
      state: {
        subjectName,
        grade,
        chapterName: chapter.name,
      },
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.background,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          padding: "7rem 1rem 2rem",
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        {/* Back Button ABOVE Subject Title */}
        <div style={{ marginBottom: "1.5rem" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: backHoverMain ? colors.highlight : "transparent",
              border: `1px solid ${colors.highlight}`,
              color: backHoverMain ? "white" : colors.highlight,
              borderRadius: "6px",
              padding: "6px 12px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={() => setBackHoverMain(true)}
            onMouseLeave={() => setBackHoverMain(false)}
          >
            <ArrowLeft size={18} /> Back
          </button>
        </div>

        {/* Subject Title */}
        <h1
          style={{
            fontSize: "clamp(26px, 5vw, 34px)",
            fontWeight: 800,
            marginBottom: 8,
            color: colors.textPrimary,
            lineHeight: 1.2,
          }}
        >
          {subject.name}
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 32,
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              background: colors.highlight,
              color: "white",
              padding: "4px 12px",
              borderRadius: 20,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Class {grade}
          </span>
          <span style={{ color: colors.textSecondary, fontSize: 15 }}>
            {chaptersForGrade.length} chapter
            {chaptersForGrade.length !== 1 ? "s" : ""} available
          </span>
        </div>

        {/* Chapters List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {chaptersForGrade.length === 0 && (
            <div
              style={{
                padding: 40,
                textAlign: "center",
                color: colors.textSecondary,
                background: colors.cardBackground,
                borderRadius: 12,
                fontSize: 15,
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              No chapters available for {subject.name} in class {grade}.
            </div>
          )}

          {chaptersForGrade.map((chapter, index) => (
            <div
              key={chapter.id}
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                background: colors.cardBackground,
                padding: "20px 24px",
                border: `1px solid ${colors.border}`,
                borderRadius: 12,
                cursor: "pointer",
                gap: 16,
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                transition: "all 0.2s ease",
              }}
              onClick={() => startTest(chapter)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.highlight;
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.border;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.03)";
              }}
            >
              <div style={{ flex: "1 1 250px", minWidth: 180 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: colors.highlight,
                    marginBottom: 4,
                  }}
                >
                  Chapter {index + 1}
                </div>
                <div
                  style={{
                    fontSize: "clamp(16px, 2vw, 20px)",
                    fontWeight: 700,
                    color: colors.textPrimary,
                    marginBottom: 6,
                  }}
                >
                  {chapter.name}
                </div>
                {chapter.description && (
                  <div style={{ fontSize: 14, color: colors.textSecondary }}>
                    {chapter.description}
                  </div>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startTest(chapter);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: colors.button,
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 16px",
                  fontWeight: 600,
                  cursor: "pointer",
                  flexShrink: 0,
                  minWidth: 120,
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.buttonHover;
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = colors.button;
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <PlayCircle size={18} />
                Start Test
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MockTestSubjectPage;
