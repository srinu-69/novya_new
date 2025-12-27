// src/modules/teacher/StudentReport.js

import React, { useMemo, useState, useEffect } from "react";
import { djangoAPI, API_CONFIG } from '../../config/api';



// ===== helpers for subjects =====

const makeSubject = (q, h, a) => {

  const overall = a || h || q || 0;

  return { quarterly: q || 0, halfYearly: h || 0, annual: a || 0, overall };

};



const baseSubjects = [

  "Telugu",

  "English",

  "Maths",

  "Hindi",

  "Biology",

  "History",

  "Physics",

];



const baseWithChem = [...baseSubjects, "Chemistry"];



const classSubjectMap = {

  "Class 7": baseSubjects,

  "Class 8": baseSubjects,

  "Class 9": baseWithChem,

  "Class 10": baseWithChem,

};



const classOptions = ["Class 7", "Class 8", "Class 9", "Class 10"];



const getSubjectTemplate = (className) => {

  const subjects = classSubjectMap[className] || baseSubjects;

  return subjects.map((name) => ({

    name,

    quarterly: "",

    halfYearly: "",

    annual: "",

  }));

};



// ===== INITIAL STUDENTS =====

const initialStudents = [

  {

    id: 1,

    name: "Aarav Sharma",

    roll: "T101",

    className: "Class 10",

    score: 92,

    change: +4.5,

    subjects: {

      Telugu: makeSubject(88, 90, 92),

      English: makeSubject(92, 94, 96),

      Maths: makeSubject(93, 95, 97),

      Hindi: makeSubject(86, 88, 90),

      Biology: makeSubject(90, 92, 94),

      History: makeSubject(87, 88, 90),

      Physics: makeSubject(93, 95, 96),

      Chemistry: makeSubject(90, 92, 94),

    },

  },

  {

    id: 2,

    name: "Diya Verma",

    roll: "T102",

    className: "Class 10",

    score: 87,

    change: +1.2,

    subjects: {

      Telugu: makeSubject(82, 85, 88),

      English: makeSubject(88, 90, 92),

      Maths: makeSubject(86, 88, 90),

      Hindi: makeSubject(82, 84, 86),

      Biology: makeSubject(86, 88, 90),

      History: makeSubject(84, 86, 88),

      Physics: makeSubject(88, 90, 92),

      Chemistry: makeSubject(86, 88, 90),

    },

  },

  {

    id: 3,

    name: "Rohan Patel",

    roll: "T103",

    className: "Class 9",

    score: 73,

    change: -2.1,

    subjects: {

      Telugu: makeSubject(68, 70, 72),

      English: makeSubject(70, 72, 74),

      Maths: makeSubject(72, 74, 76),

      Hindi: makeSubject(68, 70, 72),

      Biology: makeSubject(72, 74, 76),

      History: makeSubject(70, 72, 74),

      Physics: makeSubject(72, 74, 75),

      Chemistry: makeSubject(72, 74, 75),

    },

  },

  {

    id: 4,

    name: "Ishita Singh",

    roll: "T104",

    className: "Class 8",

    score: 46,

    change: -6.0,

    subjects: {

      Telugu: makeSubject(40, 42, 44),

      English: makeSubject(44, 46, 48),

      Maths: makeSubject(42, 44, 46),

      Hindi: makeSubject(40, 42, 44),

      Biology: makeSubject(44, 46, 48),

      History: makeSubject(40, 42, 44),

      Physics: makeSubject(44, 46, 48),

    },

  },

  {

    id: 5,

    name: "Mohit Kumar",

    roll: "T105",

    className: "Class 8",

    score: 62,

    change: +0.8,

    subjects: {

      Telugu: makeSubject(58, 60, 62),

      English: makeSubject(60, 62, 64),

      Maths: makeSubject(60, 62, 64),

      Hindi: makeSubject(56, 58, 60),

      Biology: makeSubject(60, 62, 64),

      History: makeSubject(58, 60, 62),

      Physics: makeSubject(62, 64, 66),

    },

  },

  {

    id: 6,

    name: "Sara Khan",

    roll: "T106",

    className: "Class 7",

    score: 32,

    change: -3.4,

    subjects: {

      Telugu: makeSubject(30, 31, 32),

      English: makeSubject(32, 33, 34),

      Maths: makeSubject(31, 32, 33),

      Hindi: makeSubject(28, 29, 30),

      Biology: makeSubject(30, 31, 32),

      History: makeSubject(29, 30, 31),

      Physics: makeSubject(31, 32, 33),

    },

  },

  {

    id: 7,

    name: "Vikram Rao",

    roll: "T107",

    className: "Class 9",

    score: 89,

    change: +5.0,

    subjects: {

      Telugu: makeSubject(86, 88, 90),

      English: makeSubject(88, 90, 92),

      Maths: makeSubject(86, 88, 90),

      Hindi: makeSubject(84, 86, 88),

      Biology: makeSubject(88, 90, 92),

      History: makeSubject(86, 88, 90),

      Physics: makeSubject(90, 92, 94),

      Chemistry: makeSubject(88, 90, 92),

    },

  },

  {

    id: 8,

    name: "Meera Nair",

    roll: "T108",

    className: "Class 7",

    score: 48,

    change: +2.3,

    subjects: {

      Telugu: makeSubject(44, 46, 48),

      English: makeSubject(46, 48, 50),

      Maths: makeSubject(46, 48, 50),

      Hindi: makeSubject(42, 44, 46),

      Biology: makeSubject(46, 48, 50),

      History: makeSubject(44, 46, 48),

      Physics: makeSubject(46, 48, 50),

    },

  },

];



// BANDS

function getBand(score) {

  if (score < 35) return "LOW";

  if (score < 50) return "MID";

  if (score >= 75) return "HIGH";

  return "OTHER";

}



export default function StudentsReport() {

  const [students, setStudents] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [animatedScore, setAnimatedScore] = useState(0);

  const [loading, setLoading] = useState(true);

  const [academicYear, setAcademicYear] = useState("");



  const [showAddForm, setShowAddForm] = useState(false);

  const [showStudentDropdown, setShowStudentDropdown] = useState(false);

  const [showClassDropdown, setShowClassDropdown] = useState(false);



  const [formName, setFormName] = useState("");

  const [formRoll, setFormRoll] = useState("");

  const [formClass, setFormClass] = useState("");

  const [formSubjects, setFormSubjects] = useState(getSubjectTemplate("Class 7"));

  // Fetch students with school test scores
  useEffect(() => {
    fetchStudentsData();
  }, []);

  const fetchStudentsData = async () => {
    try {
      setLoading(true);
      // First, get all students from teacher's school (same as Userlist and Results pages)
      const studentsResponse = await djangoAPI.get(API_CONFIG.DJANGO.AUTH.TEACHER_STUDENTS);
      console.log('📊 Teacher students response:', studentsResponse);
      
      if (!studentsResponse || !studentsResponse.students) {
        setStudents([]);
        return;
      }
      
      // Get current academic year
      const currentYear = new Date().getFullYear();
      const nextYear = currentYear + 1;
      const academicYear = `${currentYear}-${nextYear}`;
      setAcademicYear(academicYear);
      
      // Get school test scores for these students
      const scoresResponse = await djangoAPI.get(API_CONFIG.DJANGO.AUTH.STUDENT_SCHOOL_SCORES);
      console.log('📊 Student school scores response:', scoresResponse);
      console.log('📊 Full response structure:', JSON.stringify(scoresResponse, null, 2));
      
      // Create a map of student_id to scores for quick lookup
      const scoresMap = {};
      if (scoresResponse && scoresResponse.students) {
        scoresResponse.students.forEach((scoreStudent) => {
          const studentId = scoreStudent.id || scoreStudent.student_id;
          scoresMap[studentId] = scoreStudent;
          console.log(`📊 Mapped scores for student ${studentId}:`, {
            name: scoreStudent.name,
            score: scoreStudent.score,
            subjects: scoreStudent.subjects,
            subjectsCount: Object.keys(scoreStudent.subjects || {}).length,
            subjectsKeys: Object.keys(scoreStudent.subjects || {})
          });
        });
      }
      
      console.log(`📊 Total students from TEACHER_STUDENTS: ${studentsResponse.students.length}`);
      console.log(`📊 Total students with scores: ${Object.keys(scoresMap).length}`);
      console.log(`📊 Scores map keys:`, Object.keys(scoresMap));
      
      // Combine student data with school test scores
      const studentsData = studentsResponse.students.map((student) => {
        const studentId = student.student_id;
        const scoreData = scoresMap[studentId] || {};
        
        // Get student basic info (same format as Results page)
        const firstName = student.user_info?.firstname || student.first_name || '';
        const lastName = student.user_info?.lastname || student.last_name || '';
        // Use profile.grade directly from student profile (what was entered in student portal)
        const className = student.profile?.grade || scoreData?.className || 'Class 7';
        
        console.log(`📊 Processing student ${studentId} (${firstName} ${lastName}):`, {
          hasScoreData: !!scoreData,
          hasSubjects: !!scoreData.subjects,
          subjectsCount: Object.keys(scoreData.subjects || {}).length,
          score: scoreData.score,
          scoreDataKeys: Object.keys(scoreData),
          subjectsData: scoreData.subjects,
          profileGrade: student.profile?.grade,
          className: className
        });
        
        // Get subjects from school test scores
        const subjects = {};
        if (scoreData && scoreData.subjects && Object.keys(scoreData.subjects).length > 0) {
          console.log(`  ✅ Found ${Object.keys(scoreData.subjects).length} subjects in scoreData`);
          Object.entries(scoreData.subjects).forEach(([subjectName, subjectData]) => {
            console.log(`  📝 Processing subject ${subjectName}:`, subjectData);
            // Handle both object format and direct values
            let quarterly = 0, halfYearly = 0, annual = 0;
            if (typeof subjectData === 'object' && subjectData !== null) {
              quarterly = subjectData.quarterly || subjectData.quarterly_score || 0;
              halfYearly = subjectData.halfYearly || subjectData.half_yearly_score || 0;
              annual = subjectData.annual || subjectData.annual_score || 0;
            }
            subjects[subjectName] = makeSubject(quarterly, halfYearly, annual);
            console.log(`  ✅ Added subject ${subjectName}:`, subjects[subjectName]);
          });
        } else {
          console.log(`  ⚠️ No subjects found in scoreData for student ${studentId}`);
          console.log(`  📋 scoreData structure:`, scoreData);
        }
        
        // If no subjects found, initialize with empty subjects based on class
        if (Object.keys(subjects).length === 0) {
          const subjectTemplate = getSubjectTemplate(className);
          subjectTemplate.forEach((subj) => {
            subjects[subj.name] = makeSubject(0, 0, 0);
          });
          console.log(`  ⚠️ No scores found, initialized empty subjects for ${className}`);
        }
        
        // Calculate overall score from school test scores, or use 0
        const overallScore = scoreData.score || 0;
        
        const studentData = {
          id: studentId,
          student_id: studentId,
          name: `${firstName} ${lastName}`.trim() || 'Unknown',
          roll: `T${String(studentId).padStart(3, '0')}`,
          className: className,
          score: overallScore,
          change: scoreData.change || 0,
          subjects: subjects
        };
        
        console.log(`  ✅ Final student data:`, {
          name: studentData.name,
          score: studentData.score,
          subjectsCount: Object.keys(studentData.subjects).length
        });
        
        return studentData;
      });
      
      setStudents(studentsData);
      console.log(`✅ Set ${studentsData.length} students in state`);
      
      // Set first student as selected if available (only if no student is currently selected)
      if (studentsData.length > 0 && !selectedStudent) {
        setSelectedStudent(studentsData[0]);
        setAnimatedScore(studentsData[0].score || 0);
      } else if (selectedStudent) {
        // If a student was already selected, try to find and update it
        const currentSelected = studentsData.find(s => s.id === selectedStudent.id);
        if (currentSelected) {
          setSelectedStudent(currentSelected);
          setAnimatedScore(currentSelected.score || 0);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching student data:', error);
      // Fallback to empty array on error
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };



  // ===== stats =====

  const { bands, avg, topStudents } = useMemo(() => {

    const b = { LOW: 0, MID: 0, HIGH: 0 };

    let total = 0;



    students.forEach((s) => {

      total += s.score;

      const band = getBand(s.score);

      if (b[band] !== undefined) b[band] += 1;

    });



    const average = students.length ? (total / students.length).toFixed(1) : 0;

    const sorted = [...students].sort((a, c) => c.score - a.score).slice(0, 4);

    return { bands: b, avg: average, topStudents: sorted };

  }, [students]);



  // ===== filtered list =====

  const filteredStudents = useMemo(() => {

    const term = searchTerm.trim().toLowerCase();

    if (!term) return students;

    return students.filter(

      (s) =>

        s.name.toLowerCase().includes(term) ||

        s.roll.toLowerCase().includes(term) ||

        s.className.toLowerCase().includes(term)

    );

  }, [searchTerm, students]);



  // ===== animate big circle =====

  useEffect(() => {

    if (!selectedStudent) return;

    const target = selectedStudent.score || 0;

    let current = 0;

    setAnimatedScore(0);



    const step = target / 30;

    const id = setInterval(() => {

      current += step;

      if (current >= target) {

        setAnimatedScore(target);

        clearInterval(id);

      } else {

        setAnimatedScore(Math.round(current));

      }

    }, 25);



    return () => clearInterval(id);

  }, [selectedStudent]);



  const handleSelectStudent = (student) => {

    setSelectedStudent(student);

  };



  const handleSubjectChange = (index, field, value) => {

    setFormSubjects((prev) => {

      const copy = [...prev];

      copy[index] = { ...copy[index], [field]: value };

      return copy;

    });

  };



  const handlePickExistingStudent = (student) => {

    setFormName(student.name);

    setFormRoll(student.roll);

    setFormClass(student.className);

    // Load existing subjects scores if available
    const subjectTemplate = getSubjectTemplate(student.className);
    const existingSubjects = student.subjects || {};
    
    const subjectsWithScores = subjectTemplate.map((subj) => {
      const existing = existingSubjects[subj.name];
      if (existing) {
        return {
          name: subj.name,
          quarterly: existing.quarterly || existing.quarterly === 0 ? String(existing.quarterly) : '',
          halfYearly: existing.halfYearly || existing.halfYearly === 0 ? String(existing.halfYearly) : '',
          annual: existing.annual || existing.annual === 0 ? String(existing.annual) : ''
        };
      }
      return subj;
    });

    setFormSubjects(subjectsWithScores);

    setShowStudentDropdown(false);

  };



  const handlePickClass = (classLabel) => {

    setFormClass(classLabel);

    setFormSubjects(getSubjectTemplate(classLabel));

    setShowClassDropdown(false);

  };



  const handleSaveNewStudent = async () => {

    if (!formName.trim() || !formRoll.trim() || !formClass.trim()) {

      alert("Please fill student name, roll and class.");

      return;

    }

    // Find student by name or roll
    const existingStudent = students.find(
      (s) => s.name.toLowerCase() === formName.trim().toLowerCase() || 
             s.roll.toLowerCase() === formRoll.trim().toLowerCase()
    );

    if (!existingStudent) {
      alert("Student not found. Please select an existing student from the dropdown.");
      return;
    }

    const subjectsObj = {};

    formSubjects.forEach((s) => {

      const q = Number(s.quarterly) || 0;

      const h = Number(s.halfYearly) || 0;

      const a = Number(s.annual) || 0;

      subjectsObj[s.name] = { quarterly: q, halfYearly: h, annual: a };

    });

    try {
      // Save to backend
      const response = await djangoAPI.post(API_CONFIG.DJANGO.AUTH.SAVE_SCHOOL_SCORES, {
        student_id: existingStudent.id,
        class_name: formClass.trim(),
        subjects: subjectsObj,
        academic_year: academicYear
      });

      console.log('✅ School scores saved:', response);

      // Refresh data - this will fetch fresh data from the backend
      const savedStudentId = existingStudent.id;
      await fetchStudentsData();
      
      // After fetch completes, update selected student from the new data
      // We need to wait for the state to update, so we'll use a callback approach
      setTimeout(async () => {
        // Re-fetch to get the latest data
        try {
          const scoresResponse = await djangoAPI.get(API_CONFIG.DJANGO.AUTH.STUDENT_SCHOOL_SCORES);
          if (scoresResponse && scoresResponse.students) {
            const updatedStudentData = scoresResponse.students.find(s => (s.id || s.student_id) === savedStudentId);
            if (updatedStudentData) {
              // Convert to the format expected by the component
              const firstName = updatedStudentData.name.split(' ')[0] || '';
              const lastName = updatedStudentData.name.split(' ').slice(1).join(' ') || '';
              const subjects = {};
              if (updatedStudentData.subjects) {
                Object.entries(updatedStudentData.subjects).forEach(([subjectName, subjectData]) => {
                  subjects[subjectName] = makeSubject(
                    subjectData.quarterly || 0,
                    subjectData.halfYearly || 0,
                    subjectData.annual || 0
                  );
                });
              }
              
              const updatedStudent = {
                id: savedStudentId,
                student_id: savedStudentId,
                name: updatedStudentData.name,
                roll: updatedStudentData.roll || `T${String(savedStudentId).padStart(3, '0')}`,
                className: updatedStudentData.className || updatedStudentData.class_name || selectedStudent.className || 'Class 7',
                score: updatedStudentData.score || 0,
                change: updatedStudentData.change || 0,
                subjects: subjects
              };
              
              setSelectedStudent(updatedStudent);
              setAnimatedScore(updatedStudent.score || 0);
              console.log('✅ Updated selected student with new scores:', updatedStudent);
            }
          }
        } catch (error) {
          console.error('❌ Error refreshing student data:', error);
        }
      }, 500);

      alert("Student progress saved successfully!");

      setFormName("");

      setFormRoll("");

      setFormClass("");

      setFormSubjects(getSubjectTemplate("Class 7"));

      setShowAddForm(false);
    } catch (error) {
      console.error('❌ Error saving school scores:', error);
      alert("Failed to save student progress. Please try again.");
    }
  };



  if (loading) {
    return (
      <div style={styles.page}>
        <div style={{ textAlign: 'center', padding: '50px', color: '#6B7280' }}>
          Loading student data...
        </div>
      </div>
    );
  }

  return (

    <div style={styles.page}>

      {/* HERO */}

      <div style={styles.hero}>

        <div style={styles.heroLeft}>

          <p style={styles.instituteName}>Novya Institute</p>

          <h1 style={styles.heroTitle}>Student Performance Overview</h1>

          <p style={styles.heroSubtitle}>

            Classwise performance summary and leaderboard

          </p>

        </div>

        <div style={styles.heroRight}>

          <div style={styles.heroPill}>

            <span style={styles.heroPillLabel}>Average Score</span>

            <span style={styles.heroPillValue}>{avg}%</span>

          </div>

          <div style={styles.heroPill}>

            <span style={styles.heroPillLabel}>Total Students</span>

            <span style={styles.heroPillValue}>{students.length}</span>

          </div>



          <button

            type="button"

            onClick={() => setShowAddForm((prev) => !prev)}

            style={styles.addButton}

          >

            {showAddForm ? "Close" : "Add student progress"}

          </button>

        </div>

      </div>



      {/* ADD FORM */}

      {showAddForm && (

        <div style={styles.addForm}>

          <div style={styles.addFormHeader}>

            <span style={styles.addFormTitle}>Add student progress</span>

            <span style={styles.addFormHint}>

              Enter scores for each term. Overall score is auto-calculated.

            </span>

          </div>



          <div style={styles.addFormRow}>

            {/* student name + dropdown */}

            <div style={styles.addFieldStudent}>

              <label style={styles.addLabel}>Student name</label>

              <div style={styles.addInputWithIcon}>

                <input

                  value={formName}

                  onChange={(e) => setFormName(e.target.value)}

                  style={{ ...styles.addInput, paddingRight: "32px" }}

                  placeholder="e.g., Krishna Rao"

                />

                <button

                  type="button"

                  onClick={() =>

                    setShowStudentDropdown((prev) => !prev)

                  }

                  style={styles.dropdownButton}

                >

                  ▼

                </button>

                {showStudentDropdown && (

                  <div style={styles.studentDropdown}>

                    <div style={styles.studentDropdownHeader}>

                      Total students: {students.length}

                    </div>

                    {students.map((s) => (

                      <div

                        key={s.id}

                        style={styles.studentDropdownItem}

                        onClick={() => handlePickExistingStudent(s)}

                      >

                        {s.name}

                        <span style={styles.studentDropdownMeta}>

                          {" "}

                          • {s.className} • {s.roll}

                        </span>

                      </div>

                    ))}

                  </div>

                )}

              </div>

            </div>



            {/* roll */}

            <div style={styles.addField}>

              <label style={styles.addLabel}>Roll number</label>

              <input

                value={formRoll}

                onChange={(e) => setFormRoll(e.target.value)}

                style={styles.addInput}

                placeholder="e.g., T109"

              />

            </div>



            {/* CLASS – readOnly dropdown, no typing */}

            <div style={styles.addFieldClass}>

              <label style={styles.addLabel}>Class</label>

              <div style={styles.addInputWithIcon}>

                <input

                  value={formClass}

                  readOnly

                  onClick={() =>

                    setShowClassDropdown((prev) => !prev)

                  }

                  style={{

                    ...styles.addInput,

                    paddingRight: "32px",

                    cursor: "pointer",

                  }}

                  placeholder="Select class"

                />

                <button

                  type="button"

                  onClick={() =>

                    setShowClassDropdown((prev) => !prev)

                  }

                  style={styles.dropdownButton}

                >

                  ▼

                </button>



                {showClassDropdown && (

                  <div style={styles.classDropdown}>

                    <div style={styles.classDropdownHeader}>Choose class</div>

                    {classOptions.map((cls) => (

                      <div

                        key={cls}

                        style={styles.classDropdownItem}

                        onClick={() => handlePickClass(cls)}

                      >

                        {cls}

                      </div>

                    ))}

                  </div>

                )}

              </div>

            </div>

          </div>



          {/* subjects grid */}

          <div style={styles.subjectFormWrapper}>

            <div style={styles.subjectFormHeaderRow}>

              <span style={{ flex: 1.4 }}>Subject</span>

              <span style={{ flex: 1 }}>Quarterly</span>

              <span style={{ flex: 1 }}>Half-yearly</span>

              <span style={{ flex: 1 }}>Annually</span>

            </div>

            {formSubjects.map((s, index) => (

              <div key={s.name} style={styles.subjectFormRow}>

                <div style={{ flex: 1.4, fontSize: 13, color: "#111827" }}>

                  {s.name}

                </div>

                <div style={{ flex: 1 }}>

                  <input

                    type="number"

                    min="0"

                    max="100"

                    value={s.quarterly}

                    onChange={(e) =>

                      handleSubjectChange(index, "quarterly", e.target.value)

                    }

                    style={styles.addInput}

                    

                  />

                </div>

                <div style={{ flex: 1 }}>

                  <input

                    type="number"

                    min="0"

                    max="100"

                    value={s.halfYearly}

                    onChange={(e) =>

                      handleSubjectChange(index, "halfYearly", e.target.value)

                    }

                    style={styles.addInput}

            

                  />

                </div>

                <div style={{ flex: 1 }}>

                  <input

                    type="number"

                    min="0"

                    max="100"

                    value={s.annual}

                    onChange={(e) =>

                      handleSubjectChange(index, "annual", e.target.value)

                    }

                    style={styles.addInput}

                    

                  />

                </div>

              </div>

            ))}

          </div>



          <div style={styles.addFooter}>

            <button

              type="button"

              onClick={handleSaveNewStudent}

              style={styles.saveButton}

            >

              Save student progress

            </button>

          </div>

        </div>

      )}



      {/* MAIN CONTENT */}

      <div style={styles.contentWrapper}>

        <div style={styles.topRow}>

          {/* left card */}

          <div style={styles.mainCard}>

            <div style={styles.mainCardTop}>

              <div style={styles.circleWrapper}>

                <div style={styles.outerCircle}>

                  <div style={styles.innerCircle}>

                    <span style={styles.circleNum}>{avg}%</span>

                    <span style={styles.circleText}>Class Avg</span>

                  </div>

                </div>

                <p style={styles.circleCaption}>

                  Overall performance of the class

                </p>

              </div>



              <div style={styles.trendWrapper}>

                <p style={styles.trendTitle}>Attendance trend</p>

                <div style={styles.fakeChart}>

                  {[60, 72, 75, 68, 80, 85, 78].map((h, i) => (

                    <div key={i} style={{ ...styles.fakeBar, height: `${h}%` }} />

                  ))}

                </div>

                <div style={styles.trendFooter}>

                  <span style={styles.trendLabel}>Last 7 sessions</span>

                  <span style={styles.trendValue}>Steady improvement</span>

                </div>

              </div>

            </div>



            <div style={styles.bandRow}>

              <div style={{ ...styles.bandCard, borderBottomColor: "#FF6B6B" }}>

                <p style={styles.bandTitle}>Below 35%</p>

                <p style={styles.bandCount}>{bands.LOW}</p>

                <p style={styles.bandDesc}>

                  Critical zone – needs immediate support.

                </p>

              </div>

              <div style={{ ...styles.bandCard, borderBottomColor: "#FFB020" }}>

                <p style={styles.bandTitle}>35% – 50%</p>

                <p style={styles.bandCount}>{bands.MID}</p>

                <p style={styles.bandDesc}>

                  Improving – focus on practice.

                </p>

              </div>

              <div style={{ ...styles.bandCard, borderBottomColor: "#34C759" }}>

                <p style={styles.bandTitle}>Above 75%</p>

                <p style={styles.bandCount}>{bands.HIGH}</p>

                <p style={styles.bandDesc}>

                  High performers leading the class.

                </p>

              </div>

            </div>

          </div>



          {/* leaderboard */}

          <div style={styles.leaderCard}>

            <p style={styles.leaderTitle}>Class leaderboard</p>

            <p style={styles.leaderSubtitle}>Top performing students</p>

            <div style={styles.leaderList}>

              {topStudents.map((s, index) => (

                <div

                  key={s.id}

                  style={styles.leaderRow}

                  onClick={() => handleSelectStudent(s)}

                >

                  <div style={styles.avatar}>

                    {s.name

                      .split(" ")

                      .map((p) => p[0])

                      .join("")

                      .slice(0, 2)}

                  </div>

                  <div style={styles.leaderInfo}>

                    <span style={styles.leaderName}>{s.name}</span>

                    <span style={styles.leaderMeta}>

                      {s.className} • Roll {s.roll}

                    </span>

                  </div>

                  <div style={styles.leaderScore}>{s.score}%</div>

                  <span style={styles.leaderRank}>#{index + 1}</span>

                </div>

              ))}

            </div>

            {/* name changed as requested */}

            <button style={styles.leaderButton}>Top scored</button>

          </div>

        </div>



        {/* bottom row */}

        <div style={styles.bottomRow}>

          {/* table */}

          <div style={styles.tableCard}>

            <div style={styles.tableTopBar}>

              <span style={styles.tableTitle}>Students list</span>

              <input

                type="text"

                placeholder="Search by name, roll, class"

                value={searchTerm}

                onChange={(e) => setSearchTerm(e.target.value)}

                style={styles.searchInput}

              />

            </div>



            <div style={styles.tableHeader}>

              <span style={{ ...styles.col, flex: 2 }}>Student</span>

              <span style={styles.col}>Roll</span>

              <span style={styles.col}>Class</span>

              <span style={styles.col}>Score</span>

              <span style={styles.col}>Change</span>

              <span style={{ ...styles.col, flex: 1.4 }}>Band</span>

            </div>



            {filteredStudents.map((student) => {

              const band = getBand(student.score);

              const trendUp = student.change >= 0;



              let bandText = "Average";

              let bandStyle = styles.bandNeutralTag;



              if (band === "LOW") {

                bandText = "Below 35%";

                bandStyle = styles.bandLowTag;

              } else if (band === "MID") {

                bandText = "35% – 50%";

                bandStyle = styles.bandMidTag;

              } else if (band === "HIGH") {

                bandText = "Above 75%";

                bandStyle = styles.bandHighTag;

              }



              const barColor =

                band === "LOW"

                  ? "#FF6B6B"

                  : band === "MID"

                  ? "#FFB020"

                  : band === "HIGH"

                  ? "#34C759"

                  : "#4C6FFF";



              return (

                <div

                  key={student.id}

                  style={styles.row}

                  onClick={() => handleSelectStudent(student)}

                >

                  <div style={{ ...styles.col, flex: 2 }}>

                    <div style={styles.rowStudent}>

                      <div style={styles.rowAvatar}>

                        {student.name

                          .split(" ")

                          .map((p) => p[0])

                          .join("")

                          .slice(0, 2)}

                      </div>

                      <div>

                        <div style={styles.name}>{student.name}</div>

                        <div style={styles.subName}>ID: {student.id}</div>

                      </div>

                    </div>

                  </div>



                  <div style={styles.col}>{student.roll}</div>

                  <div style={styles.col}>{student.className}</div>



                  <div style={styles.col}>

                    <div style={styles.scoreWrapper}>

                      <span style={styles.scoreText}>{student.score}%</span>

                      <div style={styles.scoreBarTrack}>

                        <div

                          style={{

                            ...styles.scoreBarFill,

                            width: `${Math.min(student.score, 100)}%`,

                            backgroundColor: barColor,

                          }}

                        />

                      </div>

                    </div>

                  </div>



                  <div style={styles.col}>

                    <span

                      style={{

                        ...styles.changeChip,

                        color: trendUp ? "#34C759" : "#FF6B6B",

                        backgroundColor: trendUp ? "#E7F9ED" : "#FFE8E8",

                      }}

                    >

                      {trendUp ? "▲" : "▼"} {Math.abs(student.change).toFixed(1)}%

                    </span>

                  </div>



                  <div style={{ ...styles.col, flex: 1.4 }}>

                    <span style={bandStyle}>{bandText}</span>

                  </div>

                </div>

              );

            })}

          </div>



          {/* detail panel */}

          <div style={styles.detailCard}>

            <p style={styles.detailTitle}>Student report</p>

            {selectedStudent ? (

              <>

                <div style={styles.detailHeader}>

                  <div style={styles.detailAvatar}>

                    {selectedStudent.name

                      .split(" ")

                      .map((p) => p[0])

                      .join("")

                      .slice(0, 2)}

                  </div>

                  <div>

                    <p style={styles.detailName}>{selectedStudent.name}</p>

                    <p style={styles.detailMeta}>

                      {selectedStudent.className} • Roll {selectedStudent.roll}

                    </p>

                  </div>

                </div>



                <div style={styles.detailCircleWrapper}>

                  <div style={styles.detailOuterCircle}>

                    <div

                      style={{

                        ...styles.detailProgressFill,

                        transform: `rotate(${(animatedScore / 100) * 360}deg)`,

                      }}

                    />

                    <div style={styles.detailInnerCircle}>

                      <span style={styles.detailScoreText}>

                        {animatedScore}%

                      </span>

                      <span style={styles.detailScoreLabel}>Overall</span>

                    </div>

                  </div>

                </div>



                <p style={styles.subjectTitle}>Subjects performance</p>

                <div style={styles.subjectList}>

                  {Object.entries(selectedStudent.subjects || {}).map(

                    ([subject, value]) => {

                      const data =

                        value && typeof value === "object"

                          ? value

                          : {

                              quarterly: value || 0,

                              halfYearly: value || 0,

                              annual: value || 0,

                              overall: value || 0,

                            };

                      const overall =

                        data.overall ??

                        data.annual ??

                        data.halfYearly ??

                        data.quarterly;



                      return (

                        <div key={subject} style={styles.subjectRow}>

                          <div style={styles.subjectName}>{subject}</div>

                          <div style={styles.subjectScore}>{overall}%</div>

                          <div>

                            <div style={styles.subjectTrack}>

                              <div

                                style={{

                                  ...styles.subjectFill,

                                  width: `${overall}%`,

                                }}

                              />

                            </div>

                            <div style={styles.termChipsRow}>

                              <span style={styles.termChip}>

                                Q: {data.quarterly}

                              </span>

                              <span style={styles.termChip}>

                                HY: {data.halfYearly}

                              </span>

                              <span style={styles.termChip}>

                                AN: {data.annual}

                              </span>

                            </div>

                          </div>

                        </div>

                      );

                    }

                  )}

                </div>

              </>

            ) : (

              <p style={styles.noStudent}>Select a student to view details.</p>

            )}

          </div>

        </div>

      </div>

    </div>

  );

}



/* ===== STYLES ===== */

const styles = {

  page: {

    minHeight: "100vh",

    backgroundColor: "#F5F6FB",

    padding: "20px 24px",

    marginLeft: "260px",

    width: "calc(100% - 260px)",

    boxSizing: "border-box",

    fontFamily:

      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",

  },



  hero: {

    background: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 45%, #F97316 100%)",

    borderRadius: "18px",

    padding: "18px 22px",

    color: "#FFFFFF",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "flex-start",

    gap: 16,

  },

  heroLeft: {

    display: "flex",

    flexDirection: "column",

    gap: 6,

  },

  instituteName: {

    margin: 0,

    fontSize: 12,

    opacity: 1,

    color: "White",

  },

  heroTitle: {

    margin: 0,

    fontSize: 24,

    fontWeight: 700,

    color: "White",

    textShadow: "0 1px 3px rgba(255, 255, 255, 0.6)",

  },

  heroSubtitle: {

    margin: 0,

    fontSize: 14,

    color: "White",

  },

  heroRight: {

    display: "flex",

    gap: 12,

    alignItems: "center",

  },

  heroPill: {

    backgroundColor: "rgba(233, 218, 218, 0.18)",

    borderRadius: 999,

    padding: "8px 14px",

    display: "flex",

    flexDirection: "column",

    minWidth: 110,

  },

  heroPillLabel: {

    fontSize: 11,

    opacity: 0.9,

  },

  heroPillValue: {

    fontSize: 16,

    fontWeight: 600,

  },



  addButton: {

    borderRadius: 999,

    padding: "8px 14px",

    border: "none",

    fontSize: 12,

    fontWeight: 500,

    cursor: "pointer",

    backgroundColor: "#FFFFFF",

    color: "#EC4899",

    boxShadow: "0 2px 6px rgba(245, 246, 249, 0.76)",

    whiteSpace: "nowrap",

  },



  addForm: {

    marginTop: 12,

    marginBottom: 10,

    backgroundColor: "#FFFFFF",

    borderRadius: 18,

    padding: 16,

    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",

  },

  addFormHeader: {

    marginBottom: 10,

  },

  addFormTitle: {

    fontSize: 15,

    fontWeight: 600,

    color: "#111827",

    marginRight: 8,

  },

  addFormHint: {

    fontSize: 12,

    color: "#6B7280",

  },

  addFormRow: {

    display: "grid",

    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",

    gap: 12,

    marginBottom: 12,

  },

  addField: {

    display: "flex",

    flexDirection: "column",

    gap: 4,

  },

  addFieldStudent: {

    display: "flex",

    flexDirection: "column",

    gap: 4,

    position: "relative",

  },

  addFieldClass: {

    display: "flex",

    flexDirection: "column",

    gap: 4,

    position: "relative",

  },

  addLabel: {

    fontSize: 12,

    color: "#4B5563",

  },

  addInput: {

    padding: "7px 10px",

    borderRadius: 10,

    border: "1px solid #E5E7EB",

    fontSize: 12,

    outline: "none",

    width: "100%",

    boxSizing: "border-box",

  },

  addInputWithIcon: {

    position: "relative",

  },

  dropdownButton: {

    position: "absolute",

    right: 6,

    top: "50%",

    transform: "translateY(-50%)",

    border: "none",

    background: "transparent",

    cursor: "pointer",

    fontSize: 12,

    color: "#6B7280",

    padding: 0,

  },



  studentDropdown: {

    position: "absolute",

    top: "105%",

    left: 0,

    right: 0,

    backgroundColor: "#FFFFFF",

    borderRadius: 12,

    border: "1px solid #E5E7EB",

    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.12)",

    maxHeight: 220,

    overflowY: "auto",

    zIndex: 20,

  },

  studentDropdownHeader: {

    padding: "6px 10px",

    fontSize: 12,

    fontWeight: 600,

    color: "#4B5563",

    borderBottom: "1px solid #E5E7EB",

    backgroundColor: "#F9FAFB",

  },

  studentDropdownItem: {

    padding: "6px 10px",

    fontSize: 12,

    color: "#111827",

    cursor: "pointer",

  },

  studentDropdownMeta: {

    fontSize: 11,

    color: "#6B7280",

  },



  classDropdown: {

    position: "absolute",

    top: "105%",

    left: 0,

    right: 0,

    backgroundColor: "#FFFFFF",

    borderRadius: 12,

    border: "1px solid #E5E7EB",

    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.12)",

    maxHeight: 180,

    overflowY: "auto",

    zIndex: 20,

  },

  classDropdownHeader: {

    padding: "6px 10px",

    fontSize: 12,

    fontWeight: 600,

    color: "#4B5563",

    borderBottom: "1px solid #E5E7EB",

    backgroundColor: "#F9FAFB",

  },

  classDropdownItem: {

    padding: "6px 10px",

    fontSize: 12,

    color: "#111827",

    cursor: "pointer",

  },



  subjectFormWrapper: {

    marginTop: 4,

  },

  subjectFormHeaderRow: {

    display: "flex",

    alignItems: "center",

    fontSize: 12,

    fontWeight: 600,

    color: "#6B7280",

    marginBottom: 6,

  },

  subjectFormRow: {

    display: "flex",

    alignItems: "center",

    gap: 8,

    marginBottom: 6,

  },



  addFooter: {

    marginTop: 12,

    display: "flex",

    justifyContent: "flex-end",

  },

  saveButton: {

    borderRadius: 999,

    padding: "8px 16px",

    border: "none",

    fontSize: 13,

    fontWeight: 500,

    cursor: "pointer",

    background:

      "linear-gradient(135deg, #4F46E5 0%, #EC4899 60%, #F97316 100%)",

    color: "#FFFFFF",

  },



  contentWrapper: {

    marginTop: 18,

    display: "flex",

    flexDirection: "column",

    gap: 18,

  },



  topRow: {

    display: "grid",

    gridTemplateColumns: "2fr 1.1fr",

    gap: 18,

  },



  mainCard: {

    backgroundColor: "#FFFFFF",

    borderRadius: 18,

    padding: 18,

    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",

    display: "flex",

    flexDirection: "column",

    gap: 18,

  },

  mainCardTop: {

    display: "grid",

    gridTemplateColumns: "1.1fr 1.5fr",

    gap: 18,

  },



  circleWrapper: {

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    gap: 10,

  },

  outerCircle: {

    width: 140,

    height: 140,

    borderRadius: "50%",

    background:

      "conic-gradient(#34C759 0deg, #34C759 240deg, #E5E7EB 240deg, #E5E7EB 360deg)",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

  },

  innerCircle: {

    width: 104,

    height: 104,

    borderRadius: "50%",

    backgroundColor: "#FFFFFF",

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    boxShadow: "0 4px 10px rgba(148, 163, 184, 0.35)",

  },

  circleNum: {

    fontSize: 22,

    fontWeight: 700,

    color: "#111827",

  },

  circleText: {

    fontSize: 11,

    color: "#6B7280",

  },

  circleCaption: {

    fontSize: 12,

    color: "#6B7280",

    textAlign: "center",

    margin: 0,

  },



  trendWrapper: {

    display: "flex",

    flexDirection: "column",

    gap: 8,

  },

  trendTitle: {

    margin: 0,

    fontSize: 14,

    fontWeight: 600,

    color: "#111827",

  },

  fakeChart: {

    backgroundColor: "#F3F4FF",

    borderRadius: 14,

    padding: "10px 12px",

    display: "flex",

    alignItems: "flex-end",

    gap: 6,

    height: 110,

  },

  fakeBar: {

    flex: 1,

    borderRadius: 999,

    background:

      "linear-gradient(to top, rgba(79,70,229,0.9), rgba(236,72,153,0.7))",

  },

  trendFooter: {

    display: "flex",

    justifyContent: "space-between",

    marginTop: 4,

  },

  trendLabel: {

    fontSize: 11,

    color: "#6B7280",

  },

  trendValue: {

    fontSize: 11,

    color: "#111827",

    fontWeight: 500,

  },



  bandRow: {

    display: "grid",

    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",

    gap: 12,

  },

  bandCard: {

    backgroundColor: "#F9FAFB",

    borderRadius: 14,

    padding: 12,

    borderBottomWidth: 4,

    borderBottomStyle: "solid",

  },

  bandTitle: {

    margin: 0,

    fontSize: 13,

    fontWeight: 600,

    color: "#111827",

  },

  bandCount: {

    margin: "4px 0",

    fontSize: 20,

    fontWeight: 700,

    color: "#111827",

  },

  bandDesc: {

    margin: 0,

    fontSize: 11,

    color: "#6B7280",

  },



  leaderCard: {

    backgroundColor: "#FFFFFF",

    borderRadius: 18,

    padding: 18,

    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",

    display: "flex",

    flexDirection: "column",

  },

  leaderTitle: {

    margin: 0,

    fontSize: 16,

    fontWeight: 600,

    color: "#111827",

  },

  leaderSubtitle: {

    margin: "4px 0 12px",

    fontSize: 12,

    color: "#6B7280",

  },

  leaderList: {

    display: "flex",

    flexDirection: "column",

    gap: 8,

    marginBottom: 12,

  },

  leaderRow: {

    display: "flex",

    alignItems: "center",

    gap: 10,

    backgroundColor: "#F9FAFB",

    borderRadius: 12,

    padding: "8px 10px",

    cursor: "pointer",

  },

  avatar: {

    width: 32,

    height: 32,

    borderRadius: "50%",

    backgroundColor: "#EEF2FF",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: 13,

    fontWeight: 600,

    color: "#4C1D95",

  },

  leaderInfo: {

    flex: 1,

    display: "flex",

    flexDirection: "column",

  },

  leaderName: {

    fontSize: 13,

    fontWeight: 600,

    color: "#111827",

  },

  leaderMeta: {

    fontSize: 11,

    color: "#6B7280",

  },

  leaderScore: {

    fontSize: 13,

    fontWeight: 600,

    color: "#111827",

    marginRight: 8,

  },

  leaderRank: {

    fontSize: 11,

    backgroundColor: "#EEF2FF",

    color: "#4F46E5",

    padding: "3px 8px",

    borderRadius: 999,

  },

  leaderButton: {

    marginTop: "auto",

    border: "none",

    borderRadius: 999,

    padding: "8px 12px",

    fontSize: 12,

    fontWeight: 500,

    background:

      "linear-gradient(135deg, #4F46E5 0%, #EC4899 60%, #F97316 100%)",

    color: "#FFFFFF",

    cursor: "pointer",

  },



  bottomRow: {

    display: "grid",

    gridTemplateColumns: "2fr 1.1fr",

    gap: 18,

  },



  tableCard: {

    backgroundColor: "#FFFFFF",

    borderRadius: 18,

    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",

    overflow: "hidden",

  },

  tableTopBar: {

    display: "flex",

    alignItems: "center",

    justifyContent: "space-between",

    padding: "10px 18px 6px",

  },

  tableTitle: {

    fontSize: 14,

    fontWeight: 600,

    color: "#111827",

  },

  searchInput: {

    padding: "6px 10px",

    borderRadius: 999,

    border: "1px solid #E5E7EB",

    fontSize: 12,

    outline: "none",

    width: 230,

  },



  tableHeader: {

    display: "flex",

    padding: "10px 18px",

    backgroundColor: "#F3F4F6",

    fontSize: 11,

    fontWeight: 600,

    color: "#6B7280",

    textTransform: "uppercase",

    letterSpacing: "0.06em",

  },

  row: {

    display: "flex",

    padding: "10px 18px",

    alignItems: "center",

    fontSize: 13,

    borderTop: "1px solid #F3F4F6",

    cursor: "pointer",

  },

  col: {

    flex: 1,

    minWidth: 60,

  },

  rowStudent: {

    display: "flex",

    alignItems: "center",

    gap: 10,

  },

  rowAvatar: {

    width: 30,

    height: 30,

    borderRadius: "50%",

    backgroundColor: "#EEF2FF",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: 12,

    fontWeight: 600,

    color: "#4C1D95",

  },

  name: {

    fontWeight: 500,

    marginBottom: 2,

    color: "#111827",

  },

  subName: {

    fontSize: 11,

    color: "#9CA3AF",

  },



  scoreWrapper: {

    display: "flex",

    flexDirection: "column",

    gap: 4,

  },

  scoreText: {

    fontWeight: 500,

    color: "#111827",

  },

  scoreBarTrack: {

    width: "100%",

    height: 6,

    borderRadius: 999,

    backgroundColor: "#E5E7EB",

    overflow: "hidden",

  },

  scoreBarFill: {

    height: "100%",

    borderRadius: 999,

    transition: "width 0.3s ease",

  },



  changeChip: {

    fontSize: 11,

    padding: "3px 8px",

    borderRadius: 999,

    display: "inline-flex",

    alignItems: "center",

    gap: 4,

  },



  bandLowTag: {

    fontSize: 11,

    padding: "4px 10px",

    borderRadius: 999,

    backgroundColor: "#FFE8E8",

    color: "#C53030",

  },

  bandMidTag: {

    fontSize: 11,

    padding: "4px 10px",

    borderRadius: 999,

    backgroundColor: "#FFF4E5",

    color: "#C05621",

  },

  bandHighTag: {

    fontSize: 11,

    padding: "4px 10px",

    borderRadius: 999,

    backgroundColor: "#E7F9ED",

    color: "#2F855A",

  },

  bandNeutralTag: {

    fontSize: 11,

    padding: "4px 10px",

    borderRadius: 999,

    backgroundColor: "#E5E7EB",

    color: "#374151",

  },



  detailCard: {

    backgroundColor: "#FFFFFF",

    borderRadius: 18,

    padding: 18,

    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",

    display: "flex",

    flexDirection: "column",

  },

  detailTitle: {

    margin: 0,

    fontSize: 16,

    fontWeight: 600,

    color: "#111827",

    marginBottom: 10,

  },

  detailHeader: {

    display: "flex",

    alignItems: "center",

    gap: 10,

    marginBottom: 10,

  },

  detailAvatar: {

    width: 40,

    height: 40,

    borderRadius: "50%",

    backgroundColor: "#EEF2FF",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: 14,

    fontWeight: 600,

    color: "#4C1D95",

  },

  detailName: {

    margin: 0,

    fontSize: 15,

    fontWeight: 600,

    color: "#111827",

  },

  detailMeta: {

    margin: 0,

    fontSize: 12,

    color: "#6B7280",

  },



  detailCircleWrapper: {

    display: "flex",

    justifyContent: "center",

    marginTop: 10,

    marginBottom: 12,

  },

  detailOuterCircle: {

    width: 130,

    height: 130,

    borderRadius: "50%",

    backgroundColor: "#E5E7EB",

    position: "relative",

    overflow: "hidden",

  },

  detailProgressFill: {

    position: "absolute",

    width: "100%",

    height: "100%",

    background: "conic-gradient(#34C759 0deg, #34C759 360deg)",

    transformOrigin: "center center",

    transition: "transform 0.4s ease",

  },

  detailInnerCircle: {

    position: "absolute",

    inset: 12,

    borderRadius: "50%",

    backgroundColor: "#FFFFFF",

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

  },

  detailScoreText: {

    fontSize: 22,

    fontWeight: 700,

    color: "#111827",

  },

  detailScoreLabel: {

    fontSize: 11,

    color: "#6B7280",

  },



  subjectTitle: {

    fontSize: 13,

    fontWeight: 600,

    margin: "6px 0 6px",

    color: "#111827",

  },

  subjectList: {

    display: "flex",

    flexDirection: "column",

    gap: 8,

  },

  subjectRow: {

    display: "grid",

    gridTemplateColumns: "1.3fr 0.4fr 2.3fr",

    alignItems: "flex-start",

    gap: 6,

  },

  subjectName: {

    fontSize: 12,

    color: "#374151",

  },

  subjectScore: {

    fontSize: 12,

    fontWeight: 600,

    color: "#111827",

  },

  subjectTrack: {

    width: "100%",

    height: 6,

    borderRadius: 999,

    backgroundColor: "#E5E7EB",

    overflow: "hidden",

  },

  subjectFill: {

    height: "100%",

    borderRadius: 999,

    background:

      "linear-gradient(90deg, #4F46E5 0%, #EC4899 60%, #F97316 100%)",

  },

  termChipsRow: {

    marginTop: 4,

    display: "flex",

    gap: 4,

    flexWrap: "wrap",

  },

  termChip: {

    fontSize: 10,

    padding: "2px 6px",

    borderRadius: 999,

    backgroundColor: "#F3F4F6",

    color: "#4B5563",

  },

  noStudent: {

    fontSize: 13,

    color: "#6B7280",

  },

};

