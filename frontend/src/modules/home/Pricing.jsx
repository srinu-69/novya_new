
// import React, { useEffect, useState } from 'react'; 
// import { useNavigate } from 'react-router-dom';
// import { Carousel } from 'react-bootstrap';
// import { motion } from 'framer-motion';
// import { ToastContainer } from 'react-toastify';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'react-toastify/dist/ReactToastify.css';
 
// const NAVBAR_HEIGHT = 60; // Adjust to your fixed navbar height
 
// const courseImages = [
//   'https://images.piclumen.com/normal/20250711/18/3dff9880364d457981a702c574f1c7b3.webp',
//   'https://images.piclumen.com/normal/20250711/19/8cf4f2439f074fb7ad5f5444d2bcacda.webp',
//   'https://images.piclumen.com/normal/20250711/19/6f78c58db77d40b9b1f28d5041add78d.webp',
//   'https://images.piclumen.com/normal/20250711/19/11427e802c8b41eaa440cfc27f27eac9.webp',
//   'https://images.piclumen.com/normal/20250711/19/b0e120c1c93f4f99bb7850c5508ac108.webp',
//   'https://images.piclumen.com/normal/20250711/19/7288b04dca9545db8578703b6bfe5aba.webp',
//   'https://images.piclumen.com/normal/20250711/19/f1cb0a43e28c418bae87af593c3ec35b.webp',
//   'https://images.piclumen.com/normal/20250711/19/b821e8e8cffe4c84a7b8fc89338dfad2.webp',
// ];
 
// const temptingQuotes = [
//   "🚀 92% of students saw grade improvements within 3 months!",
//   "💡 Limited seats available - Don't miss your chance to excel!",
//   "🎓 Join 25,000+ students who transformed their academic journey",
//   "⭐ Our students average 1.5 grade points higher after 6 months",
//   "📈 85% of our students report feeling more confident in exams",
//   "✨ Exclusive content you won't find anywhere else",
//   "🏆 Top-performing students in your school use our platform",
//   "📚 Get access to all subjects in one comprehensive package",
//   "🔥 Special launch pricing coming soon - Stay tuned!",
//   "💫 We're finalizing the best value for your education",
//   "⏳ Pricing details will be announced shortly",
//   "🎯 Affordable excellence is our commitment to you"
// ];
 
// function Pricing() {
//   useEffect(() => {
//     document.title = "Pricing|NOVYA - Your Smart Learning Platform";
//   }, []);
 
//   const navigate = useNavigate();
//   const [currentQuote, setCurrentQuote] = useState(0);
//   const isMobile = window.innerWidth <= 768;
//   const isTablet = window.innerWidth <= 992;
 
//   useEffect(() => {
//     window.scrollTo(0, 0);
//     const scrollToCourses = localStorage.getItem('scrollToCourses');
//     if (scrollToCourses === 'true') {
//       setTimeout(() => {
//         document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' });
//         localStorage.removeItem('scrollToCourses');
//       }, 500);
//     }
//     const id = setInterval(() => {
//       setCurrentQuote((prev) => (prev + 1) % temptingQuotes.length);
//     }, 5000);
//     return () => clearInterval(id);
//   }, []);
 
//   // ✅ Razorpay handler
//   const handleRazorpayPayment = () => {
//     window.open("https://rzp.io/rzp/hbQB8Uk0", "_blank");
//   };
 
//   const plans = [{
//     name: 'COMPREHENSIVE YEARLY PLAN',
//     price: 'Coming Soon',
//     perDay: 'Best value pricing',
//     features: [
//       'Access to All subjects below',
//       'Certifications included',
//       '24/7 Mentor Support',
//       'Downloadable resources',
//       'Progress tracking',
//       'New materials added regularly'
//     ],
//     badge: 'PRICING TO BE ANNOUNCED!',
//     saving: 'Best Value'
//   }];
 
//   const courses = courseImages.map((img, i) => ({
//     title: ['Mathematics','Science','Social Studies','English','Physics','Chemistry','Biology','Computer Science'][i],
//     instructor: ['CBSE','NCERT','State Board','CBSE','CBSE','NCERT','State Board','CBSE'][i] + ' Curriculum',
//     rating: (4.5 + (i % 5) * 0.1).toFixed(1),
//     students: `${10000 + i * 1000}`,
//     originalPrice: `Price TBD`,
//     image: img
//   }));
 
//   return (
//     <div style={{ paddingTop: NAVBAR_HEIGHT }}>
//       <ToastContainer />
//       <section className="py-5" style={{ backgroundColor: '#f5f7fa' }}>
//         <div className="container">
//           <div className="text-center mb-5" style={{ position: 'relative', top: -NAVBAR_HEIGHT / 2 }}>
//             <h2 style={{
//               color: '#2D5D7B',
//               paddingTop: NAVBAR_HEIGHT / 2,
//               marginTop: -NAVBAR_HEIGHT / 2
//             }} className="fw-bold display-5 mb-3">
//               You'll Get Access To (Starts from 7th Grade)
//             </h2>
//             <p className="lead" style={{ color: '#5A6A7D' }}>
//               All included in one affordable yearly membership - Pricing to be announced soon!
//             </p>
//           </div>
 
//           <div className="row justify-content-center mb-5">
//             <div className="col-lg-8">
//               <div className="p-4 rounded-4 position-relative border border-3 text-center"
//                    style={{
//                      background: 'linear-gradient(135deg,#fff,#f8f9fa)',
//                      boxShadow: '0 10px 30px rgba(166,45,105,0.15)',
//                      borderColor: '#2D5D7B'
//                    }}>
//                 <span className="position-absolute top-0 start-50 translate-middle badge"
//                       style={{
//                         backgroundColor: 'rgba(45,93,123,0.1)',
//                         color: '#2D5D7B',
//                         fontWeight: '600',
//                         fontSize: '0.9rem'
//                       }}>
//                   {plans[0].badge}
//                 </span>
//                 <h3 className="fw-bold mt-3 mb-3" style={{ color: '#2D5D7B' }}>{plans[0].name}</h3>
//                 <div className="d-flex justify-content-center align-items-baseline mb-2">
//                   <h2 className="fw-bold me-2" style={{ color: '#A62D69', fontSize: '2.5rem' }}>{plans[0].price}</h2>
//                   <span className="text-success fw-bold">{plans[0].saving}</span>
//                 </div>
//                 <p className="text-muted mb-4 fw-bold">{plans[0].perDay}</p>
//                 <ul className="list-unstyled text-start mb-4">
//                   {plans[0].features.map((f, idx) => <li key={idx}>✓ {f}</li>)}
//                 </ul>
//                 <button onClick={handleRazorpayPayment} className="btn btn-lg w-100 py-3 fw-bold"
//                         style={{
//                           background: 'linear-gradient(135deg, #2D5D7B, #A62D69)',
//                           color: '#fff',
//                           borderRadius: '8px',
//                           boxShadow: '0 4px 15px rgba(166,45,105,0.4)'
//                         }}>
//                   PAY NOW
//                 </button>
//                 <div className="mt-3 small text-muted">✅ Secure Razorpay Payment Gateway</div>
//               </div>
//             </div>
//           </div>
 
//           <div id="courses-section">
//             {!(isMobile || isTablet) ? (
//               <div className="row g-4 mb-5">
//                 {courses.map((c, idx) => (
//                   <div key={idx} className="col-lg-3 col-md-4 col-sm-6" style={{ cursor: 'pointer' }}
//                        onClick={() => navigate(`/course/${idx}`, { state: c })}>
//                     <div className="h-100 rounded-3 overflow-visible"
//                          style={{ overflow: 'visible', backgroundColor: '#fff', boxShadow: '0 2px 15px rgba(0,0,0,0.08)', transition: 'transform 0.3s ease' }}
//                          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
//                          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
//                       <img src={c.image} alt={c.title} className="img-fluid w-100" style={{ height: '135px', objectFit: 'cover' }} />
//                       <div className="p-3">
//                         <h5 className="fw-bold mb-1" style={{ color: '#2D5D7B' }}>{c.title}</h5>
//                         <p className="small text-muted mb-2">By {c.instructor}</p>
//                         <div className="d-flex align-items-center mb-2">
//                           <span className="text-warning me-2">{c.rating}</span>
//                           <div className="text-warning small">{[...Array(5)].map((_, i) => <span key={i}>★</span>)}</div>
//                           <span className="ms-2 small text-muted">({c.students})</span>
//                         </div>
//                         <div>
//                           <span className="badge w-100"
//                                 style={{
//                                   backgroundColor: 'rgba(45,93,123,0.1)',
//                                   color: '#2D5D7B',
//                                   fontWeight: '600',
//                                   padding: '0.5em 0.75em'
//                                 }}>
//                             Coming Soon
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <Carousel indicators={false} interval={3000} className="mb-5">
//                 {[0, 3, 6].map(start => (
//                   <Carousel.Item key={start}>
//                     <div className="row g-4">
//                       {courses.slice(start, start + (isMobile ? 2 : 3)).map((c, i) => (
//                         <div key={i} className={isMobile ? 'col-6' : 'col-md-4'} style={{ cursor: 'pointer' }}
//                              onClick={() => navigate(`/course/${start + i}`, { state: c })}>
//                           <div className="h-100 rounded-3 overflow-visible"
//                                style={{ overflow: 'visible', backgroundColor: '#fff', boxShadow: '0 2px 15px rgba(0,0,0,0.08)' }}>
//                             <img src={c.image} alt={c.title} className="img-fluid w-100" style={{ height: '135px', objectFit: 'cover' }} />
//                             <div className="p-3">
//                               <h5 className="fw-bold mb-1" style={{ color: '#2D5D7B', fontSize: '0.9rem' }}>{c.title}</h5>
//                               <p className="small text-muted mb-2">By {c.instructor}</p>
//                               <div className="d-flex align-items-center mb-2">
//                                 <span className="text-warning me-1" style={{ fontSize: '0.8rem' }}>{c.rating}</span>
//                                 <div className="text-warning small">{[...Array(5)].map((_, k) => <span key={k}>★</span>)}</div>
//                                 <span className="ms-1 small text-muted" style={{ fontSize: '0.7rem' }}>({c.students})</span>
//                               </div>
//                               <div>
//                                 <span className="badge w-100"
//                                       style={{
//                                         backgroundColor: 'rgba(45,93,123,0.1)',
//                                         color: '#2D5D7B',
//                                         fontWeight: '600',
//                                         padding: '0.5em 0.75em'
//                                       }}>
//                                   Coming Soon
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </Carousel.Item>
//                 ))}
//               </Carousel>
//             )}
//           </div>
 
//           <div className="text-center mt-5 pt-4">
//             <div className="p-4 rounded-4 d-inline-block" style={{ backgroundColor: 'rgba(45,93,123,0.1)', border: '2px dashed #2D5D7B', minHeight: '100px', maxWidth: '600px' }}>
//               <motion.div key={currentQuote} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }} style={{ color: '#2D5D7B', fontSize: '1.2rem', fontWeight: 600,textAlign: "center", }}>
//                 {temptingQuotes[currentQuote]}
//               </motion.div>
//             </div>
//             <div className="d-flex justify-content-center gap-3 mt-4">
//               <button className="btn fw-bold py-3 px-4"
//                       style={{ background: 'linear-gradient(135deg,#2D5D7B,#3a7ca5)', color: '#fff', borderRadius: '8px', boxShadow: '0 4px 15px rgba(45,93,123,0.4)' }}
//                       onClick={handleRazorpayPayment}>
//                 PAY NOW
//               </button>
//             </div>
//             <p className="small text-muted mt-3">We're finalizing the most affordable pricing for students</p>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
 
// export default Pricing;







// import React, { useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';
// import { Carousel } from 'react-bootstrap';
// import { motion } from 'framer-motion';
// import { ToastContainer } from 'react-toastify';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'react-toastify/dist/ReactToastify.css';
 
// const NAVBAR_HEIGHT = 60; // Adjust to your fixed navbar height
 
// const courseImages = [
//   'https://images.piclumen.com/normal/20250711/18/3dff9880364d457981a702c574f1c7b3.webp',
//   'https://images.piclumen.com/normal/20250711/19/8cf4f2439f074fb7ad5f5444d2bcacda.webp',
//   'https://images.piclumen.com/normal/20250711/19/6f78c58db77d40b9b1f28d5041add78d.webp',
//   'https://images.piclumen.com/normal/20250711/19/11427e802c8b41eaa440cfc27f27eac9.webp',
//   'https://images.piclumen.com/normal/20250711/19/b0e120c1c93f4f99bb7850c5508ac108.webp',
//   'https://images.piclumen.com/normal/20250711/19/7288b04dca9545db8578703b6bfe5aba.webp',
//   'https://images.piclumen.com/normal/20250711/19/f1cb0a43e28c418bae87af593c3ec35b.webp',
//   'https://images.piclumen.com/normal/20250711/19/b821e8e8cffe4c84a7b8fc89338dfad2.webp',
// ];
 
// function Pricing() {
//   const { t } = useTranslation();
  
//   useEffect(() => {
//     document.title = `${t('pricing.title')} | NOVYA - Your Smart Learning Platform`;
//   }, [t]);
 
//   const navigate = useNavigate();
//   const [currentQuote, setCurrentQuote] = useState(0);
//   const isMobile = window.innerWidth <= 768;
//   const isTablet = window.innerWidth <= 992;
 
//   useEffect(() => {
//     window.scrollTo(0, 0);
//     const scrollToCourses = localStorage.getItem('scrollToCourses');
//     if (scrollToCourses === 'true') {
//       setTimeout(() => {
//         document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' });
//         localStorage.removeItem('scrollToCourses');
//       }, 500);
//     }
//     const id = setInterval(() => {
//       setCurrentQuote((prev) => (prev + 1) % t('pricing.quotes.length', { length: 12 }));
//     }, 5000);
//     return () => clearInterval(id);
//   }, [t]);
 
//   // ✅ Razorpay handler
//   const handleRazorpayPayment = () => {
//     window.open("https://rzp.io/rzp/hbQB8Uk0", "_blank");
//   };
 
//   const plans = [{
//     name: t('pricing.plans.0.name'),
//     price: t('pricing.plans.0.price'),
//     perDay: t('pricing.plans.0.perDay'),
//     features: [
//       t('pricing.plans.0.features.0'),
//       t('pricing.plans.0.features.1'),
//       t('pricing.plans.0.features.2'),
//       t('pricing.plans.0.features.3'),
//       t('pricing.plans.0.features.4'),
//       t('pricing.plans.0.features.5')
//     ],
//     badge: t('pricing.plans.0.badge'),
//     saving: t('pricing.plans.0.saving')
//   }];
 
//   const courses = courseImages.map((img, i) => ({
//     title: t(`pricing.courses.titles.${i}`),
//     instructor: t(`pricing.courses.instructors.${i}`),
//     rating: (4.5 + (i % 5) * 0.1).toFixed(1),
//     students: `${10000 + i * 1000}`,
//     originalPrice: t('pricing.courses.originalPrice'),
//     image: img
//   }));





 
//   return (
//     <div style={{ paddingTop: NAVBAR_HEIGHT }}>
//       <ToastContainer />
//       <section className="py-5" style={{ backgroundColor: '#f5f7fa' }}>
//         <div className="container">
//           <div className="text-center mb-5" style={{ position: 'relative', top: -NAVBAR_HEIGHT / 2 }}>
//             <h2 style={{
//               color: '#2D5D7B',
//               paddingTop: NAVBAR_HEIGHT / 2,
//               marginTop: -NAVBAR_HEIGHT / 2
//             }} className="fw-bold display-5 mb-3">
//               {t('pricing.hero.title')}
//             </h2>
//             <p className="lead" style={{ color: '#5A6A7D' }}>
//               {t('pricing.hero.subtitle')}
//             </p>
//           </div>
 
//           <div className="row justify-content-center mb-5">
//             <div className="col-lg-8">
//               <div className="p-4 rounded-4 position-relative border border-3 text-center"
//                    style={{
//                      background: 'linear-gradient(135deg,#fff,#f8f9fa)',
//                      boxShadow: '0 10px 30px rgba(166,45,105,0.15)',
//                      borderColor: '#2D5D7B'
//                    }}>
//                 <span className="position-absolute top-0 start-50 translate-middle badge"
//                       style={{
//                         backgroundColor: 'rgba(45,93,123,0.1)',
//                         color: '#2D5D7B',
//                         fontWeight: '600',
//                         fontSize: '0.9rem'
//                       }}>
//                   {plans[0].badge}
//                 </span>
//                 <h3 className="fw-bold mt-3 mb-3" style={{ color: '#2D5D7B' }}>{plans[0].name}</h3>
//                 <div className="d-flex justify-content-center align-items-baseline mb-2">
//                   <h2 className="fw-bold me-2" style={{ color: '#A62D69', fontSize: '2.5rem' }}>{plans[0].price}</h2>
//                   <span className="text-success fw-bold">{plans[0].saving}</span>
//                 </div>
//                 <p className="text-muted mb-4 fw-bold">{plans[0].perDay}</p>
//                 <ul className="list-unstyled text-start mb-4">
//                   {plans[0].features.map((f, idx) => <li key={idx}>✓ {f}</li>)}
//                 </ul>
//                 <button onClick={handleRazorpayPayment} className="btn btn-lg w-100 py-3 fw-bold"
//                         style={{
//                           background: 'linear-gradient(135deg, #2D5D7B, #A62D69)',
//                           color: '#fff',
//                           borderRadius: '8px',
//                           boxShadow: '0 4px 15px rgba(166,45,105,0.4)'
//                         }}>
//                   {t('pricing.button.payNow')}
//                 </button>
//                 <div className="mt-3 small text-muted">{t('pricing.secureNote')}</div>
//               </div>
//             </div>
//           </div>
 
//           <div id="courses-section">
//             {!(isMobile || isTablet) ? (
//               <div className="row g-4 mb-5">
//                 {courses.map((c, idx) => (
//                   <div key={idx} className="col-lg-3 col-md-4 col-sm-6" style={{ cursor: 'pointer' }}
//                        onClick={() => navigate(`/course/${idx}`, { state: c })}>
//                     <div className="h-100 rounded-3 overflow-visible"
//                          style={{ overflow: 'visible', backgroundColor: '#fff', boxShadow: '0 2px 15px rgba(0,0,0,0.08)', transition: 'transform 0.3s ease' }}
//                          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
//                          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
//                       <img src={c.image} alt={c.title} className="img-fluid w-100" style={{ height: '135px', objectFit: 'cover' }} />
//                       <div className="p-3">
//                         <h5 className="fw-bold mb-1" style={{ color: '#2D5D7B' }}>{c.title}</h5>
//                         <p className="small text-muted mb-2">{t('pricing.courses.by')} {c.instructor}</p>
//                         <div className="d-flex align-items-center mb-2">
//                           <span className="text-warning me-2">{c.rating}</span>
//                           <div className="text-warning small">{[...Array(5)].map((_, i) => <span key={i}>★</span>)}</div>
//                           <span className="ms-2 small text-muted">({c.students})</span>
//                         </div>
//                         <div>
//                           <span className="badge w-100"
//                                 style={{
//                                   backgroundColor: 'rgba(45,93,123,0.1)',
//                                   color: '#2D5D7B',
//                                   fontWeight: '600',
//                                   padding: '0.5em 0.75em'
//                                 }}>
//                             {t('pricing.courseBadge')}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <Carousel indicators={false} interval={3000} className="mb-5">
//                 {[0, 3, 6].map(start => (
//                   <Carousel.Item key={start}>
//                     <div className="row g-4">
//                       {courses.slice(start, start + (isMobile ? 2 : 3)).map((c, i) => (
//                         <div key={i} className={isMobile ? 'col-6' : 'col-md-4'} style={{ cursor: 'pointer' }}
//                              onClick={() => navigate(`/course/${start + i}`, { state: c })}>
//                           <div className="h-100 rounded-3 overflow-visible"
//                                style={{ overflow: 'visible', backgroundColor: '#fff', boxShadow: '0 2px 15px rgba(0,0,0,0.08)' }}>
//                             <img src={c.image} alt={c.title} className="img-fluid w-100" style={{ height: '135px', objectFit: 'cover' }} />
//                             <div className="p-3">
//                               <h5 className="fw-bold mb-1" style={{ color: '#2D5D7B', fontSize: '0.9rem' }}>{c.title}</h5>
//                               <p className="small text-muted mb-2">{t('pricing.courses.by')} {c.instructor}</p>
//                               <div className="d-flex align-items-center mb-2">
//                                 <span className="text-warning me-1" style={{ fontSize: '0.8rem' }}>{c.rating}</span>
//                                 <div className="text-warning small">{[...Array(5)].map((_, k) => <span key={k}>★</span>)}</div>
//                                 <span className="ms-1 small text-muted" style={{ fontSize: '0.7rem' }}>({c.students})</span>
//                               </div>
//                               <div>
//                                 <span className="badge w-100"
//                                       style={{
//                                         backgroundColor: 'rgba(45,93,123,0.1)',
//                                         color: '#2D5D7B',
//                                         fontWeight: '600',
//                                         padding: '0.5em 0.75em'
//                                       }}>
//                                   {t('pricing.courseBadge')}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </Carousel.Item>
//                 ))}
//               </Carousel>
//             )}
//           </div>
 
//           <div className="text-center mt-5 pt-4">
//             <div className="p-4 rounded-4 d-inline-block" style={{ backgroundColor: 'rgba(45,93,123,0.1)', border: '2px dashed #2D5D7B', minHeight: '100px', maxWidth: '600px' }}>
//               <motion.div key={currentQuote} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }} style={{ color: '#2D5D7B', fontSize: '1.2rem', fontWeight: 600,textAlign: "center", }}>
//                 {t(`pricing.quotes.${currentQuote}`)}
//               </motion.div>
//             </div>
//             <div className="d-flex justify-content-center gap-3 mt-4">
//               <button className="btn fw-bold py-3 px-4"
//                       style={{ background: 'linear-gradient(135deg, #2D5D7B, #A62D69)', color: '#fff', borderRadius: '8px', boxShadow: '0 4px 15px rgba(166,45,105,0.4)' }}
//                       onClick={handleRazorpayPayment}>
//                 {t('pricing.button.payNow')}
//               </button>
//             </div>
//             <p className="small text-muted mt-3">{t('pricing.finalNote')}</p>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
 
// export default Pricing;





import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

const NAVBAR_HEIGHT = 60; // Adjust to your fixed navbar height

const courseImages = [
  'https://images.piclumen.com/normal/20250711/18/3dff9880364d457981a702c574f1c7b3.webp',
  'https://images.piclumen.com/normal/20250711/19/8cf4f2439f074fb7ad5f5444d2bcacda.webp',
  'https://images.piclumen.com/normal/20250711/19/6f78c58db77d40b9b1f28d5041add78d.webp',
  'https://images.piclumen.com/normal/20250711/19/11427e802c8b41eaa440cfc27f27eac9.webp',
  'https://images.piclumen.com/normal/20250711/19/b0e120c1c93f4f99bb7850c5508ac108.webp',
  'https://images.piclumen.com/normal/20250711/19/7288b04dca9545db8578703b6bfe5aba.webp',
  'https://images.piclumen.com/normal/20250711/19/f1cb0a43e28c418bae87af593c3ec35b.webp',
  'https://images.piclumen.com/normal/20250711/19/b821e8e8cffe4c84a7b8fc89338dfad2.webp',
];

const temptingQuotes = [
  "🚀 92% of students saw grade improvements within 3 months!",
  "💡 Limited seats available - Don't miss your chance to excel!",
  "🎓 Join 25,000+ students who transformed their academic journey",
  "⭐ Our students average 1.5 grade points higher after 6 months",
  "📈 85% of our students report feeling more confident in exams",
  "✨ Exclusive content you won't find anywhere else",
  "🏆 Top-performing students in your school use our platform",
  "📚 Get access to all subjects in one comprehensive package",
  "🔥 Special launch pricing coming soon - Stay tuned!",
  "💫 We're finalizing the best value for your education",
  "⏳ Pricing details will be announced shortly",
  "🎯 Affordable excellence is our commitment to you"
];

function Pricing() {
  useEffect(() => {
    document.title = "Pricing|NOVYA - Your Smart Learning Platform";
  }, []);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentQuote, setCurrentQuote] = useState(0);
  const isMobile = window.innerWidth <= 768;
  const isTablet = window.innerWidth <= 992;

  useEffect(() => {
    window.scrollTo(0, 0);
    const scrollToCourses = localStorage.getItem('scrollToCourses');
    if (scrollToCourses === 'true') {
      setTimeout(() => {
        document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' });
        localStorage.removeItem('scrollToCourses');
      }, 500);
    }
    const id = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % temptingQuotes.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // ✅ Razorpay handler
  const handleRazorpayPayment = () => {
    window.open("https://rzp.io/rzp/hbQB8Uk0", "_blank");
  };

  const plans = [{
    name: t('pricing.planName'),
    price: t('pricing.price'),
    perDay: t('pricing.perDay'),
    features: [
      t('pricing.features.allSubjects'),
      t('pricing.features.certifications'),
      t('pricing.features.mentorSupport'),
      t('pricing.features.resources'),
      t('pricing.features.progressTracking'),
      t('pricing.features.newMaterials')
    ],
    badge: t('pricing.badge'),
    saving: t('pricing.saving')
  }];

  const courses = courseImages.map((img, i) => ({
    title: t(`pricing.courses.titles.${i}`),
    instructor: t('pricing.courses.instructor') + ' ' + ['CBSE', 'NCERT', 'State Board', 'CBSE', 'CBSE', 'NCERT', 'State Board', 'CBSE'][i],
    rating: (4.5 + (i % 5) * 0.1).toFixed(1),
    students: `${10000 + i * 1000}`,
    originalPrice: `Price TBD`,
    image: img
  }));

  return (
    <div style={{ paddingTop: NAVBAR_HEIGHT }}>
      <ToastContainer />
      <section className="py-5" style={{ backgroundColor: '#f5f7fa' }}>
        <div className="container">
          <div className="text-center mb-5" style={{ position: 'relative', top: -NAVBAR_HEIGHT / 2 }}>
            <h2 style={{
              color: '#2D5D7B',
              paddingTop: NAVBAR_HEIGHT / 2,
              marginTop: -NAVBAR_HEIGHT / 2
            }} className="fw-bold display-5 mb-3">
              {t('pricing.title')}
            </h2>
            <p className="lead" style={{ color: '#5A6A7D' }}>
              {t('pricing.description')}
            </p>
          </div>

          <div className="row justify-content-center mb-5">
            <div className="col-lg-8">
              <div className="p-4 rounded-4 position-relative border border-3 text-center"
                   style={{
                     background: 'linear-gradient(135deg,#fff,#f8f9fa)',
                     boxShadow: '0 10px 30px rgba(166,45,105,0.15)',
                     borderColor: '#2D5D7B'
                   }}>
                <span className="position-absolute top-0 start-50 translate-middle badge"
                      style={{
                        backgroundColor: 'rgba(45,93,123,0.1)',
                        color: '#2D5D7B',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}>
                  {plans[0].badge}
                </span>
                <h3 className="fw-bold mt-3 mb-3" style={{ color: '#2D5D7B' }}>{plans[0].name}</h3>
                <div className="d-flex justify-content-center align-items-baseline mb-2">
                  <h2 className="fw-bold me-2" style={{ color: '#A62D69', fontSize: '2.5rem' }}>{plans[0].price}</h2>
                  <span className="text-success fw-bold">{plans[0].saving}</span>
                </div>
                <p className="text-muted mb-4 fw-bold">{plans[0].perDay}</p>
                <ul className="list-unstyled text-start mb-4">
                  {plans[0].features.map((f, idx) => <li key={idx}>✓ {f}</li>)}
                </ul>
                <button onClick={handleRazorpayPayment} className="btn btn-lg w-100 py-3 fw-bold"
                        style={{
                          background: 'linear-gradient(135deg, #2D5D7B, #A62D69)',
                          color: '#fff',
                          borderRadius: '8px',
                          boxShadow: '0 4px 15px rgba(166,45,105,0.4)'
                        }}>
                  {t('pricing.payNow')}
                </button>
                <div className="mt-3 small text-muted">✅ Secure Razorpay Payment Gateway</div>
              </div>
            </div>
          </div>

          <div id="courses-section">
            {!(isMobile || isTablet) ? (
              <div className="row g-4 mb-5">
                {courses.map((c, idx) => (
                  <div key={idx} className="col-lg-3 col-md-4 col-sm-6" style={{ cursor: 'pointer' }}
                       onClick={() => navigate(`/course/${idx}`, { state: c })}>
                    <div className="h-100 rounded-3 overflow-visible"
                         style={{ overflow: 'visible', backgroundColor: '#fff', boxShadow: '0 2px 15px rgba(0,0,0,0.08)', transition: 'transform 0.3s ease' }}
                         onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                         onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                      <img src={c.image} alt={c.title} className="img-fluid w-100" style={{ height: '135px', objectFit: 'cover' }} />
                      <div className="p-3">
                        <h5 className="fw-bold mb-1" style={{ color: '#2D5D7B' }}>{c.title}</h5>
                        <p className="small text-muted mb-2">By {c.instructor}</p>
                        <div className="d-flex align-items-center mb-2">
                          <span className="text-warning me-2">{c.rating}</span>
                          <div className="text-warning small">{[...Array(5)].map((_, i) => <span key={i}>★</span>)}</div>
                          <span className="ms-2 small text-muted">({c.students})</span>
                        </div>
                        <div>
                          <span className="badge w-100"
                                style={{
                                  backgroundColor: 'rgba(45,93,123,0.1)',
                                  color: '#2D5D7B',
                                  fontWeight: '600',
                                  padding: '0.5em 0.75em'
                                }}>
                            Coming Soon
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Carousel indicators={false} interval={3000} className="mb-5">
                {[0, 3, 6].map(start => (
                  <Carousel.Item key={start}>
                    <div className="row g-4">
                      {courses.slice(start, start + (isMobile ? 2 : 3)).map((c, i) => (
                        <div key={i} className={isMobile ? 'col-6' : 'col-md-4'} style={{ cursor: 'pointer' }}
                             onClick={() => navigate(`/course/${start + i}`, { state: c })}>
                          <div className="h-100 rounded-3 overflow-visible"
                               style={{ overflow: 'visible', backgroundColor: '#fff', boxShadow: '0 2px 15px rgba(0,0,0,0.08)' }}>
                            <img src={c.image} alt={c.title} className="img-fluid w-100" style={{ height: '135px', objectFit: 'cover' }} />
                            <div className="p-3">
                              <h5 className="fw-bold mb-1" style={{ color: '#2D5D7B', fontSize: '0.9rem' }}>{c.title}</h5>
                              <p className="small text-muted mb-2">By {c.instructor}</p>
                              <div className="d-flex align-items-center mb-2">
                                <span className="text-warning me-1" style={{ fontSize: '0.8rem' }}>{c.rating}</span>
                                <div className="text-warning small">{[...Array(5)].map((_, k) => <span key={k}>★</span>)}</div>
                                <span className="ms-1 small text-muted" style={{ fontSize: '0.7rem' }}>({c.students})</span>
                              </div>
                              <div>
                                <span className="badge w-100"
                                      style={{
                                        backgroundColor: 'rgba(45,93,123,0.1)',
                                        color: '#2D5D7B',
                                        fontWeight: '600',
                                        padding: '0.5em 0.75em'
                                      }}>
                                  Coming Soon
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            )}
          </div>

          <div className="text-center mt-5 pt-4">
            <div className="p-4 rounded-4 d-inline-block" style={{ backgroundColor: 'rgba(45,93,123,0.1)', border: '2px dashed #2D5D7B', minHeight: '100px', maxWidth: '600px' }}>
              <motion.div key={currentQuote} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }} style={{ color: '#2D5D7B', fontSize: '1.2rem', fontWeight: 600, textAlign: "center", }}>
                {t(`pricing.temptingQuotes.${currentQuote}`)}
              </motion.div>
            </div>
            <div className="d-flex justify-content-center gap-3 mt-4">
              <button className="btn fw-bold py-3 px-4"
                      style={{ background: 'linear-gradient(135deg,#2D5D7B,#3a7ca5)', color: '#fff', borderRadius: '8px', boxShadow: '0 4px 15px rgba(45,93,123,0.4)' }}
                      onClick={handleRazorpayPayment}>
                {t('pricing.payNow')}
              </button>
            </div>
            <p className="small text-muted mt-3">{t('pricing.finalizingText')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Pricing;
