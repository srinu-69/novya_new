 
import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
 
function Testimonials() {
  const { t, i18n } = useTranslation();
 
  useEffect(() => {
    document.title = t('testimonials.pageTitle');
  }, [t]);
 
  const testimonials = [
    {
      nameKey: 'testimonials.name1',
      roleKey: 'testimonials.role1',
      quoteKey: 'testimonials.quote1',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      nameKey: 'testimonials.name2',
      roleKey: 'testimonials.role2',
      quoteKey: 'testimonials.quote2',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      nameKey: 'testimonials.name3',
      roleKey: 'testimonials.role3',
      quoteKey: 'testimonials.quote3',
      rating: 4,
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
    }
  ];
 
  // Star rating component
  const StarRating = ({ rating }) => (
    <div className="d-flex mb-2">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          style={{
            color: i < rating ? '#FFD700' : '#ddd',
            fontSize: '1rem'
          }}
        />
      ))}
    </div>
  );
 
  return (
    <section
      style={{
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9f5ff 100%)',
        overflow: 'hidden',
        position: 'relative'
      }}
      className="py-5"
    >
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(45,93,123,0.1) 0%, transparent 70%)',
        zIndex: 0
      }}></div>
     
      <div className="container position-relative" style={{ zIndex: 1 }}>
        <motion.h2
          className="text-center fw-bold mb-5"
          style={{
            color: '#2D5D7B',
            fontSize: '2.5rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <FaQuoteLeft className="me-2" style={{ color: '#1e88e5', fontSize: '1.5rem' }} />
          {t('testimonials.header')}
          <span style={{
            position: 'absolute',
            top: '-10px',
            right: 'calc(50% - 30px)',
            fontSize: '3rem',
            color: 'rgba(30, 136, 229, 0.1)',
            zIndex: -1
          }}>
            ”
          </span>
        </motion.h2>
 
        <div className="row g-4">
          {testimonials.map((testimonial, idx) => (
            <div className="col-md-4" key={idx}>
              <motion.div
                className="h-100"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                viewport={{ once: true }}
              >
                <div
                  className="p-4 rounded-4 h-100"
                  style={{
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(30, 136, 229, 0.1)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease'
                  }}
                  whileHover={{
                    y: -5,
                    boxShadow: '0 15px 40px rgba(30, 136, 229, 0.15)'
                  }}
                >
                  <div className="d-flex align-items-center mb-3">
                    <div
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: '#1e88e5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        border: '3px solid rgba(30, 136, 229, 0.2)'
                      }}
                    >
                      {t(testimonial.nameKey).charAt(0)}
                    </div>
                    <div className="ms-3">
                      <h5 className="mb-0 fw-bold" style={{ color: '#2D5D7B' }}>{t(testimonial.nameKey)}</h5>
                      <small className="text-muted">{t(testimonial.roleKey)}</small>
                    </div>
                  </div>
 
                  <StarRating rating={testimonial.rating} />
                 
                  <p className="fst-italic mb-0" style={{ color: '#455a64' }}>
                    <FaQuoteLeft className="me-2" style={{ color: 'rgba(30, 136, 229, 0.5)' }} />
                    {t(testimonial.quoteKey)}
                  </p>
                 
                  <div className="mt-3 pt-3 border-top border-light">
                    <small className="text-muted">{t('testimonials.verified')}</small>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
 
        {/* Trust indicators */}
        <motion.div
          className="mt-5 pt-4 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="d-flex flex-wrap justify-content-center align-items-center gap-4">
            <div className="d-flex align-items-center">
              <span className="fw-bold me-2" style={{ color: '#2D5D7B', fontSize: '1.5rem' }}>4.9/5</span>
              <div>
                <StarRating rating={5} />
                <small className="text-muted">{t('testimonials.averageRating')}</small>
              </div>
            </div>
           
            <div className="d-flex align-items-center">
              <span className="fw-bold me-2" style={{ color: '#2D5D7B', fontSize: '1.5rem' }}>10K+</span>
              <div>
                <div style={{ color: '#2D5D7B' }}>{t('testimonials.studentsTransformed')}</div>
                <small className="text-muted">{t('testimonials.acrossIndia')}</small>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
 
export default Testimonials;
 