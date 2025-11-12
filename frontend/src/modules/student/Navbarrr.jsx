




// import React, { useState, useEffect } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaUserCircle, FaChevronDown, FaGlobe } from 'react-icons/fa';
// import { useTranslation } from 'react-i18next';
// import './Navbarrr.css';
// import novyaLogo from '../home/assets/NOVYA LOGO.png';
 
// const Navbar = () => {
//   const [scrolled, setScrolled] = useState(false);
//   const [activeLink, setActiveLink] = useState('');
//   const [avatarOpen, setAvatarOpen] = useState(false);
//   const [classDropdownOpen, setClassDropdownOpen] = useState(false);
//   const [practiceDropdownOpen, setPracticeDropdownOpen] = useState(false);
//   const [langDropdownOpen, setLangDropdownOpen] = useState(false);
//   const [showNavbar, setShowNavbar] = useState(true);
 
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { t, i18n } = useTranslation();
 
//   const languages = [
//     { code: 'en', label: 'English' },
//     { code: 'te', label: 'తెలుగు' },
//     { code: 'hi', label: 'हिन्दी' },
//     { code: 'kn', label: 'ಕನ್ನಡ' },
//     { code: 'ta', label: 'தமிழ்' },
//     { code: 'ml', label: 'മലയാളം' },
//   ];
 
//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 10);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);
 
//   useEffect(() => {
//     setActiveLink(location.pathname);
//     setAvatarOpen(false);
//     setClassDropdownOpen(false);
//     setPracticeDropdownOpen(false);
//     setLangDropdownOpen(false);
   
//     // Check if current route is mock test or quick practice page
//     const hideNavbarRoutes = ['/mock-test', '/quick-practice'];
//     const shouldHideNavbar = hideNavbarRoutes.some(route =>
//       location.pathname.includes(route)
//     );
   
//     setShowNavbar(!shouldHideNavbar);
//   }, [location.pathname]);
 
//   const handleLogout = () => navigate('/');
 
//   const handleLanguageChange = (code) => {
//     i18n.changeLanguage(code);
//     setLangDropdownOpen(false);
//   };
 
//   const navLinks = [
//     { path: '/student/dashboard', name: t('home', 'Home') },
//     {
//       path: '/learn',
//       name: t('class_room', 'Class Room'),
//       hasDropdown: true,
//       dropdownItems: [
//         { path: '/learn', name: t('class_7', 'Class 7') },
//         { path: '/learn/class8', name: t('class_8', 'Class 8') },
//         { path: '/learn/class9', name: t('class_9', 'Class 9') },
//         { path: '/learn/class10', name: t('class_10', 'Class 10') },
//       ],
//     },
//     {
//       path: '/practice',
//       name: t('practice', 'Practice'),
//       hasDropdown: true,
//       dropdownItems: [
//         { path: '/quick-practice', name: t('quick_practice', 'Quick Practice') },
//         { path: '/mock-test', name: t('mock_test', 'Mock Test') },
//       ],
//     },
//     { path: '/career', name: t('career', 'Career') },
//     { path: '/mentorship', name: t('mentorship', 'Mentorship') },
//   ];
 
//   // Don't render navbar if it should be hidden
//   if (!showNavbar) {
//     return null;
//   }
 
//   return (
//     <motion.nav
//       className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ duration: 0.6 }}
//     >
//       <div className="navbar-container">
//         {/* Logo */}
//         <div className="navbar-brand" style={{ display: 'flex', alignItems: 'center' }}>
//           <Link to="/student/dashboard" className="navbar-logo-link">
//             <img src={novyaLogo} alt="NOVYA Logo" style={{ height: '50px' }} />
//             <motion.span
//               style={{
//                 background: 'linear-gradient(90deg, #2D5D7B 0%, #4a8db7 25%, #FF6B6B 50%, #FFD166 75%, #2D5D7B 100%)',
//                 WebkitBackgroundClip: 'text',
//                 backgroundClip: 'text',
//                 color: 'transparent',
//                 fontWeight: '800',
//                 fontSize: '1.8rem',
//                 marginLeft: '12px',
//                 letterSpacing: '1px',
//                 fontFamily: "'Poppins', sans-serif",
//                 backgroundSize: '200% auto',
//                 animation: 'gradientText 3s ease infinite',
//               }}
//               initial={{ opacity: 0, x: -10 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.2, duration: 0.5 }}
//               whileHover={{ backgroundPosition: 'right center', transition: { duration: 1.5 } }}
//             >
//               NOVYA
//             </motion.span>
//           </Link>
//         </div>
 
//         {/* Desktop Links */}
//         <div className="navbar-desktop-links">
//           <ul style={{
//             display: 'flex',
//             alignItems: 'center',
//             margin: 0,
//             padding: 0,
//             listStyle: 'none',
//             gap: '20px'
//           }}>
//             {navLinks.map((link) => (
//               <li
//                 key={link.path}
//                 className={`nav-item ${
//                   activeLink === link.path || (link.hasDropdown && activeLink.startsWith(link.path))
//                     ? 'active'
//                     : ''
//                 } ${link.hasDropdown ? 'has-dropdown' : ''}`}
//                 style={{
//                   position: 'relative',
//                   display: 'flex',
//                   alignItems: 'center'
//                 }}
//                 onMouseEnter={() => {
//                   if (link.path === '/learn') setClassDropdownOpen(true);
//                   if (link.path === '/practice') setPracticeDropdownOpen(true);
//                 }}
//                 onMouseLeave={() => {
//                   if (link.path === '/learn') setClassDropdownOpen(false);
//                   if (link.path === '/practice') setPracticeDropdownOpen(false);
//                 }}
//               >
//                 {link.hasDropdown ? (
//                   <div className="nav-link-wrapper" style={{ position: 'relative' }}>
//                     <Link
//                       to={link.path}
//                       className="nav-link"
//                       style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '5px'
//                       }}
//                     >
//                       {link.name}
//                       <FaChevronDown size={10} />
//                     </Link>
//                     <AnimatePresence>
//                       {(link.path === '/learn' ? classDropdownOpen : practiceDropdownOpen) && (
//                         <motion.div
//                           className="nav-dropdown"
//                           initial={{ opacity: 0, y: -10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           exit={{ opacity: 0, y: -10 }}
//                           style={{
//                             position: 'absolute',
//                             top: '100%',
//                             left: 0,
//                             background: 'white',
//                             borderRadius: '8px',
//                             boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
//                             minWidth: '160px',
//                             zIndex: 1000,
//                             padding: '10px 0'
//                           }}
//                         >
//                           <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
//                             {link.dropdownItems.map((dropdownItem) => (
//                               <li key={dropdownItem.path}>
//                                 <Link
//                                   to={dropdownItem.path}
//                                   className="dropdown-link"
//                                   style={{
//                                     display: 'block',
//                                     padding: '8px 16px',
//                                     textDecoration: 'none',
//                                     color: '#333',
//                                     transition: 'background 0.3s'
//                                   }}
//                                   onMouseEnter={(e) => {
//                                     e.target.style.background = '#f5f5f5';
//                                   }}
//                                   onMouseLeave={(e) => {
//                                     e.target.style.background = 'transparent';
//                                   }}
//                                 >
//                                   {dropdownItem.name}
//                                 </Link>
//                               </li>
//                             ))}
//                           </ul>
//                         </motion.div>
//                       )}
//                     </AnimatePresence>
//                   </div>
//                 ) : (
//                   <Link
//                     to={link.path}
//                     className="nav-link"
//                     style={{
//                       display: 'block',
//                       textDecoration: 'none',
//                       color: 'inherit'
//                     }}
//                   >
//                     {link.name}
//                   </Link>
//                 )}
//               </li>
//             ))}
 
//             {/* Language Button - Button Style */}
//             <li
//               className="nav-item"
//               style={{
//                 position: 'relative',
//                 display: 'flex',
//                 alignItems: 'center'
//               }}
//             >
//               <div
//                 className="nav-link-wrapper"
//                 style={{
//                   position: 'relative'
//                 }}
//                 onMouseEnter={() => setLangDropdownOpen(true)}
//                 onMouseLeave={() => setLangDropdownOpen(false)}
//               >
//                 <button
//                   className="language-button"
//                   style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '8px',
//                     background: 'transparent',
//                     border: '1px solid #ddd',
//                     borderRadius: '6px',
//                     padding: '8px 12px',
//                     cursor: 'pointer',
//                     fontSize: '14px',
//                     fontWeight: '500',
//                     color: '#333',
//                     transition: 'all 0.3s ease',
//                     minWidth: '100px',
//                     justifyContent: 'center'
//                   }}
//                   onMouseEnter={(e) => {
//                     e.target.style.background = '#f8f9fa';
//                     e.target.style.borderColor = '#2D5D7B';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.target.style.background = 'transparent';
//                     e.target.style.borderColor = '#ddd';
//                   }}
//                 >
//                   <FaGlobe size={14} />
//                   <span>{i18n.language.toUpperCase()}</span>
//                   <FaChevronDown size={10} />
//                 </button>
               
//                 <AnimatePresence>
//                   {langDropdownOpen && (
//                     <motion.div
//                       className="nav-dropdown"
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       style={{
//                         position: 'absolute',
//                         top: '100%',
//                         right: 0,
//                         background: 'white',
//                         borderRadius: '8px',
//                         boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
//                         minWidth: '140px',
//                         zIndex: 1000,
//                         padding: '8px 0',
//                         marginTop: '5px'
//                       }}
//                     >
//                       <ul style={{
//                         margin: 0,
//                         padding: 0,
//                         listStyle: 'none',
//                         display: 'flex',
//                         flexDirection: 'column',
//                         gap: '2px'
//                       }}>
//                         {languages.map((lang) => (
//                           <li key={lang.code}>
//                             <button
//                               onClick={() => handleLanguageChange(lang.code)}
//                               className="dropdown-link"
//                               style={{
//                                 width: '100%',
//                                 border: 'none',
//                                 background: 'transparent',
//                                 padding: '10px 16px',
//                                 textAlign: 'left',
//                                 cursor: 'pointer',
//                                 fontSize: '14px',
//                                 color: '#333',
//                                 transition: 'all 0.3s ease',
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 borderRadius: '0'
//                               }}
//                               onMouseEnter={(e) => {
//                                 e.target.style.background = '#2D5D7B';
//                                 e.target.style.color = 'white';
//                               }}
//                               onMouseLeave={(e) => {
//                                 e.target.style.background = 'transparent';
//                                 e.target.style.color = '#333';
//                               }}
//                             >
//                               {lang.label}
//                             </button>
//                           </li>
//                         ))}
//                       </ul>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             </li>
//           </ul>
//         </div>
 
//         {/* Avatar Only - Mobile Toggler Removed */}
//         <div className="navbar-end" style={{ display: 'flex', alignItems: 'center' }}>
//           <div
//             className="navbar-avatar-container"
//             style={{ position: 'relative', cursor: 'pointer' }}
//             onMouseEnter={() => setAvatarOpen(true)}
//             onMouseLeave={() => setAvatarOpen(false)}
//           >
//             <FaUserCircle size={30} color="#666" />
//             <AnimatePresence>
//               {avatarOpen && (
//                 <motion.div
//                   className="avatar-dropdown"
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   style={{
//                     position: 'absolute',
//                     top: '100%',
//                     right: 0,
//                     background: 'white',
//                     borderRadius: '8px',
//                     boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
//                     padding: '10px',
//                     minWidth: '120px',
//                     zIndex: 1000
//                   }}
//                 >
//                   <button
//                     onClick={handleLogout}
//                     className="logout-button"
//                     style={{
//                       width: '100%',
//                       border: 'none',
//                       background: 'transparent',
//                       padding: '8px 12px',
//                       cursor: 'pointer',
//                       textAlign: 'left',
//                       borderRadius: '4px',
//                       transition: 'background 0.3s',
//                       fontSize: '14px',
//                       color: '#333'
//                     }}
//                     onMouseEnter={(e) => {
//                       e.target.style.background = '#f5f5f5';
//                     }}
//                     onMouseLeave={(e) => {
//                       e.target.style.background = 'transparent';
//                     }}
//                   >
//                     Logout
//                   </button>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>
//       </div>
//     </motion.nav>
//   );
// };
 
// export default Navbar;







import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCircle, FaChevronDown, FaGlobe } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import './Navbarrr.css';
import novyaLogo from '../home/assets/NOVYA LOGO.png';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [classDropdownOpen, setClassDropdownOpen] = useState(false);
  const [practiceDropdownOpen, setPracticeDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);

  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'ml', label: 'മലയാളം' },
  ];

  // Fetch avatar and name from localStorage
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    let storedData = null;

    if (userRole === 'student') {
      storedData = localStorage.getItem('studentData');
    } else if (userRole === 'parent') {
      storedData = localStorage.getItem('parentData');
    }

    if (storedData) {
      const parsed = JSON.parse(storedData);
      setAvatar(parsed.avatar || null);
      setName(`${parsed.firstName || ''} ${parsed.lastName || ''}`);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setActiveLink(location.pathname);
    setAvatarOpen(false);
    setClassDropdownOpen(false);
    setPracticeDropdownOpen(false);
    setLangDropdownOpen(false);

    const hideNavbarRoutes = ['/mock-test', '/quick-practice'];
    const shouldHideNavbar = hideNavbarRoutes.some(route =>
      location.pathname.includes(route)
    );

    setShowNavbar(!shouldHideNavbar);
  }, [location.pathname]);

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    setLangDropdownOpen(false);
  };

  const navLinks = [
    { path: '/student/dashboard', name: t('home', 'Home') },
    {
      path: '/learn',
      name: t('class_room', 'Class Room'),
      hasDropdown: true,
      dropdownItems: [
        { path: '/learn', name: t('class_7', 'Class 7') },
        { path: '/learn/class8', name: t('class_8', 'Class 8') },
        { path: '/learn/class9', name: t('class_9', 'Class 9') },
        { path: '/learn/class10', name: t('class_10', 'Class 10') },
      ],
    },
    {
      path: '/practice',
      name: t('practice', 'Practice'),
      hasDropdown: true,
      dropdownItems: [
        { path: '/quick-practice', name: t('quick_practice', 'Quick Practice') },
        { path: '/mock-test', name: t('mock_test', 'Mock Test') },
      ],
    },
    { path: '/career', name: t('career', 'Career') },
  ];

  if (!showNavbar) return null;

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-brand" style={{ display: 'flex', alignItems: 'center' }}>
        <Link 
          to="/student/dashboard" 
          className="navbar-logo-link"
          style={{ textDecoration: 'none' }} // <-- remove underline
        >
          <img src={novyaLogo} alt="NOVYA Logo" style={{ height: '50px' }} />
          <motion.span
            style={{
              background: 'linear-gradient(90deg, #2D5D7B 0%, #4a8db7 25%, #FF6B6B 50%, #FFD166 75%, #2D5D7B 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              fontWeight: '800',
              fontSize: '1.8rem',
              marginLeft: '12px',
              letterSpacing: '1px',
              fontFamily: "'Poppins', sans-serif",
              backgroundSize: '200% auto',
              animation: 'gradientText 3s ease infinite',
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ backgroundPosition: 'right center', transition: { duration: 1.5 } }}
          >
            NOVYA
          </motion.span>
        </Link>
      </div>
        {/* Desktop Links */}
        <div className="navbar-desktop-links">
          <ul style={{ display: 'flex', alignItems: 'center', margin: 0, padding: 0, listStyle: 'none', gap: '20px' }}>
            {navLinks.map((link) => (
              <li
                key={link.path}
                className={`nav-item ${activeLink === link.path || (link.hasDropdown && activeLink.startsWith(link.path)) ? 'active' : ''} ${link.hasDropdown ? 'has-dropdown' : ''}`}
                style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
                onMouseEnter={() => {
                  if (link.path === '/learn') setClassDropdownOpen(true);
                  if (link.path === '/practice') setPracticeDropdownOpen(true);
                }}
                onMouseLeave={() => {
                  if (link.path === '/learn') setClassDropdownOpen(false);
                  if (link.path === '/practice') setPracticeDropdownOpen(false);
                }}
              >
                {link.hasDropdown ? (
                  <div className="nav-link-wrapper" style={{ position: 'relative' }}>
                    <Link
                      to={link.path}
                      className="nav-link"
                      style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      {link.name}
                      <FaChevronDown size={10} />
                    </Link>
                    <AnimatePresence>
                      {(link.path === '/learn' ? classDropdownOpen : practiceDropdownOpen) && (
                        <motion.div
                          className="nav-dropdown"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            background: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            minWidth: '160px',
                            zIndex: 1000,
                            padding: '10px 0'
                          }}
                        >
                          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                            {link.dropdownItems.map((dropdownItem) => (
                              <li key={dropdownItem.path}>
                                <Link
                                  to={dropdownItem.path}
                                  className="dropdown-link"
                                  style={{ display: 'block', padding: '8px 16px', textDecoration: 'none', color: '#333', transition: 'background 0.3s' }}
                                  onMouseEnter={(e) => { e.target.style.background = '#f5f5f5'; }}
                                  onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
                                >
                                  {dropdownItem.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link to={link.path} className="nav-link" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                    {link.name}
                  </Link>
                )}
              </li>
            ))}

            {/* Language Button */}
            <li className="nav-item" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div
                className="nav-link-wrapper"
                style={{ position: 'relative' }}
                onMouseEnter={() => setLangDropdownOpen(true)}
                onMouseLeave={() => setLangDropdownOpen(false)}
              >
                <button
                  className="language-button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'transparent',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#333',
                    transition: 'all 0.3s ease',
                    minWidth: '100px',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => { e.target.style.background = '#f8f9fa'; e.target.style.borderColor = '#2D5D7B'; }}
                  onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.borderColor = '#ddd'; }}
                >
                  <FaGlobe size={14} />
                  <span>{i18n.language.toUpperCase()}</span>
                  <FaChevronDown size={10} />
                </button>

                <AnimatePresence>
                  {langDropdownOpen && (
                    <motion.div
                      className="nav-dropdown"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        background: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        minWidth: '140px',
                        zIndex: 1000,
                        padding: '8px 0',
                        marginTop: '5px'
                      }}
                    >
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {languages.map((lang) => (
                          <li key={lang.code}>
                            <button
                              onClick={() => handleLanguageChange(lang.code)}
                              className="dropdown-link"
                              style={{
                                width: '100%',
                                border: 'none',
                                background: 'transparent',
                                padding: '10px 16px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontSize: '14px',
                                color: '#333',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius: '0'
                              }}
                              onMouseEnter={(e) => { e.target.style.background = '#2D5D7B'; e.target.style.color = 'white'; }}
                              onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#333'; }}
                            >
                              {lang.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </li>
          </ul>
        </div>

        {/* Avatar Dropdown */}
        <div
          className="navbar-end"
          style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingLeft: '20px' }}
        >
          <div
            className="navbar-avatar-container"
            style={{
              position: 'relative',
              cursor: 'pointer',
            }}
            onMouseEnter={() => setAvatarOpen(true)}
            onMouseLeave={() => setAvatarOpen(false)}
          >
            {/* Avatar with Name */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f0f0f0',
                  transition: 'transform 0.2s',
                }}
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt="User Avatar"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <FaUserCircle size={36} color="#4B5563" />
                )}
              </div>
              <span style={{ fontWeight: 500, color: '#111827' }}>
                {name || 'User'}
              </span>
            </div>

            {/* Dropdown */}
            <AnimatePresence>
              {avatarOpen && (
                <motion.div
                  className="avatar-dropdown"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    background: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    padding: '10px 0',
                    minWidth: '150px',
                    zIndex: 1000,
                  }}
                >
                  <button
                    onClick={() => navigate('/user-details')}
                    className="profile-button"
                    style={{
                      width: '100%',
                      border: 'none',
                      background: 'transparent',
                      padding: '10px 16px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      borderRadius: '6px',
                      fontSize: '14px',
                      color: '#1F2937',
                      transition: 'background 0.2s, color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#E5E7EB';
                      e.target.style.color = '#111827';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#1F2937';
                    }}
                  >
                    View Profile
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
