// import React, { useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { motion, useAnimation } from 'framer-motion';
// import { FaStar } from 'react-icons/fa';
// // import { RiFlutterFill } from 'react-icons/ri';
// // import { SiPwa } from 'react-icons/si';

// const NAVBAR_HEIGHT = 60;

// function AppDownload() {
//    useEffect(() => {
//     document.title = "Home|NOVYA - Your Smart Learning Platform";
//   }, []);
 
//   const controls = useAnimation();

//   useEffect(() => {
//     (async () => {
//       while (true) {
//         await controls.start({
//           rotate: [0, 5, -5, 0],
//           y: [0, -10, 0],
//           transition: { duration: 6, ease: 'easeInOut' }
//         });
//       }
//     })();
//   }, [controls]);

//   const openPlayStore = () => window.open(`https://play.google.com/store/apps/details?id=com.example.android`, '_blank');
//   const openAppStore = () => window.open(`https://apps.apple.com/us/app/id1234567890`, '_blank');

//   return (
//     <section
//       className="text-center"
//       style={{
//         paddingTop: NAVBAR_HEIGHT + 20,
//         background: 'linear-gradient(135deg, #f0f8ff 0%, #e0f0ff 100%)',
//         color: '#1a3e72',
//         position: 'relative',
//         overflow: 'hidden',
//         paddingBottom: '5rem'
//       }}
//     >
//       {/* Background animations */}
//       {[...Array(8)].map((_, i) => (
//         <motion.div
//           key={i}
//           animate={{
//             y: [0, -20, 0],
//             x: [0, Math.random() * 40 - 20, 0],
//             opacity: [0.6, 1, 0.6],
//             rotate: [0, Math.random() * 20 - 10, 0]
//           }}
//           transition={{
//             duration: 8 + Math.random() * 10,
//             repeat: Infinity,
//             ease: 'easeInOut'
//           }}
//           style={{
//             position: 'absolute',
//             top: `${10 + Math.random() * 80}%`,
//             left: `${10 + Math.random() * 80}%`,
//             width: `${40 + Math.random() * 60}px`,
//             height: `${40 + Math.random() * 60}px`,
//             background: 'rgba(26,62,114,0.05)',
//             borderRadius: '50%',
//             border: '1px solid rgba(26,62,114,0.1)',
//             zIndex: 0
//           }}
//         />
//       ))}

//       <div className="container position-relative" style={{ zIndex: 1 }}>
//         {/* Title & Introduction */}
//         <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
//           <h2
//             className="fw-bold mb-4"
//             style={{
//               fontSize: '3rem',
//               position: 'relative',
//               display: 'inline-block',
//               textShadow: '2px 2px 4px rgba(0,0,0,0.05)',
//               color: '#1a3e72'
//             }}
//           >
//             <FaStar style={{ position: 'absolute', top: '-10px', right: '-20px', fontSize: '1.5rem', color: '#ffd700' }} />
//             Transform Your Learning
//             <FaStar style={{ position: 'absolute', bottom: '-10px', left: '-20px', fontSize: '1.5rem', color: '#ffd700' }} />
//           </h2>
//           <motion.p className="mb-4 lead fw-medium" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }} viewport={{ once: true }}>
//             Our cutting-edge app is <span style={{ color: '#1a6bff', fontWeight: 'bold' }}>coming soon</span> to revolutionize your education!
//           </motion.p>
//         </motion.div>

//         {/* Store badges */}
//         <motion.div
//           className="d-flex justify-content-center flex-wrap gap-4"
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.6 }}
//           viewport={{ once: true }}
//         >
//           {[{
//             src: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg',
//             label: 'Google Play',
//             bg: 'linear-gradient(90deg,#4285F4,#1a3e72)',
//             onClick: openPlayStore
//           },{
//             src: 'https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg',
//             label: 'App Store',
//             bg: 'linear-gradient(90deg,#000,#1a3e72)',
//             onClick: openAppStore
//           }].map((item, idx) => (
//             <motion.div
//               key={idx}
//               onClick={item.onClick}
//               whileHover={{ y: -5 }}
//               whileTap={{ scale: 0.98 }}
//               animate={controls}
//               style={{
//                 cursor: 'pointer',
//                 background: 'linear-gradient(145deg,#fff,#eee)',
//                 borderRadius: '16px',
//                 padding: '1rem 2rem',
//                 boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
//                 width: '280px',
//                 position: 'relative',
//                 overflow: 'hidden',
//                 display: 'inline-block'
//               }}
//             >
//               <img src={item.src} alt={`Get it on ${item.label}`} style={{ width: '100%' }} />
//               <div style={{
//                 position: 'absolute', top: 8, right: 8,
//                 background: item.bg, color: '#fff',
//                 fontSize: '0.6rem', padding: '0.2rem 0.4rem', borderRadius: '999px'
//               }}>
//                 Coming Soon
//               </div>
//             </motion.div>
//           ))}
//         </motion.div>
//       </div>
//     </section>
//   );
// }

// export default AppDownload;





import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import { motion, useAnimation } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
// import { RiFlutterFill } from 'react-icons/ri';
// import { SiPwa } from 'react-icons/si';

const NAVBAR_HEIGHT = 60;

function AppDownload() {
  const { t } = useTranslation();
  
  useEffect(() => {
    document.title = `${t('appdownload.title')} | NOVYA - Your Smart Learning Platform`;
  }, [t]);
 
  const controls = useAnimation();

  useEffect(() => {
    (async () => {
      while (true) {
        await controls.start({
          rotate: [0, 5, -5, 0],
          y: [0, -10, 0],
          transition: { duration: 6, ease: 'easeInOut' }
        });
      }
    })();
  }, [controls]);

  const openPlayStore = () => window.open(`https://play.google.com/store/apps/details?id=com.example.android`, '_blank');
  const openAppStore = () => window.open(`https://apps.apple.com/us/app/id1234567890`, '_blank');

  return (
    <section
      className="text-center"
      style={{
        paddingTop: NAVBAR_HEIGHT + 20,
        background: 'linear-gradient(135deg, #f0f8ff 0%, #e0f0ff 100%)',
        color: '#1a3e72',
        position: 'relative',
        overflow: 'hidden',
        paddingBottom: '5rem'
      }}
    >
      {/* Background animations */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [0.6, 1, 0.6],
            rotate: [0, Math.random() * 20 - 10, 0]
          }}
          transition={{
            duration: 8 + Math.random() * 10,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            position: 'absolute',
            top: `${10 + Math.random() * 80}%`,
            left: `${10 + Math.random() * 80}%`,
            width: `${40 + Math.random() * 60}px`,
            height: `${40 + Math.random() * 60}px`,
            background: 'rgba(26,62,114,0.05)',
            borderRadius: '50%',
            border: '1px solid rgba(26,62,114,0.1)',
            zIndex: 0
          }}
        />
      ))}

      <div className="container position-relative" style={{ zIndex: 1 }}>
        {/* Title & Introduction */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <h2
            className="fw-bold mb-4"
            style={{
              fontSize: '3rem',
              position: 'relative',
              display: 'inline-block',
              textShadow: '2px 2px 4px rgba(0,0,0,0.05)',
              color: '#1a3e72'
            }}
          >
            <FaStar style={{ position: 'absolute', top: '-10px', right: '-20px', fontSize: '1.5rem', color: '#ffd700' }} />
            {t('appdownload.titleText')}
            <FaStar style={{ position: 'absolute', bottom: '-10px', left: '-20px', fontSize: '1.5rem', color: '#ffd700' }} />
          </h2>
          <motion.p className="mb-4 lead fw-medium" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }} viewport={{ once: true }}>
            {t('appdownload.subtitle')}
          </motion.p>
        </motion.div>

        {/* Store badges */}
        <motion.div
          className="d-flex justify-content-center flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          {[{
            src: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg',
            label: t('appdownload.googlePlay'),
            bg: 'linear-gradient(90deg,#4285F4,#1a3e72)',
            onClick: openPlayStore
          },{
            src: 'https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg',
            label: t('appdownload.appStore'),
            bg: 'linear-gradient(90deg,#000,#1a3e72)',
            onClick: openAppStore
          }].map((item, idx) => (
            <motion.div
              key={idx}
              onClick={item.onClick}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              animate={controls}
              style={{
                cursor: 'pointer',
                background: 'linear-gradient(145deg,#fff,#eee)',
                borderRadius: '16px',
                padding: '1rem 2rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                width: '280px',
                position: 'relative',
                overflow: 'hidden',
                display: 'inline-block'
              }}
            >
              <img src={item.src} alt={`Get it on ${item.label}`} style={{ width: '100%' }} />
              <div style={{
                position: 'absolute', top: 8, right: 8,
                background: item.bg, color: '#fff',
                fontSize: '0.6rem', padding: '0.2rem 0.4rem', borderRadius: '999px'
              }}>
                {t('appdownload.comingSoon')}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default AppDownload;