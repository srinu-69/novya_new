// import React from 'react';
// import { useEffect } from 'react';
// import { Box } from '@mui/material';
// import heroImage from './assets/hero.webp';
 
// function HeroSection() {
//   useEffect(() => {
//     document.title = "Home|NOVYA - Your Smart Learning Platform";
//   }, []);
 
//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         minHeight: { xs: 'auto', md: '100vh' },
//         padding: { xs: '20px 18px', md: '40px' },
//       }}
//     >
//       <Box
//         component="img"
//         src={heroImage}
//         alt="Background"
//         sx={{
//           maxWidth: '100%',
//           maxHeight: { xs: '80vh', md: '100%' },
//           width: 'auto',
//           height: 'auto',
//           objectFit: 'contain',
//           display: 'block',
//           borderRadius: { xs: '12px', md: '16px' }, // Added rounded corners
//           boxShadow: '0 10px 30px rgba(0,0,0,0.1)', // Added subtle shadow
//           border: '1px solid rgba(0,0,0,0.05)', // Added subtle border
//           transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Added hover effect
//           '&:hover': {
//             transform: { md: 'scale(1.01)' }, // Subtle zoom on hover for desktop
//             boxShadow: { md: '0 15px 40px rgba(0,0,0,0.15)' }, // Enhanced shadow on hover
//           }
//         }}
//       />
//     </Box>
//   );
// }
 
// export default HeroSection;
 



import React from 'react';
import { useEffect } from 'react';
import { Box } from '@mui/material';
import heroImage from './assets/hero.webp';
 
function HeroSection() {
  useEffect(() => {
    document.title = "Home|NOVYA - Your Smart Learning Platform";
  }, []);
 
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: { xs: 'auto', md: '100vh' },
        padding: { xs: '20px 18px', md: '40px' },
      }}
    >
      <Box
        component="img"
        src={heroImage}
        alt="Background"
        sx={{
          maxWidth: '100%',
          maxHeight: { xs: '80vh', md: '100%' },
          width: 'auto',
          height: 'auto',
          objectFit: 'contain',
          display: 'block',
          borderRadius: { xs: '12px', md: '16px' }, // Added rounded corners
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)', // Added subtle shadow
          border: '1px solid rgba(0,0,0,0.05)', // Added subtle border
          transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Added hover effect
          '&:hover': {
            transform: { md: 'scale(1.01)' }, // Subtle zoom on hover for desktop
            boxShadow: { md: '0 15px 40px rgba(0,0,0,0.15)' }, // Enhanced shadow on hover
          }
        }}
      />
    </Box>
  );
}
 
export default HeroSection;
 