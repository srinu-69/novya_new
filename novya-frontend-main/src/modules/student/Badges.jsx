import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFire, FaCrown, FaTrophy, FaArrowLeft } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Navbarrr from './Navbarrr';
import { API_CONFIG, djangoAPI } from '../../config/api';

const Badges = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [badges, setBadges] = useState({
    quickMaster: false,
    mockMaster: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setLoading(true);
        const response = await djangoAPI.get(API_CONFIG.DJANGO.BADGES.GET_BADGES);
        
        if (response && response.badges) {
          const badgeTypes = response.badges.map(badge => badge.badge_type);
          setBadges({
            quickMaster: badgeTypes.includes('quick_master'),
            mockMaster: badgeTypes.includes('mock_master')
          });
        }
      } catch (error) {
        console.error('Error fetching badges:', error);
        // Fallback to localStorage if API fails
        const quickMasterBadge = localStorage.getItem('quickMasterBadge') === 'true';
        const mockMasterBadge = localStorage.getItem('mockMasterBadge') === 'true';
        setBadges({
          quickMaster: quickMasterBadge,
          mockMaster: mockMasterBadge
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: '70px' }}>
      <Navbarrr />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '20px', 
            marginBottom: '30px' 
          }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '10px 16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: '#374151',
                fontWeight: '500'
              }}
            >
              <FaArrowLeft />
              Back
            </button>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              color: '#1F2937',
              margin: 0
            }}>
              {t('badges', 'Badges')}
            </h1>
          </div>

          {/* Your Badges Section */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: '24px'
            }}>
              {t('yourBadges', 'Your Badges')}
            </h2>

            {/* Quick Practice Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              background: 'white',
              borderRadius: '12px',
              marginBottom: '16px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <FaFire 
                  size={24} 
                  color={badges.quickMaster ? '#FF6B35' : '#9CA3AF'} 
                />
                <div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1F2937',
                    marginBottom: '4px'
                  }}>
                    {t('quickPractice', 'Quick Practice')}
                  </div>
                </div>
              </div>
              {badges.quickMaster && (
                <div style={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {t('quickMaster', 'Quick Master')}
                </div>
              )}
            </div>

            {/* Mock Tests Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  fontWeight: '500'
                }}>
                  {t('mockTests', 'Mock Tests')}
                </div>
              </div>
              {badges.mockMaster && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FaCrown size={16} color="#10b981" />
                  <div style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {t('mockMaster', 'Mock Master')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Badges;

