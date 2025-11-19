
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  GraduationCap,
  Clock,
  CheckCircle,
  Circle,
  Calendar,
  BookOpen,
  Video,
  X,
  Target,
  TrendingUp,
  ArrowLeft,
  Calculator,
  Atom,
  FileText,
  Users,
  Code
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
 
const StudyPlanner = () => {
  const { t } = useTranslation();
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
 
  const navigate = useNavigate();
  const { subject } = useParams();
  const [selectedSubject, setSelectedSubject] = useState(subject || '');
  const [planner, setPlanner] = useState([]);
 
  // Subjects
  const subjects = [
    { name: t('Maths'), icon: Calculator, color: '#f4a468', description: t('MathDescription') },
    { name: t('Science'), icon: Atom, color: '#4ECDC4', description: t('ScienceDescription') },
    { name: t('English'), icon: FileText, color: '#FF6B6B', description: t('EnglishDescription') },
    { name: t('Social'), icon: Users, color: '#6A0572', description: t('SocialDescription') },
    { name: t('Computer'), icon: Code, color: '#45B7D1', description: t('ComputerDescription') },
  ];
 
  // Videos (static data)
  const videos = {
    Maths: {
      1: { title: "Large Numbers", file: "/videos/Maths/chapter-1.mp4", about: "Learn about large numbers, their place values, and representation." },
      2: { title: "Arithmetic Expressions", file: "/videos/Maths/chapter-2.mp4", about: "Understand arithmetic expressions and step-by-step solving." },
      3: { title: "Peek Point", file: "/videos/Maths/chapter-3.mp4", about: "Explore fundamental geometry concepts like points, lines, and rays." },
      4: { title: "Number Expressions", file: "/videos/Maths/chapter-4.mp4", about: "Dive into solving simple algebraic equations with one variable." },
      5: { title: "Lines and Angles", file: "/videos/Maths/chapter-5.mp4", about: "Introduction to lines, line segments, rays, and basic angles." },
    },
    Science: {
      1: { title: "Age of Science", file: "/videos/science/chapter-1.mp4", about: "Discover the role of science in human progress and historical context." },
      2: { title: "Substances", file: "/videos/science/chapter-2.mp4", about: "Learn about different states of matter and their properties." },
      3: { title: "Electricity Basics", file: "/videos/science/chapter-3.mp4", about: "Basics of electricity, current, circuits, and components." },
      4: { title: "Metals & Non-metals", file: "/videos/science/chapter-4.mp4", about: "Study the properties, uses, and differences between metals and non-metals." },
      5: { title: "Physical & Chemical Changes", file: "/videos/science/chapter-5.mp4", about: "Differentiate physical changes from chemical changes with examples." },
    },
    Social: {
      1: { title: "Tracing Changes", file: "/videos/social/chapter1.mp4", about: "Explore historical changes and sources over a thousand years in India." },
      2: { title: "New Kings & Kingdoms", file: "/videos/social/chpter2social.mp4", about: "Learn about the rise of various kingdoms in medieval India." },
      3: { title: "The Delhi Sultans", file: "/videos/social/social_ch3.mp4", about: "Know about the Delhi Sultans, their administration, and monuments." },
      4: { title: "The Mughal Empire", file: "/videos/social/social_ch4.mp4", about: "A detailed look into the Mughal Empire, its rulers, and policies." },
      5: { title: "Rulers and Buildings", file: "/videos/social/social_ch5.mp4", about: "Study the architectural marvels and ruling strategies of various historical rulers." },
    },
    English: {
      1: { title: "Learning Together", file: "/videos/english/7th english unit -1.mp4", about: "Understand the basics of nouns, pronouns, and their usage in sentences." },
      2: { title: "Wit And Humour", file: "/videos/english/english_2.mp4", about: "Explore verbs, different tenses, and how they change meaning." },
      3: { title: "Dreams And Discoveries", file: "/videos/english/english_3.mp4", about: "Learn to identify and use adjectives and adverbs to describe words effectively." },
      4: { title: "Travel And Adventure", file: "/videos/english/english_4.mp4", about: "Understand prepositions and conjunctions in joining sentences." },
      5: { title: "Brave Hearts", file: "/videos/english/english_5.mp4", about: "Master different sentence structures and punctuation marks." },
    },
    Computer: {
      1: { title: "Microsoft Word", file: "/videos/Computer/chapter-1.mp4", about: "Microsoft Word basics for creating and editing documents." },
      2: { title: "Text Editing", file: "/videos/Computer/chapter-2.mp4", about: "Editing and formatting text efficiently." },
      3: { title: "MS Word Pictures", file: "/videos/Computer/chapter-3.mp4", about: "Insert and format pictures in Word documents." },
      4: { title: "MS Word Smart Art", file: "/videos/Computer/chapter-4.mp4", about: "Use SmartArt to create diagrams and visuals." },
      5: { title: "Smart Art Editing", file: "/videos/Computer/chapter-5.mp4", about: "Edit SmartArt with shapes, layouts, and text." },
    }
  };
 
  useEffect(() => {
    if (subject) {
      setSelectedSubject(subject);
      const generatedPlanner = generateStudyPlanner(subject);
      setPlanner(generatedPlanner);
    }
  }, [subject]);
 
  const generateStudyPlanner = (subjectName) => {
    const planner = [];
    let id = 1;
    const subjectVideos = videos[subjectName];
    if (subjectVideos) {
      Object.keys(subjectVideos).forEach(chapterNumber => {
        const chapter = subjectVideos[chapterNumber];
        const subjectObj = subjects.find(s => s.name === subjectName);
        planner.push({
          id: id++,
          date: `2025-07-${chapterNumber}`,
          subject: subjectName,
          topic: chapter.title,
          videoLink: chapter.file,
          about: chapter.about,
          completed: false,
          duration: '45 mins',
          difficulty: t('medium'),
          priority: t('high'),
          color: subjectObj ? subjectObj.color : '#6A0572',
        });
      });
    }
    return planner;
  };
 
  const handleSubjectClick = (subjectObj) => {
    navigate(`/parent/dashboard/studyplanner/${subjectObj.name}`);
  };
 
  const handleBackToSubjects = () => {
    setSelectedSubject('');
    setPlanner([]);
    navigate('/parent/dashboard/studyplanner');
  };
 
  const handleVideoClick = (videoUrl, plan) => {
    setCurrentVideo(videoUrl);
    setSelectedPlan(plan);
    setShowVideoModal(true);
  };
 
  const handleCloseModal = () => {
    setShowVideoModal(false);
    setCurrentVideo('');
    setSelectedPlan(null);
  };
 
  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case t('easy').toLowerCase(): return '#28a745';
      case t('medium').toLowerCase(): return '#ffc107';
      case t('hard').toLowerCase(): return '#dc3545';
      default: return '#6c757d';
    }
  };
 
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case t('high').toLowerCase(): return '#dc3545';
      case t('medium').toLowerCase(): return '#ffc107';
      case t('low').toLowerCase(): return '#28a745';
      default: return '#6c757d';
    }
  };
 
  const completedCount = planner.filter(item => item.completed).length;
  const totalHours = planner.reduce((total, item) => {
    const hours = parseInt(item.duration.split(' ')[0]);
    return total + hours;
  }, 0);
 
  const currentSubjectObj = subjects.find(s => s.name === selectedSubject);
 
  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '2rem 0' }}>
      <div className="container">
        <div className="row mb-4">
          <div className="col-12 text-center">
            <h1 className="fw-bold">{t('studyPlanner')}</h1>
            <p className="text-muted">{t('childLearningSchedule')}</p>
          </div>
 
          {selectedSubject ? (
            <div className="d-flex justify-content-between mb-4">
              <button className="btn btn-outline-secondary" onClick={handleBackToSubjects}>
                <ArrowLeft size={18} className="me-2" />
                {t('backToSubjects')}
              </button>
            </div>
          ) : (
            <div className="row g-4">
              <div className="col-md-4 text-center">
                <h3>{subjects.length}</h3>
                <p>{t('All Subjects')}</p>
              </div>
              <div className="col-md-4 text-center">
                <h3>5h+</h3>
                <p>{t('totalStudyContent')}</p>
              </div>
              <div className="col-md-4 text-center">
                <h3>25+</h3>
                <p>{t('videoLessons')}</p>
              </div>
            </div>
          )}
        </div>
 
        {/* Subject Selection */}
        {!selectedSubject ? (
          <div className="row g-4">
            {subjects.map((subject) => {
              const IconComponent = subject.icon;
              return (
                <div key={subject.name} className="col-md-4">
                  <div className="card p-3" onClick={() => handleSubjectClick(subject)} style={{ cursor: 'pointer' }}>
                    <IconComponent size={24} style={{ color: subject.color }} />
                    <h6 className="mt-2">{subject.name}</h6>
                    <p className="small text-muted">{subject.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <>
            <h5>{selectedSubject} {t('studyPlanner')}</h5>
            <div className="row g-4">
              {planner.map((item) => (
                <div key={item.id} className="col-md-6">
                  <div className="card p-3">
                    <h6>{t('subject')}: {item.subject}</h6>
                    <p>{item.topic}</p>
                    <button className="btn btn-primary" onClick={() => handleVideoClick(item.videoLink, item)}>
                      <Video size={14} className="me-2" /> {t('watchVideo')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
 
      {/* Video Modal */}
      {showVideoModal && (
        <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.8)' }} onClick={handleCloseModal}>
          <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5>{t('watchVideo')}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <video src={currentVideo} controls style={{ width: '100%' }}></video>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default StudyPlanner;
 