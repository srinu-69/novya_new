import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaCog, FaBars, FaTimes, FaGlobe, FaChevronDown } from 'react-icons/fa';
import novyaLogo from './assets/NOVYA LOGO.png';

function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'ml', name: 'മലയാളം' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
  ];

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setShowLangDropdown(false);
  };

  useEffect(() => {
    document.title = `${t('navbar.title')} | NOVYA - Your Smart Learning Platform`;
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 992) {
        setIsMobileMenuOpen(false);
        setShowLangDropdown(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [t]);

  // Enhanced useEffect to check login status
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const userRole = localStorage.getItem('userRole');
      const userToken = localStorage.getItem('userToken');
      
      // Get user data from the correct localStorage key based on role
      let userData = null;
      if (userRole === 'student') {
        userData = localStorage.getItem('studentData');
      } else if (userRole === 'parent') {
        userData = localStorage.getItem('parentData');
      }
      
      console.log('Checking login status:', { loggedIn, userRole, userData });
      
      setIsLoggedIn(loggedIn && !!userToken);
      
      // Safe JSON parsing with error handling
      try {
        if (userData) {
          const parsedData = JSON.parse(userData);
          // Create user object with name field for navbar display
          setUser({
            name: `${parsedData.firstName || ''} ${parsedData.lastName || ''}`.trim() || 'User',
            firstName: parsedData.firstName,
            lastName: parsedData.lastName,
            email: parsedData.email,
            role: parsedData.role,
            profileImage: parsedData.profileImage
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        console.log('User data is not valid JSON:', userData);
        setUser(null);
      }
      
      setActiveLink(window.location.pathname);
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    window.addEventListener('loginStatusChanged', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('loginStatusChanged', checkLoginStatus);
    };
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest('.position-relative')) {
        setShowProfileDropdown(false);
      }
      if (showLangDropdown && !event.target.closest('.lang-container')) {
        setShowLangDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileDropdown, showLangDropdown]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('studentData');
    localStorage.removeItem('parentData');
    localStorage.removeItem('studentDataLastFetch');
    localStorage.removeItem('parentDataLastFetch');
    
    setIsLoggedIn(false);
    setUser(null);
    setShowProfileDropdown(false);
    
    window.dispatchEvent(new Event('loginStatusChanged'));
    navigate('/login');
  };

  const navItems = [
    { name: t('navbar.links.home'), path: '/' },
    { name: t('navbar.links.courses'), path: '/courses' },
    { name: t('navbar.links.freeDemo'), path: '/free-demo' },
    { name: t('navbar.links.pricing'), path: '/pricing' },
    { name: t('navbar.links.faqs'), path: '/faqs' },
    { name: t('navbar.links.contact'), path: '/contact' }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div style={{ paddingTop: windowWidth > 992 ? '90px' : '80px' }}>
      <motion.nav
        className="shadow-sm fixed-top"
        style={{
          margin: windowWidth > 992 ? '20px auto' : '0',
          width: windowWidth > 992 ? '90%' : '100%',
          maxWidth: windowWidth > 992 ? '1400px' : '100%',
          borderRadius: windowWidth > 992 ? '50px' : '0',
          background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.95), rgb(255, 255, 255))',
          backdropFilter: 'blur(12px)',
          border: windowWidth > 992 ? '1px solid rgba(0, 0, 0, 0.05)' : 'none',
          zIndex: 1030,
          padding: windowWidth > 992 ? '1rem 2rem' : '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          gap: '1rem',
        }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 70, damping: 14 }}
      >
        {/* Logo Section */}
        <motion.div
          className="d-flex align-items-center"
          style={{ 
            flex: windowWidth > 992 ? '0 0 auto' : '1',
            minWidth: windowWidth > 992 ? 'auto' : '0'
          }}
        >
          {windowWidth <= 992 && (
            <motion.button
              onClick={toggleMobileMenu}
              className="btn p-0 me-3"
              whileTap={{ scale: 0.9 }}
              style={{ background: 'transparent', border: 'none', flexShrink: 0 }}
            >
              {isMobileMenuOpen ? (
                <FaTimes size={24} color="#2D5D7B" />
              ) : (
                <FaBars size={24} color="#2D5D7B" />
              )}
            </motion.button>
          )}
          
          <motion.div
            className="fw-bold fs-3 d-flex align-items-center"
            whileHover={{ scale: windowWidth > 992 ? 1.05 : 1 }}
            whileTap={{ scale: 0.95 }}
            style={{ flexShrink: 0 }}
          >
            <Link 
              to="/" 
              style={{ 
                textDecoration: 'none', 
                display: 'flex', 
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <img
                src={novyaLogo}
                alt="NOVYA Logo"
                style={{ 
                  height: '60px', 
                  width: 'auto', 
                  maxWidth: '180px', 
                  objectFit: 'contain', 
                  display: 'block',
                  flexShrink: 0
                }}
              />
              <motion.span
                style={{
                  background: 'linear-gradient(90deg, #2D5D7B 0%, #4a8db7 25%, #FF6B6B 50%, #FFD166 75%, #2D5D7B 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  fontWeight: '800',
                  fontSize: windowWidth > 768 ? '1.8rem' : '1.5rem',
                  letterSpacing: '1px',
                  fontFamily: "'Poppins', sans-serif",
                  backgroundSize: '200% auto',
                  animation: 'gradientText 3s ease infinite',
                  whiteSpace: 'nowrap'
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                whileHover={{
                  backgroundPosition: 'right center',
                  transition: { duration: 1.5 }
                }}
              >
                NOVYA
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Desktop Navigation Links - Centered */}
        {windowWidth > 992 && (
          <motion.div 
            className="d-flex justify-content-center"
            style={{ 
              flex: '1 1 auto',
              minWidth: 0
            }}
          >
            <motion.ul 
              className="d-flex align-items-center m-0 p-0 list-unstyled"
              style={{
                background: '#f7f9fb',
                borderRadius: '50px',
                padding: '0.5rem 1rem',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                flexWrap: 'nowrap',
                overflow: 'hidden'
              }}
            >
              {navItems.map(({ name, path }) => (
                <motion.li
                  key={name}
                  style={{ 
                    listStyle: 'none',
                    flexShrink: 0
                  }}
                  onMouseEnter={() => setActiveLink(path)}
                  onMouseLeave={() => setActiveLink(window.location.pathname)}
                >
                  <Link
                    to={path}
                    className="fw-medium position-relative"
                    style={{
                      color: activeLink === path ? '#2D5D7B' : '#222831',
                      fontSize: '0.95rem',
                      textDecoration: 'none',
                      padding: '0.5rem 1.2rem',
                      display: 'inline-block',
                      transition: 'color 0.3s ease',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {name}
                    <motion.span
                      style={{
                        position: 'absolute',
                        bottom: '-2px',
                        left: '50%',
                        width: '0%',
                        height: '2px',
                        background: '#ff3d3d',
                        transform: 'translateX(-50%)',
                      }}
                      animate={{
                        width: activeLink === path ? '80%' : '0%',
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}

        {/* Right Side Controls */}
        <motion.div 
          className="d-flex align-items-center" 
          style={{ 
            minHeight: '44px',
            flex: windowWidth > 992 ? '0 0 auto' : 'none',
            justifyContent: 'flex-end',
            gap: '0.75rem'
          }}
        >
          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === 'development' && windowWidth > 1200 && (
            <small style={{ 
              fontSize: '10px', 
              color: '#666',
            }}>
              {isLoggedIn ? 'Logged In' : 'Not Logged In'}
            </small>
          )}

          {/* Language Dropdown */}
          <div className="lang-container position-relative" onClick={() => setShowLangDropdown(!showLangDropdown)}>
            <motion.button
              className="btn position-relative d-flex align-items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: '#f7f9fb',
                borderRadius: '50px',
                fontSize: '0.9rem',
                padding: '0.5rem 1rem',
                border: '1px solid #e0e0e0',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                minWidth: '120px',
                justifyContent: 'center'
              }}
            >
              <FaGlobe size={16} className="me-2" />
              <span style={{ flex: 1, textAlign: 'center' }}>
                {t('navbar.language') || 'Language'}
              </span>
              <FaChevronDown 
                size={10} 
                style={{ 
                  marginLeft: '5px',
                  transform: showLangDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }} 
              />
            </motion.button>
            <AnimatePresence>
              {showLangDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 1000,
                    minWidth: '150px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    padding: '8px 0',
                  }}
                >
                  {languages.map((lang) => (
                    <div
                      key={lang.code}
                      className={`lang-item ${i18n.language === lang.code ? 'active' : ''}`}
                      onClick={() => handleLanguageChange(lang.code)}
                      style={{
                        padding: '10px 16px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        backgroundColor: i18n.language === lang.code ? '#f0f0f0' : 'transparent',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => {
                        if (i18n.language !== lang.code) e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      {lang.name}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Section or Login Button */}
          {isLoggedIn && user ? (
            <motion.div
              className="position-relative"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              style={{ flexShrink: 0 }}
            >
              <motion.div
                className="d-flex align-items-center cursor-pointer"
                whileHover={{ scale: windowWidth > 992 ? 1.05 : 1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: '#f7f9fb',
                  borderRadius: '50px',
                  padding: windowWidth > 576 ? '0.5rem 1rem' : '0.5rem',
                  position: 'relative',
                  cursor: 'pointer',
                  minWidth: windowWidth > 768 ? '140px' : 'auto',
                  justifyContent: windowWidth > 768 ? 'flex-start' : 'center'
                }}
              >
                <img
                  src={user.profileImage || "https://randomuser.me/api/portraits/men/32.jpg"}
                  alt="Profile"
                  className="rounded-circle me-2"
                  style={{ 
                    width: '36px', 
                    height: '36px', 
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
                {windowWidth > 768 && (
                  <span 
                    className="fw-medium"
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '80px'
                    }}
                  >
                    {user.name || 'User'}
                  </span>
                )}
                <motion.span
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    left: '50%',
                    width: '0%',
                    height: '2px',
                    background: '#ff3d3d',
                    transform: 'translateX(-50%)',
                  }}
                  animate={{
                    width: showProfileDropdown ? '80%' : '0%',
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>

              <AnimatePresence>
                {showProfileDropdown && (
                  <motion.div
                    className="dropdown-menu show p-0 shadow-lg"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '100%',
                      marginTop: '5px',
                      minWidth: '200px',
                      borderRadius: '15px',
                      border: 'none',
                      backgroundColor: 'white',
                      display: 'block',
                      overflow: 'hidden',
                      zIndex: 9999
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link
                      to="/profile"
                      className="dropdown-item px-3 py-2 d-flex align-items-center position-relative"
                      style={{ color: '#222831', fontSize: '0.9rem' }}
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <FaUser className="me-2" /> {t('navbar.profile') || 'My Profile'}
                      <motion.span
                        style={{
                          position: 'absolute',
                          bottom: '0',
                          left: '0',
                          width: '0%',
                          height: '2px',
                          background: '#ff3d3d',
                        }}
                        whileHover={{ width: '100%' }}
                        transition={{ duration: 0.3 }}
                      />
                    </Link>
                    <Link
                      to="/settings"
                      className="dropdown-item px-3 py-2 d-flex align-items-center position-relative"
                      style={{ color: '#222831', fontSize: '0.9rem' }}
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <FaCog className="me-2" /> {t('navbar.settings') || 'Settings'}
                      <motion.span
                        style={{
                          position: 'absolute',
                          bottom: '0',
                          left: '0',
                          width: '0%',
                          height: '2px',
                          background: '#ff3d3d',
                        }}
                        whileHover={{ width: '100%' }}
                        transition={{ duration: 0.3 }}
                      />
                    </Link>
                    <div
                      className="dropdown-item px-3 py-2 d-flex align-items-center position-relative"
                      style={{ color: '#dc3545', fontSize: '0.9rem', cursor: 'pointer' }}
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className="me-2" /> {t('navbar.logout') || 'Logout'}
                      <motion.span
                        style={{
                          position: 'absolute',
                          bottom: '0',
                          left: '0',
                          width: '0%',
                          height: '2px',
                          background: '#ff3d3d',
                        }}
                        whileHover={{ width: '100%' }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.button
              onClick={() => navigate('/login')}
              className="btn position-relative"
              whileHover={{ 
                scale: windowWidth > 992 ? 1.05 : 1,
                boxShadow: '0 6px 16px rgba(255, 61, 61, 0.2)'
              }}
              whileTap={{ scale: 0.95 }}
              style={{
                backgroundColor: '#2D5D7B',
                color: '#fff',
                borderRadius: '50px',
                fontWeight: '600',
                padding: windowWidth > 576 ? '10px 24px' : '8px 16px',
                fontSize: windowWidth > 576 ? '1rem' : '0.9rem',
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                border: 'none',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                minWidth: windowWidth > 576 ? '140px' : 'auto',
                flexShrink: 0
              }}
            >
              {windowWidth > 576 ? `${t('navbar.login') || 'Login'} / ${t('navbar.register') || 'Register'}` : t('navbar.login') || 'Login'}
              <motion.span
                style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  width: '0%',
                  height: '3px',
                  background: '#ff3d3d',
                }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          )}
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && windowWidth <= 992 && (
            <motion.div
              className="mobile-menu-container"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'fixed',
                top: '80px',
                left: 0,
                right: 0,
                background: 'white',
                padding: '1rem',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                zIndex: 1029
              }}
            >
              <ul className="list-unstyled">
                {navItems.map(({ name, path }) => (
                  <motion.li
                    key={name}
                    className="mb-2"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={path}
                      className="d-block p-3 fw-medium"
                      style={{
                        color: activeLink === path ? '#2D5D7B' : '#222831',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        backgroundColor: activeLink === path ? '#f7f9fb' : 'transparent',
                      }}
                      onClick={() => {
                        setActiveLink(path);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {name}
                    </Link>
                  </motion.li>
                ))}
                
                {/* Mobile Language Dropdown */}
                <motion.li className="mb-3">
                  <div className="lang-container" onClick={() => setShowLangDropdown(!showLangDropdown)}>
                    <div className="d-flex align-items-center p-3 fw-medium" style={{ cursor: 'pointer', borderRadius: '8px', backgroundColor: showLangDropdown ? '#f7f9fb' : 'transparent' }}>
                      <FaGlobe size={16} className="me-2" />
                      {t('navbar.language') || 'Language'}
                      <FaChevronDown 
                        size={10} 
                        style={{ 
                          marginLeft: 'auto',
                          transform: showLangDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s ease'
                        }} 
                      />
                    </div>
                  </div>
                  <AnimatePresence>
                    {showLangDropdown && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          backgroundColor: 'white',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          marginTop: '5px',
                          maxHeight: '200px',
                          overflowY: 'auto',
                          zIndex: 1000
                        }}
                      >
                        {languages.map((lang) => (
                          <div
                            key={lang.code}
                            className={`p-3 ${i18n.language === lang.code ? 'active' : ''}`}
                            onClick={() => handleLanguageChange(lang.code)}
                            style={{
                              cursor: 'pointer',
                              fontSize: '14px',
                              backgroundColor: i18n.language === lang.code ? '#f0f0f0' : 'transparent',
                              transition: 'background-color 0.2s',
                              borderBottom: '1px solid #eee'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                            onMouseLeave={(e) => {
                              if (i18n.language !== lang.code) e.target.style.backgroundColor = 'transparent';
                            }}
                          >
                            {lang.name}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
                
                {/* Mobile Login Button */}
                {!isLoggedIn && (
                  <motion.li className="mt-3">
                    <button
                      onClick={() => {
                        navigate('/login');
                        setIsMobileMenuOpen(false);
                      }}
                      className="btn w-100"
                      style={{
                        backgroundColor: '#2D5D7B',
                        color: '#fff',
                        borderRadius: '25px',
                        fontWeight: '600',
                        padding: '10px',
                        border: 'none'
                      }}
                    >
                      {t('navbar.login') || 'Login'} / {t('navbar.register') || 'Register'}
                    </button>
                  </motion.li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Add CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradientText {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
}

export default Navbar;