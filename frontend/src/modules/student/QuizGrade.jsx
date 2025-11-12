




// import { useNavigate } from 'react-router-dom';
 
// function QuizGrade({ classes, onClassClick }) {
//   const navigate = useNavigate();
//   const gradeIcons = ["🎓", "🎓", "🎓", "🎓"]; // Custom icons for grade cards
 
//   const getClassColor = (cl) => {
//     switch (cl) {
//       case 7: return "#e74c3c"; // red
//       case 8: return "#1abc9c"; // teal
//       case 9: return "#3498db"; // blue
//       case 10: return "#27ae60"; // green
//       case 11: return "#f39c12"; // orange
//       case 12: return "#9b59b6"; // purple
//       default: return "#95a5a6";
//     }
//   };
 
//   return (
//     <section
//       style={{
//         padding: "4rem 2rem",
//         minHeight: "100vh",
//         fontFamily: "'Inter','Segoe UI',sans-serif",
//         position: "relative",
//         overflow: "hidden",
//         backgroundImage: `url("/mnt/data/Screenshot 2025-09-26 114310.png")`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//       }}
//     >
//       {/* Overlay for readability */}
//       <div
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           background: "rgba(255,255,255,0.85)",
//           backdropFilter: "blur(6px)",
//           zIndex: 0,
//         }}
//       ></div>
 
//       {/* Back Button */}
//       <button
//         onClick={() => navigate("/student/dashboard")}
//         style={{
//           position: "absolute",
//           top: "20px",
//           left: "20px",
//           zIndex: 2,
//           padding: "0.5rem 1rem",
//           borderRadius: "8px",
//           border: "none",
//           background: "#34495e",
//           color: "#fff",
//           fontWeight: "700",
//           cursor: "pointer",
//           boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
//         }}
//       >
//         ← Back
//       </button>
 
//       {/* Floating Circles */}
//       <div className="bg-circles">
//         <span style={{ background: "#9a5e5730", top: "10%", left: "15%", width: "180px", height: "180px" }}></span>
//         <span style={{ background: "#3b9a8730", top: "70%", left: "10%", width: "140px", height: "140px" }}></span>
//         <span style={{ background: "#49657730", top: "20%", right: "10%", width: "200px", height: "200px" }}></span>
//         <span style={{ background: "#27ae6030", bottom: "15%", right: "20%", width: "150px", height: "150px" }}></span>
//         <span style={{ background: "#deb47030", top: "50%", left: "45%", width: "120px", height: "120px" }}></span>
//         <span style={{ background: "#5e426930", bottom: "5%", left: "35%", width: "160px", height: "160px" }}></span>
//       </div>
 
//       {/* Content */}
//       <div style={{ position: "relative", zIndex: 1 }}>
//         {/* Header */}
//         <div style={{ textAlign: "center", marginBottom: "3rem" }}>
//           <h2
//             style={{
//               fontSize: "2.8rem",
//               fontWeight: "800",
//               background: "linear-gradient(135deg,#2c3e50,#34495e)",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//               marginBottom: "1rem",
//             }}
//           >
//             Choose Your Grade
//           </h2>
//           <p
//             style={{
//               fontSize: "1.1rem",
//               color: "#8fa2b5ff",
//               maxWidth: "600px",
//               margin: "0 auto",
//               lineHeight: "1.6",
//               fontWeight: "500",
//             }}
//           >
//             Select your grade level to explore quizzes and study materials built for your journey.
//           </p>
//         </div>
 
//         {/* Grade Cards */}
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//             gap: "2.2rem",
//             maxWidth: "1150px",
//             margin: "0 auto",
//           }}
//         >
//           {classes.map((cl, index) => {
//             const isDisabled = cl === 12;
//             const classColor = getClassColor(cl);
//             const icon = gradeIcons[index % gradeIcons.length]; // cycle icons
 
//             return (
//               <div
//                 key={cl}
//                 onClick={() => (isDisabled ? null : onClassClick(cl))}
//                 className="grade-card"
//                 style={{
//                   borderRadius: "24px",
//                   padding: "2.5rem 1.8rem",
//                   cursor: isDisabled ? "not-allowed" : "pointer",
//                   position: "relative",
//                   overflow: "hidden",
//                   textAlign: "center",
//                   transition: "all 0.35s ease",
//                   background: "rgba(249,251,253,0.9)",
//                   backdropFilter: "blur(16px)",
//                   border: `3px solid ${isDisabled ? "#dcdcdc" : classColor + "50"}`,
//                   boxShadow: `0 12px 28px rgba(0,0,0,0.15), 0 0 15px ${classColor}33`,
//                 }}
//               >
//                 {/* Icon Badge */}
//                 <div
//                   style={{
//                     width: "90px",
//                     height: "90px",
//                     margin: "0 auto 1.2rem",
//                     borderRadius: "50%",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     background: isDisabled
//                       ? "linear-gradient(135deg,#bdc3c7,#95a5a6)"
//                       : `linear-gradient(135deg,${classColor},${classColor}cc)`,
//                     fontSize: "2.5rem",
//                     boxShadow: `0 8px 20px ${classColor}55`,
//                     animation: isDisabled ? "none" : "pulse 2.5s infinite",
//                   }}
//                 >
//                   {icon}
//                 </div>
 
//                 {/* Grade Number */}
//                 <div
//                   style={{
//                     fontSize: "3.2rem",
//                     fontWeight: "900",
//                     background: isDisabled
//                       ? "linear-gradient(135deg,#95a5a6,#bdc3c7)"
//                       : `linear-gradient(135deg,${classColor},${classColor}dd)`,
//                     WebkitBackgroundClip: "text",
//                     WebkitTextFillColor: "transparent",
//                     marginBottom: "0.5rem",
//                   }}
//                 >
//                   {cl}
//                 </div>
 
//                 {/* Title */}
//                 <div style={{ fontSize: "1.3rem", fontWeight: "700", color: "#2c3e50" }}>
//                   Grade {cl}
//                 </div>
 
//                 {/* Coming Soon */}
//                 {isDisabled && (
//                   <div
//                     style={{
//                       marginTop: "1.3rem",
//                       background: "#2c3e50",
//                       color: "#fff",
//                       padding: "0.55rem 1.1rem",
//                       borderRadius: "12px",
//                       fontSize: "0.9rem",
//                       fontWeight: "700",
//                       display: "inline-block",
//                     }}
//                   >
//                     🚧 Coming Soon
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
 
//       {/* Animations + Circles */}
//       <style>
//         {`
//           .grade-card:hover {
//             transform: translateY(-18px) scale(1.07) rotateX(5deg) rotateY(-5deg);
//             box-shadow: 0 20px 45px rgba(0,0,0,0.2), 0 0 30px rgba(0,0,0,0.18);
//           }
//           @keyframes pulse {
//             0%, 100% { transform: scale(1); }
//             50% { transform: scale(1.08); }
//           }
//           .bg-circles span {
//             position: absolute;
//             border-radius: 50%;
//             z-index: 0;
//             filter: blur(30px);
//             animation: float 8s ease-in-out infinite alternate;
//           }
//           @keyframes float {
//             from { transform: translateY(0px); }
//             to { transform: translateY(-40px); }
//           }
//         `}
//       </style>
//     </section>
//   );
// }
//  export default QuizGrade;












import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
 
function QuizGrade({ classes, onClassClick }) {
  const navigate = useNavigate();
  const { t } = useTranslation(); // i18n hook
  const gradeIcons = ["🎓", "🎓", "🎓", "🎓"];
 
  const getClassColor = (cl) => {
    switch (cl) {
      case 7: return "#e74c3c";
      case 8: return "#1abc9c";
      case 9: return "#3498db";
      case 10: return "#27ae60";
      case 11: return "#f39c12";
      case 12: return "#9b59b6";
      default: return "#95a5a6";
    }
  };
 
  return (
    <section
      style={{
        padding: "4rem 2rem",
        minHeight: "100vh",
        fontFamily: "'Inter','Segoe UI',sans-serif",
        position: "relative",
        overflow: "hidden",
        backgroundImage: `url("/mnt/data/Screenshot 2025-09-26 114310.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(6px)",
          zIndex: 0,
        }}
      ></div>
 
      <button
        onClick={() => navigate("/student/dashboard")}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 2,
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          border: "none",
          background: "#34495e",
          color: "#fff",
          fontWeight: "700",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
        }}
      >
        ← {t('back')}
      </button>
 
      <div className="bg-circles">
        <span style={{ background: "#9a5e5730", top: "10%", left: "15%", width: "180px", height: "180px" }}></span>
        <span style={{ background: "#3b9a8730", top: "70%", left: "10%", width: "140px", height: "140px" }}></span>
        <span style={{ background: "#49657730", top: "20%", right: "10%", width: "200px", height: "200px" }}></span>
        <span style={{ background: "#27ae6030", bottom: "15%", right: "20%", width: "150px", height: "150px" }}></span>
        <span style={{ background: "#deb47030", top: "50%", left: "45%", width: "120px", height: "120px" }}></span>
        <span style={{ background: "#5e426930", bottom: "5%", left: "35%", width: "160px", height: "160px" }}></span>
      </div>
 
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "2.8rem",
              fontWeight: "800",
              background: "linear-gradient(135deg,#2c3e50,#34495e)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "1rem",
            }}
          >
            {t('choose_your_grade')}
          </h2>
          <p
            style={{
              fontSize: "1.1rem",
              color: "#8fa2b5ff",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: "1.6",
              fontWeight: "500",
            }}
          >
            {t('select_grade_description')}
          </p>
        </div>
 
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2.2rem",
            maxWidth: "1150px",
            margin: "0 auto",
          }}
        >
          {classes.map((cl, index) => {
            const isDisabled = cl === 12;
            const classColor = getClassColor(cl);
            const icon = gradeIcons[index % gradeIcons.length];
 
            return (
              <div
                key={cl}
                onClick={() => (isDisabled ? null : onClassClick(cl))}
                className="grade-card"
                style={{
                  borderRadius: "24px",
                  padding: "2.5rem 1.8rem",
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  position: "relative",
                  overflow: "hidden",
                  textAlign: "center",
                  transition: "all 0.35s ease",
                  background: "rgba(249,251,253,0.9)",
                  backdropFilter: "blur(16px)",
                  border: `3px solid ${isDisabled ? "#dcdcdc" : classColor + "50"}`,
                  boxShadow: `0 12px 28px rgba(0,0,0,0.15), 0 0 15px ${classColor}33`,
                }}
              >
                <div
                  style={{
                    width: "90px",
                    height: "90px",
                    margin: "0 auto 1.2rem",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isDisabled
                      ? "linear-gradient(135deg,#bdc3c7,#95a5a6)"
                      : `linear-gradient(135deg,${classColor},${classColor}cc)`,
                    fontSize: "2.5rem",
                    boxShadow: `0 8px 20px ${classColor}55`,
                    animation: isDisabled ? "none" : "pulse 2.5s infinite",
                  }}
                >
                  {icon}
                </div>
 
                <div
                  style={{
                    fontSize: "3.2rem",
                    fontWeight: "900",
                    background: isDisabled
                      ? "linear-gradient(135deg,#95a5a6,#bdc3c7)"
                      : `linear-gradient(135deg,${classColor},${classColor}dd)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginBottom: "0.5rem",
                  }}
                >
                  {cl}
                </div>
 
                <div style={{ fontSize: "1.3rem", fontWeight: "700", color: "#2c3e50" }}>
                  {t('grade')} {cl}
                </div>
 
                {isDisabled && (
                  <div
                    style={{
                      marginTop: "1.3rem",
                      background: "#2c3e50",
                      color: "#fff",
                      padding: "0.55rem 1.1rem",
                      borderRadius: "12px",
                      fontSize: "0.9rem",
                      fontWeight: "700",
                      display: "inline-block",
                    }}
                  >
                    🚧 {t('coming_soon')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
 
      <style>
        {`
          .grade-card:hover {
            transform: translateY(-18px) scale(1.07) rotateX(5deg) rotateY(-5deg);
            box-shadow: 0 20px 45px rgba(0,0,0,0.2), 0 0 30px rgba(0,0,0,0.18);
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.08); }
          }
          .bg-circles span {
            position: absolute;
            border-radius: 50%;
            z-index: 0;
            filter: blur(30px);
            animation: float 8s ease-in-out infinite alternate;
          }
          @keyframes float {
            from { transform: translateY(0px); }
            to { transform: translateY(-40px); }
          }
        `}
      </style>
    </section>
  );
}
 
export default QuizGrade;
 