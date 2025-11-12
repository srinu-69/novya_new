

// import React from 'react';
// import { Card, ProgressBar } from 'react-bootstrap';
// import { FaRupeeSign, FaCheckCircle } from 'react-icons/fa';
// import { motion } from 'framer-motion';

// const Fees = () => {
//   const total = 3600;
//   // const paid = 3600; // Marked as fully paid
//   const paidPercent = 100; // 100% paid

//   const statusConfig = {
//     icon: <FaCheckCircle className="me-2" />,
//     variant: 'success',
//     message: 'Fully Paid',
//     progressColor: '#28A745',
//     bgColor: 'rgba(40, 167, 69, 0.1)',
//     borderColor: '#28A745'
//   };

//   // Animation variants
//   const cardVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { 
//       opacity: 1, 
//       y: 0, 
//       transition: { 
//         duration: 0.5,
//         staggerChildren: 0.1
//       } 
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 10 },
//     visible: { opacity: 1, y: 0 }
//   };

//   const statHoverVariants = {
//     hover: { 
//       scale: 1.03, 
//       boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
//       transition: { type: "spring", stiffness: 300 }
//     }
//   };

//   return (
//     <motion.div
//       initial="hidden"
//       animate="visible"
//       variants={cardVariants}
//     >
//       <Card className="mb-3 shadow-lg" style={{ 
//         borderRadius: '15px', 
//         border: 'none', 
//         overflow: 'hidden',
//         background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
//       }}>
//         <Card.Body className="p-4">
//           <motion.div variants={itemVariants} className="d-flex align-items-center mb-4">
//             <motion.div 
//               whileHover={{ rotate: 10 }}
//               style={{
//                 backgroundColor: 'rgba(40, 167, 69, 0.1)',
//                 width: '50px',
//                 height: '50px',
//                 borderRadius: '50%',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 marginRight: '15px',
//                 color: '#28A745',
//                 fontSize: '1.2rem'
//               }}>
//               <FaRupeeSign />
//             </motion.div>
//             <div>
//               <Card.Title className="m-0" style={{ 
//                 fontSize: '1.5rem', 
//                 fontWeight: '700',
//                 color: '#2D5D7B'
//               }}>
//                 Education Fee
//               </Card.Title>
//               <p className="m-0 text-muted">Academic Year 2025-2026</p>
//             </div>
//           </motion.div>

//           <div className="d-flex justify-content-between mb-4">
//             <motion.div 
//               variants={itemVariants}
//               whileHover={statHoverVariants.hover}
//               className="text-center p-3 rounded" 
//               style={{
//                 backgroundColor: 'rgba(45, 93, 123, 0.05)', 
//                 flex: 1, 
//                 marginRight: '10px',
//                 border: '1px solid rgba(45, 93, 123, 0.1)'
//               }}>
//               <div className="text-muted mb-1">Total Fee</div>
//               <div className="h4 font-weight-bold" style={{ color: '#2D5D7B' }}>
//                 ₹{total.toLocaleString()}
//               </div>
//             </motion.div>

//             <motion.div 
//               variants={itemVariants}
//               whileHover={statHoverVariants.hover}
//               className="text-center p-3 rounded" 
//               style={{
//                 backgroundColor: 'rgba(40, 167, 69, 0.1)', 
//                 flex: 1,
//                 border: '1px solid rgba(40, 167, 69, 0.2)'
//               }}>
//               <div className="text-muted mb-1">Status</div>
//               <motion.div 
//                 animate={{ 
//                   scale: [1, 1.05, 1],
//                   transition: { repeat: Infinity, duration: 2 }
//                 }}
//                 className="h4 font-weight-bold" 
//                 style={{ 
//                   color: '#28A745'
//                 }}
//               >
//                 Paid
//               </motion.div>
//             </motion.div>
//           </div>

//           <motion.div variants={itemVariants} className="mb-4">
//             <div className="d-flex justify-content-between mb-2">
//               <span className="text-muted">Payment Progress</span>
//               <span style={{ 
//                 fontWeight: '700',
//                 color: '#28A745'
//               }}>
//                 {paidPercent}%
//               </span>
//             </div>
//             <ProgressBar 
//               now={paidPercent} 
//               label={`${paidPercent}%`} 
//               variant={statusConfig.variant} 
//               style={{ 
//                 height: '12px', 
//                 borderRadius: '6px', 
//                 boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
//                 overflow: 'hidden'
//               }} 
//             />
//           </motion.div>

//           <motion.div
//             variants={itemVariants}
//             className="p-3 rounded d-flex align-items-center" 
//             style={{
//               backgroundColor: statusConfig.bgColor,
//               borderLeft: `4px solid ${statusConfig.borderColor}`,
//             }}
//           >
//             <motion.div
//               animate={{ 
//                 scale: [1, 1.1, 1],
//                 transition: { repeat: Infinity, duration: 2 }
//               }}
//               style={{ 
//                 color: statusConfig.borderColor, 
//                 fontSize: '1.5rem', 
//                 marginRight: '15px' 
//               }}
//             >
//               {statusConfig.icon}
//             </motion.div>
//             <div>
//               <div className="font-weight-bold" style={{ 
//                 color: statusConfig.borderColor, 
//                 marginBottom: '2px',
//                 fontSize: '1.1rem'
//               }}>
//                 {statusConfig.message}
//               </div>
//               <div className="text-muted">
//                 Thank you for completing the payment!
//               </div>
//             </div>
//           </motion.div>

//           <motion.div 
//             variants={itemVariants}
//             className="mt-4 text-center"
//           >
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               style={{
//                 backgroundColor: 'rgba(40, 167, 69, 0.1)',
//                 padding: '15px',
//                 borderRadius: '10px',
//                 display: 'inline-block'
//               }}
//             >
//               <div style={{ 
//                 fontSize: '1rem',
//                 fontWeight: '600',
//                 color: '#28A745'
//               }}>
//                 Payment completed on 15-Jul-2025
//               </div>
//             </motion.div>
//           </motion.div>
//         </Card.Body>
//       </Card>

//       {/* Success Confetti Effect (Visual Only) */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.5 }}
//         style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           width: '100%',
//           height: '100%',
//           pointerEvents: 'none',
//           zIndex: -1,
//           background: 'radial-gradient(circle at center, rgba(40, 167, 69, 0.1) 0%, transparent 70%)'
//         }}
//       />
//     </motion.div>
//   );
// };

// export default Fees;