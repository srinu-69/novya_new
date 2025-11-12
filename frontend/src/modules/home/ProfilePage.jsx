// import React, { useState, useEffect } from 'react';
// import { FaChevronRight, FaUser, FaHeart, FaUserShield, FaMapMarkerAlt, FaGraduationCap, FaShoppingCart, FaCog, FaMoon, FaSun } from 'react-icons/fa';

// const ProfilePage = () => {
//    useEffect(() => {
//       document.title = "Profile page|NOVYA - Your Smart Learning Platform";
//     }, []);
//   const [activeTab, setActiveTab] = useState('personal');
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     phone: '',
//     gender: '',
//     dob: '',
//     category: '',
//     bloodGroup: '',
//     preferredLanguage: '',
//     learningStyle: '',
//     guardianName: '',
//     guardianRelation: '',
//     guardianPhone: '',
//     address: '',
//     city: '',
//     state: '',
//     pincode: '',
//     currentClass: '',
//     board: '',
//     schoolName: ''
//   });

//   const defaultSettings = {
//     aiVoice: 'Voice 1',
//     voiceSpeed: 1,
//     selectedAvatar: 'Avatar 1',
//     systemFont: 'Arial',
//     colorTheme: 'Light',
//     fontSize: 'Medium',
//     darkMode: false,
//     soundVolume: 80,
//     keyboardSound: true
//   };

//   const [settings, setSettings] = useState(defaultSettings);

//   // AI Voice options with realistic names
//   const aiVoices = [
//     { id: 'voice1', name: 'Emma (Female)' },
//     { id: 'voice2', name: 'David (Male)' },
//     { id: 'voice3', name: 'Sophia (Female)' },
//     { id: 'voice4', name: 'Liam (Male)' },
//     { id: 'voice5', name: 'Ava (Female)' }
//   ];

//   // Animated avatar options
//   const avatars = [
//     { id: 'avatar1', name: 'Avatar 1', image: 'https://cdn.dribbble.com/users/2364329/screenshots/6676901/02.png' },
//     { id: 'avatar2', name: 'Avatar 2', image: 'https://cdn.dribbble.com/users/2364329/screenshots/6676901/04.png' },
//     { id: 'avatar3', name: 'Avatar 3', image: 'https://cdn.dribbble.com/users/2364329/screenshots/6676901/07.png' },
//     { id: 'avatar4', name: 'Avatar 4', image: 'https://cdn.dribbble.com/users/2364329/screenshots/6676901/08.png' },
//     { id: 'avatar5', name: 'Avatar 5', image: 'https://cdn.dribbble.com/users/2364329/screenshots/6676901/10.png' }
//   ];

//   // Apply dark mode styles
//   useEffect(() => {
//     if (settings.darkMode) {
//       document.body.style.backgroundColor = '#121212';
//       document.body.style.color = '#ffffff';
//     } else {
//       document.body.style.backgroundColor = '#f8f9fa';
//       document.body.style.color = '#000000';
//     }
//   }, [settings.darkMode]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSettingsChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setSettings(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const resetSettings = () => {
//     setSettings(defaultSettings);
//   };

//   const toggleDarkMode = () => {
//     setSettings(prev => ({
//       ...prev,
//       darkMode: !prev.darkMode,
//       colorTheme: !prev.darkMode ? 'Dark' : 'Light'
//     }));
//   };

//   const getThemeStyles = () => {
//     return {
//       backgroundColor: settings.darkMode ? '#1e1e1e' : '#ffffff',
//       color: settings.darkMode ? '#ffffff' : '#000000',
//       borderColor: settings.darkMode ? '#444' : '#ddd',
//       inputBackground: settings.darkMode ? '#333' : '#ffffff',
//       inputColor: settings.darkMode ? '#ffffff' : '#000000',
//       secondaryBackground: settings.darkMode ? '#2d2d2d' : '#f8f9fa',
//       buttonPrimary: settings.darkMode ? '#5c7cff' : '#4a6bff',
//       buttonSecondary: settings.darkMode ? '#444' : '#f0f0f0'
//     };
//   };

//   const theme = getThemeStyles();

//   return (
//     <div style={{
//       fontFamily: settings.systemFont + ', sans-serif',
//       maxWidth: '1000px',
//       margin: '0 auto',
//       padding: '20px',
//       backgroundColor: theme.secondaryBackground,
//       minHeight: '100vh'
//     }}>
//       {/* Profile Header */}
//       <div style={{
//         display: 'flex',
//         alignItems: 'center',
//         padding: '15px',
//         backgroundColor: theme.backgroundColor,
//         borderRadius: '8px',
//         marginBottom: '20px',
//         boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
//         border: `1px solid ${theme.borderColor}`
//       }}>
//         <div style={{
//           width: '70px',
//           height: '70px',
//           borderRadius: '50%',
//           backgroundColor: '#e0e0e0',
//           marginRight: '15px',
//           overflow: 'hidden'
//         }}>
//           <img 
//             src="https://randomuser.me/api/portraits/men/32.jpg" 
//             alt="Profile" 
//             style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//           />
//         </div>
//         <div>
//           <h2 style={{ margin: '0', fontSize: '20px', fontWeight: '600' }}>
//             {formData.firstName || 'Your Name'}
//           </h2>
//           <p style={{ margin: '5px 0 0', color: settings.darkMode ? '#bbb' : '#666', fontSize: '14px' }}>
//             {formData.phone || 'Phone number'}
//           </p>
//         </div>
//         <button 
//           onClick={toggleDarkMode}
//           style={{
//             marginLeft: 'auto',
//             background: 'none',
//             border: 'none',
//             color: theme.color,
//             cursor: 'pointer',
//             fontSize: '20px'
//           }}
//         >
//           {settings.darkMode ? <FaSun /> : <FaMoon />}
//         </button>
//       </div>

//       <div style={{ display: 'flex' }}>
//         {/* Sidebar Navigation */}
//         <div style={{
//           width: '220px',
//           marginRight: '20px',
//           backgroundColor: theme.backgroundColor,
//           borderRadius: '8px',
//           padding: '15px',
//           boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
//           border: `1px solid ${theme.borderColor}`
//         }}>
//           <h3 style={{ 
//             fontSize: '16px',
//             fontWeight: '600',
//             color: settings.darkMode ? '#fff' : '#444',
//             borderBottom: `1px solid ${theme.borderColor}`,
//             paddingBottom: '10px',
//             margin: '0 0 15px 0'
//           }}>Personal Details</h3>
          
//           <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
//             {[
//               { id: 'personal', icon: <FaUser size={14} />, label: 'Personal Details' },
//               { id: 'preferences', icon: <FaHeart size={14} />, label: 'My Preferences' },
//               { id: 'guardian', icon: <FaUserShield size={14} />, label: 'Guardian Details' },
//               { id: 'address', icon: <FaMapMarkerAlt size={14} />, label: 'Address Details' },
//               { id: 'academic', icon: <FaGraduationCap size={14} />, label: 'Academic Details' },
//               { id: 'purchases', icon: <FaShoppingCart size={14} />, label: 'My Purchases' },
//               { id: 'settings', icon: <FaCog size={14} />, label: 'Settings' }
//             ].map(item => (
//               <li 
//                 key={item.id}
//                 style={{
//                   padding: '12px 0',
//                   borderBottom: `1px solid ${theme.borderColor}`,
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'space-between',
//                   cursor: 'pointer',
//                   color: activeTab === item.id ? '#4a6bff' : theme.color,
//                   fontWeight: activeTab === item.id ? '600' : '400',
//                   fontSize: '14px'
//                 }}
//                 onClick={() => setActiveTab(item.id)}
//               >
//                 <div style={{ display: 'flex', alignItems: 'center' }}>
//                   <span style={{ marginRight: '10px' }}>{item.icon}</span>
//                   {item.label}
//                 </div>
//                 <FaChevronRight size={12} />
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Main Content Area */}
//         <div style={{
//           flex: '1',
//           backgroundColor: theme.backgroundColor,
//           borderRadius: '8px',
//           padding: '20px',
//           boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
//           border: `1px solid ${theme.borderColor}`
//         }}>
//           {activeTab === 'personal' && (
//             <div>
//               <h3 style={{ 
//                 margin: '0 0 20px 0', 
//                 fontSize: '18px', 
//                 fontWeight: '600',
//                 color: theme.color
//               }}>Personal Details</h3>
              
//               <div style={{ marginBottom: '20px' }}>
//                 <label style={{ 
//                   display: 'block', 
//                   marginBottom: '8px',
//                   fontWeight: '500',
//                   color: settings.darkMode ? '#bbb' : '#555',
//                   fontSize: '14px'
//                 }}>First Name *</label>
//                 <input
//                   type="text"
//                   name="firstName"
//                   value={formData.firstName}
//                   onChange={handleChange}
//                   style={{
//                     width: '100%',
//                     padding: '10px',
//                     border: `1px solid ${theme.borderColor}`,
//                     borderRadius: '4px',
//                     fontSize: '14px',
//                     backgroundColor: theme.inputBackground,
//                     color: theme.inputColor
//                   }}
//                 />
//               </div>

//               <div style={{ marginBottom: '20px' }}>
//                 <label style={{ 
//                   display: 'block', 
//                   marginBottom: '8px',
//                   fontWeight: '500',
//                   color: settings.darkMode ? '#bbb' : '#555',
//                   fontSize: '14px'
//                 }}>Last Name</label>
//                 <input
//                   type="text"
//                   name="lastName"
//                   value={formData.lastName}
//                   onChange={handleChange}
//                   style={{
//                     width: '100%',
//                     padding: '10px',
//                     border: `1px solid ${theme.borderColor}`,
//                     borderRadius: '4px',
//                     fontSize: '14px',
//                     backgroundColor: theme.inputBackground,
//                     color: theme.inputColor
//                   }}
//                 />
//               </div>

//               <div style={{ marginBottom: '20px' }}>
//                 <label style={{ 
//                   display: 'block', 
//                   marginBottom: '8px',
//                   fontWeight: '500',
//                   color: settings.darkMode ? '#bbb' : '#555',
//                   fontSize: '14px'
//                 }}>Phone Number *</label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   style={{
//                     width: '100%',
//                     padding: '10px',
//                     border: `1px solid ${theme.borderColor}`,
//                     borderRadius: '4px',
//                     fontSize: '14px',
//                     backgroundColor: theme.inputBackground,
//                     color: theme.inputColor
//                   }}
//                 />
//               </div>

//               <div style={{ marginBottom: '20px' }}>
//                 <label style={{ 
//                   display: 'block', 
//                   marginBottom: '8px',
//                   fontWeight: '500',
//                   color: settings.darkMode ? '#bbb' : '#555',
//                   fontSize: '14px'
//                 }}>Gender *</label>
//                 <select
//                   name="gender"
//                   value={formData.gender}
//                   onChange={handleChange}
//                   style={{
//                     width: '100%',
//                     padding: '10px',
//                     border: `1px solid ${theme.borderColor}`,
//                     borderRadius: '4px',
//                     fontSize: '14px',
//                     color: formData.gender ? theme.inputColor : '#999',
//                     backgroundColor: theme.inputBackground
//                   }}
//                 >
//                   <option value="">Select Gender</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>

//               <div style={{ marginBottom: '20px' }}>
//                 <label style={{ 
//                   display: 'block', 
//                   marginBottom: '8px',
//                   fontWeight: '500',
//                   color: settings.darkMode ? '#bbb' : '#555',
//                   fontSize: '14px'
//                 }}>Date of Birth *</label>
//                 <input
//                   type="date"
//                   name="dob"
//                   value={formData.dob}
//                   onChange={handleChange}
//                   style={{
//                     width: '100%',
//                     padding: '10px',
//                     border: `1px solid ${theme.borderColor}`,
//                     borderRadius: '4px',
//                     fontSize: '14px',
//                     color: formData.dob ? theme.inputColor : '#999',
//                     backgroundColor: theme.inputBackground
//                   }}
//                 />
//               </div>

//               <div style={{ marginBottom: '20px' }}>
//                 <label style={{ 
//                   display: 'block', 
//                   marginBottom: '8px',
//                   fontWeight: '500',
//                   color: settings.darkMode ? '#bbb' : '#555',
//                   fontSize: '14px'
//                 }}>Category *</label>
//                 <select
//                   name="category"
//                   value={formData.category}
//                   onChange={handleChange}
//                   style={{
//                     width: '100%',
//                     padding: '10px',
//                     border: `1px solid ${theme.borderColor}`,
//                     borderRadius: '4px',
//                     fontSize: '14px',
//                     color: formData.category ? theme.inputColor : '#999',
//                     backgroundColor: theme.inputBackground
//                   }}
//                 >
//                   <option value="">Select Category</option>
//                   <option value="General">General</option>
//                   <option value="OBC">OBC</option>
//                   <option value="SC">SC</option>
//                   <option value="ST">ST</option>
//                 </select>
//               </div>

//               <div style={{ marginBottom: '20px' }}>
//                 <label style={{ 
//                   display: 'block', 
//                   marginBottom: '8px',
//                   fontWeight: '500',
//                   color: settings.darkMode ? '#bbb' : '#555',
//                   fontSize: '14px'
//                 }}>Blood Group</label>
//                 <select
//                   name="bloodGroup"
//                   value={formData.bloodGroup}
//                   onChange={handleChange}
//                   style={{
//                     width: '100%',
//                     padding: '10px',
//                     border: `1px solid ${theme.borderColor}`,
//                     borderRadius: '4px',
//                     fontSize: '14px',
//                     color: formData.bloodGroup ? theme.inputColor : '#999',
//                     backgroundColor: theme.inputBackground
//                   }}
//                 >
//                   <option value="">Select Blood Group</option>
//                   <option value="A+">A+</option>
//                   <option value="B+">B+</option>
//                   <option value="O+">O+</option>
//                   <option value="AB+">AB+</option>
//                 </select>
//               </div>

//               <div style={{ 
//                 display: 'flex', 
//                 justifyContent: 'flex-end',
//                 marginTop: '20px'
//               }}>
//                 <button style={{
//                   padding: '8px 16px',
//                   backgroundColor: theme.buttonSecondary,
//                   border: 'none',
//                   borderRadius: '4px',
//                   marginRight: '10px',
//                   cursor: 'pointer',
//                   fontSize: '14px',
//                   color: theme.color
//                 }}>
//                   Cancel
//                 </button>
//                 <button style={{
//                   padding: '8px 16px',
//                   backgroundColor: theme.buttonPrimary,
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '4px',
//                   cursor: 'pointer',
//                   fontSize: '14px'
//                 }}>
//                   Save Changes
//                 </button>
//               </div>
//             </div>
//           )}

//           {activeTab === 'preferences' && (
//             <div>
//               <h3 style={{ 
//                 margin: '0 0 20px 0', 
//                 fontSize: '18px', 
//                 fontWeight: '600',
//                 color: theme.color
//               }}>My Preferences</h3>
              
//               <div style={{ marginBottom: '20px' }}>
//                 <label style={{ 
//                   display: 'block', 
//                   marginBottom: '8px',
//                   fontWeight: '500',
//                   color: settings.darkMode ? '#bbb' : '#555',
//                   fontSize: '14px'
//                 }}>Preferred Language</label>
//                 <select
//                   name="preferredLanguage"
//                   value={formData.preferredLanguage}
//                   onChange={handleChange}
//                   style={{
//                     width: '100%',
//                     padding: '10px',
//                     border: `1px solid ${theme.borderColor}`,
//                     borderRadius: '4px',
//                     fontSize: '14px',
//                     color: formData.preferredLanguage ? theme.inputColor : '#999',
//                     backgroundColor: theme.inputBackground
//                   }}
//                 >
//                   <option value="">Select Language</option>
//                   <option value="English">English</option>
//                   <option value="Hindi">Hindi</option>
//                   <option value="Telugu">Telugu</option>
//                   <option value="Tamil">Tamil</option>
//                   <option value="Bengali">Bengali</option>
//                 </select>
//               </div>

//               <div style={{ marginBottom: '20px' }}>
//                 <label style={{ 
//                   display: 'block', 
//                   marginBottom: '8px',
//                   fontWeight: '500',
//                   color: settings.darkMode ? '#bbb' : '#555',
//                   fontSize: '14px'
//                 }}>Learning Style</label>
//                 <select
//                   name="learningStyle"
//                   value={formData.learningStyle}
//                   onChange={handleChange}
//                   style={{
//                     width: '100%',
//                     padding: '10px',
//                     border: `1px solid ${theme.borderColor}`,
//                     borderRadius: '4px',
//                     fontSize: '14px',
//                     color: formData.learningStyle ? theme.inputColor : '#999',
//                     backgroundColor: theme.inputBackground
//                   }}
//                 >
//                   <option value="">Select Learning Style</option>
//                   <option value="Visual">Visual</option>
//                   <option value="Auditory">Auditory</option>
//                   <option value="Reading/Writing">Reading/Writing</option>
//                   <option value="Kinesthetic">Kinesthetic</option>
//                 </select>
//               </div>

//               <div style={{ 
//                 display: 'flex', 
//                 justifyContent: 'flex-end',
//                 marginTop: '20px'
//               }}>
//                 <button style={{
//                   padding: '8px 16px',
//                   backgroundColor: theme.buttonSecondary,
//                   border: 'none',
//                   borderRadius: '4px',
//                   marginRight: '10px',
//                   cursor: 'pointer',
//                   fontSize: '14px',
//                   color: theme.color
//                 }}>
//                   Cancel
//                 </button>
//                 <button style={{
//                   padding: '8px 16px',
//                   backgroundColor: theme.buttonPrimary,
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '4px',
//                   cursor: 'pointer',
//                   fontSize: '14px'
//                 }}>
//                   Save Changes
//                 </button>
//               </div>
//             </div>
//           )}

//           {activeTab === 'guardian' && (
//             <div>
//               <h3 style={{ 
//                 margin: '0 0 20px 0', 
//                 fontSize: '18px', 
//                 fontWeight: '600',
//                 color: theme.color
//               }}>Guardian Details</h3>
              
//               <div style={{ marginBottom: '20px' }}>
//                 <label style={{ 
//                   display: 'block', 
//                   marginBottom: '8px',
//                   fontWeight: '500',
//                   color: settings.darkMode ? '#bbb' : '#555',
//                   fontSize: '14px'
//                 }}>Guardian Name *</label>
//                 <input
//                   type="text"
//                   name="guardianName"
//                   value={formData.guardianName}
//                   onChange={handleChange}
//                   style={{
//                     width: '100%',
//                     padding: '10px',
//                     border: `1px solid ${theme.borderColor}`,
//                     borderRadius: '4px',
//                     fontSize: '14px',
//                     backgroundColor: theme.inputBackground,
//                     color: theme.inputColor
//                   }}
//                 />
//               </div>

//               <div style={{ marginBottom: '20px' }}>
//                 <label style={{ 
//                   display: 'block', 
//                   marginBottom: '8px',
//                   fontWeight: '500',
//                   color: settings.darkMode ? '#bbb' : '#555',
//                   fontSize: '14px'
//                 }}>Relation *</label>
//                 <select
//                   name="guardianRelation"
//                   value={formData.guardianRelation}
//                   onChange={handleChange}
//                   style={{
//                     width: '100%',
//                     padding: '10px',
//                     border: `1px solid ${theme.borderColor}`,
//                     borderRadius: '4px',
//                     fontSize: '14px',
//                     color: formData.guardianRelation ? theme.inputColor : '#999',
//                     backgroundColor: theme.inputBackground
//                   }}
//                 >
//                   <option value="">Select Relation</option>
//                   <option value="Father">Father</option>
//                   <option value="Mother">Mother</option>
//                   <option value="Guardian">Guardian</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>

//               <div style={{ marginBottom: '20px' }}>
//                 <label style={{ 
//                   display: 'block', 
//                   marginBottom: '8px',
//                   fontWeight: '500',
//                   color: settings.darkMode ? '#bbb' : '#555',
//                   fontSize: '14px'
//                 }}>Guardian Phone *</label>
//                 <input
//                   type="tel"
//                   name="guardianPhone"
//                   value={formData.guardianPhone}
//                   onChange={handleChange}
//                   style={{
//                     width: '100%',
//                     padding: '10px',
//                     border: `1px solid ${theme.borderColor}`,
//                     borderRadius: '4px',
//                     fontSize: '14px',
//                     backgroundColor: theme.inputBackground,
//                     color: theme.inputColor
//                   }}
//                 />
//               </div>

//               <div style={{ 
//                 display: 'flex', 
//                 justifyContent: 'flex-end',
//                 marginTop: '20px'
//               }}>
//                 <button style={{
//                   padding: '8px 16px',
//                   backgroundColor: theme.buttonSecondary,
//                   border: 'none',
//                   borderRadius: '4px',
//                   marginRight: '10px',
//                   cursor: 'pointer',
//                   fontSize: '14px',
//                   color: theme.color
//                 }}>
//                   Cancel
//                 </button>
//                 <button style={{
//                   padding: '8px 16px',
//                   backgroundColor: theme.buttonPrimary,
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '4px',
//                   cursor: 'pointer',
//                   fontSize: '14px'
//                 }}>
//                   Save Changes
//                 </button>
//               </div>
//             </div>
//           )}

//           {activeTab === 'address' && (
//             <div>
//               <h3 style={{ 
//                 margin: '0 0 20px 0', 
//                 fontSize: '18px', 
//                 fontWeight: '600',
//                 color: theme.color
//               }}>Address Details</h3>
              
//               <div style={{ marginBottom: '20px' }}>
//                 <label style={{ 
//                   display: 'block', 
//                   marginBottom: '8px',
//                   fontWeight: '500',
//                   color: settings.darkMode ? '#bbb' : '#555',
//                   fontSize: '14px'
//                 }}>Full Address *</label>
//                 <textarea
//                   name="address"
//                   value={formData.address}
//                   onChange={handleChange}
//                   style={{
//                     width: '100%',
//                     padding: '10px',
//                     border: `1px solid ${theme.borderColor}`,
//                     borderRadius: '4px',
//                     fontSize: '14px',
//                     minHeight: '80px',
//                     backgroundColor: theme.inputBackground,
//                     color: theme.inputColor
//                   }}
//                 />
//               </div>

//               <div style={{ marginBottom: '20px' }}>
//                 <label style={{ 
//                   display: 'block', 
//                   marginBottom: '8px',
//                   fontWeight: '500',
//                   color: settings.darkMode ? '#bbb' : '#555',
//                   fontSize: '14px'
//                 }}>City *</label>
//                 <input
//                   type="text"
//                   name="city"
//                   value={formData.city}
//                   onChange={handleChange}
//                   style={{
//                     width: '100%',
//                     padding: '10px',
//                     border: `1px solid ${theme.borderColor}`,
//                     borderRadius: '4px',
//                     fontSize: '14px',
//                     backgroundColor: theme.inputBackground,
//                     color: theme.inputColor
//                   }}
//                 />
//               </div>

//               <div style={{ marginBottom: '20px' }}>
//                 <label style={{ 
//                   display: 'block', 
//                   marginBottom: '8px',
//                   fontWeight: '500',
//                   color: settings.darkMode ? '#bbb' : '#555',
//                   fontSize: '14px'
//                 }}>State *</label>
//                 <input
//                   type="text"
//                   name="state"
//                   value={formData.state}
//                   onChange={handleChange}
//                   style={{
//                     width: '100%',
//                     padding: '10px',
//                     border: `1px solid ${theme.borderColor}`,
//                     borderRadius: '4px',
//                     fontSize: '14px',
//                     backgroundColor: theme.inputBackground,
//                     color: theme.inputColor
//                   }}
//                 />
//               </div>

//               <div style={{ marginBottom: '20px' }}>
//                 <label style={{ 
//                   display: 'block', 
//                   marginBottom: '8px',
//                   fontWeight: '500',
//                   color: settings.darkMode ? '#bbb' : '#555',
//                   fontSize: '14px'
//                 }}>Pincode *</label>
//                 <input
//                   type="text"
//                   name="pincode"
//                   value={formData.pincode}
//                   onChange={handleChange}
//                   style={{
//                     width: '100%',
//                     padding: '10px',
//                     border: `1px solid ${theme.borderColor}`,
//                     borderRadius: '4px',
//                     fontSize: '14px',
//                     backgroundColor: theme.inputBackground,
//                     color: theme.inputColor
//                   }}
//                 />
//               </div>

//               <div style={{ 
//                 display: 'flex', 
//                 justifyContent: 'flex-end',
//                 marginTop: '20px'
//               }}>
//                 <button style={{
//                   padding: '8px 16px',
//                   backgroundColor: theme.buttonSecondary,
//                   border: 'none',
//                   borderRadius: '4px',
//                   marginRight: '10px',
//                   cursor: 'pointer',
//                   fontSize: '14px',
//                   color: theme.color
//                 }}>
//                   Cancel
//                 </button>
//                 <button style={{
//                   padding: '8px 16px',
//                   backgroundColor: theme.buttonPrimary,
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '4px',
//                   cursor: 'pointer',
//                   fontSize: '14px'
//                 }}>
//                   Save Changes
//                 </button>
//               </div>
//             </div>
//           )}

//           {activeTab === 'academic' && (
//             <div>
//               <h3 style={{ 
//                 margin: '0 0 20px 0', 
//                 fontSize: '18px', 
//                 fontWeight: '600',
//                 color: theme.color
//               }}>Academic Details</h3>
              
//               <div style={{ marginBottom: '20px' }}>
//                 <label style={{ 
//                   display: 'block', 
//                   marginBottom: '8px',
//                   fontWeight: '500',
//                   color: settings.darkMode ? '#bbb' : '#555',
//                   fontSize: '14px'
//                 }}>Current Class *</label>
//                 <select
//                   name="currentClass"
//                   value={formData.currentClass}
//                   onChange={handleChange}
//                   style={{
//                     width: '100%',
//                     padding: '10px',
//                     border: `1px solid ${theme.borderColor}`,
//                     borderRadius: '4px',
//                     fontSize: '14px',
//                     color: formData.currentClass ? theme.inputColor : '#999',
//                     backgroundColor: theme.inputBackground
//                   }}
//                 >
//                   <option value="">Select Class</option>
//                   {Array.from({ length: 12 }, (_, i) => (
//                     <option key={i+1} value={`Class ${i+1}`}>Class {i+1}</option>
//                   ))}
//                 </select>
//               </div>

//               <div style={{ marginBottom: '20px' }}>
//                 <label style={{ 
//                   display: 'block', 
//                   marginBottom: '8px',
//                   fontWeight: '500',
//                   color: settings.darkMode ? '#bbb' : '#555',
//                   fontSize: '14px'
//                 }}>Board *</label>
//                 <select
//                   name="board"
//                   value={formData.board}
//                   onChange={handleChange}
//                   style={{
//                     width: '100%',
//                     padding: '10px',
//                     border: `1px solid ${theme.borderColor}`,
//                     borderRadius: '4px',
//                     fontSize: '14px',
//                     color: formData.board ? theme.inputColor : '#999',
//                     backgroundColor: theme.inputBackground
//                   }}
//                 >
//                   <option value="">Select Board</option>
//                   <option value="CBSE">CBSE</option>
//                   <option value="ICSE">ICSE</option>
//                   <option value="State Board">State Board</option>
//                   <option value="IB">IB</option>
//                 </select>
//               </div>

//               <div style={{ marginBottom: '20px' }}>
//                 <label style={{ 
//                   display: 'block', 
//                   marginBottom: '8px',
//                   fontWeight: '500',
//                   color: settings.darkMode ? '#bbb' : '#555',
//                   fontSize: '14px'
//                 }}>School Name *</label>
//                 <input
//                   type="text"
//                   name="schoolName"
//                   value={formData.schoolName}
//                   onChange={handleChange}
//                   style={{
//                     width: '100%',
//                     padding: '10px',
//                     border: `1px solid ${theme.borderColor}`,
//                     borderRadius: '4px',
//                     fontSize: '14px',
//                     backgroundColor: theme.inputBackground,
//                     color: theme.inputColor
//                   }}
//                 />
//               </div>

//               <div style={{ 
//                 display: 'flex', 
//                 justifyContent: 'flex-end',
//                 marginTop: '20px'
//               }}>
//                 <button style={{
//                   padding: '8px 16px',
//                   backgroundColor: theme.buttonSecondary,
//                   border: 'none',
//                   borderRadius: '4px',
//                   marginRight: '10px',
//                   cursor: 'pointer',
//                   fontSize: '14px',
//                   color: theme.color
//                 }}>
//                   Cancel
//                 </button>
//                 <button style={{
//                   padding: '8px 16px',
//                   backgroundColor: theme.buttonPrimary,
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '4px',
//                   cursor: 'pointer',
//                   fontSize: '14px'
//                 }}>
//                   Save Changes
//                 </button>
//               </div>
//             </div>
//           )}

//           {activeTab === 'purchases' && (
//             <div>
//               <h3 style={{ 
//                 margin: '0 0 20px 0', 
//                 fontSize: '18px', 
//                 fontWeight: '600',
//                 color: theme.color
//               }}>My Purchases</h3>
//               <div style={{
//                 textAlign: 'center',
//                 padding: '40px 20px',
//                 backgroundColor: settings.darkMode ? '#2d2d2d' : '#f9f9f9',
//                 borderRadius: '8px',
//                 border: `1px solid ${theme.borderColor}`
//               }}>
//                 <p style={{ color: settings.darkMode ? '#bbb' : '#666', fontSize: '16px' }}>No purchases yet</p>
//                 <button style={{
//                   padding: '8px 16px',
//                   backgroundColor: theme.buttonPrimary,
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '4px',
//                   cursor: 'pointer',
//                   fontSize: '14px',
//                   marginTop: '10px'
//                 }}>
//                   Browse Courses
//                 </button>
//               </div>
//             </div>
//           )}

//           {activeTab === 'settings' && (
//             <div>
//               <h3 style={{ 
//                 margin: '0 0 20px 0', 
//                 fontSize: '18px', 
//                 fontWeight: '600',
//                 color: theme.color
//               }}>Settings</h3>
              
//               <div style={{ marginBottom: '30px' }}>
//                 <h4 style={{ 
//                   margin: '0 0 15px 0', 
//                   fontSize: '16px', 
//                   fontWeight: '600',
//                   color: theme.color,
//                   borderBottom: `1px solid ${theme.borderColor}`,
//                   paddingBottom: '8px'
//                 }}>AI Assistant</h4>
                
//                 <div style={{ marginBottom: '20px' }}>
//                   <label style={{ 
//                     display: 'block', 
//                     marginBottom: '8px',
//                     fontWeight: '500',
//                     color: settings.darkMode ? '#bbb' : '#555',
//                     fontSize: '14px'
//                   }}>AI Voice</label>
//                   <select
//                     name="aiVoice"
//                     value={settings.aiVoice}
//                     onChange={handleSettingsChange}
//                     style={{
//                       width: '100%',
//                       padding: '10px',
//                       border: `1px solid ${theme.borderColor}`,
//                       borderRadius: '4px',
//                       fontSize: '14px',
//                       backgroundColor: theme.inputBackground,
//                       color: theme.inputColor
//                     }}
//                   >
//                     {aiVoices.map(voice => (
//                       <option key={voice.id} value={voice.name}>{voice.name}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div style={{ marginBottom: '20px' }}>
//                   <label style={{ 
//                     display: 'block', 
//                     marginBottom: '8px',
//                     fontWeight: '500',
//                     color: settings.darkMode ? '#bbb' : '#555',
//                     fontSize: '14px'
//                   }}>Voice Speed</label>
//                   <input
//                     type="range"
//                     name="voiceSpeed"
//                     min="0.5"
//                     max="2"
//                     step="0.1"
//                     value={settings.voiceSpeed}
//                     onChange={handleSettingsChange}
//                     style={{
//                       width: '100%',
//                       height: '8px',
//                       borderRadius: '4px',
//                       outline: 'none',
//                       backgroundColor: settings.darkMode ? '#444' : '#ddd'
//                     }}
//                   />
//                   <div style={{ 
//                     display: 'flex', 
//                     justifyContent: 'space-between',
//                     marginTop: '5px',
//                     fontSize: '12px',
//                     color: settings.darkMode ? '#bbb' : '#777'
//                   }}>
//                     <span>Slow</span>
//                     <span>Normal</span>
//                     <span>Fast</span>
//                   </div>
//                 </div>

//                 <div style={{ marginBottom: '20px' }}>
//                   <label style={{ 
//                     display: 'block', 
//                     marginBottom: '8px',
//                     fontWeight: '500',
//                     color: settings.darkMode ? '#bbb' : '#555',
//                     fontSize: '14px'
//                   }}>AI Avatar</label>
//                   <div style={{ 
//                     display: 'flex',
//                     gap: '10px',
//                     flexWrap: 'wrap'
//                   }}>
//                     {avatars.map(avatar => (
//                       <div 
//                         key={avatar.id}
//                         style={{
//                           width: '60px',
//                           height: '60px',
//                           borderRadius: '50%',
//                           backgroundColor: settings.selectedAvatar === avatar.name ? '#e6f0ff' : settings.darkMode ? '#444' : '#f5f5f5',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           cursor: 'pointer',
//                           border: settings.selectedAvatar === avatar.name ? '2px solid #4a6bff' : '2px solid transparent',
//                           overflow: 'hidden'
//                         }}
//                         onClick={() => setSettings(prev => ({ ...prev, selectedAvatar: avatar.name }))}
//                       >
//                         <img 
//                           src={avatar.image} 
//                           alt={avatar.name} 
//                           style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div style={{ marginBottom: '30px' }}>
//                 <h4 style={{ 
//                   margin: '0 0 15px 0', 
//                   fontSize: '16px', 
//                   fontWeight: '600',
//                   color: theme.color,
//                   borderBottom: `1px solid ${theme.borderColor}`,
//                   paddingBottom: '8px'
//                 }}>Display Settings</h4>
                
//                 <div style={{ marginBottom: '20px' }}>
//                   <label style={{ 
//                     display: 'block', 
//                     marginBottom: '8px',
//                     fontWeight: '500',
//                     color: settings.darkMode ? '#bbb' : '#555',
//                     fontSize: '14px'
//                   }}>System Font</label>
//                   <select
//                     name="systemFont"
//                     value={settings.systemFont}
//                     onChange={handleSettingsChange}
//                     style={{
//                       width: '100%',
//                       padding: '10px',
//                       border: `1px solid ${theme.borderColor}`,
//                       borderRadius: '4px',
//                       fontSize: '14px',
//                       backgroundColor: theme.inputBackground,
//                       color: theme.inputColor
//                     }}
//                   >
//                     <option value="Arial">Arial</option>
//                     <option value="Helvetica">Helvetica</option>
//                     <option value="Times New Roman">Times New Roman</option>
//                     <option value="Courier New">Courier New</option>
//                     <option value="Georgia">Georgia</option>
//                   </select>
//                 </div>

//                 <div style={{ marginBottom: '20px' }}>
//                   <label style={{ 
//                     display: 'block', 
//                     marginBottom: '8px',
//                     fontWeight: '500',
//                     color: settings.darkMode ? '#bbb' : '#555',
//                     fontSize: '14px'
//                   }}>Color Theme</label>
//                   <select
//                     name="colorTheme"
//                     value={settings.colorTheme}
//                     onChange={handleSettingsChange}
//                     style={{
//                       width: '100%',
//                       padding: '10px',
//                       border: `1px solid ${theme.borderColor}`,
//                       borderRadius: '4px',
//                       fontSize: '14px',
//                       backgroundColor: theme.inputBackground,
//                       color: theme.inputColor
//                     }}
//                   >
//                     <option value="Light">Light</option>
//                     <option value="Dark">Dark</option>
//                     <option value="Blue">Blue</option>
//                     <option value="Green">Green</option>
//                   </select>
//                 </div>

//                 <div style={{ marginBottom: '20px' }}>
//                   <label style={{ 
//                     display: 'block', 
//                     marginBottom: '8px',
//                     fontWeight: '500',
//                     color: settings.darkMode ? '#bbb' : '#555',
//                     fontSize: '14px'
//                   }}>Font Size</label>
//                   <select
//                     name="fontSize"
//                     value={settings.fontSize}
//                     onChange={handleSettingsChange}
//                     style={{
//                       width: '100%',
//                       padding: '10px',
//                       border: `1px solid ${theme.borderColor}`,
//                       borderRadius: '4px',
//                       fontSize: '14px',
//                       backgroundColor: theme.inputBackground,
//                       color: theme.inputColor
//                     }}
//                   >
//                     <option value="Small">Small</option>
//                     <option value="Medium">Medium</option>
//                     <option value="Large">Large</option>
//                     <option value="Extra Large">Extra Large</option>
//                   </select>
//                 </div>

//                 <div style={{ 
//                   display: 'flex', 
//                   alignItems: 'center',
//                   marginBottom: '20px'
//                 }}>
//                   <input
//                     type="checkbox"
//                     name="darkMode"
//                     checked={settings.darkMode}
//                     onChange={toggleDarkMode}
//                     style={{
//                       marginRight: '10px'
//                     }}
//                   />
//                   <label style={{ 
//                     fontWeight: '500',
//                     color: settings.darkMode ? '#bbb' : '#555',
//                     fontSize: '14px'
//                   }}>Dark Mode</label>
//                 </div>
//               </div>

//               <div style={{ marginBottom: '30px' }}>
//                 <h4 style={{ 
//                   margin: '0 0 15px 0', 
//                   fontSize: '16px', 
//                   fontWeight: '600',
//                   color: theme.color,
//                   borderBottom: `1px solid ${theme.borderColor}`,
//                   paddingBottom: '8px'
//                 }}>Sound</h4>
                
//                 <div style={{ marginBottom: '20px' }}>
//                   <label style={{ 
//                     display: 'block', 
//                     marginBottom: '8px',
//                     fontWeight: '500',
//                     color: settings.darkMode ? '#bbb' : '#555',
//                     fontSize: '14px'
//                   }}>Sound Volume</label>
//                   <input
//                     type="range"
//                     name="soundVolume"
//                     min="0"
//                     max="100"
//                     value={settings.soundVolume}
//                     onChange={handleSettingsChange}
//                     style={{
//                       width: '100%',
//                       height: '8px',
//                       borderRadius: '4px',
//                       outline: 'none',
//                       backgroundColor: settings.darkMode ? '#444' : '#ddd'
//                     }}
//                   />
//                   <div style={{ 
//                     display: 'flex', 
//                     justifyContent: 'space-between',
//                     marginTop: '5px',
//                     fontSize: '12px',
//                     color: settings.darkMode ? '#bbb' : '#777'
//                   }}>
//                     <span>Mute</span>
//                     <span>50%</span>
//                     <span>100%</span>
//                   </div>
//                 </div>

//                 <div style={{ 
//                   display: 'flex', 
//                   alignItems: 'center',
//                   marginBottom: '20px'
//                 }}>
//                   <input
//                     type="checkbox"
//                     name="keyboardSound"
//                     checked={settings.keyboardSound}
//                     onChange={handleSettingsChange}
//                     style={{
//                       marginRight: '10px'
//                     }}
//                   />
//                   <label style={{ 
//                     fontWeight: '500',
//                     color: settings.darkMode ? '#bbb' : '#555',
//                     fontSize: '14px'
//                   }}>Keyboard Sound</label>
//                 </div>
//               </div>

//               <div style={{ 
//                 display: 'flex', 
//                 justifyContent: 'flex-end',
//                 marginTop: '20px'
//               }}>
//                 <button 
//                   onClick={resetSettings}
//                   style={{
//                     padding: '8px 16px',
//                     backgroundColor: theme.buttonSecondary,
//                     border: 'none',
//                     borderRadius: '4px',
//                     marginRight: '10px',
//                     cursor: 'pointer',
//                     fontSize: '14px',
//                     color: theme.color
//                   }}
//                 >
//                   Reset Defaults
//                 </button>
//                 <button style={{
//                   padding: '8px 16px',
//                   backgroundColor: theme.buttonPrimary,
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '4px',
//                   cursor: 'pointer',
//                   fontSize: '14px'
//                 }}>
//                   Save Settings
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;

// // import React, { useState, useEffect } from 'react';
// // import { FaChevronRight, FaUser, FaHeart, FaUserShield, FaMapMarkerAlt, FaGraduationCap, FaShoppingCart, FaCog, FaMoon, FaSun, FaSignOutAlt } from 'react-icons/fa';
// // import { useNavigate } from 'react-router-dom';

// // const ProfilePage = ({ onLogout }) => {
// //   const navigate = useNavigate();
// //   const [activeTab, setActiveTab] = useState('personal');
// //   const [formData, setFormData] = useState({
// //     firstName: '',
// //     lastName: '',
// //     phone: '',
// //     gender: '',
// //     dob: '',
// //     category: '',
// //     bloodGroup: '',
// //     preferredLanguage: '',
// //     learningStyle: '',
// //     guardianName: '',
// //     guardianRelation: '',
// //     guardianPhone: '',
// //     address: '',
// //     city: '',
// //     state: '',
// //     pincode: '',
// //     currentClass: '',
// //     board: '',
// //     schoolName: ''
// //   });

// //   const defaultSettings = {
// //     aiVoice: 'Voice 1',
// //     voiceSpeed: 1,
// //     selectedAvatar: 'Avatar 1',
// //     systemFont: 'Arial',
// //     colorTheme: 'Light',
// //     fontSize: 'Medium',
// //     darkMode: false,
// //     soundVolume: 80,
// //     keyboardSound: true
// //   };

// //   const [settings, setSettings] = useState(defaultSettings);

// //   const aiVoices = [
// //     { id: 'voice1', name: 'Emma (Female)' },
// //     { id: 'voice2', name: 'David (Male)' },
// //     { id: 'voice3', name: 'Sophia (Female)' },
// //     { id: 'voice4', name: 'Liam (Male)' },
// //     { id: 'voice5', name: 'Ava (Female)' }
// //   ];

// //   const avatars = [
// //     { id: 'avatar1', name: 'Avatar 1', image: 'https://cdn.dribbble.com/users/2364329/screenshots/6676901/02.png' },
// //     { id: 'avatar2', name: 'Avatar 2', image: 'https://cdn.dribbble.com/users/2364329/screenshots/6676901/04.png' },
// //     { id: 'avatar3', name: 'Avatar 3', image: 'https://cdn.dribbble.com/users/2364329/screenshots/6676901/07.png' },
// //     { id: 'avatar4', name: 'Avatar 4', image: 'https://cdn.dribbble.com/users/2364329/screenshots/6676901/08.png' },
// //     { id: 'avatar5', name: 'Avatar 5', image: 'https://cdn.dribbble.com/users/2364329/screenshots/6676901/10.png' }
// //   ];

// //   useEffect(() => {
// //     if (settings.darkMode) {
// //       document.body.style.backgroundColor = '#121212';
// //       document.body.style.color = '#ffffff';
// //     } else {
// //       document.body.style.backgroundColor = '#f8f9fa';
// //       document.body.style.color = '#000000';
// //     }
// //   }, [settings.darkMode]);

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({ ...prev, [name]: value }));
// //   };

// //   const handleSettingsChange = (e) => {
// //     const { name, value, type, checked } = e.target;
// //     setSettings(prev => ({
// //       ...prev,
// //       [name]: type === 'checkbox' ? checked : value
// //     }));
// //   };

// //   const resetSettings = () => {
// //     setSettings(defaultSettings);
// //   };

// //   const toggleDarkMode = () => {
// //     setSettings(prev => ({
// //       ...prev,
// //       darkMode: !prev.darkMode,
// //       colorTheme: !prev.darkMode ? 'Dark' : 'Light'
// //     }));
// //   };

// //   const handleLogout = () => {
// //     if (onLogout && typeof onLogout === 'function') {
// //       onLogout();
// //     }
// //     navigate('/');
// //   };

// //   const getThemeStyles = () => {
// //     return {
// //       backgroundColor: settings.darkMode ? '#1e1e1e' : '#ffffff',
// //       color: settings.darkMode ? '#ffffff' : '#000000',
// //       borderColor: settings.darkMode ? '#444' : '#ddd',
// //       inputBackground: settings.darkMode ? '#333' : '#ffffff',
// //       inputColor: settings.darkMode ? '#ffffff' : '#000000',
// //       secondaryBackground: settings.darkMode ? '#2d2d2d' : '#f8f9fa',
// //       buttonPrimary: settings.darkMode ? '#5c7cff' : '#4a6bff',
// //       buttonSecondary: settings.darkMode ? '#444' : '#f0f0f0'
// //     };
// //   };

// //   const theme = getThemeStyles();

// //   return (
// //     <div style={{
// //       fontFamily: settings.systemFont + ', sans-serif',
// //       maxWidth: '1000px',
// //       margin: '0 auto',
// //       padding: '20px',
// //       backgroundColor: theme.secondaryBackground,
// //       minHeight: '100vh'
// //     }}>
// //       <div style={{
// //         display: 'flex',
// //         alignItems: 'center',
// //         padding: '15px',
// //         backgroundColor: theme.backgroundColor,
// //         borderRadius: '8px',
// //         marginBottom: '20px',
// //         boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
// //         border: `1px solid ${theme.borderColor}`
// //       }}>
// //         <div style={{
// //           width: '70px',
// //           height: '70px',
// //           borderRadius: '50%',
// //           backgroundColor: '#e0e0e0',
// //           marginRight: '15px',
// //           overflow: 'hidden'
// //         }}>
// //           <img 
// //             src="https://randomuser.me/api/portraits/men/32.jpg" 
// //             alt="Profile" 
// //             style={{ width: '100%', height: '100%', objectFit: 'cover' }}
// //           />
// //         </div>
// //         <div>
// //           <h2 style={{ margin: '0', fontSize: '20px', fontWeight: '600' }}>
// //             {formData.firstName || 'Your Name'}
// //           </h2>
// //           <p style={{ margin: '5px 0 0', color: settings.darkMode ? '#bbb' : '#666', fontSize: '14px' }}>
// //             {formData.phone || 'Phone number'}
// //           </p>
// //         </div>
// //         <button 
// //           onClick={toggleDarkMode}
// //           style={{
// //             marginLeft: 'auto',
// //             background: 'none',
// //             border: 'none',
// //             color: theme.color,
// //             cursor: 'pointer',
// //             fontSize: '20px'
// //           }}
// //         >
// //           {settings.darkMode ? <FaSun /> : <FaMoon />}
// //         </button>
// //       </div>

// //       <div style={{ display: 'flex' }}>
// //         <div style={{
// //           width: '220px',
// //           marginRight: '20px',
// //           backgroundColor: theme.backgroundColor,
// //           borderRadius: '8px',
// //           padding: '15px',
// //           boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
// //           border: `1px solid ${theme.borderColor}`
// //         }}>
// //           <h3 style={{ 
// //             fontSize: '16px',
// //             fontWeight: '600',
// //             color: settings.darkMode ? '#fff' : '#444',
// //             borderBottom: `1px solid ${theme.borderColor}`,
// //             paddingBottom: '10px',
// //             margin: '0 0 15px 0'
// //           }}>Personal Details</h3>
          
// //           <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
// //             {[
// //               { id: 'personal', icon: <FaUser size={14} />, label: 'Personal Details' },
// //               { id: 'preferences', icon: <FaHeart size={14} />, label: 'My Preferences' },
// //               { id: 'guardian', icon: <FaUserShield size={14} />, label: 'Guardian Details' },
// //               { id: 'address', icon: <FaMapMarkerAlt size={14} />, label: 'Address Details' },
// //               { id: 'academic', icon: <FaGraduationCap size={14} />, label: 'Academic Details' },
// //               { id: 'purchases', icon: <FaShoppingCart size={14} />, label: 'My Purchases' },
// //               { id: 'settings', icon: <FaCog size={14} />, label: 'Settings' }
// //             ].map(item => (
// //               <li 
// //                 key={item.id}
// //                 style={{
// //                   padding: '12px 0',
// //                   borderBottom: `1px solid ${theme.borderColor}`,
// //                   display: 'flex',
// //                   alignItems: 'center',
// //                   justifyContent: 'space-between',
// //                   cursor: 'pointer',
// //                   color: activeTab === item.id ? '#4a6bff' : theme.color,
// //                   fontWeight: activeTab === item.id ? '600' : '400',
// //                   fontSize: '14px'
// //                 }}
// //                 onClick={() => setActiveTab(item.id)}
// //               >
// //                 <div style={{ display: 'flex', alignItems: 'center' }}>
// //                   <span style={{ marginRight: '10px' }}>{item.icon}</span>
// //                   {item.label}
// //                 </div>
// //                 <FaChevronRight size={12} />
// //               </li>
// //             ))}
// //           </ul>
// //         </div>

// //         <div style={{
// //           flex: '1',
// //           backgroundColor: theme.backgroundColor,
// //           borderRadius: '8px',
// //           padding: '20px',
// //           boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
// //           border: `1px solid ${theme.borderColor}`
// //         }}>
// //           {activeTab === 'personal' && (
// //             <div>
// //               <h3 style={{ 
// //                 margin: '0 0 20px 0', 
// //                 fontSize: '18px', 
// //                 fontWeight: '600',
// //                 color: theme.color
// //               }}>Personal Details</h3>
              
// //               <div style={{ marginBottom: '20px' }}>
// //                 <label style={{ 
// //                   display: 'block', 
// //                   marginBottom: '8px',
// //                   fontWeight: '500',
// //                   color: settings.darkMode ? '#bbb' : '#555',
// //                   fontSize: '14px'
// //                 }}>First Name *</label>
// //                 <input
// //                   type="text"
// //                   name="firstName"
// //                   value={formData.firstName}
// //                   onChange={handleChange}
// //                   style={{
// //                     width: '100%',
// //                     padding: '10px',
// //                     border: `1px solid ${theme.borderColor}`,
// //                     borderRadius: '4px',
// //                     fontSize: '14px',
// //                     backgroundColor: theme.inputBackground,
// //                     color: theme.inputColor
// //                   }}
// //                 />
// //               </div>

// //               <div style={{ marginBottom: '20px' }}>
// //                 <label style={{ 
// //                   display: 'block', 
// //                   marginBottom: '8px',
// //                   fontWeight: '500',
// //                   color: settings.darkMode ? '#bbb' : '#555',
// //                   fontSize: '14px'
// //                 }}>Last Name</label>
// //                 <input
// //                   type="text"
// //                   name="lastName"
// //                   value={formData.lastName}
// //                   onChange={handleChange}
// //                   style={{
// //                     width: '100%',
// //                     padding: '10px',
// //                     border: `1px solid ${theme.borderColor}`,
// //                     borderRadius: '4px',
// //                     fontSize: '14px',
// //                     backgroundColor: theme.inputBackground,
// //                     color: theme.inputColor
// //                   }}
// //                 />
// //               </div>

// //               <div style={{ marginBottom: '20px' }}>
// //                 <label style={{ 
// //                   display: 'block', 
// //                   marginBottom: '8px',
// //                   fontWeight: '500',
// //                   color: settings.darkMode ? '#bbb' : '#555',
// //                   fontSize: '14px'
// //                 }}>Phone Number *</label>
// //                 <input
// //                   type="tel"
// //                   name="phone"
// //                   value={formData.phone}
// //                   onChange={handleChange}
// //                   style={{
// //                     width: '100%',
// //                     padding: '10px',
// //                     border: `1px solid ${theme.borderColor}`,
// //                     borderRadius: '4px',
// //                     fontSize: '14px',
// //                     backgroundColor: theme.inputBackground,
// //                     color: theme.inputColor
// //                   }}
// //                 />
// //               </div>

// //               <div style={{ marginBottom: '20px' }}>
// //                 <label style={{ 
// //                   display: 'block', 
// //                   marginBottom: '8px',
// //                   fontWeight: '500',
// //                   color: settings.darkMode ? '#bbb' : '#555',
// //                   fontSize: '14px'
// //                 }}>Gender *</label>
// //                 <select
// //                   name="gender"
// //                   value={formData.gender}
// //                   onChange={handleChange}
// //                   style={{
// //                     width: '100%',
// //                     padding: '10px',
// //                     border: `1px solid ${theme.borderColor}`,
// //                     borderRadius: '4px',
// //                     fontSize: '14px',
// //                     color: formData.gender ? theme.inputColor : '#999',
// //                     backgroundColor: theme.inputBackground
// //                   }}
// //                 >
// //                   <option value="">Select Gender</option>
// //                   <option value="Male">Male</option>
// //                   <option value="Female">Female</option>
// //                   <option value="Other">Other</option>
// //                 </select>
// //               </div>

// //               <div style={{ marginBottom: '20px' }}>
// //                 <label style={{ 
// //                   display: 'block', 
// //                   marginBottom: '8px',
// //                   fontWeight: '500',
// //                   color: settings.darkMode ? '#bbb' : '#555',
// //                   fontSize: '14px'
// //                 }}>Date of Birth *</label>
// //                 <input
// //                   type="date"
// //                   name="dob"
// //                   value={formData.dob}
// //                   onChange={handleChange}
// //                   style={{
// //                     width: '100%',
// //                     padding: '10px',
// //                     border: `1px solid ${theme.borderColor}`,
// //                     borderRadius: '4px',
// //                     fontSize: '14px',
// //                     color: formData.dob ? theme.inputColor : '#999',
// //                     backgroundColor: theme.inputBackground
// //                   }}
// //                 />
// //               </div>

// //               <div style={{ marginBottom: '20px' }}>
// //                 <label style={{ 
// //                   display: 'block', 
// //                   marginBottom: '8px',
// //                   fontWeight: '500',
// //                   color: settings.darkMode ? '#bbb' : '#555',
// //                   fontSize: '14px'
// //                 }}>Category *</label>
// //                 <select
// //                   name="category"
// //                   value={formData.category}
// //                   onChange={handleChange}
// //                   style={{
// //                     width: '100%',
// //                     padding: '10px',
// //                     border: `1px solid ${theme.borderColor}`,
// //                     borderRadius: '4px',
// //                     fontSize: '14px',
// //                     color: formData.category ? theme.inputColor : '#999',
// //                     backgroundColor: theme.inputBackground
// //                   }}
// //                 >
// //                   <option value="">Select Category</option>
// //                   <option value="General">General</option>
// //                   <option value="OBC">OBC</option>
// //                   <option value="SC">SC</option>
// //                   <option value="ST">ST</option>
// //                 </select>
// //               </div>

// //               <div style={{ marginBottom: '20px' }}>
// //                 <label style={{ 
// //                   display: 'block', 
// //                   marginBottom: '8px',
// //                   fontWeight: '500',
// //                   color: settings.darkMode ? '#bbb' : '#555',
// //                   fontSize: '14px'
// //                 }}>Blood Group</label>
// //                 <select
// //                   name="bloodGroup"
// //                   value={formData.bloodGroup}
// //                   onChange={handleChange}
// //                   style={{
// //                     width: '100%',
// //                     padding: '10px',
// //                     border: `1px solid ${theme.borderColor}`,
// //                     borderRadius: '4px',
// //                     fontSize: '14px',
// //                     color: formData.bloodGroup ? theme.inputColor : '#999',
// //                     backgroundColor: theme.inputBackground
// //                   }}
// //                 >
// //                   <option value="">Select Blood Group</option>
// //                   <option value="A+">A+</option>
// //                   <option value="B+">B+</option>
// //                   <option value="O+">O+</option>
// //                   <option value="AB+">AB+</option>
// //                 </select>
// //               </div>

// //               <div style={{ 
// //                 display: 'flex', 
// //                 justifyContent: 'flex-end',
// //                 marginTop: '20px'
// //               }}>
// //                 <button style={{
// //                   padding: '8px 16px',
// //                   backgroundColor: theme.buttonSecondary,
// //                   border: 'none',
// //                   borderRadius: '4px',
// //                   marginRight: '10px',
// //                   cursor: 'pointer',
// //                   fontSize: '14px',
// //                   color: theme.color
// //                 }}>
// //                   Cancel
// //                 </button>
// //                 <button style={{
// //                   padding: '8px 16px',
// //                   backgroundColor: theme.buttonPrimary,
// //                   color: 'white',
// //                   border: 'none',
// //                   borderRadius: '4px',
// //                   cursor: 'pointer',
// //                   fontSize: '14px'
// //                 }}>
// //                   Save Changes
// //                 </button>
// //               </div>
// //             </div>
// //           )}

// //           {activeTab === 'preferences' && (
// //             <div>
// //               <h3 style={{ 
// //                 margin: '0 0 20px 0', 
// //                 fontSize: '18px', 
// //                 fontWeight: '600',
// //                 color: theme.color
// //               }}>My Preferences</h3>
              
// //               <div style={{ marginBottom: '20px' }}>
// //                 <label style={{ 
// //                   display: 'block', 
// //                   marginBottom: '8px',
// //                   fontWeight: '500',
// //                   color: settings.darkMode ? '#bbb' : '#555',
// //                   fontSize: '14px'
// //                 }}>Preferred Language</label>
// //                 <select
// //                   name="preferredLanguage"
// //                   value={formData.preferredLanguage}
// //                   onChange={handleChange}
// //                   style={{
// //                     width: '100%',
// //                     padding: '10px',
// //                     border: `1px solid ${theme.borderColor}`,
// //                     borderRadius: '4px',
// //                     fontSize: '14px',
// //                     color: formData.preferredLanguage ? theme.inputColor : '#999',
// //                     backgroundColor: theme.inputBackground
// //                   }}
// //                 >
// //                   <option value="">Select Language</option>
// //                   <option value="English">English</option>
// //                   <option value="Hindi">Hindi</option>
// //                   <option value="Telugu">Telugu</option>
// //                   <option value="Tamil">Tamil</option>
// //                   <option value="Bengali">Bengali</option>
// //                 </select>
// //               </div>

// //               <div style={{ marginBottom: '20px' }}>
// //                 <label style={{ 
// //                   display: 'block', 
// //                   marginBottom: '8px',
// //                   fontWeight: '500',
// //                   color: settings.darkMode ? '#bbb' : '#555',
// //                   fontSize: '14px'
// //                 }}>Learning Style</label>
// //                 <select
// //                   name="learningStyle"
// //                   value={formData.learningStyle}
// //                   onChange={handleChange}
// //                   style={{
// //                     width: '100%',
// //                     padding: '10px',
// //                     border: `1px solid ${theme.borderColor}`,
// //                     borderRadius: '4px',
// //                     fontSize: '14px',
// //                     color: formData.learningStyle ? theme.inputColor : '#999',
// //                     backgroundColor: theme.inputBackground
// //                   }}
// //                 >
// //                   <option value="">Select Learning Style</option>
// //                   <option value="Visual">Visual</option>
// //                   <option value="Auditory">Auditory</option>
// //                   <option value="Reading/Writing">Reading/Writing</option>
// //                   <option value="Kinesthetic">Kinesthetic</option>
// //                 </select>
// //               </div>

// //               <div style={{ 
// //                 display: 'flex', 
// //                 justifyContent: 'flex-end',
// //                 marginTop: '20px'
// //               }}>
// //                 <button style={{
// //                   padding: '8px 16px',
// //                   backgroundColor: theme.buttonSecondary,
// //                   border: 'none',
// //                   borderRadius: '4px',
// //                   marginRight: '10px',
// //                   cursor: 'pointer',
// //                   fontSize: '14px',
// //                   color: theme.color
// //                 }}>
// //                   Cancel
// //                 </button>
// //                 <button style={{
// //                   padding: '8px 16px',
// //                   backgroundColor: theme.buttonPrimary,
// //                   color: 'white',
// //                   border: 'none',
// //                   borderRadius: '4px',
// //                   cursor: 'pointer',
// //                   fontSize: '14px'
// //                 }}>
// //                   Save Changes
// //                 </button>
// //               </div>
// //             </div>
// //           )}

// //           {activeTab === 'guardian' && (
// //             <div>
// //               <h3 style={{ 
// //                 margin: '0 0 20px 0', 
// //                 fontSize: '18px', 
// //                 fontWeight: '600',
// //                 color: theme.color
// //               }}>Guardian Details</h3>
              
// //               <div style={{ marginBottom: '20px' }}>
// //                 <label style={{ 
// //                   display: 'block', 
// //                   marginBottom: '8px',
// //                   fontWeight: '500',
// //                   color: settings.darkMode ? '#bbb' : '#555',
// //                   fontSize: '14px'
// //                 }}>Guardian Name *</label>
// //                 <input
// //                   type="text"
// //                   name="guardianName"
// //                   value={formData.guardianName}
// //                   onChange={handleChange}
// //                   style={{
// //                     width: '100%',
// //                     padding: '10px',
// //                     border: `1px solid ${theme.borderColor}`,
// //                     borderRadius: '4px',
// //                     fontSize: '14px',
// //                     backgroundColor: theme.inputBackground,
// //                     color: theme.inputColor
// //                   }}
// //                 />
// //               </div>

// //               <div style={{ marginBottom: '20px' }}>
// //                 <label style={{ 
// //                   display: 'block', 
// //                   marginBottom: '8px',
// //                   fontWeight: '500',
// //                   color: settings.darkMode ? '#bbb' : '#555',
// //                   fontSize: '14px'
// //                 }}>Relation *</label>
// //                 <select
// //                   name="guardianRelation"
// //                   value={formData.guardianRelation}
// //                   onChange={handleChange}
// //                   style={{
// //                     width: '100%',
// //                     padding: '10px',
// //                     border: `1px solid ${theme.borderColor}`,
// //                     borderRadius: '4px',
// //                     fontSize: '14px',
// //                     color: formData.guardianRelation ? theme.inputColor : '#999',
// //                     backgroundColor: theme.inputBackground
// //                   }}
// //                 >
// //                   <option value="">Select Relation</option>
// //                   <option value="Father">Father</option>
// //                   <option value="Mother">Mother</option>
// //                   <option value="Guardian">Guardian</option>
// //                   <option value="Other">Other</option>
// //                 </select>
// //               </div>

// //               <div style={{ marginBottom: '20px' }}>
// //                 <label style={{ 
// //                   display: 'block', 
// //                   marginBottom: '8px',
// //                   fontWeight: '500',
// //                   color: settings.darkMode ? '#bbb' : '#555',
// //                   fontSize: '14px'
// //                 }}>Guardian Phone *</label>
// //                 <input
// //                   type="tel"
// //                   name="guardianPhone"
// //                   value={formData.guardianPhone}
// //                   onChange={handleChange}
// //                   style={{
// //                     width: '100%',
// //                     padding: '10px',
// //                     border: `1px solid ${theme.borderColor}`,
// //                     borderRadius: '4px',
// //                     fontSize: '14px',
// //                     backgroundColor: theme.inputBackground,
// //                     color: theme.inputColor
// //                   }}
// //                 />
// //               </div>

// //               <div style={{ 
// //                 display: 'flex', 
// //                 justifyContent: 'flex-end',
// //                 marginTop: '20px'
// //               }}>
// //                 <button style={{
// //                   padding: '8px 16px',
// //                   backgroundColor: theme.buttonSecondary,
// //                   border: 'none',
// //                   borderRadius: '4px',
// //                   marginRight: '10px',
// //                   cursor: 'pointer',
// //                   fontSize: '14px',
// //                   color: theme.color
// //                 }}>
// //                   Cancel
// //                 </button>
// //                 <button style={{
// //                   padding: '8px 16px',
// //                   backgroundColor: theme.buttonPrimary,
// //                   color: 'white',
// //                   border: 'none',
// //                   borderRadius: '4px',
// //                   cursor: 'pointer',
// //                   fontSize: '14px'
// //                 }}>
// //                   Save Changes
// //                 </button>
// //               </div>
// //             </div>
// //           )}

// //           {activeTab === 'address' && (
// //             <div>
// //               <h3 style={{ 
// //                 margin: '0 0 20px 0', 
// //                 fontSize: '18px', 
// //                 fontWeight: '600',
// //                 color: theme.color
// //               }}>Address Details</h3>
              
// //               <div style={{ marginBottom: '20px' }}>
// //                 <label style={{ 
// //                   display: 'block', 
// //                   marginBottom: '8px',
// //                   fontWeight: '500',
// //                   color: settings.darkMode ? '#bbb' : '#555',
// //                   fontSize: '14px'
// //                 }}>Full Address *</label>
// //                 <textarea
// //                   name="address"
// //                   value={formData.address}
// //                   onChange={handleChange}
// //                   style={{
// //                     width: '100%',
// //                     padding: '10px',
// //                     border: `1px solid ${theme.borderColor}`,
// //                     borderRadius: '4px',
// //                     fontSize: '14px',
// //                     minHeight: '80px',
// //                     backgroundColor: theme.inputBackground,
// //                     color: theme.inputColor
// //                   }}
// //                 />
// //               </div>

// //               <div style={{ marginBottom: '20px' }}>
// //                 <label style={{ 
// //                   display: 'block', 
// //                   marginBottom: '8px',
// //                   fontWeight: '500',
// //                   color: settings.darkMode ? '#bbb' : '#555',
// //                   fontSize: '14px'
// //                 }}>City *</label>
// //                 <input
// //                   type="text"
// //                   name="city"
// //                   value={formData.city}
// //                   onChange={handleChange}
// //                   style={{
// //                     width: '100%',
// //                     padding: '10px',
// //                     border: `1px solid ${theme.borderColor}`,
// //                     borderRadius: '4px',
// //                     fontSize: '14px',
// //                     backgroundColor: theme.inputBackground,
// //                     color: theme.inputColor
// //                   }}
// //                 />
// //               </div>

// //               <div style={{ marginBottom: '20px' }}>
// //                 <label style={{ 
// //                   display: 'block', 
// //                   marginBottom: '8px',
// //                   fontWeight: '500',
// //                   color: settings.darkMode ? '#bbb' : '#555',
// //                   fontSize: '14px'
// //                 }}>State *</label>
// //                 <input
// //                   type="text"
// //                   name="state"
// //                   value={formData.state}
// //                   onChange={handleChange}
// //                   style={{
// //                     width: '100%',
// //                     padding: '10px',
// //                     border: `1px solid ${theme.borderColor}`,
// //                     borderRadius: '4px',
// //                     fontSize: '14px',
// //                     backgroundColor: theme.inputBackground,
// //                     color: theme.inputColor
// //                   }}
// //                 />
// //               </div>

// //               <div style={{ marginBottom: '20px' }}>
// //                 <label style={{ 
// //                   display: 'block', 
// //                   marginBottom: '8px',
// //                   fontWeight: '500',
// //                   color: settings.darkMode ? '#bbb' : '#555',
// //                   fontSize: '14px'
// //                 }}>Pincode *</label>
// //                 <input
// //                   type="text"
// //                   name="pincode"
// //                   value={formData.pincode}
// //                   onChange={handleChange}
// //                   style={{
// //                     width: '100%',
// //                     padding: '10px',
// //                     border: `1px solid ${theme.borderColor}`,
// //                     borderRadius: '4px',
// //                     fontSize: '14px',
// //                     backgroundColor: theme.inputBackground,
// //                     color: theme.inputColor
// //                   }}
// //                 />
// //               </div>

// //               <div style={{ 
// //                 display: 'flex', 
// //                 justifyContent: 'flex-end',
// //                 marginTop: '20px'
// //               }}>
// //                 <button style={{
// //                   padding: '8px 16px',
// //                   backgroundColor: theme.buttonSecondary,
// //                   border: 'none',
// //                   borderRadius: '4px',
// //                   marginRight: '10px',
// //                   cursor: 'pointer',
// //                   fontSize: '14px',
// //                   color: theme.color
// //                 }}>
// //                   Cancel
// //                 </button>
// //                 <button style={{
// //                   padding: '8px 16px',
// //                   backgroundColor: theme.buttonPrimary,
// //                   color: 'white',
// //                   border: 'none',
// //                   borderRadius: '4px',
// //                   cursor: 'pointer',
// //                   fontSize: '14px'
// //                 }}>
// //                   Save Changes
// //                 </button>
// //               </div>
// //             </div>
// //           )}

// //           {activeTab === 'academic' && (
// //             <div>
// //               <h3 style={{ 
// //                 margin: '0 0 20px 0', 
// //                 fontSize: '18px', 
// //                 fontWeight: '600',
// //                 color: theme.color
// //               }}>Academic Details</h3>
              
// //               <div style={{ marginBottom: '20px' }}>
// //                 <label style={{ 
// //                   display: 'block', 
// //                   marginBottom: '8px',
// //                   fontWeight: '500',
// //                   color: settings.darkMode ? '#bbb' : '#555',
// //                   fontSize: '14px'
// //                 }}>Current Class *</label>
// //                 <select
// //                   name="currentClass"
// //                   value={formData.currentClass}
// //                   onChange={handleChange}
// //                   style={{
// //                     width: '100%',
// //                     padding: '10px',
// //                     border: `1px solid ${theme.borderColor}`,
// //                     borderRadius: '4px',
// //                     fontSize: '14px',
// //                     color: formData.currentClass ? theme.inputColor : '#999',
// //                     backgroundColor: theme.inputBackground
// //                   }}
// //                 >
// //                   <option value="">Select Class</option>
// //                   {Array.from({ length: 12 }, (_, i) => (
// //                     <option key={i+1} value={`Class ${i+1}`}>Class {i+1}</option>
// //                   ))}
// //                 </select>
// //               </div>

// //               <div style={{ marginBottom: '20px' }}>
// //                 <label style={{ 
// //                   display: 'block', 
// //                   marginBottom: '8px',
// //                   fontWeight: '500',
// //                   color: settings.darkMode ? '#bbb' : '#555',
// //                   fontSize: '14px'
// //                 }}>Board *</label>
// //                 <select
// //                   name="board"
// //                   value={formData.board}
// //                   onChange={handleChange}
// //                   style={{
// //                     width: '100%',
// //                     padding: '10px',
// //                     border: `1px solid ${theme.borderColor}`,
// //                     borderRadius: '4px',
// //                     fontSize: '14px',
// //                     color: formData.board ? theme.inputColor : '#999',
// //                     backgroundColor: theme.inputBackground
// //                   }}
// //                 >
// //                   <option value="">Select Board</option>
// //                   <option value="CBSE">CBSE</option>
// //                   <option value="ICSE">ICSE</option>
// //                   <option value="State Board">State Board</option>
// //                   <option value="IB">IB</option>
// //                 </select>
// //               </div>

// //               <div style={{ marginBottom: '20px' }}>
// //                 <label style={{ 
// //                   display: 'block', 
// //                   marginBottom: '8px',
// //                   fontWeight: '500',
// //                   color: settings.darkMode ? '#bbb' : '#555',
// //                   fontSize: '14px'
// //                 }}>School Name *</label>
// //                 <input
// //                   type="text"
// //                   name="schoolName"
// //                   value={formData.schoolName}
// //                   onChange={handleChange}
// //                   style={{
// //                     width: '100%',
// //                     padding: '10px',
// //                     border: `1px solid ${theme.borderColor}`,
// //                     borderRadius: '4px',
// //                     fontSize: '14px',
// //                     backgroundColor: theme.inputBackground,
// //                     color: theme.inputColor
// //                   }}
// //                 />
// //               </div>

// //               <div style={{ 
// //                 display: 'flex', 
// //                 justifyContent: 'flex-end',
// //                 marginTop: '20px'
// //               }}>
// //                 <button style={{
// //                   padding: '8px 16px',
// //                   backgroundColor: theme.buttonSecondary,
// //                   border: 'none',
// //                   borderRadius: '4px',
// //                   marginRight: '10px',
// //                   cursor: 'pointer',
// //                   fontSize: '14px',
// //                   color: theme.color
// //                 }}>
// //                   Cancel
// //                 </button>
// //                 <button style={{
// //                   padding: '8px 16px',
// //                   backgroundColor: theme.buttonPrimary,
// //                   color: 'white',
// //                   border: 'none',
// //                   borderRadius: '4px',
// //                   cursor: 'pointer',
// //                   fontSize: '14px'
// //                 }}>
// //                   Save Changes
// //                 </button>
// //               </div>
// //             </div>
// //           )}

// //           {activeTab === 'purchases' && (
// //             <div>
// //               <h3 style={{ 
// //                 margin: '0 0 20px 0', 
// //                 fontSize: '18px', 
// //                 fontWeight: '600',
// //                 color: theme.color
// //               }}>My Purchases</h3>
// //               <div style={{
// //                 textAlign: 'center',
// //                 padding: '40px 20px',
// //                 backgroundColor: settings.darkMode ? '#2d2d2d' : '#f9f9f9',
// //                 borderRadius: '8px',
// //                 border: `1px solid ${theme.borderColor}`
// //               }}>
// //                 <p style={{ color: settings.darkMode ? '#bbb' : '#666', fontSize: '16px' }}>No purchases yet</p>
// //                 <button style={{
// //                   padding: '8px 16px',
// //                   backgroundColor: theme.buttonPrimary,
// //                   color: 'white',
// //                   border: 'none',
// //                   borderRadius: '4px',
// //                   cursor: 'pointer',
// //                   fontSize: '14px',
// //                   marginTop: '10px'
// //                 }}>
// //                   Browse Courses
// //                 </button>
// //               </div>
// //             </div>
// //           )}

// //           {activeTab === 'settings' && (
// //             <div>
// //               <h3 style={{ 
// //                 margin: '0 0 20px 0', 
// //                 fontSize: '18px', 
// //                 fontWeight: '600',
// //                 color: theme.color
// //               }}>Settings</h3>
              
// //               <div style={{ marginBottom: '30px' }}>
// //                 <h4 style={{ 
// //                   margin: '0 0 15px 0', 
// //                   fontSize: '16px', 
// //                   fontWeight: '600',
// //                   color: theme.color,
// //                   borderBottom: `1px solid ${theme.borderColor}`,
// //                   paddingBottom: '8px'
// //                 }}>AI Assistant</h4>
                
// //                 <div style={{ marginBottom: '20px' }}>
// //                   <label style={{ 
// //                     display: 'block', 
// //                     marginBottom: '8px',
// //                     fontWeight: '500',
// //                     color: settings.darkMode ? '#bbb' : '#555',
// //                     fontSize: '14px'
// //                   }}>AI Voice</label>
// //                   <select
// //                     name="aiVoice"
// //                     value={settings.aiVoice}
// //                     onChange={handleSettingsChange}
// //                     style={{
// //                       width: '100%',
// //                       padding: '10px',
// //                       border: `1px solid ${theme.borderColor}`,
// //                       borderRadius: '4px',
// //                       fontSize: '14px',
// //                       backgroundColor: theme.inputBackground,
// //                       color: theme.inputColor
// //                     }}
// //                   >
// //                     {aiVoices.map(voice => (
// //                       <option key={voice.id} value={voice.name}>{voice.name}</option>
// //                     ))}
// //                   </select>
// //                 </div>

// //                 <div style={{ marginBottom: '20px' }}>
// //                   <label style={{ 
// //                     display: 'block', 
// //                     marginBottom: '8px',
// //                     fontWeight: '500',
// //                     color: settings.darkMode ? '#bbb' : '#555',
// //                     fontSize: '14px'
// //                   }}>Voice Speed</label>
// //                   <input
// //                     type="range"
// //                     name="voiceSpeed"
// //                     min="0.5"
// //                     max="2"
// //                     step="0.1"
// //                     value={settings.voiceSpeed}
// //                     onChange={handleSettingsChange}
// //                     style={{
// //                       width: '100%',
// //                       height: '8px',
// //                       borderRadius: '4px',
// //                       outline: 'none',
// //                       backgroundColor: settings.darkMode ? '#444' : '#ddd'
// //                     }}
// //                   />
// //                   <div style={{ 
// //                     display: 'flex', 
// //                     justifyContent: 'space-between',
// //                     marginTop: '5px',
// //                     fontSize: '12px',
// //                     color: settings.darkMode ? '#bbb' : '#777'
// //                   }}>
// //                     <span>Slow</span>
// //                     <span>Normal</span>
// //                     <span>Fast</span>
// //                   </div>
// //                 </div>

// //                 <div style={{ marginBottom: '20px' }}>
// //                   <label style={{ 
// //                     display: 'block', 
// //                     marginBottom: '8px',
// //                     fontWeight: '500',
// //                     color: settings.darkMode ? '#bbb' : '#555',
// //                     fontSize: '14px'
// //                   }}>AI Avatar</label>
// //                   <div style={{ 
// //                     display: 'flex',
// //                     gap: '10px',
// //                     flexWrap: 'wrap'
// //                   }}>
// //                     {avatars.map(avatar => (
// //                       <div 
// //                         key={avatar.id}
// //                         style={{
// //                           width: '60px',
// //                           height: '60px',
// //                           borderRadius: '50%',
// //                           backgroundColor: settings.selectedAvatar === avatar.name ? '#e6f0ff' : settings.darkMode ? '#444' : '#f5f5f5',
// //                           display: 'flex',
// //                           alignItems: 'center',
// //                           justifyContent: 'center',
// //                           cursor: 'pointer',
// //                           border: settings.selectedAvatar === avatar.name ? '2px solid #4a6bff' : '2px solid transparent',
// //                           overflow: 'hidden'
// //                         }}
// //                         onClick={() => setSettings(prev => ({ ...prev, selectedAvatar: avatar.name }))}
// //                       >
// //                         <img 
// //                           src={avatar.image} 
// //                           alt={avatar.name} 
// //                           style={{ width: '100%', height: '100%', objectFit: 'cover' }}
// //                         />
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>
// //               </div>

// //               <div style={{ marginBottom: '30px' }}>
// //                 <h4 style={{ 
// //                   margin: '0 0 15px 0', 
// //                   fontSize: '16px', 
// //                   fontWeight: '600',
// //                   color: theme.color,
// //                   borderBottom: `1px solid ${theme.borderColor}`,
// //                   paddingBottom: '8px'
// //                 }}>Display Settings</h4>
                
// //                 <div style={{ marginBottom: '20px' }}>
// //                   <label style={{ 
// //                     display: 'block', 
// //                     marginBottom: '8px',
// //                     fontWeight: '500',
// //                     color: settings.darkMode ? '#bbb' : '#555',
// //                     fontSize: '14px'
// //                   }}>System Font</label>
// //                   <select
// //                     name="systemFont"
// //                     value={settings.systemFont}
// //                     onChange={handleSettingsChange}
// //                     style={{
// //                       width: '100%',
// //                       padding: '10px',
// //                       border: `1px solid ${theme.borderColor}`,
// //                       borderRadius: '4px',
// //                       fontSize: '14px',
// //                       backgroundColor: theme.inputBackground,
// //                       color: theme.inputColor
// //                     }}
// //                   >
// //                     <option value="Arial">Arial</option>
// //                     <option value="Helvetica">Helvetica</option>
// //                     <option value="Times New Roman">Times New Roman</option>
// //                     <option value="Courier New">Courier New</option>
// //                     <option value="Georgia">Georgia</option>
// //                   </select>
// //                 </div>

// //                 <div style={{ marginBottom: '20px' }}>
// //                   <label style={{ 
// //                     display: 'block', 
// //                     marginBottom: '8px',
// //                     fontWeight: '500',
// //                     color: settings.darkMode ? '#bbb' : '#555',
// //                     fontSize: '14px'
// //                   }}>Color Theme</label>
// //                   <select
// //                     name="colorTheme"
// //                     value={settings.colorTheme}
// //                     onChange={handleSettingsChange}
// //                     style={{
// //                       width: '100%',
// //                       padding: '10px',
// //                       border: `1px solid ${theme.borderColor}`,
// //                       borderRadius: '4px',
// //                       fontSize: '14px',
// //                       backgroundColor: theme.inputBackground,
// //                       color: theme.inputColor
// //                     }}
// //                   >
// //                     <option value="Light">Light</option>
// //                     <option value="Dark">Dark</option>
// //                     <option value="Blue">Blue</option>
// //                     <option value="Green">Green</option>
// //                   </select>
// //                 </div>

// //                 <div style={{ marginBottom: '20px' }}>
// //                   <label style={{ 
// //                     display: 'block', 
// //                     marginBottom: '8px',
// //                     fontWeight: '500',
// //                     color: settings.darkMode ? '#bbb' : '#555',
// //                     fontSize: '14px'
// //                   }}>Font Size</label>
// //                   <select
// //                     name="fontSize"
// //                     value={settings.fontSize}
// //                     onChange={handleSettingsChange}
// //                     style={{
// //                       width: '100%',
// //                       padding: '10px',
// //                       border: `1px solid ${theme.borderColor}`,
// //                       borderRadius: '4px',
// //                       fontSize: '14px',
// //                       backgroundColor: theme.inputBackground,
// //                       color: theme.inputColor
// //                     }}
// //                   >
// //                     <option value="Small">Small</option>
// //                     <option value="Medium">Medium</option>
// //                     <option value="Large">Large</option>
// //                     <option value="Extra Large">Extra Large</option>
// //                   </select>
// //                 </div>

// //                 <div style={{ 
// //                   display: 'flex', 
// //                   alignItems: 'center',
// //                   marginBottom: '20px'
// //                 }}>
// //                   <input
// //                     type="checkbox"
// //                     name="darkMode"
// //                     checked={settings.darkMode}
// //                     onChange={toggleDarkMode}
// //                     style={{
// //                       marginRight: '10px'
// //                     }}
// //                   />
// //                   <label style={{ 
// //                     fontWeight: '500',
// //                     color: settings.darkMode ? '#bbb' : '#555',
// //                     fontSize: '14px'
// //                   }}>Dark Mode</label>
// //                 </div>
// //               </div>

// //               <div style={{ marginBottom: '30px' }}>
// //                 <h4 style={{ 
// //                   margin: '0 0 15px 0', 
// //                   fontSize: '16px', 
// //                   fontWeight: '600',
// //                   color: theme.color,
// //                   borderBottom: `1px solid ${theme.borderColor}`,
// //                   paddingBottom: '8px'
// //                 }}>Sound</h4>
                
// //                 <div style={{ marginBottom: '20px' }}>
// //                   <label style={{ 
// //                     display: 'block', 
// //                     marginBottom: '8px',
// //                     fontWeight: '500',
// //                     color: settings.darkMode ? '#bbb' : '#555',
// //                     fontSize: '14px'
// //                   }}>Sound Volume</label>
// //                   <input
// //                     type="range"
// //                     name="soundVolume"
// //                     min="0"
// //                     max="100"
// //                     value={settings.soundVolume}
// //                     onChange={handleSettingsChange}
// //                     style={{
// //                       width: '100%',
// //                       height: '8px',
// //                       borderRadius: '4px',
// //                       outline: 'none',
// //                       backgroundColor: settings.darkMode ? '#444' : '#ddd'
// //                     }}
// //                   />
// //                   <div style={{ 
// //                     display: 'flex', 
// //                     justifyContent: 'space-between',
// //                     marginTop: '5px',
// //                     fontSize: '12px',
// //                     color: settings.darkMode ? '#bbb' : '#777'
// //                   }}>
// //                     <span>Mute</span>
// //                     <span>50%</span>
// //                     <span>100%</span>
// //                   </div>
// //                 </div>

// //                 <div style={{ 
// //                   display: 'flex', 
// //                   alignItems: 'center',
// //                   marginBottom: '20px'
// //                 }}>
// //                   <input
// //                     type="checkbox"
// //                     name="keyboardSound"
// //                     checked={settings.keyboardSound}
// //                     onChange={handleSettingsChange}
// //                     style={{
// //                       marginRight: '10px'
// //                     }}
// //                   />
// //                   <label style={{ 
// //                     fontWeight: '500',
// //                     color: settings.darkMode ? '#bbb' : '#555',
// //                     fontSize: '14px'
// //                   }}>Keyboard Sound</label>
// //                 </div>
// //               </div>

// //               <div style={{ 
// //                 display: 'flex', 
// //                 justifyContent: 'flex-end',
// //                 marginTop: '20px'
// //               }}>
// //                 <button 
// //                   onClick={resetSettings}
// //                   style={{
// //                     padding: '8px 16px',
// //                     backgroundColor: theme.buttonSecondary,
// //                     border: 'none',
// //                     borderRadius: '4px',
// //                     marginRight: '10px',
// //                     cursor: 'pointer',
// //                     fontSize: '14px',
// //                     color: theme.color
// //                   }}
// //                 >
// //                   Reset Defaults
// //                 </button>
// //                 <button 
// //                   onClick={handleLogout}
// //                   style={{
// //                     padding: '8px 16px',
// //                     backgroundColor: '#dc3545',
// //                     color: 'white',
// //                     border: 'none',
// //                     borderRadius: '4px',
// //                     cursor: 'pointer',
// //                     fontSize: '14px',
// //                     display: 'flex',
// //                     alignItems: 'center',
// //                     gap: '5px'
// //                   }}
// //                 >
// //                   <FaSignOutAlt size={14} /> Logout
// //                 </button>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProfilePage;















import React, { useState, useEffect } from 'react';
import { FaChevronRight, FaUser, FaHeart, FaUserShield, FaMapMarkerAlt, FaGraduationCap, FaShoppingCart, FaCog, FaMoon, FaSun } from 'react-icons/fa';

const ProfilePage = () => {
   useEffect(() => {
      document.title = "Profile page|NOVYA - Your Smart Learning Platform";
    }, []);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    gender: '',
    dob: '',
    category: '',
    bloodGroup: '',
    preferredLanguage: '',
    learningStyle: '',
    guardianName: '',
    guardianRelation: '',
    guardianPhone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    currentClass: '',
    board: '',
    schoolName: ''
  });

  const defaultSettings = {
    aiVoice: 'Voice 1',
    voiceSpeed: 1,
    selectedAvatar: 'Avatar 1',
    systemFont: 'Arial',
    colorTheme: 'Light',
    fontSize: 'Medium',
    darkMode: false,
    soundVolume: 80,
    keyboardSound: true
  };

  const [settings, setSettings] = useState(defaultSettings);

  // AI Voice options with realistic names
  const aiVoices = [
    { id: 'voice1', name: 'Emma (Female)' },
    { id: 'voice2', name: 'David (Male)' },
    { id: 'voice3', name: 'Sophia (Female)' },
    { id: 'voice4', name: 'Liam (Male)' },
    { id: 'voice5', name: 'Ava (Female)' }
  ];

  // Animated avatar options
  const avatars = [
    { id: 'avatar1', name: 'Avatar 1', image: 'https://cdn.dribbble.com/users/2364329/screenshots/6676901/02.png' },
    { id: 'avatar2', name: 'Avatar 2', image: 'https://cdn.dribbble.com/users/2364329/screenshots/6676901/04.png' },
    { id: 'avatar3', name: 'Avatar 3', image: 'https://cdn.dribbble.com/users/2364329/screenshots/6676901/07.png' },
    { id: 'avatar4', name: 'Avatar 4', image: 'https://cdn.dribbble.com/users/2364329/screenshots/6676901/08.png' },
    { id: 'avatar5', name: 'Avatar 5', image: 'https://cdn.dribbble.com/users/2364329/screenshots/6676901/10.png' }
  ];

  // Apply dark mode styles
  useEffect(() => {
    if (settings.darkMode) {
      document.body.style.backgroundColor = '#121212';
      document.body.style.color = '#ffffff';
    } else {
      document.body.style.backgroundColor = '#f8f9fa';
      document.body.style.color = '#000000';
    }
  }, [settings.darkMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const toggleDarkMode = () => {
    setSettings(prev => ({
      ...prev,
      darkMode: !prev.darkMode,
      colorTheme: !prev.darkMode ? 'Dark' : 'Light'
    }));
  };

  const getThemeStyles = () => {
    return {
      backgroundColor: settings.darkMode ? '#1e1e1e' : '#ffffff',
      color: settings.darkMode ? '#ffffff' : '#000000',
      borderColor: settings.darkMode ? '#444' : '#ddd',
      inputBackground: settings.darkMode ? '#333' : '#ffffff',
      inputColor: settings.darkMode ? '#ffffff' : '#000000',
      secondaryBackground: settings.darkMode ? '#2d2d2d' : '#f8f9fa',
      buttonPrimary: settings.darkMode ? '#5c7cff' : '#4a6bff',
      buttonSecondary: settings.darkMode ? '#444' : '#f0f0f0'
    };
  };

  const theme = getThemeStyles();

  return (
    <div style={{
      fontFamily: settings.systemFont + ', sans-serif',
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: theme.secondaryBackground,
      minHeight: '100vh'
    }}>
      {/* Profile Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '15px',
        backgroundColor: theme.backgroundColor,
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: `1px solid ${theme.borderColor}`
      }}>
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          backgroundColor: '#e0e0e0',
          marginRight: '15px',
          overflow: 'hidden'
        }}>
          <img 
            src="https://randomuser.me/api/portraits/men/32.jpg" 
            alt="Profile" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div>
          <h2 style={{ margin: '0', fontSize: '20px', fontWeight: '600' }}>
            {formData.firstName || 'Your Name'}
          </h2>
          <p style={{ margin: '5px 0 0', color: settings.darkMode ? '#bbb' : '#666', fontSize: '14px' }}>
            {formData.phone || 'Phone number'}
          </p>
        </div>
        <button 
          onClick={toggleDarkMode}
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            color: theme.color,
            cursor: 'pointer',
            fontSize: '20px'
          }}
        >
          {settings.darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      <div style={{ display: 'flex' }}>
        {/* Sidebar Navigation */}
        <div style={{
          width: '220px',
          marginRight: '20px',
          backgroundColor: theme.backgroundColor,
          borderRadius: '8px',
          padding: '15px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: `1px solid ${theme.borderColor}`
        }}>
          <h3 style={{ 
            fontSize: '16px',
            fontWeight: '600',
            color: settings.darkMode ? '#fff' : '#444',
            borderBottom: `1px solid ${theme.borderColor}`,
            paddingBottom: '10px',
            margin: '0 0 15px 0'
          }}>Personal Details</h3>
          
          <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
            {[
              { id: 'personal', icon: <FaUser size={14} />, label: 'Personal Details' },
              { id: 'preferences', icon: <FaHeart size={14} />, label: 'My Preferences' },
              { id: 'guardian', icon: <FaUserShield size={14} />, label: 'Guardian Details' },
              { id: 'address', icon: <FaMapMarkerAlt size={14} />, label: 'Address Details' },
              { id: 'academic', icon: <FaGraduationCap size={14} />, label: 'Academic Details' },
              { id: 'purchases', icon: <FaShoppingCart size={14} />, label: 'My Purchases' },
              { id: 'settings', icon: <FaCog size={14} />, label: 'Settings' }
            ].map(item => (
              <li 
                key={item.id}
                style={{
                  padding: '12px 0',
                  borderBottom: `1px solid ${theme.borderColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  color: activeTab === item.id ? '#4a6bff' : theme.color,
                  fontWeight: activeTab === item.id ? '600' : '400',
                  fontSize: '14px'
                }}
                onClick={() => setActiveTab(item.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '10px' }}>{item.icon}</span>
                  {item.label}
                </div>
                <FaChevronRight size={12} />
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content Area */}
        <div style={{
          flex: '1',
          backgroundColor: theme.backgroundColor,
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: `1px solid ${theme.borderColor}`
        }}>
          {activeTab === 'personal' && (
            <div>
              <h3 style={{ 
                margin: '0 0 20px 0', 
                fontSize: '18px', 
                fontWeight: '600',
                color: theme.color
              }}>Personal Details</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: settings.darkMode ? '#bbb' : '#555',
                  fontSize: '14px'
                }}>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${theme.borderColor}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: theme.inputBackground,
                    color: theme.inputColor
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: settings.darkMode ? '#bbb' : '#555',
                  fontSize: '14px'
                }}>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${theme.borderColor}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: theme.inputBackground,
                    color: theme.inputColor
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: settings.darkMode ? '#bbb' : '#555',
                  fontSize: '14px'
                }}>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${theme.borderColor}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: theme.inputBackground,
                    color: theme.inputColor
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: settings.darkMode ? '#bbb' : '#555',
                  fontSize: '14px'
                }}>Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${theme.borderColor}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    color: formData.gender ? theme.inputColor : '#999',
                    backgroundColor: theme.inputBackground
                  }}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: settings.darkMode ? '#bbb' : '#555',
                  fontSize: '14px'
                }}>Date of Birth *</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${theme.borderColor}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    color: formData.dob ? theme.inputColor : '#999',
                    backgroundColor: theme.inputBackground
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: settings.darkMode ? '#bbb' : '#555',
                  fontSize: '14px'
                }}>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${theme.borderColor}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    color: formData.category ? theme.inputColor : '#999',
                    backgroundColor: theme.inputBackground
                  }}
                >
                  <option value="">Select Category</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: settings.darkMode ? '#bbb' : '#555',
                  fontSize: '14px'
                }}>Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${theme.borderColor}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    color: formData.bloodGroup ? theme.inputColor : '#999',
                    backgroundColor: theme.inputBackground
                  }}
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="O+">O+</option>
                  <option value="AB+">AB+</option>
                </select>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end',
                marginTop: '20px'
              }}>
                <button style={{
                  padding: '8px 16px',
                  backgroundColor: theme.buttonSecondary,
                  border: 'none',
                  borderRadius: '4px',
                  marginRight: '10px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: theme.color
                }}>
                  Cancel
                </button>
                <button style={{
                  padding: '8px 16px',
                  backgroundColor: theme.buttonPrimary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div>
              <h3 style={{ 
                margin: '0 0 20px 0', 
                fontSize: '18px', 
                fontWeight: '600',
                color: theme.color
              }}>My Preferences</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: settings.darkMode ? '#bbb' : '#555',
                  fontSize: '14px'
                }}>Preferred Language</label>
                <select
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${theme.borderColor}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    color: formData.preferredLanguage ? theme.inputColor : '#999',
                    backgroundColor: theme.inputBackground
                  }}
                >
                  <option value="">Select Language</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Bengali">Bengali</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: settings.darkMode ? '#bbb' : '#555',
                  fontSize: '14px'
                }}>Learning Style</label>
                <select
                  name="learningStyle"
                  value={formData.learningStyle}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${theme.borderColor}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    color: formData.learningStyle ? theme.inputColor : '#999',
                    backgroundColor: theme.inputBackground
                  }}
                >
                  <option value="">Select Learning Style</option>
                  <option value="Visual">Visual</option>
                  <option value="Auditory">Auditory</option>
                  <option value="Reading/Writing">Reading/Writing</option>
                  <option value="Kinesthetic">Kinesthetic</option>
                </select>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end',
                marginTop: '20px'
              }}>
                <button style={{
                  padding: '8px 16px',
                  backgroundColor: theme.buttonSecondary,
                  border: 'none',
                  borderRadius: '4px',
                  marginRight: '10px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: theme.color
                }}>
                  Cancel
                </button>
                <button style={{
                  padding: '8px 16px',
                  backgroundColor: theme.buttonPrimary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'guardian' && (
            <div>
              <h3 style={{ 
                margin: '0 0 20px 0', 
                fontSize: '18px', 
                fontWeight: '600',
                color: theme.color
              }}>Guardian Details</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: settings.darkMode ? '#bbb' : '#555',
                  fontSize: '14px'
                }}>Guardian Name *</label>
                <input
                  type="text"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${theme.borderColor}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: theme.inputBackground,
                    color: theme.inputColor
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: settings.darkMode ? '#bbb' : '#555',
                  fontSize: '14px'
                }}>Relation *</label>
                <select
                  name="guardianRelation"
                  value={formData.guardianRelation}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${theme.borderColor}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    color: formData.guardianRelation ? theme.inputColor : '#999',
                    backgroundColor: theme.inputBackground
                  }}
                >
                  <option value="">Select Relation</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: settings.darkMode ? '#bbb' : '#555',
                  fontSize: '14px'
                }}>Guardian Phone *</label>
                <input
                  type="tel"
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${theme.borderColor}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: theme.inputBackground,
                    color: theme.inputColor
                  }}
                />
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end',
                marginTop: '20px'
              }}>
                <button style={{
                  padding: '8px 16px',
                  backgroundColor: theme.buttonSecondary,
                  border: 'none',
                  borderRadius: '4px',
                  marginRight: '10px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: theme.color
                }}>
                  Cancel
                </button>
                <button style={{
                  padding: '8px 16px',
                  backgroundColor: theme.buttonPrimary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'address' && (
            <div>
              <h3 style={{ 
                margin: '0 0 20px 0', 
                fontSize: '18px', 
                fontWeight: '600',
                color: theme.color
              }}>Address Details</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: settings.darkMode ? '#bbb' : '#555',
                  fontSize: '14px'
                }}>Full Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${theme.borderColor}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    minHeight: '80px',
                    backgroundColor: theme.inputBackground,
                    color: theme.inputColor
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: settings.darkMode ? '#bbb' : '#555',
                  fontSize: '14px'
                }}>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${theme.borderColor}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: theme.inputBackground,
                    color: theme.inputColor
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: settings.darkMode ? '#bbb' : '#555',
                  fontSize: '14px'
                }}>State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${theme.borderColor}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: theme.inputBackground,
                    color: theme.inputColor
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: settings.darkMode ? '#bbb' : '#555',
                  fontSize: '14px'
                }}>Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${theme.borderColor}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: theme.inputBackground,
                    color: theme.inputColor
                  }}
                />
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end',
                marginTop: '20px'
              }}>
                <button style={{
                  padding: '8px 16px',
                  backgroundColor: theme.buttonSecondary,
                  border: 'none',
                  borderRadius: '4px',
                  marginRight: '10px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: theme.color
                }}>
                  Cancel
                </button>
                <button style={{
                  padding: '8px 16px',
                  backgroundColor: theme.buttonPrimary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'academic' && (
            <div>
              <h3 style={{ 
                margin: '0 0 20px 0', 
                fontSize: '18px', 
                fontWeight: '600',
                color: theme.color
              }}>Academic Details</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: settings.darkMode ? '#bbb' : '#555',
                  fontSize: '14px'
                }}>Current Class *</label>
                <select
                  name="currentClass"
                  value={formData.currentClass}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${theme.borderColor}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    color: formData.currentClass ? theme.inputColor : '#999',
                    backgroundColor: theme.inputBackground
                  }}
                >
                  <option value="">Select Class</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i+1} value={`Class ${i+1}`}>Class {i+1}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: settings.darkMode ? '#bbb' : '#555',
                  fontSize: '14px'
                }}>Board *</label>
                <select
                  name="board"
                  value={formData.board}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${theme.borderColor}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    color: formData.board ? theme.inputColor : '#999',
                    backgroundColor: theme.inputBackground
                  }}
                >
                  <option value="">Select Board</option>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="State Board">State Board</option>
                  <option value="IB">IB</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: settings.darkMode ? '#bbb' : '#555',
                  fontSize: '14px'
                }}>School Name *</label>
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${theme.borderColor}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: theme.inputBackground,
                    color: theme.inputColor
                  }}
                />
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end',
                marginTop: '20px'
              }}>
                <button style={{
                  padding: '8px 16px',
                  backgroundColor: theme.buttonSecondary,
                  border: 'none',
                  borderRadius: '4px',
                  marginRight: '10px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: theme.color
                }}>
                  Cancel
                </button>
                <button style={{
                  padding: '8px 16px',
                  backgroundColor: theme.buttonPrimary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'purchases' && (
            <div>
              <h3 style={{ 
                margin: '0 0 20px 0', 
                fontSize: '18px', 
                fontWeight: '600',
                color: theme.color
              }}>My Purchases</h3>
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                backgroundColor: settings.darkMode ? '#2d2d2d' : '#f9f9f9',
                borderRadius: '8px',
                border: `1px solid ${theme.borderColor}`
              }}>
                <p style={{ color: settings.darkMode ? '#bbb' : '#666', fontSize: '16px' }}>No purchases yet</p>
                <button style={{
                  padding: '8px 16px',
                  backgroundColor: theme.buttonPrimary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginTop: '10px'
                }}>
                  Browse Courses
                </button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h3 style={{ 
                margin: '0 0 20px 0', 
                fontSize: '18px', 
                fontWeight: '600',
                color: theme.color
              }}>Settings</h3>
              
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ 
                  margin: '0 0 15px 0', 
                  fontSize: '16px', 
                  fontWeight: '600',
                  color: theme.color,
                  borderBottom: `1px solid ${theme.borderColor}`,
                  paddingBottom: '8px'
                }}>AI Assistant</h4>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: settings.darkMode ? '#bbb' : '#555',
                    fontSize: '14px'
                  }}>AI Voice</label>
                  <select
                    name="aiVoice"
                    value={settings.aiVoice}
                    onChange={handleSettingsChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: `1px solid ${theme.borderColor}`,
                      borderRadius: '4px',
                      fontSize: '14px',
                      backgroundColor: theme.inputBackground,
                      color: theme.inputColor
                    }}
                  >
                    {aiVoices.map(voice => (
                      <option key={voice.id} value={voice.name}>{voice.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: settings.darkMode ? '#bbb' : '#555',
                    fontSize: '14px'
                  }}>Voice Speed</label>
                  <input
                    type="range"
                    name="voiceSpeed"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={settings.voiceSpeed}
                    onChange={handleSettingsChange}
                    style={{
                      width: '100%',
                      height: '8px',
                      borderRadius: '4px',
                      outline: 'none',
                      backgroundColor: settings.darkMode ? '#444' : '#ddd'
                    }}
                  />
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginTop: '5px',
                    fontSize: '12px',
                    color: settings.darkMode ? '#bbb' : '#777'
                  }}>
                    <span>Slow</span>
                    <span>Normal</span>
                    <span>Fast</span>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: settings.darkMode ? '#bbb' : '#555',
                    fontSize: '14px'
                  }}>AI Avatar</label>
                  <div style={{ 
                    display: 'flex',
                    gap: '10px',
                    flexWrap: 'wrap'
                  }}>
                    {avatars.map(avatar => (
                      <div 
                        key={avatar.id}
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          backgroundColor: settings.selectedAvatar === avatar.name ? '#e6f0ff' : settings.darkMode ? '#444' : '#f5f5f5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          border: settings.selectedAvatar === avatar.name ? '2px solid #4a6bff' : '2px solid transparent',
                          overflow: 'hidden'
                        }}
                        onClick={() => setSettings(prev => ({ ...prev, selectedAvatar: avatar.name }))}
                      >
                        <img 
                          src={avatar.image} 
                          alt={avatar.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ 
                  margin: '0 0 15px 0', 
                  fontSize: '16px', 
                  fontWeight: '600',
                  color: theme.color,
                  borderBottom: `1px solid ${theme.borderColor}`,
                  paddingBottom: '8px'
                }}>Display Settings</h4>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: settings.darkMode ? '#bbb' : '#555',
                    fontSize: '14px'
                  }}>System Font</label>
                  <select
                    name="systemFont"
                    value={settings.systemFont}
                    onChange={handleSettingsChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: `1px solid ${theme.borderColor}`,
                      borderRadius: '4px',
                      fontSize: '14px',
                      backgroundColor: theme.inputBackground,
                      color: theme.inputColor
                    }}
                  >
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Georgia">Georgia</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: settings.darkMode ? '#bbb' : '#555',
                    fontSize: '14px'
                  }}>Color Theme</label>
                  <select
                    name="colorTheme"
                    value={settings.colorTheme}
                    onChange={handleSettingsChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: `1px solid ${theme.borderColor}`,
                      borderRadius: '4px',
                      fontSize: '14px',
                      backgroundColor: theme.inputBackground,
                      color: theme.inputColor
                    }}
                  >
                    <option value="Light">Light</option>
                    <option value="Dark">Dark</option>
                    <option value="Blue">Blue</option>
                    <option value="Green">Green</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: settings.darkMode ? '#bbb' : '#555',
                    fontSize: '14px'
                  }}>Font Size</label>
                  <select
                    name="fontSize"
                    value={settings.fontSize}
                    onChange={handleSettingsChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: `1px solid ${theme.borderColor}`,
                      borderRadius: '4px',
                      fontSize: '14px',
                      backgroundColor: theme.inputBackground,
                      color: theme.inputColor
                    }}
                  >
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                    <option value="Extra Large">Extra Large</option>
                  </select>
                </div>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <input
                    type="checkbox"
                    name="darkMode"
                    checked={settings.darkMode}
                    onChange={toggleDarkMode}
                    style={{
                      marginRight: '10px'
                    }}
                  />
                  <label style={{ 
                    fontWeight: '500',
                    color: settings.darkMode ? '#bbb' : '#555',
                    fontSize: '14px'
                  }}>Dark Mode</label>
                </div>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ 
                  margin: '0 0 15px 0', 
                  fontSize: '16px', 
                  fontWeight: '600',
                  color: theme.color,
                  borderBottom: `1px solid ${theme.borderColor}`,
                  paddingBottom: '8px'
                }}>Sound</h4>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: settings.darkMode ? '#bbb' : '#555',
                    fontSize: '14px'
                  }}>Sound Volume</label>
                  <input
                    type="range"
                    name="soundVolume"
                    min="0"
                    max="100"
                    value={settings.soundVolume}
                    onChange={handleSettingsChange}
                    style={{
                      width: '100%',
                      height: '8px',
                      borderRadius: '4px',
                      outline: 'none',
                      backgroundColor: settings.darkMode ? '#444' : '#ddd'
                    }}
                  />
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginTop: '5px',
                    fontSize: '12px',
                    color: settings.darkMode ? '#bbb' : '#777'
                  }}>
                    <span>Mute</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <input
                    type="checkbox"
                    name="keyboardSound"
                    checked={settings.keyboardSound}
                    onChange={handleSettingsChange}
                    style={{
                      marginRight: '10px'
                    }}
                  />
                  <label style={{ 
                    fontWeight: '500',
                    color: settings.darkMode ? '#bbb' : '#555',
                    fontSize: '14px'
                  }}>Keyboard Sound</label>
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end',
                marginTop: '20px'
              }}>
                <button 
                  onClick={resetSettings}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: theme.buttonSecondary,
                    border: 'none',
                    borderRadius: '4px',
                    marginRight: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: theme.color
                  }}
                >
                  Reset Defaults
                </button>
                <button style={{
                  padding: '8px 16px',
                  backgroundColor: theme.buttonPrimary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
