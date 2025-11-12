
// import React, { useState, useEffect } from 'react';
// import {
//   ChevronRight,
//   Calculator,
//   Atom,
//   FileText,
//   BookOpen,
//   Users,
//   Globe,
//   BarChart,
//   Code,
//   Menu,
//   X,
//   List,
// } from 'lucide-react';
// import { useNavigate, useLocation } from 'react-router-dom';

// const Learn = () => {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const initialSubject = queryParams.get('subject') || 'Maths';
//   const navigate = useNavigate();
//   const [selectedSubject, setSelectedSubject] = useState(initialSubject);
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [expandedChapters, setExpandedChapters] = useState({});

//   useEffect(() => {
//     const handleResize = () => setWindowWidth(window.innerWidth);
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const getCurrentClass = () => {
//     if (location.pathname.includes('/learn/class10')) return '10';
//     if (location.pathname.includes('/learn/class9')) return '9';
//     if (location.pathname.includes('/learn/class8')) return '8';
//     if (location.pathname.includes('/learn/class7')) return '7';
//     return '7'; // Default to class 7 if no match
//   };

//   const currentClass = getCurrentClass();
//   const isMobile = windowWidth < 768;
//   const isTablet = windowWidth >= 768 && windowWidth < 1024;

//   const subjects = [
//     { name: 'Maths', icon: Calculator },
//     { name: 'Science', icon: Atom },
//     { name: 'English', icon: BookOpen },
//     { name: 'History', icon: FileText },
//     { name: 'Civics', icon: Users },
//     { name: 'Geography', icon: Globe },
//     ...(currentClass === '9' || currentClass === '10' ? [{ name: 'Economics', icon: BarChart }] : []),
//     { name: 'Computer', icon: Code },
//   ];

  // const allChapters = {
  //   '7': {
  //     Maths: [
  //       { number: 1, title: 'Chapter 1: Integers' },
  //       { number: 2, title: 'Chapter 2: Fractions and Decimals' },
  //       { number: 3, title: 'Chapter 3: Data Handling' },
  //       { number: 4, title: 'Chapter 4: Simple Equations' },
  //       { number: 5, title: 'Chapter 5: Lines and Angles' },
  //       { number: 6, title: 'Chapter 6: The Triangle and Its Properties' },
  //       { number: 7, title: 'Chapter 7: Comparing Quantities' },
  //       { number: 8, title: 'Chapter 8: Rational Numbers' },
  //       { number: 9, title: 'Chapter 9: Perimeter and Area' },
  //       { number: 10, title: 'Chapter 10: Algebraic Expressions' },
  //       { number: 11, title: 'Chapter 11: Exponents and Powers' },
  //       { number: 12, title: 'Chapter 12: Symmetry' },
  //       { number: 13, title: 'Chapter 13: Visualising Solid Shapes' },
  //     ],
  //     Science: [
  //       { number: 1, title: 'Chapter 1: Nutrition in Plants' },
  //       { number: 2, title: 'Chapter 2: Nutrition in Animals' },
  //       { number: 3, title: 'Chapter 3: Fibre to Fabric' },
  //       { number: 4, title: 'Chapter 4: Heat' },
  //       { number: 5, title: 'Chapter 5: Acids, Bases and Salts' },
  //       { number: 6, title: 'Chapter 6: Physical and Chemical Changes' },
  //       { number: 7, title: 'Chapter 7: Weather, Climate and Adaptations of Animals' },
  //       { number: 8, title: 'Chapter 8: Winds, Storms and Cyclones' },
  //       { number: 9, title: 'Chapter 9: Soil' },
  //       { number: 10, title: 'Chapter 10: Respiration in Organisms' },
  //       { number: 11, title: 'Chapter 11: Transportation in Animals and Plants' },
  //       { number: 12, title: 'Chapter 12: Reproduction in Plants' },
  //       { number: 13, title: 'Chapter 13: Motion and Time' },
  //       { number: 14, title: 'Chapter 14: Electric Current and Its Effects' },
  //       { number: 15, title: 'Chapter 15: Light' },
  //       { number: 16, title: 'Chapter 16: Water: A Precious Resource' },
  //       { number: 17, title: 'Chapter 17: Forests: Our Lifeline' },
  //       { number: 18, title: 'Chapter 18: Wastewater Story' },
  //     ],
  //     English: [
  //       { number: 1, title: 'Chapter 1: Learning Together' },
  //       { number: 2, title: 'Chapter 2: Wit and Humour' },
  //       { number: 3, title: 'Chapter 3: Dreams & Discoveries' },
  //       { number: 4, title: 'Chapter 4: Travel and Adventure' },
  //       { number: 5, title: 'Chapter 5: Bravehearts' },
  //     ],
  //     History: [
  //       { number: 1, title: 'Chapter 1: Tracing Changes through a Thousand Years' },
  //       { number: 2, title: 'Chapter 2: New Kings and Kingdoms' },
  //       { number: 3, title: 'Chapter 3: The Delhi Sultans (12th–15th Century)' },
  //       { number: 4, title: 'Chapter 4: The Mughal Empire (16th–17th Century)' },
  //       { number: 5, title: 'Chapter 5: Rulers and Buildings / Tribes, Nomads and Settled Communities' },
  //       { number: 6, title: 'Chapter 6: Devotional Paths to the Divine' },
  //       { number: 7, title: 'Chapter 7: The Making of Regional Cultures' },
  //       { number: 8, title: 'Chapter 8: Eighteenth Century Political Formations' },
  //     ],
  //     Civics: [
  //       { number: 1, title: 'Chapter 1: On Equality' },
  //       { number: 2, title: 'Chapter 2: Role of the Government in Health' },
  //       { number: 3, title: 'Chapter 3: How the State Government Works' },
  //       { number: 4, title: 'Chapter 4: Growing up as Boys and Girls' },
  //       { number: 5, title: 'Chapter 5: Women Change the World' },
  //       { number: 6, title: 'Chapter 6: Understanding Media' },
  //       { number: 7, title: 'Chapter 7: Markets Around Us' },
  //       { number: 8, title: 'Chapter 8: A Shirt in the Market' },
  //     ],
  //     Geography: [
  //       { number: 1, title: 'Chapter 1: Environment' },
  //       { number: 2, title: 'Chapter 2: Inside Our Earth' },
  //       { number: 3, title: 'Chapter 3: Our Changing Earth' },
  //       { number: 4, title: 'Chapter 4: Air' },
  //       { number: 5, title: 'Chapter 5: Water' },
  //       { number: 6, title: 'Chapter 6: Human-Environment Interactions– The Tropical and the Subtropical Region' },
  //       { number: 7, title: 'Chapter 7: Life in the Deserts' },
  //     ],
  //     Computer: [
  //       { number: 1, title: 'Chapter 1: Programming Language' },
  //       { number: 2, title: 'Chapter 2: Editing Text in Microsoft Word' },
  //       { number: 3, title: 'Chapter 3: Microsoft PowerPoint' },
  //       { number: 4, title: 'Chapter 4: Basics of Microsoft Excel' },
  //       { number: 5, title: 'Chapter 5: Microsoft Access' },
  //     ],
  //   },
  //   '8': {
  //     Maths: [
  //       { number: 1, title: 'Chapter 1: Rational Numbers' },
  //       { number: 2, title: 'Chapter 2: Linear Equations in One Variable' },
  //       { number: 3, title: 'Chapter 3: Understanding Quadrilaterals' },
  //       { number: 4, title: 'Chapter 4: Data Handling' },
  //       { number: 5, title: 'Chapter 5: Squares and Square Roots' },
  //       { number: 6, title: 'Chapter 6: Cubes and Cube Roots' },
  //       { number: 7, title: 'Chapter 7: Comparing Quantities' },
  //       { number: 8, title: 'Chapter 8: Algebraic Expressions and Identities' },
  //       { number: 9, title: 'Chapter 9: Mensuration' },
  //       { number: 10, title: 'Chapter 10: Exponents and Powers' },
  //       { number: 11, title: 'Chapter 11: Direct and Inverse Proportions' },
  //       { number: 12, title: 'Chapter 12: Factorisation' },
  //       { number: 13, title: 'Chapter 13: Introduction to Graphs' },
  //     ],
  //     Science: [
  //       { number: 1, title: 'Chapter 1: Crop Production and Management' },
  //       { number: 2, title: 'Chapter 2: Microorganisms: Friend and Foe' },
  //       { number: 3, title: 'Chapter 3: Synthetic Fibres and Plastics' },
  //       { number: 4, title: 'Chapter 4: Materials: Metals and Non-Metals' },
  //       { number: 5, title: 'Chapter 5: Coal and Petroleum' },
  //       { number: 6, title: 'Chapter 6: Combustion and Flame' },
  //       { number: 7, title: 'Chapter 7: Conservation of Plants and Animals' },
  //       { number: 8, title: 'Chapter 8: Cell – Structure and Functions' },
  //       { number: 9, title: 'Chapter 9: Reproduction in Animals' },
  //       { number: 10, title: 'Chapter 10: Force and Pressure' },
  //       { number: 11, title: 'Chapter 11: Friction' },
  //       { number: 12, title: 'Chapter 12: Sound' },
  //       { number: 13, title: 'Chapter 13: Chemical Effects of Electric Current' },
  //       { number: 14, title: 'Chapter 14: Some Natural Phenomena' },
  //       { number: 15, title: 'Chapter 15: Light' },
  //       { number: 16, title: 'Chapter 16: Stars and the Solar System' },
  //       { number: 17, title: 'Chapter 17: Pollution of Air and Water' },
  //     ],
  //     English: [
  //       { number: 1, title: 'Unit 1: Honeydew – Prose' },
  //       { number: 2, title: 'Unit 2: Honeydew – Poems' },
  //       { number: 3, title: 'Unit 3: It So Happened – Supplementary' },
  //     ],
  //     History: [
  //       { number: 1, title: 'Chapter 1: How, When and Where' },
  //       { number: 2, title: 'Chapter 2: From Trade to Territory– The Company Establishes Power' },
  //       { number: 3, title: 'Chapter 3: Ruling the Countryside' },
  //       { number: 4, title: 'Chapter 4: Tribals, Dikus and the Vision of a Golden Age' },
  //       { number: 5, title: 'Chapter 5: When People Rebel– 1857 and After' },
  //       { number: 6, title: 'Chapter 6: Civilising the "Native", Educating the Nation' },
  //       { number: 7, title: 'Chapter 7: Women, Caste and Reform' },
  //       { number: 8, title: 'Chapter 8: The Making of the National Movement: 1870s–1947' },
  //     ],
  //     Civics: [
  //       { number: 1, title: 'Chapter 1: The Indian Constitution' },
  //       { number: 2, title: 'Chapter 2: Understanding Secularism' },
  //       { number: 3, title: 'Chapter 3: Parliament and the Making of Laws' },
  //       { number: 4, title: 'Chapter 4: Judiciary' },
  //       { number: 5, title: 'Chapter 5: Understanding Marginalisation' },
  //       { number: 6, title: 'Chapter 6: Confronting Marginalisation' },
  //       { number: 7, title: 'Chapter 7: Public Facilities' },
  //       { number: 8, title: 'Chapter 8: Law and Social Justice' },
  //     ],
  //     Geography: [
  //       { number: 1, title: 'Chapter 1: Resources' },
  //       { number: 2, title: 'Chapter 2: Land, Soil, Water, Natural Vegetation and Wildlife Resources' },
  //       { number: 3, title: 'Chapter 3: Agriculture' },
  //       { number: 4, title: 'Chapter 4: Industries' },
  //       { number: 5, title: 'Chapter 5: Human Resources' },
  //     ],
  //     Computer: [
  //       { number: 1, title: 'Chapter 1: Exception Handling in Python' },
  //       { number: 2, title: 'Chapter 2: File Handling in Python' },
  //       { number: 3, title: 'Chapter 3: Stack (Data Structure)' },
  //       { number: 4, title: 'Chapter 4: Queue (Data Structure)' },
  //       { number: 5, title: 'Chapter 5: Sorting' },
  //     ],
  //   },
  //   '9': {
  //     Computer: [
  //       { number: 1, title: "Chapter 1: Basics of Computer System" },
  //       { number: 2, title: "Chapter 2: Types of Software" },
  //       { number: 3, title: "Chapter 3: Operating System" },
  //       { number: 4, title: "Chapter 4: Introduction to Python Programming" },
  //       { number: 5, title: "Chapter 5: Introduction to Cyber Security" }
  //     ],
  //     English: [
  //       { number: 1, title: "Unit 1: Beehive – Prose" },
  //       { number: 2, title: "Unit 2: Beehive – Poems" },
  //       { number: 3, title: "Unit 3: Moments – Supplementary" }
  //     ],
  //     Maths: [
  //       { number: 1, title: "Chapter 1: Number System" },
  //       { number: 2, title: "Chapter 2: Algebra" },
  //       { number: 3, title: "Chapter 3: Coordinate Geometry" },
  //       { number: 4, title: "Chapter 4: Geometry" },
  //       { number: 5, title: "Chapter 5: Mensuration" },
  //       { number: 6, title: "Chapter 6: Statistics" }
  //     ],
  //     Science: [
  //       { number: 1, title: "Chapter 1: Matter in Our Surroundings" },
  //       { number: 2, title: "Chapter 2: Is Matter Around Us Pure?" },
  //       { number: 3, title: "Chapter 3: Atoms and Molecules" },
  //       { number: 4, title: "Chapter 4: Structure of the Atom" },
  //       { number: 5, title: "Chapter 5: The Fundamental Unit of Life" },
  //       { number: 6, title: "Chapter 6: Tissues" },
  //       { number: 7, title: "Chapter 7: Diversity of the Living Organisms – I" },
  //       { number: 8, title: "Chapter 8: Diversity of the Living Organisms – II" },
  //       { number: 9, title: "Chapter 9: Diversity of the Living Organisms – III" },
  //       { number: 10, title: "Chapter 10: Motion" },
  //       { number: 11, title: "Chapter 11: Force and Laws of Motion" },
  //       { number: 12, title: "Chapter 12: Gravitation" },
  //       { number: 13, title: "Chapter 13: Work and Energy" },
  //       { number: 14, title: "Chapter 14: Sound" },
  //       { number: 15, title: "Chapter 15: Why Do We Fall Ill?" },
  //       { number: 16, title: "Chapter 16: Natural Resources" },
  //       { number: 17, title: "Chapter 17: Improvement in Food Resources" }
  //     ],
  //     History: [
  //       { number: 1, title: "Chapter 1: The French Revolution" },
  //       { number: 2, title: "Chapter 2: Socialism in Europe and the Russian Revolution" },
  //       { number: 3, title: "Chapter 3: Nazism and the Rise of Hitler" },
  //       { number: 4, title: "Chapter 4: Forest Society and Colonialism" },
  //       { number: 5, title: "Chapter 5: Pastoralists in the Modern World" }
  //     ],
  //     Geography: [
  //       { number: 1, title: "Chapter 1: India– Size and Location" },
  //       { number: 2, title: "Chapter 2: Physical Features of India" },
  //       { number: 3, title: "Chapter 3: Drainage" },
  //       { number: 4, title: "Chapter 4: Climate" },
  //       { number: 5, title: "Chapter 5: Natural Vegetation and Wildlife" },
  //       { number: 6, title: "Chapter 6: Population" }
  //     ],
  //     Civics: [
  //       { number: 1, title: "Chapter 1: What is Democracy? Why Democracy?" },
  //       { number: 2, title: "Chapter 2: Constitutional Design" },
  //       { number: 3, title: "Chapter 3: Electoral Politics" },
  //       { number: 4, title: "Chapter 4: Working of Institutions" },
  //       { number: 5, title: "Chapter 5: Democratic Rights" }
  //     ],
  //     Economics: [
  //       { number: 1, title: "Chapter 1: The Story of Village Palampur" },
  //       { number: 2, title: "Chapter 2: People as Resource" },
  //       { number: 3, title: "Chapter 3: Poverty as a Challenge" },
  //       { number: 4, title: "Chapter 4: Food Security in India" }
  //     ]
  //   },
  //   '10': {
  //     Computer: [
  //       { number: 1, title: "Chapter 1: Computer Fundamentals" },
  //       { number: 2, title: "Chapter 2: Advanced GIMP (GNU Image Manipulation Program)" },
  //       { number: 3, title: "Chapter 3: Tables (HTML)" },
  //       { number: 4, title: "Chapter 4: Forms (HTML)" },
  //       { number: 5, title: "Chapter 5: DHTML & CSS" }
  //     ],
  //     English: [
  //       { number: 1, title: "Unit1: First Flight – Prose" },
  //       { number: 2, title: "Unit2: First Flight – Poems" },
  //       { number: 3, title: "Unit3: Footprints Without Feet – Supplementary" }
  //     ],
  //     Maths: [
  //       { number: 1, title: "Chapter 1: Number Systems" },
  //       { number: 2, title: "Chapter 2: Algebra" },
  //       { number: 3, title: "Chapter 3: Coordinate Geometry" },
  //       { number: 4, title: "Chapter 4: Geometry" },
  //       { number: 5, title: "Chapter 5: Trigonometry" },
  //       { number: 6, title: "Chapter 6: Mensuration" },
  //       { number: 7, title: "Chapter 7: Statistics and Probability" }
  //     ],
  //     Science: [
  //       { number: 1, title: "Chapter 1: Chemical Reactions and Equations" },
  //       { number: 2, title: "Chapter 2: Acids, Bases, and Salts" },
  //       { number: 3, title: "Chapter 3: Metals and Non-Metals" },
  //       { number: 4, title: "Chapter 4: Carbon and Its Compounds" },
  //       { number: 5, title: "Chapter 5: Periodic Classification of Elements" },
  //       { number: 6, title: "Chapter 6: Life Processes" },
  //       { number: 7, title: "Chapter 7: Control and Coordination" },
  //       { number: 8, title: "Chapter 8: How do Organisms Reproduce?" },
  //       { number: 9, title: "Chapter 9: Heredity and Evolution" },
  //       { number: 10, title: "Chapter 10: Light – Reflection and Refraction" },
  //       { number: 11, title: "Chapter 11: Human Eye and Colourful World" },
  //       { number: 12, title: "Chapter 12: Electricity" },
  //       { number: 13, title: "Chapter 13: Magnetic Effects of Electric Current" },
  //       { number: 14, title: "Chapter 14: Sources of Energy" },
  //       { number: 15, title: "Chapter 15: Our Environment" },
  //       { number: 16, title: "Chapter 16: Sustainable Management of Natural Resources" }
  //     ],
  //     History: [
  //       { number: 1, title: "Chapter 1: The Rise of Nationalism in Europe" },
  //       { number: 2, title: "Chapter 2: Nationalism in India" },
  //       { number: 3, title: "Chapter 3: The Making of a Global World" },
  //       { number: 4, title: "Chapter 4: The Age of Industrialisation" },
  //       { number: 5, title: "Chapter 5: Print Culture and the Modern World" }
  //     ],
  //     Geography: [
  //       { number: 1, title: "Chapter 1: Resources and Development" },
  //       { number: 2, title: "Chapter 2: Forest and Wildlife Resources" },
  //       { number: 3, title: "Chapter 3: Water Resources" },
  //       { number: 4, title: "Chapter 4: Agriculture" },
  //       { number: 5, title: "Chapter 5: Minerals and Energy Resources" },
  //       { number: 6, title: "Chapter 6: Manufacturing Industries" },
  //       { number: 7, title: "Chapter 7: Lifelines of National Economy" }
  //     ],
  //     Civics: [
  //       { number: 1, title: "Chapter 1: Power Sharing" },
  //       { number: 2, title: "Chapter 2: Federalism" },
  //       { number: 3, title: "Chapter 3: Gender, Religion and Caste" },
  //       { number: 4, title: "Chapter 4: Political Parties" },
  //       { number: 5, title: "Chapter 5: Outcomes of Democracy" }
  //     ],
  //     Economics: [
  //       { number: 1, title: "Chapter 1: Development" },
  //       { number: 2, title: "Chapter 2: Sectors of the Indian Economy" },
  //       { number: 3, title: "Chapter 3: Money and Credit" },
  //       { number: 4, title: "Chapter 4: Globalisation and the Indian Economy" },
  //       { number: 5, title: "Chapter 5: Consumer Rights" }
  //     ]
  //   },
  // };

  // const subtopics = {
  //   '7': {
  //     Computer: {
  //       1: [
  //         "What is a programming language?",
  //         "Low-level vs High-level languages",
  //         "Examples and real-world uses",
  //         "Introduction to programming logic and pseudocode"
  //       ],
  //       2: [
  //         "Creating, saving, and opening documents",
  //         "Text formatting: fonts, sizes, colors, bold, italics",
  //         "Paragraph alignment, bullets, numbering",
  //         "Inserting images, tables, and hyperlinks"
  //       ],
  //       3: [
  //         "Creating slides and using slide layouts",
  //         "Adding and editing text and images",
  //         "Applying themes and transitions",
  //         "Running a slideshow"
  //       ],
  //       4: [
  //         "Entering and formatting data in cells",
  //         "Basic formulas (SUM, AVERAGE)",
  //         "Creating charts from data",
  //         "Sorting and filtering data"
  //       ],
  //       5: [
  //         "Understanding databases and tables",
  //         "Creating a simple database",
  //         "Adding, editing, and searching records",
  //         "Basic queries"
  //       ]
  //     },
  //     English: {
  //       1: [
  //         "The Day the River Spoke: Sentence completion, onomatopoeia, fill-in-the-blanks, prepositions",
  //         "Try Again: Phrases, metaphor, simile",
  //         "Three Days to See: Modal verbs, descriptive paragraph writing"
  //       ],
  //       2: [
  //         "Animals, Birds, and Dr. Dolittle: Compound words, palindrome, present perfect tense, notice writing",
  //         "A Funny Man: Phrasal verbs, adverbs, prepositions",
  //         "Say the Right Thing: Suffixes, verb forms, tenses, kinds of sentences"
  //       ],
  //       3: [
  //         "My Brother's Great Invention: Onomatopoeia, binomials, phrasal verbs, idioms, simple past and past perfect tense",
  //         "Paper Boats: Antonyms, diary entry writing",
  //         "North, South, East, West: Associate words with meanings, subject-verb agreement, letter format (leave application)"
  //       ],
  //       4: [
  //         "The Tunnel: Phrases, onomatopoeia, punctuation, descriptive paragraph writing",
  //         "Travel: Onomatopoeia",
  //         "Conquering the Summit: Phrases, parts of speech, articles, formal letter writing"
  //       ],
  //       5: [
  //         "A Homage to Our Brave Soldiers: Prefix and root words, main clause, subordinate clause, subordinating conjunctions",
  //         "My Dear Soldiers: Collocations",
  //         "Rani Abbakka: Fill-in-the-blanks, speech (direct & indirect)"
  //       ]
  //     },
  //     Maths: {
  //       1: [
  //         "Properties of addition and subtraction of integers",
  //         "Multiplication of integers",
  //         "Properties of multiplication of integers",
  //         "Division of integers",
  //         "Properties of division of integers"
  //       ],
  //       2: [
  //         "Multiplication of fractions",
  //         "Division of fractions",
  //         "Multiplication of decimal numbers",
  //         "Division of decimal numbers"
  //       ],
  //       3: [
  //         "Representative values",
  //         "Arithmetic mean",
  //         "Mode",
  //         "Median",
  //         "Bar graphs and their uses"
  //       ],
  //       4: [
  //         "Introduction to simple equations",
  //         "Setting up equations",
  //         "Solving equations",
  //         "Practical applications of equations"
  //       ],
  //       5: [
  //         "Introduction to lines and angles",
  //         "Related angles",
  //         "Pairs of lines",
  //         "Checking for parallel lines"
  //       ],
  //       6: [
  //         "Medians and altitudes of a triangle",
  //         "Exterior angle and its property",
  //         "Angle sum property of a triangle",
  //         "Special triangles: equilateral and isosceles",
  //         "Right-angled triangles and Pythagoras' theorem"
  //       ],
  //       7: [
  //         "Percentage and applications",
  //         "Price calculations (buying/selling)",
  //         "Simple interest"
  //       ],
  //       8: [
  //         "Introduction to rational numbers",
  //         "Positive and negative rational numbers",
  //         "Rational numbers on the number line",
  //         "Comparison of rational numbers",
  //         "Operations on rational numbers"
  //       ],
  //       9: [
  //         "Area of parallelogram",
  //         "Area of triangles",
  //         "Circumference and area of circles"
  //       ],
  //       10: [
  //         "Introduction to algebraic expressions",
  //         "Terms and coefficients",
  //         "Monomials, binomials, trinomials, polynomials",
  //         "Like and unlike terms",
  //         "Finding the value of an expression"
  //       ],
  //       11: [
  //         "Introduction to exponents",
  //         "Laws of exponents",
  //         "Decimal number system",
  //         "Expressing large numbers in standard form"
  //       ],
  //       12: [
  //         "Lines of symmetry for polygons",
  //         "Rotational symmetry",
  //         "Difference between line symmetry and rotational symmetry"
  //       ],
  //       13: [
  //         "Plane figures vs solid shapes",
  //         "Faces, edges, vertices of 3D shapes",
  //         "Visualising solid shapes from different perspectives"
  //       ]
  //     },
  //     Science: {
  //       1: ["Photosynthesis", "Autotrophic, Heterotrophic, Saprotrophic nutrition", "Structure of leaves"],
  //       2: ["Human digestive system", "Nutrition in different animals", "Feeding habits"],
  //       3: ["Natural fibres: Cotton, Wool, Silk", "Processing of fibres", "Spinning, Weaving, Knitting"],
  //       4: ["Hot and cold objects", "Measuring temperature", "Laboratory thermometer", "Heat transfer", "Clothing in different seasons"],
  //       5: ["Acid and base indicators", "Natural indicators", "Neutralisation in daily life"],
  //       6: ["Physical vs chemical changes", "Examples of changes", "Rusting and prevention", "Crystallisation"],
  //       7: ["Weather vs climate", "Climate adaptation", "Effect of climate on organisms", "Polar regions and rainforests"],
  //       8: ["Air pressure", "Expansion on heating", "Wind currents", "Thunderstorms and cyclones"],
  //       9: ["Soil profile and types", "Soil properties", "Soil and crops"],
  //       10: ["Respiration types: aerobic and anaerobic", "Breathing in animals and humans", "Breathing cycle and rate"],
  //       11: ["Circulatory system", "Excretion in animals", "Transport in plants", "Transpiration"],
  //       12: ["Asexual and sexual reproduction", "Vegetative propagation", "Pollination and fertilisation", "Seed dispersal"],
  //       13: ["Speed and motion", "Time measurement", "Simple pendulum", "Distance-time graph"],
  //       14: ["Electric components and symbols", "Heating and magnetic effects of current", "Electromagnets and uses"],
  //       15: ["Reflection, refraction, dispersion", "Plane and spherical mirrors", "Lens types and uses"],
  //       16: ["Water availability and forms", "Groundwater", "Water table and management", "Conservation methods"],
  //       17: ["Importance of forests", "Plant-animal interdependence", "Deforestation and conservation"]
  //     },
  //     History: {
  //       1: ["Maps and history", "Historical terminology", "Historians and sources", "Social and political groups", "Regions and empires"],
  //       2: ["Emergence of new dynasties", "Administration in kingdoms", "Warfare for wealth and power", "Prashastis and land grants"],
  //       3: ["Delhi Sultans political expansion", "Administration and consolidation", "Mosques and cities", "Case studies: Raziya Sultan, Muhammad Tughlaq"],
  //       4: ["Mughal Empire establishment and expansion", "Akbar's policies and Mansabdari system", "Jahangir, Shah Jahan, Aurangzeb", "Relations with other rulers"],
  //       5: ["Tribal societies", "Nomadic pastoralists", "Caste-based communities", "Interaction between nomads and settled societies"],
  //       6: ["Bhakti movement and saints", "Sufi traditions", "New regional religious developments"],
  //       7: ["Language, literature, and regional identity", "Regional art, dance, and music", "Temple architecture traditions"],
  //       8: ["Decline of Mughal Empire", "New independent kingdoms", "Marathas, Sikhs, Jats, Rajputs", "Regional state administration"]
  //     },
  //     Civics: {
  //       1: ["Equality in democracy", "Inequality issues: caste, religion, gender, economic", "Government efforts for equality"],
  //       2: ["Public vs private health services", "Importance of healthcare", "Inequality in access", "Case studies"],
  //       3: ["Governor and Chief Minister roles", "State legislature functioning", "Role of MLAs", "State government case study"],
  //       4: ["Gender roles in society", "Stereotypes for boys and girls", "Experiences of growing up", "Equality for women"],
  //       5: ["Women in education and work", "Struggles for equality", "Women achiever case studies", "Laws for women's rights"],
  //       6: ["Role of media in democracy", "Influence and bias in media", "Need for independent media"],
  //       7: ["Markets, shops, malls", "Chain of markets", "Role of money and middlemen", "Impact on farmers and traders"],
  //       8: ["Production and distribution", "Globalisation and trade", "Role of traders, exporters, workers", "Consumer awareness"]
  //     },
  //     Geography: {
  //       1: ["Components of environment", "Ecosystem", "Environmental balance"],
  //       2: ["Earth layers: crust, mantle, core", "Rock types", "Rock cycle", "Minerals and uses"],
  //       3: ["Lithosphere movements: earthquakes, volcanoes", "Landforms: mountains, plateaus, plains", "Work of rivers, wind, glaciers, waves"],
  //       4: ["Atmosphere composition and structure", "Weather and climate", "Temperature and pressure distribution", "Wind and moisture"],
  //       5: ["Water distribution", "Water cycle", "Oceans: waves, tides, currents", "Importance of water"],
  //       6: ["Amazon basin (equatorial)", "Ganga-Brahmaputra basin (subtropical)", "Life of people in these regions"],
  //       7: ["Hot deserts (Sahara)", "Cold deserts (Ladakh)", "Adaptations of people and animals", "Economic activities in deserts"]
  //     }
  //   },
  //   '8': {
  //     Computer: {
  //       1: [
  //         "Introduction to errors and exceptions",
  //         "Types of errors: Syntax errors, Runtime errors (exceptions), Logical errors",
  //         "Built-in exceptions (ZeroDivisionError, ValueError, etc.)",
  //         "Using try–except block",
  //         "try–except–else–finally structure",
  //         "Raising exceptions using raise",
  //         "Real-life examples of exception handling (division by zero, invalid input)"
  //       ],
  //       2: [
  //         "Introduction to file handling",
  //         "Types of files: Text files, Binary files",
  //         "Opening and closing files (open(), close())",
  //         "File modes (r, w, a, r+)",
  //         "Reading from a file (read(), readline(), readlines())",
  //         "Writing to a file (write(), writelines())",
  //         "File pointer and cursor movement (seek(), tell())",
  //         "Practical applications: saving student records, logs, etc."
  //       ],
  //       3: [
  //         "Introduction to stack",
  //         "LIFO principle (Last In First Out)",
  //         "Stack operations: Push, Pop, Peek/Top",
  //         "Stack implementation using list in Python or modules (collections.deque)",
  //         "Applications: Undo operation in editors, Function call management"
  //       ],
  //       4: [
  //         "Introduction to queue",
  //         "FIFO principle (First In First Out)",
  //         "Queue operations: Enqueue, Dequeue",
  //         "Types of queues: Simple, Circular, Deque, Priority",
  //         "Implementation in Python using lists or queue module",
  //         "Applications: Printer task scheduling, Customer service systems"
  //       ],
  //       5: [
  //         "Importance of sorting in data organization",
  //         "Basic sorting techniques: Bubble Sort, Selection Sort, Insertion Sort",
  //         "Advanced sorting (introductory): Merge Sort, Quick Sort",
  //         "Sorting in Python using built-in methods: sorted() function"
  //       ]
  //     },
  //     English: {
  //       1: [
  //         "The Best Christmas Present in the World: Narrative comprehension, vocabulary",
  //         "The Tsunami: Disaster narrative, sequencing events",
  //         "Glimpses of the Past: Historical narrative, chronology",
  //         "Bepin Choudhury's Lapse of Memory: Character sketch, irony",
  //         "The Summit Within: Motivation, descriptive writing",
  //         "This is Jody's Fawn: Empathy, moral choice",
  //         "A Visit to Cambridge: Biographical narrative",
  //         "A Short Monsoon Diary: Diary entry style",
  //         "The Great Stone Face – I: Description, prediction",
  //         "The Great Stone Face – II: Conclusion, moral lesson"
  //       ],
  //       2: [
  //         "The Ant and the Cricket: Moral fable, rhyme scheme",
  //         "Geography Lesson: Imagery, meaning",
  //         "Macavity: The Mystery Cat: Humour, personification",
  //         "The Last Bargain: Metaphor, symbolism",
  //         "The School Boy: Theme of education, freedom",
  //         "The Duck and the Kangaroo: Rhyme, humour",
  //         "When I set out for Lyonnesse: Imagination, rhyme",
  //         "On the Grasshopper and Cricket: Nature imagery"
  //       ],
  //       3: [
  //         "How the Camel Got His Hump: Fable, character traits",
  //         "Children at Work: Social issue, empathy",
  //         "The Selfish Giant: Allegory, moral theme",
  //         "The Treasure Within: Education, individuality",
  //         "Princess September: Freedom, symbolism",
  //         "The Fight: Conflict resolution",
  //         "The Open Window: Humour, irony",
  //         "Jalebis: Humour, moral lesson",
  //         "The Comet – I: Science fiction, prediction",
  //         "The Comet – II: Resolution, conclusion"
  //       ]
  //     },
  //     Maths: {
  //       1: ["Introduction", "Properties of Rational Numbers", "Representation of Rational Numbers on the Number Line", "Rational Number between Two Rational Numbers", "Word Problems"],
  //       2: ["Introduction", "Solving Equations which have Linear Expressions on one Side and Numbers on the other Side", "Some Applications", "Solving Equations having the Variable on both sides", "Some More Applications", "Reducing Equations to Simpler Form", "Equations Reducible to the Linear Form"],
  //       3: ["Introduction", "Polygons", "Sum of the Measures of the Exterior Angles of a Polygon", "Kinds of Quadrilaterals", "Some Special Parallelograms"],
  //       4: ["Looking for Information", "Organising Data", "Grouping Data", "Circle Graph or Pie Chart", "Chance and Probability"],
  //       5: ["Introduction", "Properties of Square Numbers", "Some More Interesting Patterns", "Finding the Square of a Number", "Square Roots", "Square Roots of Decimals", "Estimating Square Root"],
  //       6: ["Introduction", "Cubes", "Cubes Roots"],
  //       7: ["Recalling Ratios and Percentages", "Finding the Increase and Decrease Percent", "Finding Discounts", "Prices Related to Buying and Selling (Profit and Loss)", "Sales Tax/Value Added Tax/Goods and Services Tax", "Compound Interest", "Deducing a Formula for Compound Interest", "Rate Compounded Annually or Half Yearly (Semi Annually)", "Applications of Compound Interest Formula"],
  //       8: ["What are Expressions?", "Terms, Factors and Coefficients", "Monomials, Binomials and Polynomials", "Like and Unlike Terms", "Addition and Subtraction of Algebraic Expressions", "Multiplication of Algebraic Expressions: Introduction", "Multiplying a Monomial by a Monomial", "Multiplying a Monomial by a Polynomial", "Multiplying a Polynomial by a Polynomial", "What is an Identity?", "Standard Identities", "Applying Identities"],
  //       9: ["Introduction", "Let us Recall", "Area of Trapezium", "Area of General Quadrilateral", "Area of Polygons", "Solid Shapes", "Surface Area of Cube, Cuboid and Cylinder", "Volume of Cube, Cuboid and Cylinder", "Volume and Capacity"],
  //       10: ["Introduction", "Powers with Negative Exponents", "Laws of Exponents", "Use of Exponents to Express Small Numbers in Standard Form"],
  //       11: ["Introduction", "Direct Proportion", "Inverse Proportion"],
  //       12: ["Introduction", "What is Factorisation?", "Division of Algebraic Expressions", "Division of Algebraic Expressions Continued (Polynomial / Polynomial)", "Can you Find the Error?"],
  //       13: ["Introduction", "Linear Graphs", "Some Applications"]
  //     },
  //     Science: {
  //       1: ["Agriculture practices", "Crop production techniques", "Storage and preservation"],
  //       2: ["Bacteria, viruses, fungi", "Useful microbes", "Harmful microbes and diseases"],
  //       3: ["Types of synthetic fibres", "Characteristics and uses", "Plastics: Thermoplastics, Thermosetting"],
  //       4: ["Physical and chemical properties", "Reactivity series", "Uses of metals and non-metals"],
  //       5: ["Fossil fuels", "Refining petroleum", "Uses of coal and petroleum"],
  //       6: ["Types of combustion", "Structure of flame", "Fire safety"],
  //       7: ["Biodiversity", "Endangered species", "Wildlife conservation"],
  //       8: ["Plant and animal cell", "Cell organelles", "Cell division"],
  //       9: ["Modes of reproduction", "Human reproductive system", "Fertilization and development"],
  //       10: ["Types of forces", "Pressure in solids, liquids, and gases", "Applications"],
  //       11: ["Advantages and disadvantages", "Reducing friction"],
  //       12: ["Production and propagation", "Characteristics of sound", "Human ear"],
  //       13: ["Electrolysis", "Applications in daily life"],
  //       14: ["Lightning, Earthquakes, and Safety measures"],
  //       15: ["Reflection, refraction, dispersion", "Human eye and defects"],
  //       16: ["Solar system structure", "Planets, moons, comets, and meteors"],
  //       17: ["Causes and effects", "Control measures"]
  //     },
  //     History: {
  //       1: ["How do we periodise history?", "Importance of dates and events", "Sources for studying modern history", "Official records of the British administration"],
  //       2: ["East India Company comes to India", "Establishment of trade centres", "Battle of Plassey and Buxar", "Expansion of British power in India", "Subsidiary alliance and doctrine of lapse"],
  //       3: ["The revenue system under British rule", "Permanent Settlement, Ryotwari and Mahalwari systems", "Effects of British land revenue policies", "Role of indigo cultivation and indigo revolt"],
  //       4: ["Tribal societies and their livelihoods", "Impact of British policies on tribal life", "Tribal revolts and resistance", "Birsa Munda and his movement"],
  //       5: ["Causes of the revolt of 1857", "Important centres of the revolt", "Leaders and their roles", "Suppression of the revolt", "Consequences and significance"],
  //       6: ["The British view on education in India", "Orientalist vs Anglicist debate", "Macaulay's Minute on Education", "Wood's Despatch", "Growth of national education system"],
  //       7: ["Social reform movements in the 19th century", "Reformers and their contributions (Raja Ram Mohan Roy, Ishwar Chandra Vidyasagar, Jyotiba Phule, etc.)", "Movements against caste discrimination", "Role of women in reform and education"],
  //       8: ["Rise of nationalism in India", "Formation of Indian National Congress", "Moderates, extremists, and their methods", "Partition of Bengal, Swadeshi and Boycott", "Gandhian era movements (Non-Cooperation, Civil Disobedience, Quit India)", "Role of revolutionaries and other leaders", "Towards Independence and Partition"]
  //     },
  //     Civics: {
  //       1: ["Importance and features of the Constitution", "Fundamental Rights and Duties", "Directive Principles of State Policy", "Role of the Constitution in democracy"],
  //       2: ["Meaning of secularism", "Secularism in India", "Importance of religious tolerance", "Role of the State in maintaining secularism"],
  //       3: ["Why do we need a Parliament?", "Two Houses of Parliament (Lok Sabha, Rajya Sabha)", "Law-making process in Parliament", "Role of the President in legislation"],
  //       4: ["Structure of the Indian judiciary", "Independence of the judiciary", "Judicial review and judicial activism", "Public Interest Litigation (PIL)"],
  //       5: ["Concept of marginalisation", "Marginalised groups in India (Adivasis, Dalits, Minorities)", "Issues faced by marginalised communities"],
  //       6: ["Safeguards in the Constitution for marginalised groups", "Laws protecting marginalised communities", "Role of social reformers and activists"],
  //       7: ["Importance of public facilities (water, healthcare, education, transport)", "Role of the government in providing facilities", "Issues of inequality in access to facilities"],
  //       8: ["Need for laws to ensure social justice", "Workers' rights and protection laws", "Child labour and related legislation", "Role of government in ensuring justice"]
  //     },
  //     Geography: {
  //       1: ["Types of resources (natural, human-made, human)", "Classification: renewable, non-renewable, ubiquitous, localized", "Resource conservation and sustainable development"],
  //       2: ["Land use and land degradation", "Soil types and soil conservation", "Water resources and conservation methods", "Natural vegetation types and importance", "Wildlife resources and conservation"],
  //       3: ["Types of farming (subsistence, intensive, commercial, plantation)", "Major crops (rice, wheat, cotton, sugarcane, tea, coffee, etc.)", "Agricultural development in different countries", "Impact of technology on agriculture"],
  //       4: ["Types of industries (raw material-based, size-based, ownership-based)", "Factors affecting location of industries", "Major industrial regions of the world", "Case studies: IT industry (Bangalore), Cotton textile industry (Ahmedabad/Osaka)"],
  //       5: ["Population distribution and density", "Factors influencing population distribution", "Population change (birth rate, death rate, migration)", "Population pyramid", "Importance of human resources for development"]
  //     }
  //   },
  //   '9': {
  //     Computer: {
  //       1: [
  //         "Introduction to computer system",
  //         "Components: Input devices, Output devices, Storage devices, CPU",
  //         "Memory types: Primary, Secondary, Cache",
  //         "Number system basics: binary, decimal, conversion",
  //         "Difference between hardware, software, firmware"
  //       ],
  //       2: [
  //         "What is software?",
  //         "Categories: System software, Utility software, Application software, Programming software",
  //         "Open-source vs Proprietary",
  //         "Freeware, Shareware, Licensed software"
  //       ],
  //       3: [
  //         "Definition and importance of OS",
  //         "Functions: Process management, Memory management, File management, Device management",
  //         "User interface (CLI vs GUI)",
  //         "Types: Batch, Time-sharing, Real-time, Distributed",
  //         "Popular examples: Windows, Linux, Android"
  //       ],
  //       4: [
  //         "Introduction to Python & its features",
  //         "Writing and running Python programs",
  //         "Variables, data types, operators",
  //         "Control structures: if, if-else, elif; loops: for, while",
  //         "Functions (introductory)"
  //       ],
  //       5: [
  //         "What is cyber security?",
  //         "Types of cyber threats: Malware, Viruses, Worms, Phishing, Ransomware, Spyware, Trojans",
  //         "Cyber safety measures: Strong passwords, 2FA, Firewalls, antivirus, backups",
  //         "Cyber ethics and responsible digital behavior",
  //         "Awareness of cyber laws (basic introduction to IT Act in India)"
  //       ]
  //     },
  //     English: {
  //       1: [
  //         "The Fun They Had: Futuristic setting, comprehension",
  //         "The Sound of Music: Inspiration, biography",
  //         "The Little Girl: Family relationships",
  //         "A Truly Beautiful Mind: Biography, Albert Einstein",
  //         "The Snake and the Mirror: Irony, humour",
  //         "My Childhood: Autobiography, Dr. A.P.J. Abdul Kalam",
  //         "Reach for the Top: Inspiration, character sketch",
  //         "Kathmandu: Travelogue",
  //         "If I Were You: Play, dialogue comprehension"
  //       ],
  //       2: [
  //         "The Road Not Taken: Choices, symbolism",
  //         "Wind: Nature, strength",
  //         "Rain on the Roof: Imagery, childhood memories",
  //         "The Lake Isle of Innisfree: Peace, nature imagery",
  //         "A Legend of the Northland: Ballad, moral",
  //         "No Men Are Foreign: Universal brotherhood",
  //         "On Killing a Tree: Nature, destruction",
  //         "A Slumber Did My Spirit Seal: Theme of death, imagery"
  //       ],
  //       3: [
  //         "The Lost Child: Childhood, emotions",
  //         "The Adventures of Toto: Humour, pet story",
  //         "Iswaran the Storyteller: Imaginative storytelling",
  //         "In the Kingdom of Fools: Folk tale, humour",
  //         "The Happy Prince: Allegory, sacrifice",
  //         "The Last Leaf: Hope, sacrifice",
  //         "A House is Not a Home: Autobiographical, resilience",
  //         "The Beggar: Compassion, transformation"
  //       ]
  //     },
  //     Maths: {
  //       1: ["Real Numbers"],
  //       2: ["Polynomials", "Linear Equations in Two Variables"],
  //       3: ["Coordinate Geometry"],
  //       4: ["Introduction to Euclid's Geometry", "Lines and Angles", "Triangles", "Quadrilaterals", "Circles"],
  //       5: ["Areas", "Surface Areas and Volumes"],
  //       6: ["Statistics"]
  //     },
  //     Science: {
  //       1: ["States of matter", "Properties of solids, liquids, and gases", "Changes of state"],
  //       2: ["Mixtures, solutions, alloys", "Separation techniques"],
  //       3: ["Laws of chemical combination", "Atomic and molecular masses", "Mole concept"],
  //       4: ["Discovery of electron, proton, neutron", "Atomic models"],
  //       5: ["Cell structure", "Cell organelles", "Cell functions"],
  //       6: ["Plant tissues", "Animal tissues"],
  //       7: ["Classification of organisms", "Kingdom Monera, Protista, Fungi"],
  //       8: ["Plant kingdom", "Angiosperms, Gymnosperms"],
  //       9: ["Animal kingdom", "Classification of animals"],
  //       10: ["Distance, displacement, speed, velocity", "Acceleration, uniform and non-uniform motion"],
  //       11: ["Newton's laws", "Momentum, force, and inertia"],
  //       12: ["Universal law of gravitation", "Acceleration due to gravity", "Free fall"],
  //       13: ["Work done", "Kinetic and potential energy", "Power"],
  //       14: ["Propagation of sound", "Characteristics", "Echo"],
  //       15: ["Health and diseases", "Pathogens", "Immunity and vaccination"],
  //       16: ["Air, water, soil, forests, minerals", "Conservation"],
  //       17: ["Crop varieties", "Animal husbandry", "Food processing"]
  //     },
  //     History: {
  //       1: [
  //         "French society in the late 18th century",
  //         "The outbreak of the Revolution",
  //         "France becomes a constitutional monarchy",
  //         "The Reign of Terror",
  //         "The rise of Napoleon",
  //         "Impact of the Revolution on France and the world"
  //       ],
  //       2: [
  //         "Age of social change in Europe",
  //         "The Russian Empire in 1914",
  //         "The February Revolution",
  //         "The October Revolution and Bolsheviks in power",
  //         "Stalinism and collectivisation",
  //         "Industrial society and social change",
  //         "Global influence of the Russian Revolution"
  //       ],
  //       3: [
  //         "Birth of the Weimar Republic",
  //         "Hitler's rise to power",
  //         "Nazi ideology and propaganda",
  //         "Establishment of a Nazi state",
  //         "Role of youth in Nazi Germany",
  //         "Racial policies and Holocaust",
  //         "Crimes against humanity"
  //       ],
  //       4: [
  //         "Deforestation under colonial rule",
  //         "Rise of commercial forestry",
  //         "Rebellions in forests (Bastar, Java)",
  //         "Impact on local communities"
  //       ],
  //       5: [
  //         "Pastoralism as a way of life",
  //         "Colonial impact on pastoral communities",
  //         "Case studies– Maasai (Africa), Raikas (India)",
  //         "Pastoralism in modern times"
  //       ]
  //     },
  //     Geography: {
  //       1: ["Location and extent of India", "India and its neighbours", "Significance of India's location"],
  //       2: ["Formation of physiographic divisions", "Himalayas", "Northern Plains", "Peninsular Plateau", "Indian Desert", "Coastal Plains", "Islands"],
  //       3: ["Himalayan river systems", "Peninsular river systems", "Role and importance of rivers", "Lakes in India", "River pollution and conservation"],
  //       4: ["Factors influencing climate", "Monsoon mechanism", "Seasons in India", "Rainfall distribution", "Monsoon as a unifying bond"],
  //       5: ["Types of vegetation in India", "Distribution of forests", "Wildlife species", "Conservation of forests and wildlife"],
  //       6: ["Size and distribution of population", "Population growth and processes (birth, death, migration)", "Age composition", "Sex ratio", "Literacy rate", "Population as an asset vs liability"]
  //     },
  //     Civics: {
  //       1: ["Meaning of democracy", "Main features of democracy", "Arguments for and against democracy", "Broader meaning of democracy"],
  //       2: ["Democratic Constitution in South Africa", "Why a Constitution is needed", "Making of the Indian Constitution", "Guiding values of the Constitution"],
  //       3: ["Why elections are needed", "Indian election system", "Free and fair elections", "Role of the Election Commission"],
  //       4: ["Parliament and its role", "The Executive– President, Prime Minister, Council of Ministers", "Lok Sabha and Rajya Sabha", "The Judiciary", "Decision-making process in democracy"],
  //       5: ["Importance of rights in democracy", "Fundamental Rights in the Indian Constitution", "Right to Equality, Freedom, Religion, Education, Remedies", "Rights in practice– case studies"]
  //     },
  //     Economics: {
  //       1: ["Farming and non-farming activities", "Factors of production (land, labour, capital, entrepreneurship)", "Organisation of production"],
  //       2: ["People as an asset vs liability", "Role of education in human capital formation", "Role of health in human capital", "Unemployment and its types", "Role of women and children in the economy"],
  //       3: ["Two typical cases of poverty", "Poverty trends in India", "Causes of poverty", "Anti-poverty measures and programmes"],
  //       4: ["Meaning and need for food security", "Dimensions of food security", "Public Distribution System (PDS)", "Role of cooperatives and government programmes"]
  //     }
  //   },
  //   '10': {
  //     Computer: {
  //       1: ["Introduction to Computer Systems",
  //           "Number systems: binary, decimal, octal, hexadecimal",
  //           "Logic gates: AND, OR, NOT (truth tables)",
  //           "Computer hardware components: input, output, storage, CPU",
  //           "Types of memory: primary, secondary, cache, virtual memory",
  //           "Software overview: System, Application, Utilities",
  //           "Computer networks: LAN, MAN, WAN, Internet, intranet, extranet",
  //           "Data transmission: wired vs wireless",
  //           "Cloud computing basics",
  //           "Emerging technologies: AI, IoT, Big Data (introductory)"],
  //       2: ["Introduction to GIMP interface",
  //           "Layers and layer management",
  //           "Image editing tools: crop, scale, rotate, flip, perspective",
  //           "Color tools: brightness/contrast, hue/saturation, levels, curves",
  //           "Selection tools: free select, fuzzy select, paths",
  //           "Using filters and effects",
  //           "Working with text in GIMP",
  //           "Creating banners, posters, digital artwork",
  //           "Exporting images in different formats"],
  //       3: ["Introduction to HTML tables",
  //           "Table structure: <table>, <tr>, <td>, <th>",
  //           "Attributes: border, cellpadding, cellspacing, align, width, height",
  //           "Rowspan and Colspan",
  //           "Adding captions, Nested tables",
  //           "Styling tables with CSS"],
  //       4: ["Introduction to forms",
  //           "Form elements: Textbox, Password, Radio buttons, Checkboxes, Dropdown, Text area, Buttons",
  //           "Attributes: name, value, placeholder, required",
  //           "Form validation (basic HTML5)",
  //           "Form action and method (GET, POST)",
  //           "Simple login/registration forms"],
  //       5: ["Dynamic HTML: HTML + CSS + JavaScript",
  //           "Role of JavaScript in interactive pages",
  //           "Examples: rollover images, dynamic content updates",
  //           "CSS types: Inline, Internal, External",
  //           "CSS syntax: selectors, properties, values",
  //           "Styling text, backgrounds, borders, box model",
  //           "Positioning: static, relative, absolute, fixed",
  //           "Pseudo classes: :hover, :active, :first-child",
  //           "CSS for tables and forms"]
  //     },
  //     English: {
  //       1: ["A Letter to God: Faith, irony",
  //           "Nelson Mandela: Long Walk to Freedom: Biography, freedom struggle",
  //           "From the Diary of Anne Frank: Diary, war, resilience",
  //           "Glimpses of India: Travel, culture",
  //           "Madam Rides the Bus: Childhood curiosity",
  //           "The Sermon at Benares: Teachings of Buddha",
  //           "Mijbil the Otter: Pet story, humour",
  //           "The Proposal: One-act play, satire"],
  //       2: ["Dust of Snow: Symbolism, nature",
  //           "Fire and Ice: Symbolism, theme of destruction",
  //           "The Ball Poem: Childhood loss, learning",
  //           "A Tiger in the Zoo: Freedom vs captivity",
  //           "How to Tell Wild Animals: Humour, description",
  //           "The Trees: Environment, imagery",
  //           "Fog: Metaphor, imagery",
  //           "The Tale of Custard the Dragon: Humour, rhyme",
  //           "For Anne Gregory: Beauty, inner vs outer"],
  //       3: ["A Triumph of Surgery: Pet story, care",
  //           "The Thief's Story: Trust, honesty",
  //           "The Midnight Visitor: Detective, suspense",
  //           "A Question of Trust: Irony, theft",
  //           "Footprints Without Feet: Science fiction, invisibility",
  //           "The Making of a Scientist: Biography, Richard Ebright",
  //           "The Necklace: Irony, fate",
  //           "Bholi: Education, empowerment",
  //           "The Book That Saved the Earth: Science fiction, humour"]
  //     },
  //     Maths: {
  //       1: ["Real Number"],
  //       2: ["Polynomials", "Pair of Linear Equations in Two Variables", "Quadratic Equations", "Arithmetic Progressions"],
  //       3: ["Coordinate Geometry"],
  //       4: ["Triangles", "Circles"],
  //       5: ["Introduction to Trigonometry", "Trigonometric Identities", "Heights and Distances"],
  //       6: ["Areas Related to Circles", "Surface Areas and Volumes"],
  //       7: ["Statistics", "Probability"]
  //     },
  //     Science: {
  //       1: ["Types of Chemical Reactions", "Writing and Balancing Chemical Equations", "Effects of Oxidation and Reduction", "Types of Oxidizing and Reducing Agents"],
  //       2: ["Properties of Acids and Bases", "pH Scale", "Uses of Acids and Bases"],
  //       3: ["Properties of Metals and Non-Metals", "Reactivity Series of Metals", "Occurrence and Extraction of Metals", "Corrosion of Metals", "Uses of Metals and Non-Metals"],
  //       4: ["Covalent Bonding", "Homologous Series", "Saturated and Unsaturated Compounds", "Functional Groups", "Important Carbon Compounds and Their Uses"],
  //       5: ["Mendeleev's Periodic Table", "Modern Periodic Table", "Properties of Elements in Groups", "Properties of Elements in Periods"],
  //       6: ["Nutrition", "Respiration", "Excretion"],
  //       7: ["Nervous System", "Hormones"],
  //       8: ["Modes of Reproduction", "Reproductive Health"],
  //       9: ["Mendel's Experiments", "Evolution Theories"],
  //       10: ["Mirror & Lens Formulas", "Applications"],
  //       11: ["Human Eye", "Colourful World"],
  //       12: ["Ohm's Law", "Series & Parallel Circuits"],
  //       13: ["Electromagnetism", "Applications"],
  //       14: ["Conventional Sources of Energy", "Non-Conventional Sources of Energy"],
  //       15: ["Ecosystem", "Ozone Layer"],
  //       16: ["Forest & Wildlife", "Water Management"]
  //     },
  //     History: {
  //       1: ["French Revolution and the idea of the nation", "The making of nationalism in Europe", "The age of revolutions: 1830–1848", "The making of Germany and Italy", "Visualising the nation– nationalism and imperialism"],
  //       2: ["First World War and nationalism in India", "The Non-Cooperation Movement", "Differing strands within the movement", "Civil Disobedience Movement", "The sense of collective belonging"],
  //       3: ["The pre-modern world", "The nineteenth century (1815–1914)", "The inter-war economy", "Rebuilding a world economy: post–1945"],
  //       4: ["Before the Industrial Revolution", "Hand labour and steam power", "Industrialisation in the colonies", "Factories come up", "The peculiarities of industrial growth", "Market for goods"],
  //       5: ["The first printed books", "Print comes to Europe", "The print revolution and its impact", "The reading mania", "The nineteenth century and print", "India and the world of print", "Religious reform and public debates", "New forms of publication and literature"]
  //     },
  //     Geography: {
  //       1: ["Types of resources– natural, human, sustainable", "Development of resources", "Resource planning in India", "Land resources and land use patterns", "Land degradation and conservation measures", "Soil as a resource– classification, distribution, conservation"],
  //       2: ["Flora and fauna in India", "Types and distribution of forests", "Depletion of forests and conservation", "Forest conservation movements (Chipko, Beej Bachao Andolan)", "Government initiatives– IUCN, Indian Wildlife Protection Act"],
  //       3: ["Water scarcity and its causes", "Multipurpose river projects and integrated water resources management", "Rainwater harvesting"],
  //       4: ["Types of farming", "Cropping patterns (Kharif, Rabi, Zaid)", "Major crops (rice, wheat, maize, pulses, oilseeds, sugarcane, cotton, jute)", "Technological and institutional reforms", "Contribution of agriculture to the national economy"],
  //       5: ["Types of minerals and their distribution", "Uses of minerals", "Conventional sources of energy– coal, petroleum, natural gas, electricity", "Non-conventional sources of energy– solar, wind, tidal, geothermal, nuclear", "Conservation of energy resources"],
  //       6: ["Importance of manufacturing", "Industrial location factors", "Classification of industries (based on size, ownership, raw material, product)", "Major industries– cotton, jute, iron and steel, aluminium, chemical, fertiliser, cement, automobile, IT", "Industrial pollution and environmental degradation", "Control of environmental degradation"],
  //       7: ["Roadways", "Railways", "Pipelines", "Waterways", "Airways", "Communication systems", "International trade"]
  //     },
  //     Civics: {
  //       1: ["Ethnic composition of Belgium and Sri Lanka", "Majoritarianism in Sri Lanka", "Accommodation in Belgium", "Why power sharing is desirable", "Forms of power sharing"],
  //       2: ["What makes India a federal country", "Features of federalism", "Division of powers between Union and State", "Decentralisation in India– 73rd and 74th Amendments"],
  //       3: ["Gender and politics", "Religion and politics", "Caste and politics"],
  //       4: ["Why do we need political parties?", "Functions of political parties", "National parties and state parties", "Challenges to political parties", "How can parties be reformed?"],
  //       5: ["How do we assess democracy's outcomes?", "Accountable, responsive and legitimate government", "Economic growth and development", "Reduction of inequality and poverty", "Accommodation of social diversity", "Dignity and freedom of the citizens"]
  //     },
  //     Economics: {
  //       1: ["What development promises– different people, different goals", "Income and other goals", "National development and per capita income", "Public facilities", "Sustainability of development"],
  //       2: ["Primary, secondary and tertiary sectors", "Historical change in sectors", "Rising importance of tertiary sector", "Division of sectors as organised and unorganised", "Employment trends"],
  //       3: ["Role of money in the economy", "Formal and informal sources of credit", "Self-Help Groups (SHGs)", "Credit and its terms"],
  //       4: ["Production across countries", "Interlinking of production across countries", "Foreign trade and integration of markets", "Globalisation and its impact", "Role of WTO", "Struggle for fair globalisation"],
  //       5: ["Consumer movement in India", "Consumer rights and duties", "Consumer awareness", "Role of consumer forums and NGOs"]
  //     }
  //   },
  // };

//   const handleSubjectClick = (subjectName) => {
//     setSelectedSubject(subjectName);
//     setExpandedChapters({});
//     if (isMobile) setSidebarOpen(false);
//     navigate(`/learn/class${currentClass}?subject=${subjectName}`);
//   };

//   const toggleChapterExpansion = (chapterNumber) => {
//     setExpandedChapters((prev) => ({
//       ...prev,
//       [chapterNumber]: !prev[chapterNumber],
//     }));
//   };

//   const handleChapterClick = (chapterNumber) => {
//     navigate(`/lesson/class${currentClass}/${selectedSubject}/${chapterNumber}`);
//   };

//   const handleSubtopicClick = (chapterNumber, subtopicIndex) => {
//     navigate(`/lesson/class${currentClass}/${selectedSubject}/${chapterNumber}`);
//   };

//   const currentChapters = allChapters[currentClass]?.[selectedSubject] || [];

  // const getSubjectDescription = (subject) => {
  //   const descriptions = {
  //     Maths:
  //       "Explore mathematical concepts, algebra, geometry and problem-solving skills.",
  //     Science:
  //       "Discover the wonders of physics, chemistry, and biology through experiments.",
  //     English:
  //       "Develop language skills through literature, grammar, and creative writing.",
  //     History:
  //       "Learn about civilizations, empires, and how societies evolved through time.",
  //     Civics:
  //       "Understand rights, duties, and how governments function in modern society.",
  //     Geography:
  //       "Explore the Earth, its landforms, and environmental systems and processes.",
  //     Economics:
  //       "Learn the basics of money, trade, production, and global economy.",
  //     Computer:
  //       "Learn computer basics, software applications, and digital literacy skills.",
  //   };
  //   return descriptions[subject] || "Explore the chapters and lessons.";
  // };

//   return (
//     <div
//       style={{
//         fontFamily: 'Arial, sans-serif',
//         margin: 0,
//         padding: 0,
//         backgroundColor: '#f8f9fa',
//         paddingTop: '80px',
//       }}
//     >
//       <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
//         {/* Sidebar */}
//         <div
//           style={{
//             width: isTablet ? '200px' : '260px',
//             backgroundColor: 'white',
//             borderRight: '1px solid #e5e7eb',
//             padding: '16px',
//             position: isMobile ? 'fixed' : 'relative',
//             top: isMobile ? '80px' : 0,
//             left: 0,
//             height: isMobile ? 'calc(100% - 80px)' : '100%',
//             zIndex: 1000,
//             transform: isMobile ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
//             transition: 'transform 0.3s ease',
//           }}
//         >
//           {isMobile && (
//             <button
//               onClick={() => setSidebarOpen(false)}
//               style={{
//                 marginBottom: '16px',
//                 background: '#0f766e',
//                 color: 'white',
//                 border: 'none',
//                 padding: '8px',
//                 borderRadius: '6px',
//                 cursor: 'pointer',
//                 width: '100%',
//               }}
//             >
//               <X size={20} /> Close
//             </button>
//           )}

//           <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//             {subjects.map((subject, index) => {
//               const IconComponent = subject.icon;
//               const isSelected = selectedSubject === subject.name;
//               return (
//                 <div
//                   key={index}
//                   style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     padding: '12px 16px',
//                     borderRadius: '8px',
//                     cursor: 'pointer',
//                     backgroundColor: isSelected ? '#0f766e' : 'transparent',
//                     color: isSelected ? 'white' : '#374151',
//                     transition: 'all 0.2s ease',
//                   }}
//                   onClick={() => handleSubjectClick(subject.name)}
//                 >
//                   <IconComponent size={20} style={{ marginRight: '12px' }} />
//                   <span style={{ fontWeight: '500', fontSize: '15px' }}>
//                     {subject.name}
//                   </span>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Overlay for mobile sidebar */}
//         {isMobile && sidebarOpen && (
//           <div
//             onClick={() => setSidebarOpen(false)}
//             style={{
//               position: 'fixed',
//               top: '80px',
//               left: 0,
//               width: '100%',
//               height: 'calc(100% - 80px)',
//               backgroundColor: 'rgba(0,0,0,0.4)',
//               zIndex: 999,
//             }}
//           />
//         )}

//         {/* Main Content */}
//         <div style={{ flex: 1, padding: isMobile ? '16px' : '32px' }}>
//           {isMobile && !sidebarOpen && (
//             <button
//               onClick={() => setSidebarOpen(true)}
//               style={{
//                 marginBottom: '16px',
//                 background: '#0f766e',
//                 color: 'white',
//                 border: 'none',
//                 padding: '8px 12px',
//                 borderRadius: '6px',
//                 cursor: 'pointer',
//                 width: '100%',
//               }}
//             >
//               <Menu size={20} /> Menu
//             </button>
//           )}

//           {/* Subject Title */}
//           <div style={{ marginBottom: '32px' }}>
//             <h1
//               style={{
//                 fontSize: isMobile ? '28px' : '48px',
//                 fontWeight: 'bold',
//                 color: '#4299e1',
//                 margin: '0 0 8px 0',
//               }}
//             >
//               {selectedSubject} (Class {currentClass})
//             </h1>
//             <p
//               style={{
//                 color: '#6b7280',
//                 fontSize: '16px',
//                 margin: 0,
//               }}
//             >
//               {getSubjectDescription(selectedSubject)}
//             </p>
//           </div>

//           {/* Chapters Section */}
// <div>
//   <div
//     style={{
//       display: 'flex',
//       alignItems: 'center',
//       marginBottom: '24px',
//       paddingBottom: '12px',
//     }}
//   >
//     <h2
//       style={{
//         fontSize: isMobile ? '22px' : '32px',
//         fontWeight: 'bold',
//         color: '#1f2937',
//         margin: 0,
//       }}
//     >
//       Chapters
//     </h2>
//     <span
//       style={{
//         marginLeft: '8px',
//         color: '#6b7280',
//         fontSize: '16px',
//       }}
//     >
//       ({currentChapters.length} chapters)
//     </span>
//   </div>

//   {/* REMOVE THIS CONDITIONAL RENDERING - Show expandable chapters for ALL classes */}
//   <div
//     style={{
//       display: 'flex',
//       flexDirection: 'column',
//       gap: '12px',
//     }}
//   >
//     {currentChapters.map((chapter) => {
//       const isExpanded = !!expandedChapters[chapter.number];
//       const chapterSubtopics =
//         subtopics?.[currentClass]?.[selectedSubject]?.[chapter.number] || [];

//       return (
//         <div
//           key={chapter.number}
//           style={{
//             backgroundColor: 'white',
//             borderRadius: '8px',
//             border: '1px solid #e5e7eb',
//             padding: '12px 16px',
//           }}
//         >
//           <div
//             style={{
//               cursor: 'pointer',
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//             }}
//             onClick={() => toggleChapterExpansion(chapter.number)}
//           >
//             <div
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '12px',
//               }}
//             >
//               <div
//                 style={{
//                   width: '40px',
//                   height: '40px',
//                   backgroundColor: '#ddd6fe',
//                   color: '#7c3aed',
//                   borderRadius: '8px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   fontWeight: 'bold',
//                 }}
//               >
//                 {chapter.number}
//               </div>
//               <span
//                 style={{
//                   fontWeight: '600',
//                   fontSize: '16px',
//                   color: '#1f2937',
//                 }}
//               >
//                 {chapter.title}
//               </span>
//             </div>
//             <ChevronRight
//               size={20}
//               style={{
//                 color: isExpanded ? '#0f766e' : '#9ca3af',
//                 transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
//                 transition: 'transform 0.3s ease',
//               }}
//             />
//           </div>

//           {isExpanded && chapterSubtopics.length > 0 && (
//             <div
//               style={{
//                 marginTop: '12px',
//                 paddingLeft: '52px',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 gap: '8px',
//               }}
//             >
//               {chapterSubtopics.map((subtopic, index) => (
//                 <div
//                   key={index}
//                   style={{
//                     cursor: 'pointer',
//                     color: '#4299e1',
//                     fontWeight: '500',
//                     fontSize: '14px',
//                     padding: '8px 12px',
//                     borderRadius: '6px',
//                     transition: 'background-color 0.2s ease',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '8px',
//                   }}
//                   onClick={() => handleSubtopicClick(chapter.number, index)}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.backgroundColor = '#e0f2fe';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.backgroundColor = 'transparent';
//                   }}
//                 >
//                   <List size={16} /> {subtopic}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       );
//     })}
//   </div>
// </div>
//       </div>
//             </div>
//     </div>
//   );
// };

// export default Learn;









import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  Calculator,
  Atom,
  FileText,
  BookOpen,
  Users,
  Globe,
  BarChart,
  Code,
  Menu,
  X,
  List,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Learn = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSubject = queryParams.get('subject') || 'Maths';
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState({});

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCurrentClass = () => {
    if (location.pathname.includes('/learn/class10')) return '10';
    if (location.pathname.includes('/learn/class9')) return '9';
    if (location.pathname.includes('/learn/class8')) return '8';
    if (location.pathname.includes('/learn/class7')) return '7';
    return '7'; // Default to class 7 if no match
  };

  const currentClass = getCurrentClass();
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const subjects = [
    { name: 'Maths', icon: Calculator },
    { name: 'Science', icon: Atom },
    { name: 'English', icon: BookOpen },
    { name: 'History', icon: FileText },
    { name: 'Civics', icon: Users },
    { name: 'Geography', icon: Globe },
    ...(currentClass === '9' || currentClass === '10' ? [{ name: 'Economics', icon: BarChart }] : []),
    { name: 'Computer', icon: Code },
  ];

const allChapters = {
    '7': {
      Maths: [
        { number: 1, title: 'Chapter 1: Integers' },
        { number: 2, title: 'Chapter 2: Fractions and Decimals' },
        { number: 3, title: 'Chapter 3: Data Handling' },
        { number: 4, title: 'Chapter 4: Simple Equations' },
        { number: 5, title: 'Chapter 5: Lines and Angles' },
        { number: 6, title: 'Chapter 6: The Triangle and Its Properties' },
        { number: 7, title: 'Chapter 7: Comparing Quantities' },
        { number: 8, title: 'Chapter 8: Rational Numbers' },
        { number: 9, title: 'Chapter 9: Perimeter and Area' },
        { number: 10, title: 'Chapter 10: Algebraic Expressions' },
        { number: 11, title: 'Chapter 11: Exponents and Powers' },
        { number: 12, title: 'Chapter 12: Symmetry' },
        { number: 13, title: 'Chapter 13: Visualising Solid Shapes' },
      ],
      Science: [
        { number: 1, title: 'Chapter 1: Nutrition in Plants' },
        { number: 2, title: 'Chapter 2: Nutrition in Animals' },
        { number: 3, title: 'Chapter 3: Fibre to Fabric' },
        { number: 4, title: 'Chapter 4: Heat' },
        { number: 5, title: 'Chapter 5: Acids, Bases and Salts' },
        { number: 6, title: 'Chapter 6: Physical and Chemical Changes' },
        { number: 7, title: 'Chapter 7: Weather, Climate and Adaptations of Animals' },
        { number: 8, title: 'Chapter 8: Winds, Storms and Cyclones' },
        { number: 9, title: 'Chapter 9: Soil' },
        { number: 10, title: 'Chapter 10: Respiration in Organisms' },
        { number: 11, title: 'Chapter 11: Transportation in Animals and Plants' },
        { number: 12, title: 'Chapter 12: Reproduction in Plants' },
        { number: 13, title: 'Chapter 13: Motion and Time' },
        { number: 14, title: 'Chapter 14: Electric Current and Its Effects' },
        { number: 15, title: 'Chapter 15: Light' },
        { number: 16, title: 'Chapter 16: Water: A Precious Resource' },
        { number: 17, title: 'Chapter 17: Forests: Our Lifeline' },
        { number: 18, title: 'Chapter 18: Wastewater Story' },
      ],
      English: [
        { number: 1, title: 'Chapter 1: Learning Together' },
        { number: 2, title: 'Chapter 2: Wit and Humour' },
        { number: 3, title: 'Chapter 3: Dreams & Discoveries' },
        { number: 4, title: 'Chapter 4: Travel and Adventure' },
        { number: 5, title: 'Chapter 5: Bravehearts' },
      ],
      History: [
        { number: 1, title: 'Chapter 1: Tracing Changes through a Thousand Years' },
        { number: 2, title: 'Chapter 2: New Kings and Kingdoms' },
        { number: 3, title: 'Chapter 3: The Delhi Sultans (12th–15th Century)' },
        { number: 4, title: 'Chapter 4: The Mughal Empire (16th–17th Century)' },
        { number: 5, title: 'Chapter 5: Rulers and Buildings / Tribes, Nomads and Settled Communities' },
        { number: 6, title: 'Chapter 6: Devotional Paths to the Divine' },
        { number: 7, title: 'Chapter 7: The Making of Regional Cultures' },
        { number: 8, title: 'Chapter 8: Eighteenth Century Political Formations' },
      ],
      Civics: [
        { number: 1, title: 'Chapter 1: On Equality' },
        { number: 2, title: 'Chapter 2: Role of the Government in Health' },
        { number: 3, title: 'Chapter 3: How the State Government Works' },
        { number: 4, title: 'Chapter 4: Growing up as Boys and Girls' },
        { number: 5, title: 'Chapter 5: Women Change the World' },
        { number: 6, title: 'Chapter 6: Understanding Media' },
        { number: 7, title: 'Chapter 7: Markets Around Us' },
        { number: 8, title: 'Chapter 8: A Shirt in the Market' },
      ],
      Geography: [
        { number: 1, title: 'Chapter 1: Environment' },
        { number: 2, title: 'Chapter 2: Inside Our Earth' },
        { number: 3, title: 'Chapter 3: Our Changing Earth' },
        { number: 4, title: 'Chapter 4: Air' },
        { number: 5, title: 'Chapter 5: Water' },
        { number: 6, title: 'Chapter 6: Human-Environment Interactions– The Tropical and the Subtropical Region' },
        { number: 7, title: 'Chapter 7: Life in the Deserts' },
      ],
      Computer: [
        { number: 1, title: 'Chapter 1: Programming Language' },
        { number: 2, title: 'Chapter 2: Editing Text in Microsoft Word' },
        { number: 3, title: 'Chapter 3: Microsoft PowerPoint' },
        { number: 4, title: 'Chapter 4: Basics of Microsoft Excel' },
        { number: 5, title: 'Chapter 5: Microsoft Access' },
      ],
    },
    '8': {
      Maths: [
        { number: 1, title: 'Chapter 1: Rational Numbers' },
        { number: 2, title: 'Chapter 2: Linear Equations in One Variable' },
        { number: 3, title: 'Chapter 3: Understanding Quadrilaterals' },
        { number: 4, title: 'Chapter 4: Data Handling' },
        { number: 5, title: 'Chapter 5: Squares and Square Roots' },
        { number: 6, title: 'Chapter 6: Cubes and Cube Roots' },
        { number: 7, title: 'Chapter 7: Comparing Quantities' },
        { number: 8, title: 'Chapter 8: Algebraic Expressions and Identities' },
        { number: 9, title: 'Chapter 9: Mensuration' },
        { number: 10, title: 'Chapter 10: Exponents and Powers' },
        { number: 11, title: 'Chapter 11: Direct and Inverse Proportions' },
        { number: 12, title: 'Chapter 12: Factorisation' },
        { number: 13, title: 'Chapter 13: Introduction to Graphs' },
      ],
      Science: [
        { number: 1, title: 'Chapter 1: Crop Production and Management' },
        { number: 2, title: 'Chapter 2: Microorganisms: Friend and Foe' },
        { number: 3, title: 'Chapter 3: Synthetic Fibres and Plastics' },
        { number: 4, title: 'Chapter 4: Materials: Metals and Non-Metals' },
        { number: 5, title: 'Chapter 5: Coal and Petroleum' },
        { number: 6, title: 'Chapter 6: Combustion and Flame' },
        { number: 7, title: 'Chapter 7: Conservation of Plants and Animals' },
        { number: 8, title: 'Chapter 8: Cell – Structure and Functions' },
        { number: 9, title: 'Chapter 9: Reproduction in Animals' },
        { number: 10, title: 'Chapter 10: Force and Pressure' },
        { number: 11, title: 'Chapter 11: Friction' },
        { number: 12, title: 'Chapter 12: Sound' },
        { number: 13, title: 'Chapter 13: Chemical Effects of Electric Current' },
        { number: 14, title: 'Chapter 14: Some Natural Phenomena' },
        { number: 15, title: 'Chapter 15: Light' },
        { number: 16, title: 'Chapter 16: Stars and the Solar System' },
        { number: 17, title: 'Chapter 17: Pollution of Air and Water' },
      ],
      English: [
        { number: 1, title: 'Unit 1: Honeydew – Prose' },
        { number: 2, title: 'Unit 2: Honeydew – Poems' },
        { number: 3, title: 'Unit 3: It So Happened – Supplementary' },
      ],
      History: [
        { number: 1, title: 'Chapter 1: How, When and Where' },
        { number: 2, title: 'Chapter 2: From Trade to Territory– The Company Establishes Power' },
        { number: 3, title: 'Chapter 3: Ruling the Countryside' },
        { number: 4, title: 'Chapter 4: Tribals, Dikus and the Vision of a Golden Age' },
        { number: 5, title: 'Chapter 5: When People Rebel– 1857 and After' },
        { number: 6, title: 'Chapter 6: Civilising the "Native", Educating the Nation' },
        { number: 7, title: 'Chapter 7: Women, Caste and Reform' },
        { number: 8, title: 'Chapter 8: The Making of the National Movement: 1870s–1947' },
      ],
      Civics: [
        { number: 1, title: 'Chapter 1: The Indian Constitution' },
        { number: 2, title: 'Chapter 2: Understanding Secularism' },
        { number: 3, title: 'Chapter 3: Parliament and the Making of Laws' },
        { number: 4, title: 'Chapter 4: Judiciary' },
        { number: 5, title: 'Chapter 5: Understanding Marginalisation' },
        { number: 6, title: 'Chapter 6: Confronting Marginalisation' },
        { number: 7, title: 'Chapter 7: Public Facilities' },
        { number: 8, title: 'Chapter 8: Law and Social Justice' },
      ],
      Geography: [
        { number: 1, title: 'Chapter 1: Resources' },
        { number: 2, title: 'Chapter 2: Land, Soil, Water, Natural Vegetation and Wildlife Resources' },
        { number: 3, title: 'Chapter 3: Agriculture' },
        { number: 4, title: 'Chapter 4: Industries' },
        { number: 5, title: 'Chapter 5: Human Resources' },
      ],
      Computer: [
        { number: 1, title: 'Chapter 1: Exception Handling in Python' },
        { number: 2, title: 'Chapter 2: File Handling in Python' },
        { number: 3, title: 'Chapter 3: Stack (Data Structure)' },
        { number: 4, title: 'Chapter 4: Queue (Data Structure)' },
        { number: 5, title: 'Chapter 5: Sorting' },
      ],
    },
    '9': {
      Computer: [
        { number: 1, title: "Chapter 1: Basics of Computer System" },
        { number: 2, title: "Chapter 2: Types of Software" },
        { number: 3, title: "Chapter 3: Operating System" },
        { number: 4, title: "Chapter 4: Introduction to Python Programming" },
        { number: 5, title: "Chapter 5: Introduction to Cyber Security" }
      ],
      English: [
        { number: 1, title: "Unit 1: Beehive – Prose" },
        { number: 2, title: "Unit 2: Beehive – Poems" },
        { number: 3, title: "Unit 3: Moments – Supplementary" }
      ],
      Maths: [
        { number: 1, title: "Chapter 1: Number System" },
        { number: 2, title: "Chapter 2: Algebra" },
        { number: 3, title: "Chapter 3: Coordinate Geometry" },
        { number: 4, title: "Chapter 4: Geometry" },
        { number: 5, title: "Chapter 5: Mensuration" },
        { number: 6, title: "Chapter 6: Statistics" }
      ],
      Science: [
        { number: 1, title: "Chapter 1: Matter in Our Surroundings" },
        { number: 2, title: "Chapter 2: Is Matter Around Us Pure?" },
        { number: 3, title: "Chapter 3: Atoms and Molecules" },
        { number: 4, title: "Chapter 4: Structure of the Atom" },
        { number: 5, title: "Chapter 5: The Fundamental Unit of Life" },
        { number: 6, title: "Chapter 6: Tissues" },
        { number: 7, title: "Chapter 7: Diversity of the Living Organisms – I" },
        { number: 8, title: "Chapter 8: Diversity of the Living Organisms – II" },
        { number: 9, title: "Chapter 9: Diversity of the Living Organisms – III" },
        { number: 10, title: "Chapter 10: Motion" },
        { number: 11, title: "Chapter 11: Force and Laws of Motion" },
        { number: 12, title: "Chapter 12: Gravitation" },
        { number: 13, title: "Chapter 13: Work and Energy" },
        { number: 14, title: "Chapter 14: Sound" },
        { number: 15, title: "Chapter 15: Why Do We Fall Ill?" },
        { number: 16, title: "Chapter 16: Natural Resources" },
        { number: 17, title: "Chapter 17: Improvement in Food Resources" }
      ],
      History: [
        { number: 1, title: "Chapter 1: The French Revolution" },
        { number: 2, title: "Chapter 2: Socialism in Europe and the Russian Revolution" },
        { number: 3, title: "Chapter 3: Nazism and the Rise of Hitler" },
        { number: 4, title: "Chapter 4: Forest Society and Colonialism" },
        { number: 5, title: "Chapter 5: Pastoralists in the Modern World" }
      ],
      Geography: [
        { number: 1, title: "Chapter 1: India– Size and Location" },
        { number: 2, title: "Chapter 2: Physical Features of India" },
        { number: 3, title: "Chapter 3: Drainage" },
        { number: 4, title: "Chapter 4: Climate" },
        { number: 5, title: "Chapter 5: Natural Vegetation and Wildlife" },
        { number: 6, title: "Chapter 6: Population" }
      ],
      Civics: [
        { number: 1, title: "Chapter 1: What is Democracy? Why Democracy?" },
        { number: 2, title: "Chapter 2: Constitutional Design" },
        { number: 3, title: "Chapter 3: Electoral Politics" },
        { number: 4, title: "Chapter 4: Working of Institutions" },
        { number: 5, title: "Chapter 5: Democratic Rights" }
      ],
      Economics: [
        { number: 1, title: "Chapter 1: The Story of Village Palampur" },
        { number: 2, title: "Chapter 2: People as Resource" },
        { number: 3, title: "Chapter 3: Poverty as a Challenge" },
        { number: 4, title: "Chapter 4: Food Security in India" }
      ]
    },
    '10': {
      Computer: [
        { number: 1, title: "Chapter 1: Computer Fundamentals" },
        { number: 2, title: "Chapter 2: Advanced GIMP (GNU Image Manipulation Program)" },
        { number: 3, title: "Chapter 3: Tables (HTML)" },
        { number: 4, title: "Chapter 4: Forms (HTML)" },
        { number: 5, title: "Chapter 5: DHTML & CSS" }
      ],
      English: [
        { number: 1, title: "Unit1: First Flight – Prose" },
        { number: 2, title: "Unit2: First Flight – Poems" },
        { number: 3, title: "Unit3: Footprints Without Feet – Supplementary" }
      ],
      Maths: [
        { number: 1, title: "Chapter 1: Number Systems" },
        { number: 2, title: "Chapter 2: Algebra" },
        { number: 3, title: "Chapter 3: Coordinate Geometry" },
        { number: 4, title: "Chapter 4: Geometry" },
        { number: 5, title: "Chapter 5: Trigonometry" },
        { number: 6, title: "Chapter 6: Mensuration" },
        { number: 7, title: "Chapter 7: Statistics and Probability" }
      ],
      Science: [
        { number: 1, title: "Chapter 1: Chemical Reactions and Equations" },
        { number: 2, title: "Chapter 2: Acids, Bases, and Salts" },
        { number: 3, title: "Chapter 3: Metals and Non-Metals" },
        { number: 4, title: "Chapter 4: Carbon and Its Compounds" },
        { number: 5, title: "Chapter 5: Periodic Classification of Elements" },
        { number: 6, title: "Chapter 6: Life Processes" },
        { number: 7, title: "Chapter 7: Control and Coordination" },
        { number: 8, title: "Chapter 8: How do Organisms Reproduce?" },
        { number: 9, title: "Chapter 9: Heredity and Evolution" },
        { number: 10, title: "Chapter 10: Light – Reflection and Refraction" },
        { number: 11, title: "Chapter 11: Human Eye and Colourful World" },
        { number: 12, title: "Chapter 12: Electricity" },
        { number: 13, title: "Chapter 13: Magnetic Effects of Electric Current" },
        { number: 14, title: "Chapter 14: Sources of Energy" },
        { number: 15, title: "Chapter 15: Our Environment" },
        { number: 16, title: "Chapter 16: Sustainable Management of Natural Resources" }
      ],
      History: [
        { number: 1, title: "Chapter 1: The Rise of Nationalism in Europe" },
        { number: 2, title: "Chapter 2: Nationalism in India" },
        { number: 3, title: "Chapter 3: The Making of a Global World" },
        { number: 4, title: "Chapter 4: The Age of Industrialisation" },
        { number: 5, title: "Chapter 5: Print Culture and the Modern World" }
      ],
      Geography: [
        { number: 1, title: "Chapter 1: Resources and Development" },
        { number: 2, title: "Chapter 2: Forest and Wildlife Resources" },
        { number: 3, title: "Chapter 3: Water Resources" },
        { number: 4, title: "Chapter 4: Agriculture" },
        { number: 5, title: "Chapter 5: Minerals and Energy Resources" },
        { number: 6, title: "Chapter 6: Manufacturing Industries" },
        { number: 7, title: "Chapter 7: Lifelines of National Economy" }
      ],
      Civics: [
        { number: 1, title: "Chapter 1: Power Sharing" },
        { number: 2, title: "Chapter 2: Federalism" },
        { number: 3, title: "Chapter 3: Gender, Religion and Caste" },
        { number: 4, title: "Chapter 4: Political Parties" },
        { number: 5, title: "Chapter 5: Outcomes of Democracy" }
      ],
      Economics: [
        { number: 1, title: "Chapter 1: Development" },
        { number: 2, title: "Chapter 2: Sectors of the Indian Economy" },
        { number: 3, title: "Chapter 3: Money and Credit" },
        { number: 4, title: "Chapter 4: Globalisation and the Indian Economy" },
        { number: 5, title: "Chapter 5: Consumer Rights" }
      ]
    },
  };

  const subtopics = {
    '7': {
      Computer: {
        1: [
          "What is a programming language?",
          "Low-level vs High-level languages",
          "Examples and real-world uses",
          "Introduction to programming logic and pseudocode"
        ],
        2: [
          "Creating, saving, and opening documents",
          "Text formatting: fonts, sizes, colors, bold, italics",
          "Paragraph alignment, bullets, numbering",
          "Inserting images, tables, and hyperlinks"
        ],
        3: [
          "Creating slides and using slide layouts",
          "Adding and editing text and images",
          "Applying themes and transitions",
          "Running a slideshow"
        ],
        4: [
          "Entering and formatting data in cells",
          "Basic formulas (SUM, AVERAGE)",
          "Creating charts from data",
          "Sorting and filtering data"
        ],
        5: [
          "Understanding databases and tables",
          "Creating a simple database",
          "Adding, editing, and searching records",
          "Basic queries"
        ]
      },
      English: {
        1: [
          "The Day the River Spoke: Sentence completion, onomatopoeia, fill-in-the-blanks, prepositions",
          "Try Again: Phrases, metaphor, simile",
          "Three Days to See: Modal verbs, descriptive paragraph writing"
        ],
        2: [
          "Animals, Birds, and Dr. Dolittle: Compound words, palindrome, present perfect tense, notice writing",
          "A Funny Man: Phrasal verbs, adverbs, prepositions",
          "Say the Right Thing: Suffixes, verb forms, tenses, kinds of sentences"
        ],
        3: [
          "My Brother's Great Invention: Onomatopoeia, binomials, phrasal verbs, idioms, simple past and past perfect tense",
          "Paper Boats: Antonyms, diary entry writing",
          "North, South, East, West: Associate words with meanings, subject-verb agreement, letter format (leave application)"
        ],
        4: [
          "The Tunnel: Phrases, onomatopoeia, punctuation, descriptive paragraph writing",
          "Travel: Onomatopoeia",
          "Conquering the Summit: Phrases, parts of speech, articles, formal letter writing"
        ],
        5: [
          "A Homage to Our Brave Soldiers: Prefix and root words, main clause, subordinate clause, subordinating conjunctions",
          "My Dear Soldiers: Collocations",
          "Rani Abbakka: Fill-in-the-blanks, speech (direct & indirect)"
        ]
      },
      Maths: {
        1: [
          "Properties of addition and subtraction of integers",
          "Multiplication of integers",
          "Properties of multiplication of integers",
          "Division of integers",
          "Properties of division of integers"
        ],
        2: [
          "Multiplication of fractions",
          "Division of fractions",
          "Multiplication of decimal numbers",
          "Division of decimal numbers"
        ],
        3: [
          "Representative values",
          "Arithmetic mean",
          "Mode",
          "Median",
          "Bar graphs and their uses"
        ],
        4: [
          "A Minding-reading game (intro-activity)",
          "Setting up equations",
          "What is an equations?",
          "More Equations",
          "Applications of simple equations to practical situations"
        ],
        5: [
          "Introduction and related angles",
          "Pairs of lines",
          "Checking for parallel lines"
        ],
        6: [
          "Median of a triangle",
          "Altitude of a triangle",
          "Exterior angle and its property",
          "Angle sum property of a triangle",
          "Two Special triangles: equilateral and isosceles",
          "Sum of lengths of two sides of a triangle",
          "Right-angled triangles and Pythagoras' theorem"
        ],
        7: [
          "Percentage– another way of comparing quantities",
            "Uses of percentages",
            "Prices related to an item (buying/selling scenarios)",
            "Charge given on borrowed money or simple interest"
        ],
        8: [
          "Introduction and need for rational numbers",
            "Positive and negative rational numbers",
            "Rational numbers on the number line",
            "Rational numbers in standard form",
            "Comparison of rational numbers",
            "Rational numbers between two rational numbers",
            "Operations on rational numbers"
        ],
        9: [
          "Area of parallelogram",
          "Area of triangles",
          "Understanding circles (circumference/area)"
        ],
        10: [
          "Introduction to algebraic expressions",
            "Formation of expressions",
            "Terms of an expression",
            "Like and unlike terms",
            "Monomials, binomials, trinomials, polynomials",
            "Finding the value of an expression"
        ],
        11: [
          "Introduction to exponents",
            "Laws of exponents",
            "Miscellaneous examples using laws of exponents",
            "Decimal number system",
            "Expressing large numbers in standard form"
        ],
        12: [
          "Lines of symmetry for regular polygons",
            "Rotational symmetry",
            "Line symmetry vs. rotational symmetry"
        ],
        13: [
          "Plane figures vs. solid shapes",
            "Faces, edges, vertices of 3D shapes (cubes, cuboids, cones, etc.)",
            "Visualisation from different perspectives"
        ]
      },
      Science: {
        1: ["Photosynthesis",
            "Modes of nutrition: Autotrophic, Heterotrophic",
            "Saprotrophic nutrition",
            "Structure of leaves"],
        2: ["Human digestive system",
            "Nutrition in different animals",
            "Feeding habits"],
        3: ["Natural fibres: Cotton, Wool, Silk", "Processing of fibres", "Spinning, Weaving, Knitting","Synthetic fibres"],
        4: ["Hot and cold objects",
            "Measurement of temperature",
            "Laboratory thermometer",
            "Transfer of heat",
            "Kinds of clothes we wear in summer and winter"],
        5: ["Acid and base indicators", "Natural indicators", "Neutralisation in daily life"],
        6: ["Physical vs chemical changes", "Examples of changes", "Rusting and prevention", "Crystallisation"],
        7: ["Weather vs climate", "Climate adaptation", "Effect of climate on organisms", "Polar regions and rainforests"],
        8: ["Air pressure", "Expansion on heating", "Wind currents", "Thunderstorms and cyclones"],
        9: ["Soil profile and types", "Soil properties", "Soil and crops"],
        10: ["Respiration types: aerobic and anaerobic", "Breathing in animals and humans", "Breathing cycle and rate"],
        11: ["Circulatory system", "Excretion in animals", "Transport in plants", "Transpiration"],
        12: ["Asexual and sexual reproduction", "Vegetative propagation", "Pollination and fertilisation", "Seed dispersal"],
        13: ["Speed and motion", "Time measurement", "Simple pendulum", "Distance-time graph"],
        14: ["Electric components and symbols", "Heating and magnetic effects of current", "Electromagnets and uses"],
        15: ["Reflection, refraction, dispersion", "Plane and spherical mirrors", "Lens types and uses"],
        16: ["Water availability and forms", "Groundwater", "Water table and management", "Conservation methods"],
        17: ["Importance of forests", "Plant-animal interdependence", "Deforestation and conservation"]
      },
      History: {
        1: ["Maps and history", "Historical terminology", "Historians and sources", "Social and political groups", "Regions and empires"],
        2: ["Emergence of new dynasties", "Administration in kingdoms", "Warfare for wealth and power", "Prashastis and land grants"],
        3: ["Delhi Sultans political expansion", "Administration and consolidation", "Mosques and cities", "Case studies: Raziya Sultan, Muhammad Tughlaq"],
        4: ["Mughal Empire establishment and expansion", "Akbar's policies and Mansabdari system", "Jahangir, Shah Jahan, Aurangzeb", "Relations with other rulers"],
        5: ["Tribal societies", "Nomadic pastoralists", "Caste-based communities", "Interaction between nomads and settled societies"],
        6: ["Bhakti movement and saints", "Sufi traditions", "New regional religious developments"],
        7: ["Language, literature, and regional identity", "Regional art, dance, and music", "Temple architecture traditions"],
        8: ["Decline of Mughal Empire", "New independent kingdoms", "Marathas, Sikhs, Jats, Rajputs", "Regional state administration"]
      },
      Civics: {
        1: ["Equality in democracy", "Inequality issues: caste, religion, gender, economic", "Government efforts for equality"],
        2: ["Public vs private health services", "Importance of healthcare", "Inequality in access", "Case studies"],
        3: ["Governor and Chief Minister roles", "State legislature functioning", "Role of MLAs", "State government case study"],
        4: ["Gender roles in society", "Stereotypes for boys and girls", "Experiences of growing up", "Equality for women"],
        5: ["Women in education and work", "Struggles for equality", "Women achiever case studies", "Laws for women's rights"],
        6: ["Role of media in democracy", "Influence and bias in media", "Need for independent media"],
        7: ["Markets, shops, malls", "Chain of markets", "Role of money and middlemen", "Impact on farmers and traders"],
        8: ["Production and distribution", "Globalisation and trade", "Role of traders, exporters, workers", "Consumer awareness"]
      },
      Geography: {
        1: ["Components of environment", "Ecosystem", "Environmental balance"],
        2: ["Earth layers: crust, mantle, core", "Rock types", "Rock cycle", "Minerals and uses"],
        3: ["Lithosphere movements: earthquakes, volcanoes", "Landforms: mountains, plateaus, plains", "Work of rivers, wind, glaciers, waves"],
        4: ["Atmosphere composition and structure", "Weather and climate", "Temperature and pressure distribution", "Wind and moisture"],
        5: ["Water distribution", "Water cycle", "Oceans: waves, tides, currents", "Importance of water"],
        6: ["Amazon basin (equatorial)", "Ganga-Brahmaputra basin (subtropical)", "Life of people in these regions"],
        7: ["Hot deserts (Sahara)", "Cold deserts (Ladakh)", "Adaptations of people and animals", "Economic activities in deserts"]
      }
    },
    '8': {
      Computer: {
        1: [
          "Introduction to errors and exceptions",
          "Types of errors: Syntax errors, Runtime errors (exceptions), Logical errors",
          "Built-in exceptions (ZeroDivisionError, ValueError, etc.)",
          "Using try–except block",
          "try–except–else–finally structure",
          "Raising exceptions using raise",
          "Real-life examples of exception handling (division by zero, invalid input)"
        ],
        2: [
          "Introduction to file handling",
          "Types of files: Text files, Binary files",
          "Opening and closing files (open(), close())",
          "File modes (r, w, a, r+)",
          "Reading from a file (read(), readline(), readlines())",
          "Writing to a file (write(), writelines())",
          "File pointer and cursor movement (seek(), tell())",
          "Practical applications: saving student records, logs, etc."
        ],
        3: [
          "Introduction to stack",
          "LIFO principle (Last In First Out)",
          "Stack operations: Push, Pop, Peek/Top",
          "Stack implementation using list in Python or modules (collections.deque)",
          "Applications: Undo operation in editors, Function call management"
        ],
        4: [
          "Introduction to queue",
          "FIFO principle (First In First Out)",
          "Queue operations: Enqueue, Dequeue",
          "Types of queues: Simple, Circular, Deque, Priority",
          "Implementation in Python using lists or queue module",
          "Applications: Printer task scheduling, Customer service systems"
        ],
        5: [
          "Importance of sorting in data organization",
          "Basic sorting techniques: Bubble Sort, Selection Sort, Insertion Sort",
          "Advanced sorting (introductory): Merge Sort, Quick Sort",
          "Sorting in Python using built-in methods: sorted() function"
        ]
      },
      English: {
        1: [
          "The Best Christmas Present in the World: Narrative comprehension, vocabulary",
          "The Tsunami: Disaster narrative, sequencing events",
          "Glimpses of the Past: Historical narrative, chronology",
          "Bepin Choudhury's Lapse of Memory: Character sketch, irony",
          "The Summit Within: Motivation, descriptive writing",
          "This is Jody's Fawn: Empathy, moral choice",
          "A Visit to Cambridge: Biographical narrative",
          "A Short Monsoon Diary: Diary entry style",
          "The Great Stone Face – I: Description, prediction",
          "The Great Stone Face – II: Conclusion, moral lesson"
        ],
        2: [
          "The Ant and the Cricket: Moral fable, rhyme scheme",
          "Geography Lesson: Imagery, meaning",
          "Macavity: The Mystery Cat: Humour, personification",
          "The Last Bargain: Metaphor, symbolism",
          "The School Boy: Theme of education, freedom",
          "The Duck and the Kangaroo: Rhyme, humour",
          "When I set out for Lyonnesse: Imagination, rhyme",
          "On the Grasshopper and Cricket: Nature imagery"
        ],
        3: [
          "How the Camel Got His Hump: Fable, character traits",
          "Children at Work: Social issue, empathy",
          "The Selfish Giant: Allegory, moral theme",
          "The Treasure Within: Education, individuality",
          "Princess September: Freedom, symbolism",
          "The Fight: Conflict resolution",
          "The Open Window: Humour, irony",
          "Jalebis: Humour, moral lesson",
          "The Comet – I: Science fiction, prediction",
          "The Comet – II: Resolution, conclusion"
        ]
      },
      Maths: {
        1: ["Introduction", "Properties of Rational Numbers", "Representation of Rational Numbers on the Number Line", "Rational Number between Two Rational Numbers", "Word Problems"],
        2: ["Introduction", "Solving Equations which have Linear Expressions on one Side and Numbers on the other Side", "Some Applications", "Solving Equations having the Variable on both sides", "Some More Applications", "Reducing Equations to Simpler Form", "Equations Reducible to the Linear Form"],
        3: ["Introduction", "Polygons", "Sum of the Measures of the Exterior Angles of a Polygon", "Kinds of Quadrilaterals", "Some Special Parallelograms"],
        4: ["Looking for Information", "Organising Data", "Grouping Data", "Circle Graph or Pie Chart", "Chance and Probability"],
        5: ["Introduction", "Properties of Square Numbers", "Some More Interesting Patterns", "Finding the Square of a Number", "Square Roots", "Square Roots of Decimals", "Estimating Square Root"],
        6: ["Introduction", "Cubes", "Cubes Roots"],
        7: ["Recalling Ratios and Percentages", "Finding the Increase and Decrease Percent", "Finding Discounts", "Prices Related to Buying and Selling (Profit and Loss)", "Sales Tax/Value Added Tax/Goods and Services Tax", "Compound Interest", "Deducing a Formula for Compound Interest", "Rate Compounded Annually or Half Yearly (Semi Annually)", "Applications of Compound Interest Formula"],
        8: ["What are Expressions?", "Terms, Factors and Coefficients", "Monomials, Binomials and Polynomials", "Like and Unlike Terms", "Addition and Subtraction of Algebraic Expressions", "Multiplication of Algebraic Expressions: Introduction", "Multiplying a Monomial by a Monomial", "Multiplying a Monomial by a Polynomial", "Multiplying a Polynomial by a Polynomial", "What is an Identity?", "Standard Identities", "Applying Identities"],
        9: ["Introduction", "Let us Recall", "Area of Trapezium", "Area of General Quadrilateral", "Area of Polygons", "Solid Shapes", "Surface Area of Cube, Cuboid and Cylinder", "Volume of Cube, Cuboid and Cylinder", "Volume and Capacity"],
        10: ["Introduction", "Powers with Negative Exponents", "Laws of Exponents", "Use of Exponents to Express Small Numbers in Standard Form"],
        11: ["Introduction", "Direct Proportion", "Inverse Proportion"],
        12: ["Introduction", "What is Factorisation?", "Division of Algebraic Expressions", "Division of Algebraic Expressions Continued (Polynomial / Polynomial)", "Can you Find the Error?"],
        13: ["Introduction", "Linear Graphs", "Some Applications"]
      },
      Science: {
        1: ["Agriculture practices", "Crop production techniques", "Storage and preservation"],
        2: ["Bacteria, viruses, fungi", "Useful microbes", "Harmful microbes and diseases"],
        3: ["Types of synthetic fibres", "Characteristics and uses", "Plastics: Thermoplastics, Thermosetting"],
        4: ["Physical and chemical properties", "Reactivity series", "Uses of metals and non-metals"],
        5: ["Fossil fuels", "Refining petroleum", "Uses of coal and petroleum"],
        6: ["Types of combustion", "Structure of flame", "Fire safety"],
        7: ["Biodiversity", "Endangered species", "Wildlife conservation"],
        8: ["Plant and animal cell", "Cell organelles", "Cell division"],
        9: ["Modes of reproduction", "Human reproductive system", "Fertilization and development"],
        10: ["Types of forces", "Pressure in solids, liquids, and gases", "Applications"],
        11: ["Advantages and disadvantages", "Reducing friction"],
        12: ["Production and propagation", "Characteristics of sound", "Human ear"],
        13: ["Electrolysis", "Applications in daily life"],
        14: ["Lightning, Earthquakes, and Safety measures"],
        15: ["Reflection, refraction, dispersion", "Human eye and defects"],
        16: ["Solar system structure", "Planets, moons, comets, and meteors"],
        17: ["Causes and effects", "Control measures"]
      },
      History: {
        1: ["How do we periodise history?", "Importance of dates and events", "Sources for studying modern history", "Official records of the British administration"],
        2: ["East India Company comes to India", "Establishment of trade centres", "Battle of Plassey and Buxar", "Expansion of British power in India", "Subsidiary alliance and doctrine of lapse"],
        3: ["The revenue system under British rule", "Permanent Settlement, Ryotwari and Mahalwari systems", "Effects of British land revenue policies", "Role of indigo cultivation and indigo revolt"],
        4: ["Tribal societies and their livelihoods", "Impact of British policies on tribal life", "Tribal revolts and resistance", "Birsa Munda and his movement"],
        5: ["Causes of the revolt of 1857", "Important centres of the revolt", "Leaders and their roles", "Suppression of the revolt", "Consequences and significance"],
        6: ["The British view on education in India", "Orientalist vs Anglicist debate", "Macaulay's Minute on Education", "Wood's Despatch", "Growth of national education system"],
        7: ["Social reform movements in the 19th century", "Reformers and their contributions (Raja Ram Mohan Roy, Ishwar Chandra Vidyasagar, Jyotiba Phule, etc.)", "Movements against caste discrimination", "Role of women in reform and education"],
        8: ["Rise of nationalism in India", "Formation of Indian National Congress", "Moderates, extremists, and their methods", "Partition of Bengal, Swadeshi and Boycott", "Gandhian era movements (Non-Cooperation, Civil Disobedience, Quit India)", "Role of revolutionaries and other leaders", "Towards Independence and Partition"]
      },
      Civics: {
        1: ["Importance and features of the Constitution", "Fundamental Rights and Duties", "Directive Principles of State Policy", "Role of the Constitution in democracy"],
        2: ["Meaning of secularism", "Secularism in India", "Importance of religious tolerance", "Role of the State in maintaining secularism"],
        3: ["Why do we need a Parliament?", "Two Houses of Parliament (Lok Sabha, Rajya Sabha)", "Law-making process in Parliament", "Role of the President in legislation"],
        4: ["Structure of the Indian judiciary", "Independence of the judiciary", "Judicial review and judicial activism", "Public Interest Litigation (PIL)"],
        5: ["Concept of marginalisation", "Marginalised groups in India (Adivasis, Dalits, Minorities)", "Issues faced by marginalised communities"],
        6: ["Safeguards in the Constitution for marginalised groups", "Laws protecting marginalised communities", "Role of social reformers and activists"],
        7: ["Importance of public facilities (water, healthcare, education, transport)", "Role of the government in providing facilities", "Issues of inequality in access to facilities"],
        8: ["Need for laws to ensure social justice", "Workers' rights and protection laws", "Child labour and related legislation", "Role of government in ensuring justice"]
      },
      Geography: {
        1: ["Types of resources (natural, human-made, human)", "Classification: renewable, non-renewable, ubiquitous, localized", "Resource conservation and sustainable development"],
        2: ["Land use and land degradation", "Soil types and soil conservation", "Water resources and conservation methods", "Natural vegetation types and importance", "Wildlife resources and conservation"],
        3: ["Types of farming (subsistence, intensive, commercial, plantation)", "Major crops (rice, wheat, cotton, sugarcane, tea, coffee, etc.)", "Agricultural development in different countries", "Impact of technology on agriculture"],
        4: ["Types of industries (raw material-based, size-based, ownership-based)", "Factors affecting location of industries", "Major industrial regions of the world", "Case studies: IT industry (Bangalore), Cotton textile industry (Ahmedabad/Osaka)"],
        5: ["Population distribution and density", "Factors influencing population distribution", "Population change (birth rate, death rate, migration)", "Population pyramid", "Importance of human resources for development"]
      }
    },
    '9': {
      Computer: {
        1: [
          "Introduction to computer system",
          "Components: Input devices, Output devices, Storage devices, CPU",
          "Memory types: Primary, Secondary, Cache",
          "Number system basics: binary, decimal, conversion",
          "Difference between hardware, software, firmware"
        ],
        2: [
          "What is software?",
          "Categories: System software, Utility software, Application software, Programming software",
          "Open-source vs Proprietary",
          "Freeware, Shareware, Licensed software"
        ],
        3: [
          "Definition and importance of OS",
          "Functions: Process management, Memory management, File management, Device management",
          "User interface (CLI vs GUI)",
          "Types: Batch, Time-sharing, Real-time, Distributed",
          "Popular examples: Windows, Linux, Android"
        ],
        4: [
          "Introduction to Python & its features",
          "Writing and running Python programs",
          "Variables, data types, operators",
          "Control structures: if, if-else, elif; loops: for, while",
          "Functions (introductory)"
        ],
        5: [
          "What is cyber security?",
          "Types of cyber threats: Malware, Viruses, Worms, Phishing, Ransomware, Spyware, Trojans",
          "Cyber safety measures: Strong passwords, 2FA, Firewalls, antivirus, backups",
          "Cyber ethics and responsible digital behavior",
          "Awareness of cyber laws (basic introduction to IT Act in India)"
        ]
      },
      English: {
        1: [
          "The Fun They Had: Futuristic setting, comprehension",
          "The Sound of Music: Inspiration, biography",
          "The Little Girl: Family relationships",
          "A Truly Beautiful Mind: Biography, Albert Einstein",
          "The Snake and the Mirror: Irony, humour",
          "My Childhood: Autobiography, Dr. A.P.J. Abdul Kalam",
          "Reach for the Top: Inspiration, character sketch",
          "Kathmandu: Travelogue",
          "If I Were You: Play, dialogue comprehension"
        ],
        2: [
          "The Road Not Taken: Choices, symbolism",
          "Wind: Nature, strength",
          "Rain on the Roof: Imagery, childhood memories",
          "The Lake Isle of Innisfree: Peace, nature imagery",
          "A Legend of the Northland: Ballad, moral",
          "No Men Are Foreign: Universal brotherhood",
          "On Killing a Tree: Nature, destruction",
          "A Slumber Did My Spirit Seal: Theme of death, imagery"
        ],
        3: [
          "The Lost Child: Childhood, emotions",
          "The Adventures of Toto: Humour, pet story",
          "Iswaran the Storyteller: Imaginative storytelling",
          "In the Kingdom of Fools: Folk tale, humour",
          "The Happy Prince: Allegory, sacrifice",
          "The Last Leaf: Hope, sacrifice",
          "A House is Not a Home: Autobiographical, resilience",
          "The Beggar: Compassion, transformation"
        ]
      },
      Maths: {
        1: ["Real Numbers"],
        2: ["Polynomials", "Linear Equations in Two Variables"],
        3: ["Coordinate Geometry"],
        4: ["Introduction to Euclid's Geometry", "Lines and Angles", "Triangles", "Quadrilaterals", "Circles"],
        5: ["Areas", "Surface Areas and Volumes"],
        6: ["Statistics"]
      },
      Science: {
        1: ["States of matter", "Properties of solids, liquids, and gases", "Changes of state"],
        2: ["Mixtures, solutions, alloys", "Separation techniques"],
        3: ["Laws of chemical combination", "Atomic and molecular masses", "Mole concept"],
        4: ["Discovery of electron, proton, neutron", "Atomic models"],
        5: ["Cell structure", "Cell organelles", "Cell functions"],
        6: ["Plant tissues", "Animal tissues"],
        7: ["Classification of organisms", "Kingdom Monera, Protista, Fungi"],
        8: ["Plant kingdom", "Angiosperms, Gymnosperms"],
        9: ["Animal kingdom", "Classification of animals"],
        10: ["Distance, displacement, speed, velocity", "Acceleration, uniform and non-uniform motion"],
        11: ["Newton's laws", "Momentum, force, and inertia"],
        12: ["Universal law of gravitation", "Acceleration due to gravity", "Free fall"],
        13: ["Work done", "Kinetic and potential energy", "Power"],
        14: ["Propagation of sound", "Characteristics", "Echo"],
        15: ["Health and diseases", "Pathogens", "Immunity and vaccination"],
        16: ["Air, water, soil, forests, minerals", "Conservation"],
        17: ["Crop varieties", "Animal husbandry", "Food processing"]
      },
      History: {
        1: [
          "French society in the late 18th century",
          "The outbreak of the Revolution",
          "France becomes a constitutional monarchy",
          "The Reign of Terror",
          "The rise of Napoleon",
          "Impact of the Revolution on France and the world"
        ],
        2: [
          "Age of social change in Europe",
          "The Russian Empire in 1914",
          "The February Revolution",
          "The October Revolution and Bolsheviks in power",
          "Stalinism and collectivisation",
          "Industrial society and social change",
          "Global influence of the Russian Revolution"
        ],
        3: [
          "Birth of the Weimar Republic",
          "Hitler's rise to power",
          "Nazi ideology and propaganda",
          "Establishment of a Nazi state",
          "Role of youth in Nazi Germany",
          "Racial policies and Holocaust",
          "Crimes against humanity"
        ],
        4: [
          "Deforestation under colonial rule",
          "Rise of commercial forestry",
          "Rebellions in forests (Bastar, Java)",
          "Impact on local communities"
        ],
        5: [
          "Pastoralism as a way of life",
          "Colonial impact on pastoral communities",
          "Case studies– Maasai (Africa), Raikas (India)",
          "Pastoralism in modern times"
        ]
      },
      Geography: {
        1: ["Location and extent of India", "India and its neighbours", "Significance of India's location"],
        2: ["Formation of physiographic divisions", "Himalayas", "Northern Plains", "Peninsular Plateau", "Indian Desert", "Coastal Plains", "Islands"],
        3: ["Himalayan river systems", "Peninsular river systems", "Role and importance of rivers", "Lakes in India", "River pollution and conservation"],
        4: ["Factors influencing climate", "Monsoon mechanism", "Seasons in India", "Rainfall distribution", "Monsoon as a unifying bond"],
        5: ["Types of vegetation in India", "Distribution of forests", "Wildlife species", "Conservation of forests and wildlife"],
        6: ["Size and distribution of population", "Population growth and processes (birth, death, migration)", "Age composition", "Sex ratio", "Literacy rate", "Population as an asset vs liability"]
      },
      Civics: {
        1: ["Meaning of democracy", "Main features of democracy", "Arguments for and against democracy", "Broader meaning of democracy"],
        2: ["Democratic Constitution in South Africa", "Why a Constitution is needed", "Making of the Indian Constitution", "Guiding values of the Constitution"],
        3: ["Why elections are needed", "Indian election system", "Free and fair elections", "Role of the Election Commission"],
        4: ["Parliament and its role", "The Executive– President, Prime Minister, Council of Ministers", "Lok Sabha and Rajya Sabha", "The Judiciary", "Decision-making process in democracy"],
        5: ["Importance of rights in democracy", "Fundamental Rights in the Indian Constitution", "Right to Equality, Freedom, Religion, Education, Remedies", "Rights in practice– case studies"]
      },
      Economics: {
        1: ["Farming and non-farming activities", "Factors of production (land, labour, capital, entrepreneurship)", "Organisation of production"],
        2: ["People as an asset vs liability", "Role of education in human capital formation", "Role of health in human capital", "Unemployment and its types", "Role of women and children in the economy"],
        3: ["Two typical cases of poverty", "Poverty trends in India", "Causes of poverty", "Anti-poverty measures and programmes"],
        4: ["Meaning and need for food security", "Dimensions of food security", "Public Distribution System (PDS)", "Role of cooperatives and government programmes"]
      }
    },
    '10': {
      Computer: {
        1: ["Introduction to Computer Systems",
            "Number systems: binary, decimal, octal, hexadecimal",
            "Logic gates: AND, OR, NOT (truth tables)",
            "Computer hardware components: input, output, storage, CPU",
            "Types of memory: primary, secondary, cache, virtual memory",
            "Software overview: System, Application, Utilities",
            "Computer networks: LAN, MAN, WAN, Internet, intranet, extranet",
            "Data transmission: wired vs wireless",
            "Cloud computing basics",
            "Emerging technologies: AI, IoT, Big Data (introductory)"],
        2: ["Introduction to GIMP interface",
            "Layers and layer management",
            "Image editing tools: crop, scale, rotate, flip, perspective",
            "Color tools: brightness/contrast, hue/saturation, levels, curves",
            "Selection tools: free select, fuzzy select, paths",
            "Using filters and effects",
            "Working with text in GIMP",
            "Creating banners, posters, digital artwork",
            "Exporting images in different formats"],
        3: ["Introduction to HTML tables",
            "Table structure: <table>, <tr>, <td>, <th>",
            "Attributes: border, cellpadding, cellspacing, align, width, height",
            "Rowspan and Colspan",
            "Adding captions, Nested tables",
            "Styling tables with CSS"],
        4: ["Introduction to forms",
            "Form elements: Textbox, Password, Radio buttons, Checkboxes, Dropdown, Text area, Buttons",
            "Attributes: name, value, placeholder, required",
            "Form validation (basic HTML5)",
            "Form action and method (GET, POST)",
            "Simple login/registration forms"],
        5: ["Dynamic HTML: HTML + CSS + JavaScript",
            "Role of JavaScript in interactive pages",
            "Examples: rollover images, dynamic content updates",
            "CSS types: Inline, Internal, External",
            "CSS syntax: selectors, properties, values",
            "Styling text, backgrounds, borders, box model",
            "Positioning: static, relative, absolute, fixed",
            "Pseudo classes: :hover, :active, :first-child",
            "CSS for tables and forms"]
      },
      English: {
        1: ["A Letter to God: Faith, irony",
            "Nelson Mandela: Long Walk to Freedom: Biography, freedom struggle",
            "From the Diary of Anne Frank: Diary, war, resilience",
            "Glimpses of India: Travel, culture",
            "Madam Rides the Bus: Childhood curiosity",
            "The Sermon at Benares: Teachings of Buddha",
            "Mijbil the Otter: Pet story, humour",
            "The Proposal: One-act play, satire"],
        2: ["Dust of Snow: Symbolism, nature",
            "Fire and Ice: Symbolism, theme of destruction",
            "The Ball Poem: Childhood loss, learning",
            "A Tiger in the Zoo: Freedom vs captivity",
            "How to Tell Wild Animals: Humour, description",
            "The Trees: Environment, imagery",
            "Fog: Metaphor, imagery",
            "The Tale of Custard the Dragon: Humour, rhyme",
            "For Anne Gregory: Beauty, inner vs outer"],
        3: ["A Triumph of Surgery: Pet story, care",
            "The Thief's Story: Trust, honesty",
            "The Midnight Visitor: Detective, suspense",
            "A Question of Trust: Irony, theft",
            "Footprints Without Feet: Science fiction, invisibility",
            "The Making of a Scientist: Biography, Richard Ebright",
            "The Necklace: Irony, fate",
            "Bholi: Education, empowerment",
            "The Book That Saved the Earth: Science fiction, humour"]
      },
      Maths: {
        1: ["Real Number"],
        2: ["Polynomials", "Pair of Linear Equations in Two Variables", "Quadratic Equations", "Arithmetic Progressions"],
        3: ["Coordinate Geometry"],
        4: ["Triangles", "Circles"],
        5: ["Introduction to Trigonometry", "Trigonometric Identities", "Heights and Distances"],
        6: ["Areas Related to Circles", "Surface Areas and Volumes"],
        7: ["Statistics", "Probability"]
      },
      Science: {
        1: ["Types of Chemical Reactions", "Writing and Balancing Chemical Equations", "Effects of Oxidation and Reduction", "Types of Oxidizing and Reducing Agents"],
        2: ["Properties of Acids and Bases", "pH Scale", "Uses of Acids and Bases"],
        3: ["Properties of Metals and Non-Metals", "Reactivity Series of Metals", "Occurrence and Extraction of Metals", "Corrosion of Metals", "Uses of Metals and Non-Metals"],
        4: ["Covalent Bonding", "Homologous Series", "Saturated and Unsaturated Compounds", "Functional Groups", "Important Carbon Compounds and Their Uses"],
        5: ["Mendeleev's Periodic Table", "Modern Periodic Table", "Properties of Elements in Groups", "Properties of Elements in Periods"],
        6: ["Nutrition", "Respiration", "Excretion"],
        7: ["Nervous System", "Hormones"],
        8: ["Modes of Reproduction", "Reproductive Health"],
        9: ["Mendel's Experiments", "Evolution Theories"],
        10: ["Mirror & Lens Formulas", "Applications"],
        11: ["Human Eye", "Colourful World"],
        12: ["Ohm's Law", "Series & Parallel Circuits"],
        13: ["Electromagnetism", "Applications"],
        14: ["Conventional Sources of Energy", "Non-Conventional Sources of Energy"],
        15: ["Ecosystem", "Ozone Layer"],
        16: ["Forest & Wildlife", "Water Management"]
      },
      History: {
        1: ["French Revolution and the idea of the nation", "The making of nationalism in Europe", "The age of revolutions: 1830–1848", "The making of Germany and Italy", "Visualising the nation– nationalism and imperialism"],
        2: ["First World War and nationalism in India", "The Non-Cooperation Movement", "Differing strands within the movement", "Civil Disobedience Movement", "The sense of collective belonging"],
        3: ["The pre-modern world", "The nineteenth century (1815–1914)", "The inter-war economy", "Rebuilding a world economy: post–1945"],
        4: ["Before the Industrial Revolution", "Hand labour and steam power", "Industrialisation in the colonies", "Factories come up", "The peculiarities of industrial growth", "Market for goods"],
        5: ["The first printed books", "Print comes to Europe", "The print revolution and its impact", "The reading mania", "The nineteenth century and print", "India and the world of print", "Religious reform and public debates", "New forms of publication and literature"]
      },
      Geography: {
        1: ["Types of resources– natural, human, sustainable", "Development of resources", "Resource planning in India", "Land resources and land use patterns", "Land degradation and conservation measures", "Soil as a resource– classification, distribution, conservation"],
        2: ["Flora and fauna in India", "Types and distribution of forests", "Depletion of forests and conservation", "Forest conservation movements (Chipko, Beej Bachao Andolan)", "Government initiatives– IUCN, Indian Wildlife Protection Act"],
        3: ["Water scarcity and its causes", "Multipurpose river projects and integrated water resources management", "Rainwater harvesting"],
        4: ["Types of farming", "Cropping patterns (Kharif, Rabi, Zaid)", "Major crops (rice, wheat, maize, pulses, oilseeds, sugarcane, cotton, jute)", "Technological and institutional reforms", "Contribution of agriculture to the national economy"],
        5: ["Types of minerals and their distribution", "Uses of minerals", "Conventional sources of energy– coal, petroleum, natural gas, electricity", "Non-conventional sources of energy– solar, wind, tidal, geothermal, nuclear", "Conservation of energy resources"],
        6: ["Importance of manufacturing", "Industrial location factors", "Classification of industries (based on size, ownership, raw material, product)", "Major industries– cotton, jute, iron and steel, aluminium, chemical, fertiliser, cement, automobile, IT", "Industrial pollution and environmental degradation", "Control of environmental degradation"],
        7: ["Roadways", "Railways", "Pipelines", "Waterways", "Airways", "Communication systems", "International trade"]
      },
      Civics: {
        1: ["Ethnic composition of Belgium and Sri Lanka", "Majoritarianism in Sri Lanka", "Accommodation in Belgium", "Why power sharing is desirable", "Forms of power sharing"],
        2: ["What makes India a federal country", "Features of federalism", "Division of powers between Union and State", "Decentralisation in India– 73rd and 74th Amendments"],
        3: ["Gender and politics", "Religion and politics", "Caste and politics"],
        4: ["Why do we need political parties?", "Functions of political parties", "National parties and state parties", "Challenges to political parties", "How can parties be reformed?"],
        5: ["How do we assess democracy's outcomes?", "Accountable, responsive and legitimate government", "Economic growth and development", "Reduction of inequality and poverty", "Accommodation of social diversity", "Dignity and freedom of the citizens"]
      },
      Economics: {
        1: ["What development promises– different people, different goals", "Income and other goals", "National development and per capita income", "Public facilities", "Sustainability of development"],
        2: ["Primary, secondary and tertiary sectors", "Historical change in sectors", "Rising importance of tertiary sector", "Division of sectors as organised and unorganised", "Employment trends"],
        3: ["Role of money in the economy", "Formal and informal sources of credit", "Self-Help Groups (SHGs)", "Credit and its terms"],
        4: ["Production across countries", "Interlinking of production across countries", "Foreign trade and integration of markets", "Globalisation and its impact", "Role of WTO", "Struggle for fair globalisation"],
        5: ["Consumer movement in India", "Consumer rights and duties", "Consumer awareness", "Role of consumer forums and NGOs"]
      }
    },
  };




  const handleSubjectClick = (subjectName) => {
    setSelectedSubject(subjectName);
    setExpandedChapters({});
    if (isMobile) setSidebarOpen(false);
    navigate(`/learn/class${currentClass}?subject=${subjectName}`);
  };

  const toggleChapterExpansion = (chapterNumber) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterNumber]: !prev[chapterNumber],
    }));
  };

  const handleChapterClick = (chapterNumber, chapterTitle) => {
    navigate(`/lesson/class${currentClass}/${selectedSubject}/${chapterNumber}?chapterTitle=${encodeURIComponent(chapterTitle)}`);
  };

  const handleSubtopicClick = (chapterNumber, subtopicIndex, chapterTitle, subtopicName) => {
    navigate(`/lesson/class${currentClass}/${selectedSubject}/${chapterNumber}?chapterTitle=${encodeURIComponent(chapterTitle)}&subtopic=${encodeURIComponent(subtopicName)}`);
  };

  const currentChapters = allChapters[currentClass]?.[selectedSubject] || [];


  const getSubjectDescription = (subject) => {
    const descriptions = {
      Maths:
        "Explore mathematical concepts, algebra, geometry and problem-solving skills.",
      Science:
        "Discover the wonders of physics, chemistry, and biology through experiments.",
      English:
        "Develop language skills through literature, grammar, and creative writing.",
      History:
        "Learn about civilizations, empires, and how societies evolved through time.",
      Civics:
        "Understand rights, duties, and how governments function in modern society.",
      Geography:
        "Explore the Earth, its landforms, and environmental systems and processes.",
      Economics:
        "Learn the basics of money, trade, production, and global economy.",
      Computer:
        "Learn computer basics, software applications, and digital literacy skills.",
    };
    return descriptions[subject] || "Explore the chapters and lessons.";
  };


  const classOptions = [
    { id: '7', label: 'Class 7' },
    { id: '8', label: 'Class 8' },
    { id: '9', label: 'Class 9' },
    { id: '10', label: 'Class 10' },
  ];

  const handleClassChange = (e) => {
    const classId = e.target.value;
    console.log('Navigating to class:', classId);
    setExpandedChapters({});
    setSelectedSubject('Maths');
    navigate(`/learn/class${classId}?subject=Maths`, { replace: false });
  };

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        margin: 0,
        padding: 0,
        backgroundColor: '#f8f9fa',
        paddingTop: '80px',
      }}
    >
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
        {/* Sidebar */}
        <div
          style={{
            width: isTablet ? '200px' : '260px',
            backgroundColor: 'white',
            borderRight: '1px solid #e5e7eb',
            padding: '16px',
            position: isMobile ? 'fixed' : 'relative',
            top: isMobile ? '80px' : 0,
            left: 0,
            height: isMobile ? 'calc(100% - 80px)' : '100%',
            zIndex: 1000,
            transform: isMobile ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
            transition: 'transform 0.3s ease',
          }}
        >
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                marginBottom: '16px',
                background: '#0f766e',
                color: 'white',
                border: 'none',
                padding: '8px',
                borderRadius: '6px',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              <X size={20} /> Close
            </button>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {subjects.map((subject, index) => {
              const IconComponent = subject.icon;
              const isSelected = selectedSubject === subject.name;
              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#0f766e' : 'transparent',
                    color: isSelected ? 'white' : '#374151',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => handleSubjectClick(subject.name)}
                >
                  <IconComponent size={20} style={{ marginRight: '12px' }} />
                  <span style={{ fontWeight: '500', fontSize: '15px' }}>
                    {subject.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Overlay for mobile sidebar */}
        {isMobile && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed',
              top: '80px',
              left: 0,
              width: '100%',
              height: 'calc(100% - 80px)',
              backgroundColor: 'rgba(0,0,0,0.4)',
              zIndex: 999,
            }}
          />
        )}

        {/* Main Content */}
        <div style={{ flex: 1, padding: isMobile ? '16px' : '32px' }}>
          {isMobile && !sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                marginBottom: '16px',
                background: '#0f766e',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              <Menu size={20} /> Menu
            </button>
          )}

          {/* Subject Title */}
          <div style={{ marginBottom: '32px' }}>
            <h1
              style={{
                fontSize: isMobile ? '28px' : '48px',
                fontWeight: 'bold',
                color: '#4299e1',
                margin: '0 0 8px 0',
              }}
            >
              {selectedSubject} (Class {currentClass})
            </h1>
            <p
              style={{
                color: '#6b7280',
                fontSize: '16px',
                margin: 0,
              }}
            >
              {getSubjectDescription(selectedSubject)}
            </p>
          </div>

    

{/* /* Chapters Section */ }
<div>
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      marginBottom: '24px',
      paddingBottom: '12px',
    }}
  >
    <h2
      style={{
        fontSize: isMobile ? '22px' : '32px',
        fontWeight: 'bold',
        color: '#1f2937',
        margin: 0,
      }}
    >
      Chapters
    </h2>
    <span
      style={{
        marginLeft: '8px',
        color: '#6b7280',
        fontSize: '16px',
      }}
    >
      ({currentChapters.length} chapters)
    </span>
  </div>

  {/* Show expandable chapters for ALL classes including Class 7 */}
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}
  >
    {currentChapters.map((chapter) => {
      const isExpanded = !!expandedChapters[chapter.number];
      const chapterSubtopics =
        subtopics?.[currentClass]?.[selectedSubject]?.[chapter.number] || [];

      return (
        <div
          key={chapter.number}
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            padding: '12px 16px',
          }}
        >
          <div
            style={{
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            onClick={() => toggleChapterExpansion(chapter.number)}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#ddd6fe',
                  color: '#7c3aed',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                }}
              >
                {chapter.number}
              </div>
              <span
                style={{
                  fontWeight: '600',
                  fontSize: '16px',
                  color: '#1f2937',
                }}
              >
                {chapter.title}
              </span>
            </div>
            <ChevronRight
              size={20}
              style={{
                color: isExpanded ? '#0f766e' : '#9ca3af',
                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }}
            />
          </div>

          {isExpanded && chapterSubtopics.length > 0 && (
            <div
              style={{
                marginTop: '12px',
                paddingLeft: '52px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              {chapterSubtopics.map((subtopic, index) => (
                <div
                  key={index}
                  style={{
                    cursor: 'pointer',
                    color: '#4299e1',
                    fontWeight: '500',
                    fontSize: '14px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    transition: 'background-color 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  onClick={() => handleSubtopicClick(chapter.number, index, chapter.title, subtopic)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e0f2fe';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <List size={16} /> {subtopic}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    })}
  </div>
</div>
            </div>
                        </div>

    </div>
  );
};

export default Learn;



