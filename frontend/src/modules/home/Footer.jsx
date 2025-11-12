

 
// import React, { useState, useEffect } from "react";
// import { FaArrowUp, FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";
// import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
 
// const Footer = () => {
//   const [showScroll, setShowScroll] = useState(false);
 
//   useEffect(() => {
//     // This sets the document title when the component mounts
//     document.title = "Home | NOVYA - Your Smart Learning Platform";
 
//     // Handles showing/hiding the scroll-to-top button
//     const handleScroll = () => {
//       setShowScroll(window.scrollY > 200);
//     };
 
//     window.addEventListener("scroll", handleScroll);
//     // Cleanup the event listener when the component unmounts
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []); // Empty dependency array means this effect runs once after initial render
 
//   // Function to scroll the window to the top smoothly
//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };
 
//   // Define the address for Google Maps. This is the location that will be marked.
//   const address = "A-Square Business Center Waltair Uplands, Visakhapatnam - 530003";
 
//   // Encode the address for a Google Maps directions URL.
//   // The 'destination' parameter tells Google Maps where to put the red marker.
//   const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
 
//   return (
//     <footer
//       style={{
//         backgroundColor: "#1a1a2e",
//         color: "#e6e6e6",
//         backgroundImage: "linear-gradient(to bottom, #1a1a2e, #16213e)",
//         boxShadow: "0 -5px 20px rgba(0,0,0,0.2)",
//         padding: "3rem 1rem",
//       }}
//     >
//       <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
//         <div
//           style={{
//             display: "flex",
//             flexWrap: "wrap",
//             gap: "2rem",
//             justifyContent: "space-between",
//           }}
//         >
//           {/* Branding Section */}
//           <div style={{ flex: "1 1 300px" }}>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 marginBottom: "1rem",
//               }}
//             >
//               <span
//                 style={{
//                   fontSize: "1.8rem",
//                   fontWeight: "700",
//                   background: "linear-gradient(45deg, #A62D69, #2D5D7B)",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                 }}
//               >
//                 NOVYA
//               </span>
//             </div>
//             <p style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
//               Empowering learners with personalized AI education, anytime,
//               anywhere. Join our community to transform your learning experience.
//             </p>
//             <div style={{ display: "flex", marginTop: "1rem", gap: "0.5rem" }}>
//               <a
//                 href="https://linkedin.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="social-icon linkedin"
//               >
//                 <FaLinkedin size={20} />
//               </a>
//               <a
//                 href="https://www.instagram.com/novya.in?utm_source=qr&igsh=bGd6cDBrcW4wMG4w"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="social-icon instagram"
//               >
//                 <FaInstagram size={20} />
//               </a>
//               <a
//                 href="https://www.facebook.com/share/1JkHj5JUcM/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="social-icon facebook"
//               >
//                 <FaFacebook size={20} />
//               </a>
//             </div>
//           </div>
 
//           {/* Navigation Links Section */}
//           <div style={{ flex: "1 1 150px" }}>
//             <h5 className="footer-heading">Quick Links</h5>
//             <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
//               {[
//                 { name: "Home", path: "/" },
//                 { name: "Courses", path: "/courses" },
//                 { name: "Free Demo", path: "/free-demo" },
//                 { name: "Pricing", path: "/pricing" },
//                 { name: "FAQs", path: "/faqs" },
//                 { name: "Contact", path: "/contact" },
//               ].map((item, index) => (
//                 <li key={index} style={{ marginBottom: "0.5rem" }}>
//                   <a href={item.path} className="footer-link">
//                     {item.name}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>
 
//           {/* Contact Section */}
//           <div style={{ flex: "1 1 300px" }}>
//             <h5 className="footer-heading">Contact Us</h5>
//             <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
//               {/* Google Maps Address Link */}
//               <li
//                 style={{
//                   display: "flex",
//                   alignItems: "start",
//                   marginBottom: "0.75rem",
//                 }}
//               >
//                 <MdLocationOn
//                   size={20}
//                   style={{ color: "#A62D69", marginRight: "0.5rem" }}
//                 />
//                 <a
//                   // This href will open Google Maps directly to the specified address
//                   // with a red marker and options for directions.
//                   href={googleMapsDirectionsUrl}
//                   target="_blank" // Opens in a new tab
//                   rel="noopener noreferrer" // Security best practice for target="_blank"
//                   className="footer-link"
//                 >
//                   A-Square Business Center Waltair Uplands, <br />
//                   Visakhapatnam - 530003
//                 </a>
//               </li>
 
//               {/* Email Link */}
//               <li
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "0.75rem",
//                 }}
//               >
//                 <MdEmail
//                   size={20}
//                   style={{ color: "#A62D69", marginRight: "0.5rem" }}
//                 />
//                 <a href="mailto:info@novya.in" className="footer-link">
//                   info@novya.in
//                 </a>
//               </li>
 
//               {/* Phone Link */}
//               <li
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginBottom: "0.75rem",
//                 }}
//               >
//                 <MdPhone
//                   size={20}
//                   style={{ color: "#A62D69", marginRight: "0.5rem" }}
//                 />
//                 <a href="tel:+918886352227" className="footer-link">
//                   +91 8886352227
//                 </a>
//               </li>
//             </ul>
//           </div>
//         </div>
 
//         <hr style={{ borderColor: "#2D5D7B", margin: "2rem 0" }} />
 
//         <div style={{ display: "flex", justifyContent: "center" }}>
//           <p style={{ fontSize: "0.9rem", margin: 0 }}>
//             &copy; {new Date().getFullYear()} NOVYA. All rights reserved.
//           </p>
//         </div>
//       </div>
 
//       {/* Scroll to Top Button */}
//       {showScroll && (
//         <button
//           onClick={scrollToTop}
//           className="scroll-top-btn"
//           aria-label="Scroll to top"
//         >
//           <FaArrowUp size={18} />
//         </button>
//       )}
 
//       {/* Inline Styles for the component */}
//       <style>{`
//         .footer-heading {
//           color: #f8f9fa;
//           font-weight: 600;
//           font-size: 1.1rem;
//           position: relative;
//           padding-bottom: 8px;
//         }
//         .footer-heading::after {
//           content: '';
//           position: absolute;
//           left: 0;
//           bottom: 0;
//           width: 50px;
//           height: 2px;
//           background: linear-gradient(90deg, #A62D69, #2D5D7B);
//         }
//         .footer-link {
//           color: #b1b1b1;
//           text-decoration: none;
//           transition: all 0.3s ease;
//           position: relative;
//           font-size: 0.95rem;
//         }
//         .footer-link:hover {
//           color: #ffffff;
//           padding-left: 5px;
//         }
//         .footer-link::before {
//           content: '';
//           position: absolute;
//           width: 0;
//           height: 1px;
//           bottom: -2px;
//           left: 0;
//           background-color: #A62D69;
//           transition: width 0.3s ease;
//         }
//         .footer-link:hover::before {
//           width: 100%;
//         }
//         .social-icon {
//           color: #b1b1b1;
//           transition: all 0.3s ease;
//           width: 40px;
//           height: 40px;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background-color: rgba(255,255,255,0.05);
//         }
//         .social-icon.linkedin:hover {
//           color: #0A66C2;
//           background-color: rgba(10, 102, 194, 0.2);
//           transform: translateY(-3px);
//         }
//         .social-icon.instagram:hover {
//           color: #E4405F;
//           background-color: rgba(228, 64, 95, 0.2);
//           transform: translateY(-3px);
//         }
//         .social-icon.facebook:hover {
//           color: #1877F2;
//           background-color: rgba(24, 119, 242, 0.2);
//           transform: translateY(-3px);
//         }
//         .scroll-top-btn {
//           position: fixed;
//           bottom: 30px;
//           right: 30px;
//           background-color: #A62D69;
//           color: #fff;
//           border: none;
//           border-radius: 50%;
//           width: 50px;
//           height: 50px;
//           box-shadow: 0 4px 20px rgba(166, 45, 105, 0.4);
//           z-index: 1000;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           transition: all 0.3s ease;
//         }
//         .scroll-top-btn:hover {
//           transform: translateY(-3px);
//         }
//       `}</style>
//     </footer>
//   );
// };
 
// export default Footer;








import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { FaArrowUp, FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
 
const Footer = () => {
  const { t } = useTranslation();
  const [showScroll, setShowScroll] = useState(false);
 
  useEffect(() => {
    // This sets the document title when the component mounts
    document.title = `${t('footer.title')} | NOVYA - Your Smart Learning Platform`;
 
    // Handles showing/hiding the scroll-to-top button
    const handleScroll = () => {
      setShowScroll(window.scrollY > 200);
    };
 
    window.addEventListener("scroll", handleScroll);
    // Cleanup the event listener when the component unmounts
    return () => window.removeEventListener("scroll", handleScroll);
  }, [t]); // Empty dependency array means this effect runs once after initial render
 
  // Function to scroll the window to the top smoothly
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
 
  // Define the address for Google Maps. This is the location that will be marked.
  const address = "A-Square Business Center Waltair Uplands, Visakhapatnam - 530003";
 
  // Encode the address for a Google Maps directions URL.
  // The 'destination' parameter tells Google Maps where to put the red marker.
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
 
  const quickLinks = [
    { name: t('footer.quickLinks.home'), path: "/" },
    { name: t('footer.quickLinks.courses'), path: "/courses" },
    { name: t('footer.quickLinks.freeDemo'), path: "/free-demo" },
    { name: t('footer.quickLinks.pricing'), path: "/pricing" },
    { name: t('footer.quickLinks.faqs'), path: "/faqs" },
    { name: t('footer.quickLinks.contact'), path: "/contact" },
  ];

  return (
    <footer
      style={{
        backgroundColor: "#1a1a2e",
        color: "#e6e6e6",
        backgroundImage: "linear-gradient(to bottom, #1a1a2e, #16213e)",
        boxShadow: "0 -5px 20px rgba(0,0,0,0.2)",
        padding: "3rem 1rem",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "2rem",
            justifyContent: "space-between",
          }}
        >
          {/* Branding Section */}
          <div style={{ flex: "1 1 300px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <span
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "700",
                  background: "linear-gradient(45deg, #A62D69, #2D5D7B)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                NOVYA
              </span>
            </div>
            <p style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
              {t('footer.branding.description')}
            </p>
            <div style={{ display: "flex", marginTop: "1rem", gap: "0.5rem" }}>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon linkedin"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="https://www.instagram.com/novya.in?utm_source=qr&igsh=bGd6cDBrcW4wMG4w"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon instagram"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://www.facebook.com/share/1JkHj5JUcM/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon facebook"
              >
                <FaFacebook size={20} />
              </a>
            </div>
          </div>
 
          {/* Navigation Links Section */}
          <div style={{ flex: "1 1 150px" }}>
            <h5 className="footer-heading">{t('footer.quickLinks.title')}</h5>
            <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
              {quickLinks.map((item, index) => (
                <li key={index} style={{ marginBottom: "0.5rem" }}>
                  <a href={item.path} className="footer-link">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
 
          {/* Contact Section */}
          <div style={{ flex: "1 1 300px" }}>
            <h5 className="footer-heading">{t('footer.contact.title')}</h5>
            <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
              {/* Google Maps Address Link */}
              <li
                style={{
                  display: "flex",
                  alignItems: "start",
                  marginBottom: "0.75rem",
                }}
              >
                <MdLocationOn
                  size={20}
                  style={{ color: "#A62D69", marginRight: "0.5rem" }}
                />
                <a
                  // This href will open Google Maps directly to the specified address
                  // with a red marker and options for directions.
                  href={googleMapsDirectionsUrl}
                  target="_blank" // Opens in a new tab
                  rel="noopener noreferrer" // Security best practice for target="_blank"
                  className="footer-link"
                >
                  {t('footer.contact.address')}
                </a>
              </li>
 
              {/* Email Link */}
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "0.75rem",
                }}
              >
                <MdEmail
                  size={20}
                  style={{ color: "#A62D69", marginRight: "0.5rem" }}
                />
                <a href="mailto:info@novya.in" className="footer-link">
                  {t('footer.contact.email')}
                </a>
              </li>
 
              {/* Phone Link */}
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "0.75rem",
                }}
              >
                <MdPhone
                  size={20}
                  style={{ color: "#A62D69", marginRight: "0.5rem" }}
                />
                <a href="tel:+918886352227" className="footer-link">
                  {t('footer.contact.phone')}
                </a>
              </li>
            </ul>
          </div>
        </div>
 
        <hr style={{ borderColor: "#2D5D7B", margin: "2rem 0" }} />
 
        <div style={{ display: "flex", justifyContent: "center" }}>
          <p style={{ fontSize: "0.9rem", margin: 0 }}>
            &copy; {new Date().getFullYear()} {t('footer.copyright')}.
          </p>
        </div>
      </div>
 
      {/* Scroll to Top Button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="scroll-top-btn"
          aria-label={t('footer.scrollToTopAria')}
        >
          <FaArrowUp size={18} />
        </button>
      )}
 
      {/* Inline Styles for the component */}
      <style>{`
        .footer-heading {
          color: #f8f9fa;
          font-weight: 600;
          font-size: 1.1rem;
          position: relative;
          padding-bottom: 8px;
        }
        .footer-heading::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 50px;
          height: 2px;
          background: linear-gradient(90deg, #A62D69, #2D5D7B);
        }
        .footer-link {
          color: #b1b1b1;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          font-size: 0.95rem;
        }
        .footer-link:hover {
          color: #ffffff;
          padding-left: 5px;
        }
        .footer-link::before {
          content: '';
          position: absolute;
          width: 0;
          height: 1px;
          bottom: -2px;
          left: 0;
          background-color: #A62D69;
          transition: width 0.3s ease;
        }
        .footer-link:hover::before {
          width: 100%;
        }
        .social-icon {
          color: #b1b1b1;
          transition: all 0.3s ease;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(255,255,255,0.05);
        }
        .social-icon.linkedin:hover {
          color: #0A66C2;
          background-color: rgba(10, 102, 194, 0.2);
          transform: translateY(-3px);
        }
        .social-icon.instagram:hover {
          color: #E4405F;
          background-color: rgba(228, 64, 95, 0.2);
          transform: translateY(-3px);
        }
        .social-icon.facebook:hover {
          color: #1877F2;
          background-color: rgba(24, 119, 242, 0.2);
          transform: translateY(-3px);
        }
        .scroll-top-btn {
          position: fixed;
          bottom: 30px;
          right: 30px;
          background-color: #A62D69;
          color: #fff;
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          box-shadow: 0 4px 20px rgba(166, 45, 105, 0.4);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        .scroll-top-btn:hover {
          transform: translateY(-3px);
        }
      `}</style>
    </footer>
  );
};
 
export default Footer;