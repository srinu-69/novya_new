
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import syllabus from './Syllabus';

const colors = {
  backgroundStart: '#f9fafb',
  backgroundEnd: '#e5e7eb',
  cardBackground: '#ffffff',
  cardHoverBackground: '#f0f9ff',
  border: '#d1d5db',
  mainBlue: '#2563eb',
  accent: '#14b8a6',
  textPrimary: '#111827',
  textSecondary: '#4b5563',
  badgeBackgrounds: {
    Foundation: '#daf0ff',
    Core: '#bbdefb',
    Advanced: '#90caf9',
    Biology: '#c8e6c9',
    Chemistry: '#bbdefb',
    Physics: '#ffcdd2',
    Computer: '#e1bee7',
    English: '#ffecb3',
    'Social Science': '#b2ebf2'
  },
  badgeText: {
    Foundation: '#0c4a6e',
    Core: '#0c4a6e',
    Advanced: '#0c4a6e',
    Biology: '#1b5e20',
    Chemistry: '#0d47a1',
    Physics: '#b71c1c',
    Computer: '#4a148c',
    English: '#ff6f00',
    'Social Science': '#006064'
  }
};

const subjectIcons = {
  english: '📚',
  mathematics: '➗',
  science: '🔬',
  social_science: '🌍',
  computer: '💻',
};

const chapterIcons = [
  '📖', '🧮', '🔍', '✏️', '📊', '⚙️', '🔢', '🧪', '🌱', '💡', '🖥️', '📐', '📏',
];

const pageStyle = {
  minHeight: '100vh',
  width: '100vw',
  background: `linear-gradient(135deg, ${colors.backgroundStart} 0%, ${colors.backgroundEnd} 100%)`,
  fontFamily: "'Inter', 'Poppins', sans-serif",
  color: colors.textPrimary,
  paddingBottom: '5vh',
};

const layoutStyle = {
  maxWidth: 1120,
  margin: '0 auto',
  padding: '0 24px',
};

// Updated back button style to match the practice questions page
const backButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  background: 'transparent',
  border: '1px solid #7e57c2',
  color: '#7e57c2',
  borderRadius: '6px',
  padding: '8px 16px',
  cursor: 'pointer',
  fontWeight: 600,
  transition: 'all 0.2s ease',
};

const backButtonHover = {
  background: '#7e57c2',
  color: 'white',
};

const backButtonWrapper = {
  display: 'flex',
  justifyContent: 'flex-start',
  margin: '20px 0 32px',
  paddingTop: '80px',
};

const mobileBackButtonWrapper = {
  display: 'flex',
  justifyContent: 'flex-start',
  margin: '16px 0 28px',
  paddingTop: '100px',
};

const titleStyle = {
  fontSize: 'clamp(28px, 5vw, 40px)',
  fontWeight: 700,
  margin: '40px 0 12px',
  color: colors.textPrimary,
  textAlign: 'center',
  letterSpacing: '-0.02em',
};

const subtitleStyle = {
  fontSize: 'clamp(14px, 2vw, 18px)',
  color: colors.textSecondary,
  marginBottom: 36,
  fontWeight: 400,
  maxWidth: 720,
  marginLeft: 'auto',
  marginRight: 'auto',
  lineHeight: 1.5,
  textAlign: 'center',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: 24,
  marginBottom: 40,
};

const cardBaseStyle = {
  background: colors.cardBackground,
  borderRadius: 16,
  border: `1px solid ${colors.border}`,
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  padding: 28,
  cursor: 'pointer',
  minHeight: 200,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  transition: 'all 0.3s ease',
  userSelect: 'none',
  position: 'relative',
  overflow: 'hidden',
};

const cardHoverStyle = {
  background: colors.cardHoverBackground,
  boxShadow: '0 8px 24px rgba(20,184,166,0.2)',
  borderColor: colors.accent,
  transform: 'translateY(-6px)',
};

const leftStripeStyle = (color) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: 8,
  backgroundColor: color,
  borderTopLeftRadius: 16,
  borderBottomLeftRadius: 16,
});

const iconBoxStyle = {
  fontSize: 48,
  marginBottom: 20,
  userSelect: 'none',
};

const chapterNumberStyle = {
  fontSize: 14,
  fontWeight: 700,
  color: colors.accent,
  marginBottom: 6,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
};

const cardTitleStyle = {
  fontSize: 20,
  fontWeight: 700,
  color: colors.textPrimary,
  marginBottom: 8,
  lineHeight: 1.2,
};

const cardTextStyle = {
  fontSize: 14,
  color: colors.textSecondary,
  lineHeight: 1.6,
  flexGrow: 1,
};

const badgeStyle = (type) => ({
  display: 'inline-block',
  marginTop: 16,
  background: colors.badgeBackgrounds[type] || colors.badgeBackgrounds['Foundation'],
  color: colors.badgeText[type] || colors.badgeText['Foundation'],
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '0.05em',
  padding: '6px 14px',
  textTransform: 'uppercase',
  alignSelf: 'flex-start',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
});

const PracticeSubjectPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { subjectName, grade } = location.state || {};
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [backHover, setBackHover] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const subjectsArray = Object.entries(syllabus).map(([id, data]) => ({ id, ...data }));

  if (!subjectName) {
    return (
      <div style={pageStyle}>
        <div style={layoutStyle}>
          <div style={isMobile ? mobileBackButtonWrapper : backButtonWrapper}>
            <button
              onClick={() => navigate('/practice')}
              style={{ ...backButtonStyle, ...(backHover ? backButtonHover : {}) }}
              onMouseEnter={() => setBackHover(true)}
              onMouseLeave={() => setBackHover(false)}
              aria-label="Go back"
            >
              <ArrowLeft size={18} />
              Back
            </button>
          </div>

          <h1 style={titleStyle}>Choose a Subject</h1>
          <p style={subtitleStyle}>Select a subject to explore chapters and practice topics.</p>
          <div style={gridStyle}>
            {subjectsArray.map(({ id, name }, index) => {
              const isHovered = hoveredCard === `subject-${index}`;
              return (
                <div
                  key={id}
                  style={{ ...cardBaseStyle, ...(isHovered ? cardHoverStyle : {}) }}
                  onClick={() => navigate('/practice-subject', { state: { subjectName: name, grade: 7 } })}
                  onMouseEnter={() => setHoveredCard(`subject-${index}`)}
                  onMouseLeave={() => setHoveredCard(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select subject ${name}`}
                >
                  <div style={iconBoxStyle}>{subjectIcons[id] || '📘'}</div>
                  <div style={cardTitleStyle}>{name}</div>
                  <div style={cardTextStyle}>Explore chapters and practice questions.</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const subject = Object.values(syllabus).find(s => s.name === subjectName);
  if (!subject) return <div style={{ padding: 60, color: colors.textPrimary }}>Subject not found</div>;

  const gradeKey = parseInt(grade);
  const chaptersForGrade = subject.classes[gradeKey] || [];

  const renderChapters = chapters =>
    chapters.map((ch, index) => {
      const isHovered = hoveredCard === `chapter-${index}`;
      // For science subjects, use the id field (Biology/Chemistry/Physics) as badge type
      const badgeType = subjectName === "Science" ? ch.id : ['Foundation', 'Core', 'Advanced'][index % 3];
      
      return (
        <div
          key={index}
          style={{ ...cardBaseStyle, ...(isHovered ? cardHoverStyle : {}), position: 'relative' }}
          onClick={() => setSelectedChapter(ch)}
          onMouseEnter={() => setHoveredCard(`chapter-${index}`)}
          onMouseLeave={() => setHoveredCard(null)}
          role="button"
          tabIndex={0}
          aria-label={`Open chapter ${ch.name}`}
        >
          <div style={leftStripeStyle(colors.badgeBackgrounds[badgeType] || colors.badgeBackgrounds['Foundation'])} />
          <div style={chapterNumberStyle}>Chapter {index + 1}</div>
          <div style={iconBoxStyle}>{chapterIcons[index % chapterIcons.length]}</div>
          <div style={cardTitleStyle}>{ch.name}</div>
          <div style={cardTextStyle}>
            Explore <b>{ch.subtopics.length}</b> topics with hands-on practice.
          </div>
          <div style={badgeStyle(badgeType)}>{badgeType}</div>
        </div>
      );
    });

  const renderSubtopics = subtopics =>
    subtopics.map((st, index) => {
      const isHovered = hoveredCard === `subtopic-${index}`;
      return (
        <div
          key={st}
          style={{ ...cardBaseStyle, ...(isHovered ? cardHoverStyle : {}), position: 'relative' }}
          onClick={() =>
            navigate('/practice-questions', {
              state: {
                subjectName,
                grade,
                chapter: selectedChapter.name,
                subtopic: st,
              },
            })
          }
          onMouseEnter={() => setHoveredCard(`subtopic-${index}`)}
          onMouseLeave={() => setHoveredCard(null)}
          role="button"
          tabIndex={0}
          aria-label={`Start practice for ${st}`}
        >
          <div style={leftStripeStyle(colors.accent)} />
          <div style={{ ...iconBoxStyle, fontSize: 36, marginBottom: 16 }}>🎯</div>
          <div style={cardTitleStyle}>{st}</div>
          <div style={cardTextStyle}>Interactive practice session</div>
          <div style={badgeStyle('Core')}>Topic</div>
        </div>
      );
    });

  return (
    <div style={pageStyle}>
      <div style={layoutStyle}>
        <div style={isMobile ? mobileBackButtonWrapper : backButtonWrapper}>
          <button
            onClick={() => (selectedChapter ? setSelectedChapter(null) : navigate('/practice'))}
            style={{ ...backButtonStyle, ...(backHover ? backButtonHover : {}) }}
            onMouseEnter={() => setBackHover(true)}
            onMouseLeave={() => setBackHover(false)}
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
            {selectedChapter ? 'Back to Chapters' : 'Back to Subjects'}
          </button>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h1 style={titleStyle}>{selectedChapter ? selectedChapter.name : `${subject.name} · Class ${grade}`}</h1>
          <p style={subtitleStyle}>
            {selectedChapter
              ? 'Choose a topic to begin your learning journey with curated practice sets.'
              : 'Structured modules to strengthen understanding with practice-first learning.'}
          </p>
        </div>

        {!selectedChapter && chaptersForGrade.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: colors.textSecondary }}>
            No chapters available for {subject.name} in class {grade}.
          </div>
        )}

        <div style={gridStyle}>
          {selectedChapter ? renderSubtopics(selectedChapter.subtopics) : renderChapters(chaptersForGrade)}
        </div>
      </div>
    </div>
  );
};

export default PracticeSubjectPage;