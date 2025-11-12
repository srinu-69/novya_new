// import { useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { motion } from 'framer-motion';
// import missionImage from './assets/mission-image.webp';
// import learningImage from './assets/learning-image.webp';
// import modulesImage from './assets/modules-image.webp'; // Add your third image import
// import computer from './assets/computer-image.webp'; // Add your third image import
// import car from './assets/car-image.webp';
 
 
 
// function MissionVision() {
//    useEffect(() => {
//         document.title = "Features|NOVYA - Your Smart Learning Platform";
//       }, []);
//   return (
//     <section style={{ backgroundColor: '#f8f9fa' }}>
//       {/* First Section - Mission & Vision */}
//       <div className="container py-5">
//         <div className="row align-items-center mb-5">
//           <div className="col-md-4">
//             <motion.h1
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="fw-bold"
//               style={{ color: '#2D5D7B', fontSize: '2.5rem' }}
//             >
//               Our Mission & Vision
//             </motion.h1>
//           </div>
//           <div className="col-md-8">
//             <motion.div
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//             >
//               <p className="lead" style={{
//                 fontSize: '1.25rem',
//                 lineHeight: '1.6',
//                 color: '#333',
//                 marginBottom: 0
//               }}>
//         To make personalized, world-class education accessible to everyone through AI, helping each learner reach their full potential.
 
               
//         At Novya, we recognize that everyone learns differently and turn each unique style into a strength. Our AI-driven platform makes learning engaging, interactive, and effective, shaping curious, confident, and capable learners ready to achieve their dreams.    </p>
 
//             </motion.div>
//           </div>
//         </div>
 
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           whileInView={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.6, delay: 0.4 }}
//           className="text-center"
//         >
//           <img
//             src={missionImage}
//             alt="Vedha education platform"
//             className="img-fluid rounded shadow"
//             style={{
//               width: '100%',
//               height: 'auto',
//               minHeight: '500px',
//               objectFit: 'cover',
//               maxWidth: '1200px',
//               margin: '0 auto'
//             }}
//           />
//         </motion.div>
//       </div>
 
//       {/* Second Section - Unique Pace and Style */}
//       <div className="container py-5">
//         <div className="row align-items-center">
//           {/* Text Content */}
//           <div className="col-lg-6 mb-4 mb-lg-0">
//             <div className="text-center text-lg-start">
//               <motion.h1
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 style={{
//                   color: '#2D5D7B',
//                   fontSize: '2.5rem',
//                   fontWeight: 'bold',
//                   textTransform: 'uppercase'
//                 }}
//               >
//                 I UNDERLY EVERY
//               </motion.h1>
//               <motion.h2
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.2 }}
//                 style={{
//                   color: '#3a86ff',
//                   fontSize: '1.8rem',
//                   fontWeight: 'bold',
//                   marginBottom: '1.5rem'
//                 }}
//               >
//                 Student's Unique Pace & Style
//               </motion.h2>
 
//               <motion.p
//                 initial={{ opacity: 0 }}
//                 whileInView={{ opacity: 1 }}
//                 transition={{ duration: 0.6, delay: 0.4 }}
//                 style={{
//                   fontSize: '1.25rem',
//                   lineHeight: '1.6',
//                   color: '#333',
//                   marginBottom: '2rem'
//                 }}
//               >
// At Novya, learning is personal and it is built for you, but we know every student learns differently, and we turn your unique way of learning into your greatest strength. Novya's core strength lies in its adaptive learning engine, meticulously designed to understand and respond to your individual needs.   <br />
 
// <strong>Personalized Pace :</strong> Our AI identifies your optimal learning speed, ensuring you're never overwhelmed or bored.
 
//  Novya adapts to your preferred learning style, making complex topics intuitive and engaging.
 
// </motion.p>
 
//               <div className="row">
//                 <div className="col-md-6 mb-3 mb-md-0">
//                   <motion.div
//                     initial={{ opacity: 0, scale: 0.9 }}
//                     whileInView={{ opacity: 1, scale: 1 }}
//                     transition={{ duration: 0.5 }}
//                     className="p-3 rounded text-center"
//                     style={{ backgroundColor: '#ffffff', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}
//                   >
//                     <h1 style={{
//                       color: '#3a86ff',
//                       fontSize: '3rem',
//                       fontWeight: 'bold',
//                       marginBottom: '0.5rem'
//                     }}>
//                       95%
//                     </h1>
//                     <p style={{ fontSize: '1.1rem', color: '#555' }}>
//                       Of students report feeling more engaged
//                     </p>
//                   </motion.div>
//                 </div>
//                 <div className="col-md-6">
//                   <motion.div
//                     initial={{ opacity: 0, scale: 0.9 }}
//                     whileInView={{ opacity: 1, scale: 1 }}
//                     transition={{ duration: 0.5, delay: 0.2 }}
//                     className="p-3 rounded text-center"
//                     style={{ backgroundColor: '#ffffff', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}
//                   >
//                     <h1 style={{
//                       color: '#8338ec',
//                       fontSize: '3rem',
//                       fontWeight: 'bold',
//                       marginBottom: '0.5rem'
//                     }}>
//                       40+
//                     </h1>
//                     <p style={{ fontSize: '1.1rem', color: '#555' }}>
//                       Improvement in test scores observed
//                     </p>
//                   </motion.div>
//                 </div>
//               </div>
//             </div>
//           </div>
 
//           {/* Image Content */}
//           <div className="col-lg-6">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//             >
//               <img
//                 src={learningImage}
//                 alt="Student learning with Vedha"
//                 className="img-fluid rounded shadow-lg"
//                 style={{
//                   width: '100%',
//                   height: 'auto',
//                   minHeight: '500px',
//                   objectFit: 'cover'
//                 }}
//               />
//             </motion.div>
//           </div>
//         </div>
//       </div>
 
//       {/* Third Section - Engaging Learning Modules */}
//       <div className="container py-5">
//         <div className="row align-items-center">
//           {/* Text Content */}
//           <div className="col-lg-6 mb-4 mb-lg-0 order-lg-1">
//             <div className="text-center text-lg-start">
//               <motion.h1
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 style={{
//                   color: '#2D5D7B',
//                   fontSize: '2.5rem',
//                   fontWeight: 'bold',
//                   marginBottom: '1.5rem'
//                 }}
//               >
//                 Dive Into Engaging & Adaptive Learning Modules With NOVYA
//               </motion.h1>
 
//               <motion.p
//                 initial={{ opacity: 0 }}
//                 whileInView={{ opacity: 1 }}
//                 transition={{ duration: 0.6, delay: 0.2 }}
//                 style={{
//                   fontSize: '1.25rem',
//                   lineHeight: '1.6',
//                   color: '#333',
//                   marginBottom: '2rem'
//                 }}
//               >
//               Learning with Novya isn't just about absorbing information, it's about active engagement and deep understanding. Our AI-powered modules are designed to keep you challenged and motivated.               </motion.p>
 
//               <motion.ul
//                 initial={{ opacity: 0 }}
//                 whileInView={{ opacity: 1 }}
//                 transition={{ duration: 0.6, delay: 0.4 }}
//                 style={{
//                   textAlign: 'left',
//                   paddingLeft: '1.5rem',
//                   fontSize: '1.1rem',
//                   color: '#333',
//                   listStyle: "none", // ✅ removes dots
//                   paddingInlineStart: 0, // ✅ removes default list padding
//                 }}
//               >
//                 <li className="mb-2"><strong>Personalized Content :</strong> As you progress, Novya's AI curates your next steps, suggesting relevant topics, advanced challenges, or remedial exercises to ensure a solid foundation. </li>
//                 <li className="mb-2"><strong>Interactive Simulations :</strong> Experience dynamic lessons filled with interactive quizzes, simulations, and problem-solving scenarios that reinforce learning in a practical way. </li>
//                 <li><strong>Real-time Feedback :</strong> Receive instant, actionable feedback that explains why an answer is right or wrong, guiding you toward mastery without frustration. </li>
//               </motion.ul>
//             </div>
//           </div>
 
//           {/* Image Content */}
//           <div className="col-lg-6 order-lg-0">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//             >
//               <img
//                 src={modulesImage}
//                 alt="Vedha learning modules"
//                 className="img-fluid rounded shadow-lg"
//                 style={{
//                   width: '100%',
//                   height: 'auto',
//                   minHeight: '500px',
//                   objectFit: 'cover'
//                 }}
//               />
//             </motion.div>
//           </div>
//         </div>
//       </div>
//       <div className="container py-5">
//         <div className="row align-items-center">
//           {/* Text Content */}
//           <div className="col-lg-6 mb-4 mb-lg-0 order-lg-1">
//             <div className="text-center text-lg-start">
//               <motion.h1
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 style={{
//                   color: '#2D5D7B',
//                   fontSize: '2.5rem',
//                   fontWeight: 'bold',
//                   marginBottom: '1.5rem'
//                 }}
//               >
//                 Unlock Your Potential & With NOVYA Resources
//               </motion.h1>
 
//               <motion.p
//                 initial={{ opacity: 0 }}
//                 whileInView={{ opacity: 1 }}
//                 transition={{ duration: 0.6, delay: 0.2 }}
//                 style={{
//                   fontSize: '1.25rem',
//                   lineHeight: '1.6',
//                   color: '#333',
//                   marginBottom: '2rem'
//                 }}
//               >
// Novya provides you with more than just courses, we give you the tools and insights to take control of your learning journey and truly unlock your potential.               </motion.p>
 
//               <motion.ul
//                 initial={{ opacity: 0 }}
//                 whileInView={{ opacity: 1 }}
//                 transition={{ duration: 0.6, delay: 0.4 }}
//                 style={{
//                   textAlign: 'left',
//                   paddingLeft: '1.5rem',
//                   fontSize: '1.1rem',
//                   color: '#333',
//                   listStyle: "none", // ✅ removes dots
//                   paddingInlineStart: 0, // ✅ removes default list padding
 
//                 }}
//               >
//                 <li className="mb-2"><strong>Personalized Progress Reports :</strong> Gain clear, insightful overviews of your performance, highlighting your strengths, areas for improvement, and overall progress. </li>
//                 <li className="mb-2"><strong>Performance Analytics :</strong> Understand your learning habits and identify patterns that contribute to your success, empowering you to optimize your study strategies. </li>
//                 <li className="mb-2"><strong>Enhanced Learning Efficiency :</strong> Earn rewards and track progress.</li>
//                 <li><strong>Real-time Feedback :</strong>  With data-driven insights, Novya helps you focus your efforts where they matter most, leading to more efficient learning and faster skill acquisition.</li>
//               </motion.ul>
//             </div>
//           </div>
 
//           {/* Image Content */}
//           <div className="col-lg-6 order-lg-0">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//             >
//               <img
//                 src={computer}
//                 alt="Vedha learning modules"
//                 className="img-fluid rounded shadow-lg"
//                 style={{
//                   width: '100%',
//                   height: 'auto',
//                   minHeight: '500px',
//                   objectFit: 'cover'
//                 }}
//               />
//             </motion.div>
//           </div>
//         </div>
//       </div>
 
 
 
//       <div className="container py-5">
//         <div className="row align-items-center mb-5">
//           <div className="col-md-4">
//             <motion.h1
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="fw-bold"
//               style={{ color: '#2D5D7B', fontSize: '2.5rem' }}
//             >
//               Data-Driven Insights
//             </motion.h1>
//           </div>
//           <div className="col-md-8">
//             <motion.div
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//             >
//               <p className="lead" style={{
//                 fontSize: '1.50rem',
//                 lineHeight: '1.6',
//                 color: '#333',
//                 marginBottom: 0
//               }}>
// With Novya, every step of your journey is crafted to spark curiosity, boost confidence, and help you to achieve your true potential.              </p>
//             </motion.div>
//           </div>
//         </div>
 
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           whileInView={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.6, delay: 0.4 }}
//           className="text-center"
//         >
//           <img
//             src={car}
//             alt="Vedha education platform"
//             className="img-fluid rounded shadow"
//             style={{
//               width: '100%',
//               height: 'auto',
//               minHeight: '500px',
//               objectFit: 'cover',
//               maxWidth: '1200px',
//               margin: '0 auto'
//             }}
//           />
//         </motion.div>
//       </div>
 
 
     
//     </section>
//   );
// }
 
// export default MissionVision;






import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import { motion } from 'framer-motion';
import missionImage from './assets/mission-image.webp';
import learningImage from './assets/learning-image.webp';
import modulesImage from './assets/modules-image.webp'; // Add your third image import
import computer from './assets/computer-image.webp'; // Add your third image import
import car from './assets/car-image.webp';

function MissionVision() {
  const { t } = useTranslation();
  
  useEffect(() => {
    document.title = `${t('missionvision.title')} | NOVYA - Your Smart Learning Platform`;
  }, [t]);

  return (
    <section style={{ backgroundColor: '#f8f9fa' }}>
      {/* First Section - Mission & Vision */}
      <div className="container py-5">
        <div className="row align-items-center mb-5">
          <div className="col-md-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="fw-bold"
              style={{ color: '#2D5D7B', fontSize: '2.5rem' }}
            >
              {t('missionvision.section1.title')}
            </motion.h1>
          </div>
          <div className="col-md-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="lead" style={{
                fontSize: '1.25rem',
                lineHeight: '1.6',
                color: '#333',
                marginBottom: 0
              }}>
                {t('missionvision.section1.paragraph1')}
                <br />
                {t('missionvision.section1.paragraph2')}
              </p>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <img
            src={missionImage}
            alt={t('missionvision.section1.imageAlt')}
            className="img-fluid rounded shadow"
            style={{
              width: '100%',
              height: 'auto',
              minHeight: '500px',
              objectFit: 'cover',
              maxWidth: '1200px',
              margin: '0 auto'
            }}
          />
        </motion.div>
      </div>

      {/* Second Section - Unique Pace and Style */}
      <div className="container py-5">
        <div className="row align-items-center">
          {/* Text Content */}
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="text-center text-lg-start">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  color: '#2D5D7B',
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}
              >
                {t('missionvision.section2.h1')}
              </motion.h1>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{
                  color: '#3a86ff',
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  marginBottom: '1.5rem'
                }}
              >
                {t('missionvision.section2.h2')}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{
                  fontSize: '1.25rem',
                  lineHeight: '1.6',
                  color: '#333',
                  marginBottom: '2rem'
                }}
              >
                {t('missionvision.section2.paragraph')}
                <br />
                <strong>{t('missionvision.section2.personalizedPace')}</strong> {t('missionvision.section2.personalizedPaceDesc')}
                <br />
                {t('missionvision.section2.adaptsToStyle')}
              </motion.p>

              <div className="row">
                <div className="col-md-6 mb-3 mb-md-0">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="p-3 rounded text-center"
                    style={{ backgroundColor: '#ffffff', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}
                  >
                    <h1 style={{
                      color: '#3a86ff',
                      fontSize: '3rem',
                      fontWeight: 'bold',
                      marginBottom: '0.5rem'
                    }}>
                      95%
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: '#555' }}>
                      {t('missionvision.section2.stat1')}
                    </p>
                  </motion.div>
                </div>
                <div className="col-md-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="p-3 rounded text-center"
                    style={{ backgroundColor: '#ffffff', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}
                  >
                    <h1 style={{
                      color: '#8338ec',
                      fontSize: '3rem',
                      fontWeight: 'bold',
                      marginBottom: '0.5rem'
                    }}>
                      40+
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: '#555' }}>
                      {t('missionvision.section2.stat2')}
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Content */}
          <div className="col-lg-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img
                src={learningImage}
                alt={t('missionvision.section2.imageAlt')}
                className="img-fluid rounded shadow-lg"
                style={{
                  width: '100%',
                  height: 'auto',
                  minHeight: '500px',
                  objectFit: 'cover'
                }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Third Section - Engaging Learning Modules */}
      <div className="container py-5">
        <div className="row align-items-center">
          {/* Text Content */}
          <div className="col-lg-6 mb-4 mb-lg-0 order-lg-1">
            <div className="text-center text-lg-start">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  color: '#2D5D7B',
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  marginBottom: '1.5rem'
                }}
              >
                {t('missionvision.section3.title')}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{
                  fontSize: '1.25rem',
                  lineHeight: '1.6',
                  color: '#333',
                  marginBottom: '2rem'
                }}
              >
                {t('missionvision.section3.paragraph')}
              </motion.p>

              <motion.ul
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{
                  textAlign: 'left',
                  paddingLeft: '1.5rem',
                  fontSize: '1.1rem',
                  color: '#333',
                  listStyle: "none",
                  paddingInlineStart: 0,
                }}
              >
                <li className="mb-2"><strong>{t('missionvision.section3.list1.title')}</strong> {t('missionvision.section3.list1.desc')}</li>
                <li className="mb-2"><strong>{t('missionvision.section3.list2.title')}</strong> {t('missionvision.section3.list2.desc')}</li>
                <li><strong>{t('missionvision.section3.list3.title')}</strong> {t('missionvision.section3.list3.desc')}</li>
              </motion.ul>
            </div>
          </div>

          {/* Image Content */}
          <div className="col-lg-6 order-lg-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img
                src={modulesImage}
                alt={t('missionvision.section3.imageAlt')}
                className="img-fluid rounded shadow-lg"
                style={{
                  width: '100%',
                  height: 'auto',
                  minHeight: '500px',
                  objectFit: 'cover'
                }}
              />
            </motion.div>
          </div>
        </div>
      </div>
      <div className="container py-5">
        <div className="row align-items-center">
          {/* Text Content */}
          <div className="col-lg-6 mb-4 mb-lg-0 order-lg-1">
            <div className="text-center text-lg-start">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  color: '#2D5D7B',
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  marginBottom: '1.5rem'
                }}
              >
                {t('missionvision.section4.title')}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{
                  fontSize: '1.25rem',
                  lineHeight: '1.6',
                  color: '#333',
                  marginBottom: '2rem'
                }}
              >
                {t('missionvision.section4.paragraph')}
              </motion.p>

              <motion.ul
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{
                  textAlign: 'left',
                  paddingLeft: '1.5rem',
                  fontSize: '1.1rem',
                  color: '#333',
                  listStyle: "none",
                  paddingInlineStart: 0,
                }}
              >
                <li className="mb-2"><strong>{t('missionvision.section4.list1.title')}</strong> {t('missionvision.section4.list1.desc')}</li>
                <li className="mb-2"><strong>{t('missionvision.section4.list2.title')}</strong> {t('missionvision.section4.list2.desc')}</li>
                <li className="mb-2"><strong>{t('missionvision.section4.list3.title')}</strong> {t('missionvision.section4.list3.desc')}</li>
                <li><strong>{t('missionvision.section4.list4.title')}</strong> {t('missionvision.section4.list4.desc')}</li>
              </motion.ul>
            </div>
          </div>

          {/* Image Content */}
          <div className="col-lg-6 order-lg-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img
                src={computer}
                alt={t('missionvision.section4.imageAlt')}
                className="img-fluid rounded shadow-lg"
                style={{
                  width: '100%',
                  height: 'auto',
                  minHeight: '500px',
                  objectFit: 'cover'
                }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row align-items-center mb-5">
          <div className="col-md-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="fw-bold"
              style={{ color: '#2D5D7B', fontSize: '2.5rem' }}
            >
              {t('missionvision.section5.title')}
            </motion.h1>
          </div>
          <div className="col-md-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="lead" style={{
                fontSize: '1.50rem',
                lineHeight: '1.6',
                color: '#333',
                marginBottom: 0
              }}>
                {t('missionvision.section5.paragraph')}
              </p>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <img
            src={car}
            alt={t('missionvision.section5.imageAlt')}
            className="img-fluid rounded shadow"
            style={{
              width: '100%',
              height: 'auto',
              minHeight: '500px',
              objectFit: 'cover',
              maxWidth: '1200px',
              margin: '0 auto'
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}

export default MissionVision;