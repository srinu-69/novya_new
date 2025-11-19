# # from fastapi import FastAPI, HTTPException, Request
# # from fastapi.responses import JSONResponse
# # from fastapi.middleware.cors import CORSMiddleware
# # from pydantic import BaseModel
# # from dotenv import load_dotenv
# # import os, json, re, random
# # import logging
# # from openai import OpenAI
# # from typing import Dict, List, Optional, Tuple

# # # Configure logging
# # logging.basicConfig(level=logging.INFO)
# # logger = logging.getLogger(__name__)

# # load_dotenv()
# # API_KEY = os.getenv("OPENROUTER_API_KEY")
# # if not API_KEY:
# #     logger.error("OPENROUTER_API_KEY not found in environment variables")
# #     API_KEY = "invalid_key"  # Set a placeholder to prevent startup crash

# # # Initialize client with error handling
# # try:
# #     client = OpenAI(api_key=API_KEY, base_url="https://openrouter.ai/api/v1")
# #     logger.info("OpenAI client initialized successfully")
# # except Exception as e:
# #     logger.error(f"Failed to initialize OpenAI client: {e}")
# #     client = None

# # app = FastAPI()

# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=["*"],
# #     allow_credentials=True,
# #     allow_methods=["*"],
# #     allow_headers=["*"],
# # )

# # # Pydantic Models
# # class ChatRequest(BaseModel):
# #     class_level: str
# #     subject: str
# #     chapter: str
# #     student_question: str
# #     chat_history: Optional[List[Dict]] = None

# # class StudyPlanRequest(BaseModel):
# #     class_level: str
# #     subject: str
# #     chapter: str
# #     days_available: int = 7
# #     hours_per_day: int = 2

# # class NotesRequest(BaseModel):
# #     class_level: str
# #     subject: str
# #     chapter: str
# #     specific_topic: Optional[str] = None
# # # Corrected CBSE 7th–10th Computers & English units & topics (for quickpractice)
# # CHAPTERS_DETAILED = {
# #     "7th": {
# #     "Computers": {
# #         " Chapter 1: Programming Language": [
# #             "What is a programming language?",
# #             "Types: Low-level vs High-level languages",
# #             "Examples and real-world uses",
# #             "Simple pseudocode or introduction to programming logic"
# #         ],
# #         "Chapter 2: Editing Text in Microsoft Word": [
# #             "Creating, saving, and opening documents",
# #             "Text formatting: fonts, sizes, colors, bold, italics",
# #             "Paragraph alignment, bullets, numbering",
# #             "Inserting images, tables, and hyperlinks"
# #         ],
# #         "Chapter 3: Microsoft PowerPoint": [
# #             "Creating slides and using slide layouts",
# #             "Adding and editing text and images",
# #             "Applying themes and transitions",
# #             "Running a slideshow"
# #         ],
# #         "Chapter 4: Basics of Microsoft Excel": [
# #             "Entering and formatting data in cells",
# #             "Basic formulas (SUM, AVERAGE)",
# #             "Creating charts from data",
# #             "Simple data organization (sorting and filtering)"
# #         ],
# #         "Chapter 5: Microsoft Access": [
# #             "Understanding databases and tables",
# #             "Creating a simple database",
# #             "Adding, editing, and searching records",
# #             "Basic queries"
# #         ]
# #     },
# #     "English": {
# #         "Chapter 1: Learning Together": [
# #             "The Day the River Spoke: Sentence completion, onomatopoeia, fill-in-the-blanks, prepositions",
# #             "Try Again: Phrases, metaphor and simile",
# #             "Three Days to See: Modal verbs, descriptive paragraph writing"
# #         ],
# #         "Chapter 2: Wit and Humour": [
# #             "Animals, Birds, and Dr. Dolittle: Compound words, palindrome, present perfect tense, notice writing",
# #             "A Funny Man: Phrasal verbs, adverbs and prepositions",
# #             "Say the Right Thing: Suffixes, verb forms, tenses, kinds of sentences"
# #         ],
# #         "Chapter 3: Dreams & Discoveries": [
# #             "My Brother's Great Invention: Onomatopoeia, binomials, phrasal verbs, idioms, simple past and past perfect tense",
# #             "Paper Boats: Antonyms (opposites), diary entry writing",
# #             "North, South, East, West: Associate words with meanings, subject-verb agreement, letter format (leave application)"
# #         ],
# #         "Chapter 4: Travel and Adventure": [
# #             "The Tunnel: Phrases, onomatopoeia, punctuation, descriptive paragraph writing",
# #             "Travel: Onomatopoeia",
# #             "Conquering the Summit: Phrases, parts of speech, articles, formal letter writing"
# #         ],
# #         "Chapter 5: Bravehearts": [
# #             "A Homage to Our Brave Soldiers: Prefix and root words, main clause, subordinate clause, subordinating conjunctions",
# #             "My Dear Soldiers: Collocations",
# #             "Rani Abbakka: Fill-in-the-blanks (spelling), speech (direct & indirect)"
# #         ]
# #     },
# #     "Mathematics": {
# #         "Chapter 1: Integers": [
# #             "Properties of addition and subtraction of integers",
# #             "Multiplication of integers",
# #             "Properties of multiplication of integers",
# #             "Division of integers",
# #             "Properties of division of integers"
# #         ],
# #         "Chapter 2: Fractions and Decimals": [
# #             "Multiplication of fractions",
# #             "Division of fractions",
# #             "Multiplication of decimal numbers",
# #             "Division of decimal numbers"
# #         ],
# #         "Chapter 3: Data Handling": [
# #             "Representative values",
# #             "Arithmetic mean",
# #             "Mode",
# #             "Median",
# #             "Use of bar graphs with different purposes"
# #         ],
# #         "Chapter 4: Simple Equations": [
# #             "A mind-reading game (intro activity)",
# #             "Setting up an equation",
# #             "What is an equation?",
# #             "More equations",
# #             "Application of simple equations to practical situations"
# #         ],
# #         "Chapter 5: Lines and Angles": [
# #             "Introduction and related angles",
# #             "Pairs of lines",
# #             "Checking for parallel lines"
# #         ],
# #         "Chapter 6: The Triangle and Its Properties": [
# #             "Medians of a triangle",
# #             "Altitudes of a triangle",
# #             "Exterior angle and its property",
# #             "Angle sum property of a triangle",
# #             "Two special triangles: equilateral and isosceles",
# #             "Sum of lengths of two sides of a triangle",
# #             "Right-angled triangles and Pythagoras' property"
# #         ],
# #         "Chapter 7: Comparing Quantities": [
# #             "Percentage– another way of comparing quantities",
# #             "Uses of percentages",
# #             "Prices related to an item (buying/selling scenarios)",
# #             "Charge given on borrowed money or simple interest"
# #         ],
# #         "Chapter 8: Rational Numbers": [
# #             "Introduction and need for rational numbers",
# #             "Positive and negative rational numbers",
# #             "Rational numbers on the number line",
# #             "Rational numbers in standard form",
# #             "Comparison of rational numbers",
# #             "Rational numbers between two rational numbers",
# #             "Operations on rational numbers"
# #         ],
# #         "Chapter 9: Perimeter and Area": [
# #             "Area of parallelogram",
# #             "Area of triangles",
# #             "Understanding circles (circumference/area)"
# #         ],
# #         "Chapter 10: Algebraic Expressions": [
# #             "Introduction to algebraic expressions",
# #             "Formation of expressions",
# #             "Terms of an expression",
# #             "Like and unlike terms",
# #             "Monomials, binomials, trinomials, polynomials",
# #             "Finding the value of an expression"
# #         ],
# #         "Chapter 11: Exponents and Powers": [
# #             "Introduction to exponents",
# #             "Laws of exponents",
# #             "Miscellaneous examples using laws of exponents",
# #             "Decimal number system",
# #             "Expressing large numbers in standard form"
# #         ],
# #         "Chapter 12: Symmetry": [
# #             "Lines of symmetry for regular polygons",
# #             "Rotational symmetry",
# #             "Line symmetry vs. rotational symmetry"
# #         ],
# #         "Chapter 13: Visualising Solid Shapes": [
# #             "Plane figures vs. solid shapes",
# #             "Faces, edges, vertices of 3D shapes (cubes, cuboids, cones, etc.)",
# #             "Visualisation from different perspectives"
# #         ]
# #     },
# #     "Science": {
# #         "Chapter1: Nutrition in Plants": [
# #             "Photosynthesis",
# #             "Modes of nutrition: Autotrophic, Heterotrophic",
# #             "Saprotrophic nutrition",
# #             "Structure of leaves"
# #         ],
# #         "Chapter2: Nutrition in Animals": [
# #             "Human digestive system",
# #             "Nutrition in different animals",
# #             "Feeding habits"
# #         ],
# #         "Chapter3: Fibre to Fabric": [
# #             "Natural fibres (Cotton, Wool, Silk)",
# #             "Processing of fibres",
# #             "Spinning, Weaving, Knitting"
# #         ],
# #         "Chapter4: Heat": [
# #             "Hot and cold objects",                  
# #             "Measurement of temperature",        
# #             "Laboratory thermometer",         
# #             "Transfer of heat",
# #             "Kinds of clothes we wear in summer and winter"
# #         ],
# #         "Chapter5: Acids, Bases and Salts": [
# #             "Acid and base indicators",
# #             "Natural indicators around us",
# #             "Neutralisation in daily life"
# #         ],
# #         "Chapter6: Physical and Chemical Changes": [
# #             "Changes around us",
# #             "Physical and chemical changes with examples",
# #             "Rusting of iron and its prevention",
# #             "Crystallisation"
# #         ],
# #         "Chapter7: Weather, Climate and Adaptations of Animals": [
# #             "Difference between weather and climate",
# #             "Climate and adaptation",
# #             "Effect of climate on living organisms",
# #             "Polar regions and tropical rainforests"
# #         ],
# #         "Chapter8: Winds, Storms and Cyclones": [
# #             "Air exerts pressure",
# #             "Air expands on heating",
# #             "Wind currents and convection",
# #             "Thunderstorms and cyclones"
# #         ],
# #         "Chapter9: Soil": [
# #             "Soil profile and soil types",
# #             "Properties of soil",
# #             "Soil and crops"
# #         ],
# #         "Chapter10: Respiration in Organisms": [
# #             "Why do we respire?",
# #             "Types of respiration: aerobic and anaerobic",
# #             "Breathing in animals and humans",
# #             "Breathing cycle and rate"
# #         ],
# #         "Chapter11: Transportation in Animals and Plants": [
# #             "Circulatory system: heart, blood, blood vessels",
# #             "Excretion in animals",
# #             "Transport of water and minerals in plants",
# #             "Transpiration"
# #         ],
# #         "Chapter12: Reproduction in Plants": [
# #             "Modes of reproduction: asexual and sexual",
# #             "Vegetative propagation",
# #             "Pollination and fertilisation",
# #             "Seed dispersal"
# #         ],
# #         "Chapter13: Motion and Time": [
# #             "Concept of speed",
# #             "Measurement of time",
# #             "Simple pendulum",
# #             "Distance-time graph"
# #         ],
# #         "Chapter14: Electric Current and Its Effects": [
# #             "Symbols of electric components",
# #             "Heating effect of electric current",
# #             "Magnetic effect of electric current",
# #             "Electromagnet and its uses"
# #         ],
# #         "Chapter15: Light": [
# #             "Reflection of light",
# #             "Plane mirror image formation",
# #             "Spherical mirrors and lenses",
# #             "Uses of lenses"
# #         ],
# #         "Chapter16: Water: A Precious Resource": [
# #             "Availability of water on earth",
# #             "Forms of water",
# #             "Groundwater and water table",
# #             "Water management",
# #             "Water scarcity and conservation"
# #         ],
# #         "Chapter17: Forests: Our Lifeline": [
# #             "Importance of forests",
# #             "Interdependence of plants and animals in forests",
# #             "Deforestation and conservation"
# #         ],
# #         "Chapter18: Wastewater Story": [
# #             "Importance of sanitation",
# #             "Sewage and wastewater treatment",
# #             "Sanitation at public places"
# #         ]
# #     },
# #     "History": {
# #         "Chapter 1: Tracing Changes through a Thousand Years": [
# #             "Maps and how they tell us about history",
# #             "New and old terminologies used by historians",
# #             "Historians and their sources (manuscripts, inscriptions, coins)",
# #             "New social and political groups",
# #             "Region and empire"
# #         ],
# #         "Chapter 2: New Kings and Kingdoms": [
# #             "Emergence of new dynasties",
# #             "Administration in kingdoms",
# #             "Warfare for wealth and power",
# #             "Prashastis and land grants"
# #         ],
# #         "Chapter 3: The Delhi Sultans (12th–15th Century)": [
# #             "Political and military expansion under rulers",
# #             "Administration and consolidation",
# #             "Construction of mosques and cities",
# #             "Raziya Sultan and Muhammad Tughlaq case studies"
# #         ],
# #         "Chapter 4: The Mughal Empire (16th–17th Century)": [
# #             "Establishment and expansion of the Mughal Empire",
# #             "Akbar's policies and administration (Mansabdari system, sulh-i-kul)",
# #             "Jahangir, Shah Jahan, Aurangzeb",
# #             "Relations with other rulers"
# #         ],
# #         "Chapter 5: Rulers and Buildings / Tribes, Nomads and Settled Communities": [
# #             "Tribal societies and their lifestyle",
# #             "Nomadic pastoralists",
# #             "Emergence of new caste-based communities",
# #             "Interaction between nomads and settled societies"
# #         ],
# #         "Chapter 6: Devotional Paths to the Divine": [
# #             "Bhakti movement and saints (Basavanna, Kabir, Mirabai, etc.)",
# #             "Sufi traditions",
# #             "New religious developments in different regions"
# #         ],
# #         "Chapter 7: The Making of Regional Cultures": [
# #             "Language, literature, and regional identity",
# #             "Regional art, dance, and music forms",
# #             "Case study: Kathak and Manipuri",
# #             "Regional traditions in temple architecture"
# #         ],
# #         "Chapter 8: Eighteenth Century Political Formations": [
# #             "Decline of the Mughal Empire",
# #             "Emergence of new independent kingdoms",
# #             "Marathas, Sikhs, Jats, Rajputs",
# #             "Regional states and their administration"
# #         ]
# #     },
# #     "Civics": {
# #         "Chapter 1: On Equality": [
# #             "Equality in Indian democracy",
# #             "Issues of inequality (caste, religion, gender, economic)",
# #             "Government efforts to promote equality"
# #         ],
# #         "Chapter 2: Role of the Government in Health": [
# #             "Public health services vs. private health services",
# #             "Importance of healthcare",
# #             "Inequality in access to healthcare",
# #             "Case studies"
# #         ],
# #         "Chapter 3: How the State Government Works": [
# #             "Role of the Governor and Chief Minister",
# #             "State legislature and its functioning",
# #             "Role of MLAs",
# #             "Case study of a state government decision"
# #         ],
# #         "Chapter 4: Growing up as Boys and Girls": [
# #             "Gender roles in society",
# #             "Stereotypes related to boys and girls",
# #             "Experiences of growing up in different societies",
# #             "Equality for women"
# #         ],
# #         "Chapter 5: Women Change the World": [
# #             "Women in education and work",
# #             "Struggles for equality",
# #             "Case studies of women achievers",
# #             "Laws for women's rights"
# #         ],
# #         "Chapter 6: Understanding Media": [
# #             "Role of media in democracy",
# #             "Influence of media on public opinion",
# #             "Commercialisation and bias in media",
# #             "Need for independent media"
# #         ],
# #         "Chapter 7: Markets Around Us": [
# #             "Weekly markets, shops, and malls",
# #             "Chain of markets (producers to consumers)",
# #             "Role of money and middlemen",
# #             "Impact on farmers and small traders"
# #         ],
# #         "Chapter 8: A Shirt in the Market": [
# #             "Process of production and distribution",
# #             "Globalisation and trade",
# #             "Role of traders, exporters, workers",
# #             "Consumer awareness"
# #         ]
# #     },
# #     "Geography": {
# #         "Chapter 1: Environment": [
# #             "Components of environment (natural, human, human-made)",
# #             "Ecosystem",
# #             "Balance in the environment"
# #         ],
# #         "Chapter 2: Inside Our Earth": [
# #             "Layers of the earth (crust, mantle, core)",
# #             "Types of rocks (igneous, sedimentary, metamorphic)",
# #             "Rock cycle",
# #             "Minerals and their uses"
# #         ],
# #         "Chapter 3: Our Changing Earth": [
# #             "Lithosphere movements (earthquakes, volcanoes)",
# #             "Major landform features (mountains, plateaus, plains)",
# #             "Work of rivers, wind, glaciers, sea waves"
# #         ],
# #         "Chapter 4: Air": [
# #             "Composition of atmosphere",
# #             "Structure of atmosphere",
# #             "Weather and climate",
# #             "Distribution of temperature and pressure",
# #             "Wind and moisture"
# #         ],
# #         "Chapter 5: Water": [
# #             "Distribution of water on earth",
# #             "Water cycle",
# #             "Oceans (waves, tides, currents)",
# #             "Importance of water"
# #         ],
# #         "Chapter 6: Human-Environment Interactions– The Tropical and the Subtropical Region": [
# #             "Amazon basin (equatorial region)",
# #             "Ganga-Brahmaputra basin (subtropical region)",
# #             "Life of people in these regions"
# #         ],
# #         "Chapter 7: Life in the Deserts": [
# #             "Hot deserts (Sahara)",
# #             "Cold deserts (Ladakh)",
# #             "Adaptations of people and animals",
# #             "Economic activities in deserts"
# #         ]
# #     }
# # },
# #    "8th": {
# #     "Computers": {
# #         "Chapter:1 Exception Handling in Python": [
# #             "Introduction to errors and exceptions",
# #             "Types of errors: Syntax errors, Runtime errors (exceptions), Logical errors",
# #             "Built-in exceptions (ZeroDivisionError, ValueError, etc.)",
# #             "Using try–except block",
# #             "try–except–else–finally structure",
# #             "Raising exceptions using raise",
# #             "Real-life examples of exception handling (division by zero, invalid input)"
# #         ],
# #         "Chapter:2 File Handling in Python": [
# #             "Introduction to file handling",
# #             "Types of files: Text files, Binary files",
# #             "Opening and closing files (open(), close())",
# #             "File modes (r, w, a, r+)",
# #             "Reading from a file (read(), readline(), readlines())",
# #             "Writing to a file (write(), writelines())",
# #             "File pointer and cursor movement (seek(), tell())",
# #             "Practical applications: saving student records, logs, etc."
# #         ],
# #         "Chapter:3 Stack (Data Structure)": [
# #             "Introduction to stack",
# #             "LIFO principle (Last In First Out)",
# #             "Stack operations: Push, Pop, Peek/Top",
# #             "Stack implementation using list in Python or modules (collections.deque)",
# #             "Applications: Undo operation in editors, Function call management"
# #         ],
# #         "Chapter:4 Queue (Data Structure)": [
# #             "Introduction to queue",
# #             "FIFO principle (First In First Out)",
# #             "Queue operations: Enqueue, Dequeue",
# #             "Types of queues: Simple, Circular, Deque, Priority",
# #             "Implementation in Python using lists or queue module",
# #             "Applications: Printer task scheduling, Customer service systems"
# #         ],
# #         "Chapter:5 Sorting": [
# #             "Importance of sorting in data organization",
# #             "Basic sorting techniques: Bubble Sort, Selection Sort, Insertion Sort",
# #             "Advanced sorting (introductory): Merge Sort, Quick Sort",
# #             "Sorting in Python using built-in methods: sorted() function"
# #         ]
# #     },
# #     "English": {
# #         " Unit:1 Honeydew – Prose": [
# #             "The Best Christmas Present in the World: Narrative comprehension, vocabulary",
# #             "The Tsunami: Disaster narrative, sequencing events",
# #             "Glimpses of the Past: Historical narrative, chronology",
# #             "Bepin Choudhury's Lapse of Memory: Character sketch, irony",
# #             "The Summit Within: Motivation, descriptive writing",
# #             "This is Jody's Fawn: Empathy, moral choice",
# #             "A Visit to Cambridge: Biographical narrative",
# #             "A Short Monsoon Diary: Diary entry style",
# #             "The Great Stone Face – I: Description, prediction",
# #             "The Great Stone Face – II: Conclusion, moral lesson"
# #         ],
# #         "Unit:2 Honeydew – Poems": [
# #             "The Ant and the Cricket: Moral fable, rhyme scheme",
# #             "Geography Lesson: Imagery, meaning",
# #             "Macavity: The Mystery Cat: Humour, personification",
# #             "The Last Bargain: Metaphor, symbolism",
# #             "The School Boy: Theme of education, freedom",
# #             "The Duck and the Kangaroo: Rhyme, humour",
# #             "When I set out for Lyonnesse: Imagination, rhyme",
# #             "On the Grasshopper and Cricket: Nature imagery"
# #         ],
# #         "Unit:3 It So Happened – Supplementary": [
# #             "How the Camel Got His Hump: Fable, character traits",
# #             "Children at Work: Social issue, empathy",
# #             "The Selfish Giant: Allegory, moral theme",
# #             "The Treasure Within: Education, individuality",
# #             "Princess September: Freedom, symbolism",
# #             "The Fight: Conflict resolution",
# #             "The Open Window: Humour, irony",
# #             "Jalebis: Humour, moral lesson",
# #             "The Comet – I: Science fiction, prediction",
# #             "The Comet – II: Resolution, conclusion"
# #         ]
# #     },
# #     "Mathematics": {
# #         "Chapter 1: Rational Numbers": ["Introduction", "Properties of Rational Numbers", "Representation of Rational Numbers on the Number Line", "Rational Number between Two Rational Numbers", "Word Problems"],
# #         "Chapter 2: Linear Equations in One Variable": ["Introduction", "Solving Equations which have Linear Expressions on one Side and Numbers on the other Side", "Some Applications", "Solving Equations having the Variable on both sides", "Some More Applications", "Reducing Equations to Simpler Form", "Equations Reducible to the Linear Form"],
# #         "Chapter 3: Understanding Quadrilaterals": ["Introduction", "Polygons", "Sum of the Measures of the Exterior Angles of a Polygon", "Kinds of Quadrilaterals", "Some Special Parallelograms"],
# #         "Chapter 4: Data Handling": ["Looking for Information", "Organising Data", "Grouping Data", "Circle Graph or Pie Chart", "Chance and Probability"],
# #         "Chapter 5: Squares and Square Roots": ["Introduction", "Properties of Square Numbers", "Some More Interesting Patterns", "Finding the Square of a Number", "Square Roots", "Square Roots of Decimals", "Estimating Square Root"],
# #         "Chapter 6: Cubes and Cube Roots": ["Introduction", "Cubes", "Cubes Roots"],
# #         "Chapter 7: Comparing Quantities": ["Recalling Ratios and Percentages", "Finding the Increase and Decrease Percent", "Finding Discounts", "Prices Related to Buying and Selling (Profit and Loss)", "Sales Tax/Value Added Tax/Goods and Services Tax", "Compound Interest", "Deducing a Formula for Compound Interest", "Rate Compounded Annually or Half Yearly (Semi Annually)", "Applications of Compound Interest Formula"],
# #         "Chapter 8: Algebraic Expressions and Identities": ["What are Expressions?", "Terms, Factors and Coefficients", "Monomials, Binomials and Polynomials", "Like and Unlike Terms", "Addition and Subtraction of Algebraic Expressions", "Multiplication of Algebraic Expressions: Introduction", "Multiplying a Monomial by a Monomial", "Multiplying a Monomial by a Polynomial", "Multiplying a Polynomial by a Polynomial", "What is an Identity?", "Standard Identities", "Applying Identities"],
# #         "Chapter 9: Mensuration": ["Introduction", "Let us Recall", "Area of Trapezium", "Area of General Quadrilateral", "Area of Polygons", "Solid Shapes", "Surface Area of Cube, Cuboid and Cylinder", "Volume of Cube, Cuboid and Cylinder", "Volume and Capacity"],
# #         "Chapter 10: Exponents and Powers": ["Introduction", "Powers with Negative Exponents", "Laws of Exponents", "Use of Exponents to Express Small Numbers in Standard Form"],
# #         "Chapter 11: Direct and Inverse Proportions": ["Introduction", "Direct Proportion", "Inverse Proportion"],
# #         "Chapter 12: Factorisation": ["Introduction", "What is Factorisation?", "Division of Algebraic Expressions", "Division of Algebraic Expressions Continued (Polynomial / Polynomial)", "Can you Find the Error?"],
# #         "Chapter 13: Introduction to Graphs": ["Introduction", "Linear Graphs", "Some Applications"]
# #     },
# #     "Science": {
# #         "Chapter:1 Crop Production and Management": ["Agriculture practices", "Crop production techniques", "Storage and preservation"],
# #         "Chapter:2 Microorganisms: Friend and Foe": ["Bacteria, viruses, fungi", "Useful microbes", "Harmful microbes and diseases"],
# #         "Chapter:3 Synthetic Fibres and Plastics": ["Types of synthetic fibres", "Characteristics and uses", "Plastics: Thermoplastics, Thermosetting"],
# #         "Chapter:4 Materials: Metals and Non-Metals": ["Physical and chemical properties", "Reactivity series", "Uses of metals and non-metals"],
# #         "Chapter:5 Coal and Petroleum": ["Fossil fuels", "Refining petroleum", "Uses of coal and petroleum"],
# #         "Chapter:6 Combustion and Flame": ["Types of combustion", "Structure of flame", "Fire safety"],
# #         "Chapter:7 Conservation of Plants and Animals": ["Biodiversity", "Endangered species", "Wildlife conservation"],
# #         "Chapter:8 Cell – Structure and Functions": ["Plant and animal cell", "Cell organelles", "Cell division"],
# #         "Chapter:9 Reproduction in Animals": ["Modes of reproduction", "Human reproductive system", "Fertilization and development"],
# #         "Chapter:10 Force and Pressure": ["Types of forces", "Pressure in solids, liquids, and gases", "Applications"],
# #         "Chapter:11 Friction": ["Advantages and disadvantages", "Reducing friction"],
# #         "Chapter:12 Sound": ["Production and propagation", "Characteristics of sound", "Human ear"],
# #         "Chapter:13 Chemical Effects of Electric Current": ["Electrolysis", "Applications in daily life"],
# #         "Chapter:14 Some Natural Phenomena": ["Lightning, Earthquakes, and Safety measures"],
# #         "Chapter:15 Light": ["Reflection, refraction, dispersion", "Human eye and defects"],
# #         "Chapter:16 Stars and the Solar System": ["Solar system structure", "Planets, moons, comets, and meteors"],
# #         "Chapter:17 Pollution of Air and Water": ["Causes and effects", "Control measures"]
# #     },
# #     "History": {
# #             "Chapter 1: How, When and Where": ["How do we periodise history?", "Importance of dates and events", "Sources for studying modern history", "Official records of the British administration"],
# #             "Chapter 2: From Trade to Territory– The Company Establishes Power": ["East India Company comes to India", "Establishment of trade centres", "Battle of Plassey and Buxar", "Expansion of British power in India", "Subsidiary alliance and doctrine of lapse"],
# #             "Chapter 3: Ruling the Countryside": ["The revenue system under British rule", "Permanent Settlement, Ryotwari and Mahalwari systems", "Effects of British land revenue policies", "Role of indigo cultivation and indigo revolt"],
# #             "Chapter 4: Tribals, Dikus and the Vision of a Golden Age": ["Tribal societies and their livelihoods", "Impact of British policies on tribal life", "Tribal revolts and resistance", "Birsa Munda and his movement"],
# #             "Chapter 5: When People Rebel– 1857 and After": ["Causes of the revolt of 1857", "Important centres of the revolt", "Leaders and their roles", "Suppression of the revolt", "Consequences and significance"],
# #             "Chapter 6: Civilising the 'Native', Educating the Nation": ["The British view on education in India", "Orientalist vs Anglicist debate", "Macaulay's Minute on Education", "Wood's Despatch", "Growth of national education system"],
# #             "Chapter 7: Women, Caste and Reform": ["Social reform movements in the 19th century", "Reformers and their contributions (Raja Ram Mohan Roy, Ishwar Chandra Vidyasagar, Jyotiba Phule, etc.)", "Movements against caste discrimination", "Role of women in reform and education"],
# #             "Chapter 8: The Making of the National Movement: 1870s–1947": ["Rise of nationalism in India", "Formation of Indian National Congress", "Moderates, extremists, and their methods", "Partition of Bengal, Swadeshi and Boycott", "Gandhian era movements (Non-Cooperation, Civil Disobedience, Quit India)", "Role of revolutionaries and other leaders", "Towards Independence and Partition"]
       
# #     },
# #     "Civics": {
# #             "Chapter 1: The Indian Constitution": ["Importance and features of the Constitution", "Fundamental Rights and Duties", "Directive Principles of State Policy", "Role of the Constitution in democracy"],
# #             "Chapter 2: Understanding Secularism": ["Meaning of secularism", "Secularism in India", "Importance of religious tolerance", "Role of the State in maintaining secularism"],
# #             "Chapter 3: Parliament and the Making of Laws": ["Why do we need a Parliament?", "Two Houses of Parliament (Lok Sabha, Rajya Sabha)", "Law-making process in Parliament", "Role of the President in legislation"],
# #             "Chapter 4: Judiciary": ["Structure of the Indian judiciary", "Independence of the judiciary", "Judicial review and judicial activism", "Public Interest Litigation (PIL)"],
# #             "Chapter 5: Understanding Marginalisation": ["Concept of marginalisation", "Marginalised groups in India (Adivasis, Dalits, Minorities)", "Issues faced by marginalised communities"],
# #             "Chapter 6: Confronting Marginalisation": ["Safeguards in the Constitution for marginalised groups", "Laws protecting marginalised communities", "Role of social reformers and activists"],
# #             "Chapter 7: Public Facilities": ["Importance of public facilities (water, healthcare, education, transport)", "Role of the government in providing facilities", "Issues of inequality in access to facilities"],
# #             "Chapter 8: Law and Social Justice": ["Need for laws to ensure social justice", "Workers' rights and protection laws", "Child labour and related legislation", "Role of government in ensuring justice"]
       
# #     },
# #     "Geography": {
# #             "Chapter 1: Resources": ["Types of resources (natural, human-made, human)", "Classification: renewable, non-renewable, ubiquitous, localized", "Resource conservation and sustainable development"],
# #             "Chapter 2: Land, Soil, Water, Natural Vegetation and Wildlife Resources": ["Land use and land degradation", "Soil types and soil conservation", "Water resources and conservation methods", "Natural vegetation types and importance", "Wildlife resources and conservation"],
# #             "Chapter 3: Agriculture": ["Types of farming (subsistence, intensive, commercial, plantation)", "Major crops (rice, wheat, cotton, sugarcane, tea, coffee, etc.)", "Agricultural development in different countries", "Impact of technology on agriculture"],
# #             "Chapter 4: Industries": ["Types of industries (raw material-based, size-based, ownership-based)", "Factors affecting location of industries", "Major industrial regions of the world", "Case studies: IT industry (Bangalore), Cotton textile industry (Ahmedabad/Osaka)"],
# #             "Chapter 5: Human Resources": ["Population distribution and density", "Factors influencing population distribution", "Population change (birth rate, death rate, migration)", "Population pyramid", "Importance of human resources for development"]
       
# #     }
# # },
# #     "9th": {
# #     "Computers": {
# #         "Chapter:1 Basics of Computer System": [
# #             "Introduction to computer system",
# #             "Components: Input devices, Output devices, Storage devices, CPU",
# #             "Memory types: Primary, Secondary, Cache",
# #             "Number system basics: binary, decimal, conversion",
# #             "Difference between hardware, software, firmware"
# #         ],
# #         "Chapter:2 Types of Software": [
# #             "What is software?",
# #             "Categories: System software, Utility software, Application software, Programming software",
# #             "Open-source vs Proprietary",
# #             "Freeware, Shareware, Licensed software"
# #         ],
# #         "Chapter:3 Operating System": [
# #             "Definition and importance of OS",
# #             "Functions: Process management, Memory management, File management, Device management",
# #             "User interface (CLI vs GUI)",
# #             "Types: Batch, Time-sharing, Real-time, Distributed",
# #             "Popular examples: Windows, Linux, Android"
# #         ],
# #         "Chapter:4 Introduction to Python Programming": [
# #             "Introduction to Python & its features",
# #             "Writing and running Python programs",
# #             "Variables, data types, operators",
# #             "Control structures: if, if-else, elif; loops: for, while",
# #             "Functions (introductory)"
# #         ],
# #         "Chapter:5 Introduction to Cyber Security": [
# #             "What is cyber security?",
# #             "Types of cyber threats: Malware, Viruses, Worms, Phishing, Ransomware, Spyware, Trojans",
# #             "Cyber safety measures: Strong passwords, 2FA, Firewalls, antivirus, backups",
# #             "Cyber ethics and responsible digital behavior",
# #             "Awareness of cyber laws (basic introduction to IT Act in India)"
# #         ]
# #     },
# #     "English": {
# #         "Unit:1 Beehive – Prose": [
# #             "The Fun They Had: Futuristic setting, comprehension",
# #             "The Sound of Music: Inspiration, biography",
# #             "The Little Girl: Family relationships",
# #             "A Truly Beautiful Mind: Biography, Albert Einstein",
# #             "The Snake and the Mirror: Irony, humour",
# #             "My Childhood: Autobiography, Dr. A.P.J. Abdul Kalam",
# #             "Reach for the Top: Inspiration, character sketch",
# #             "Kathmandu: Travelogue",
# #             "If I Were You: Play, dialogue comprehension"
# #         ],
# #         "Unit:2 Beehive – Poems": [
# #             "The Road Not Taken: Choices, symbolism",
# #             "Wind: Nature, strength",
# #             "Rain on the Roof: Imagery, childhood memories",
# #             "The Lake Isle of Innisfree: Peace, nature imagery",
# #             "A Legend of the Northland: Ballad, moral",
# #             "No Men Are Foreign: Universal brotherhood",
# #             "On Killing a Tree: Nature, destruction",
# #             "A Slumber Did My Spirit Seal: Theme of death, imagery"
# #         ],
# #         "Unit:3 Moments – Supplementary": [
# #             "The Lost Child: Childhood, emotions",
# #             "The Adventures of Toto: Humour, pet story",
# #             "Iswaran the Storyteller: Imaginative storytelling",
# #             "In the Kingdom of Fools: Folk tale, humour",
# #             "The Happy Prince: Allegory, sacrifice",
# #             "The Last Leaf: Hope, sacrifice",
# #             "A House is Not a Home: Autobiographical, resilience",
# #             "The Beggar: Compassion, transformation"
# #         ]
# #     },
# #     "Mathematics": {
# #         "Chapter1: Number System": ["Real Numbers"],
# #         "Chapter2: Algebra": ["Polynomials", "Linear Equations in Two Variables"],
# #         "Chapter3: Coordinate Geometry": ["Coordinate Geometry"],
# #         "Chapter4: Geometry": ["Introduction to Euclid's Geometry","Lines and Angles","Triangles","Quadrilaterals","Circles"],
# #         "Chapter5: Mensuration": ["Areas", "Surface Areas and Volumes"],
# #         "Chapter6: Statistics": ["Statistics"]
# #     },
# #     "Science": {
# #         "Chapter:1 Matter in Our Surroundings": ["States of matter", "Properties of solids, liquids, and gases", "Changes of state"],
# #         "Chapter:2 Is Matter Around Us Pure?": ["Mixtures, solutions, alloys", "Separation techniques"],
# #         "Chapter:3 Atoms and Molecules": ["Laws of chemical combination", "Atomic and molecular masses", "Mole concept"],
# #         "Chapter:4 Structure of the Atom": ["Discovery of electron, proton, neutron", "Atomic models"],
# #         "Chapter:5 The Fundamental Unit of Life": ["Cell structure", "Cell organelles", "Cell functions"],
# #         "Chapter:6 Tissues": ["Plant tissues", "Animal tissues"],
# #         "Chapter:7 Diversity of the Living Organisms – I": ["Classification of organisms", "Kingdom Monera, Protista, Fungi"],
# #         "Chapter:8 Diversity of the Living Organisms – II": ["Plant kingdom", "Angiosperms, Gymnosperms"],
# #         "Chapter:9 Diversity of the Living Organisms – III": ["Animal kingdom", "Classification of animals"],
# #         "Chapter:10 Motion": ["Distance, displacement, speed, velocity", "Acceleration, uniform and non-uniform motion"],
# #         "Chapter:11 Force and Laws of Motion": ["Newton's laws", "Momentum, force, and inertia"],
# #         "Chapter:12 Gravitation": ["Universal law of gravitation", "Acceleration due to gravity", "Free fall"],
# #         "Chapter:13 Work and Energy": ["Work done", "Kinetic and potential energy", "Power"],
# #         "Chapter:14 Sound": ["Propagation of sound", "Characteristics", "Echo"],
# #         "Chapter:15 Why Do We Fall Ill?": ["Health and diseases", "Pathogens", "Immunity and vaccination"],
# #         "Chapter:16 Natural Resources": ["Air, water, soil, forests, minerals", "Conservation"],
# #         "Chapter:17 Improvement in Food Resources": ["Crop varieties", "Animal husbandry", "Food processing"]
# #     },
# #     "History": {
# #         "Chapter 1: The French Revolution": [
# #             "French society in the late 18th century",
# #             "The outbreak of the Revolution",
# #             "France becomes a constitutional monarchy",
# #             "The Reign of Terror",
# #             "The rise of Napoleon",
# #             "Impact of the Revolution on France and the world"
# #         ],
# #         "Chapter 2: Socialism in Europe and the Russian Revolution": [
# #             "Age of social change in Europe",
# #             "The Russian Empire in 1914",
# #             "The February Revolution",
# #             "The October Revolution and Bolsheviks in power",
# #             "Stalinism and collectivisation",
# #             "Industrial society and social change",
# #             "Global influence of the Russian Revolution"
# #         ],
# #         "Chapter 3: Nazism and the Rise of Hitler": [
# #             "Birth of the Weimar Republic",
# #             "Hitler's rise to power",
# #             "Nazi ideology and propaganda",
# #             "Establishment of a Nazi state",
# #             "Role of youth in Nazi Germany",
# #             "Racial policies and Holocaust", 
# #             "Crimes against humanity"
# #         ],
# #         "Chapter 4: Forest Society and Colonialism": [
# #             "Deforestation under colonial rule",
# #             "Rise of commercial forestry",  
# #             "Rebellions in forests (Bastar, Java)",
# #             "Impact on local communities"
# #         ],
# #         "Chapter 5: Pastoralists in the Modern World (Periodic Assessment only)": [
# #             "Pastoralism as a way of life",
# #             "Colonial impact on pastoral communities",
# #             "Case studies– Maasai (Africa), Raikas (India)",
# #             "Pastoralism in modern times"
# #         ]
# #     },
# #     "Geography": {
# #         "Chapter 1: India– Size and Location": ["Location and extent of India", "India and its neighbours", "Significance of India's location"],
# #         "Chapter 2: Physical Features of India": [
# #             "Formation of physiographic divisions",
# #             "Himalayas",
# #             "Northern Plains",
# #             "Peninsular Plateau",
# #             "Indian Desert",
# #             "Coastal Plains",
# #             "Islands"
# #         ],
# #         "Chapter 3: Drainage": [
# #             "Himalayan river systems",
# #             "Peninsular river systems",
# #             "Role and importance of rivers",
# #             "Lakes in India",
# #             "River pollution and conservation"
# #         ],
# #         "Chapter 4: Climate": [
# #             "Factors influencing climate",
# #             "Monsoon mechanism",
# #             "Seasons in India",
# #             "Rainfall distribution",
# #             "Monsoon as a unifying bond"
# #         ],
# #         "Chapter 5: Natural Vegetation and Wildlife": [
# #             "Types of vegetation in India",
# #             "Distribution of forests",
# #             "Wildlife species",
# #             "Conservation of forests and wildlife"
# #         ],
# #         "Chapter 6: Population": [
# #             "Size and distribution of population",
# #             "Population growth and processes (birth, death, migration)",
# #             "Age composition",
# #             "Sex ratio",
# #             "Literacy rate",
# #             "Population as an asset vs liability"
# #         ]
# #     },
# #     "Civics": {
# #         "Chapter 1: What is Democracy? Why Democracy?": [
# #             "Meaning of democracy",
# #             "Main features of democracy",
# #             "Arguments for and against democracy",
# #             "Broader meaning of democracy"
# #         ],
# #         "Chapter 2: Constitutional Design": [
# #             "Democratic Constitution in South Africa",
# #             "Why a Constitution is needed",
# #             "Making of the Indian Constitution",
# #             "Guiding values of the Constitution"
# #         ],
# #         "Chapter 3: Electoral Politics": [
# #             "Why elections are needed",
# #             "Indian election system",
# #             "Free and fair elections",
# #             "Role of the Election Commission"
# #         ],
# #         "Chapter 4: Working of Institutions": [
# #             "Parliament and its role",
# #             "The Executive– President, Prime Minister, Council of Ministers",
# #             "Lok Sabha and Rajya Sabha",
# #             "The Judiciary",
# #             "Decision-making process in democracy"
# #         ],
# #         "Chapter 5: Democratic Rights": [
# #             "Importance of rights in democracy",
# #             "Fundamental Rights in the Indian Constitution",
# #             "Right to Equality, Freedom, Religion, Education, Remedies",
# #             "Rights in practice– case studies"
# #         ]
# #     },
# #     "Economics": {
# #         "Chapter 1: The Story of Village Palampur": [
# #             "Farming and non-farming activities",
# #             "Factors of production (land, labour, capital, entrepreneurship)",
# #             "Organisation of production"
# #         ],
# #         "Chapter 2: People as Resource": [
# #             "People as an asset vs liability",
# #             "Role of education in human capital formation",
# #             "Role of health in human capital",
# #             "Unemployment and its types",
# #             "Role of women and children in the economy"
# #         ],
# #         "Chapter 3: Poverty as a Challenge": [
# #             "Two typical cases of poverty",
# #             "Poverty trends in India",
# #             "Causes of poverty",
# #             "Anti-poverty measures and programmes"
# #         ],
# #         "Chapter 4: Food Security in India": [
# #             "Meaning and need for food security",
# #             "Dimensions of food security",
# #             "Public Distribution System (PDS)",
# #             "Role of cooperatives and government programmes"
# #         ]
# #     }
# # },
# #    "10th": {
# #     "Computers": {
# #         "Chapter 1: Computer Fundamentals": [
# #             "Introduction to Computer Systems",
# #             "Number systems: binary, decimal, octal, hexadecimal",
# #             "Logic gates: AND, OR, NOT (truth tables)",
# #             "Computer hardware components: input, output, storage, CPU",
# #             "Types of memory: primary, secondary, cache, virtual memory",
# #             "Software overview: System, Application, Utilities",
# #             "Computer networks: LAN, MAN, WAN, Internet, intranet, extranet",
# #             "Data transmission: wired vs wireless",
# #             "Cloud computing basics",
# #             "Emerging technologies: AI, IoT, Big Data (introductory)"
# #         ],
# #         "Chapter 2: Advanced GIMP (GNU Image Manipulation Program)": [
# #             "Introduction to GIMP interface",
# #             "Layers and layer management",
# #             "Image editing tools: crop, scale, rotate, flip, perspective",
# #             "Color tools: brightness/contrast, hue/saturation, levels, curves",
# #             "Selection tools: free select, fuzzy select, paths",
# #             "Using filters and effects",
# #             "Working with text in GIMP",
# #             "Creating banners, posters, digital artwork",
# #             "Exporting images in different formats"
# #         ],
# #         "Chapter 3: Tables (HTML)": [
# #             "Introduction to HTML tables",
# #             "Table structure: <table>, <tr>, <td>, <th>",
# #             "Attributes: border, cellpadding, cellspacing, align, width, height",
# #             "Rowspan and Colspan",
# #             "Adding captions, Nested tables",
# #             "Styling tables with CSS"
# #         ],
# #         "Chapter 4: Forms (HTML)": [
# #             "Introduction to forms",
# #             "Form elements: Textbox, Password, Radio buttons, Checkboxes, Dropdown, Text area, Buttons",
# #             "Attributes: name, value, placeholder, required",
# #             "Form validation (basic HTML5)",
# #             "Form action and method (GET, POST)",
# #             "Simple login/registration forms"
# #         ],
# #         "Chapter 5: DHTML & CSS": [
# #             "Dynamic HTML: HTML + CSS + JavaScript",
# #             "Role of JavaScript in interactive pages",
# #             "Examples: rollover images, dynamic content updates",
# #             "CSS types: Inline, Internal, External",
# #             "CSS syntax: selectors, properties, values",
# #             "Styling text, backgrounds, borders, box model",
# #             "Positioning: static, relative, absolute, fixed",
# #             "Pseudo classes: :hover, :active, :first-child",
# #             "CSS for tables and forms"
# #         ]
# #     },
# #     "English": {
# #         "Unit1: First Flight – Prose": [
# #             "A Letter to God: Faith, irony",
# #             "Nelson Mandela: Long Walk to Freedom: Biography, freedom struggle",
# #             "From the Diary of Anne Frank: Diary, war, resilience",
# #             "Glimpses of India: Travel, culture",
# #             "Madam Rides the Bus: Childhood curiosity",
# #             "The Sermon at Benares: Teachings of Buddha",
# #             "Mijbil the Otter: Pet story, humour",
# #             "The Proposal: One-act play, satire"
# #         ],
# #         "Unit2: First Flight – Poems": [
# #             "Dust of Snow: Symbolism, nature",
# #             "Fire and Ice: Symbolism, theme of destruction",
# #             "The Ball Poem: Childhood loss, learning",
# #             "A Tiger in the Zoo: Freedom vs captivity",
# #             "How to Tell Wild Animals: Humour, description",
# #             "The Trees: Environment, imagery",
# #             "Fog: Metaphor, imagery",
# #             "The Tale of Custard the Dragon: Humour, rhyme",
# #             "For Anne Gregory: Beauty, inner vs outer"
# #         ],
# #         "Unit3: Footprints Without Feet – Supplementary": [
# #             "A Triumph of Surgery: Pet story, care",
# #             "The Thief's Story: Trust, honesty",
# #             "The Midnight Visitor: Detective, suspense",
# #             "A Question of Trust: Irony, theft",
# #             "Footprints Without Feet: Science fiction, invisibility",
# #             "The Making of a Scientist: Biography, Richard Ebright",
# #             "The Necklace: Irony, fate",
# #             "Bholi: Education, empowerment",
# #             "The Book That Saved the Earth: Science fiction, humour"
# #         ]
# #     },
# #     "Mathematics": {
# #         "Chapter 1: Number Systems": ["Real Number"],
# #         "Chapter 2: Algebra": ["Polynomials", "Pair of Linear Equations in Two Variables", "Quadratic Equations", "Arithmetic Progressions"],
# #         "Chapter 3: Coordinate Geometry": ["Coordinate Geometry"],
# #         "Chapter 4: Geometry": ["Triangles", "Circles"],
# #         "Chapter 5: Trigonometry": ["Introduction to Trigonometry", "Trigonometric Identities", "Heights and Distances"],
# #         "Chapter 6: Mensuration": ["Areas Related to Circles", "Surface Areas and Volumes"],
# #         "Chapter 7: Statistics and Probability": ["Statistics", "Probability"]
# #     },
# #     "Science": {
# #         "Chapter 1: Chemical Reactions and Equations": ["Types of Chemical Reactions", "Writing and Balancing Chemical Equations", "Effects of Oxidation and Reduction", "Types of Oxidizing and Reducing Agents"],
# #         "Chapter 2: Acids, Bases, and Salts": ["Properties of Acids and Bases", "pH Scale", "Uses of Acids and Bases"],
# #         "Chapter 3: Metals and Non-Metals": ["Properties of Metals and Non-Metals", "Reactivity Series of Metals", "Occurrence and Extraction of Metals", "Corrosion of Metals", "Uses of Metals and Non-Metals"],
# #         "Chapter 4: Carbon and Its Compounds": ["Covalent Bonding", "Homologous Series", "Saturated and Unsaturated Compounds", "Functional Groups", "Important Carbon Compounds and Their Uses"],
# #         "Chapter 5: Periodic Classification of Elements": ["Mendeleev's Periodic Table", "Modern Periodic Table", "Properties of Elements in Groups", "Properties of Elements in Periods"],
# #         "Chapter 6: Life Processes": ["Nutrition", "Respiration", "Excretion"],
# #         "Chapter 7: Control and Coordination": ["Nervous System", "Hormones"],
# #         "Chapter 8: How do Organisms Reproduce?": ["Modes of Reproduction", "Reproductive Health"],
# #         "Chapter 9: Heredity and Evolution": ["Mendel's Experiments", "Evolution Theories"],
# #         "Chapter 10: Light – Reflection and Refraction": ["Mirror & Lens Formulas", "Applications"],
# #         "Chapter 11: Human Eye and Colourful World": ["Human Eye", "Colourful World"],
# #         "Chapter 12: Electricity": ["Ohm's Law", "Series & Parallel Circuits"],
# #         "Chapter 13: Magnetic Effects of Electric Current": ["Electromagnetism", "Applications"],
# #         "Chapter 14: Sources of Energy": ["Conventional Sources of Energy", "Non-Conventional Sources of Energy"],
# #         "Chapter 15: Our Environment": ["Ecosystem", "Ozone Layer"],
# #         "Chapter 16: Sustainable Management of Natural Resources": ["Forest & Wildlife", "Water Management"]
# #     },
# #     "History": {
# #         "Chapter 1: The Rise of Nationalism in Europe": ["French Revolution and the idea of the nation", "The making of nationalism in Europe", "The age of revolutions: 1830–1848", "The making of Germany and Italy", "Visualising the nation– nationalism and imperialism"],
# #         "Chapter 2: Nationalism in India": ["First World War and nationalism in India", "The Non-Cooperation Movement", "Differing strands within the movement", "Civil Disobedience Movement", "The sense of collective belonging"],
# #         "Chapter 3: The Making of a Global World": ["The pre-modern world", "The nineteenth century (1815–1914)", "The inter-war economy", "Rebuilding a world economy: post–1945"],
# #         "Chapter 4: The Age of Industrialisation": ["Before the Industrial Revolution", "Hand labour and steam power", "Industrialisation in the colonies", "Factories come up", "The peculiarities of industrial growth", "Market for goods"],
# #         "Chapter 5: Print Culture and the Modern World": ["The first printed books", "Print comes to Europe", "The print revolution and its impact", "The reading mania", "The nineteenth century and print", "India and the world of print", "Religious reform and public debates", "New forms of publication and literature"]
# #     },
# #     "Geography": {
# #         "Chapter 1: Resources and Development": ["Types of resources– natural, human, sustainable", "Development of resources", "Resource planning in India", "Land resources and land use patterns", "Land degradation and conservation measures", "Soil as a resource– classification, distribution, conservation"],
# #         "Chapter 2: Forest and Wildlife Resources": ["Flora and fauna in India", "Types and distribution of forests", "Depletion of forests and conservation", "Forest conservation movements (Chipko, Beej Bachao Andolan)", "Government initiatives– IUCN, Indian Wildlife Protection Act"],
# #         "Chapter 3: Water Resources": ["Water scarcity and its causes", "Multipurpose river projects and integrated water resources management", "Rainwater harvesting"],
# #         "Chapter 4: Agriculture": ["Types of farming", "Cropping patterns (Kharif, Rabi, Zaid)", "Major crops (rice, wheat, maize, pulses, oilseeds, sugarcane, cotton, jute)", "Technological and institutional reforms", "Contribution of agriculture to the national economy"],
# #         "Chapter 5: Minerals and Energy Resources": ["Types of minerals and their distribution", "Uses of minerals", "Conventional sources of energy– coal, petroleum, natural gas, electricity", "Non-conventional sources of energy– solar, wind, tidal, geothermal, nuclear", "Conservation of energy resources"],
# #         "Chapter 6: Manufacturing Industries": ["Importance of manufacturing", "Industrial location factors", "Classification of industries (based on size, ownership, raw material, product)", "Major industries– cotton, jute, iron and steel, aluminium, chemical, fertiliser, cement, automobile, IT", "Industrial pollution and environmental degradation", "Control of environmental degradation"],
# #         "Chapter 7: Lifelines of National Economy": ["Roadways", "Railways", "Pipelines", "Waterways", "Airways", "Communication systems", "International trade"]
# #     },
# #     "Civics": {
# #         "Chapter 1: Power Sharing": ["Ethnic composition of Belgium and Sri Lanka", "Majoritarianism in Sri Lanka", "Accommodation in Belgium", "Why power sharing is desirable", "Forms of power sharing"],
# #         "Chapter 2: Federalism": ["What makes India a federal country", "Features of federalism", "Division of powers between Union and State", "Decentralisation in India– 73rd and 74th Amendments"],
# #         "Chapter 3: Gender, Religion and Caste": ["Gender and politics", "Religion and politics", "Caste and politics"],
# #         "Chapter 4: Political Parties": ["Why do we need political parties?", "Functions of political parties", "National parties and state parties", "Challenges to political parties", "How can parties be reformed?"],
# #         "Chapter 5: Outcomes of Democracy": ["How do we assess democracy's outcomes?", "Accountable, responsive and legitimate government", "Economic growth and development", "Reduction of inequality and poverty", "Accommodation of social diversity", "Dignity and freedom of the citizens"]
# #     },
# #     "Economics": {
# #         "Chapter 1: Development": ["What development promises– different people, different goals", "Income and other goals", "National development and per capita income", "Public facilities", "Sustainability of development"],
# #         "Chapter 2: Sectors of the Indian Economy": ["Primary, secondary and tertiary sectors", "Historical change in sectors", "Rising importance of tertiary sector", "Division of sectors as organised and unorganised", "Employment trends"],
# #         "Chapter 3: Money and Credit": ["Role of money in the economy", "Formal and informal sources of credit", "Self-Help Groups (SHGs)", "Credit and its terms"],
# #         "Chapter 4: Globalisation and the Indian Economy": ["Production across countries", "Interlinking of production across countries", "Foreign trade and integration of markets", "Globalisation and its impact", "Role of WTO", "Struggle for fair globalisation"],
# #         "Chapter 5: Consumer Rights": ["Consumer movement in India", "Consumer rights and duties", "Consumer awareness", "Role of consumer forums and NGOs"]
# #     }
# # }
# # }

# # # CBSE 7th–10th chapters (subtopics removed) for mocktest
# # CHAPTERS_SIMPLE = {
# #     "7th": {
# #         "Computers": [
# #             "Chapter 1: Programming Language",
# #             "Chapter 2: Editing Text in Microsoft Word",
# #             "Chapter 3: Microsoft PowerPoint",
# #             "Chapter 4: Basics of Microsoft Excel",
# #             "Chapter 5: Microsoft Access"
# #         ],
# #         "English": [
# #             "Unit 1: Learning Together",
# #             "Unit 2: Wit and Humour",
# #             "Unit 3: Dreams & Discoveries",
# #             "Unit 4: Travel and Adventure",
# #             "Unit 5: Bravehearts"
# #         ],
# #         "Maths": [
# #             "Chapter 1: Integers",
# #             "Chapter 2: Fractions and Decimals",
# #             "Chapter 3: Data Handling",
# #             "Chapter 4: Simple Equations",
# #             "Chapter 5: Lines and Angles",
# #             "Chapter 6: The Triangle and Its Properties",
# #             "Chapter 7: Comparing Quantities",
# #             "Chapter 8: Rational Numbers",
# #             "Chapter 9: Perimeter and Area",
# #             "Chapter 10: Algebraic Expressions",
# #             "Chapter 11: Exponents and Powers",
# #             "Chapter 12: Symmetry",
# #             "Chapter 13: Visualising Solid Shapes"
# #         ],
# #         "Science": [
# #             "Chapter1: Nutrition in Plants",
# #             "Chapter2: Nutrition in Animals",
# #             "Chapter3: Fibre to Fabric",
# #             "Chapter4: Heat",
# #             "Chapter5: Acids, Bases and Salts",
# #             "Chapter6: Physical and Chemical Changes",
# #             "Chapter7: Weather, Climate and Adaptations of Animals",
# #             "Chapter8: Winds, Storms and Cyclones",
# #             "Chapter9: Soil",
# #             "Chapter10: Respiration in Organisms",
# #             "Chapter11: Transportation in Animals and Plants",
# #             "Chapter12: Reproduction in Plants",
# #             "Chapter13: Motion and Time",
# #             "Chapter14: Electric Current and Its Effects",
# #             "Chapter15: Light",
# #             "Chapter16: Water: A Precious Resource",
# #             "Chapter17: Forests: Our Lifeline",
# #             "Chapter18: Wastewater Story"
# #         ],
# #         "History": [
# #             "Chapter 1: Tracing Changes through a Thousand Years",
# #             "Chapter 2: New Kings and Kingdoms",
# #             "Chapter 3: The Delhi Sultans (12th–15th Century)",
# #             "Chapter 4: The Mughal Empire (16th–17th Century)",
# #             "Chapter 5: Rulers and Buildings / Tribes, Nomads and Settled Communities",
# #             "Chapter 6: Devotional Paths to the Divine",
# #             "Chapter 7: The Making of Regional Cultures",
# #             "Chapter 8: Eighteenth Century Political Formations"
# #         ],
# #         "Civics": [
# #             "Chapter 1: On Equality",
# #             "Chapter 2: Role of the Government in Health",
# #             "Chapter 3: How the State Government Works",
# #             "Chapter 4: Growing up as Boys and Girls",
# #             "Chapter 5: Women Change the World",
# #             "Chapter 6: Understanding Media",
# #             "Chapter 7: Markets Around Us",
# #             "Chapter 8: A Shirt in the Market"
# #         ],
# #         "Geography": [
# #             "Chapter 1: Environment",
# #             "Chapter 2: Inside Our Earth",
# #             "Chapter 3: Our Changing Earth",
# #             "Chapter 4: Air",
# #             "Chapter 5: Water",
# #             "Chapter 6: Human-Environment Interactions– The Tropical and the Subtropical Region",
# #             "Chapter 7: Life in the Deserts"
# #         ]
# #     },
# #     "8th": {
# #         "Computers": [
# #             "Chapter 1: Exception Handling in Python",
# #             "Chapter 2: File Handling in Python",
# #             "Chapter 3: Stack (Data Structure)",
# #             "Chapter 4: Queue (Data Structure)",
# #             "Chapter 5: Sorting"
# #         ],
# #         "English": [
# #             "Unit1: Honeydew – Prose",
# #             "Unit2: Honeydew – Poems",
# #             "Unit3: It So Happened – Supplementary"
# #         ],
# #         "Maths": [
# #             "Chapter 1: Rational Numbers",
# #             "Chapter 2: Linear Equations in One Variable",
# #             "Chapter 3: Understanding Quadrilaterals",
# #             "Chapter 4: Data Handling",
# #             "Chapter 5: Squares and Square Roots",
# #             "Chapter 6: Cubes and Cube Roots",
# #             "Chapter 7: Comparing Quantities",
# #             "Chapter 8: Algebraic Expressions and Identities",
# #             "Chapter 9: Mensuration",
# #             "Chapter 10: Exponents and Powers",
# #             "Chapter 11: Direct and Inverse Proportions",
# #             "Chapter 12: Factorisation",
# #             "Chapter 13: Introduction to Graphs"
# #         ],
# #         "Science": [
# #             "Chapter 1: Crop Production and Management",
# #             "Chapter 2: Microorganisms: Friend and Foe",
# #             "Chapter 3: Synthetic Fibres and Plastics",
# #             "Chapter 4: Materials: Metals and Non-Metals",
# #             "Chapter 5: Coal and Petroleum",
# #             "Chapter 6: Combustion and Flame",
# #             "Chapter 7: Conservation of Plants and Animals",
# #             "Chapter 8: Cell – Structure and Functions",
# #             "Chapter 9: Reproduction in Animals",
# #             "Chapter 10: Force and Pressure",
# #             "Chapter 11: Friction",
# #             "Chapter 12: Sound",
# #             "Chapter 13: Chemical Effects of Electric Current",
# #             "Chapter 14: Some Natural Phenomena",
# #             "Chapter 15: Light",
# #             "Chapter 16: Stars and the Solar System",
# #             "Chapter 17: Pollution of Air and Water"
# #         ],
# #         "History": [
# #                 "Chapter 1: How, When and Where",
# #                 "Chapter 2: From Trade to Territory– The Company Establishes Power",
# #                 "Chapter 3: Ruling the Countryside",
# #                 "Chapter 4: Tribals, Dikus and the Vision of a Golden Age",
# #                 "Chapter 5: When People Rebel– 1857 and After",
# #                 "Chapter 6: Civilising the 'Native', Educating the Nation",
# #                 "Chapter 7: Women, Caste and Reform",
# #                 "Chapter 8: The Making of the National Movement: 1870s–1947"
# #             ],
# #         "Civics":  [
# #                 "Chapter 1: The Indian Constitution",
# #                 "Chapter 2: Understanding Secularism",
# #                 "Chapter 3: Parliament and the Making of Laws",
# #                 "Chapter 4: Judiciary",
# #                 "Chapter 5: Understanding Marginalisation",
# #                 "Chapter 6: Confronting Marginalisation",
# #                 "Chapter 7: Public Facilities",
# #                 "Chapter 8: Law and Social Justice"
# #             ],
# #         "Geography": [
# #                 "Chapter 1: Resources",
# #                 "Chapter 2: Land, Soil, Water, Natural Vegetation and Wildlife Resources",
# #                 "Chapter 3: Agriculture",
# #                 "Chapter 4: Industries",
# #                 "Chapter 5: Human Resources"
# #             ]
# #     },
# #     "9th": {
# #         "Computers": [
# #             "Chapter 1: Basics of Computer System",
# #             "Chapter 2: Types of Software",
# #             "Chapter 3: Operating System",
# #             "Chapter 4: Introduction to Python Programming",
# #             "Chapter 5: Introduction to Cyber Security"
# #         ],
# #         "English": [
# #             "Unit1: Beehive – Prose",
# #             "Unit2: Beehive – Poems",
# #             "Unit3: Moments – Supplementary"
# #         ],
# #         "Maths": [
# #             "Chapter 1 : Number System",
# #             "Chapter 2 : Algebra",
# #             "Chapter 3 : Coordinate Geometry",
# #             "Chapter 4 : Geometry",
# #             "Chapter 5 :  Mensuration",
# #             "Chapter 6 : Statistics"
# #         ],
# #         "Science": [
# #             "Chapter 1 : Matter in Our Surroundings",
# #             "Chapter 2 :Is Matter Around Us Pure?",
# #             "Chapter 3 :Atoms and Molecules",
# #             "Chapter 4 :Structure of the Atom",
# #             "Chapter 5 :The Fundamental Unit of Life",
# #             "Chapter 6 :Tissues",
# #             "Chapter 7 :Diversity of the Living Organisms – I",
# #             "Chapter 8 :Diversity of the Living Organisms – II",
# #             "Chapter 9 :Diversity of the Living Organisms – III",
# #             "Chapter 10 :Motion",
# #             "Chapter 11 :Force and Laws of Motion",
# #             "Chapter 12 :Gravitation",
# #             "Chapter 13 :Work and Energy",
# #             "Chapter 14 :Sound",
# #             "Chapter 15 :Why Do We Fall Ill?",
# #             "Chapter 16 :Natural Resources",
# #             "Chapter 17 :Improvement in Food Resources"
# #         ],
# #         "History": [
# #             "Chapter 1: The French Revolution",
# #             "Chapter 2: Socialism in Europe and the Russian Revolution",
# #             "Chapter 3: Nazism and the Rise of Hitler",
# #             "Chapter 4: Forest Society and Colonialism",
# #             "Chapter 5: Pastoralists in the Modern World (Periodic Assessment only)"
# #         ],
# #         "Geography": [
# #             "Chapter 1: India– Size and Location",
# #             "Chapter 2: Physical Features of India",
# #             "Chapter 3: Drainage",
# #             "Chapter 4: Climate",
# #             "Chapter 5: Natural Vegetation and Wildlife",
# #             "Chapter 6: Population"
# #         ],
# #         "Civics": [
# #             "Chapter 1: What is Democracy? Why Democracy?",
# #             "Chapter 2: Constitutional Design",
# #             "Chapter 3: Electoral Politics",
# #             "Chapter 4: Working of Institutions",
# #             "Chapter 5: Democratic Rights"
# #         ],
# #         "Economics": [
# #             "Chapter 1: The Story of Village Palampur",
# #             "Chapter 2: People as Resource",
# #             "Chapter 3: Poverty as a Challenge",
# #             "Chapter 4: Food Security in India"
# #         ]
# #     },
# #     "10th": {
# #         "Computers": [
# #             "Chapter 1: Computer Fundamentals",
# #             "Chapter 2: Advanced GIMP (GNU Image Manipulation Program)",
# #             "Chapter 3: Tables (HTML)",
# #             "Chapter 4: Forms (HTML)",
# #             "Chapter 5: DHTML & CSS"
# #         ],
# #         "English": [
# #             "Unit 1:First Flight – Prose",
# #             "Unit 2:First Flight – Poems",
# #             "Unit 3:Footprints Without Feet – Supplementary"
# #         ],
# #         "Mathematics": [
# #             "Chapter 1: Number Systems",
# #             "Chapter 2: Algebra",
# #             "Chapter 3: Coordinate Geometry",
# #             "Chapter 4: Geometry",
# #             "Chapter 5: Trigonometry",
# #             "Chapter 6: Mensuration",
# #             "Chapter 7: Statistics and Probability"
# #         ],
# #         "Science": [
# #             "Chapter 1: Chemical Reactions and Equations",
# #             "Chapter 2: Acids, Bases, and Salts",
# #             "Chapter 3: Metals and Non-Metals",
# #             "Chapter 4: Carbon and Its Compounds",
# #             "Chapter 5: Periodic Classification of Elements",
# #             "Chapter 6: Life Processes",
# #             "Chapter 7: Control and Coordination",
# #             "Chapter 8: How do Organisms Reproduce?",
# #             "Chapter 9: Heredity and Evolution",
# #             "Chapter 10: Light – Reflection and Refraction",
# #             "Chapter 11: Human Eye and Colourful World",
# #             "Chapter 12: Electricity",
# #             "Chapter 13: Magnetic Effects of Electric Current",
# #             "Chapter 14: Sources of Energy",
# #             "Chapter 15: Our Environment",
# #             "Chapter 16: Sustainable Management of Natural Resources"
# #         ],
# #         "History": [
# #             "Chapter 1: The Rise of Nationalism in Europe",
# #             "Chapter 2: Nationalism in India",
# #             "Chapter 3: The Making of a Global World",
# #             "Chapter 4: The Age of Industrialisation",
# #             "Chapter 5: Print Culture and the Modern World"
# #         ],
# #         "Geography": [
# #             "Chapter 1: Resources and Development",
# #             "Chapter 2: Forest and Wildlife Resources",
# #             "Chapter 3: Water Resources",
# #             "Chapter 4: Agriculture",
# #             "Chapter 5: Minerals and Energy Resources",
# #             "Chapter 6: Manufacturing Industries",
# #             "Chapter 7: Lifelines of National Economy"
# #         ],
# #         "Civics": [
# #             "Chapter 1: Power Sharing",
# #             "Chapter 2: Federalism",
# #             "Chapter 3: Gender, Religion and Caste",
# #             "Chapter 4: Political Parties",
# #             "Chapter 5: Outcomes of Democracy"
# #         ],
# #         "Economics": [
# #             "Chapter 1: Development",
# #             "Chapter 2: Sectors of the Indian Economy",
# #             "Chapter 3: Money and Credit",
# #             "Chapter 4: Globalisation and the Indian Economy",
# #             "Chapter 5: Consumer Rights"
# #         ]
# #     }
# # }
# # MAX_PREVIOUS_QUESTIONS = 100
# # PREVIOUS_QUESTIONS_QUICK = {}
# # PREVIOUS_QUESTIONS_MOCK = {}

# # # Fallback quiz data when API is unavailable
# # FALLBACK_QUIZZES = {
# #     "What is a programming language?": [
# #         {
# #             "question": "What is a programming language?",
# #             "options": [
# #                 "A way to communicate with computers",
# #                 "A type of computer hardware",
# #                 "A computer game",
# #                 "A type of internet connection"
# #             ],
# #             "answer": "A way to communicate with computers"
# #         },
# #         {
# #             "question": "Which of the following is NOT a programming language?",
# #             "options": [
# #                 "Python",
# #                 "Java",
# #                 "HTML",
# #                 "Microsoft Word"
# #             ],
# #             "answer": "Microsoft Word"
# #         },
# #         {
# #             "question": "What does HTML stand for?",
# #             "options": [
# #                 "HyperText Markup Language",
# #                 "High Tech Modern Language",
# #                 "Home Tool Markup Language",
# #                 "Hyperlink and Text Markup Language"
# #             ],
# #             "answer": "HyperText Markup Language"
# #         },
# #         {
# #             "question": "Which programming language is known for its simplicity?",
# #             "options": [
# #                 "Python",
# #                 "C++",
# #                 "Assembly",
# #                 "Machine Code"
# #             ],
# #             "answer": "Python"
# #         },
# #         {
# #             "question": "What is the purpose of a compiler?",
# #             "options": [
# #                 "To translate code into machine language",
# #                 "To debug programs",
# #                 "To design user interfaces",
# #                 "To connect to the internet"
# #             ],
# #             "answer": "To translate code into machine language"
# #         },
# #         {
# #             "question": "Which of these is a high-level programming language?",
# #             "options": [
# #                 "Python",
# #                 "Assembly",
# #                 "Machine Code",
# #                 "Binary"
# #             ],
# #             "answer": "Python"
# #         },
# #         {
# #             "question": "What does IDE stand for?",
# #             "options": [
# #                 "Integrated Development Environment",
# #                 "Internet Data Exchange",
# #                 "Internal Design Engine",
# #                 "Interactive Data Entry"
# #             ],
# #             "answer": "Integrated Development Environment"
# #         },
# #         {
# #             "question": "Which programming language is used for web development?",
# #             "options": [
# #                 "JavaScript",
# #                 "Python",
# #                 "C++",
# #                 "Assembly"
# #             ],
# #             "answer": "JavaScript"
# #         },
# #         {
# #             "question": "What is a variable in programming?",
# #             "options": [
# #                 "A container that stores data",
# #                 "A type of function",
# #                 "A programming language",
# #                 "A computer component"
# #             ],
# #             "answer": "A container that stores data"
# #         },
# #         {
# #             "question": "Which of these is a programming paradigm?",
# #             "options": [
# #                 "Object-Oriented Programming",
# #                 "Web Browsing",
# #                 "File Management",
# #                 "Data Storage"
# #             ],
# #             "answer": "Object-Oriented Programming"
# #         }
# #     ]
# # }

# # def get_fallback_quiz(subtopic: str, difficulty: str, language: str):
# #     """Return a fallback quiz when API is unavailable"""
# #     logger.info(f"Using fallback quiz for: {subtopic}")

# #     dynamic_entries = generate_quick_fallback_quiz(subtopic, 10)
# #     quiz_data: List[Dict] = []

# #     if dynamic_entries:
# #         for item in dynamic_entries:
# #             quiz_data.append(
# #                 {
# #                     "question": item["question"],
# #                     "options": item["options"],
# #                     "answer": item["answer"],
# #                 }
# #             )
# #     else:
# #         stored = FALLBACK_QUIZZES.get(subtopic)
# #         if stored:
# #             quiz_data = stored
# #         else:
# #             question_templates = [
# #                 f"What is the definition of {subtopic}?",
# #                 f"Which of the following is NOT related to {subtopic}?",
# #                 f"What are the main characteristics of {subtopic}?",
# #                 f"How does {subtopic} work?",
# #                 f"What are the types of {subtopic}?",
# #                 f"What is the importance of {subtopic}?",
# #                 f"Which statement about {subtopic} is correct?",
# #                 f"What are the applications of {subtopic}?",
# #                 f"How is {subtopic} different from similar concepts?",
# #                 f"What are the properties of {subtopic}?"
# #             ]
# #             option_patterns = [
# #                 ["Correct definition", "Incorrect definition", "Partial definition", "Opposite definition"],
# #                 ["Related concept 1", "Related concept 2", "Unrelated concept", "Related concept 3"],
# #                 ["Characteristic 1", "Characteristic 2", "Characteristic 3", "Non-characteristic"],
# #                 ["Process A", "Process B", "Process C", "Incorrect process"],
# #                 ["Type 1", "Type 2", "Type 3", "Non-type"],
# #                 ["Reason 1", "Reason 2", "Reason 3", "Not important"],
# #                 ["True statement", "False statement 1", "False statement 2", "False statement 3"],
# #                 ["Application 1", "Application 2", "Application 3", "Non-application"],
# #                 ["Difference A", "Difference B", "Difference C", "No difference"],
# #                 ["Property 1", "Property 2", "Property 3", "Non-property"]
# #             ]
# #             for i in range(10):
# #                 question_template = question_templates[i % len(question_templates)]
# #                 option_pattern = option_patterns[i % len(option_patterns)]
# #                 quiz_data.append({
# #                     "question": question_template,
# #                     "options": option_pattern,
# #                     "answer": option_pattern[0]
# #                 })

# #     return {
# #         "quiz": quiz_data[:10],
# #         "subtopic": subtopic,
# #         "difficulty": difficulty,
# #         "language": language,
# #         "source": "fallback"
# #     }

# # # Language instruction mapping
# # LANGUAGE_INSTRUCTIONS = {
# #     "English": "Generate all questions and options in English.",
# #     "Telugu": "Generate all questions and options in Telugu language (తెలుగు). Use Telugu script.",
# #     "Hindi": "Generate all questions and options in Hindi language (हिंदी). Use Devanagari script.",
# #     "Tamil": "Generate all questions and options in Tamil language (தமிழ்). Use Tamil script.",
# #     "Kannada": "Generate all questions and options in Kannada language (ಕನ್ನಡ). Use Kannada script.",
# #     "Malayalam": "Generate all questions and options in Malayalam language (മലയാളം). Use Malayalam script."
# # }

# # # Quick Practice Endpoints
# # @app.get("/classes")
# # def get_classes():
# #     logger.info("Fetching available classes")
# #     return JSONResponse(content={"classes": list(CHAPTERS_DETAILED.keys())})

# # @app.get("/chapters")
# # def get_subjects(class_name: str):
# #     logger.info(f"Fetching subjects for class: {class_name}")
# #     subjects = CHAPTERS_DETAILED.get(class_name)
# #     if not subjects:
# #         logger.error(f"Invalid class: {class_name}")
# #         raise HTTPException(status_code=400, detail="Invalid class")
# #     return JSONResponse(content={"chapters": list(subjects.keys())})

# # @app.get("/subtopics")
# # def get_subtopics(class_name: str, subject: str):
# #     logger.info(f"Fetching subtopics for class: {class_name}, subject: {subject}")
# #     subjects = CHAPTERS_DETAILED.get(class_name)
# #     if not subjects or subject not in subjects:
# #         logger.error(f"Invalid subject: {subject} or class: {class_name}")
# #         raise HTTPException(status_code=400, detail="Invalid subject or class")
# #     subtopics = subjects[subject]
# #     return JSONResponse(content={"subtopics": subtopics})

# # @app.get("/quiz")
# # def get_quiz(
# #     subtopic: str,
# #     retry: bool = False,
# #     currentLevel: int = None,
# #     language: str = "English"
# # ):
# #     try:
# #         previous = PREVIOUS_QUESTIONS_QUICK.get(subtopic, []) if not retry else []

# #         # Use the level from frontend if provided
# #         if currentLevel is not None:
# #             current_level = currentLevel
# #         else:
# #             # fallback if frontend doesn't provide level
# #             num_prev = len(previous)
# #             if num_prev == 0:
# #                 current_level = 1
# #             elif num_prev == 1:
# #                 current_level = 2
# #             else:
# #                 current_level = 3

# #         difficulty_map = {1: "simple", 2: "medium", 3: "hard"}
# #         difficulty = difficulty_map.get(current_level, "simple")

# #         logger.info(f"Generating quiz for subtopic: {subtopic}, difficulty: {difficulty}, retry: {retry}, level: {current_level}, language: {language}")
       
# #         # Get language instruction
# #         language_instruction = LANGUAGE_INSTRUCTIONS.get(language, LANGUAGE_INSTRUCTIONS["English"])

# #         prompt = f"""
# #         Generate 10 multiple-choice questions for "{subtopic}".
# #         Difficulty: {difficulty}.
# #         {language_instruction}
       
# #         IMPORTANT INSTRUCTIONS:
# #         - ALL questions, options, and content MUST be in {language} language only.
# #         - Do NOT mix English with the target language.
# #         - Use proper script for the selected language.
# #         - Avoid repeating these questions: {previous}.
       
# #         IMPORTANT FORMAT REQUIREMENTS:
# #         - Each question should have exactly 4 options as an array: ["option1", "option2", "option3", "option4"]
# #         - The answer should be the actual text of the correct option, NOT a letter
# #         - Return ONLY a JSON array with keys: question, options (array), answer (actual option text)
       
# #         Example format (in {language}):
# #         [
# #           {{
# #             "question": "[Question text in {language}]",
# #             "options": ["[Option 1 in {language}]", "[Option 2 in {language}]", "[Option 3 in {language}]", "[Option 4 in {language}]"],
# #             "answer": "[Correct option text in {language}]"
# #           }}
# #         ]
# #         """

# #         # Check if client is available
# #         if client is None:
# #             logger.warning("OpenAI client not available, using fallback quiz")
# #             return get_fallback_quiz(subtopic, difficulty, language)
            
# #         try:
# #             response = client.chat.completions.create(
# #                 model="google/gemini-2.0-flash-001",
# #                 messages=[{"role": "user", "content": prompt}],
# #                 temperature=0.9
# #             )
# #         except Exception as api_error:
# #             logger.error(f"API call failed: {api_error}")
# #             # Fallback: Return sample quiz when API is unavailable
# #             return get_fallback_quiz(subtopic, difficulty, language)

# #         message_content = response.choices[0].message.content
# #         text = ""
# #         if isinstance(message_content, list):
# #             for block in message_content:
# #                 if block.get("type") == "text":
# #                     text += block.get("text", "")
# #         else:
# #             text = str(message_content)

# #         # Clean up markdown code blocks if present
# #         text = text.strip()
# #         if text.startswith("```json"):
# #             text = text[7:].strip()
# #         if text.endswith("```"):
# #             text = text[:-3].strip()

# #         try:
# #             quiz_json = json.loads(text)
# #         except json.JSONDecodeError:
# #             match = re.search(r'\[.*\]', text, re.DOTALL)
# #             if not match:
# #                 logger.error(f"AI did not return valid JSON: {text[:200]}")
# #                 raise ValueError(f"AI did not return valid JSON: {text[:200]}")
# #             quiz_json = json.loads(match.group(0))

# #         # Process and validate the quiz
# #         processed_quiz = []
# #         for q in quiz_json:
# #             if not all(key in q for key in ["question", "options", "answer"]):
# #                 continue

# #             if not isinstance(q["options"], list) or len(q["options"]) != 4:
# #                 continue

# #             if q["answer"] not in q["options"]:
# #                 continue

# #             processed_quiz.append(q)

# #         if len(processed_quiz) < 10:
# #             fallback_needed = 10 - len(processed_quiz)
# #             fallback_items = generate_quick_fallback_quiz(
# #                 subtopic,
# #                 fallback_needed,
# #                 existing_questions=[q["question"] for q in processed_quiz],
# #             )
# #             for item in fallback_items:
# #                 processed_quiz.append(
# #                     {
# #                         "question": item["question"],
# #                         "options": item["options"],
# #                         "answer": item["answer"],
# #                     }
# #                 )

# #         processed_quiz = processed_quiz[:10]

# #         # Shuffle the quiz questions
# #         random.shuffle(processed_quiz)
       
# #         # Shuffle options while preserving correct answer
# #         for q in processed_quiz:
# #             # Create a mapping of original positions
# #             original_options = q["options"].copy()
# #             correct_answer = q["answer"]
           
# #             # Shuffle the options
# #             random.shuffle(q["options"])
           
# #             # The answer remains the same text, not the position
# #             # This ensures the answer is always the correct option text
           
# #         if not retry:
# #             PREVIOUS_QUESTIONS_QUICK[subtopic] = previous + [q["question"] for q in processed_quiz]

# #         logger.info(f"Generated {len(processed_quiz)} questions for subtopic: {subtopic} in {language}")
       
# #         return JSONResponse(content={
# #             "currentLevel": current_level,
# #             "quiz": processed_quiz
# #         })

# #     except Exception as e:
# #         logger.error(f"Error generating quiz: {str(e)}")
# #         return JSONResponse(content={"error": str(e)}, status_code=500)

# # # AI Assistant Endpoints
# # def _classify_question_type(question: str) -> str:
# #     """Classify the type of question for better response handling"""
# #     question_lower = question.lower()
   
# #     if any(word in question_lower for word in ['study plan', 'schedule', 'timetable', 'how to study', 'plan']):
# #         return "study_plan"
# #     elif any(word in question_lower for word in ['notes', 'summary', 'key points', 'important points', 'write down']):
# #         return "notes"
# #     elif any(word in question_lower for word in ['explain', 'what is', 'how does', 'why', 'meaning', 'define']):
# #         return "explanation"
# #     elif any(word in question_lower for word in ['practice', 'exercise', 'question', 'problem', 'solve', 'worksheet']):
# #         return "practice"
# #     elif any(word in question_lower for word in ['related', 'connect', 'application', 'real world', 'where used']):
# #         return "related_concepts"
# #     elif any(word in question_lower for word in ['example', 'examples', 'sample']):
# #         return "examples"
# #     else:
# #         return "general"

# # # AI Assistant Endpoints
# # @app.post("/ai-assistant/chat")
# # async def ai_assistant_chat(request: ChatRequest):
# #     try:
# #         class_level = request.class_level
# #         subject = request.subject
# #         chapter = request.chapter
# #         student_question = request.student_question
# #         chat_history = request.chat_history or []
       
# #         # Get language preference
# #         language = "English"
       
# #         # Enhanced prompt with better formatting instructions
# #         prompt = f"""
# #         You are an AI Learning Assistant for a {class_level} student studying {subject}, specifically chapter: {chapter}.
       
# #         Student's Question: "{student_question}"
       
# #         Previous conversation context: {chat_history[-5:] if chat_history else "No previous context"}
       
# #         Based on the student's question, provide a helpful, educational response with EXCELLENT STRUCTURE and CHILD-FRIENDLY formatting.
       
# #         **CRITICAL FORMATTING RULES:**
# #         1. Use CLEAR HEADINGS with emojis
# #         2. Use BULLET POINTS and NUMBERED LISTS
# #         3. Use SIMPLE LANGUAGE for children
# #         4. Add VISUAL SEPARATORS like lines between sections
# #         5. Use LARGE FONT indicators for important points
# #         6. Include PRACTICAL EXAMPLES
# #         7. Add SUMMARY TABLES where helpful
# #         8. Use COLOR INDICATORS (🔴 🟢 🔵 🟡)
       
# #         **RESPONSE TYPES:**
       
# #         1. STUDY PLAN Response Structure:
# #            🗓️ WEEKLY STUDY PLAN
# #            ───────────────────
# #            📅 Day 1: [Topic]
# #            • Time: [Duration]
# #            • Activities: [List]
# #            • Practice: [Specific tasks]
# #            ───────────────────
           
# #         2. NOTES Response Structure:
# #            📚 CHAPTER NOTES
# #            ───────────────
# #            🔹 Key Concept 1
# #            • Definition: [Simple definition]
# #            • Example: [Real-world example]
# #            • Remember: [Important point]
# #            ───────────────
           
# #         3. EXPLANATION Response Structure:
# #            💡 CONCEPT EXPLANATION
# #            ────────────────────
# #            🎯 What is it?
# #            [Simple definition]
           
# #            👀 How it works:
# #            [Step-by-step]
           
# #            🌍 Real Example:
# #            [Child-friendly example]
# #            ────────────────────
           
# #         4. PRACTICE QUESTIONS Structure:
# #            📝 PRACTICE TIME
# #            ───────────────
# #            🟢 EASY Question:
# #            [Question]
           
# #            🟡 MEDIUM Question:
# #            [Question]
           
# #            🔴 CHALLENGE Question:
# #            [Question]
           
# #            ✅ SOLUTIONS:
# #            [Step-by-step solutions]
# #            ───────────────
       
# #         Make it VISUALLY APPEALING and EASY TO READ for a child!
# #         """
       
# #         response = client.chat.completions.create(
# #             model="google/gemini-2.0-flash-001",
# #             messages=[{"role": "user", "content": prompt}],
# #             temperature=0.7
# #         )
       
# #         message_content = response.choices[0].message.content
# #         text = ""
# #         if isinstance(message_content, list):
# #             for block in message_content:
# #                 if block.get("type") == "text":
# #                     text += block.get("text", "")
# #         else:
# #             text = str(message_content)
       
# #         return JSONResponse(content={
# #             "success": True,
# #             "response": text,
# #             "type": _classify_question_type(student_question)
# #         })
       
# #     except Exception as e:
# #         logger.error(f"Error in AI assistant: {str(e)}")
# #         return JSONResponse(content={
# #             "success": False,
# #             "response": "I apologize, but I'm having trouble processing your request right now. Please try again.",
# #             "type": "error"
# #         }, status_code=500)

# # @app.post("/ai-assistant/generate-study-plan")
# # async def generate_study_plan(request: StudyPlanRequest):
# #     """Generate a detailed study plan for a specific chapter"""
# #     try:
# #         class_level = request.class_level
# #         subject = request.subject
# #         chapter = request.chapter
# #         days_available = request.days_available
# #         hours_per_day = request.hours_per_day
       
# #         prompt = f"""
# #         Create a SUPER STRUCTURED and CHILD-FRIENDLY {days_available}-day study plan for a {class_level} student studying {subject}, chapter: {chapter}.
       
# #         **FORMATTING REQUIREMENTS:**
       
# #         🗓️ {days_available}-DAY STUDY PLAN FOR {chapter.upper()}
# #         ═══════════════════════════════════════
       
# #         📊 QUICK OVERVIEW:
# #         • Total Days: {days_available}
# #         • Daily Study: {hours_per_day} hours
# #         • Subject: {subject}
# #         • Chapter: {chapter}
       
# #         📅 DAILY BREAKDOWN:
# #         ───────────────────
       
# #         DAY 1: [Main Topic]
# #         🕐 Time: [Specific time allocation]
# #         📚 What to Study:
# #         • Topic 1: [Details]
# #         • Topic 2: [Details]
# #         ✍️ Practice:
# #         • [Specific practice tasks]
# #         ✅ Check: [Self-check points]
       
# #         DAY 2: [Main Topic]
# #         🕐 Time: [Specific time allocation]
# #         📚 What to Study:
# #         • Topic 1: [Details]
# #         • Topic 2: [Details]
# #         ✍️ Practice:
# #         • [Specific practice tasks]
# #         ✅ Check: [Self-check points]
       
# #         🎯 WEEKLY GOALS:
# #         • Goal 1: [Specific achievement]
# #         • Goal 2: [Specific achievement]
       
# #         💡 STUDY TIPS:
# #         • Tip 1: [Practical tip]
# #         • Tip 2: [Practical tip]
       
# #         Make it COLORFUL and EASY TO FOLLOW for a child!
# #         Use EMOJIS and CLEAR SECTIONS!
# #         """
       
# #         response = client.chat.completions.create(
# #             model="google/gemini-2.0-flash-001",
# #             messages=[{"role": "user", "content": prompt}],
# #             temperature=0.7
# #         )
       
# #         message_content = response.choices[0].message.content
# #         text = str(message_content) if not isinstance(message_content, list) else message_content[0].get("text", "")
       
# #         return JSONResponse(content={
# #             "success": True,
# #             "study_plan": text
# #         })
       
# #     except Exception as e:
# #         logger.error(f"Error generating study plan: {str(e)}")
# #         return JSONResponse(content={
# #             "success": False,
# #             "study_plan": "Unable to generate study plan at this time."
# #         }, status_code=500)

# # @app.post("/ai-assistant/generate-notes")
# # async def generate_notes(request: NotesRequest):
# #     """Generate comprehensive notes for a chapter or specific topic"""
# #     try:
# #         class_level = request.class_level
# #         subject = request.subject
# #         chapter = request.chapter
# #         specific_topic = request.specific_topic
       
# #         topic_specific = f" on {specific_topic}" if specific_topic else ""
       
# #         prompt = f"""
# #         Generate SUPER ORGANIZED and CHILD-FRIENDLY study notes for a {class_level} student studying {subject}, chapter: {chapter}{topic_specific}.
       
# #         **REQUIRED FORMAT:**
       
# #         📚 {chapter.upper()} - STUDY NOTES
# #         ═══════════════════════════
       
# #         🎯 CHAPTER AT A GLANCE:
# #         • Main Topics: [List 3-4 main topics]
# #         • Key Skills: [What they'll learn]
# #         • Difficulty: 🟢 Easy / 🟡 Medium / 🔴 Hard
       
# #         🔍 KEY CONCEPTS:
# #         ─────────────────
       
# #         🔹 Concept 1: [Concept Name]
# #         • What it is: [Simple definition]
# #         • Example: 🌟 [Real example]
# #         • Remember: 💡 [Key point]
# #         • Formula: 📐 [If applicable]
       
# #         🔹 Concept 2: [Concept Name]
# #         • What it is: [Simple definition]
# #         • Example: 🌟 [Real example]
# #         • Remember: 💡 [Key point]
# #         • Formula: 📐 [If applicable]
       
# #         📋 IMPORTANT POINTS TABLE:
# #         ─────────────────────────
# #         | Point | Description | Remember |
# #         |-------|-------------|----------|
# #         | [1] | [Description] | [Memory tip] |
# #         | [2] | [Description] | [Memory tip] |
       
# #         💪 PRACTICE READY:
# #         • Quick Questions: [2-3 simple questions]
# #         • Think About: [1 critical thinking question]
       
# #         📝 SUMMARY:
# #         • Main Idea 1: [Summary point]
# #         • Main Idea 2: [Summary point]
# #         • Main Idea 3: [Summary point]
       
# #         Use LOTS OF EMOJIS, CLEAR SECTIONS, and CHILD-FRIENDLY LANGUAGE!
# #         Make it VISUALLY APPEALING!
# #         """
       
# #         response = client.chat.completions.create(
# #             model="google/gemini-2.0-flash-001",
# #             messages=[{"role": "user", "content": prompt}],
# #             temperature=0.7
# #         )
       
# #         message_content = response.choices[0].message.content
# #         text = str(message_content) if not isinstance(message_content, list) else message_content[0].get("text", "")
       
# #         return JSONResponse(content={
# #             "success": True,
# #             "notes": text
# #         })
       
# #     except Exception as e:
# #         logger.error(f"Error generating notes: {str(e)}")
# #         return JSONResponse(content={
# #             "success": False,
# #             "notes": "Unable to generate notes at this time."
# #         }, status_code=500)
# # def extract_relevant_points(
# #     class_name: str, subject: str, chapter: str
# # ) -> Tuple[List[Tuple[str, str]], List[Tuple[str, str]]]:
# #     """
# #     Returns (relevant_points, all_points) where each point is (topic_name, statement).
# #     """
# #     class_data = CHAPTERS_DETAILED.get(class_name, {})
# #     subject_data = class_data.get(subject, {})

# #     relevant_points: List[Tuple[str, str]] = []
# #     all_points: List[Tuple[str, str]] = []

# #     chapter_lower = chapter.lower()
# #     for topic_name, statements in subject_data.items():
# #         if not isinstance(statements, list):
# #             continue
# #         topic_points = [(topic_name, s) for s in statements if isinstance(s, str) and s.strip()]
# #         all_points.extend(topic_points)
# #         if chapter_lower in topic_name.lower():
# #             relevant_points.extend(topic_points)

# #     if not relevant_points:
# #         relevant_points = all_points.copy()

# #     return relevant_points, all_points


# # def statement_to_sentence(topic_name: str, statement: str) -> str:
# #     """
# #     Convert short bullet points into readable sentences.
# #     """
# #     topic = topic_name.strip()
# #     content = (statement or "").strip()

# #     if not content:
# #         base = f"This topic explores {topic.lower()}."
# #     else:
# #         normalized = content.rstrip(".")
# #         if normalized.lower().startswith(("what", "how", "why", "which", "when", "where")):
# #             base = normalized
# #         elif normalized.lower().startswith(("it", "they", "students", "learn")):
# #             base = normalized
# #         else:
# #             base = f"This topic covers {normalized.lower()}."

# #     sentence = base[0].upper() + base[1:]
# #     if not sentence.endswith("."):
# #         sentence += "."
# #     return sentence


# # def generate_fallback_quiz(
# #     class_name: str,
# #     subject: str,
# #     chapter: str,
# #     num_questions: int,
# #     existing_questions: Optional[List[str]] = None,
# # ) -> List[Dict]:
# #     """
# #     Generate deterministic, curriculum-derived questions when the AI output is inadequate.
# #     """
# #     existing_questions = set(existing_questions or [])
# #     relevant_points, all_points = extract_relevant_points(class_name, subject, chapter)

# #     if not all_points:
# #         return []

# #     fallback_questions: List[Dict] = []

# #     pool = relevant_points if relevant_points else all_points
# #     rng = random.Random()

# #     while len(fallback_questions) < num_questions and pool:
# #         topic_name, statement = rng.choice(pool)
# #         question_text = f"Which of the following statements is true about \"{topic_name}\"?"

# #         if question_text in existing_questions:
# #             pool.remove((topic_name, statement))
# #             continue

# #         correct_option = statement_to_sentence(topic_name, statement)

# #         distractor_candidates = [
# #             statement_to_sentence(tn, s)
# #             for (tn, s) in all_points
# #             if (tn, s) != (topic_name, statement)
# #         ]
# #         rng.shuffle(distractor_candidates)
# #         distractors = []
# #         for cand in distractor_candidates:
# #             if cand == correct_option or cand in distractors:
# #                 continue
# #             distractors.append(cand)
# #             if len(distractors) == 3:
# #                 break

# #         if len(distractors) < 3:
# #             pool.remove((topic_name, statement))
# #             continue

# #         option_values = [correct_option] + distractors
# #         rng.shuffle(option_values)
# #         options_dict = {chr(65 + idx): text for idx, text in enumerate(option_values)}
# #         answer_label = next(
# #             label for label, text in options_dict.items() if text == correct_option
# #         )

# #         fallback_questions.append(
# #             {
# #                 "question": question_text,
# #                 "options": options_dict,
# #                 "answer": answer_label,
# #             }
# #         )
# #         existing_questions.add(question_text)

# #     return fallback_questions


# # # Helpers for quick-practice fallback
# # def find_points_for_subtopic(subtopic: str) -> Tuple[List[Tuple[str, str]], List[Tuple[str, str]]]:
# #     """
# #     Locate curriculum points related to a subtopic across the entire dataset.
# #     """
# #     subtopic_lower = subtopic.lower()
# #     matches: List[Tuple[str, str]] = []
# #     all_points: List[Tuple[str, str]] = []

# #     for class_data in CHAPTERS_DETAILED.values():
# #         for subject_data in class_data.values():
# #             for topic_name, statements in subject_data.items():
# #                 if not isinstance(statements, list):
# #                     continue
# #                 topic_points = [(topic_name, s) for s in statements if isinstance(s, str) and s.strip()]
# #                 all_points.extend(topic_points)
# #                 if subtopic_lower in topic_name.lower():
# #                     matches.extend(topic_points)
# #                 else:
# #                     for statement in statements:
# #                         if isinstance(statement, str) and subtopic_lower in statement.lower():
# #                             matches.append((topic_name, statement))

# #     if not matches:
# #         matches = all_points.copy()

# #     return matches, all_points


# # def generate_quick_fallback_quiz(
# #     subtopic: str,
# #     num_questions: int,
# #     existing_questions: Optional[List[str]] = None,
# # ) -> List[Dict]:
# #     """
# #     Build fallback quick-practice questions using curriculum points.
# #     """
# #     existing_questions = set(existing_questions or [])
# #     matches, all_points = find_points_for_subtopic(subtopic)
# #     if not matches or not all_points:
# #         return []

# #     rng = random.Random()
# #     fallback: List[Dict] = []

# #     other_points = [p for p in all_points if p not in matches]
# #     if not other_points:
# #         other_points = all_points.copy()

# #     while len(fallback) < num_questions and matches:
# #         topic_name, statement = rng.choice(matches)
# #         question_text = f"Which of the following best describes \"{topic_name}\"?"

# #         if question_text in existing_questions:
# #             matches.remove((topic_name, statement))
# #             continue

# #         correct_sentence = statement_to_sentence(topic_name, statement)

# #         distractor_candidates = [
# #             statement_to_sentence(tn, s)
# #             for (tn, s) in other_points
# #             if (tn, s) != (topic_name, statement)
# #         ]
# #         rng.shuffle(distractor_candidates)
# #         distractors: List[str] = []
# #         for candidate in distractor_candidates:
# #             if candidate == correct_sentence or candidate in distractors:
# #                 continue
# #             distractors.append(candidate)
# #             if len(distractors) == 3:
# #                 break

# #         if len(distractors) < 3:
# #             matches.remove((topic_name, statement))
# #             continue

# #         options = [correct_sentence] + distractors
# #         rng.shuffle(options)

# #         fallback.append(
# #             {
# #                 "question": question_text,
# #                 "options": options,
# #                 "answer": correct_sentence,
# #             }
# #         )
# #         existing_questions.add(question_text)

# #     return fallback


# # # Mock Test Endpoints
# # @app.get("/mock_classes")
# # def get_mock_classes():
# #     logger.info("Fetching available classes for mock test")
# #     return JSONResponse(content={"classes": list(CHAPTERS_SIMPLE.keys())})

# # @app.get("/mock_subjects")
# # def get_mock_subjects(class_name: str):
# #     logger.info(f"Fetching subjects for class: {class_name}")
# #     subjects = CHAPTERS_SIMPLE.get(class_name)
# #     if not subjects:
# #         logger.error(f"Invalid class: {class_name}")
# #         raise HTTPException(status_code=400, detail="Invalid class")
# #     return JSONResponse(content={"subjects": list(subjects.keys())})

# # @app.get("/quick-practice")
# # def get_quick_practice():
# #     """
# #     Temporary endpoint for quick practice - returns mock data similar to mock_subjects
# #     """
# #     logger.info("Fetching quick practice data")
    
# #     # Return mock data similar to what frontend expects
# #     return JSONResponse(content={
# #         "message": "Quick Practice endpoint is working!",
# #         "status": "success",
# #         "data": {
# #             "available_classes": list(CHAPTERS_SIMPLE.keys()),
# #             "subjects": ["Computers", "English", "Mathematics", "Science", "History", "Geography", "Civics", "Economics"],
# #             "quick_practice_available": True
# #         }
# #     })

# # @app.get("/mock_chapters")
# # def get_mock_chapters(class_name: str, subject: str):
# #     logger.info(f"Fetching chapters for class: {class_name}, subject: {subject}")
# #     subjects = CHAPTERS_SIMPLE.get(class_name)
# #     if not subjects or subject not in subjects:
# #         logger.error(f"Invalid subject: {subject} or class: {class_name}")
# #         raise HTTPException(status_code=400, detail="Invalid subject or class")
# #     chapters = subjects[subject]
# #     if isinstance(chapters, dict):
# #         chapters = [chapter for sublist in chapters.values() for chapter in sublist]
# #     return JSONResponse(content={"chapters": chapters})

# # @app.get("/mock_test")
# # def get_mock_test(
# #     class_name: str,
# #     subject: str,
# #     chapter: str,
# #     retry: bool = False,
# #     language: str = "English",
# #     num_questions: int = 50
# # ):
# #     try:
# #         previous = PREVIOUS_QUESTIONS_MOCK.get(chapter, []) if not retry else []

# #         # Automatic difficulty progression
# #         num_prev = len(previous)
# #         if num_prev == 0:
# #             current_level = 1
# #             difficulty = "simple"
# #         elif num_prev == 1:
# #             current_level = 2
# #             difficulty = "medium"
# #         else:
# #             current_level = 3
# #             difficulty = "hard"
       
# #         logger.info(f"Generating mock test for class: {class_name}, subject: {subject}, chapter: {chapter}, difficulty: {difficulty}, language: {language}, retry: {retry}, num_questions: {num_questions}")

# #         subjects = CHAPTERS_SIMPLE.get(class_name)
# #         if not subjects or subject not in subjects:
# #             logger.error(f"Invalid subject: {subject} or class: {class_name}")
# #             raise HTTPException(status_code=400, detail="Invalid subject or class")

# #         chapters = subjects[subject]
# #         if isinstance(chapters, dict):
# #             for key, chapter_list in chapters.items():
# #                 if chapter in chapter_list:
# #                     break
# #             else:
# #                 logger.error(f"Invalid chapter: {chapter} for subject: {subject}")
# #                 raise HTTPException(status_code=400, detail="Invalid chapter")
# #         elif chapter not in chapters:
# #             logger.error(f"Invalid chapter: {chapter} for subject: {subject}")
# #             raise HTTPException(status_code=400, detail="Invalid chapter")

# #         if len(previous) > MAX_PREVIOUS_QUESTIONS:
# #             previous = previous[-MAX_PREVIOUS_QUESTIONS:]
# #             logger.info(f"Truncated previous questions for chapter: {chapter} to {MAX_PREVIOUS_QUESTIONS}")

# #         # Get language instruction
# #         language_instruction = LANGUAGE_INSTRUCTIONS.get(language, LANGUAGE_INSTRUCTIONS["English"])

# #         prompt = f"""
# #         Generate {num_questions} multiple-choice questions for "{chapter}" in {subject} for class {class_name}.
# #         Difficulty: {difficulty}.
# #         {language_instruction}
       
# #         IMPORTANT INSTRUCTIONS:
# #         - ALL questions, options, and content MUST be in {language} language only.
# #         - Do NOT mix English with the target language.
# #         - Use proper script for the selected language.
# #         - Avoid repeating these questions: {previous}.
       
# #         FORMAT REQUIREMENTS:
# #         - Each question must have exactly 4 options as a JSON object {{"A": "option text", "B": "another option", "C": "third option", "D": "fourth option"}}.
# #         - The answer must be the label "A", "B", "C", or "D".
# #         - Return ONLY a JSON array of objects with keys: question, options, answer.
       
# #         Example format (in {language}):
# #         [
# #           {{
# #             "question": "[Question text in {language}]",
# #             "options": {{
# #               "A": "[Option A in {language}]",
# #               "B": "[Option B in {language}]",
# #               "C": "[Option C in {language}]",
# #               "D": "[Option D in {language}]"
# #             }},
# #             "answer": "C"
# #           }}
# #         ]
# #         """

# #         logger.info(f"Sending prompt to AI for chapter: {chapter} in {language}")
# #         response = client.chat.completions.create(
# #             model="google/gemini-2.0-flash-001",
# #             messages=[{"role": "user", "content": prompt}],
# #             temperature=0.9
# #         )

# #         message_content = response.choices[0].message.content
# #         text = ""
# #         if isinstance(message_content, list):
# #             for block in message_content:
# #                 if block.get("type") == "text":
# #                     text += block.get("text", "")
# #         else:
# #             text = str(message_content)

# #         text = text.strip()
# #         if text.startswith("```json"):
# #             text = text[7:].strip()
# #         if text.endswith("```"):
# #             text = text[:-3].strip()

# #         try:
# #             quiz_json = json.loads(text)
# #         except json.JSONDecodeError:
# #             match = re.search(r'\[.*\]', text, re.DOTALL)
# #             if not match:
# #                 return JSONResponse(content={"currentLevel": current_level, "quiz": []}, status_code=200)
# #             quiz_json = json.loads(match.group(0))

# #         if not isinstance(quiz_json, list):
# #             return JSONResponse(content={"currentLevel": current_level, "quiz": []}, status_code=200)

# #         processed_quiz = []
# #         for q in quiz_json:
# #             if not all(key in q for key in ["question", "options", "answer"]):
# #                 continue
# #             if isinstance(q["options"], list) and len(q["options"]) == 4:
# #                 q["options"] = {chr(65 + i): opt for i, opt in enumerate(q["options"])}
# #             elif not isinstance(q["options"], dict) or len(q["options"]) != 4:
# #                 continue
# #             if q["answer"] not in q["options"]:
# #                 continue
# #             if is_placeholder_text(q.get("question", "")):
# #                 logger.warning(f"Skipping question due to placeholder question text: {q.get('question')}")
# #                 continue
# #             if any(is_placeholder_text(text) for text in q["options"].values()):
# #                 logger.warning(f"Skipping question due to placeholder options: {q.get('question')}")
# #                 continue

# #             items = list(q["options"].items())
# #             random.shuffle(items)
# #             new_options = {}
# #             new_answer = None
# #             for new_idx, (old_label, text_opt) in enumerate(items):
# #                 new_label = chr(65 + new_idx)
# #                 new_options[new_label] = text_opt
# #                 if old_label == q["answer"]:
# #                     new_answer = new_label
# #             q["options"] = new_options
# #             q["answer"] = new_answer
# #             processed_quiz.append(q)

# #         if len(processed_quiz) < num_questions:
# #             logger.info(
# #                 f"AI returned only {len(processed_quiz)} usable questions. Generating fallback questions "
# #                 f"for class={class_name}, subject={subject}, chapter={chapter}."
# #             )
# #             fallback_needed = num_questions - len(processed_quiz)
# #             fallback = generate_fallback_quiz(
# #                 class_name,
# #                 subject,
# #                 chapter,
# #                 fallback_needed,
# #                 existing_questions=[q["question"] for q in processed_quiz],
# #             )
# #             processed_quiz.extend(fallback)

# #         processed_quiz = processed_quiz[:num_questions]

# #         if not retry:
# #             PREVIOUS_QUESTIONS_MOCK[chapter] = previous + [q["question"] for q in processed_quiz]
# #             if len(PREVIOUS_QUESTIONS_MOCK[chapter]) > MAX_PREVIOUS_QUESTIONS:
# #                 PREVIOUS_QUESTIONS_MOCK[chapter] = PREVIOUS_QUESTIONS_MOCK[chapter][-MAX_PREVIOUS_QUESTIONS:]

# #         return JSONResponse(content={
# #             "currentLevel": current_level,
# #             "quiz": processed_quiz
# #         })

# #     except HTTPException as e:
# #         raise
# #     except Exception as e:
# #         logger.error(f"Unexpected error: {str(e)}")
# #         return JSONResponse(content={"currentLevel": 1, "quiz": []}, status_code=200)

# # @app.get("/")
# # def read_root():
# #     return {"message": "AI Learning Assistant API is running"}

# # if __name__ == "__main__":
# #     import uvicorn
# #     uvicorn.run(app, host="0.0.0.0", port=8000)


# from fastapi import FastAPI, HTTPException, Request
# from fastapi.responses import JSONResponse
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from dotenv import load_dotenv
# from pathlib import Path
# import os, json, re, random
# import logging
# from openai import OpenAI
# from typing import Dict, List, Optional

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # Load environment variables from both ai_backend/.env and backend/.env
# APP_DIR = Path(__file__).resolve().parent
# PROJECT_BACKEND_DIR = APP_DIR.parent

# app_env_path = APP_DIR / ".env"
# backend_env_path = PROJECT_BACKEND_DIR / ".env"

# if load_dotenv(dotenv_path=app_env_path):
#     logger.info(f"Loaded environment variables from {app_env_path}")
# if load_dotenv(dotenv_path=backend_env_path):
#     logger.info(f"Loaded environment variables from {backend_env_path}")

# API_KEY = os.getenv("OPENROUTER_API_KEY")
# if not API_KEY:
#     logger.error("OPENROUTER_API_KEY not found in environment variables")
#     API_KEY = "invalid_key"  # Set a placeholder to prevent startup crashs

# # Initialize client with error handling
# try:
#     client = OpenAI(api_key=API_KEY, base_url="https://openrouter.ai/api/v1")
#     logger.info("OpenAI client initialized successfully")
# except Exception as e:
#     logger.error(f"Failed to initialize OpenAI client: {e}")
#     client = None

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Pydantic Models
# class ChatRequest(BaseModel):
#     class_level: str
#     subject: str
#     chapter: str
#     student_question: str
#     chat_history: Optional[List[Dict]] = None

# class StudyPlanRequest(BaseModel):
#     class_level: str
#     subject: str
#     chapter: str
#     days_available: int = 7
#     hours_per_day: int = 2

# class NotesRequest(BaseModel):
#     class_level: str
#     subject: str
#     chapter: str
#     specific_topic: Optional[str] = None
# # Corrected CBSE 7th–10th Computers & English units & topics (for quickpractice)
# CHAPTERS_DETAILED = {
#     "7th": {
#     "Computers": {
#         " Chapter 1: Programming Language": [
#             "What is a programming language?",
#             "Types: Low-level vs High-level languages",
#             "Examples and real-world uses",
#             "Simple pseudocode or introduction to programming logic"
#         ],
#         "Chapter 2: Editing Text in Microsoft Word": [
#             "Creating, saving, and opening documents",
#             "Text formatting: fonts, sizes, colors, bold, italics",
#             "Paragraph alignment, bullets, numbering",
#             "Inserting images, tables, and hyperlinks"
#         ],
#         "Chapter 3: Microsoft PowerPoint": [
#             "Creating slides and using slide layouts",
#             "Adding and editing text and images",
#             "Applying themes and transitions",
#             "Running a slideshow"
#         ],
#         "Chapter 4: Basics of Microsoft Excel": [
#             "Entering and formatting data in cells",
#             "Basic formulas (SUM, AVERAGE)",
#             "Creating charts from data",
#             "Simple data organization (sorting and filtering)"
#         ],
#         "Chapter 5: Microsoft Access": [
#             "Understanding databases and tables",
#             "Creating a simple database",
#             "Adding, editing, and searching records",
#             "Basic queries"
#         ]
#     },
#     "English": {
#         "Chapter 1: Learning Together": [
#             "The Day the River Spoke: Sentence completion, onomatopoeia, fill-in-the-blanks, prepositions",
#             "Try Again: Phrases, metaphor and simile",
#             "Three Days to See: Modal verbs, descriptive paragraph writing"
#         ],
#         "Chapter 2: Wit and Humour": [
#             "Animals, Birds, and Dr. Dolittle: Compound words, palindrome, present perfect tense, notice writing",
#             "A Funny Man: Phrasal verbs, adverbs and prepositions",
#             "Say the Right Thing: Suffixes, verb forms, tenses, kinds of sentences"
#         ],
#         "Chapter 3: Dreams & Discoveries": [
#             "My Brother's Great Invention: Onomatopoeia, binomials, phrasal verbs, idioms, simple past and past perfect tense",
#             "Paper Boats: Antonyms (opposites), diary entry writing",
#             "North, South, East, West: Associate words with meanings, subject-verb agreement, letter format (leave application)"
#         ],
#         "Chapter 4: Travel and Adventure": [
#             "The Tunnel: Phrases, onomatopoeia, punctuation, descriptive paragraph writing",
#             "Travel: Onomatopoeia",
#             "Conquering the Summit: Phrases, parts of speech, articles, formal letter writing"
#         ],
#         "Chapter 5: Bravehearts": [
#             "A Homage to Our Brave Soldiers: Prefix and root words, main clause, subordinate clause, subordinating conjunctions",
#             "My Dear Soldiers: Collocations",
#             "Rani Abbakka: Fill-in-the-blanks (spelling), speech (direct & indirect)"
#         ]
#     },
#     "Mathematics": {
#         "Chapter 1: Integers": [
#             "Properties of addition and subtraction of integers",
#             "Multiplication of integers",
#             "Properties of multiplication of integers",
#             "Division of integers",
#             "Properties of division of integers"
#         ],
#         "Chapter 2: Fractions and Decimals": [
#             "Multiplication of fractions",
#             "Division of fractions",
#             "Multiplication of decimal numbers",
#             "Division of decimal numbers"
#         ],
#         "Chapter 3: Data Handling": [
#             "Representative values",
#             "Arithmetic mean",
#             "Mode",
#             "Median",
#             "Use of bar graphs with different purposes"
#         ],
#         "Chapter 4: Simple Equations": [
#             "A mind-reading game (intro activity)",
#             "Setting up an equation",
#             "What is an equation?",
#             "More equations",
#             "Application of simple equations to practical situations"
#         ],
#         "Chapter 5: Lines and Angles": [
#             "Introduction and related angles",
#             "Pairs of lines",
#             "Checking for parallel lines"
#         ],
#         "Chapter 6: The Triangle and Its Properties": [
#             "Medians of a triangle",
#             "Altitudes of a triangle",
#             "Exterior angle and its property",
#             "Angle sum property of a triangle",
#             "Two special triangles: equilateral and isosceles",
#             "Sum of lengths of two sides of a triangle",
#             "Right-angled triangles and Pythagoras' property"
#         ],
#         "Chapter 7: Comparing Quantities": [
#             "Percentage– another way of comparing quantities",
#             "Uses of percentages",
#             "Prices related to an item (buying/selling scenarios)",
#             "Charge given on borrowed money or simple interest"
#         ],
#         "Chapter 8: Rational Numbers": [
#             "Introduction and need for rational numbers",
#             "Positive and negative rational numbers",
#             "Rational numbers on the number line",
#             "Rational numbers in standard form",
#             "Comparison of rational numbers",
#             "Rational numbers between two rational numbers",
#             "Operations on rational numbers"
#         ],
#         "Chapter 9: Perimeter and Area": [
#             "Area of parallelogram",
#             "Area of triangles",
#             "Understanding circles (circumference/area)"
#         ],
#         "Chapter 10: Algebraic Expressions": [
#             "Introduction to algebraic expressions",
#             "Formation of expressions",
#             "Terms of an expression",
#             "Like and unlike terms",
#             "Monomials, binomials, trinomials, polynomials",
#             "Finding the value of an expression"
#         ],
#         "Chapter 11: Exponents and Powers": [
#             "Introduction to exponents",
#             "Laws of exponents",
#             "Miscellaneous examples using laws of exponents",
#             "Decimal number system",
#             "Expressing large numbers in standard form"
#         ],
#         "Chapter 12: Symmetry": [
#             "Lines of symmetry for regular polygons",
#             "Rotational symmetry",
#             "Line symmetry vs. rotational symmetry"
#         ],
#         "Chapter 13: Visualising Solid Shapes": [
#             "Plane figures vs. solid shapes",
#             "Faces, edges, vertices of 3D shapes (cubes, cuboids, cones, etc.)",
#             "Visualisation from different perspectives"
#         ]
#     },
#     "Science": {
#         "Chapter1: Nutrition in Plants": [
#             "Photosynthesis",
#             "Modes of nutrition: Autotrophic, Heterotrophic",
#             "Saprotrophic nutrition",
#             "Structure of leaves"
#         ],
#         "Chapter2: Nutrition in Animals": [
#             "Human digestive system",
#             "Nutrition in different animals",
#             "Feeding habits"
#         ],
#         "Chapter3: Fibre to Fabric": [
#             "Natural fibres (Cotton, Wool, Silk)",
#             "Processing of fibres",
#             "Spinning, Weaving, Knitting"
#         ],
#         "Chapter4: Heat": [
#             "Hot and cold objects",                  
#             "Measurement of temperature",        
#             "Laboratory thermometer",         
#             "Transfer of heat",
#             "Kinds of clothes we wear in summer and winter"
#         ],
#         "Chapter5: Acids, Bases and Salts": [
#             "Acid and base indicators",
#             "Natural indicators around us",
#             "Neutralisation in daily life"
#         ],
#         "Chapter6: Physical and Chemical Changes": [
#             "Changes around us",
#             "Physical and chemical changes with examples",
#             "Rusting of iron and its prevention",
#             "Crystallisation"
#         ],
#         "Chapter7: Weather, Climate and Adaptations of Animals": [
#             "Difference between weather and climate",
#             "Climate and adaptation",
#             "Effect of climate on living organisms",
#             "Polar regions and tropical rainforests"
#         ],
#         "Chapter8: Winds, Storms and Cyclones": [
#             "Air exerts pressure",
#             "Air expands on heating",
#             "Wind currents and convection",
#             "Thunderstorms and cyclones"
#         ],
#         "Chapter9: Soil": [
#             "Soil profile and soil types",
#             "Properties of soil",
#             "Soil and crops"
#         ],
#         "Chapter10: Respiration in Organisms": [
#             "Why do we respire?",
#             "Types of respiration: aerobic and anaerobic",
#             "Breathing in animals and humans",
#             "Breathing cycle and rate"
#         ],
#         "Chapter11: Transportation in Animals and Plants": [
#             "Circulatory system: heart, blood, blood vessels",
#             "Excretion in animals",
#             "Transport of water and minerals in plants",
#             "Transpiration"
#         ],
#         "Chapter12: Reproduction in Plants": [
#             "Modes of reproduction: asexual and sexual",
#             "Vegetative propagation",
#             "Pollination and fertilisation",
#             "Seed dispersal"
#         ],
#         "Chapter13: Motion and Time": [
#             "Concept of speed",
#             "Measurement of time",
#             "Simple pendulum",
#             "Distance-time graph"
#         ],
#         "Chapter14: Electric Current and Its Effects": [
#             "Symbols of electric components",
#             "Heating effect of electric current",
#             "Magnetic effect of electric current",
#             "Electromagnet and its uses"
#         ],
#         "Chapter15: Light": [
#             "Reflection of light",
#             "Plane mirror image formation",
#             "Spherical mirrors and lenses",
#             "Uses of lenses"
#         ],
#         "Chapter16: Water: A Precious Resource": [
#             "Availability of water on earth",
#             "Forms of water",
#             "Groundwater and water table",
#             "Water management",
#             "Water scarcity and conservation"
#         ],
#         "Chapter17: Forests: Our Lifeline": [
#             "Importance of forests",
#             "Interdependence of plants and animals in forests",
#             "Deforestation and conservation"
#         ],
#         "Chapter18: Wastewater Story": [
#             "Importance of sanitation",
#             "Sewage and wastewater treatment",
#             "Sanitation at public places"
#         ]
#     },
#     "History": {
#         "Chapter 1: Tracing Changes through a Thousand Years": [
#             "Maps and how they tell us about history",
#             "New and old terminologies used by historians",
#             "Historians and their sources (manuscripts, inscriptions, coins)",
#             "New social and political groups",
#             "Region and empire"
#         ],
#         "Chapter 2: New Kings and Kingdoms": [
#             "Emergence of new dynasties",
#             "Administration in kingdoms",
#             "Warfare for wealth and power",
#             "Prashastis and land grants"
#         ],
#         "Chapter 3: The Delhi Sultans (12th–15th Century)": [
#             "Political and military expansion under rulers",
#             "Administration and consolidation",
#             "Construction of mosques and cities",
#             "Raziya Sultan and Muhammad Tughlaq case studies"
#         ],
#         "Chapter 4: The Mughal Empire (16th–17th Century)": [
#             "Establishment and expansion of the Mughal Empire",
#             "Akbar's policies and administration (Mansabdari system, sulh-i-kul)",
#             "Jahangir, Shah Jahan, Aurangzeb",
#             "Relations with other rulers"
#         ],
#         "Chapter 5: Rulers and Buildings / Tribes, Nomads and Settled Communities": [
#             "Tribal societies and their lifestyle",
#             "Nomadic pastoralists",
#             "Emergence of new caste-based communities",
#             "Interaction between nomads and settled societies"
#         ],
#         "Chapter 6: Devotional Paths to the Divine": [
#             "Bhakti movement and saints (Basavanna, Kabir, Mirabai, etc.)",
#             "Sufi traditions",
#             "New religious developments in different regions"
#         ],
#         "Chapter 7: The Making of Regional Cultures": [
#             "Language, literature, and regional identity",
#             "Regional art, dance, and music forms",
#             "Case study: Kathak and Manipuri",
#             "Regional traditions in temple architecture"
#         ],
#         "Chapter 8: Eighteenth Century Political Formations": [
#             "Decline of the Mughal Empire",
#             "Emergence of new independent kingdoms",
#             "Marathas, Sikhs, Jats, Rajputs",
#             "Regional states and their administration"
#         ]
#     },
#     "Civics": {
#         "Chapter 1: On Equality": [
#             "Equality in Indian democracy",
#             "Issues of inequality (caste, religion, gender, economic)",
#             "Government efforts to promote equality"
#         ],
#         "Chapter 2: Role of the Government in Health": [
#             "Public health services vs. private health services",
#             "Importance of healthcare",
#             "Inequality in access to healthcare",
#             "Case studies"
#         ],
#         "Chapter 3: How the State Government Works": [
#             "Role of the Governor and Chief Minister",
#             "State legislature and its functioning",
#             "Role of MLAs",
#             "Case study of a state government decision"
#         ],
#         "Chapter 4: Growing up as Boys and Girls": [
#             "Gender roles in society",
#             "Stereotypes related to boys and girls",
#             "Experiences of growing up in different societies",
#             "Equality for women"
#         ],
#         "Chapter 5: Women Change the World": [
#             "Women in education and work",
#             "Struggles for equality",
#             "Case studies of women achievers",
#             "Laws for women's rights"
#         ],
#         "Chapter 6: Understanding Media": [
#             "Role of media in democracy",
#             "Influence of media on public opinion",
#             "Commercialisation and bias in media",
#             "Need for independent media"
#         ],
#         "Chapter 7: Markets Around Us": [
#             "Weekly markets, shops, and malls",
#             "Chain of markets (producers to consumers)",
#             "Role of money and middlemen",
#             "Impact on farmers and small traders"
#         ],
#         "Chapter 8: A Shirt in the Market": [
#             "Process of production and distribution",
#             "Globalisation and trade",
#             "Role of traders, exporters, workers",
#             "Consumer awareness"
#         ]
#     },
#     "Geography": {
#         "Chapter 1: Environment": [
#             "Components of environment (natural, human, human-made)",
#             "Ecosystem",
#             "Balance in the environment"
#         ],
#         "Chapter 2: Inside Our Earth": [
#             "Layers of the earth (crust, mantle, core)",
#             "Types of rocks (igneous, sedimentary, metamorphic)",
#             "Rock cycle",
#             "Minerals and their uses"
#         ],
#         "Chapter 3: Our Changing Earth": [
#             "Lithosphere movements (earthquakes, volcanoes)",
#             "Major landform features (mountains, plateaus, plains)",
#             "Work of rivers, wind, glaciers, sea waves"
#         ],
#         "Chapter 4: Air": [
#             "Composition of atmosphere",
#             "Structure of atmosphere",
#             "Weather and climate",
#             "Distribution of temperature and pressure",
#             "Wind and moisture"
#         ],
#         "Chapter 5: Water": [
#             "Distribution of water on earth",
#             "Water cycle",
#             "Oceans (waves, tides, currents)",
#             "Importance of water"
#         ],
#         "Chapter 6: Human-Environment Interactions– The Tropical and the Subtropical Region": [
#             "Amazon basin (equatorial region)",
#             "Ganga-Brahmaputra basin (subtropical region)",
#             "Life of people in these regions"
#         ],
#         "Chapter 7: Life in the Deserts": [
#             "Hot deserts (Sahara)",
#             "Cold deserts (Ladakh)",
#             "Adaptations of people and animals",
#             "Economic activities in deserts"
#         ]
#     }
# },
#    "8th": {
#     "Computers": {
#         "Chapter:1 Exception Handling in Python": [
#             "Introduction to errors and exceptions",
#             "Types of errors: Syntax errors, Runtime errors (exceptions), Logical errors",
#             "Built-in exceptions (ZeroDivisionError, ValueError, etc.)",
#             "Using try–except block",
#             "try–except–else–finally structure",
#             "Raising exceptions using raise",
#             "Real-life examples of exception handling (division by zero, invalid input)"
#         ],
#         "Chapter:2 File Handling in Python": [
#             "Introduction to file handling",
#             "Types of files: Text files, Binary files",
#             "Opening and closing files (open(), close())",
#             "File modes (r, w, a, r+)",
#             "Reading from a file (read(), readline(), readlines())",
#             "Writing to a file (write(), writelines())",
#             "File pointer and cursor movement (seek(), tell())",
#             "Practical applications: saving student records, logs, etc."
#         ],
#         "Chapter:3 Stack (Data Structure)": [
#             "Introduction to stack",
#             "LIFO principle (Last In First Out)",
#             "Stack operations: Push, Pop, Peek/Top",
#             "Stack implementation using list in Python or modules (collections.deque)",
#             "Applications: Undo operation in editors, Function call management"
#         ],
#         "Chapter:4 Queue (Data Structure)": [
#             "Introduction to queue",
#             "FIFO principle (First In First Out)",
#             "Queue operations: Enqueue, Dequeue",
#             "Types of queues: Simple, Circular, Deque, Priority",
#             "Implementation in Python using lists or queue module",
#             "Applications: Printer task scheduling, Customer service systems"
#         ],
#         "Chapter:5 Sorting": [
#             "Importance of sorting in data organization",
#             "Basic sorting techniques: Bubble Sort, Selection Sort, Insertion Sort",
#             "Advanced sorting (introductory): Merge Sort, Quick Sort",
#             "Sorting in Python using built-in methods: sorted() function"
#         ]
#     },
#     "English": {
#         " Unit:1 Honeydew – Prose": [
#             "The Best Christmas Present in the World: Narrative comprehension, vocabulary",
#             "The Tsunami: Disaster narrative, sequencing events",
#             "Glimpses of the Past: Historical narrative, chronology",
#             "Bepin Choudhury's Lapse of Memory: Character sketch, irony",
#             "The Summit Within: Motivation, descriptive writing",
#             "This is Jody's Fawn: Empathy, moral choice",
#             "A Visit to Cambridge: Biographical narrative",
#             "A Short Monsoon Diary: Diary entry style",
#             "The Great Stone Face – I: Description, prediction",
#             "The Great Stone Face – II: Conclusion, moral lesson"
#         ],
#         "Unit:2 Honeydew – Poems": [
#             "The Ant and the Cricket: Moral fable, rhyme scheme",
#             "Geography Lesson: Imagery, meaning",
#             "Macavity: The Mystery Cat: Humour, personification",
#             "The Last Bargain: Metaphor, symbolism",
#             "The School Boy: Theme of education, freedom",
#             "The Duck and the Kangaroo: Rhyme, humour",
#             "When I set out for Lyonnesse: Imagination, rhyme",
#             "On the Grasshopper and Cricket: Nature imagery"
#         ],
#         "Unit:3 It So Happened – Supplementary": [
#             "How the Camel Got His Hump: Fable, character traits",
#             "Children at Work: Social issue, empathy",
#             "The Selfish Giant: Allegory, moral theme",
#             "The Treasure Within: Education, individuality",
#             "Princess September: Freedom, symbolism",
#             "The Fight: Conflict resolution",
#             "The Open Window: Humour, irony",
#             "Jalebis: Humour, moral lesson",
#             "The Comet – I: Science fiction, prediction",
#             "The Comet – II: Resolution, conclusion"
#         ]
#     },
#     "Mathematics": {
#         "Chapter 1: Rational Numbers": ["Introduction", "Properties of Rational Numbers", "Representation of Rational Numbers on the Number Line", "Rational Number between Two Rational Numbers", "Word Problems"],
#         "Chapter 2: Linear Equations in One Variable": ["Introduction", "Solving Equations which have Linear Expressions on one Side and Numbers on the other Side", "Some Applications", "Solving Equations having the Variable on both sides", "Some More Applications", "Reducing Equations to Simpler Form", "Equations Reducible to the Linear Form"],
#         "Chapter 3: Understanding Quadrilaterals": ["Introduction", "Polygons", "Sum of the Measures of the Exterior Angles of a Polygon", "Kinds of Quadrilaterals", "Some Special Parallelograms"],
#         "Chapter 4: Data Handling": ["Looking for Information", "Organising Data", "Grouping Data", "Circle Graph or Pie Chart", "Chance and Probability"],
#         "Chapter 5: Squares and Square Roots": ["Introduction", "Properties of Square Numbers", "Some More Interesting Patterns", "Finding the Square of a Number", "Square Roots", "Square Roots of Decimals", "Estimating Square Root"],
#         "Chapter 6: Cubes and Cube Roots": ["Introduction", "Cubes", "Cubes Roots"],
#         "Chapter 7: Comparing Quantities": ["Recalling Ratios and Percentages", "Finding the Increase and Decrease Percent", "Finding Discounts", "Prices Related to Buying and Selling (Profit and Loss)", "Sales Tax/Value Added Tax/Goods and Services Tax", "Compound Interest", "Deducing a Formula for Compound Interest", "Rate Compounded Annually or Half Yearly (Semi Annually)", "Applications of Compound Interest Formula"],
#         "Chapter 8: Algebraic Expressions and Identities": ["What are Expressions?", "Terms, Factors and Coefficients", "Monomials, Binomials and Polynomials", "Like and Unlike Terms", "Addition and Subtraction of Algebraic Expressions", "Multiplication of Algebraic Expressions: Introduction", "Multiplying a Monomial by a Monomial", "Multiplying a Monomial by a Polynomial", "Multiplying a Polynomial by a Polynomial", "What is an Identity?", "Standard Identities", "Applying Identities"],
#         "Chapter 9: Mensuration": ["Introduction", "Let us Recall", "Area of Trapezium", "Area of General Quadrilateral", "Area of Polygons", "Solid Shapes", "Surface Area of Cube, Cuboid and Cylinder", "Volume of Cube, Cuboid and Cylinder", "Volume and Capacity"],
#         "Chapter 10: Exponents and Powers": ["Introduction", "Powers with Negative Exponents", "Laws of Exponents", "Use of Exponents to Express Small Numbers in Standard Form"],
#         "Chapter 11: Direct and Inverse Proportions": ["Introduction", "Direct Proportion", "Inverse Proportion"],
#         "Chapter 12: Factorisation": ["Introduction", "What is Factorisation?", "Division of Algebraic Expressions", "Division of Algebraic Expressions Continued (Polynomial / Polynomial)", "Can you Find the Error?"],
#         "Chapter 13: Introduction to Graphs": ["Introduction", "Linear Graphs", "Some Applications"]
#     },
#     "Science": {
#         "Chapter:1 Crop Production and Management": ["Agriculture practices", "Crop production techniques", "Storage and preservation"],
#         "Chapter:2 Microorganisms: Friend and Foe": ["Bacteria, viruses, fungi", "Useful microbes", "Harmful microbes and diseases"],
#         "Chapter:3 Synthetic Fibres and Plastics": ["Types of synthetic fibres", "Characteristics and uses", "Plastics: Thermoplastics, Thermosetting"],
#         "Chapter:4 Materials: Metals and Non-Metals": ["Physical and chemical properties", "Reactivity series", "Uses of metals and non-metals"],
#         "Chapter:5 Coal and Petroleum": ["Fossil fuels", "Refining petroleum", "Uses of coal and petroleum"],
#         "Chapter:6 Combustion and Flame": ["Types of combustion", "Structure of flame", "Fire safety"],
#         "Chapter:7 Conservation of Plants and Animals": ["Biodiversity", "Endangered species", "Wildlife conservation"],
#         "Chapter:8 Cell – Structure and Functions": ["Plant and animal cell", "Cell organelles", "Cell division"],
#         "Chapter:9 Reproduction in Animals": ["Modes of reproduction", "Human reproductive system", "Fertilization and development"],
#         "Chapter:10 Force and Pressure": ["Types of forces", "Pressure in solids, liquids, and gases", "Applications"],
#         "Chapter:11 Friction": ["Advantages and disadvantages", "Reducing friction"],
#         "Chapter:12 Sound": ["Production and propagation", "Characteristics of sound", "Human ear"],
#         "Chapter:13 Chemical Effects of Electric Current": ["Electrolysis", "Applications in daily life"],
#         "Chapter:14 Some Natural Phenomena": ["Lightning, Earthquakes, and Safety measures"],
#         "Chapter:15 Light": ["Reflection, refraction, dispersion", "Human eye and defects"],
#         "Chapter:16 Stars and the Solar System": ["Solar system structure", "Planets, moons, comets, and meteors"],
#         "Chapter:17 Pollution of Air and Water": ["Causes and effects", "Control measures"]
#     },
#     "History": {
#             "Chapter 1: How, When and Where": ["How do we periodise history?", "Importance of dates and events", "Sources for studying modern history", "Official records of the British administration"],
#             "Chapter 2: From Trade to Territory– The Company Establishes Power": ["East India Company comes to India", "Establishment of trade centres", "Battle of Plassey and Buxar", "Expansion of British power in India", "Subsidiary alliance and doctrine of lapse"],
#             "Chapter 3: Ruling the Countryside": ["The revenue system under British rule", "Permanent Settlement, Ryotwari and Mahalwari systems", "Effects of British land revenue policies", "Role of indigo cultivation and indigo revolt"],
#             "Chapter 4: Tribals, Dikus and the Vision of a Golden Age": ["Tribal societies and their livelihoods", "Impact of British policies on tribal life", "Tribal revolts and resistance", "Birsa Munda and his movement"],
#             "Chapter 5: When People Rebel– 1857 and After": ["Causes of the revolt of 1857", "Important centres of the revolt", "Leaders and their roles", "Suppression of the revolt", "Consequences and significance"],
#             "Chapter 6: Civilising the 'Native', Educating the Nation": ["The British view on education in India", "Orientalist vs Anglicist debate", "Macaulay's Minute on Education", "Wood's Despatch", "Growth of national education system"],
#             "Chapter 7: Women, Caste and Reform": ["Social reform movements in the 19th century", "Reformers and their contributions (Raja Ram Mohan Roy, Ishwar Chandra Vidyasagar, Jyotiba Phule, etc.)", "Movements against caste discrimination", "Role of women in reform and education"],
#             "Chapter 8: The Making of the National Movement: 1870s–1947": ["Rise of nationalism in India", "Formation of Indian National Congress", "Moderates, extremists, and their methods", "Partition of Bengal, Swadeshi and Boycott", "Gandhian era movements (Non-Cooperation, Civil Disobedience, Quit India)", "Role of revolutionaries and other leaders", "Towards Independence and Partition"]
       
#     },
#     "Civics": {
#             "Chapter 1: The Indian Constitution": ["Importance and features of the Constitution", "Fundamental Rights and Duties", "Directive Principles of State Policy", "Role of the Constitution in democracy"],
#             "Chapter 2: Understanding Secularism": ["Meaning of secularism", "Secularism in India", "Importance of religious tolerance", "Role of the State in maintaining secularism"],
#             "Chapter 3: Parliament and the Making of Laws": ["Why do we need a Parliament?", "Two Houses of Parliament (Lok Sabha, Rajya Sabha)", "Law-making process in Parliament", "Role of the President in legislation"],
#             "Chapter 4: Judiciary": ["Structure of the Indian judiciary", "Independence of the judiciary", "Judicial review and judicial activism", "Public Interest Litigation (PIL)"],
#             "Chapter 5: Understanding Marginalisation": ["Concept of marginalisation", "Marginalised groups in India (Adivasis, Dalits, Minorities)", "Issues faced by marginalised communities"],
#             "Chapter 6: Confronting Marginalisation": ["Safeguards in the Constitution for marginalised groups", "Laws protecting marginalised communities", "Role of social reformers and activists"],
#             "Chapter 7: Public Facilities": ["Importance of public facilities (water, healthcare, education, transport)", "Role of the government in providing facilities", "Issues of inequality in access to facilities"],
#             "Chapter 8: Law and Social Justice": ["Need for laws to ensure social justice", "Workers' rights and protection laws", "Child labour and related legislation", "Role of government in ensuring justice"]
       
#     },
#     "Geography": {
#             "Chapter 1: Resources": ["Types of resources (natural, human-made, human)", "Classification: renewable, non-renewable, ubiquitous, localized", "Resource conservation and sustainable development"],
#             "Chapter 2: Land, Soil, Water, Natural Vegetation and Wildlife Resources": ["Land use and land degradation", "Soil types and soil conservation", "Water resources and conservation methods", "Natural vegetation types and importance", "Wildlife resources and conservation"],
#             "Chapter 3: Agriculture": ["Types of farming (subsistence, intensive, commercial, plantation)", "Major crops (rice, wheat, cotton, sugarcane, tea, coffee, etc.)", "Agricultural development in different countries", "Impact of technology on agriculture"],
#             "Chapter 4: Industries": ["Types of industries (raw material-based, size-based, ownership-based)", "Factors affecting location of industries", "Major industrial regions of the world", "Case studies: IT industry (Bangalore), Cotton textile industry (Ahmedabad/Osaka)"],
#             "Chapter 5: Human Resources": ["Population distribution and density", "Factors influencing population distribution", "Population change (birth rate, death rate, migration)", "Population pyramid", "Importance of human resources for development"]
       
#     }
# },
#     "9th": {
#     "Computers": {
#         "Chapter:1 Basics of Computer System": [
#             "Introduction to computer system",
#             "Components: Input devices, Output devices, Storage devices, CPU",
#             "Memory types: Primary, Secondary, Cache",
#             "Number system basics: binary, decimal, conversion",
#             "Difference between hardware, software, firmware"
#         ],
#         "Chapter:2 Types of Software": [
#             "What is software?",
#             "Categories: System software, Utility software, Application software, Programming software",
#             "Open-source vs Proprietary",
#             "Freeware, Shareware, Licensed software"
#         ],
#         "Chapter:3 Operating System": [
#             "Definition and importance of OS",
#             "Functions: Process management, Memory management, File management, Device management",
#             "User interface (CLI vs GUI)",
#             "Types: Batch, Time-sharing, Real-time, Distributed",
#             "Popular examples: Windows, Linux, Android"
#         ],
#         "Chapter:4 Introduction to Python Programming": [
#             "Introduction to Python & its features",
#             "Writing and running Python programs",
#             "Variables, data types, operators",
#             "Control structures: if, if-else, elif; loops: for, while",
#             "Functions (introductory)"
#         ],
#         "Chapter:5 Introduction to Cyber Security": [
#             "What is cyber security?",
#             "Types of cyber threats: Malware, Viruses, Worms, Phishing, Ransomware, Spyware, Trojans",
#             "Cyber safety measures: Strong passwords, 2FA, Firewalls, antivirus, backups",
#             "Cyber ethics and responsible digital behavior",
#             "Awareness of cyber laws (basic introduction to IT Act in India)"
#         ]
#     },
#     "English": {
#         "Unit:1 Beehive – Prose": [
#             "The Fun They Had: Futuristic setting, comprehension",
#             "The Sound of Music: Inspiration, biography",
#             "The Little Girl: Family relationships",
#             "A Truly Beautiful Mind: Biography, Albert Einstein",
#             "The Snake and the Mirror: Irony, humour",
#             "My Childhood: Autobiography, Dr. A.P.J. Abdul Kalam",
#             "Reach for the Top: Inspiration, character sketch",
#             "Kathmandu: Travelogue",
#             "If I Were You: Play, dialogue comprehension"
#         ],
#         "Unit:2 Beehive – Poems": [
#             "The Road Not Taken: Choices, symbolism",
#             "Wind: Nature, strength",
#             "Rain on the Roof: Imagery, childhood memories",
#             "The Lake Isle of Innisfree: Peace, nature imagery",
#             "A Legend of the Northland: Ballad, moral",
#             "No Men Are Foreign: Universal brotherhood",
#             "On Killing a Tree: Nature, destruction",
#             "A Slumber Did My Spirit Seal: Theme of death, imagery"
#         ],
#         "Unit:3 Moments – Supplementary": [
#             "The Lost Child: Childhood, emotions",
#             "The Adventures of Toto: Humour, pet story",
#             "Iswaran the Storyteller: Imaginative storytelling",
#             "In the Kingdom of Fools: Folk tale, humour",
#             "The Happy Prince: Allegory, sacrifice",
#             "The Last Leaf: Hope, sacrifice",
#             "A House is Not a Home: Autobiographical, resilience",
#             "The Beggar: Compassion, transformation"
#         ]
#     },
#     "Mathematics": {
#         "Chapter1: Number System": ["Real Numbers"],
#         "Chapter2: Algebra": ["Polynomials", "Linear Equations in Two Variables"],
#         "Chapter3: Coordinate Geometry": ["Coordinate Geometry"],
#         "Chapter4: Geometry": ["Introduction to Euclid's Geometry","Lines and Angles","Triangles","Quadrilaterals","Circles"],
#         "Chapter5: Mensuration": ["Areas", "Surface Areas and Volumes"],
#         "Chapter6: Statistics": ["Statistics"]
#     },
#     "Science": {
#         "Chapter:1 Matter in Our Surroundings": ["States of matter", "Properties of solids, liquids, and gases", "Changes of state"],
#         "Chapter:2 Is Matter Around Us Pure?": ["Mixtures, solutions, alloys", "Separation techniques"],
#         "Chapter:3 Atoms and Molecules": ["Laws of chemical combination", "Atomic and molecular masses", "Mole concept"],
#         "Chapter:4 Structure of the Atom": ["Discovery of electron, proton, neutron", "Atomic models"],
#         "Chapter:5 The Fundamental Unit of Life": ["Cell structure", "Cell organelles", "Cell functions"],
#         "Chapter:6 Tissues": ["Plant tissues", "Animal tissues"],
#         "Chapter:7 Diversity of the Living Organisms – I": ["Classification of organisms", "Kingdom Monera, Protista, Fungi"],
#         "Chapter:8 Diversity of the Living Organisms – II": ["Plant kingdom", "Angiosperms, Gymnosperms"],
#         "Chapter:9 Diversity of the Living Organisms – III": ["Animal kingdom", "Classification of animals"],
#         "Chapter:10 Motion": ["Distance, displacement, speed, velocity", "Acceleration, uniform and non-uniform motion"],
#         "Chapter:11 Force and Laws of Motion": ["Newton's laws", "Momentum, force, and inertia"],
#         "Chapter:12 Gravitation": ["Universal law of gravitation", "Acceleration due to gravity", "Free fall"],
#         "Chapter:13 Work and Energy": ["Work done", "Kinetic and potential energy", "Power"],
#         "Chapter:14 Sound": ["Propagation of sound", "Characteristics", "Echo"],
#         "Chapter:15 Why Do We Fall Ill?": ["Health and diseases", "Pathogens", "Immunity and vaccination"],
#         "Chapter:16 Natural Resources": ["Air, water, soil, forests, minerals", "Conservation"],
#         "Chapter:17 Improvement in Food Resources": ["Crop varieties", "Animal husbandry", "Food processing"]
#     },
#     "History": {
#         "Chapter 1: The French Revolution": [
#             "French society in the late 18th century",
#             "The outbreak of the Revolution",
#             "France becomes a constitutional monarchy",
#             "The Reign of Terror",
#             "The rise of Napoleon",
#             "Impact of the Revolution on France and the world"
#         ],
#         "Chapter 2: Socialism in Europe and the Russian Revolution": [
#             "Age of social change in Europe",
#             "The Russian Empire in 1914",
#             "The February Revolution",
#             "The October Revolution and Bolsheviks in power",
#             "Stalinism and collectivisation",
#             "Industrial society and social change",
#             "Global influence of the Russian Revolution"
#         ],
#         "Chapter 3: Nazism and the Rise of Hitler": [
#             "Birth of the Weimar Republic",
#             "Hitler's rise to power",
#             "Nazi ideology and propaganda",
#             "Establishment of a Nazi state",
#             "Role of youth in Nazi Germany",
#             "Racial policies and Holocaust", 
#             "Crimes against humanity"
#         ],
#         "Chapter 4: Forest Society and Colonialism": [
#             "Deforestation under colonial rule",
#             "Rise of commercial forestry",  
#             "Rebellions in forests (Bastar, Java)",
#             "Impact on local communities"
#         ],
#         "Chapter 5: Pastoralists in the Modern World (Periodic Assessment only)": [
#             "Pastoralism as a way of life",
#             "Colonial impact on pastoral communities",
#             "Case studies– Maasai (Africa), Raikas (India)",
#             "Pastoralism in modern times"
#         ]
#     },
#     "Geography": {
#         "Chapter 1: India– Size and Location": ["Location and extent of India", "India and its neighbours", "Significance of India's location"],
#         "Chapter 2: Physical Features of India": [
#             "Formation of physiographic divisions",
#             "Himalayas",
#             "Northern Plains",
#             "Peninsular Plateau",
#             "Indian Desert",
#             "Coastal Plains",
#             "Islands"
#         ],
#         "Chapter 3: Drainage": [
#             "Himalayan river systems",
#             "Peninsular river systems",
#             "Role and importance of rivers",
#             "Lakes in India",
#             "River pollution and conservation"
#         ],
#         "Chapter 4: Climate": [
#             "Factors influencing climate",
#             "Monsoon mechanism",
#             "Seasons in India",
#             "Rainfall distribution",
#             "Monsoon as a unifying bond"
#         ],
#         "Chapter 5: Natural Vegetation and Wildlife": [
#             "Types of vegetation in India",
#             "Distribution of forests",
#             "Wildlife species",
#             "Conservation of forests and wildlife"
#         ],
#         "Chapter 6: Population": [
#             "Size and distribution of population",
#             "Population growth and processes (birth, death, migration)",
#             "Age composition",
#             "Sex ratio",
#             "Literacy rate",
#             "Population as an asset vs liability"
#         ]
#     },
#     "Civics": {
#         "Chapter 1: What is Democracy? Why Democracy?": [
#             "Meaning of democracy",
#             "Main features of democracy",
#             "Arguments for and against democracy",
#             "Broader meaning of democracy"
#         ],
#         "Chapter 2: Constitutional Design": [
#             "Democratic Constitution in South Africa",
#             "Why a Constitution is needed",
#             "Making of the Indian Constitution",
#             "Guiding values of the Constitution"
#         ],
#         "Chapter 3: Electoral Politics": [
#             "Why elections are needed",
#             "Indian election system",
#             "Free and fair elections",
#             "Role of the Election Commission"
#         ],
#         "Chapter 4: Working of Institutions": [
#             "Parliament and its role",
#             "The Executive– President, Prime Minister, Council of Ministers",
#             "Lok Sabha and Rajya Sabha",
#             "The Judiciary",
#             "Decision-making process in democracy"
#         ],
#         "Chapter 5: Democratic Rights": [
#             "Importance of rights in democracy",
#             "Fundamental Rights in the Indian Constitution",
#             "Right to Equality, Freedom, Religion, Education, Remedies",
#             "Rights in practice– case studies"
#         ]
#     },
#     "Economics": {
#         "Chapter 1: The Story of Village Palampur": [
#             "Farming and non-farming activities",
#             "Factors of production (land, labour, capital, entrepreneurship)",
#             "Organisation of production"
#         ],
#         "Chapter 2: People as Resource": [
#             "People as an asset vs liability",
#             "Role of education in human capital formation",
#             "Role of health in human capital",
#             "Unemployment and its types",
#             "Role of women and children in the economy"
#         ],
#         "Chapter 3: Poverty as a Challenge": [
#             "Two typical cases of poverty",
#             "Poverty trends in India",
#             "Causes of poverty",
#             "Anti-poverty measures and programmes"
#         ],
#         "Chapter 4: Food Security in India": [
#             "Meaning and need for food security",
#             "Dimensions of food security",
#             "Public Distribution System (PDS)",
#             "Role of cooperatives and government programmes"
#         ]
#     }
# },
#    "10th": {
#     "Computers": {
#         "Chapter 1: Computer Fundamentals": [
#             "Introduction to Computer Systems",
#             "Number systems: binary, decimal, octal, hexadecimal",
#             "Logic gates: AND, OR, NOT (truth tables)",
#             "Computer hardware components: input, output, storage, CPU",
#             "Types of memory: primary, secondary, cache, virtual memory",
#             "Software overview: System, Application, Utilities",
#             "Computer networks: LAN, MAN, WAN, Internet, intranet, extranet",
#             "Data transmission: wired vs wireless",
#             "Cloud computing basics",
#             "Emerging technologies: AI, IoT, Big Data (introductory)"
#         ],
#         "Chapter 2: Advanced GIMP (GNU Image Manipulation Program)": [
#             "Introduction to GIMP interface",
#             "Layers and layer management",
#             "Image editing tools: crop, scale, rotate, flip, perspective",
#             "Color tools: brightness/contrast, hue/saturation, levels, curves",
#             "Selection tools: free select, fuzzy select, paths",
#             "Using filters and effects",
#             "Working with text in GIMP",
#             "Creating banners, posters, digital artwork",
#             "Exporting images in different formats"
#         ],
#         "Chapter 3: Tables (HTML)": [
#             "Introduction to HTML tables",
#             "Table structure: <table>, <tr>, <td>, <th>",
#             "Attributes: border, cellpadding, cellspacing, align, width, height",
#             "Rowspan and Colspan",
#             "Adding captions, Nested tables",
#             "Styling tables with CSS"
#         ],
#         "Chapter 4: Forms (HTML)": [
#             "Introduction to forms",
#             "Form elements: Textbox, Password, Radio buttons, Checkboxes, Dropdown, Text area, Buttons",
#             "Attributes: name, value, placeholder, required",
#             "Form validation (basic HTML5)",
#             "Form action and method (GET, POST)",
#             "Simple login/registration forms"
#         ],
#         "Chapter 5: DHTML & CSS": [
#             "Dynamic HTML: HTML + CSS + JavaScript",
#             "Role of JavaScript in interactive pages",
#             "Examples: rollover images, dynamic content updates",
#             "CSS types: Inline, Internal, External",
#             "CSS syntax: selectors, properties, values",
#             "Styling text, backgrounds, borders, box model",
#             "Positioning: static, relative, absolute, fixed",
#             "Pseudo classes: :hover, :active, :first-child",
#             "CSS for tables and forms"
#         ]
#     },
#     "English": {
#         "Unit1: First Flight – Prose": [
#             "A Letter to God: Faith, irony",
#             "Nelson Mandela: Long Walk to Freedom: Biography, freedom struggle",
#             "From the Diary of Anne Frank: Diary, war, resilience",
#             "Glimpses of India: Travel, culture",
#             "Madam Rides the Bus: Childhood curiosity",
#             "The Sermon at Benares: Teachings of Buddha",
#             "Mijbil the Otter: Pet story, humour",
#             "The Proposal: One-act play, satire"
#         ],
#         "Unit2: First Flight – Poems": [
#             "Dust of Snow: Symbolism, nature",
#             "Fire and Ice: Symbolism, theme of destruction",
#             "The Ball Poem: Childhood loss, learning",
#             "A Tiger in the Zoo: Freedom vs captivity",
#             "How to Tell Wild Animals: Humour, description",
#             "The Trees: Environment, imagery",
#             "Fog: Metaphor, imagery",
#             "The Tale of Custard the Dragon: Humour, rhyme",
#             "For Anne Gregory: Beauty, inner vs outer"
#         ],
#         "Unit3: Footprints Without Feet – Supplementary": [
#             "A Triumph of Surgery: Pet story, care",
#             "The Thief's Story: Trust, honesty",
#             "The Midnight Visitor: Detective, suspense",
#             "A Question of Trust: Irony, theft",
#             "Footprints Without Feet: Science fiction, invisibility",
#             "The Making of a Scientist: Biography, Richard Ebright",
#             "The Necklace: Irony, fate",
#             "Bholi: Education, empowerment",
#             "The Book That Saved the Earth: Science fiction, humour"
#         ]
#     },
#     "Mathematics": {
#         "Chapter 1: Number Systems": ["Real Number"],
#         "Chapter 2: Algebra": ["Polynomials", "Pair of Linear Equations in Two Variables", "Quadratic Equations", "Arithmetic Progressions"],
#         "Chapter 3: Coordinate Geometry": ["Coordinate Geometry"],
#         "Chapter 4: Geometry": ["Triangles", "Circles"],
#         "Chapter 5: Trigonometry": ["Introduction to Trigonometry", "Trigonometric Identities", "Heights and Distances"],
#         "Chapter 6: Mensuration": ["Areas Related to Circles", "Surface Areas and Volumes"],
#         "Chapter 7: Statistics and Probability": ["Statistics", "Probability"]
#     },
#     "Science": {
#         "Chapter 1: Chemical Reactions and Equations": ["Types of Chemical Reactions", "Writing and Balancing Chemical Equations", "Effects of Oxidation and Reduction", "Types of Oxidizing and Reducing Agents"],
#         "Chapter 2: Acids, Bases, and Salts": ["Properties of Acids and Bases", "pH Scale", "Uses of Acids and Bases"],
#         "Chapter 3: Metals and Non-Metals": ["Properties of Metals and Non-Metals", "Reactivity Series of Metals", "Occurrence and Extraction of Metals", "Corrosion of Metals", "Uses of Metals and Non-Metals"],
#         "Chapter 4: Carbon and Its Compounds": ["Covalent Bonding", "Homologous Series", "Saturated and Unsaturated Compounds", "Functional Groups", "Important Carbon Compounds and Their Uses"],
#         "Chapter 5: Periodic Classification of Elements": ["Mendeleev's Periodic Table", "Modern Periodic Table", "Properties of Elements in Groups", "Properties of Elements in Periods"],
#         "Chapter 6: Life Processes": ["Nutrition", "Respiration", "Excretion"],
#         "Chapter 7: Control and Coordination": ["Nervous System", "Hormones"],
#         "Chapter 8: How do Organisms Reproduce?": ["Modes of Reproduction", "Reproductive Health"],
#         "Chapter 9: Heredity and Evolution": ["Mendel's Experiments", "Evolution Theories"],
#         "Chapter 10: Light – Reflection and Refraction": ["Mirror & Lens Formulas", "Applications"],
#         "Chapter 11: Human Eye and Colourful World": ["Human Eye", "Colourful World"],
#         "Chapter 12: Electricity": ["Ohm's Law", "Series & Parallel Circuits"],
#         "Chapter 13: Magnetic Effects of Electric Current": ["Electromagnetism", "Applications"],
#         "Chapter 14: Sources of Energy": ["Conventional Sources of Energy", "Non-Conventional Sources of Energy"],
#         "Chapter 15: Our Environment": ["Ecosystem", "Ozone Layer"],
#         "Chapter 16: Sustainable Management of Natural Resources": ["Forest & Wildlife", "Water Management"]
#     },
#     "History": {
#         "Chapter 1: The Rise of Nationalism in Europe": ["French Revolution and the idea of the nation", "The making of nationalism in Europe", "The age of revolutions: 1830–1848", "The making of Germany and Italy", "Visualising the nation– nationalism and imperialism"],
#         "Chapter 2: Nationalism in India": ["First World War and nationalism in India", "The Non-Cooperation Movement", "Differing strands within the movement", "Civil Disobedience Movement", "The sense of collective belonging"],
#         "Chapter 3: The Making of a Global World": ["The pre-modern world", "The nineteenth century (1815–1914)", "The inter-war economy", "Rebuilding a world economy: post–1945"],
#         "Chapter 4: The Age of Industrialisation": ["Before the Industrial Revolution", "Hand labour and steam power", "Industrialisation in the colonies", "Factories come up", "The peculiarities of industrial growth", "Market for goods"],
#         "Chapter 5: Print Culture and the Modern World": ["The first printed books", "Print comes to Europe", "The print revolution and its impact", "The reading mania", "The nineteenth century and print", "India and the world of print", "Religious reform and public debates", "New forms of publication and literature"]
#     },
#     "Geography": {
#         "Chapter 1: Resources and Development": ["Types of resources– natural, human, sustainable", "Development of resources", "Resource planning in India", "Land resources and land use patterns", "Land degradation and conservation measures", "Soil as a resource– classification, distribution, conservation"],
#         "Chapter 2: Forest and Wildlife Resources": ["Flora and fauna in India", "Types and distribution of forests", "Depletion of forests and conservation", "Forest conservation movements (Chipko, Beej Bachao Andolan)", "Government initiatives– IUCN, Indian Wildlife Protection Act"],
#         "Chapter 3: Water Resources": ["Water scarcity and its causes", "Multipurpose river projects and integrated water resources management", "Rainwater harvesting"],
#         "Chapter 4: Agriculture": ["Types of farming", "Cropping patterns (Kharif, Rabi, Zaid)", "Major crops (rice, wheat, maize, pulses, oilseeds, sugarcane, cotton, jute)", "Technological and institutional reforms", "Contribution of agriculture to the national economy"],
#         "Chapter 5: Minerals and Energy Resources": ["Types of minerals and their distribution", "Uses of minerals", "Conventional sources of energy– coal, petroleum, natural gas, electricity", "Non-conventional sources of energy– solar, wind, tidal, geothermal, nuclear", "Conservation of energy resources"],
#         "Chapter 6: Manufacturing Industries": ["Importance of manufacturing", "Industrial location factors", "Classification of industries (based on size, ownership, raw material, product)", "Major industries– cotton, jute, iron and steel, aluminium, chemical, fertiliser, cement, automobile, IT", "Industrial pollution and environmental degradation", "Control of environmental degradation"],
#         "Chapter 7: Lifelines of National Economy": ["Roadways", "Railways", "Pipelines", "Waterways", "Airways", "Communication systems", "International trade"]
#     },
#     "Civics": {
#         "Chapter 1: Power Sharing": ["Ethnic composition of Belgium and Sri Lanka", "Majoritarianism in Sri Lanka", "Accommodation in Belgium", "Why power sharing is desirable", "Forms of power sharing"],
#         "Chapter 2: Federalism": ["What makes India a federal country", "Features of federalism", "Division of powers between Union and State", "Decentralisation in India– 73rd and 74th Amendments"],
#         "Chapter 3: Gender, Religion and Caste": ["Gender and politics", "Religion and politics", "Caste and politics"],
#         "Chapter 4: Political Parties": ["Why do we need political parties?", "Functions of political parties", "National parties and state parties", "Challenges to political parties", "How can parties be reformed?"],
#         "Chapter 5: Outcomes of Democracy": ["How do we assess democracy's outcomes?", "Accountable, responsive and legitimate government", "Economic growth and development", "Reduction of inequality and poverty", "Accommodation of social diversity", "Dignity and freedom of the citizens"]
#     },
#     "Economics": {
#         "Chapter 1: Development": ["What development promises– different people, different goals", "Income and other goals", "National development and per capita income", "Public facilities", "Sustainability of development"],
#         "Chapter 2: Sectors of the Indian Economy": ["Primary, secondary and tertiary sectors", "Historical change in sectors", "Rising importance of tertiary sector", "Division of sectors as organised and unorganised", "Employment trends"],
#         "Chapter 3: Money and Credit": ["Role of money in the economy", "Formal and informal sources of credit", "Self-Help Groups (SHGs)", "Credit and its terms"],
#         "Chapter 4: Globalisation and the Indian Economy": ["Production across countries", "Interlinking of production across countries", "Foreign trade and integration of markets", "Globalisation and its impact", "Role of WTO", "Struggle for fair globalisation"],
#         "Chapter 5: Consumer Rights": ["Consumer movement in India", "Consumer rights and duties", "Consumer awareness", "Role of consumer forums and NGOs"]
#     }
# }
# }

# # CBSE 7th–10th chapters (subtopics removed) for mocktest
# CHAPTERS_SIMPLE = {
#     "7th": {
#         "Computers": [
#             "Chapter 1: Programming Language",
#             "Chapter 2: Editing Text in Microsoft Word",
#             "Chapter 3: Microsoft PowerPoint",
#             "Chapter 4: Basics of Microsoft Excel",
#             "Chapter 5: Microsoft Access"
#         ],
#         "English": [
#             "Unit 1: Learning Together",
#             "Unit 2: Wit and Humour",
#             "Unit 3: Dreams & Discoveries",
#             "Unit 4: Travel and Adventure",
#             "Unit 5: Bravehearts"
#         ],
#         "Maths": [
#             "Chapter 1: Integers",
#             "Chapter 2: Fractions and Decimals",
#             "Chapter 3: Data Handling",
#             "Chapter 4: Simple Equations",
#             "Chapter 5: Lines and Angles",
#             "Chapter 6: The Triangle and Its Properties",
#             "Chapter 7: Comparing Quantities",
#             "Chapter 8: Rational Numbers",
#             "Chapter 9: Perimeter and Area",
#             "Chapter 10: Algebraic Expressions",
#             "Chapter 11: Exponents and Powers",
#             "Chapter 12: Symmetry",
#             "Chapter 13: Visualising Solid Shapes"
#         ],
#         "Science": [
#             "Chapter1: Nutrition in Plants",
#             "Chapter2: Nutrition in Animals",
#             "Chapter3: Fibre to Fabric",
#             "Chapter4: Heat",
#             "Chapter5: Acids, Bases and Salts",
#             "Chapter6: Physical and Chemical Changes",
#             "Chapter7: Weather, Climate and Adaptations of Animals",
#             "Chapter8: Winds, Storms and Cyclones",
#             "Chapter9: Soil",
#             "Chapter10: Respiration in Organisms",
#             "Chapter11: Transportation in Animals and Plants",
#             "Chapter12: Reproduction in Plants",
#             "Chapter13: Motion and Time",
#             "Chapter14: Electric Current and Its Effects",
#             "Chapter15: Light",
#             "Chapter16: Water: A Precious Resource",
#             "Chapter17: Forests: Our Lifeline",
#             "Chapter18: Wastewater Story"
#         ],
#         "History": [
#             "Chapter 1: Tracing Changes through a Thousand Years",
#             "Chapter 2: New Kings and Kingdoms",
#             "Chapter 3: The Delhi Sultans (12th–15th Century)",
#             "Chapter 4: The Mughal Empire (16th–17th Century)",
#             "Chapter 5: Rulers and Buildings / Tribes, Nomads and Settled Communities",
#             "Chapter 6: Devotional Paths to the Divine",
#             "Chapter 7: The Making of Regional Cultures",
#             "Chapter 8: Eighteenth Century Political Formations"
#         ],
#         "Civics": [
#             "Chapter 1: On Equality",
#             "Chapter 2: Role of the Government in Health",
#             "Chapter 3: How the State Government Works",
#             "Chapter 4: Growing up as Boys and Girls",
#             "Chapter 5: Women Change the World",
#             "Chapter 6: Understanding Media",
#             "Chapter 7: Markets Around Us",
#             "Chapter 8: A Shirt in the Market"
#         ],
#         "Geography": [
#             "Chapter 1: Environment",
#             "Chapter 2: Inside Our Earth",
#             "Chapter 3: Our Changing Earth",
#             "Chapter 4: Air",
#             "Chapter 5: Water",
#             "Chapter 6: Human-Environment Interactions– The Tropical and the Subtropical Region",
#             "Chapter 7: Life in the Deserts"
#         ]
#     },
#     "8th": {
#         "Computers": [
#             "Chapter 1: Exception Handling in Python",
#             "Chapter 2: File Handling in Python",
#             "Chapter 3: Stack (Data Structure)",
#             "Chapter 4: Queue (Data Structure)",
#             "Chapter 5: Sorting"
#         ],
#         "English": [
#             "Unit1: Honeydew – Prose",
#             "Unit2: Honeydew – Poems",
#             "Unit3: It So Happened – Supplementary"
#         ],
#         "Maths": [
#             "Chapter 1: Rational Numbers",
#             "Chapter 2: Linear Equations in One Variable",
#             "Chapter 3: Understanding Quadrilaterals",
#             "Chapter 4: Data Handling",
#             "Chapter 5: Squares and Square Roots",
#             "Chapter 6: Cubes and Cube Roots",
#             "Chapter 7: Comparing Quantities",
#             "Chapter 8: Algebraic Expressions and Identities",
#             "Chapter 9: Mensuration",
#             "Chapter 10: Exponents and Powers",
#             "Chapter 11: Direct and Inverse Proportions",
#             "Chapter 12: Factorisation",
#             "Chapter 13: Introduction to Graphs"
#         ],
#         "Science": [
#             "Chapter 1: Crop Production and Management",
#             "Chapter 2: Microorganisms: Friend and Foe",
#             "Chapter 3: Synthetic Fibres and Plastics",
#             "Chapter 4: Materials: Metals and Non-Metals",
#             "Chapter 5: Coal and Petroleum",
#             "Chapter 6: Combustion and Flame",
#             "Chapter 7: Conservation of Plants and Animals",
#             "Chapter 8: Cell – Structure and Functions",
#             "Chapter 9: Reproduction in Animals",
#             "Chapter 10: Force and Pressure",
#             "Chapter 11: Friction",
#             "Chapter 12: Sound",
#             "Chapter 13: Chemical Effects of Electric Current",
#             "Chapter 14: Some Natural Phenomena",
#             "Chapter 15: Light",
#             "Chapter 16: Stars and the Solar System",
#             "Chapter 17: Pollution of Air and Water"
#         ],
#         "History": [
#                 "Chapter 1: How, When and Where",
#                 "Chapter 2: From Trade to Territory– The Company Establishes Power",
#                 "Chapter 3: Ruling the Countryside",
#                 "Chapter 4: Tribals, Dikus and the Vision of a Golden Age",
#                 "Chapter 5: When People Rebel– 1857 and After",
#                 "Chapter 6: Civilising the 'Native', Educating the Nation",
#                 "Chapter 7: Women, Caste and Reform",
#                 "Chapter 8: The Making of the National Movement: 1870s–1947"
#             ],
#         "Civics":  [
#                 "Chapter 1: The Indian Constitution",
#                 "Chapter 2: Understanding Secularism",
#                 "Chapter 3: Parliament and the Making of Laws",
#                 "Chapter 4: Judiciary",
#                 "Chapter 5: Understanding Marginalisation",
#                 "Chapter 6: Confronting Marginalisation",
#                 "Chapter 7: Public Facilities",
#                 "Chapter 8: Law and Social Justice"
#             ],
#         "Geography": [
#                 "Chapter 1: Resources",
#                 "Chapter 2: Land, Soil, Water, Natural Vegetation and Wildlife Resources",
#                 "Chapter 3: Agriculture",
#                 "Chapter 4: Industries",
#                 "Chapter 5: Human Resources"
#             ]
#     },
#     "9th": {
#         "Computers": [
#             "Chapter 1: Basics of Computer System",
#             "Chapter 2: Types of Software",
#             "Chapter 3: Operating System",
#             "Chapter 4: Introduction to Python Programming",
#             "Chapter 5: Introduction to Cyber Security"
#         ],
#         "English": [
#             "Unit1: Beehive – Prose",
#             "Unit2: Beehive – Poems",
#             "Unit3: Moments – Supplementary"
#         ],
#         "Maths": [
#             "Chapter 1 : Number System",
#             "Chapter 2 : Algebra",
#             "Chapter 3 : Coordinate Geometry",
#             "Chapter 4 : Geometry",
#             "Chapter 5 :  Mensuration",
#             "Chapter 6 : Statistics"
#         ],
#         "Science": [
#             "Chapter 1 : Matter in Our Surroundings",
#             "Chapter 2 :Is Matter Around Us Pure?",
#             "Chapter 3 :Atoms and Molecules",
#             "Chapter 4 :Structure of the Atom",
#             "Chapter 5 :The Fundamental Unit of Life",
#             "Chapter 6 :Tissues",
#             "Chapter 7 :Diversity of the Living Organisms – I",
#             "Chapter 8 :Diversity of the Living Organisms – II",
#             "Chapter 9 :Diversity of the Living Organisms – III",
#             "Chapter 10 :Motion",
#             "Chapter 11 :Force and Laws of Motion",
#             "Chapter 12 :Gravitation",
#             "Chapter 13 :Work and Energy",
#             "Chapter 14 :Sound",
#             "Chapter 15 :Why Do We Fall Ill?",
#             "Chapter 16 :Natural Resources",
#             "Chapter 17 :Improvement in Food Resources"
#         ],
#         "History": [
#             "Chapter 1: The French Revolution",
#             "Chapter 2: Socialism in Europe and the Russian Revolution",
#             "Chapter 3: Nazism and the Rise of Hitler",
#             "Chapter 4: Forest Society and Colonialism",
#             "Chapter 5: Pastoralists in the Modern World (Periodic Assessment only)"
#         ],
#         "Geography": [
#             "Chapter 1: India– Size and Location",
#             "Chapter 2: Physical Features of India",
#             "Chapter 3: Drainage",
#             "Chapter 4: Climate",
#             "Chapter 5: Natural Vegetation and Wildlife",
#             "Chapter 6: Population"
#         ],
#         "Civics": [
#             "Chapter 1: What is Democracy? Why Democracy?",
#             "Chapter 2: Constitutional Design",
#             "Chapter 3: Electoral Politics",
#             "Chapter 4: Working of Institutions",
#             "Chapter 5: Democratic Rights"
#         ],
#         "Economics": [
#             "Chapter 1: The Story of Village Palampur",
#             "Chapter 2: People as Resource",
#             "Chapter 3: Poverty as a Challenge",
#             "Chapter 4: Food Security in India"
#         ]
#     },
#     "10th": {
#         "Computers": [
#             "Chapter 1: Computer Fundamentals",
#             "Chapter 2: Advanced GIMP (GNU Image Manipulation Program)",
#             "Chapter 3: Tables (HTML)",
#             "Chapter 4: Forms (HTML)",
#             "Chapter 5: DHTML & CSS"
#         ],
#         "English": [
#             "Unit 1:First Flight – Prose",
#             "Unit 2:First Flight – Poems",
#             "Unit 3:Footprints Without Feet – Supplementary"
#         ],
#         "Mathematics": [
#             "Chapter 1: Number Systems",
#             "Chapter 2: Algebra",
#             "Chapter 3: Coordinate Geometry",
#             "Chapter 4: Geometry",
#             "Chapter 5: Trigonometry",
#             "Chapter 6: Mensuration",
#             "Chapter 7: Statistics and Probability"
#         ],
#         "Science": [
#             "Chapter 1: Chemical Reactions and Equations",
#             "Chapter 2: Acids, Bases, and Salts",
#             "Chapter 3: Metals and Non-Metals",
#             "Chapter 4: Carbon and Its Compounds",
#             "Chapter 5: Periodic Classification of Elements",
#             "Chapter 6: Life Processes",
#             "Chapter 7: Control and Coordination",
#             "Chapter 8: How do Organisms Reproduce?",
#             "Chapter 9: Heredity and Evolution",
#             "Chapter 10: Light – Reflection and Refraction",
#             "Chapter 11: Human Eye and Colourful World",
#             "Chapter 12: Electricity",
#             "Chapter 13: Magnetic Effects of Electric Current",
#             "Chapter 14: Sources of Energy",
#             "Chapter 15: Our Environment",
#             "Chapter 16: Sustainable Management of Natural Resources"
#         ],
#         "History": [
#             "Chapter 1: The Rise of Nationalism in Europe",
#             "Chapter 2: Nationalism in India",
#             "Chapter 3: The Making of a Global World",
#             "Chapter 4: The Age of Industrialisation",
#             "Chapter 5: Print Culture and the Modern World"
#         ],
#         "Geography": [
#             "Chapter 1: Resources and Development",
#             "Chapter 2: Forest and Wildlife Resources",
#             "Chapter 3: Water Resources",
#             "Chapter 4: Agriculture",
#             "Chapter 5: Minerals and Energy Resources",
#             "Chapter 6: Manufacturing Industries",
#             "Chapter 7: Lifelines of National Economy"
#         ],
#         "Civics": [
#             "Chapter 1: Power Sharing",
#             "Chapter 2: Federalism",
#             "Chapter 3: Gender, Religion and Caste",
#             "Chapter 4: Political Parties",
#             "Chapter 5: Outcomes of Democracy"
#         ],
#         "Economics": [
#             "Chapter 1: Development",
#             "Chapter 2: Sectors of the Indian Economy",
#             "Chapter 3: Money and Credit",
#             "Chapter 4: Globalisation and the Indian Economy",
#             "Chapter 5: Consumer Rights"
#         ]
#     }
# }
# MAX_PREVIOUS_QUESTIONS = 100
# PREVIOUS_QUESTIONS_QUICK = {}
# PREVIOUS_QUESTIONS_MOCK = {}

# # Fallback quiz data when API is unavailable
# FALLBACK_QUIZZES = {
#     "What is a programming language?": [
#         {
#             "question": "What is a programming language?",
#             "options": [
#                 "A way to communicate with computers",
#                 "A type of computer hardware",
#                 "A computer game",
#                 "A type of internet connection"
#             ],
#             "answer": "A way to communicate with computers"
#         },
#         {
#             "question": "Which of the following is NOT a programming language?",
#             "options": [
#                 "Python",
#                 "Java",
#                 "HTML",
#                 "Microsoft Word"
#             ],
#             "answer": "Microsoft Word"
#         },
#         {
#             "question": "What does HTML stand for?",
#             "options": [
#                 "HyperText Markup Language",
#                 "High Tech Modern Language",
#                 "Home Tool Markup Language",
#                 "Hyperlink and Text Markup Language"
#             ],
#             "answer": "HyperText Markup Language"
#         },
#         {
#             "question": "Which programming language is known for its simplicity?",
#             "options": [
#                 "Python",
#                 "C++",
#                 "Assembly",
#                 "Machine Code"
#             ],
#             "answer": "Python"
#         },
#         {
#             "question": "What is the purpose of a compiler?",
#             "options": [
#                 "To translate code into machine language",
#                 "To debug programs",
#                 "To design user interfaces",
#                 "To connect to the internet"
#             ],
#             "answer": "To translate code into machine language"
#         },
#         {
#             "question": "Which of these is a high-level programming language?",
#             "options": [
#                 "Python",
#                 "Assembly",
#                 "Machine Code",
#                 "Binary"
#             ],
#             "answer": "Python"
#         },
#         {
#             "question": "What does IDE stand for?",
#             "options": [
#                 "Integrated Development Environment",
#                 "Internet Data Exchange",
#                 "Internal Design Engine",
#                 "Interactive Data Entry"
#             ],
#             "answer": "Integrated Development Environment"
#         },
#         {
#             "question": "Which programming language is used for web development?",
#             "options": [
#                 "JavaScript",
#                 "Python",
#                 "C++",
#                 "Assembly"
#             ],
#             "answer": "JavaScript"
#         },
#         {
#             "question": "What is a variable in programming?",
#             "options": [
#                 "A container that stores data",
#                 "A type of function",
#                 "A programming language",
#                 "A computer component"
#             ],
#             "answer": "A container that stores data"
#         },
#         {
#             "question": "Which of these is a programming paradigm?",
#             "options": [
#                 "Object-Oriented Programming",
#                 "Web Browsing",
#                 "File Management",
#                 "Data Storage"
#             ],
#             "answer": "Object-Oriented Programming"
#         }
#     ]
# }

# def get_fallback_quiz(subtopic: str, difficulty: str, language: str):
#     """Return a fallback quiz when API is unavailable"""
#     logger.info(f"Using fallback quiz for: {subtopic}")
    
#     # Get fallback quiz or create default
#     quiz_data = FALLBACK_QUIZZES.get(subtopic, None)
    
#     if quiz_data is None:
#         # Generate 10 DIFFERENT questions for unknown topics
#         quiz_data = []
        
#         # Define different question templates based on subtopic
#         question_templates = [
#             f"What is the definition of {subtopic}?",
#             f"Which of the following is NOT related to {subtopic}?",
#             f"What are the main characteristics of {subtopic}?",
#             f"How does {subtopic} work?",
#             f"What are the types of {subtopic}?",
#             f"What is the importance of {subtopic}?",
#             f"Which statement about {subtopic} is correct?",
#             f"What are the applications of {subtopic}?",
#             f"How is {subtopic} different from similar concepts?",
#             f"What are the properties of {subtopic}?"
#         ]
        
#         # Define different option patterns
#         option_patterns = [
#             ["Correct definition", "Incorrect definition", "Partial definition", "Opposite definition"],
#             ["Related concept 1", "Related concept 2", "Unrelated concept", "Related concept 3"],
#             ["Characteristic 1", "Characteristic 2", "Characteristic 3", "Non-characteristic"],
#             ["Process A", "Process B", "Process C", "Incorrect process"],
#             ["Type 1", "Type 2", "Type 3", "Non-type"],
#             ["Reason 1", "Reason 2", "Reason 3", "Not important"],
#             ["True statement", "False statement 1", "False statement 2", "False statement 3"],
#             ["Application 1", "Application 2", "Application 3", "Non-application"],
#             ["Difference A", "Difference B", "Difference C", "No difference"],
#             ["Property 1", "Property 2", "Property 3", "Non-property"]
#         ]
        
#         for i in range(10):
#             question_template = question_templates[i % len(question_templates)]
#             option_pattern = option_patterns[i % len(option_patterns)]
            
#             quiz_data.append({
#                 "question": question_template,
#                 "options": option_pattern,
#                 "answer": option_pattern[0]  # First option is always correct
#             })
    
#     return {
#         "quiz": quiz_data,
#         "subtopic": subtopic,
#         "difficulty": difficulty,
#         "language": language,
#         "source": "fallback"
#     }

# # Language instruction mapping
# LANGUAGE_INSTRUCTIONS = {
#     "English": "Generate all questions and options in English.",
#     "Telugu": "Generate all questions and options in Telugu language (తెలుగు). Use Telugu script.",
#     "Hindi": "Generate all questions and options in Hindi language (हिंदी). Use Devanagari script.",
#     "Tamil": "Generate all questions and options in Tamil language (தமிழ்). Use Tamil script.",
#     "Kannada": "Generate all questions and options in Kannada language (ಕನ್ನಡ). Use Kannada script.",
#     "Malayalam": "Generate all questions and options in Malayalam language (മലയാളം). Use Malayalam script."
# }

# # Quick Practice Endpoints
# @app.get("/classes")
# def get_classes():
#     logger.info("Fetching available classes")
#     return JSONResponse(content={"classes": list(CHAPTERS_DETAILED.keys())})

# @app.get("/chapters")
# def get_subjects(class_name: str):
#     logger.info(f"Fetching subjects for class: {class_name}")
#     subjects = CHAPTERS_DETAILED.get(class_name)
#     if not subjects:
#         logger.error(f"Invalid class: {class_name}")
#         raise HTTPException(status_code=400, detail="Invalid class")
#     return JSONResponse(content={"chapters": list(subjects.keys())})

# @app.get("/subtopics")
# def get_subtopics(class_name: str, subject: str):
#     logger.info(f"Fetching subtopics for class: {class_name}, subject: {subject}")
#     subjects = CHAPTERS_DETAILED.get(class_name)
#     if not subjects or subject not in subjects:
#         logger.error(f"Invalid subject: {subject} or class: {class_name}")
#         raise HTTPException(status_code=400, detail="Invalid subject or class")
#     subtopics = subjects[subject]
#     return JSONResponse(content={"subtopics": subtopics})

# @app.get("/quiz")
# def get_quiz(
#     subtopic: str,
#     retry: bool = False,
#     currentLevel: int = None,
#     language: str = "English"
# ):
#     try:
#         previous = PREVIOUS_QUESTIONS_QUICK.get(subtopic, []) if not retry else []

#         # Use the level from frontend if provided
#         if currentLevel is not None:
#             current_level = currentLevel
#         else:
#             # fallback if frontend doesn't provide level
#             num_prev = len(previous)
#             if num_prev == 0:
#                 current_level = 1
#             elif num_prev == 1:
#                 current_level = 2
#             else:
#                 current_level = 3

#         difficulty_map = {1: "simple", 2: "medium", 3: "hard"}
#         difficulty = difficulty_map.get(current_level, "simple")

#         logger.info(f"Generating quiz for subtopic: {subtopic}, difficulty: {difficulty}, retry: {retry}, level: {current_level}, language: {language}")
       
#         # Get language instruction
#         language_instruction = LANGUAGE_INSTRUCTIONS.get(language, LANGUAGE_INSTRUCTIONS["English"])

#         prompt = f"""
#         Generate 10 multiple-choice questions for "{subtopic}".
#         Difficulty: {difficulty}.
#         {language_instruction}
       
#         IMPORTANT INSTRUCTIONS:
#         - ALL questions, options, and content MUST be in {language} language only.
#         - Do NOT mix English with the target language.
#         - Use proper script for the selected language.
#         - Avoid repeating these questions: {previous}.
       
#         IMPORTANT FORMAT REQUIREMENTS:
#         - Each question should have exactly 4 options as an array: ["option1", "option2", "option3", "option4"]
#         - The answer should be the actual text of the correct option, NOT a letter
#         - Return ONLY a JSON array with keys: question, options (array), answer (actual option text)
       
#         Example format (in {language}):
#         [
#           {{
#             "question": "[Question text in {language}]",
#             "options": ["[Option 1 in {language}]", "[Option 2 in {language}]", "[Option 3 in {language}]", "[Option 4 in {language}]"],
#             "answer": "[Correct option text in {language}]"
#           }}
#         ]
#         """

#         # Check if client is available
#         if client is None:
#             logger.warning("OpenAI client not available, using fallback quiz")
#             return get_fallback_quiz(subtopic, difficulty, language)
            
#         try:
#             response = client.chat.completions.create(
#                 model="google/gemini-2.0-flash-001",
#                 messages=[{"role": "user", "content": prompt}],
#                 temperature=0.9
#             )
#         except Exception as api_error:
#             logger.error(f"API call failed: {api_error}")
#             # Fallback: Return sample quiz when API is unavailable
#             return get_fallback_quiz(subtopic, difficulty, language)

#         message_content = response.choices[0].message.content
#         text = ""
#         if isinstance(message_content, list):
#             for block in message_content:
#                 if block.get("type") == "text":
#                     text += block.get("text", "")
#         else:
#             text = str(message_content)

#         # Clean up markdown code blocks if present
#         text = text.strip()
#         if text.startswith("```json"):
#             text = text[7:].strip()
#         if text.endswith("```"):
#             text = text[:-3].strip()

#         try:
#             quiz_json = json.loads(text)
#         except json.JSONDecodeError:
#             match = re.search(r'\[.*\]', text, re.DOTALL)
#             if not match:
#                 logger.error(f"AI did not return valid JSON: {text[:200]}")
#                 raise ValueError(f"AI did not return valid JSON: {text[:200]}")
#             quiz_json = json.loads(match.group(0))

#         # Process and validate the quiz
#         processed_quiz = []
#         for q in quiz_json:
#             if not all(key in q for key in ["question", "options", "answer"]):
#                 continue
               
#             # Ensure options is a list with exactly 4 items
#             if not isinstance(q["options"], list) or len(q["options"]) != 4:
#                 continue
               
#             # Ensure the answer exists in the options
#             if q["answer"] not in q["options"]:
#                 # Try to fix by finding the closest match
#                 continue
               
#             processed_quiz.append(q)

#         # Shuffle the quiz questions
#         random.shuffle(processed_quiz)
       
#         # Shuffle options while preserving correct answer
#         for q in processed_quiz:
#             # Create a mapping of original positions
#             original_options = q["options"].copy()
#             correct_answer = q["answer"]
           
#             # Shuffle the options
#             random.shuffle(q["options"])
           
#             # The answer remains the same text, not the position
#             # This ensures the answer is always the correct option text
           
#         if not retry:
#             PREVIOUS_QUESTIONS_QUICK[subtopic] = previous + [q["question"] for q in processed_quiz]

#         logger.info(f"Generated {len(processed_quiz)} questions for subtopic: {subtopic} in {language}")
       
#         return JSONResponse(content={
#             "currentLevel": current_level,
#             "quiz": processed_quiz
#         })

#     except Exception as e:
#         logger.error(f"Error generating quiz: {str(e)}")
#         return JSONResponse(content={"error": str(e)}, status_code=500)

# # AI Assistant Endpoints
# def _classify_question_type(question: str) -> str:
#     """Classify the type of question for better response handling"""
#     question_lower = question.lower()
   
#     if any(word in question_lower for word in ['study plan', 'schedule', 'timetable', 'how to study', 'plan']):
#         return "study_plan"
#     elif any(word in question_lower for word in ['notes', 'summary', 'key points', 'important points', 'write down']):
#         return "notes"
#     elif any(word in question_lower for word in ['explain', 'what is', 'how does', 'why', 'meaning', 'define']):
#         return "explanation"
#     elif any(word in question_lower for word in ['practice', 'exercise', 'question', 'problem', 'solve', 'worksheet']):
#         return "practice"
#     elif any(word in question_lower for word in ['related', 'connect', 'application', 'real world', 'where used']):
#         return "related_concepts"
#     elif any(word in question_lower for word in ['example', 'examples', 'sample']):
#         return "examples"
#     else:
#         return "general"

# # AI Assistant Endpoints
# @app.post("/ai-assistant/chat")
# async def ai_assistant_chat(request: ChatRequest):
#     try:
#         class_level = request.class_level
#         subject = request.subject
#         chapter = request.chapter
#         student_question = request.student_question
#         chat_history = request.chat_history or []
       
#         # Get language preference
#         language = "English"
       
#         # Enhanced prompt with better formatting instructions
#         prompt = f"""
#         You are an AI Learning Assistant for a {class_level} student studying {subject}, specifically chapter: {chapter}.
       
#         Student's Question: "{student_question}"
       
#         Previous conversation context: {chat_history[-5:] if chat_history else "No previous context"}
       
#         Based on the student's question, provide a helpful, educational response with EXCELLENT STRUCTURE and CHILD-FRIENDLY formatting.
       
#         **CRITICAL FORMATTING RULES:**
#         1. Use CLEAR HEADINGS with emojis
#         2. Use BULLET POINTS and NUMBERED LISTS
#         3. Use SIMPLE LANGUAGE for children
#         4. Add VISUAL SEPARATORS like lines between sections
#         5. Use LARGE FONT indicators for important points
#         6. Include PRACTICAL EXAMPLES
#         7. Add SUMMARY TABLES where helpful
#         8. Use COLOR INDICATORS (🔴 🟢 🔵 🟡)
       
#         **RESPONSE TYPES:**
       
#         1. STUDY PLAN Response Structure:
#            🗓️ WEEKLY STUDY PLAN
#            ───────────────────
#            📅 Day 1: [Topic]
#            • Time: [Duration]
#            • Activities: [List]
#            • Practice: [Specific tasks]
#            ───────────────────
           
#         2. NOTES Response Structure:
#            📚 CHAPTER NOTES
#            ───────────────
#            🔹 Key Concept 1
#            • Definition: [Simple definition]
#            • Example: [Real-world example]
#            • Remember: [Important point]
#            ───────────────
           
#         3. EXPLANATION Response Structure:
#            💡 CONCEPT EXPLANATION
#            ────────────────────
#            🎯 What is it?
#            [Simple definition]
           
#            👀 How it works:
#            [Step-by-step]
           
#            🌍 Real Example:
#            [Child-friendly example]
#            ────────────────────
           
#         4. PRACTICE QUESTIONS Structure:
#            📝 PRACTICE TIME
#            ───────────────
#            🟢 EASY Question:
#            [Question]
           
#            🟡 MEDIUM Question:
#            [Question]
           
#            🔴 CHALLENGE Question:
#            [Question]
           
#            ✅ SOLUTIONS:
#            [Step-by-step solutions]
#            ───────────────
       
#         Make it VISUALLY APPEALING and EASY TO READ for a child!
#         """
       
#         response = client.chat.completions.create(
#             model="google/gemini-2.0-flash-001",
#             messages=[{"role": "user", "content": prompt}],
#             temperature=0.7
#         )
       
#         message_content = response.choices[0].message.content
#         text = ""
#         if isinstance(message_content, list):
#             for block in message_content:
#                 if block.get("type") == "text":
#                     text += block.get("text", "")
#         else:
#             text = str(message_content)
       
#         return JSONResponse(content={
#             "success": True,
#             "response": text,
#             "type": _classify_question_type(student_question)
#         })
       
#     except Exception as e:
#         logger.error(f"Error in AI assistant: {str(e)}")
#         return JSONResponse(content={
#             "success": False,
#             "response": "I apologize, but I'm having trouble processing your request right now. Please try again.",
#             "type": "error"
#         }, status_code=500)

# @app.post("/ai-assistant/generate-study-plan")
# async def generate_study_plan(request: StudyPlanRequest):
#     """Generate a detailed study plan for a specific chapter"""
#     try:
#         class_level = request.class_level
#         subject = request.subject
#         chapter = request.chapter
#         days_available = request.days_available
#         hours_per_day = request.hours_per_day
       
#         prompt = f"""
#         Create a SUPER STRUCTURED and CHILD-FRIENDLY {days_available}-day study plan for a {class_level} student studying {subject}, chapter: {chapter}.
       
#         **FORMATTING REQUIREMENTS:**
       
#         🗓️ {days_available}-DAY STUDY PLAN FOR {chapter.upper()}
#         ═══════════════════════════════════════
       
#         📊 QUICK OVERVIEW:
#         • Total Days: {days_available}
#         • Daily Study: {hours_per_day} hours
#         • Subject: {subject}
#         • Chapter: {chapter}
       
#         📅 DAILY BREAKDOWN:
#         ───────────────────
       
#         DAY 1: [Main Topic]
#         🕐 Time: [Specific time allocation]
#         📚 What to Study:
#         • Topic 1: [Details]
#         • Topic 2: [Details]
#         ✍️ Practice:
#         • [Specific practice tasks]
#         ✅ Check: [Self-check points]
       
#         DAY 2: [Main Topic]
#         🕐 Time: [Specific time allocation]
#         📚 What to Study:
#         • Topic 1: [Details]
#         • Topic 2: [Details]
#         ✍️ Practice:
#         • [Specific practice tasks]
#         ✅ Check: [Self-check points]
       
#         🎯 WEEKLY GOALS:
#         • Goal 1: [Specific achievement]
#         • Goal 2: [Specific achievement]
       
#         💡 STUDY TIPS:
#         • Tip 1: [Practical tip]
#         • Tip 2: [Practical tip]
       
#         Make it COLORFUL and EASY TO FOLLOW for a child!
#         Use EMOJIS and CLEAR SECTIONS!
#         """
       
#         response = client.chat.completions.create(
#             model="google/gemini-2.0-flash-001",
#             messages=[{"role": "user", "content": prompt}],
#             temperature=0.7
#         )
       
#         message_content = response.choices[0].message.content
#         text = str(message_content) if not isinstance(message_content, list) else message_content[0].get("text", "")
       
#         return JSONResponse(content={
#             "success": True,
#             "study_plan": text
#         })
       
#     except Exception as e:
#         logger.error(f"Error generating study plan: {str(e)}")
#         return JSONResponse(content={
#             "success": False,
#             "study_plan": "Unable to generate study plan at this time."
#         }, status_code=500)

# @app.post("/ai-assistant/generate-notes")
# async def generate_notes(request: NotesRequest):
#     """Generate comprehensive notes for a chapter or specific topic"""
#     try:
#         class_level = request.class_level
#         subject = request.subject
#         chapter = request.chapter
#         specific_topic = request.specific_topic
       
#         topic_specific = f" on {specific_topic}" if specific_topic else ""
       
#         prompt = f"""
#         Generate SUPER ORGANIZED and CHILD-FRIENDLY study notes for a {class_level} student studying {subject}, chapter: {chapter}{topic_specific}.
       
#         **REQUIRED FORMAT:**
       
#         📚 {chapter.upper()} - STUDY NOTES
#         ═══════════════════════════
       
#         🎯 CHAPTER AT A GLANCE:
#         • Main Topics: [List 3-4 main topics]
#         • Key Skills: [What they'll learn]
#         • Difficulty: 🟢 Easy / 🟡 Medium / 🔴 Hard
       
#         🔍 KEY CONCEPTS:
#         ─────────────────
       
#         🔹 Concept 1: [Concept Name]
#         • What it is: [Simple definition]
#         • Example: 🌟 [Real example]
#         • Remember: 💡 [Key point]
#         • Formula: 📐 [If applicable]
       
#         🔹 Concept 2: [Concept Name]
#         • What it is: [Simple definition]
#         • Example: 🌟 [Real example]
#         • Remember: 💡 [Key point]
#         • Formula: 📐 [If applicable]
       
#         📋 IMPORTANT POINTS TABLE:
#         ─────────────────────────
#         | Point | Description | Remember |
#         |-------|-------------|----------|
#         | [1] | [Description] | [Memory tip] |
#         | [2] | [Description] | [Memory tip] |
       
#         💪 PRACTICE READY:
#         • Quick Questions: [2-3 simple questions]
#         • Think About: [1 critical thinking question]
       
#         📝 SUMMARY:
#         • Main Idea 1: [Summary point]
#         • Main Idea 2: [Summary point]
#         • Main Idea 3: [Summary point]
       
#         Use LOTS OF EMOJIS, CLEAR SECTIONS, and CHILD-FRIENDLY LANGUAGE!
#         Make it VISUALLY APPEALING!
#         """
       
#         response = client.chat.completions.create(
#             model="google/gemini-2.0-flash-001",
#             messages=[{"role": "user", "content": prompt}],
#             temperature=0.7
#         )
       
#         message_content = response.choices[0].message.content
#         text = str(message_content) if not isinstance(message_content, list) else message_content[0].get("text", "")
       
#         return JSONResponse(content={
#             "success": True,
#             "notes": text
#         })
       
#     except Exception as e:
#         logger.error(f"Error generating notes: {str(e)}")
#         return JSONResponse(content={
#             "success": False,
#             "notes": "Unable to generate notes at this time."
#         }, status_code=500)
# # Mock Test Endpoints
# @app.get("/mock_classes")
# def get_mock_classes():
#     logger.info("Fetching available classes for mock test")
#     return JSONResponse(content={"classes": list(CHAPTERS_SIMPLE.keys())})

# @app.get("/mock_subjects")
# def get_mock_subjects(class_name: str):
#     logger.info(f"Fetching subjects for class: {class_name}")
#     subjects = CHAPTERS_SIMPLE.get(class_name)
#     if not subjects:
#         logger.error(f"Invalid class: {class_name}")
#         raise HTTPException(status_code=400, detail="Invalid class")
#     return JSONResponse(content={"subjects": list(subjects.keys())})

# @app.get("/quick-practice")
# def get_quick_practice():
#     """
#     Temporary endpoint for quick practice - returns mock data similar to mock_subjects
#     """
#     logger.info("Fetching quick practice data")
    
#     # Return mock data similar to what frontend expects
#     return JSONResponse(content={
#         "message": "Quick Practice endpoint is working!",
#         "status": "success",
#         "data": {
#             "available_classes": list(CHAPTERS_SIMPLE.keys()),
#             "subjects": ["Computers", "English", "Mathematics", "Science", "History", "Geography", "Civics", "Economics"],
#             "quick_practice_available": True
#         }
#     })

# @app.get("/mock_chapters")
# def get_mock_chapters(class_name: str, subject: str):
#     logger.info(f"Fetching chapters for class: {class_name}, subject: {subject}")
#     subjects = CHAPTERS_SIMPLE.get(class_name)
#     if not subjects or subject not in subjects:
#         logger.error(f"Invalid subject: {subject} or class: {class_name}")
#         raise HTTPException(status_code=400, detail="Invalid subject or class")
#     chapters = subjects[subject]
#     if isinstance(chapters, dict):
#         chapters = [chapter for sublist in chapters.values() for chapter in sublist]
#     return JSONResponse(content={"chapters": chapters})

# @app.get("/mock_test")
# def get_mock_test(
#     class_name: str,
#     subject: str,
#     chapter: str,
#     retry: bool = False,
#     language: str = "English",
#     num_questions: int = 50
# ):
#     try:
#         previous = PREVIOUS_QUESTIONS_MOCK.get(chapter, []) if not retry else []

#         # Automatic difficulty progression
#         num_prev = len(previous)
#         if num_prev == 0:
#             current_level = 1
#             difficulty = "simple"
#         elif num_prev == 1:
#             current_level = 2
#             difficulty = "medium"
#         else:
#             current_level = 3
#             difficulty = "hard"
       
#         logger.info(f"Generating mock test for class: {class_name}, subject: {subject}, chapter: {chapter}, difficulty: {difficulty}, language: {language}, retry: {retry}, num_questions: {num_questions}")

#         subjects = CHAPTERS_SIMPLE.get(class_name)
#         if not subjects or subject not in subjects:
#             logger.error(f"Invalid subject: {subject} or class: {class_name}")
#             raise HTTPException(status_code=400, detail="Invalid subject or class")

#         chapters = subjects[subject]
#         if isinstance(chapters, dict):
#             for key, chapter_list in chapters.items():
#                 if chapter in chapter_list:
#                     break
#             else:
#                 logger.error(f"Invalid chapter: {chapter} for subject: {subject}")
#                 raise HTTPException(status_code=400, detail="Invalid chapter")
#         elif chapter not in chapters:
#             logger.error(f"Invalid chapter: {chapter} for subject: {subject}")
#             raise HTTPException(status_code=400, detail="Invalid chapter")

#         if len(previous) > MAX_PREVIOUS_QUESTIONS:
#             previous = previous[-MAX_PREVIOUS_QUESTIONS:]
#             logger.info(f"Truncated previous questions for chapter: {chapter} to {MAX_PREVIOUS_QUESTIONS}")

#         # Get language instruction
#         language_instruction = LANGUAGE_INSTRUCTIONS.get(language, LANGUAGE_INSTRUCTIONS["English"])

#         prompt = f"""
#         Generate {num_questions} multiple-choice questions for "{chapter}" in {subject} for class {class_name}.
#         Difficulty: {difficulty}.
#         {language_instruction}
       
#         IMPORTANT INSTRUCTIONS:
#         - ALL questions, options, and content MUST be in {language} language only.
#         - Do NOT mix English with the target language.
#         - Use proper script for the selected language.
#         - Avoid repeating these questions: {previous}.
       
#         FORMAT REQUIREMENTS:
#         - Each question must have exactly 4 options as a JSON object {{"A": "option text", "B": "another option", "C": "third option", "D": "fourth option"}}.
#         - The answer must be the label "A", "B", "C", or "D".
#         - Return ONLY a JSON array of objects with keys: question, options, answer.
       
#         Example format (in {language}):
#         [
#           {{
#             "question": "[Question text in {language}]",
#             "options": {{
#               "A": "[Option A in {language}]",
#               "B": "[Option B in {language}]",
#               "C": "[Option C in {language}]",
#               "D": "[Option D in {language}]"
#             }},
#             "answer": "C"
#           }}
#         ]
#         """

#         logger.info(f"Sending prompt to AI for chapter: {chapter} in {language}")
#         response = client.chat.completions.create(
#             model="google/gemini-2.0-flash-001",
#             messages=[{"role": "user", "content": prompt}],
#             temperature=0.9
#         )

#         message_content = response.choices[0].message.content
#         text = ""
#         if isinstance(message_content, list):
#             for block in message_content:
#                 if block.get("type") == "text":
#                     text += block.get("text", "")
#         else:
#             text = str(message_content)

#         text = text.strip()
#         if text.startswith("```json"):
#             text = text[7:].strip()
#         if text.endswith("```"):
#             text = text[:-3].strip()

#         try:
#             quiz_json = json.loads(text)
#         except json.JSONDecodeError:
#             match = re.search(r'\[.*\]', text, re.DOTALL)
#             if not match:
#                 return JSONResponse(content={"currentLevel": current_level, "quiz": []}, status_code=200)
#             quiz_json = json.loads(match.group(0))

#         if not isinstance(quiz_json, list):
#             return JSONResponse(content={"currentLevel": current_level, "quiz": []}, status_code=200)

#         processed_quiz = []
#         for q in quiz_json:
#             if not all(key in q for key in ["question", "options", "answer"]):
#                 continue
#             if isinstance(q["options"], list) and len(q["options"]) == 4:
#                 q["options"] = {chr(65 + i): opt for i, opt in enumerate(q["options"])}
#             elif not isinstance(q["options"], dict) or len(q["options"]) != 4:
#                 continue
#             if q["answer"] not in q["options"]:
#                 continue

#             items = list(q["options"].items())
#             random.shuffle(items)
#             new_options = {}
#             new_answer = None
#             for new_idx, (old_label, text_opt) in enumerate(items):
#                 new_label = chr(65 + new_idx)
#                 new_options[new_label] = text_opt
#                 if old_label == q["answer"]:
#                     new_answer = new_label
#             q["options"] = new_options
#             q["answer"] = new_answer
#             processed_quiz.append(q)

#         while len(processed_quiz) < 50:
#             processed_quiz.append({
#                 "id": len(processed_quiz),
#                 "question": f"Placeholder Question {len(processed_quiz) + 1}",
#                 "options": {"A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D"},
#                 "answer": "A"
#             })

#         if not retry:
#             PREVIOUS_QUESTIONS_MOCK[chapter] = previous + [q["question"] for q in processed_quiz]
#             if len(PREVIOUS_QUESTIONS_MOCK[chapter]) > MAX_PREVIOUS_QUESTIONS:
#                 PREVIOUS_QUESTIONS_MOCK[chapter] = PREVIOUS_QUESTIONS_MOCK[chapter][-MAX_PREVIOUS_QUESTIONS:]

#         return JSONResponse(content={
#             "currentLevel": current_level,
#             "quiz": processed_quiz
#         })

#     except HTTPException as e:
#         raise
#     except Exception as e:
#         logger.error(f"Unexpected error: {str(e)}")
#         return JSONResponse(content={"currentLevel": 1, "quiz": []}, status_code=200)

# @app.get("/")
# def read_root():
#     return {"message": "AI Learning Assistant API is running"}

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)


from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os, json, re, random
import logging
from openai import OpenAI
from typing import Dict, List, Optional
import concurrent.futures
import asyncio
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load .env file from the same directory as this script
script_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(script_dir, '.env')
current_dir_env = os.path.join(os.getcwd(), '.env')

logger.info(f"Loading .env file from: {env_path}")
logger.info(f"Current working directory: {os.getcwd()}")
logger.info(f"Script directory: {script_dir}")

# Try multiple locations for .env file
env_file_found = None
if os.path.exists(env_path):
    env_file_found = env_path
    logger.info(f"✅ Found .env file at: {env_path}")
elif os.path.exists(current_dir_env):
    env_file_found = current_dir_env
    logger.info(f"✅ Found .env file at: {current_dir_env}")
elif os.path.exists('.env'):
    env_file_found = '.env'
    logger.info(f"✅ Found .env file at: .env (relative)")
else:
    logger.warning(f"⚠️ .env file not found in any expected location")
    logger.warning(f"   Checked: {env_path}")
    logger.warning(f"   Checked: {current_dir_env}")
    logger.warning(f"   Checked: .env (current directory)")

# Load environment variables - try all locations
env_loaded = False
if env_file_found:
    result = load_dotenv(env_file_found, override=True)
    logger.info(f"load_dotenv({env_file_found}) returned: {result}")
    env_loaded = True
else:
    # Try loading from script directory, current directory, and parent directories
    logger.info("Trying to load .env from multiple locations...")
    locations_to_try = [
        env_path,
        current_dir_env,
        '.env',
        os.path.join(script_dir, '..', '.env'),
        os.path.join(script_dir, '../..', '.env'),
        os.path.join(os.getcwd(), '.env'),
    ]
    
    for loc in locations_to_try:
        if os.path.exists(loc):
            result = load_dotenv(loc, override=True)
            logger.info(f"   Tried {loc}: {result}")
            if result:
                env_loaded = True
                logger.info(f"✅ Successfully loaded .env from: {loc}")
                break
        else:
            result = load_dotenv(loc, override=True)  # load_dotenv can work even if file doesn't exist (checks cwd)
            if result:
                logger.info(f"✅ Successfully loaded .env from: {loc} (via dotenv search)")
                env_loaded = True
                break

# Also try loading without specifying path (dotenv searches automatically)
if not env_loaded:
    logger.info("Trying load_dotenv() without path (auto-search)...")
    result = load_dotenv(override=True)
    logger.info(f"load_dotenv() auto-search returned: {result}")
    env_loaded = result

# Check if API key was loaded
API_KEY = os.getenv("OPENROUTER_API_KEY")

# Also check with uppercase/lowercase variations (Windows sometimes does this)
if not API_KEY:
    API_KEY = os.getenv("OPENROUTER_API_KEY") or os.getenv("openrouter_api_key") or os.environ.get("OPENROUTER_API_KEY")

# CRITICAL: If still not found, try manual parsing immediately (don't wait for error)
if not API_KEY:
    logger.warning("⚠️ API key not found via load_dotenv(), trying manual parsing...")
    # Try reading .env file directly from script directory (already defined above)
    env_file_path = os.path.join(script_dir, '.env')
    
    # Also try current directory
    env_files_to_check = [
        env_file_path,
        os.path.join(os.getcwd(), '.env'),
        '.env',
        env_path,
        current_dir_env
    ]
    
    for env_file_path in env_files_to_check:
        if not env_file_path or not os.path.exists(env_file_path):
            continue
        try:
            logger.info(f"   🔍 Manually reading .env file from: {env_file_path}")
            with open(env_file_path, 'r', encoding='utf-8-sig') as f:
                env_content = f.read()
                logger.info(f"   📄 .env file content (first 100 chars): {env_content[:100]}")
                
                # Parse manually
                for line in env_content.splitlines():
                    line = line.strip()
                    if not line or line.startswith('#'):
                        continue
                    if 'OPENROUTER_API_KEY' in line and '=' in line:
                        parts = line.split('=', 1)
                        if len(parts) == 2:
                            manual_key = parts[1].strip().strip('"').strip("'").replace('\n', '').replace('\r', '')
                            if manual_key and manual_key.startswith('sk-'):
                                API_KEY = manual_key
                                logger.info(f"   ✅✅✅ Manually loaded API key: {manual_key[:10]}...{manual_key[-4:] if len(manual_key) > 14 else '****'} (length: {len(manual_key)})")
                                # Also set it in os.environ for consistency
                                os.environ['OPENROUTER_API_KEY'] = API_KEY
                                break
                if API_KEY:
                    break  # Found the key, exit loop
        except Exception as e:
            logger.error(f"   Error reading {env_file_path}: {e}")
            continue

# Strip whitespace if present
if API_KEY:
    API_KEY = API_KEY.strip().strip('"').strip("'").replace('\n', '').replace('\r', '')  # Remove quotes, whitespace, and newlines
    if API_KEY:
        logger.info(f"✅ OPENROUTER_API_KEY found: {API_KEY[:10]}...{API_KEY[-4:] if len(API_KEY) > 14 else '****'} (length: {len(API_KEY)})")
        # Validate key length (OpenRouter keys are typically 100+ characters)
        if len(API_KEY) < 50:
            logger.warning(f"⚠️ API key seems short ({len(API_KEY)} chars). OpenRouter keys are typically 100+ characters. Check if the key is complete.")
    else:
        API_KEY = None

if not API_KEY:
    logger.error("❌ OPENROUTER_API_KEY not found in environment variables")
    logger.error(f"   Checked .env file at: {env_path}")
    logger.error(f"   Checked .env file at: {current_dir_env}")
    logger.error(f"   Current working directory: {os.getcwd()}")
    logger.error(f"   Script directory: {script_dir}")
    
    # Try reading .env file directly from all possible locations
    env_files_to_try = [
        env_file_found,
        env_path,
        current_dir_env,
        '.env',
        os.path.join(script_dir, '.env'),
        os.path.join(os.getcwd(), '.env'),
    ]
    
    for env_file_path in env_files_to_try:
        if not env_file_path:
            continue
        if os.path.exists(env_file_path):
            try:
                logger.info(f"   🔍 Trying to manually read .env file from: {env_file_path}")
                # Use utf-8-sig to automatically handle BOM if present
                with open(env_file_path, 'r', encoding='utf-8-sig') as f:
                    env_content = f.read()
                    logger.info(f"   📄 .env file content (first 100 chars): {env_content[:100]}")
                    if 'OPENROUTER_API_KEY' in env_content:
                        logger.info("   ⚠️ Found 'OPENROUTER_API_KEY' in file, manually parsing...")
                        
                        # Try manual parsing as fallback - handle multi-line keys
                        lines = env_content.splitlines()
                        for i, line in enumerate(lines):
                            line = line.strip()
                            if not line or line.startswith('#'):
                                continue
                            # Check for OPENROUTER_API_KEY (handle BOM and variations)
                            if 'OPENROUTER_API_KEY' in line and '=' in line:
                                # Extract the key value after the = sign
                                parts = line.split('=', 1)
                                if len(parts) == 2:
                                    manual_key = parts[1].strip().strip('"').strip("'")
                                    
                                    # Handle multi-line keys: if the key seems incomplete, check next lines
                                    # OpenRouter keys typically start with 'sk-or-v1-' and are ~100+ chars
                                    if manual_key and manual_key.startswith('sk-') and len(manual_key) < 80:
                                        # Key might be split across lines, try to concatenate next non-empty lines
                                        remaining_key = ""
                                        for j in range(i + 1, min(i + 5, len(lines))):  # Check up to 4 more lines
                                            next_line = lines[j].strip()
                                            if next_line and not next_line.startswith('#') and '=' not in next_line:
                                                remaining_key += next_line.strip().strip('"').strip("'")
                                            else:
                                                break
                                        if remaining_key:
                                            manual_key = manual_key + remaining_key
                                            logger.info(f"   🔧 Detected multi-line key, concatenated: {len(manual_key)} chars")
                                    
                                    if manual_key:
                                        logger.info(f"   🔧 Manually parsed API key from .env file: {manual_key[:10]}...{manual_key[-4:] if len(manual_key) > 14 else '****'} (length: {len(manual_key)})")
                                        API_KEY = manual_key
                                        logger.info(f"   ✅ Successfully loaded API key via manual parsing!")
                                        break
                        if API_KEY:
                            break  # Break out of outer loop if we found the key
            except Exception as e:
                logger.error(f"   Error reading .env file from {env_file_path}: {e}")
                import traceback
                logger.error(f"   Traceback: {traceback.format_exc()}")
    
if not API_KEY:
    logger.error(f"   All environment variables containing 'API': {[(k, (v[:10] + '...' if len(v) > 10 else v) if v else 'None') for k, v in os.environ.items() if 'API' in k.upper()]}")
    raise ValueError("OPENROUTER_API_KEY is required. Please check your .env file. Make sure it contains: OPENROUTER_API_KEY=your_key_here (no spaces around =)")

# Validate API key format (OpenRouter keys typically start with 'sk-or-')
if not API_KEY.startswith('sk-'):
    logger.warning(f"⚠️ API key doesn't start with 'sk-'. This might not be a valid OpenRouter API key.")
    logger.warning(f"   API key format: {API_KEY[:10]}... (length: {len(API_KEY)})")
else:
    # Validate key length - OpenRouter keys are typically 70-150 characters
    if len(API_KEY) < 50:
        logger.error(f"❌ API key seems too short ({len(API_KEY)} chars). OpenRouter keys are typically 70-150 characters.")
        logger.error(f"   The key might be incomplete. Please check your .env file.")
    elif len(API_KEY) > 200:
        logger.warning(f"⚠️ API key seems unusually long ({len(API_KEY)} chars). Please verify it's correct.")
    else:
        logger.info(f"✅ API key length looks valid: {len(API_KEY)} characters")

# Initialize OpenAI client with OpenRouter base URL
try:
    client = OpenAI(
        api_key=API_KEY,
        base_url="https://openrouter.ai/api/v1",
        default_headers={
            "HTTP-Referer": "https://novya.com",  # Optional: for analytics
            "X-Title": "NOVYA Learning Platform"  # Optional: for analytics
        }
    )
    logger.info(f"✅ OpenAI client initialized successfully with API key: {API_KEY[:10]}...{API_KEY[-4:] if len(API_KEY) > 14 else '****'}")
except Exception as client_init_error:
    logger.error(f"❌ Failed to initialize OpenAI client: {client_init_error}")
    import traceback
    logger.error(f"   Traceback: {traceback.format_exc()}")
    client = None
    # Don't raise - allow server to start but quizzes will fail with proper error messages

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Pydantic Models
class ChatRequest(BaseModel):
    class_level: str
    subject: str
    chapter: str
    student_question: str
    chat_history: Optional[List[Dict]] = None
class StudyPlanRequest(BaseModel):
    class_level: str
    subject: str
    chapter: str
    days_available: int = 7
    hours_per_day: int = 2
class NotesRequest(BaseModel):
    class_level: str
    subject: str
    chapter: str
    specific_topic: Optional[str] = None
class OverviewRequest(BaseModel):
    class_level: str
    subject: str
    chapter: str
    specific_topic: Optional[str] = None
class ExplanationRequest(BaseModel):
    questions: List[Dict]
    class_level: Optional[str] = None
    subject: Optional[str] = None
    chapter: Optional[str] = None
    language: Optional[str] = "English"
# Corrected CBSE 7th–10th Computers & English units & topics (for quickpractice)
CHAPTERS_DETAILED = {
    "7th": {
    "Computers": {
        " Chapter 1: Programming Language": [
            "What is a programming language?",
            "Types: Low-level vs High-level languages",
            "Examples and real-world uses",
            "Simple pseudocode or introduction to programming logic"
        ],
        "Chapter 2: Editing Text in Microsoft Word": [
            "Creating, saving, and opening documents",
            "Text formatting: fonts, sizes, colors, bold, italics",
            "Paragraph alignment, bullets, numbering",
            "Inserting images, tables, and hyperlinks"
        ],
        "Chapter 3: Microsoft PowerPoint": [
            "Creating slides and using slide layouts",
            "Adding and editing text and images",
            "Applying themes and transitions",
            "Running a slideshow"
        ],
        "Chapter 4: Basics of Microsoft Excel": [
            "Entering and formatting data in cells",
            "Basic formulas (SUM, AVERAGE)",
            "Creating charts from data",
            "Simple data organization (sorting and filtering)"
        ],
        "Chapter 5: Microsoft Access": [
            "Understanding databases and tables",
            "Creating a simple database",
            "Adding, editing, and searching records",
            "Basic queries"
        ]
    },
    "English": {
        "Chapter 1: Learning Together": [
            "The Day the River Spoke: Sentence completion, onomatopoeia, fill-in-the-blanks, prepositions",
            "Try Again: Phrases, metaphor and simile",
            "Three Days to See: Modal verbs, descriptive paragraph writing"
        ],
        "Chapter 2: Wit and Humour": [
            "Animals, Birds, and Dr. Dolittle: Compound words, palindrome, present perfect tense, notice writing",
            "A Funny Man: Phrasal verbs, adverbs and prepositions",
            "Say the Right Thing: Suffixes, verb forms, tenses, kinds of sentences"
        ],
        "Chapter 3: Dreams & Discoveries": [
            "My Brother's Great Invention: Onomatopoeia, binomials, phrasal verbs, idioms, simple past and past perfect tense",
            "Paper Boats: Antonyms (opposites), diary entry writing",
            "North, South, East, West: Associate words with meanings, subject-verb agreement, letter format (leave application)"
        ],
        "Chapter 4: Travel and Adventure": [
            "The Tunnel: Phrases, onomatopoeia, punctuation, descriptive paragraph writing",
            "Travel: Onomatopoeia",
            "Conquering the Summit: Phrases, parts of speech, articles, formal letter writing"
        ],
        "Chapter 5: Bravehearts": [
            "A Homage to Our Brave Soldiers: Prefix and root words, main clause, subordinate clause, subordinating conjunctions",
            "My Dear Soldiers: Collocations",
            "Rani Abbakka: Fill-in-the-blanks (spelling), speech (direct & indirect)"
        ]
    },
    "Mathematics": {
        "Chapter 1: Integers": [
            "Properties of addition and subtraction of integers",
            "Multiplication of integers",
            "Properties of multiplication of integers",
            "Division of integers",
            "Properties of division of integers"
        ],
        "Chapter 2: Fractions and Decimals": [
            "Multiplication of fractions",
            "Division of fractions",
            "Multiplication of decimal numbers",
            "Division of decimal numbers"
        ],
        "Chapter 3: Data Handling": [
            "Representative values",
            "Arithmetic mean",
            "Mode",
            "Median",
            "Use of bar graphs with different purposes"
        ],
        "Chapter 4: Simple Equations": [
            "A mind-reading game (intro activity)",
            "Setting up an equation",
            "What is an equation?",
            "More equations",
            "Application of simple equations to practical situations"
        ],
        "Chapter 5: Lines and Angles": [
            "Introduction and related angles",
            "Pairs of lines",
            "Checking for parallel lines"
        ],
        "Chapter 6: The Triangle and Its Properties": [
            "Medians of a triangle",
            "Altitudes of a triangle",
            "Exterior angle and its property",
            "Angle sum property of a triangle",
            "Two special triangles: equilateral and isosceles",
            "Sum of lengths of two sides of a triangle",
            "Right-angled triangles and Pythagoras' property"
        ],
        "Chapter 7: Comparing Quantities": [
            "Percentage– another way of comparing quantities",
            "Uses of percentages",
            "Prices related to an item (buying/selling scenarios)",
            "Charge given on borrowed money or simple interest"
        ],
        "Chapter 8: Rational Numbers": [
            "Introduction and need for rational numbers",
            "Positive and negative rational numbers",
            "Rational numbers on the number line",
            "Rational numbers in standard form",
            "Comparison of rational numbers",
            "Rational numbers between two rational numbers",
            "Operations on rational numbers"
        ],
        "Chapter 9: Perimeter and Area": [
            "Area of parallelogram",
            "Area of triangles",
            "Understanding circles (circumference/area)"
        ],
        "Chapter 10: Algebraic Expressions": [
            "Introduction to algebraic expressions",
            "Formation of expressions",
            "Terms of an expression",
            "Like and unlike terms",
            "Monomials, binomials, trinomials, polynomials",
            "Finding the value of an expression"
        ],
        "Chapter 11: Exponents and Powers": [
            "Introduction to exponents",
            "Laws of exponents",
            "Miscellaneous examples using laws of exponents",
            "Decimal number system",
            "Expressing large numbers in standard form"
        ],
        "Chapter 12: Symmetry": [
            "Lines of symmetry for regular polygons",
            "Rotational symmetry",
            "Line symmetry vs. rotational symmetry"
        ],
        "Chapter 13: Visualising Solid Shapes": [
            "Plane figures vs. solid shapes",
            "Faces, edges, vertices of 3D shapes (cubes, cuboids, cones, etc.)",
            "Visualisation from different perspectives"
        ]
    },
    "Science": {
        "Chapter1: Nutrition in Plants": [
            "Photosynthesis",
            "Modes of nutrition: Autotrophic, Heterotrophic",
            "Saprotrophic nutrition",
            "Structure of leaves"
        ],
        "Chapter2: Nutrition in Animals": [
            "Human digestive system",
            "Nutrition in different animals",
            "Feeding habits"
        ],
        "Chapter3: Fibre to Fabric": [
            "Natural fibres (Cotton, Wool, Silk)",
            "Processing of fibres",
            "Spinning, Weaving, Knitting"
        ],
        "Chapter4: Heat": [
            "Hot and cold objects",
            "Measurement of temperature",
            "Laboratory thermometer",
            "Transfer of heat",
            "Kinds of clothes we wear in summer and winter"
        ],
        "Chapter5: Acids, Bases and Salts": [
            "Acid and base indicators",
            "Natural indicators around us",
            "Neutralisation in daily life"
        ],
        "Chapter6: Physical and Chemical Changes": [
            "Changes around us",
            "Physical and chemical changes with examples",
            "Rusting of iron and its prevention",
            "Crystallisation"
        ],
        "Chapter7: Weather, Climate and Adaptations of Animals": [
            "Difference between weather and climate",
            "Climate and adaptation",
            "Effect of climate on living organisms",
            "Polar regions and tropical rainforests"
        ],
        "Chapter8: Winds, Storms and Cyclones": [
            "Air exerts pressure",
            "Air expands on heating",
            "Wind currents and convection",
            "Thunderstorms and cyclones"
        ],
        "Chapter9: Soil": [
            "Soil profile and soil types",
            "Properties of soil",
            "Soil and crops"
        ],
        "Chapter10: Respiration in Organisms": [
            "Why do we respire?",
            "Types of respiration: aerobic and anaerobic",
            "Breathing in animals and humans",
            "Breathing cycle and rate"
        ],
        "Chapter11: Transportation in Animals and Plants": [
            "Circulatory system: heart, blood, blood vessels",
            "Excretion in animals",
            "Transport of water and minerals in plants",
            "Transpiration"
        ],
        "Chapter12: Reproduction in Plants": [
            "Modes of reproduction: asexual and sexual",
            "Vegetative propagation",
            "Pollination and fertilisation",
            "Seed dispersal"
        ],
        "Chapter13: Motion and Time": [
            "Concept of speed",
            "Measurement of time",
            "Simple pendulum",
            "Distance-time graph"
        ],
        "Chapter14: Electric Current and Its Effects": [
            "Symbols of electric components",
            "Heating effect of electric current",
            "Magnetic effect of electric current",
            "Electromagnet and its uses"
        ],
        "Chapter15: Light": [
            "Reflection of light",
            "Plane mirror image formation",
            "Spherical mirrors and lenses",
            "Uses of lenses"
        ],
        "Chapter16: Water: A Precious Resource": [
            "Availability of water on earth",
            "Forms of water",
            "Groundwater and water table",
            "Water management",
            "Water scarcity and conservation"
        ],
        "Chapter17: Forests: Our Lifeline": [
            "Importance of forests",
            "Interdependence of plants and animals in forests",
            "Deforestation and conservation"
        ],
        "Chapter18: Wastewater Story": [
            "Importance of sanitation",
            "Sewage and wastewater treatment",
            "Sanitation at public places"
        ]
    },
    "History": {
        "Chapter 1: Tracing Changes through a Thousand Years": [
            "Maps and how they tell us about history",
            "New and old terminologies used by historians",
            "Historians and their sources (manuscripts, inscriptions, coins)",
            "New social and political groups",
            "Region and empire"
        ],
        "Chapter 2: New Kings and Kingdoms": [
            "Emergence of new dynasties",
            "Administration in kingdoms",
            "Warfare for wealth and power",
            "Prashastis and land grants"
        ],
        "Chapter 3: The Delhi Sultans (12th–15th Century)": [
            "Political and military expansion under rulers",
            "Administration and consolidation",
            "Construction of mosques and cities",
            "Raziya Sultan and Muhammad Tughlaq case studies"
        ],
        "Chapter 4: The Mughal Empire (16th–17th Century)": [
            "Establishment and expansion of the Mughal Empire",
            "Akbar's policies and administration (Mansabdari system, sulh-i-kul)",
            "Jahangir, Shah Jahan, Aurangzeb",
            "Relations with other rulers"
        ],
        "Chapter 5: Rulers and Buildings / Tribes, Nomads and Settled Communities": [
            "Tribal societies and their lifestyle",
            "Nomadic pastoralists",
            "Emergence of new caste-based communities",
            "Interaction between nomads and settled societies"
        ],
        "Chapter 6: Devotional Paths to the Divine": [
            "Bhakti movement and saints (Basavanna, Kabir, Mirabai, etc.)",
            "Sufi traditions",
            "New religious developments in different regions"
        ],
        "Chapter 7: The Making of Regional Cultures": [
            "Language, literature, and regional identity",
            "Regional art, dance, and music forms",
            "Case study: Kathak and Manipuri",
            "Regional traditions in temple architecture"
        ],
        "Chapter 8: Eighteenth Century Political Formations": [
            "Decline of the Mughal Empire",
            "Emergence of new independent kingdoms",
            "Marathas, Sikhs, Jats, Rajputs",
            "Regional states and their administration"
        ]
    },
    "Civics": {
        "Chapter 1: On Equality": [
            "Equality in Indian democracy",
            "Issues of inequality (caste, religion, gender, economic)",
            "Government efforts to promote equality"
        ],
        "Chapter 2: Role of the Government in Health": [
            "Public health services vs. private health services",
            "Importance of healthcare",
            "Inequality in access to healthcare",
            "Case studies"
        ],
        "Chapter 3: How the State Government Works": [
            "Role of the Governor and Chief Minister",
            "State legislature and its functioning",
            "Role of MLAs",
            "Case study of a state government decision"
        ],
        "Chapter 4: Growing up as Boys and Girls": [
            "Gender roles in society",
            "Stereotypes related to boys and girls",
            "Experiences of growing up in different societies",
            "Equality for women"
        ],
        "Chapter 5: Women Change the World": [
            "Women in education and work",
            "Struggles for equality",
            "Case studies of women achievers",
            "Laws for women's rights"
        ],
        "Chapter 6: Understanding Media": [
            "Role of media in democracy",
            "Influence of media on public opinion",
            "Commercialisation and bias in media",
            "Need for independent media"
        ],
        "Chapter 7: Markets Around Us": [
            "Weekly markets, shops, and malls",
            "Chain of markets (producers to consumers)",
            "Role of money and middlemen",
            "Impact on farmers and small traders"
        ],
        "Chapter 8: A Shirt in the Market": [
            "Process of production and distribution",
            "Globalisation and trade",
            "Role of traders, exporters, workers",
            "Consumer awareness"
        ]
    },
    "Geography": {
        "Chapter 1: Environment": [
            "Components of environment (natural, human, human-made)",
            "Ecosystem",
            "Balance in the environment"
        ],
        "Chapter 2: Inside Our Earth": [
            "Layers of the earth (crust, mantle, core)",
            "Types of rocks (igneous, sedimentary, metamorphic)",
            "Rock cycle",
            "Minerals and their uses"
        ],
        "Chapter 3: Our Changing Earth": [
            "Lithosphere movements (earthquakes, volcanoes)",
            "Major landform features (mountains, plateaus, plains)",
            "Work of rivers, wind, glaciers, sea waves"
        ],
        "Chapter 4: Air": [
            "Composition of atmosphere",
            "Structure of atmosphere",
            "Weather and climate",
            "Distribution of temperature and pressure",
            "Wind and moisture"
        ],
        "Chapter 5: Water": [
            "Distribution of water on earth",
            "Water cycle",
            "Oceans (waves, tides, currents)",
            "Importance of water"
        ],
        "Chapter 6: Human-Environment Interactions– The Tropical and the Subtropical Region": [
            "Amazon basin (equatorial region)",
            "Ganga-Brahmaputra basin (subtropical region)",
            "Life of people in these regions"
        ],
        "Chapter 7: Life in the Deserts": [
            "Hot deserts (Sahara)",
            "Cold deserts (Ladakh)",
            "Adaptations of people and animals",
            "Economic activities in deserts"
        ]
    }
},
   "8th": {
    "Computers": {
        "Chapter:1 Exception Handling in Python": [
            "Introduction to errors and exceptions",
            "Types of errors: Syntax errors, Runtime errors (exceptions), Logical errors",
            "Built-in exceptions (ZeroDivisionError, ValueError, etc.)",
            "Using try–except block",
            "try–except–else–finally structure",
            "Raising exceptions using raise",
            "Real-life examples of exception handling (division by zero, invalid input)"
        ],
        "Chapter:2 File Handling in Python": [
            "Introduction to file handling",
            "Types of files: Text files, Binary files",
            "Opening and closing files (open(), close())",
            "File modes (r, w, a, r+)",
            "Reading from a file (read(), readline(), readlines())",
            "Writing to a file (write(), writelines())",
            "File pointer and cursor movement (seek(), tell())",
            "Practical applications: saving student records, logs, etc."
        ],
        "Chapter:3 Stack (Data Structure)": [
            "Introduction to stack",
            "LIFO principle (Last In First Out)",
            "Stack operations: Push, Pop, Peek/Top",
            "Stack implementation using list in Python or modules (collections.deque)",
            "Applications: Undo operation in editors, Function call management"
        ],
        "Chapter:4 Queue (Data Structure)": [
            "Introduction to queue",
            "FIFO principle (First In First Out)",
            "Queue operations: Enqueue, Dequeue",
            "Types of queues: Simple, Circular, Deque, Priority",
            "Implementation in Python using lists or queue module",
            "Applications: Printer task scheduling, Customer service systems"
        ],
        "Chapter:5 Sorting": [
            "Importance of sorting in data organization",
            "Basic sorting techniques: Bubble Sort, Selection Sort, Insertion Sort",
            "Advanced sorting (introductory): Merge Sort, Quick Sort",
            "Sorting in Python using built-in methods: sorted() function"
        ]
    },
    "English": {
        " Unit:1 Honeydew – Prose": [
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
        "Unit:2 Honeydew – Poems": [
            "The Ant and the Cricket: Moral fable, rhyme scheme",
            "Geography Lesson: Imagery, meaning",
            "Macavity: The Mystery Cat: Humour, personification",
            "The Last Bargain: Metaphor, symbolism",
            "The School Boy: Theme of education, freedom",
            "The Duck and the Kangaroo: Rhyme, humour",
            "When I set out for Lyonnesse: Imagination, rhyme",
            "On the Grasshopper and Cricket: Nature imagery"
        ],
        "Unit:3 It So Happened – Supplementary": [
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
    "Mathematics": {
        "Chapter 1: Rational Numbers": ["Introduction", "Properties of Rational Numbers", "Representation of Rational Numbers on the Number Line", "Rational Number between Two Rational Numbers", "Word Problems"],
        "Chapter 2: Linear Equations in One Variable": ["Introduction", "Solving Equations which have Linear Expressions on one Side and Numbers on the other Side", "Some Applications", "Solving Equations having the Variable on both sides", "Some More Applications", "Reducing Equations to Simpler Form", "Equations Reducible to the Linear Form"],
        "Chapter 3: Understanding Quadrilaterals": ["Introduction", "Polygons", "Sum of the Measures of the Exterior Angles of a Polygon", "Kinds of Quadrilaterals", "Some Special Parallelograms"],
        "Chapter 4: Data Handling": ["Looking for Information", "Organising Data", "Grouping Data", "Circle Graph or Pie Chart", "Chance and Probability"],
        "Chapter 5: Squares and Square Roots": ["Introduction", "Properties of Square Numbers", "Some More Interesting Patterns", "Finding the Square of a Number", "Square Roots", "Square Roots of Decimals", "Estimating Square Root"],
        "Chapter 6: Cubes and Cube Roots": ["Introduction", "Cubes", "Cubes Roots"],
        "Chapter 7: Comparing Quantities": ["Recalling Ratios and Percentages", "Finding the Increase and Decrease Percent", "Finding Discounts", "Prices Related to Buying and Selling (Profit and Loss)", "Sales Tax/Value Added Tax/Goods and Services Tax", "Compound Interest", "Deducing a Formula for Compound Interest", "Rate Compounded Annually or Half Yearly (Semi Annually)", "Applications of Compound Interest Formula"],
        "Chapter 8: Algebraic Expressions and Identities": ["What are Expressions?", "Terms, Factors and Coefficients", "Monomials, Binomials and Polynomials", "Like and Unlike Terms", "Addition and Subtraction of Algebraic Expressions", "Multiplication of Algebraic Expressions: Introduction", "Multiplying a Monomial by a Monomial", "Multiplying a Monomial by a Polynomial", "Multiplying a Polynomial by a Polynomial", "What is an Identity?", "Standard Identities", "Applying Identities"],
        "Chapter 9: Mensuration": ["Introduction", "Let us Recall", "Area of Trapezium", "Area of General Quadrilateral", "Area of Polygons", "Solid Shapes", "Surface Area of Cube, Cuboid and Cylinder", "Volume of Cube, Cuboid and Cylinder", "Volume and Capacity"],
        "Chapter 10: Exponents and Powers": ["Introduction", "Powers with Negative Exponents", "Laws of Exponents", "Use of Exponents to Express Small Numbers in Standard Form"],
        "Chapter 11: Direct and Inverse Proportions": ["Introduction", "Direct Proportion", "Inverse Proportion"],
        "Chapter 12: Factorisation": ["Introduction", "What is Factorisation?", "Division of Algebraic Expressions", "Division of Algebraic Expressions Continued (Polynomial / Polynomial)", "Can you Find the Error?"],
        "Chapter 13: Introduction to Graphs": ["Introduction", "Linear Graphs", "Some Applications"]
    },
    "Science": {
        "Chapter:1 Crop Production and Management": ["Agriculture practices", "Crop production techniques", "Storage and preservation"],
        "Chapter:2 Microorganisms: Friend and Foe": ["Bacteria, viruses, fungi", "Useful microbes", "Harmful microbes and diseases"],
        "Chapter:3 Synthetic Fibres and Plastics": ["Types of synthetic fibres", "Characteristics and uses", "Plastics: Thermoplastics, Thermosetting"],
        "Chapter:4 Materials: Metals and Non-Metals": ["Physical and chemical properties", "Reactivity series", "Uses of metals and non-metals"],
        "Chapter:5 Coal and Petroleum": ["Fossil fuels", "Refining petroleum", "Uses of coal and petroleum"],
        "Chapter:6 Combustion and Flame": ["Types of combustion", "Structure of flame", "Fire safety"],
        "Chapter:7 Conservation of Plants and Animals": ["Biodiversity", "Endangered species", "Wildlife conservation"],
        "Chapter:8 Cell – Structure and Functions": ["Plant and animal cell", "Cell organelles", "Cell division"],
        "Chapter:9 Reproduction in Animals": ["Modes of reproduction", "Human reproductive system", "Fertilization and development"],
        "Chapter:10 Force and Pressure": ["Types of forces", "Pressure in solids, liquids, and gases", "Applications"],
        "Chapter:11 Friction": ["Advantages and disadvantages", "Reducing friction"],
        "Chapter:12 Sound": ["Production and propagation", "Characteristics of sound", "Human ear"],
        "Chapter:13 Chemical Effects of Electric Current": ["Electrolysis", "Applications in daily life"],
        "Chapter:14 Some Natural Phenomena": ["Lightning, Earthquakes, and Safety measures"],
        "Chapter:15 Light": ["Reflection, refraction, dispersion", "Human eye and defects"],
        "Chapter:16 Stars and the Solar System": ["Solar system structure", "Planets, moons, comets, and meteors"],
        "Chapter:17 Pollution of Air and Water": ["Causes and effects", "Control measures"]
    },
    "History": {
            "Chapter 1: How, When and Where": ["How do we periodise history?", "Importance of dates and events", "Sources for studying modern history", "Official records of the British administration"],
            "Chapter 2: From Trade to Territory– The Company Establishes Power": ["East India Company comes to India", "Establishment of trade centres", "Battle of Plassey and Buxar", "Expansion of British power in India", "Subsidiary alliance and doctrine of lapse"],
            "Chapter 3: Ruling the Countryside": ["The revenue system under British rule", "Permanent Settlement, Ryotwari and Mahalwari systems", "Effects of British land revenue policies", "Role of indigo cultivation and indigo revolt"],
            "Chapter 4: Tribals, Dikus and the Vision of a Golden Age": ["Tribal societies and their livelihoods", "Impact of British policies on tribal life", "Tribal revolts and resistance", "Birsa Munda and his movement"],
            "Chapter 5: When People Rebel– 1857 and After": ["Causes of the revolt of 1857", "Important centres of the revolt", "Leaders and their roles", "Suppression of the revolt", "Consequences and significance"],
            "Chapter 6: Civilising the 'Native', Educating the Nation": ["The British view on education in India", "Orientalist vs Anglicist debate", "Macaulay's Minute on Education", "Wood's Despatch", "Growth of national education system"],
            "Chapter 7: Women, Caste and Reform": ["Social reform movements in the 19th century", "Reformers and their contributions (Raja Ram Mohan Roy, Ishwar Chandra Vidyasagar, Jyotiba Phule, etc.)", "Movements against caste discrimination", "Role of women in reform and education"],
            "Chapter 8: The Making of the National Movement: 1870s–1947": ["Rise of nationalism in India", "Formation of Indian National Congress", "Moderates, extremists, and their methods", "Partition of Bengal, Swadeshi and Boycott", "Gandhian era movements (Non-Cooperation, Civil Disobedience, Quit India)", "Role of revolutionaries and other leaders", "Towards Independence and Partition"]
     
    },
    "Civics": {
            "Chapter 1: The Indian Constitution": ["Importance and features of the Constitution", "Fundamental Rights and Duties", "Directive Principles of State Policy", "Role of the Constitution in democracy"],
            "Chapter 2: Understanding Secularism": ["Meaning of secularism", "Secularism in India", "Importance of religious tolerance", "Role of the State in maintaining secularism"],
            "Chapter 3: Parliament and the Making of Laws": ["Why do we need a Parliament?", "Two Houses of Parliament (Lok Sabha, Rajya Sabha)", "Law-making process in Parliament", "Role of the President in legislation"],
            "Chapter 4: Judiciary": ["Structure of the Indian judiciary", "Independence of the judiciary", "Judicial review and judicial activism", "Public Interest Litigation (PIL)"],
            "Chapter 5: Understanding Marginalisation": ["Concept of marginalisation", "Marginalised groups in India (Adivasis, Dalits, Minorities)", "Issues faced by marginalised communities"],
            "Chapter 6: Confronting Marginalisation": ["Safeguards in the Constitution for marginalised groups", "Laws protecting marginalised communities", "Role of social reformers and activists"],
            "Chapter 7: Public Facilities": ["Importance of public facilities (water, healthcare, education, transport)", "Role of the government in providing facilities", "Issues of inequality in access to facilities"],
            "Chapter 8: Law and Social Justice": ["Need for laws to ensure social justice", "Workers' rights and protection laws", "Child labour and related legislation", "Role of government in ensuring justice"]
     
    },
    "Geography": {
            "Chapter 1: Resources": ["Types of resources (natural, human-made, human)", "Classification: renewable, non-renewable, ubiquitous, localized", "Resource conservation and sustainable development"],
            "Chapter 2: Land, Soil, Water, Natural Vegetation and Wildlife Resources": ["Land use and land degradation", "Soil types and soil conservation", "Water resources and conservation methods", "Natural vegetation types and importance", "Wildlife resources and conservation"],
            "Chapter 3: Agriculture": ["Types of farming (subsistence, intensive, commercial, plantation)", "Major crops (rice, wheat, cotton, sugarcane, tea, coffee, etc.)", "Agricultural development in different countries", "Impact of technology on agriculture"],
            "Chapter 4: Industries": ["Types of industries (raw material-based, size-based, ownership-based)", "Factors affecting location of industries", "Major industrial regions of the world", "Case studies: IT industry (Bangalore), Cotton textile industry (Ahmedabad/Osaka)"],
            "Chapter 5: Human Resources": ["Population distribution and density", "Factors influencing population distribution", "Population change (birth rate, death rate, migration)", "Population pyramid", "Importance of human resources for development"]
     
    }
},
    "9th": {
    "Computers": {
        "Chapter:1 Basics of Computer System": [
            "Introduction to computer system",
            "Components: Input devices, Output devices, Storage devices, CPU",
            "Memory types: Primary, Secondary, Cache",
            "Number system basics: binary, decimal, conversion",
            "Difference between hardware, software, firmware"
        ],
        "Chapter:2 Types of Software": [
            "What is software?",
            "Categories: System software, Utility software, Application software, Programming software",
            "Open-source vs Proprietary",
            "Freeware, Shareware, Licensed software"
        ],
        "Chapter:3 Operating System": [
            "Definition and importance of OS",
            "Functions: Process management, Memory management, File management, Device management",
            "User interface (CLI vs GUI)",
            "Types: Batch, Time-sharing, Real-time, Distributed",
            "Popular examples: Windows, Linux, Android"
        ],
        "Chapter:4 Introduction to Python Programming": [
            "Introduction to Python & its features",
            "Writing and running Python programs",
            "Variables, data types, operators",
            "Control structures: if, if-else, elif; loops: for, while",
            "Functions (introductory)"
        ],
        "Chapter:5 Introduction to Cyber Security": [
            "What is cyber security?",
            "Types of cyber threats: Malware, Viruses, Worms, Phishing, Ransomware, Spyware, Trojans",
            "Cyber safety measures: Strong passwords, 2FA, Firewalls, antivirus, backups",
            "Cyber ethics and responsible digital behavior",
            "Awareness of cyber laws (basic introduction to IT Act in India)"
        ]
    },
    "English": {
        "Unit:1 Beehive – Prose": [
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
        "Unit:2 Beehive – Poems": [
            "The Road Not Taken: Choices, symbolism",
            "Wind: Nature, strength",
            "Rain on the Roof: Imagery, childhood memories",
            "The Lake Isle of Innisfree: Peace, nature imagery",
            "A Legend of the Northland: Ballad, moral",
            "No Men Are Foreign: Universal brotherhood",
            "On Killing a Tree: Nature, destruction",
            "A Slumber Did My Spirit Seal: Theme of death, imagery"
        ],
        "Unit:3 Moments – Supplementary": [
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
    "Mathematics": {
        "Chapter1: Number System": ["Real Numbers"],
        "Chapter2: Algebra": ["Polynomials", "Linear Equations in Two Variables"],
        "Chapter3: Coordinate Geometry": ["Coordinate Geometry"],
        "Chapter4: Geometry": ["Introduction to Euclid's Geometry","Lines and Angles","Triangles","Quadrilaterals","Circles"],
        "Chapter5: Mensuration": ["Areas", "Surface Areas and Volumes"],
        "Chapter6: Statistics": ["Statistics"]
    },
    "Science": {
        "Chapter:1 Matter in Our Surroundings": ["States of matter", "Properties of solids, liquids, and gases", "Changes of state"],
        "Chapter:2 Is Matter Around Us Pure?": ["Mixtures, solutions, alloys", "Separation techniques"],
        "Chapter:3 Atoms and Molecules": ["Laws of chemical combination", "Atomic and molecular masses", "Mole concept"],
        "Chapter:4 Structure of the Atom": ["Discovery of electron, proton, neutron", "Atomic models"],
        "Chapter:5 The Fundamental Unit of Life": ["Cell structure", "Cell organelles", "Cell functions"],
        "Chapter:6 Tissues": ["Plant tissues", "Animal tissues"],
        "Chapter:7 Diversity of the Living Organisms – I": ["Classification of organisms", "Kingdom Monera, Protista, Fungi"],
        "Chapter:8 Diversity of the Living Organisms – II": ["Plant kingdom", "Angiosperms, Gymnosperms"],
        "Chapter:9 Diversity of the Living Organisms – III": ["Animal kingdom", "Classification of animals"],
        "Chapter:10 Motion": ["Distance, displacement, speed, velocity", "Acceleration, uniform and non-uniform motion"],
        "Chapter:11 Force and Laws of Motion": ["Newton's laws", "Momentum, force, and inertia"],
        "Chapter:12 Gravitation": ["Universal law of gravitation", "Acceleration due to gravity", "Free fall"],
        "Chapter:13 Work and Energy": ["Work done", "Kinetic and potential energy", "Power"],
        "Chapter:14 Sound": ["Propagation of sound", "Characteristics", "Echo"],
        "Chapter:15 Why Do We Fall Ill?": ["Health and diseases", "Pathogens", "Immunity and vaccination"],
        "Chapter:16 Natural Resources": ["Air, water, soil, forests, minerals", "Conservation"],
        "Chapter:17 Improvement in Food Resources": ["Crop varieties", "Animal husbandry", "Food processing"]
    },
    "History": {
        "Chapter 1: The French Revolution": [
            "French society in the late 18th century",
            "The outbreak of the Revolution",
            "France becomes a constitutional monarchy",
            "The Reign of Terror",
            "The rise of Napoleon",
            "Impact of the Revolution on France and the world"
        ],
        "Chapter 2: Socialism in Europe and the Russian Revolution": [
            "Age of social change in Europe",
            "The Russian Empire in 1914",
            "The February Revolution",
            "The October Revolution and Bolsheviks in power",
            "Stalinism and collectivisation",
            "Industrial society and social change",
            "Global influence of the Russian Revolution"
        ],
        "Chapter 3: Nazism and the Rise of Hitler": [
            "Birth of the Weimar Republic",
            "Hitler's rise to power",
            "Nazi ideology and propaganda",
            "Establishment of a Nazi state",
            "Role of youth in Nazi Germany",
            "Racial policies and Holocaust",
            "Crimes against humanity"
        ],
        "Chapter 4: Forest Society and Colonialism": [
            "Deforestation under colonial rule",
            "Rise of commercial forestry",
            "Rebellions in forests (Bastar, Java)",
            "Impact on local communities"
        ],
        "Chapter 5: Pastoralists in the Modern World (Periodic Assessment only)": [
            "Pastoralism as a way of life",
            "Colonial impact on pastoral communities",
            "Case studies– Maasai (Africa), Raikas (India)",
            "Pastoralism in modern times"
        ]
    },
    "Geography": {
        "Chapter 1: India– Size and Location": ["Location and extent of India", "India and its neighbours", "Significance of India's location"],
        "Chapter 2: Physical Features of India": [
            "Formation of physiographic divisions",
            "Himalayas",
            "Northern Plains",
            "Peninsular Plateau",
            "Indian Desert",
            "Coastal Plains",
            "Islands"
        ],
        "Chapter 3: Drainage": [
            "Himalayan river systems",
            "Peninsular river systems",
            "Role and importance of rivers",
            "Lakes in India",
            "River pollution and conservation"
        ],
        "Chapter 4: Climate": [
            "Factors influencing climate",
            "Monsoon mechanism",
            "Seasons in India",
            "Rainfall distribution",
            "Monsoon as a unifying bond"
        ],
        "Chapter 5: Natural Vegetation and Wildlife": [
            "Types of vegetation in India",
            "Distribution of forests",
            "Wildlife species",
            "Conservation of forests and wildlife"
        ],
        "Chapter 6: Population": [
            "Size and distribution of population",
            "Population growth and processes (birth, death, migration)",
            "Age composition",
            "Sex ratio",
            "Literacy rate",
            "Population as an asset vs liability"
        ]
    },
    "Civics": {
        "Chapter 1: What is Democracy? Why Democracy?": [
            "Meaning of democracy",
            "Main features of democracy",
            "Arguments for and against democracy",
            "Broader meaning of democracy"
        ],
        "Chapter 2: Constitutional Design": [
            "Democratic Constitution in South Africa",
            "Why a Constitution is needed",
            "Making of the Indian Constitution",
            "Guiding values of the Constitution"
        ],
        "Chapter 3: Electoral Politics": [
            "Why elections are needed",
            "Indian election system",
            "Free and fair elections",
            "Role of the Election Commission"
        ],
        "Chapter 4: Working of Institutions": [
            "Parliament and its role",
            "The Executive– President, Prime Minister, Council of Ministers",
            "Lok Sabha and Rajya Sabha",
            "The Judiciary",
            "Decision-making process in democracy"
        ],
        "Chapter 5: Democratic Rights": [
            "Importance of rights in democracy",
            "Fundamental Rights in the Indian Constitution",
            "Right to Equality, Freedom, Religion, Education, Remedies",
            "Rights in practice– case studies"
        ]
    },
    "Economics": {
        "Chapter 1: The Story of Village Palampur": [
            "Farming and non-farming activities",
            "Factors of production (land, labour, capital, entrepreneurship)",
            "Organisation of production"
        ],
        "Chapter 2: People as Resource": [
            "People as an asset vs liability",
            "Role of education in human capital formation",
            "Role of health in human capital",
            "Unemployment and its types",
            "Role of women and children in the economy"
        ],
        "Chapter 3: Poverty as a Challenge": [
            "Two typical cases of poverty",
            "Poverty trends in India",
            "Causes of poverty",
            "Anti-poverty measures and programmes"
        ],
        "Chapter 4: Food Security in India": [
            "Meaning and need for food security",
            "Dimensions of food security",
            "Public Distribution System (PDS)",
            "Role of cooperatives and government programmes"
        ]
    }
},
   "10th": {
    "Computers": {
        "Chapter 1: Computer Fundamentals": [
            "Introduction to Computer Systems",
            "Number systems: binary, decimal, octal, hexadecimal",
            "Logic gates: AND, OR, NOT (truth tables)",
            "Computer hardware components: input, output, storage, CPU",
            "Types of memory: primary, secondary, cache, virtual memory",
            "Software overview: System, Application, Utilities",
            "Computer networks: LAN, MAN, WAN, Internet, intranet, extranet",
            "Data transmission: wired vs wireless",
            "Cloud computing basics",
            "Emerging technologies: AI, IoT, Big Data (introductory)"
        ],
        "Chapter 2: Advanced GIMP (GNU Image Manipulation Program)": [
            "Introduction to GIMP interface",
            "Layers and layer management",
            "Image editing tools: crop, scale, rotate, flip, perspective",
            "Color tools: brightness/contrast, hue/saturation, levels, curves",
            "Selection tools: free select, fuzzy select, paths",
            "Using filters and effects",
            "Working with text in GIMP",
            "Creating banners, posters, digital artwork",
            "Exporting images in different formats"
        ],
        "Chapter 3: Tables (HTML)": [
            "Introduction to HTML tables",
            "Table structure: <table>, <tr>, <td>, <th>",
            "Attributes: border, cellpadding, cellspacing, align, width, height",
            "Rowspan and Colspan",
            "Adding captions, Nested tables",
            "Styling tables with CSS"
        ],
        "Chapter 4: Forms (HTML)": [
            "Introduction to forms",
            "Form elements: Textbox, Password, Radio buttons, Checkboxes, Dropdown, Text area, Buttons",
            "Attributes: name, value, placeholder, required",
            "Form validation (basic HTML5)",
            "Form action and method (GET, POST)",
            "Simple login/registration forms"
        ],
        "Chapter 5: DHTML & CSS": [
            "Dynamic HTML: HTML + CSS + JavaScript",
            "Role of JavaScript in interactive pages",
            "Examples: rollover images, dynamic content updates",
            "CSS types: Inline, Internal, External",
            "CSS syntax: selectors, properties, values",
            "Styling text, backgrounds, borders, box model",
            "Positioning: static, relative, absolute, fixed",
            "Pseudo classes: :hover, :active, :first-child",
            "CSS for tables and forms"
        ]
    },
    "English": {
        "Unit1: First Flight – Prose": [
            "A Letter to God: Faith, irony",
            "Nelson Mandela: Long Walk to Freedom: Biography, freedom struggle",
            "From the Diary of Anne Frank: Diary, war, resilience",
            "Glimpses of India: Travel, culture",
            "Madam Rides the Bus: Childhood curiosity",
            "The Sermon at Benares: Teachings of Buddha",
            "Mijbil the Otter: Pet story, humour",
            "The Proposal: One-act play, satire"
        ],
        "Unit2: First Flight – Poems": [
            "Dust of Snow: Symbolism, nature",
            "Fire and Ice: Symbolism, theme of destruction",
            "The Ball Poem: Childhood loss, learning",
            "A Tiger in the Zoo: Freedom vs captivity",
            "How to Tell Wild Animals: Humour, description",
            "The Trees: Environment, imagery",
            "Fog: Metaphor, imagery",
            "The Tale of Custard the Dragon: Humour, rhyme",
            "For Anne Gregory: Beauty, inner vs outer"
        ],
        "Unit3: Footprints Without Feet – Supplementary": [
            "A Triumph of Surgery: Pet story, care",
            "The Thief's Story: Trust, honesty",
            "The Midnight Visitor: Detective, suspense",
            "A Question of Trust: Irony, theft",
            "Footprints Without Feet: Science fiction, invisibility",
            "The Making of a Scientist: Biography, Richard Ebright",
            "The Necklace: Irony, fate",
            "Bholi: Education, empowerment",
            "The Book That Saved the Earth: Science fiction, humour"
        ]
    },
    "Mathematics": {
        "Chapter 1: Number Systems": ["Real Number"],
        "Chapter 2: Algebra": ["Polynomials", "Pair of Linear Equations in Two Variables", "Quadratic Equations", "Arithmetic Progressions"],
        "Chapter 3: Coordinate Geometry": ["Coordinate Geometry"],
        "Chapter 4: Geometry": ["Triangles", "Circles"],
        "Chapter 5: Trigonometry": ["Introduction to Trigonometry", "Trigonometric Identities", "Heights and Distances"],
        "Chapter 6: Mensuration": ["Areas Related to Circles", "Surface Areas and Volumes"],
        "Chapter 7: Statistics and Probability": ["Statistics", "Probability"]
    },
    "Science": {
        "Chapter 1: Chemical Reactions and Equations": ["Types of Chemical Reactions", "Writing and Balancing Chemical Equations", "Effects of Oxidation and Reduction", "Types of Oxidizing and Reducing Agents"],
        "Chapter 2: Acids, Bases, and Salts": ["Properties of Acids and Bases", "pH Scale", "Uses of Acids and Bases"],
        "Chapter 3: Metals and Non-Metals": ["Properties of Metals and Non-Metals", "Reactivity Series of Metals", "Occurrence and Extraction of Metals", "Corrosion of Metals", "Uses of Metals and Non-Metals"],
        "Chapter 4: Carbon and Its Compounds": ["Covalent Bonding", "Homologous Series", "Saturated and Unsaturated Compounds", "Functional Groups", "Important Carbon Compounds and Their Uses"],
        "Chapter 5: Periodic Classification of Elements": ["Mendeleev's Periodic Table", "Modern Periodic Table", "Properties of Elements in Groups", "Properties of Elements in Periods"],
        "Chapter 6: Life Processes": ["Nutrition", "Respiration", "Excretion"],
        "Chapter 7: Control and Coordination": ["Nervous System", "Hormones"],
        "Chapter 8: How do Organisms Reproduce?": ["Modes of Reproduction", "Reproductive Health"],
        "Chapter 9: Heredity and Evolution": ["Mendel's Experiments", "Evolution Theories"],
        "Chapter 10: Light – Reflection and Refraction": ["Mirror & Lens Formulas", "Applications"],
        "Chapter 11: Human Eye and Colourful World": ["Human Eye", "Colourful World"],
        "Chapter 12: Electricity": ["Ohm's Law", "Series & Parallel Circuits"],
        "Chapter 13: Magnetic Effects of Electric Current": ["Electromagnetism", "Applications"],
        "Chapter 14: Sources of Energy": ["Conventional Sources of Energy", "Non-Conventional Sources of Energy"],
        "Chapter 15: Our Environment": ["Ecosystem", "Ozone Layer"],
        "Chapter 16: Sustainable Management of Natural Resources": ["Forest & Wildlife", "Water Management"]
    },
    "History": {
        "Chapter 1: The Rise of Nationalism in Europe": ["French Revolution and the idea of the nation", "The making of nationalism in Europe", "The age of revolutions: 1830–1848", "The making of Germany and Italy", "Visualising the nation– nationalism and imperialism"],
        "Chapter 2: Nationalism in India": ["First World War and nationalism in India", "The Non-Cooperation Movement", "Differing strands within the movement", "Civil Disobedience Movement", "The sense of collective belonging"],
        "Chapter 3: The Making of a Global World": ["The pre-modern world", "The nineteenth century (1815–1914)", "The inter-war economy", "Rebuilding a world economy: post–1945"],
        "Chapter 4: The Age of Industrialisation": ["Before the Industrial Revolution", "Hand labour and steam power", "Industrialisation in the colonies", "Factories come up", "The peculiarities of industrial growth", "Market for goods"],
        "Chapter 5: Print Culture and the Modern World": ["The first printed books", "Print comes to Europe", "The print revolution and its impact", "The reading mania", "The nineteenth century and print", "India and the world of print", "Religious reform and public debates", "New forms of publication and literature"]
    },
    "Geography": {
        "Chapter 1: Resources and Development": ["Types of resources– natural, human, sustainable", "Development of resources", "Resource planning in India", "Land resources and land use patterns", "Land degradation and conservation measures", "Soil as a resource– classification, distribution, conservation"],
        "Chapter 2: Forest and Wildlife Resources": ["Flora and fauna in India", "Types and distribution of forests", "Depletion of forests and conservation", "Forest conservation movements (Chipko, Beej Bachao Andolan)", "Government initiatives– IUCN, Indian Wildlife Protection Act"],
        "Chapter 3: Water Resources": ["Water scarcity and its causes", "Multipurpose river projects and integrated water resources management", "Rainwater harvesting"],
        "Chapter 4: Agriculture": ["Types of farming", "Cropping patterns (Kharif, Rabi, Zaid)", "Major crops (rice, wheat, maize, pulses, oilseeds, sugarcane, cotton, jute)", "Technological and institutional reforms", "Contribution of agriculture to the national economy"],
        "Chapter 5: Minerals and Energy Resources": ["Types of minerals and their distribution", "Uses of minerals", "Conventional sources of energy– coal, petroleum, natural gas, electricity", "Non-conventional sources of energy– solar, wind, tidal, geothermal, nuclear", "Conservation of energy resources"],
        "Chapter 6: Manufacturing Industries": ["Importance of manufacturing", "Industrial location factors", "Classification of industries (based on size, ownership, raw material, product)", "Major industries– cotton, jute, iron and steel, aluminium, chemical, fertiliser, cement, automobile, IT", "Industrial pollution and environmental degradation", "Control of environmental degradation"],
        "Chapter 7: Lifelines of National Economy": ["Roadways", "Railways", "Pipelines", "Waterways", "Airways", "Communication systems", "International trade"]
    },
    "Civics": {
        "Chapter 1: Power Sharing": ["Ethnic composition of Belgium and Sri Lanka", "Majoritarianism in Sri Lanka", "Accommodation in Belgium", "Why power sharing is desirable", "Forms of power sharing"],
        "Chapter 2: Federalism": ["What makes India a federal country", "Features of federalism", "Division of powers between Union and State", "Decentralisation in India– 73rd and 74th Amendments"],
        "Chapter 3: Gender, Religion and Caste": ["Gender and politics", "Religion and politics", "Caste and politics"],
        "Chapter 4: Political Parties": ["Why do we need political parties?", "Functions of political parties", "National parties and state parties", "Challenges to political parties", "How can parties be reformed?"],
        "Chapter 5: Outcomes of Democracy": ["How do we assess democracy's outcomes?", "Accountable, responsive and legitimate government", "Economic growth and development", "Reduction of inequality and poverty", "Accommodation of social diversity", "Dignity and freedom of the citizens"]
    },
    "Economics": {
        "Chapter 1: Development": ["What development promises– different people, different goals", "Income and other goals", "National development and per capita income", "Public facilities", "Sustainability of development"],
        "Chapter 2: Sectors of the Indian Economy": ["Primary, secondary and tertiary sectors", "Historical change in sectors", "Rising importance of tertiary sector", "Division of sectors as organised and unorganised", "Employment trends"],
        "Chapter 3: Money and Credit": ["Role of money in the economy", "Formal and informal sources of credit", "Self-Help Groups (SHGs)", "Credit and its terms"],
        "Chapter 4: Globalisation and the Indian Economy": ["Production across countries", "Interlinking of production across countries", "Foreign trade and integration of markets", "Globalisation and its impact", "Role of WTO", "Struggle for fair globalisation"],
        "Chapter 5: Consumer Rights": ["Consumer movement in India", "Consumer rights and duties", "Consumer awareness", "Role of consumer forums and NGOs"]
    }
}
}
# CBSE 7th–10th chapters (subtopics removed) for mocktest
CHAPTERS_SIMPLE = {
    "7th": {
        "Computers": [
            "Chapter 1: Programming Language",
            "Chapter 2: Editing Text in Microsoft Word",
            "Chapter 3: Microsoft PowerPoint",
            "Chapter 4: Basics of Microsoft Excel",
            "Chapter 5: Microsoft Access"
        ],
        "English": [
            "Unit 1: Learning Together",
            "Unit 2: Wit and Humour",
            "Unit 3: Dreams & Discoveries",
            "Unit 4: Travel and Adventure",
            "Unit 5: Bravehearts"
        ],
        "Maths": [
            "Chapter 1: Integers",
            "Chapter 2: Fractions and Decimals",
            "Chapter 3: Data Handling",
            "Chapter 4: Simple Equations",
            "Chapter 5: Lines and Angles",
            "Chapter 6: The Triangle and Its Properties",
            "Chapter 7: Comparing Quantities",
            "Chapter 8: Rational Numbers",
            "Chapter 9: Perimeter and Area",
            "Chapter 10: Algebraic Expressions",
            "Chapter 11: Exponents and Powers",
            "Chapter 12: Symmetry",
            "Chapter 13: Visualising Solid Shapes"
        ],
        "Science": [
            "Chapter1: Nutrition in Plants",
            "Chapter2: Nutrition in Animals",
            "Chapter3: Fibre to Fabric",
            "Chapter4: Heat",
            "Chapter5: Acids, Bases and Salts",
            "Chapter6: Physical and Chemical Changes",
            "Chapter7: Weather, Climate and Adaptations of Animals",
            "Chapter8: Winds, Storms and Cyclones",
            "Chapter9: Soil",
            "Chapter10: Respiration in Organisms",
            "Chapter11: Transportation in Animals and Plants",
            "Chapter12: Reproduction in Plants",
            "Chapter13: Motion and Time",
            "Chapter14: Electric Current and Its Effects",
            "Chapter15: Light",
            "Chapter16: Water: A Precious Resource",
            "Chapter17: Forests: Our Lifeline",
            "Chapter18: Wastewater Story"
        ],
        "History": [
            "Chapter 1: Tracing Changes through a Thousand Years",
            "Chapter 2: New Kings and Kingdoms",
            "Chapter 3: The Delhi Sultans (12th–15th Century)",
            "Chapter 4: The Mughal Empire (16th–17th Century)",
            "Chapter 5: Rulers and Buildings / Tribes, Nomads and Settled Communities",
            "Chapter 6: Devotional Paths to the Divine",
            "Chapter 7: The Making of Regional Cultures",
            "Chapter 8: Eighteenth Century Political Formations"
        ],
        "Civics": [
            "Chapter 1: On Equality",
            "Chapter 2: Role of the Government in Health",
            "Chapter 3: How the State Government Works",
            "Chapter 4: Growing up as Boys and Girls",
            "Chapter 5: Women Change the World",
            "Chapter 6: Understanding Media",
            "Chapter 7: Markets Around Us",
            "Chapter 8: A Shirt in the Market"
        ],
        "Geography": [
            "Chapter 1: Environment",
            "Chapter 2: Inside Our Earth",
            "Chapter 3: Our Changing Earth",
            "Chapter 4: Air",
            "Chapter 5: Water",
            "Chapter 6: Human-Environment Interactions– The Tropical and the Subtropical Region",
            "Chapter 7: Life in the Deserts"
        ]
    },
    "8th": {
        "Computers": [
            "Chapter 1: Exception Handling in Python",
            "Chapter 2: File Handling in Python",
            "Chapter 3: Stack (Data Structure)",
            "Chapter 4: Queue (Data Structure)",
            "Chapter 5: Sorting"
        ],
        "English": [
            "Unit1: Honeydew – Prose",
            "Unit2: Honeydew – Poems",
            "Unit3: It So Happened – Supplementary"
        ],
        "Maths": [
            "Chapter 1: Rational Numbers",
            "Chapter 2: Linear Equations in One Variable",
            "Chapter 3: Understanding Quadrilaterals",
            "Chapter 4: Data Handling",
            "Chapter 5: Squares and Square Roots",
            "Chapter 6: Cubes and Cube Roots",
            "Chapter 7: Comparing Quantities",
            "Chapter 8: Algebraic Expressions and Identities",
            "Chapter 9: Mensuration",
            "Chapter 10: Exponents and Powers",
            "Chapter 11: Direct and Inverse Proportions",
            "Chapter 12: Factorisation",
            "Chapter 13: Introduction to Graphs"
        ],
        "Science": [
            "Chapter 1: Crop Production and Management",
            "Chapter 2: Microorganisms: Friend and Foe",
            "Chapter 3: Synthetic Fibres and Plastics",
            "Chapter 4: Materials: Metals and Non-Metals",
            "Chapter 5: Coal and Petroleum",
            "Chapter 6: Combustion and Flame",
            "Chapter 7: Conservation of Plants and Animals",
            "Chapter 8: Cell – Structure and Functions",
            "Chapter 9: Reproduction in Animals",
            "Chapter 10: Force and Pressure",
            "Chapter 11: Friction",
            "Chapter 12: Sound",
            "Chapter 13: Chemical Effects of Electric Current",
            "Chapter 14: Some Natural Phenomena",
            "Chapter 15: Light",
            "Chapter 16: Stars and the Solar System",
            "Chapter 17: Pollution of Air and Water"
        ],
        "History": [
                "Chapter 1: How, When and Where",
                "Chapter 2: From Trade to Territory– The Company Establishes Power",
                "Chapter 3: Ruling the Countryside",
                "Chapter 4: Tribals, Dikus and the Vision of a Golden Age",
                "Chapter 5: When People Rebel– 1857 and After",
                "Chapter 6: Civilising the 'Native', Educating the Nation",
                "Chapter 7: Women, Caste and Reform",
                "Chapter 8: The Making of the National Movement: 1870s–1947"
            ],
        "Civics": [
                "Chapter 1: The Indian Constitution",
                "Chapter 2: Understanding Secularism",
                "Chapter 3: Parliament and the Making of Laws",
                "Chapter 4: Judiciary",
                "Chapter 5: Understanding Marginalisation",
                "Chapter 6: Confronting Marginalisation",
                "Chapter 7: Public Facilities",
                "Chapter 8: Law and Social Justice"
            ],
        "Geography": [
                "Chapter 1: Resources",
                "Chapter 2: Land, Soil, Water, Natural Vegetation and Wildlife Resources",
                "Chapter 3: Agriculture",
                "Chapter 4: Industries",
                "Chapter 5: Human Resources"
            ]
    },
    "9th": {
        "Computers": [
            "Chapter 1: Basics of Computer System",
            "Chapter 2: Types of Software",
            "Chapter 3: Operating System",
            "Chapter 4: Introduction to Python Programming",
            "Chapter 5: Introduction to Cyber Security"
        ],
        "English": [
            "Unit1: Beehive – Prose",
            "Unit2: Beehive – Poems",
            "Unit3: Moments – Supplementary"
        ],
        "Maths": [
            "Chapter 1 : Number System",
            "Chapter 2 : Algebra",
            "Chapter 3 : Coordinate Geometry",
            "Chapter 4 : Geometry",
            "Chapter 5 : Mensuration",
            "Chapter 6 : Statistics"
        ],
        "Science": [
            "Chapter 1 : Matter in Our Surroundings",
            "Chapter 2 :Is Matter Around Us Pure?",
            "Chapter 3 :Atoms and Molecules",
            "Chapter 4 :Structure of the Atom",
            "Chapter 5 :The Fundamental Unit of Life",
            "Chapter 6 :Tissues",
            "Chapter 7 :Diversity of the Living Organisms – I",
            "Chapter 8 :Diversity of the Living Organisms – II",
            "Chapter 9 :Diversity of the Living Organisms – III",
            "Chapter 10 :Motion",
            "Chapter 11 :Force and Laws of Motion",
            "Chapter 12 :Gravitation",
            "Chapter 13 :Work and Energy",
            "Chapter 14 :Sound",
            "Chapter 15 :Why Do We Fall Ill?",
            "Chapter 16 :Natural Resources",
            "Chapter 17 :Improvement in Food Resources"
        ],
        "History": [
            "Chapter 1: The French Revolution",
            "Chapter 2: Socialism in Europe and the Russian Revolution",
            "Chapter 3: Nazism and the Rise of Hitler",
            "Chapter 4: Forest Society and Colonialism",
            "Chapter 5: Pastoralists in the Modern World (Periodic Assessment only)"
        ],
        "Geography": [
            "Chapter 1: India– Size and Location",
            "Chapter 2: Physical Features of India",
            "Chapter 3: Drainage",
            "Chapter 4: Climate",
            "Chapter 5: Natural Vegetation and Wildlife",
            "Chapter 6: Population"
        ],
        "Civics": [
            "Chapter 1: What is Democracy? Why Democracy?",
            "Chapter 2: Constitutional Design",
            "Chapter 3: Electoral Politics",
            "Chapter 4: Working of Institutions",
            "Chapter 5: Democratic Rights"
        ],
        "Economics": [
            "Chapter 1: The Story of Village Palampur",
            "Chapter 2: People as Resource",
            "Chapter 3: Poverty as a Challenge",
            "Chapter 4: Food Security in India"
        ]
    },
    "10th": {
        "Computers": [
            "Chapter 1: Computer Fundamentals",
            "Chapter 2: Advanced GIMP (GNU Image Manipulation Program)",
            "Chapter 3: Tables (HTML)",
            "Chapter 4: Forms (HTML)",
            "Chapter 5: DHTML & CSS"
        ],
        "English": [
            "Unit 1:First Flight – Prose",
            "Unit 2:First Flight – Poems",
            "Unit 3:Footprints Without Feet – Supplementary"
        ],
        "Mathematics": [
            "Chapter 1: Number Systems",
            "Chapter 2: Algebra",
            "Chapter 3: Coordinate Geometry",
            "Chapter 4: Geometry",
            "Chapter 5: Trigonometry",
            "Chapter 6: Mensuration",
            "Chapter 7: Statistics and Probability"
        ],
        "Science": [
            "Chapter 1: Chemical Reactions and Equations",
            "Chapter 2: Acids, Bases, and Salts",
            "Chapter 3: Metals and Non-Metals",
            "Chapter 4: Carbon and Its Compounds",
            "Chapter 5: Periodic Classification of Elements",
            "Chapter 6: Life Processes",
            "Chapter 7: Control and Coordination",
            "Chapter 8: How do Organisms Reproduce?",
            "Chapter 9: Heredity and Evolution",
            "Chapter 10: Light – Reflection and Refraction",
            "Chapter 11: Human Eye and Colourful World",
            "Chapter 12: Electricity",
            "Chapter 13: Magnetic Effects of Electric Current",
            "Chapter 14: Sources of Energy",
            "Chapter 15: Our Environment",
            "Chapter 16: Sustainable Management of Natural Resources"
        ],
        "History": [
            "Chapter 1: The Rise of Nationalism in Europe",
            "Chapter 2: Nationalism in India",
            "Chapter 3: The Making of a Global World",
            "Chapter 4: The Age of Industrialisation",
            "Chapter 5: Print Culture and the Modern World"
        ],
        "Geography": [
            "Chapter 1: Resources and Development",
            "Chapter 2: Forest and Wildlife Resources",
            "Chapter 3: Water Resources",
            "Chapter 4: Agriculture",
            "Chapter 5: Minerals and Energy Resources",
            "Chapter 6: Manufacturing Industries",
            "Chapter 7: Lifelines of National Economy"
        ],
        "Civics": [
            "Chapter 1: Power Sharing",
            "Chapter 2: Federalism",
            "Chapter 3: Gender, Religion and Caste",
            "Chapter 4: Political Parties",
            "Chapter 5: Outcomes of Democracy"
        ],
        "Economics": [
            "Chapter 1: Development",
            "Chapter 2: Sectors of the Indian Economy",
            "Chapter 3: Money and Credit",
            "Chapter 4: Globalisation and the Indian Economy",
            "Chapter 5: Consumer Rights"
        ]
    }
}
MAX_PREVIOUS_QUESTIONS = 100
PREVIOUS_QUESTIONS_QUICK = {}
PREVIOUS_QUESTIONS_MOCK = {}
# Language instruction mapping
LANGUAGE_INSTRUCTIONS = {
    "English": "Generate all questions and options in English.",
    "Telugu": "Generate all questions and options in Telugu language (తెలుగు). Use Telugu script.",
    "Hindi": "Generate all questions and options in Hindi language (हिंदी). Use Devanagari script.",
    "Tamil": "Generate all questions and options in Tamil language (தமிழ்). Use Tamil script.",
    "Kannada": "Generate all questions and options in Kannada language (ಕನ್ನಡ). Use Kannada script.",
    "Malayalam": "Generate all questions and options in Malayalam language (മലയാളം). Use Malayalam script."
}
# Quick Practice Endpoints
@app.get("/classes")
def get_classes():
    logger.info("Fetching available classes")
    return JSONResponse(content={"classes": list(CHAPTERS_DETAILED.keys())})
@app.get("/chapters")
def get_subjects(class_name: str):
    logger.info(f"Fetching subjects for class: {class_name}")
    subjects = CHAPTERS_DETAILED.get(class_name)
    if not subjects:
        logger.error(f"Invalid class: {class_name}")
        raise HTTPException(status_code=400, detail="Invalid class")
    return JSONResponse(content={"chapters": list(subjects.keys())})
@app.get("/subtopics")
def get_subtopics(class_name: str, subject: str):
    logger.info(f"Fetching subtopics for class: {class_name}, subject: {subject}")
    subjects = CHAPTERS_DETAILED.get(class_name)
    if not subjects or subject not in subjects:
        logger.error(f"Invalid subject: {subject} or class: {class_name}")
        raise HTTPException(status_code=400, detail="Invalid subject or class")
    subtopics = subjects[subject]
    return JSONResponse(content={"subtopics": subtopics})
@app.get("/quiz")
def get_quiz(
    subtopic: str,
    retry: bool = False,
    currentLevel: int = None,
    language: str = "English",
    class_name: str = None,
    subject: str = None
):
    try:
        previous = PREVIOUS_QUESTIONS_QUICK.get(subtopic, []) if not retry else []
        # Use the level from frontend if provided
        if currentLevel is not None:
            current_level = currentLevel
        else:
            # fallback if frontend doesn't provide level
            num_prev = len(previous)
            if num_prev == 0:
                current_level = 1
            elif num_prev == 1:
                current_level = 2
            else:
                current_level = 3
        difficulty_map = {1: "simple", 2: "medium", 3: "hard"}
        difficulty = difficulty_map.get(current_level, "simple")
        logger.info(f"Generating quiz for subtopic: {subtopic}, difficulty: {difficulty}, retry: {retry}, level: {current_level}, language: {language}, class_name: {class_name}, subject: {subject}")
     
        # Check if client is available
        if client is None:
            logger.error("OpenAI client not available - cannot generate quiz")
            return JSONResponse(content={"error": "AI service unavailable", "currentLevel": current_level, "quiz": []}, status_code=503)
     
        # Get language instruction
        language_instruction = LANGUAGE_INSTRUCTIONS.get(language, LANGUAGE_INSTRUCTIONS["English"])
        
        # CRITICAL: Build subject context for the prompt to ensure correct subject questions
        subject_context = ""
        if subject and class_name:
            subject_context = f"\n\nCRITICAL SUBJECT CONTEXT - READ CAREFULLY:\n- This quiz is for {subject} subject in {class_name} class.\n- ALL questions MUST be related to {subject} ONLY.\n- Do NOT generate questions from other subjects like English, Science, History, Civics, Geography, Economics, Computers, etc.\n- The subtopic '{subtopic}' belongs to {subject}, so generate questions ONLY about {subject} topics.\n- If the subtopic seems ambiguous, interpret it STRICTLY in the context of {subject} subject.\n- For example, if subject is Mathematics, generate math questions only. If subject is English, generate English questions only.\n"
        elif subject:
            subject_context = f"\n\nCRITICAL SUBJECT CONTEXT - READ CAREFULLY:\n- This quiz is for {subject} subject.\n- ALL questions MUST be related to {subject} ONLY.\n- Do NOT generate questions from other subjects.\n- Generate questions ONLY about {subject} topics.\n"
        
        prompt = f"""
        Generate 10 multiple-choice questions for "{subtopic}"{f" in {subject} subject" if subject else ""}{f" for {class_name} class" if class_name else ""}.
        Difficulty: {difficulty}.
        {language_instruction}
        {subject_context}
        IMPORTANT INSTRUCTIONS:
        - ALL questions, options, and content MUST be in {language} language only.
        - Do NOT mix English with the target language.
        - Use proper script for the selected language.
        - Avoid repeating these questions: {previous}.
        - CRITICAL: Generate questions ONLY for {subject if subject else "the specified subject"}. Do NOT generate questions from other subjects.
     
        IMPORTANT FORMAT REQUIREMENTS:
        - Each question should have exactly 4 options as an array: ["option1", "option2", "option3", "option4"]
        - The answer should be the actual text of the correct option, NOT a letter
        - Each question MUST include a "hint" field that provides a helpful hint without revealing the answer
        - Return ONLY a JSON array with keys: question, options (array), answer (actual option text), hint
     
        Example format (in {language}):
        [
          {{
            "question": "[Question text in {language} related to {subject if subject else 'the topic'}]",
            "options": ["[Option 1 in {language}]", "[Option 2 in {language}]", "[Option 3 in {language}]", "[Option 4 in {language}]"],
            "answer": "[Correct option text in {language}]",
            "hint": "[Helpful hint in {language} that guides the student without revealing the answer]"
          }}
        ]
     
        HINT GUIDELINES:
        - Hints should be educational and guiding, not direct answers
        - Provide clues about the concept or approach to solve
        - Mention relevant formulas or concepts to consider
        - Suggest steps to think through the problem
        - Keep hints concise and helpful
        """
        
        try:
            response = client.chat.completions.create(
            model="google/gemini-2.0-flash-001",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.9
        )
        except Exception as api_error:
            logger.error(f"API call failed: {api_error}")
            return JSONResponse(content={"error": f"AI service error: {str(api_error)}", "currentLevel": current_level, "quiz": []}, status_code=500)
        message_content = response.choices[0].message.content
        text = ""
        if isinstance(message_content, list):
            for block in message_content:
                if block.get("type") == "text":
                    text += block.get("text", "")
        else:
            text = str(message_content)
        # Clean up markdown code blocks if present
        text = text.strip()
        if text.startswith("```json"):
            text = text[7:].strip()
        if text.endswith("```"):
            text = text[:-3].strip()
        try:
            quiz_json = json.loads(text)
        except json.JSONDecodeError:
            match = re.search(r'\[.*\]', text, re.DOTALL)
            if not match:
                logger.error(f"AI did not return valid JSON: {text[:200]}")
                return JSONResponse(content={"error": f"AI did not return valid JSON: {text[:200]}", "currentLevel": current_level, "quiz": []}, status_code=500)
            try:
                quiz_json = json.loads(match.group(0))
            except json.JSONDecodeError:
                logger.error(f"Failed to parse JSON even after extraction: {text[:200]}")
                return JSONResponse(content={"error": "Failed to parse quiz data from AI response", "currentLevel": current_level, "quiz": []}, status_code=500)
        # Process and validate the quiz
        processed_quiz = []
        for q in quiz_json:
            if not all(key in q for key in ["question", "options", "answer"]):
                continue
             
            # Ensure options is a list with exactly 4 items
            if not isinstance(q["options"], list) or len(q["options"]) != 4:
                continue
             
            # Ensure the answer exists in the options
            if q["answer"] not in q["options"]:
                # Try to fix by finding the closest match
                continue
         
            # Ensure hint field exists, if not create a default one
            if "hint" not in q:
                q["hint"] = f"Think about the key concepts related to {subtopic} and consider what makes this question unique."
             
            processed_quiz.append(q)
        # Shuffle the quiz questions
        random.shuffle(processed_quiz)
     
        # Shuffle options while preserving correct answer
        for q in processed_quiz:
            # Create a mapping of original positions
            original_options = q["options"].copy()
            correct_answer = q["answer"]
         
            # Shuffle the options
            random.shuffle(q["options"])
         
            # The answer remains the same text, not the position
            # This ensures the answer is always the correct option text
         
        if not retry:
            PREVIOUS_QUESTIONS_QUICK[subtopic] = previous + [q["question"] for q in processed_quiz]
        logger.info(f"Generated {len(processed_quiz)} questions for subtopic: {subtopic} in {language}")
     
        return JSONResponse(content={
            "currentLevel": current_level,
            "quiz": processed_quiz
        })
    except Exception as e:
        logger.error(f"Error generating quiz: {str(e)}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        return JSONResponse(content={"error": str(e), "currentLevel": 1, "quiz": []}, status_code=500)
# AI Assistant Endpoints
def _classify_question_type(question: str) -> str:
    """Classify the type of question for better response handling"""
    question_lower = question.lower()
 
    if any(word in question_lower for word in ['study plan', 'schedule', 'timetable', 'how to study', 'plan']):
        return "study_plan"
    elif any(word in question_lower for word in ['notes', 'summary', 'key points', 'important points', 'write down']):
        return "notes"
    elif any(word in question_lower for word in ['explain', 'what is', 'how does', 'why', 'meaning', 'define']):
        return "explanation"
    elif any(word in question_lower for word in ['practice', 'exercise', 'question', 'problem', 'solve', 'worksheet']):
        return "practice"
    elif any(word in question_lower for word in ['related', 'connect', 'application', 'real world', 'where used']):
        return "related_concepts"
    elif any(word in question_lower for word in ['example', 'examples', 'sample']):
        return "examples"
    else:
        return "general"
# AI Assistant Endpoints
@app.post("/ai-assistant/chat")
async def ai_assistant_chat(request: ChatRequest):
    try:
        class_level = request.class_level
        subject = request.subject
        chapter = request.chapter
        student_question = request.student_question
        chat_history = request.chat_history or []
     
        # Get language preference
        language = "English"
     
        # Enhanced prompt with better formatting instructions
        prompt = f"""
        You are an AI Learning Assistant for a {class_level} student studying {subject}, specifically chapter: {chapter}.
     
        Student's Question: "{student_question}"
     
        Previous conversation context: {chat_history[-5:] if chat_history else "No previous context"}
     
        Based on the student's question, provide a helpful, educational response with EXCELLENT STRUCTURE and CHILD-FRIENDLY formatting.
     
        **CRITICAL FORMATTING RULES:**
        1. Use CLEAR HEADINGS with emojis
        2. Use BULLET POINTS and NUMBERED LISTS
        3. Use SIMPLE LANGUAGE for children
        4. Add VISUAL SEPARATORS like lines between sections
        5. Use LARGE FONT indicators for important points
        6. Include PRACTICAL EXAMPLES
        7. Add SUMMARY TABLES where helpful
        8. Use COLOR INDICATORS (🔴 🟢 🔵 🟡)
     
        **RESPONSE TYPES:**
     
        1. STUDY PLAN Response Structure:
           🗓️ WEEKLY STUDY PLAN
           ───────────────────
           📅 Day 1: [Topic]
           • Time: [Duration]
           • Activities: [List]
           • Practice: [Specific tasks]
           ───────────────────
         
        2. NOTES Response Structure:
           📚 CHAPTER NOTES
           ───────────────
           🔹 Key Concept 1
           • Definition: [Simple definition]
           • Example: [Real-world example]
           • Remember: [Important point]
           ───────────────
         
        3. EXPLANATION Response Structure:
           💡 CONCEPT EXPLANATION
           ────────────────────
           🎯 What is it?
           [Simple definition]
         
           👀 How it works:
           [Step-by-step]
         
           🌍 Real Example:
           [Child-friendly example]
           ────────────────────
         
        4. PRACTICE QUESTIONS Structure:
           📝 PRACTICE TIME
           ───────────────
           🟢 EASY Question:
           [Question]
         
           🟡 MEDIUM Question:
           [Question]
         
           🔴 CHALLENGE Question:
           [Question]
         
           ✅ SOLUTIONS:
           [Step-by-step solutions]
           ───────────────
     
        Make it VISUALLY APPEALING and EASY TO READ for a child!
        """
     
        response = client.chat.completions.create(
            model="google/gemini-2.0-flash-001",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
     
        message_content = response.choices[0].message.content
        text = ""
        if isinstance(message_content, list):
            for block in message_content:
                if block.get("type") == "text":
                    text += block.get("text", "")
        else:
            text = str(message_content)
     
        return JSONResponse(content={
            "success": True,
            "response": text,
            "type": _classify_question_type(student_question)
        })
     
    except Exception as e:
        logger.error(f"Error in AI assistant: {str(e)}")
        return JSONResponse(content={
            "success": False,
            "response": "I apologize, but I'm having trouble processing your request right now. Please try again.",
            "type": "error"
        }, status_code=500)
@app.post("/ai-assistant/generate-study-plan")
async def generate_study_plan(request: StudyPlanRequest):
    """Generate a detailed study plan for a specific chapter"""
    try:
        class_level = request.class_level
        subject = request.subject
        chapter = request.chapter
        days_available = request.days_available
        hours_per_day = request.hours_per_day
     
        prompt = f"""
        Create a SUPER STRUCTURED and CHILD-FRIENDLY {days_available}-day study plan for a {class_level} student studying {subject}, chapter: {chapter}.
     
        **FORMATTING REQUIREMENTS:**
     
        🗓️ {days_available}-DAY STUDY PLAN FOR {chapter.upper()}
        ═══════════════════════════════════════
     
        📊 QUICK OVERVIEW:
        • Total Days: {days_available}
        • Daily Study: {hours_per_day} hours
        • Subject: {subject}
        • Chapter: {chapter}
     
        📅 DAILY BREAKDOWN:
        ───────────────────
     
        DAY 1: [Main Topic]
        🕐 Time: [Specific time allocation]
        📚 What to Study:
        • Topic 1: [Details]
        • Topic 2: [Details]
        ✍️ Practice:
        • [Specific practice tasks]
        ✅ Check: [Self-check points]
     
        DAY 2: [Main Topic]
        🕐 Time: [Specific time allocation]
        📚 What to Study:
        • Topic 1: [Details]
        • Topic 2: [Details]
        ✍️ Practice:
        • [Specific practice tasks]
        ✅ Check: [Self-check points]
     
        🎯 WEEKLY GOALS:
        • Goal 1: [Specific achievement]
        • Goal 2: [Specific achievement]
     
        💡 STUDY TIPS:
        • Tip 1: [Practical tip]
        • Tip 2: [Practical tip]
     
        Make it COLORFUL and EASY TO FOLLOW for a child!
        Use EMOJIS and CLEAR SECTIONS!
        """
     
        response = client.chat.completions.create(
            model="google/gemini-2.0-flash-001",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
     
        message_content = response.choices[0].message.content
        text = str(message_content) if not isinstance(message_content, list) else message_content[0].get("text", "")
     
        return JSONResponse(content={
            "success": True,
            "study_plan": text
        })
     
    except Exception as e:
        logger.error(f"Error generating study plan: {str(e)}")
        return JSONResponse(content={
            "success": False,
            "study_plan": "Unable to generate study plan at this time."
        }, status_code=500)
@app.post("/ai-assistant/generate-notes")
async def generate_notes(request: NotesRequest):
    """Generate comprehensive notes for a chapter or specific topic"""
    try:
        class_level = request.class_level
        subject = request.subject
        chapter = request.chapter
        specific_topic = request.specific_topic
     
        topic_specific = f" on {specific_topic}" if specific_topic else ""
     
        prompt = f"""
        Generate SUPER ORGANIZED and CHILD-FRIENDLY study notes for a {class_level} student studying {subject}, chapter: {chapter}{topic_specific}.
     
        **REQUIRED FORMAT:**
     
        📚 {chapter.upper()} - STUDY NOTES
        ═══════════════════════════
     
        🎯 CHAPTER AT A GLANCE:
        • Main Topics: [List 3-4 main topics]
        • Key Skills: [What they'll learn]
        • Difficulty: 🟢 Easy / 🟡 Medium / 🔴 Hard
     
        🔍 KEY CONCEPTS:
        ─────────────────
     
        🔹 Concept 1: [Concept Name]
        • What it is: [Simple definition]
        • Example: 🌟 [Real example]
        • Remember: 💡 [Key point]
        • Formula: 📐 [If applicable]
     
        🔹 Concept 2: [Concept Name]
        • What it is: [Simple definition]
        • Example: 🌟 [Real example]
        • Remember: 💡 [Key point]
        • Formula: 📐 [If applicable]
     
        📋 IMPORTANT POINTS TABLE:
        ─────────────────────────
        | Point | Description | Remember |
        |-------|-------------|----------|
        | [1] | [Description] | [Memory tip] |
        | [2] | [Description] | [Memory tip] |
     
        💪 PRACTICE READY:
        • Quick Questions: [2-3 simple questions]
        • Think About: [1 critical thinking question]
     
        📝 SUMMARY:
        • Main Idea 1: [Summary point]
        • Main Idea 2: [Summary point]
        • Main Idea 3: [Summary point]
     
        Use LOTS OF EMOJIS, CLEAR SECTIONS, and CHILD-FRIENDLY LANGUAGE!
        Make it VISUALLY APPEALING!
        """
     
        response = client.chat.completions.create(
            model="google/gemini-2.0-flash-001",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
     
        message_content = response.choices[0].message.content
        text = str(message_content) if not isinstance(message_content, list) else message_content[0].get("text", "")
     
        return JSONResponse(content={
            "success": True,
            "notes": text
        })
     
    except Exception as e:
        logger.error(f"Error generating notes: {str(e)}")
        return JSONResponse(content={
            "success": False,
            "notes": "Unable to generate notes at this time."
        }, status_code=500)
# Overview Endpoint
@app.post("/ai-assistant/generate-overview")
async def generate_overview(request: OverviewRequest):
    """Generate a comprehensive overview for a chapter or specific topic"""
    try:
        class_level = request.class_level
        subject = request.subject
        chapter = request.chapter
        specific_topic = request.specific_topic
       
        topic_specific = f" on {specific_topic}" if specific_topic else ""
       
        prompt = f"""
        Generate a COMPREHENSIVE and CHILD-FRIENDLY overview for a {class_level} student studying {subject}, chapter: {chapter}{topic_specific}.
       
        **REQUIRED FORMAT:**
       
        📖 {chapter.upper()} - TOPIC OVERVIEW
        ═══════════════════════════════
       
        🎯 QUICK SUMMARY:
        • Main Focus: [What this chapter/topic is about]
        • Key Learning: [What students will understand]
        • Real-world Connection: [How this applies to daily life]
       
        🔍 WHAT YOU'LL LEARN:
        ────────────────────
       
        📚 Core Concepts:
        • Concept 1: [Brief explanation]
        • Concept 2: [Brief explanation]
        • Concept 3: [Brief explanation]
       
        🛠️ Important Skills:
        • Skill 1: [What they'll be able to do]
        • Skill 2: [Practical application]
       
        💡 KEY TAKEAWAYS:
        • Takeaway 1: [Most important point]
        • Takeaway 2: [Key understanding]
        • Takeaway 3: [Essential knowledge]
       
        🌟 WHY THIS MATTERS:
        • Real-life Application: [How this knowledge is used]
        • Future Learning: [How this connects to next topics]
        • Everyday Use: [Practical examples]
       
        📝 STUDY TIPS:
        • Tip 1: [How to study this effectively]
        • Tip 2: [Common mistakes to avoid]
        • Tip 3: [Memory techniques if applicable]
       
        Use EMOJIS, CLEAR SECTIONS, and SIMPLE LANGUAGE that a {class_level} grade student can understand!
        Make it VISUALLY APPEALING and MOTIVATIONAL!
        """
       
        response = client.chat.completions.create(
            model="google/gemini-2.0-flash-001",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
       
        message_content = response.choices[0].message.content
        text = str(message_content) if not isinstance(message_content, list) else message_content[0].get("text", "")
       
        return JSONResponse(content={
            "success": True,
            "overview": text
        })
       
    except Exception as e:
        logger.error(f"Error generating overview: {str(e)}")
        return JSONResponse(content={
            "success": False,
            "overview": "Unable to generate overview at this time."
        }, status_code=500)
# Explanation Endpoint for Quiz and Mock Test Results
def translate_explanation(explanation: str, language: str) -> str:
    """Translate explanation to the target language if needed."""
    if language in ["English", "Kannada"]:
        return explanation  # No translation needed for English or Kannada (as per user spec, only Tamil, Malayalam, Telugu, Hindi)

    translation_prompt = f"""
    Translate the following educational explanation to {language} language accurately, maintaining the educational tone and simplicity for students. Use proper script for {language}.

    Original: {explanation}

    Provide ONLY the translated text, nothing else.
    """

    try:
        response = client.chat.completions.create(
            model="google/gemini-2.0-flash-001",
            messages=[{"role": "user", "content": translation_prompt}],
            temperature=0.3,
            max_tokens=150
        )
        message_content = response.choices[0].message.content
        translated = str(message_content) if not isinstance(message_content, list) else message_content[0].get("text", "")
        return translated.strip()
    except Exception as e:
        logger.error(f"Translation error: {str(e)}")
        return explanation  # Fallback to original

# def generate_single_explanation(question_data, context, language: str = "English"):
#     """Generate explanation for a single question synchronously, with translation support"""
#     question = question_data.get("question", "")
#     correct_answer = question_data.get("correct_answer", "")
#     user_answer = question_data.get("user_answer", "")
#     options = question_data.get("options", [])
#     i = question_data.get("index", 0)  # Add index to question_data
   
#     prompt = f"""
#     {context}
   
#     Generate a concise 3-4 line explanation ONLY for why the correct answer is right for this question. Keep it directly related to the question's content and chapter concepts. Do NOT explain wrong answers or include any other details.
   
#     QUESTION: {question}
   
#     OPTIONS:
#     {chr(65)}. {options[0] if len(options) > 0 else 'N/A'}
#     {chr(66)}. {options[1] if len(options) > 1 else 'N/A'}
#     {chr(67)}. {options[2] if len(options) > 2 else 'N/A'}
#     {chr(68)}. {options[3] if len(options) > 3 else 'N/A'}
   
#     CORRECT ANSWER: {correct_answer}
   
#     Provide ONLY a 3-4 line explanation focused on the correct answer, using simple language for students.
#     """
   
#     try:
#         response = client.chat.completions.create(
#             model="google/gemini-2.0-flash-001",
#             messages=[{"role": "user", "content": prompt}],
#             temperature=0.7,
#             max_tokens=100  # Reduced for faster response
#         )
       
#         message_content = response.choices[0].message.content
#         explanation = str(message_content) if not isinstance(message_content, list) else message_content[0].get("text", "")
       
#         # Translate if needed
#         explanation = translate_explanation(explanation, language)
       
#         return {
#             "question_index": i,
#             "question": question,
#             "correct_answer": correct_answer,
#             "user_answer": user_answer,
#             "explanation": explanation,
#             "is_correct": user_answer == correct_answer
#         }
#     except Exception as e:
#         logger.error(f"Error generating explanation for question {i}: {str(e)}")
#         fallback_explanation = "The correct answer aligns with the key concept in this chapter; review the main ideas to understand why."
#         fallback_explanation = translate_explanation(fallback_explanation, language)
#         return {
#             "question_index": i,
#             "question": question,
#             "correct_answer": correct_answer,
#             "user_answer": user_answer,
#             "explanation": fallback_explanation,
#             "is_correct": user_answer == correct_answer
#         }



def generate_single_explanation(question_data, context):

    """Generate explanation for a single question synchronously IN ENGLISH ONLY"""

    question = question_data.get("question", "")

    correct_answer = question_data.get("correct_answer", "")

    user_answer = question_data.get("user_answer", "")

    options = question_data.get("options", [])

    i = question_data.get("index", 0)

    # 🔴 ENHANCED PROMPT TO FORCE ENGLISH EXPLANATIONS

    prompt = f"""

    {context}

    IMPORTANT: You MUST provide the explanation in ENGLISH language only. Do not translate the question or answers.

    Generate a concise 3-4 line explanation ONLY for why the correct answer is right for this question.

    Keep it directly related to the question's content and chapter concepts.

    Do NOT explain wrong answers or include any other details.

    QUESTION: {question}

    OPTIONS:

    {chr(65)}. {options[0] if len(options) > 0 else 'N/A'}

    {chr(66)}. {options[1] if len(options) > 1 else 'N/A'}

    {chr(67)}. {options[2] if len(options) > 2 else 'N/A'}

    {chr(68)}. {options[3] if len(options) > 3 else 'N/A'}

    CORRECT ANSWER: {correct_answer}

    Provide ONLY a 3-4 line explanation in ENGLISH focused on the correct answer, using simple language for students.

    EXPLANATION (ENGLISH ONLY):

    """

    try:

        response = client.chat.completions.create(

            model="google/gemini-2.0-flash-001",

            messages=[{"role": "user", "content": prompt}],

            temperature=0.7,

            max_tokens=100  # Reduced for faster response

        )

        message_content = response.choices[0].message.content

        explanation = str(message_content) if not isinstance(message_content, list) else message_content[0].get("text", "")

        # 🔴 VALIDATE AND ENFORCE ENGLISH

        explanation = ensure_english_explanation(explanation, correct_answer)

        logger.info(f"✅ Generated ENGLISH explanation for question {i + 1}")

        return {

            "question_index": i,

            "question": question,

            "correct_answer": correct_answer,

            "user_answer": user_answer,

            "explanation": explanation,

            "is_correct": user_answer == correct_answer

        }

    except Exception as e:

        logger.error(f"Error generating explanation for question {i}: {str(e)}")

        # 🔴 ENGLISH FALLBACK

        return {

            "question_index": i,

            "question": question,

            "correct_answer": correct_answer,

            "user_answer": user_answer,

            "explanation": f"The correct answer '{correct_answer}' is right because it aligns with the fundamental concepts from this chapter that students need to understand.",  # ENGLISH

            "is_correct": user_answer == correct_answer

        }
 
# 🔴 NEW FUNCTION TO ENSURE ENGLISH EXPLANATIONS

def ensure_english_explanation(explanation, correct_answer):

    """Ensure the explanation is in English, provide fallback if not"""

    if not explanation or explanation.strip() == "":

        return f"The correct answer '{correct_answer}' demonstrates proper understanding of the key concepts being tested in this question."

    # Check for non-English characters

    if has_non_english_characters(explanation):

        logger.warning("Non-English characters detected in explanation, using English fallback")

        return f"The correct answer '{correct_answer}' is accurate because it reflects the core principles and learning objectives covered in this chapter."

    # Ensure explanation is meaningful (not just "correct answer is X")

    if len(explanation.strip()) < 20 or "correct answer is" in explanation.lower() and len(explanation) < 50:

        return f"The correct answer '{correct_answer}' is right because it applies the main concepts from this chapter that are essential for academic success."

    return explanation.strip()
 
# 🔴 FUNCTION TO DETECT NON-ENGLISH CHARACTERS

def has_non_english_characters(text):

    """Detect if text contains non-English characters"""

    if not text:

        return False

    # Common non-English Unicode ranges

    non_english_ranges = [

        (0x0900, 0x097F),  # Devanagari (Hindi, Sanskrit)

       

        (0x0B80, 0x0BFF),  # Tamil

        (0x0C00, 0x0C7F),  # Telugu

        (0x0C80, 0x0CFF),  # Kannada

        (0x0D00, 0x0D7F),  # Malayalam

                (0x0B80, 0x0BFF),  # Tamil
    ]

    for char in text:

        code_point = ord(char)

        # Check if character is outside basic ASCII and in non-English ranges

        if code_point > 127:

            for start, end in non_english_ranges:

                if start <= code_point <= end:

                    return True

    return False
 
@app.post("/generate-explanations")

async def generate_explanations(request: ExplanationRequest):

    """Generate detailed explanations for quiz/mock test questions IN ENGLISH ONLY"""

    try:

        questions = request.questions

        class_level = request.class_level

        subject = request.subject

        chapter = request.chapter

        # 🔴 GET LANGUAGE PARAMETERS AND FORCE ENGLISH

        language = getattr(request, 'language', 'en')

        explanation_language = getattr(request, 'explanation_language', 'en')

        # 🔴 FORCE ENGLISH EXPLANATIONS

        logger.info(f"🔴 FORCING ENGLISH EXPLANATIONS - Requested: {language}, Using: English")

        # Build context string WITH ENGLISH ENFORCEMENT

        context = ""

        if class_level and subject and chapter:

            context = f"This question is from {class_level} grade {subject} - Chapter: {chapter}. Provide the explanation in ENGLISH language only. Focus on key concepts from this chapter and explain why the correct answer is right."

        else:

            context = "Provide the explanation in ENGLISH language only. Explain why the correct answer is right based on standard educational principles."

        logger.info(f"Generating ENGLISH explanations for {len(questions)} questions")

        # Prepare question data with index

        question_data_list = []

        for i, q in enumerate(questions):

            q_copy = q.copy()

            q_copy["index"] = i

            question_data_list.append(q_copy)

        explanations = []

        # Use ThreadPoolExecutor for parallel execution

        max_workers = min(10, len(question_data_list))

        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:

            # Submit all tasks WITH ENGLISH CONTEXT

            future_to_index = {

                executor.submit(generate_single_explanation, qd, context): qd["index"]

                for qd in question_data_list

            }

            # Collect results as they complete

            for future in concurrent.futures.as_completed(future_to_index):

                try:

                    result = future.result()

                    explanations.append(result)

                except Exception as exc:

                    index = future_to_index[future]

                    logger.error(f"Explanation for question {index} generated an exception: {exc}")

                    # Add ENGLISH fallback

                    q = questions[index]

                    explanations.append({

                        "question_index": index,

                        "question": q.get("question", ""),

                        "correct_answer": q.get("correct_answer", ""),

                        "user_answer": q.get("user_answer", ""),

                        "explanation": f"The correct answer is '{q.get('correct_answer', '')}'. This question tests important concepts that are fundamental to understanding this topic. Review the chapter materials for better comprehension.",  # ENGLISH

                        "is_correct": q.get("user_answer", "") == q.get("correct_answer", "")

                    })

        # Sort explanations by question_index to maintain order

        explanations.sort(key=lambda x: x["question_index"])

        # 🔴 LOG TO CONFIRM ENGLISH EXPLANATIONS

        english_count = 0

        for exp in explanations[:3]:  # Check first 3 explanations

            sample = exp['explanation'][:100] + '...' if len(exp['explanation']) > 100 else exp['explanation']

            logger.info(f"🔴 ENGLISH EXPLANATION SAMPLE {exp['question_index'] + 1}: {sample}")

            if any(word in exp['explanation'].lower() for word in ['correct', 'answer', 'because', 'explanation']):

                english_count += 1

        return JSONResponse(content={

            "success": True,

            "explanations": explanations,

            "language_used": "en",  # 🔴 CONFIRM ENGLISH

            "message": "All explanations generated in English"

        })

    except Exception as e:

        logger.error(f"Error in generate_explanations: {str(e)}")

        return JSONResponse(content={

            "success": False,

            "error": str(e),

            "explanations": []

        }, status_code=500)
 



# Mock Test Endpoints
@app.get("/mock_classes")
def get_mock_classes():
    logger.info("Fetching available classes for mock test")
    return JSONResponse(content={"classes": list(CHAPTERS_SIMPLE.keys())})
@app.get("/mock_subjects")
def get_mock_subjects(class_name: str):
    logger.info(f"Fetching subjects for class: {class_name}")
    subjects = CHAPTERS_SIMPLE.get(class_name)
    if not subjects:
        logger.error(f"Invalid class: {class_name}")
        raise HTTPException(status_code=400, detail="Invalid class")
    return JSONResponse(content={"subjects": list(subjects.keys())})
@app.get("/mock_chapters")
def get_mock_chapters(class_name: str, subject: str):
    logger.info(f"Fetching chapters for class: {class_name}, subject: {subject}")
    subjects = CHAPTERS_SIMPLE.get(class_name)
    if not subjects or subject not in subjects:
        logger.error(f"Invalid subject: {subject} or class: {class_name}")
        raise HTTPException(status_code=400, detail="Invalid subject or class")
    chapters = subjects[subject]
    if isinstance(chapters, dict):
        chapters = [chapter for sublist in chapters.values() for chapter in sublist]
    return JSONResponse(content={"chapters": chapters})
@app.get("/mock_test")
def get_mock_test(
    class_name: str,
    subject: str,
    chapter: str,
    retry: bool = False,
    language: str = "English"
):
    try:
        previous = PREVIOUS_QUESTIONS_MOCK.get(chapter, []) if not retry else []
        
        # Automatic difficulty progression
        num_prev = len(previous)
        if num_prev == 0:
            current_level = 1
            difficulty = "simple"
        elif num_prev == 1:
            current_level = 2
            difficulty = "medium"
        else:
            current_level = 3
            difficulty = "hard"
     
        logger.info(f"Generating mock test for class: {class_name}, subject: {subject}, chapter: {chapter}, difficulty: {difficulty}, language: {language}, retry: {retry}")
        subjects = CHAPTERS_SIMPLE.get(class_name)
        if not subjects or subject not in subjects:
            logger.error(f"Invalid subject: {subject} or class: {class_name}")
            raise HTTPException(status_code=400, detail="Invalid subject or class")
        chapters = subjects[subject]
        if isinstance(chapters, dict):
            for key, chapter_list in chapters.items():
                if chapter in chapter_list:
                    break
            else:
                logger.error(f"Invalid chapter: {chapter} for subject: {subject}")
                raise HTTPException(status_code=400, detail="Invalid chapter")
        elif chapter not in chapters:
            logger.error(f"Invalid chapter: {chapter} for subject: {subject}")
            raise HTTPException(status_code=400, detail="Invalid chapter")
        if len(previous) > MAX_PREVIOUS_QUESTIONS:
            previous = previous[-MAX_PREVIOUS_QUESTIONS:]
            logger.info(f"Truncated previous questions for chapter: {chapter} to {MAX_PREVIOUS_QUESTIONS}")
        # Get language instruction
        language_instruction = LANGUAGE_INSTRUCTIONS.get(language, LANGUAGE_INSTRUCTIONS["English"])
        prompt = f"""
        Generate 50 multiple-choice questions for "{chapter}" in {subject} for class {class_name}.
        Difficulty: {difficulty}.
        {language_instruction}
     
        IMPORTANT INSTRUCTIONS:
        - ALL questions, options, and content MUST be in {language} language only.
        - Do NOT mix English with the target language.
        - Use proper script for the selected language.
        - Avoid repeating these questions: {previous}.
        - If you cannot generate all 50 unique questions, repeat some of the previous ones with slight modifications in wording, structure, or numerical values instead of adding placeholder questions.
        FORMAT REQUIREMENTS:
        - Each question must have exactly 4 options as a JSON object {{"A": "option text", "B": "another option", "C": "third option", "D": "fourth option"}}.
        - The answer must be the label "A", "B", "C", or "D".
        - Each question MUST include a "hint" field that provides a helpful hint without revealing the answer
        - Return ONLY a JSON array of objects with keys: question, options, answer, hint
     
        Example format (in {language}):
        [
          {{
            "question": "[Question text in {language}]",
            "options": {{
              "A": "[Option A in {language}]",
              "B": "[Option B in {language}]",
              "C": "[Option C in {language}]",
              "D": "[Option D in {language}]"
            }},
            "answer": "C",
            "hint": "[Helpful hint in {language} that guides the student without revealing the answer]"
          }}
        ]
     
        HINT GUIDELINES:
        - Hints should be educational and guiding, not direct answers
        - Provide clues about the concept or approach to solve
        - Mention relevant formulas or concepts to consider
        - Suggest steps to think through the problem
        - Keep hints concise and helpful for exam preparation
        """
        # Check if client is available
        if client is None:
            logger.error("OpenAI client not available - cannot generate mock test")
            return JSONResponse(content={
                "error": "AI service unavailable. Please check the API configuration.",
                "currentLevel": current_level,
                "quiz": []
            }, status_code=503)
        
        logger.info(f"Sending prompt to AI for chapter: {chapter} in {language}")
        
        # Collect all questions from potentially multiple API calls
        all_questions = []
        remaining_questions = 50
        
        # Make multiple API calls if needed to get all 50 questions
        max_attempts = 5  # Increased to 5 attempts to ensure we get 50 questions
        attempt = 0
        
        while remaining_questions > 0 and attempt < max_attempts:
            attempt += 1
            # Request more questions per batch to account for parsing/validation failures
            # Add buffer of 30% more questions than needed, but cap at 25 to avoid truncation
            buffer_questions = max(5, int(remaining_questions * 0.3))
            questions_to_generate = min(remaining_questions + buffer_questions, 25)  # Increased to 25 with buffer
            
            # Adjust prompt for remaining questions
            if attempt > 1:
                # Build subject context string
                subject_context_str = f"This is a {subject} mock test for class {class_name}. All questions must be strictly related to the subject {subject} and the chapter '{chapter}'."
                
                current_prompt = f"""Generate EXACTLY {questions_to_generate} unique multiple-choice questions for a mock test on the chapter "{chapter}" from the subject "{subject}" for class "{class_name}".

CONTEXT: {subject_context_str}

IMPORTANT: 
- Generate EXACTLY {questions_to_generate} questions (not more, not less)
- These are questions {50 - remaining_questions + 1} to {50 - remaining_questions + questions_to_generate} of a 50-question mock test
- Do NOT repeat questions from the previous batch
- Each question must be unique and directly related to "{chapter}"

REQUIREMENTS:
- Difficulty: {difficulty}
- Language: {language}
- Each question must test understanding of concepts from "{chapter}"
- If you cannot generate all {questions_to_generate} unique questions, repeat some with slight modifications in wording, structure, or numerical values.

FORMAT: Return ONLY a JSON array with {questions_to_generate} question objects. Each object must have: question, options (dict with A/B/C/D), answer (A/B/C/D), hint.

Example format:
[
  {{
    "question": "[Question text in {language}]",
    "options": {{"A": "[Option A]", "B": "[Option B]", "C": "[Option C]", "D": "[Option D]"}},
    "answer": "C",
    "hint": "[Helpful hint in {language}]"
  }}
]"""
            else:
                current_prompt = prompt
            
            try:
                # Use max_tokens based on number of questions needed
                # Estimate: ~50-70 tokens per question, but be more generous to avoid truncation
                estimated_tokens = questions_to_generate * 70  # 70 tokens per question for safety
                max_tokens_value = min(estimated_tokens, 2500)  # Increased cap to 2500 to allow more questions
                
                response = client.chat.completions.create(
                    model="google/gemini-2.0-flash-001",
                    messages=[{"role": "user", "content": current_prompt}],
                    temperature=0.9,
                    max_tokens=max_tokens_value
                )
                logger.info(f"✅ Mock test API call {attempt} successful with max_tokens={max_tokens_value}, requesting {questions_to_generate} questions")
                
                # Process response from this API call
                try:
                    if not hasattr(response, 'choices') or not response.choices:
                        logger.error(f"Mock test API call {attempt} response has no choices")
                        if attempt == 1:
                            return JSONResponse(content={
                                "error": "Invalid response from AI service. No choices returned.",
                                "currentLevel": current_level,
                                "quiz": []
                            }, status_code=500)
                        continue
                    
                    if not hasattr(response.choices[0], 'message') or not hasattr(response.choices[0].message, 'content'):
                        logger.error(f"Mock test API call {attempt} response message structure is invalid")
                        if attempt == 1:
                            return JSONResponse(content={
                                "error": "Invalid response structure from AI service.",
                                "currentLevel": current_level,
                                "quiz": []
                            }, status_code=500)
                        continue
                    
                    message_content = response.choices[0].message.content
                    
                    if message_content is None:
                        logger.error(f"Mock test API call {attempt} response content is None")
                        if attempt == 1:
                            return JSONResponse(content={
                                "error": "AI service returned empty content. Please try again.",
                                "currentLevel": current_level,
                                "quiz": []
                            }, status_code=500)
                        continue
                    
                    text = ""
                    if isinstance(message_content, list):
                        for block in message_content:
                            if isinstance(block, dict) and block.get("type") == "text":
                                text += block.get("text", "")
                            elif isinstance(block, str):
                                text += block
                    else:
                        text = str(message_content)
                    
                    if not text or not text.strip():
                        logger.error(f"Extracted text is empty for mock test attempt {attempt}")
                        if attempt == 1:
                            return JSONResponse(content={
                                "error": "AI service returned empty content. Please try again.",
                                "currentLevel": current_level,
                                "quiz": []
                            }, status_code=500)
                        continue
                    
                    # Clean up markdown code blocks if present
                    text = text.strip()
                    if text.startswith("```json"):
                        text = text[7:].strip()
                    elif text.startswith("```"):
                        text = text[3:].strip()
                    if text.endswith("```"):
                        text = text[:-3].strip()
                    
                    # Log the actual text we're trying to parse (important for debugging)
                    logger.info(f"📄 Attempt {attempt} - Text length: {len(text)} chars")
                    logger.info(f"📄 Attempt {attempt} - First 800 chars: {text[:800]}")
                    logger.info(f"📄 Attempt {attempt} - Last 500 chars: {text[-500:] if len(text) > 500 else text}")
                    
                    # Count question markers in text
                    question_count_in_text = text.count('"question"')
                    logger.info(f"📊 Attempt {attempt} - Found {question_count_in_text} 'question' markers in text")
                    
                    # Try to parse JSON
                    quiz_json = None
                    try:
                        quiz_json = json.loads(text)
                        logger.info(f"✅ Successfully parsed JSON directly for attempt {attempt}")
                    except json.JSONDecodeError as json_err:
                        logger.warning(f"⚠️ Direct JSON parse failed for attempt {attempt}: {json_err}")
                        error_pos = json_err.pos if hasattr(json_err, 'pos') else None
                        logger.warning(f"   Error position: {error_pos}")
                        logger.warning(f"   Trying to extract JSON array from text...")
                        
                        # Strategy: Try to parse up to the error position, or find last complete question
                        quiz_json = None
                        
                        # If we know where the error is, try to parse up to that point
                        if error_pos and error_pos < len(text):
                            logger.info(f"   Trying to parse text up to error position {error_pos}...")
                            # Find the last complete question before the error
                            # Look backwards from error_pos for last complete closing brace
                            truncated_text = text[:error_pos]
                            
                            # Find last complete question object ending before error
                            last_complete_brace = truncated_text.rfind('}')
                            if last_complete_brace > 0:
                                # Find the start of the array
                                array_start = truncated_text.find('[')
                                if array_start >= 0:
                                    # Try to close the array properly
                                    partial_array = truncated_text[array_start:]
                                    # Find all complete question objects
                                    # Count complete braces before error
                                    brace_count = 0
                                    last_valid_pos = array_start
                                    in_string = False
                                    escape_next = False
                                    
                                    for i in range(len(partial_array)):
                                        char = partial_array[i]
                                        if escape_next:
                                            escape_next = False
                                            continue
                                        if char == '\\':
                                            escape_next = True
                                            continue
                                        if char == '"' and not escape_next:
                                            in_string = not in_string
                                            continue
                                        if not in_string:
                                            if char == '{':
                                                brace_count += 1
                                            elif char == '}':
                                                brace_count -= 1
                                                if brace_count == 0:
                                                    # Found complete object
                                                    last_valid_pos = array_start + i + 1
                                    
                                    if last_valid_pos > array_start:
                                        # Extract up to last complete object and close the array
                                        partial_array_fixed = partial_array[:last_valid_pos - array_start] + ']'
                                        try:
                                            quiz_json = json.loads(partial_array_fixed)
                                            logger.info(f"✅ Successfully parsed truncated JSON (up to position {last_valid_pos}, {len(quiz_json)} questions, attempt {attempt})")
                                        except json.JSONDecodeError as trunc_err:
                                            logger.warning(f"   Truncated parse failed: {trunc_err}, will try other strategies")
                                            pass
                        
                        # Use the same parsing strategies as before if above didn't work
                        if not quiz_json:
                            match = None
                            match = re.search(r'\[.*\]', text, re.DOTALL)
                            if not match:
                                match = re.search(r'\[.*?\]', text, re.DOTALL)
                            
                            if match:
                                try:
                                    quiz_json = json.loads(match.group(0))
                                    logger.info(f"✅ Successfully extracted and parsed JSON array (strategy 1, attempt {attempt})")
                                except json.JSONDecodeError:
                                    # Try object extraction strategy with robust handling for unterminated strings
                                    logger.warning(f"   Trying to extract individual questions from text (attempt {attempt})...")
                                    quiz_json = []
                                    seen_qs = set()
                                    
                                    i = 0
                                    while i < len(text):
                                        obj_start = text.find('{', i)
                                        if obj_start == -1:
                                            break
                                        
                                        next_quote = text.find('"question"', obj_start, min(obj_start + 300, len(text)))
                                        if next_quote == -1:
                                            i = obj_start + 1
                                            continue
                                        
                                        # Try to find the end of this object, handling unterminated strings
                                        brace_count = 0
                                        obj_end = -1
                                        in_string = False
                                        escape_next = False
                                        last_valid_pos = obj_start
                                        
                                        for j in range(obj_start, len(text)):
                                            char = text[j]
                                            if escape_next:
                                                escape_next = False
                                                continue
                                            if char == '\\':
                                                escape_next = True
                                                continue
                                            if char == '"' and not escape_next:
                                                in_string = not in_string
                                                continue
                                            
                                            if not in_string:
                                                if char == '{':
                                                    brace_count += 1
                                                elif char == '}':
                                                    brace_count -= 1
                                                    if brace_count == 0:
                                                        obj_end = j + 1
                                                        last_valid_pos = j + 1
                                                        break
                                                    # Track position when we close inner braces
                                                    if brace_count == 1:
                                                        last_valid_pos = j + 1
                                                elif brace_count == 1 and char in [',', '\n']:
                                                    # Track positions after commas/newlines at top level
                                                    last_valid_pos = j
                                        
                                        # If we didn't find a closing brace but were in a valid object
                                        if obj_end == -1 and brace_count > 0:
                                            # Try to use the last valid position (before unterminated string)
                                            # Look backwards from end for last complete property
                                            search_end = min(obj_start + 8000, len(text))  # Search up to 8000 chars
                                            search_text = text[obj_start:search_end]
                                            
                                            # Find the last occurrence of patterns like: "answer": "X",
                                            # or closing brace of options object
                                            last_complete = search_text.rfind('"answer"')
                                            if last_complete > 0:
                                                # Find the closing quote and comma/brace after answer
                                                answer_end = search_text.find(',', last_complete)
                                                answer_brace = search_text.find('}', last_complete)
                                                if answer_end > 0 or answer_brace > 0:
                                                    potential_end = last_complete + 200  # Give some room
                                                    # Try to find a reasonable end point
                                                    for pattern in ['",\n', '", ', '"\n', '"\r']:
                                                        pos = search_text.rfind(pattern, last_complete, potential_end)
                                                        if pos > last_complete:
                                                            obj_end = obj_start + pos + len(pattern)
                                                            # Try to close the object
                                                            obj_end = search_text.find('}', obj_end - obj_start) + obj_start
                                                            if obj_end > obj_start:
                                                                break
                                            
                                            if obj_end == -1 and last_valid_pos > obj_start:
                                                # Use last valid position and try to close the object
                                                obj_end = last_valid_pos
                                        
                                        if obj_end > obj_start:
                                            try:
                                                obj_str = text[obj_start:obj_end]
                                                
                                                # Handle unterminated strings by closing them at word boundaries
                                                # Find unclosed quotes and close them before the next property or brace
                                                open_quote_pos = -1
                                                new_str = ""
                                                in_str = False
                                                esc = False
                                                for k, ch in enumerate(obj_str):
                                                    if esc:
                                                        esc = False
                                                        new_str += ch
                                                        continue
                                                    if ch == '\\':
                                                        esc = True
                                                        new_str += ch
                                                        continue
                                                    if ch == '"' and not esc:
                                                        if not in_str:
                                                            open_quote_pos = k
                                                            in_str = True
                                                        else:
                                                            open_quote_pos = -1
                                                            in_str = False
                                                        new_str += ch
                                                    else:
                                                        new_str += ch
                                                
                                                # If we have an unterminated string, try to close it before the end
                                                if open_quote_pos >= 0:
                                                    # Find where the string value likely ends (before next : or ,)
                                                    remaining = obj_str[open_quote_pos+1:]
                                                    # Look for natural break points
                                                    for break_char in ['\n', ',', '}', ':', '\r']:
                                                        break_pos = remaining.find(break_char)
                                                        if break_pos > 0:
                                                            # Close the string before this character
                                                            obj_str = obj_str[:open_quote_pos+1] + remaining[:break_pos] + '"' + remaining[break_pos:]
                                                            break
                                                
                                                open_braces = obj_str.count('{') - obj_str.count('}')
                                                if open_braces > 0:
                                                    obj_str += '}' * open_braces
                                                
                                                # Remove trailing commas
                                                obj_str = re.sub(r',(\s*[}\]])', r'\1', obj_str)
                                                
                                                # Try to parse
                                                q_obj = json.loads(obj_str)
                                                if isinstance(q_obj, dict) and "question" in q_obj and "options" in q_obj and "answer" in q_obj:
                                                    question_text = q_obj.get('question', '').strip()
                                                    if question_text and question_text not in seen_qs:
                                                        seen_qs.add(question_text)
                                                        quiz_json.append(q_obj)
                                                        logger.info(f"   ✅ Extracted question {len(quiz_json)} from attempt {attempt}")
                                            except Exception as extract_err:
                                                # Try a more lenient approach - extract fields manually using regex
                                                try:
                                                    # Extract question field - handle unterminated strings
                                                    # Look for "question": "text (may not have closing quote)
                                                    q_match = re.search(r'"question"\s*:\s*"([^"]*(?:"|$))', obj_str)
                                                    if not q_match:
                                                        # Try without closing quote (unterminated string)
                                                        q_match = re.search(r'"question"\s*:\s*"([^"]{10,})', obj_str)
                                                    
                                                    if q_match:
                                                        question_text = q_match.group(1).strip().rstrip('"')
                                                        if not question_text:
                                                            continue
                                                        
                                                        # Try to extract options - handle nested braces and unterminated strings
                                                        opts_match = re.search(r'"options"\s*:\s*\{([^{}]*\{[^{}]*\}[^{}]*|.*?)\}', obj_str, re.DOTALL)
                                                        if not opts_match:
                                                            # Try without closing brace (unterminated)
                                                            opts_match = re.search(r'"options"\s*:\s*\{([^{}]*\{[^{}]*\}.*?)', obj_str, re.DOTALL)
                                                        
                                                        # Try to extract answer
                                                        ans_match = re.search(r'"answer"\s*:\s*"([^"]*(?:"|$))', obj_str)
                                                        if not ans_match:
                                                            ans_match = re.search(r'"answer"\s*:\s*"([A-D])', obj_str)
                                                        
                                                        if opts_match and ans_match:
                                                            # Build a minimal valid question object
                                                            # Parse options manually
                                                            opts_str = opts_match.group(1)
                                                            opts_dict = {}
                                                            # Try to extract option pairs, handling unterminated strings
                                                            for opt_label in ['A', 'B', 'C', 'D']:
                                                                opt_pattern = f'"{opt_label}"\\s*:\\s*"([^"]*(?:"|$|,|\\}}))'
                                                                opt_match = re.search(opt_pattern, opts_str)
                                                                if opt_match:
                                                                    opt_value = opt_match.group(1).strip().rstrip('"').rstrip(',').rstrip('}')
                                                                    if opt_value:
                                                                        opts_dict[opt_label] = opt_value
                                                            
                                                            answer_val = ans_match.group(1).strip().rstrip('"')
                                                            
                                                            # Validate we have at least 2 options and a valid answer
                                                            if len(opts_dict) >= 2 and answer_val in opts_dict and question_text and question_text not in seen_qs:
                                                                # If we don't have all 4 options, fill with placeholders (better than nothing)
                                                                for opt_label in ['A', 'B', 'C', 'D']:
                                                                    if opt_label not in opts_dict:
                                                                        opts_dict[opt_label] = f"Option {opt_label}"
                                                                
                                                                seen_qs.add(question_text)
                                                                quiz_json.append({
                                                                    "question": question_text,
                                                                    "options": opts_dict,
                                                                    "answer": answer_val,
                                                                    "hint": f"Consider the main concepts from {chapter}."
                                                                })
                                                                logger.info(f"   ✅ Extracted question {len(quiz_json)} via regex fallback (attempt {attempt})")
                                                except Exception as regex_err:
                                                    # Silently continue - this object is too malformed
                                                    pass
                                    
                                    i = obj_end if obj_end > obj_start else obj_start + 1
                                
                                if quiz_json:
                                    logger.info(f"✅ Successfully extracted {len(quiz_json)} questions (strategy 3, attempt {attempt})")
                        
                        # If still no questions, try direct regex extraction from entire text
                        if not quiz_json:
                            logger.warning(f"   Object extraction failed, trying direct regex extraction from text...")
                            try:
                                # Log a sample of the text to understand structure
                                logger.info(f"   Text sample (first 1000 chars): {text[:1000]}")
                                logger.info(f"   Text sample (last 500 chars): {text[-500:] if len(text) > 500 else text}")
                                
                                # Try to extract all question objects using regex - very permissive
                                # Strategy: Find all occurrences of "question" in the text and extract surrounding context
                                
                                question_blocks = []
                                
                                # First, try to find question objects with braces
                                matches1 = list(re.finditer(r'\{[^{]*"question"[^}]*\{[^}]*\}[^}]*"answer"', text, re.DOTALL))
                                question_blocks.extend(matches1)
                                
                                # If that doesn't work, try simpler pattern
                                if not question_blocks:
                                    matches2 = list(re.finditer(r'\{[^}]{20,}?"question"[^}]{20,}?"answer"', text, re.DOTALL))
                                    question_blocks.extend(matches2)
                                
                                # If still nothing, find by scanning for question patterns directly
                                if not question_blocks:
                                    question_positions = list(re.finditer(r'"question"', text))
                                    if question_positions:
                                        logger.info(f"   Found {len(question_positions)} 'question' patterns, extracting context...")
                                        for q_pos_match in question_positions:
                                            q_start_idx = q_pos_match.start()
                                            # Go back to find opening brace
                                            context_start = max(0, q_start_idx - 200)
                                            context_end = min(len(text), q_start_idx + 2000)
                                            context_text = text[context_start:context_end]
                                            
                                            # Find opening brace in context
                                            obj_start = context_text.rfind('{', 0, q_start_idx - context_start)
                                            if obj_start >= 0:
                                                # Extract block from opening brace to reasonable end
                                                block_extract = context_text[obj_start:]
                                                # Try to find end (look for patterns like }, or end of context)
                                                block_end_candidates = [
                                                    block_extract.find('},\n'),
                                                    block_extract.find('},\r'),
                                                    block_extract.find('},"'),
                                                    min(len(block_extract), 1500)  # Max 1500 chars per block
                                                ]
                                                block_end = min([x for x in block_end_candidates if x > 0] or [len(block_extract)])
                                                block_text = block_extract[:block_end+1] if block_end < len(block_extract) else block_extract
                                                question_blocks.append((q_start_idx, block_text))
                                
                                logger.info(f"   Found {len(question_blocks)} potential question blocks")
                                
                                for block_item in question_blocks:
                                    try:
                                        # Handle both regex match objects and tuples
                                        if isinstance(block_item, tuple):
                                            block_text = block_item[1]
                                        elif hasattr(block_item, 'group'):
                                            block_text = block_item.group(0)
                                        else:
                                            block_text = str(block_item)
                                        
                                        # Extract question text - very permissive
                                        q_match = re.search(r'"question"\s*:\s*"((?:[^"\\]|\\.|"(?!")){10,}?)', block_text, re.DOTALL)
                                        if not q_match:
                                            # Try even more permissive - just find text after "question":
                                            q_match = re.search(r'"question"\s*:\s*"([^"]{10,})', block_text)
                                        
                                        if q_match:
                                            question_text = q_match.group(1).strip()
                                            # Clean up escapes and extra quotes
                                            question_text = question_text.replace('\\"', '"').replace('\\n', ' ').strip().rstrip('"')
                                            
                                            # If question is truncated (ends abruptly), try to find where it should end
                                            if not question_text or len(question_text) < 10:
                                                continue
                                            
                                            # Check if question might be truncated - if it doesn't end with punctuation
                                            # This is OK, just continue
                                            
                                            # Extract options - find patterns like "A": "text", "B": "text", etc.
                                            # Search in block_text and also in wider context if needed
                                            opts_dict = {}
                                            
                                            # Also search in original text around this block for options
                                            if isinstance(block_item, tuple):
                                                search_start = max(0, block_item[0] - 500)
                                                search_end = min(len(text), block_item[0] + 2500)
                                                search_text = text[search_start:search_end]
                                            else:
                                                search_text = block_text
                                            
                                            for opt_label in ['A', 'B', 'C', 'D']:
                                                # Try multiple patterns - search in both block and wider context
                                                patterns = [
                                                    f'"{opt_label}"\\s*:\\s*"((?:[^"\\\\]|\\\\.){{3,}}?)"',
                                                    f'"{opt_label}"\\s*:\\s*"([^"]{{3,}}?)"',
                                                    f'"{opt_label}"\\s*:\\s*"([^"]*(?:"|,|\\}}|\\n))',
                                                    f'"{opt_label}"\\s*:\\s*"([^"]*)',  # Very permissive - no closing quote needed
                                                ]
                                                for pattern in patterns:
                                                    opt_match = re.search(pattern, search_text, re.DOTALL)
                                                    if not opt_match:
                                                        opt_match = re.search(pattern, block_text, re.DOTALL)
                                                    if opt_match:
                                                        opt_value = opt_match.group(1).strip()
                                                        # Clean up the value - handle unterminated strings
                                                        opt_value = opt_value.replace('\\"', '"').replace('\\n', ' ').replace('\\r', ' ')
                                                        # Remove trailing characters that indicate end
                                                        opt_value = opt_value.rstrip('"').rstrip(',').rstrip('}').rstrip(']').rstrip('\n').rstrip('\r').strip()
                                                        
                                                        # If value looks truncated (ends abruptly without punctuation), try to fix it
                                                        # Look for common truncation patterns and remove trailing garbage
                                                        if opt_value:
                                                            # Remove anything after common truncation markers
                                                            truncation_markers = [',', '}', ']', '\n', '"']
                                                            for marker in truncation_markers:
                                                                if marker in opt_value[-20:]:
                                                                    # Find last occurrence and truncate there
                                                                    last_pos = opt_value.rfind(marker)
                                                                    if last_pos > len(opt_value) * 0.5:  # Only if in second half
                                                                        opt_value = opt_value[:last_pos].strip()
                                                                        break
                                                        
                                                        # If it still looks like it was cut off, find natural break point
                                                        if opt_value and (',' in opt_value[-30:] or '}' in opt_value[-30:] or opt_value[-1].islower() and len(opt_value) > 20):
                                                            # Likely has trailing garbage, find last reasonable sentence/word boundary
                                                            # Try to find last complete word
                                                            words = opt_value.split()
                                                            if len(words) > 1:
                                                                # Check if last word is incomplete (very short or doesn't end properly)
                                                                last_word = words[-1]
                                                                if len(last_word) < 3 or (last_word[-1].islower() and len(last_word) < 5):
                                                                    # Remove last word if it looks incomplete
                                                                    opt_value = ' '.join(words[:-1])
                                                                else:
                                                                    # Take first reasonable number of words
                                                                    opt_value = ' '.join(words[:12])
                                                        
                                                        if opt_value and len(opt_value) > 2:
                                                            opts_dict[opt_label] = opt_value
                                                            break
                                            
                                            # Extract answer - also search in wider context
                                            ans_match = re.search(r'"answer"\s*:\s*"([A-D])', search_text)
                                            if not ans_match:
                                                ans_match = re.search(r'"answer"\s*:\s*"([A-D])', block_text)
                                            if not ans_match:
                                                ans_match = re.search(r'"answer"\s*:\s*"([^"]{1,3})', search_text)
                                            if not ans_match:
                                                ans_match = re.search(r'"answer"\s*:\s*"([^"]{1,3})', block_text)
                                            
                                            if ans_match and len(opts_dict) >= 2:
                                                answer_val = ans_match.group(1).strip().rstrip('"').upper()
                                                
                                                # Ensure we have A, B, C, D and answer is valid
                                                if answer_val not in opts_dict and answer_val in ['A', 'B', 'C', 'D']:
                                                    # Answer might be a label, check if we have that option
                                                    if len(opts_dict) < 4:
                                                        # Fill missing options
                                                        for opt in ['A', 'B', 'C', 'D']:
                                                            if opt not in opts_dict:
                                                                opts_dict[opt] = f"Option {opt}"
                                                elif answer_val not in ['A', 'B', 'C', 'D']:
                                                    # Try to match answer to an option value
                                                    answer_val = None
                                                    for key, val in opts_dict.items():
                                                        if ans_match.group(1).strip().lower() in val.lower()[:20]:
                                                            answer_val = key
                                                            break
                                                    if not answer_val:
                                                        answer_val = list(opts_dict.keys())[0]  # Default to first option
                                                
                                                if answer_val and answer_val in opts_dict and question_text not in seen_qs:
                                                    # Fill missing options if needed
                                                    for opt in ['A', 'B', 'C', 'D']:
                                                        if opt not in opts_dict:
                                                            opts_dict[opt] = f"Option {opt}"
                                                    
                                                    seen_qs.add(question_text)
                                                    quiz_json.append({
                                                        "question": question_text,
                                                        "options": opts_dict,
                                                        "answer": answer_val,
                                                        "hint": f"Consider the main concepts from {chapter}."
                                                    })
                                                    logger.info(f"   ✅ Extracted question {len(quiz_json)} via direct regex (attempt {attempt})")
                                    except Exception as block_err:
                                        # Continue to next block
                                        continue
                                
                                if quiz_json:
                                    logger.info(f"✅ Successfully extracted {len(quiz_json)} questions via direct regex (attempt {attempt})")
                            except Exception as regex_direct_err:
                                logger.warning(f"   Direct regex extraction also failed: {regex_direct_err}")
                        
                        if not quiz_json:
                            logger.error(f"❌ Could not parse JSON for attempt {attempt} after all strategies")
                            logger.error(f"   Text length: {len(text)} chars")
                            logger.error(f"   Question markers found: {text.count('\"question\"')}")
                            logger.error(f"   Answer markers found: {text.count('\"answer\"')}")
                            logger.error(f"   Options markers found: {text.count('\"options\"')}")
                            # Don't skip yet - try one more time with even more aggressive extraction
                            if question_count_in_text > 0:
                                logger.warning(f"   ⚠️ Found {question_count_in_text} question markers but couldn't parse - will skip this batch")
                            continue
                    
                        if not isinstance(quiz_json, list):
                            logger.warning(f"⚠️ AI response is not a list for attempt {attempt}, will skip")
                            continue
                    
                        # Process questions from this batch
                        processed_batch = []
                        logger.info(f"📊 Processing {len(quiz_json)} questions from attempt {attempt}")
                        for idx, q in enumerate(quiz_json):
                            try:
                                if not isinstance(q, dict):
                                    continue
                                    
                                if not all(key in q for key in ["question", "options", "answer"]):
                                    continue
                                
                                # Handle options
                                if isinstance(q["options"], list):
                                    if len(q["options"]) != 4:
                                        continue
                                    q["options"] = {chr(65 + i): opt for i, opt in enumerate(q["options"])}
                                elif isinstance(q["options"], dict):
                                    if len(q["options"]) != 4:
                                        continue
                                else:
                                    continue
                                
                                # Validate answer
                                if q["answer"] not in q["options"]:
                                    answer_found = False
                                    for key, value in q["options"].items():
                                        if str(q["answer"]).strip() == str(value).strip() or str(q["answer"]).upper() == key:
                                            q["answer"] = key
                                            answer_found = True
                                            break
                                    if not answer_found:
                                        continue
                                
                                # Ensure hint field exists
                                if "hint" not in q or not q["hint"]:
                                    q["hint"] = f"Consider the main concepts from {chapter} and think about what distinguishes the correct answer from others."
                                
                                # Shuffle options while preserving correct answer
                                items = list(q["options"].items())
                                random.shuffle(items)
                                new_options = {}
                                new_answer = None
                                for new_idx, (old_label, text_opt) in enumerate(items):
                                    new_label = chr(65 + new_idx)
                                    new_options[new_label] = text_opt
                                    if old_label == q["answer"]:
                                        new_answer = new_label
                                
                                if new_answer is None:
                                    continue
                                
                                q["options"] = new_options
                                q["answer"] = new_answer
                                processed_batch.append(q)
                            except Exception as q_err:
                                logger.warning(f"Error processing question {idx} in attempt {attempt}: {q_err}")
                                continue
                    
                        logger.info(f"✅ Successfully processed {len(processed_batch)} valid questions from attempt {attempt}")
                    
                    # Add questions from this batch to the collection
                    all_questions.extend(processed_batch)
                    remaining_questions = 50 - len(all_questions)
                    
                    logger.info(f"   📊 Progress: {len(all_questions)}/50 questions collected from attempt {attempt}. Remaining: {remaining_questions}")
                    
                    # If we got enough questions, break
                    if remaining_questions <= 0:
                        logger.info(f"✅ Successfully collected all 50 questions!")
                        break
                    
                    # If we still need more questions and haven't hit max attempts, continue
                    if remaining_questions > 0 and attempt < max_attempts:
                        logger.info(f"   Making another API call for {remaining_questions} more questions...")
                
                except Exception as parse_error:
                    logger.error(f"❌ Error parsing response from attempt {attempt}: {parse_error}")
                    if attempt == 1 and len(all_questions) == 0:
                        return JSONResponse(content={
                            "error": f"Error processing AI response: {str(parse_error)[:200]}",
                            "currentLevel": current_level,
                            "quiz": []
                        }, status_code=500)
                    # Continue to next attempt if we already have some questions
                    continue
                    
            except Exception as api_error:
                # Error handling for this attempt
                error_code = None
                error_body = None
                error_dict = None
                
                # Try to extract status code from various error attributes
                if hasattr(api_error, 'status_code'):
                    error_code = api_error.status_code
                elif hasattr(api_error, 'code'):
                    error_code = api_error.code
                
                # Try to extract error body/response
                if hasattr(api_error, 'response'):
                    try:
                        if hasattr(api_error.response, 'text'):
                            error_body = api_error.response.text
                        elif hasattr(api_error.response, 'json'):
                            error_dict = api_error.response.json()
                            error_body = str(error_dict)
                        else:
                            error_body = str(api_error.response)
                    except:
                        pass
                
                # Try to extract error from body if it's a dict
                if error_dict and isinstance(error_dict, dict):
                    if 'error' in error_dict and isinstance(error_dict['error'], dict):
                        if 'code' in error_dict['error']:
                            error_code = error_dict['error']['code']
                        if 'message' in error_dict['error']:
                            error_body = str(error_dict['error']['message'])
                
                error_msg = str(api_error)
                error_repr = repr(api_error)
                error_lower = error_msg.lower()
                error_body_lower = (error_body or "").lower()
                
                logger.error(f"❌ Mock test API call failed: {api_error}")
                logger.error(f"   Error type: {type(api_error).__name__}")
                if error_code:
                    logger.error(f"   Error status code: {error_code}")
                if error_body:
                    logger.error(f"   Error body: {error_body[:200]}")
                
                # Handle 402 Payment Required error - comprehensive detection
                is_402_error = (
                    error_code == 402 or
                    "402" in error_msg or "402" in error_repr or "402" in (error_body or "") or
                    "payment required" in error_lower or "payment required" in error_body_lower or
                    "credits" in error_lower or "credits" in error_body_lower or
                    "can only afford" in error_lower or "can only afford" in error_body_lower or
                    "requires more credits" in error_lower or "requires more credits" in error_body_lower or
                    "fewer max_tokens" in error_lower or "fewer max_tokens" in error_body_lower
                )
                
                if is_402_error:
                    logger.error("   → ✅ Detected 402 Payment Required error - returning 402 status")
                    return JSONResponse(content={
                        "error": "Insufficient API credits. Please add credits to your OpenRouter account to generate mock tests. Visit https://openrouter.ai/settings/credits",
                        "currentLevel": current_level,
                        "quiz": []
                    }, status_code=402)
                
                # Handle other API errors
                logger.error(f"   → Other API error - returning 500: {error_msg[:200]}")
                return JSONResponse(content={
                    "error": f"AI service error: {error_msg[:200]}",
                    "currentLevel": current_level,
                    "quiz": []
                }, status_code=500)
        
        # Use collected questions after all attempts are done
        processed_quiz = all_questions[:50]  # Take only first 50 if we got more
        
        logger.info(f"✅ Final collection: {len(processed_quiz)} valid questions for mock test")
        
        # If we still don't have 50 questions after all attempts, that's okay - return what we have
        # But log a warning
        if len(processed_quiz) < 50:
            logger.warning(f"⚠️ Only got {len(processed_quiz)} questions out of 50 requested. This may be due to token limits or API constraints.")
        
        # If we have 0 questions, return an error instead of empty array
        if len(processed_quiz) == 0:
            logger.error(f"❌ Failed to extract any questions after {max_attempts} attempts")
            return JSONResponse(content={
                "error": "Failed to generate questions. The AI response could not be parsed. Please try again.",
                "currentLevel": current_level,
                "quiz": [],
                "questions": []
            }, status_code=200)  # Return 200 but with error message so frontend can display it
        
        if not retry:
            PREVIOUS_QUESTIONS_MOCK[chapter] = previous + [q["question"] for q in processed_quiz]
            if len(PREVIOUS_QUESTIONS_MOCK[chapter]) > MAX_PREVIOUS_QUESTIONS:
                PREVIOUS_QUESTIONS_MOCK[chapter] = PREVIOUS_QUESTIONS_MOCK[chapter][-MAX_PREVIOUS_QUESTIONS:]
        
        # Return in format that frontend expects: object with 'quiz' array
        # Frontend checks: data.quiz (array) or data.questions (array) or data (array)
        return JSONResponse(content={
            "currentLevel": current_level,
            "quiz": processed_quiz,
            "questions": processed_quiz  # Also include as 'questions' for compatibility
        })
    except HTTPException as e:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        
        # Check if it's a payment/credit error
        error_str = str(e).lower()
        if "402" in str(e) or "payment" in error_str or "credit" in error_str:
            return JSONResponse(content={
                "error": "Insufficient API credits. Please add credits to your OpenRouter account.",
                "currentLevel": 1,
                "quiz": []
            }, status_code=402)
        
        return JSONResponse(content={
            "error": f"Failed to generate mock test: {str(e)}",
            "currentLevel": 1,
            "quiz": []
        }, status_code=500)

# Quick Practice Quiz Endpoint
PREVIOUS_QUESTIONS_QUICK = {}
MAX_PREVIOUS_QUESTIONS = 100

# Language instructions for quiz generation
LANGUAGE_INSTRUCTIONS = {
    "English": "Generate all content in English.",
    "Hindi": "Generate all content in Hindi using Devanagari script.",
    "Tamil": "Generate all content in Tamil using Tamil script.",
    "Telugu": "Generate all content in Telugu using Telugu script.",
    "Kannada": "Generate all content in Kannada using Kannada script.",
    "Malayalam": "Generate all content in Malayalam using Malayalam script."
}

@app.get("/quiz")
def get_quiz(
    subtopic: str,
    retry: bool = False,
    currentLevel: int = None,
    language: str = "English",
    class_name: str = None,
    subject: str = None
):
    try:
        previous = PREVIOUS_QUESTIONS_QUICK.get(subtopic, []) if not retry else []
 
        # Use the level from frontend if provided
        if currentLevel is not None:
            current_level = currentLevel
        else:
            # fallback if frontend doesn't provide level
            num_prev = len(previous)
            if num_prev == 0:
                current_level = 1
            elif num_prev == 1:
                current_level = 2
            else:
                current_level = 3
 
        difficulty_map = {1: "simple", 2: "medium", 3: "hard"}
        difficulty = difficulty_map.get(current_level, "simple")
 
        logger.info(f"Generating quiz for class: {class_name}, subject: {subject}, subtopic: {subtopic}, difficulty: {difficulty}, retry: {retry}, level: {current_level}, language: {language}")
       
        # Get language instruction
        language_instruction = LANGUAGE_INSTRUCTIONS.get(language, LANGUAGE_INSTRUCTIONS["English"])
        
        # CRITICAL: Build subject context for the prompt to ensure correct subject questions
        subject_context = ""
        if subject and class_name:
            subject_context = f"\n\nCRITICAL SUBJECT CONTEXT - READ CAREFULLY:\n- This quiz is for {subject} subject in {class_name} class.\n- ALL questions MUST be related to {subject} ONLY.\n- Do NOT generate questions from other subjects like English, Science, History, Civics, Geography, Economics, Computers, etc.\n- The subtopic '{subtopic}' belongs to {subject}, so generate questions ONLY about {subject} topics.\n- If the subtopic seems ambiguous, interpret it STRICTLY in the context of {subject} subject.\n- For example, if subject is Mathematics, generate math questions only. If subject is English, generate English questions only.\n"
        elif subject:
            subject_context = f"\n\nCRITICAL SUBJECT CONTEXT - READ CAREFULLY:\n- This quiz is for {subject} subject.\n- ALL questions MUST be related to {subject} ONLY.\n- Do NOT generate questions from other subjects.\n- Generate questions ONLY about {subject} topics.\n"
 
        prompt = f"""
        Generate 10 multiple-choice questions for "{subtopic}"{f" in {subject} subject" if subject else ""}{f" for {class_name} class" if class_name else ""}.
        Difficulty: {difficulty}.
        {language_instruction}
        {subject_context}
        IMPORTANT INSTRUCTIONS:
        - ALL questions, options, and content MUST be in {language} language only.
        - Do NOT mix English with the target language.
        - Use proper script for the selected language.
        - Avoid repeating these questions: {previous}.
        - CRITICAL: Generate questions ONLY for {subject if subject else "the specified subject"}. Do NOT generate questions from other subjects.
       
        IMPORTANT FORMAT REQUIREMENTS:
        - Each question should have exactly 4 options as an array: ["option1", "option2", "option3", "option4"]
        - The answer should be the actual text of the correct option, NOT a letter
        - Return ONLY a JSON array with keys: question, options (array), answer (actual option text)
       
        Example format (in {language}):
        [
          {{
            "question": "[Question text in {language} related to {subject if subject else 'the topic'}]",
            "options": ["[Option 1 in {language}]", "[Option 2 in {language}]", "[Option 3 in {language}]", "[Option 4 in {language}]"],
            "answer": "[Correct option text in {language}]"
          }}
        ]
        """
        
        # Check if client is available
        if client is None:
            logger.error("❌ OpenAI client not available - cannot generate quiz")
            logger.error("   This usually means the API key failed to load or is invalid")
            logger.error(f"   API_KEY in globals: {'API_KEY' in globals()}")
            if 'API_KEY' in globals():
                logger.error(f"   API_KEY value: {API_KEY[:10] if API_KEY else 'None'}...")
            return JSONResponse(content={
                "error": "AI service unavailable. Please check the API configuration. The API key may be missing or invalid. Please restart the server after updating your .env file.",
                "currentLevel": current_level,
                "quiz": []
            }, status_code=503)
        
        # Validate API key is still available (if accessible)
        try:
            if 'API_KEY' in globals() and (not API_KEY or len(API_KEY.strip()) == 0):
                logger.error("❌ API key is empty or None")
                return JSONResponse(content={
                    "error": "API key is missing. Please check your .env file and restart the server.",
                    "currentLevel": current_level,
                    "quiz": []
                }, status_code=503)
        except Exception as key_check_err:
            # API_KEY might not be in scope here, skip validation
            logger.debug(f"Could not validate API_KEY: {key_check_err}")
            pass
            
        # Initialize response variable
        response = None
        try:
            # Reduce max_tokens significantly to avoid 402 errors (user only has 5410 tokens available)
            # For 10 questions, 300 tokens should be sufficient (very conservative)
            # OpenRouter might have a default max_tokens, so we explicitly set it low
            # CRITICAL: Set max_tokens explicitly and log it to verify
            max_tokens_value = 300  # Even more conservative - 300 tokens for 10 questions
            logger.info(f"📤 Making API call with max_tokens={max_tokens_value}")
            response = client.chat.completions.create(
                model="google/gemini-2.0-flash-001",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.9,
                max_tokens=max_tokens_value  # Explicitly set to 300 to avoid 402 errors
            )
            logger.info(f"✅ API call successful with max_tokens={max_tokens_value}")
        except Exception as api_error:
            # Check for OpenAI/OpenRouter specific error attributes
            error_code = None
            error_body = None
            error_dict = None
            
            # Try to extract status code from various error attributes
            if hasattr(api_error, 'status_code'):
                error_code = api_error.status_code
            elif hasattr(api_error, 'code'):
                error_code = api_error.code
            
            # Try to extract error body/response
            if hasattr(api_error, 'response'):
                try:
                    if hasattr(api_error.response, 'text'):
                        error_body = api_error.response.text
                    elif hasattr(api_error.response, 'json'):
                        error_dict = api_error.response.json()
                        error_body = str(error_dict)
                    else:
                        error_body = str(api_error.response)
                except:
                    pass
            
            # Try to extract error from body if it's a dict
            if error_dict and isinstance(error_dict, dict):
                if 'error' in error_dict and isinstance(error_dict['error'], dict):
                    if 'code' in error_dict['error']:
                        error_code = error_dict['error']['code']
                    if 'message' in error_dict['error']:
                        error_body = str(error_dict['error']['message'])
            
            error_msg = str(api_error)
            error_repr = repr(api_error)
            
            # CRITICAL: Parse error message that contains "Error code: 402 - {'error': {'code': 402}}"
            # The error format from OpenRouter is: "Error code: 402 - {'error': {'message': '...', 'code': 402}}"
            if "Error code:" in error_msg:
                try:
                    # Extract the code from "Error code: 402"
                    import re
                    code_match = re.search(r'Error code:\s*(\d+)', error_msg)
                    if code_match:
                        extracted_code = int(code_match.group(1))
                        if not error_code:  # Only use if we don't have error_code from attributes
                            error_code = extracted_code
                            logger.info(f"   → Extracted error code from message: {error_code}")
                    
                    # Try to parse the dict part: "{'error': {'code': 402}}"
                    dict_match = re.search(r'\{.*?\}', error_msg, re.DOTALL)
                    if dict_match:
                        try:
                            # Replace single quotes with double quotes for JSON parsing
                            dict_str = dict_match.group(0).replace("'", '"')
                            parsed_dict = json.loads(dict_str)
                            if 'error' in parsed_dict and isinstance(parsed_dict['error'], dict):
                                if 'code' in parsed_dict['error']:
                                    error_code = parsed_dict['error']['code']
                                    logger.info(f"   → Extracted error code from dict: {error_code}")
                                if 'message' in parsed_dict['error']:
                                    error_body = str(parsed_dict['error']['message'])
                        except:
                            # If JSON parsing fails, try eval (less safe but might work)
                            try:
                                parsed_dict = eval(dict_match.group(0))
                                if 'error' in parsed_dict and isinstance(parsed_dict['error'], dict):
                                    if 'code' in parsed_dict['error']:
                                        error_code = parsed_dict['error']['code']
                                        logger.info(f"   → Extracted error code from eval: {error_code}")
                                    if 'message' in parsed_dict['error']:
                                        error_body = str(parsed_dict['error']['message'])
                            except:
                                pass
                except Exception as parse_err:
                    logger.debug(f"   Could not parse error message: {parse_err}")
            
            logger.error(f"❌ API call failed: {api_error}")
            logger.error(f"   Error type: {type(api_error).__name__}")
            logger.error(f"   Error repr: {error_repr}")
            if error_code:
                logger.error(f"   Error status code: {error_code}")
            if error_body:
                logger.error(f"   Error body: {error_body[:200]}")
            
            # Check error message, repr, error code, and any error details
            error_lower = error_msg.lower()
            error_repr_lower = error_repr.lower()
            error_body_lower = (error_body or "").lower()
            
            # Handle 401 Unauthorized - Check status code first, then message
            if (error_code == 401 or 
                "401" in error_msg or "401" in error_repr or "401" in (error_body or "") or
                "no auth credentials" in error_lower or "no auth credentials" in error_repr_lower or
                "no auth credentials" in error_body_lower or
                "unauthorized" in error_lower or "authentication" in error_lower or
                "auth credentials" in error_lower or "auth credentials" in error_repr_lower):
                logger.error("   → Detected 401 Unauthorized error - API key issue")
                return JSONResponse(content={
                    "error": "API authentication failed. The OPENROUTER_API_KEY is missing or invalid. Please check your .env file and restart the server. Visit https://openrouter.ai/keys to get your API key.",
                    "currentLevel": current_level,
                    "quiz": []
                }, status_code=401)
            
            # Handle 402 Payment Required error - Check status code first, then message
            # The error message format is: "Error code: 402 - {'error': {'message': '...', 'code': 402}}"
            # Check for 402 error with multiple indicators - be VERY thorough
            is_402_error = (
                error_code == 402 or
                "402" in error_msg or "402" in error_repr or "402" in (error_body or "") or
                "payment required" in error_lower or "payment required" in error_repr_lower or
                "payment required" in error_body_lower or
                "credits" in error_lower or "credits" in error_repr_lower or "credits" in error_body_lower or
                "can only afford" in error_lower or "can only afford" in error_repr_lower or
                "can only afford" in error_body_lower or
                "requires more credits" in error_lower or "requires more credits" in error_repr_lower or
                "requires more credits" in error_body_lower or
                "fewer max_tokens" in error_lower or "fewer max_tokens" in error_repr_lower or
                "fewer max_tokens" in error_body_lower
            )
            
            # Log detailed detection info for debugging
            logger.error(f"   → 402 Detection: error_code={error_code}, has_402_in_msg={'402' in error_msg}, has_credits={'credits' in error_lower}, is_402_error={is_402_error}")
            logger.error(f"   → Full error_msg: {error_msg[:500]}")
            logger.error(f"   → Full error_body: {error_body[:500] if error_body else 'None'}")
            
            # CRITICAL: Check if error_code was extracted - if not, force extract from message
            if not error_code and "Error code: 402" in error_msg:
                error_code = 402
                logger.error(f"   → 🔧 Forced error_code to 402 from error message")
                is_402_error = True
            
            if is_402_error:
                logger.error("   → ✅✅✅ DETECTED 402 Payment Required error - RETURNING 402 STATUS NOW")
                # CRITICAL: Return immediately to prevent fall-through to outer handler
                response_402 = JSONResponse(content={
                    "error": "Insufficient API credits. Please add credits to your OpenRouter account to generate quizzes. Visit https://openrouter.ai/settings/credits",
                    "currentLevel": current_level,
                    "quiz": []
                }, status_code=402)
                logger.error(f"   → Returning 402 response: {response_402.status_code}")
                return response_402
            
            # Handle other API errors
            logger.error(f"   → Other API error - returning 500: {error_msg[:200]}")
            # CRITICAL: Return immediately to prevent fall-through to outer handler
            return JSONResponse(content={
                "error": f"AI service error: {error_msg[:200]}",  # Limit error message length
                "currentLevel": current_level,
                "quiz": []
            }, status_code=500)
        
        # CRITICAL: Check if response was successfully obtained
        if response is None:
            logger.error("❌ Response is None - API call must have failed but error was not caught properly")
            return JSONResponse(content={
                "error": "API call failed. Please check your API key and try again.",
                "currentLevel": current_level,
                "quiz": []
            }, status_code=500)
 
        # Safely extract message content from response
        logger.info(f"📥 Processing API response...")
        try:
            if not hasattr(response, 'choices') or not response.choices:
                logger.error("API response has no choices")
                return JSONResponse(content={
                    "error": "Invalid response from AI service. No choices returned.",
                    "currentLevel": current_level,
                    "quiz": []
                }, status_code=500)
            
            if not hasattr(response.choices[0], 'message') or not hasattr(response.choices[0].message, 'content'):
                logger.error("API response message structure is invalid")
                return JSONResponse(content={
                    "error": "Invalid response structure from AI service.",
                    "currentLevel": current_level,
                    "quiz": []
                }, status_code=500)
            
            message_content = response.choices[0].message.content
            
            if message_content is None:
                logger.error("API response content is None")
                return JSONResponse(content={
                    "error": "AI service returned empty content. Please try again.",
                    "currentLevel": current_level,
                    "quiz": []
                }, status_code=500)
            
            text = ""
            if isinstance(message_content, list):
                for block in message_content:
                    if isinstance(block, dict) and block.get("type") == "text":
                        text += block.get("text", "")
                    elif isinstance(block, str):
                        text += block
            else:
                text = str(message_content)
            
            if not text or not text.strip():
                logger.error("Extracted text is empty")
                return JSONResponse(content={
                    "error": "AI service returned empty content. Please try again.",
                    "currentLevel": current_level,
                    "quiz": []
                }, status_code=500)
            
            # Clean up markdown code blocks if present
            text = text.strip()
            if text.startswith("```json"):
                text = text[7:].strip()
            elif text.startswith("```"):
                text = text[3:].strip()
            if text.endswith("```"):
                text = text[:-3].strip()
            
            # Log first 500 chars for debugging
            logger.info(f"📄 AI response text (first 500 chars): {text[:500]}")
            
            try:
                quiz_json = json.loads(text)
                logger.info(f"✅ Successfully parsed JSON directly")
            except json.JSONDecodeError as json_err:
                logger.warning(f"⚠️ Direct JSON parse failed: {json_err}")
                logger.warning(f"   Trying to extract JSON array from text...")
                logger.warning(f"   Text content (first 500 chars): {text[:500]}")
                match = re.search(r'\[.*\]', text, re.DOTALL)
                if not match:
                    logger.error(f"❌ AI did not return valid JSON: {text[:200]}")
                    return JSONResponse(content={
                        "error": "Failed to parse questions from AI response. The AI returned invalid JSON. Please try again.",
                        "currentLevel": current_level,
                        "quiz": []
                    }, status_code=200)
                try:
                    quiz_json = json.loads(match.group(0))
                    logger.info(f"✅ Successfully extracted and parsed JSON array")
                except json.JSONDecodeError as json_err2:
                    logger.error(f"❌ Failed to parse even extracted JSON array: {json_err2}")
                    logger.error(f"   Extracted text (first 500 chars): {match.group(0)[:500]}")
                    return JSONResponse(content={
                        "error": "Failed to parse questions from AI response. The AI returned invalid JSON format. Please try again.",
                        "currentLevel": current_level,
                        "quiz": []
                    }, status_code=200)
        except Exception as parse_error:
            logger.error(f"❌ Error parsing API response: {parse_error}")
            import traceback
            logger.error(f"Traceback: {traceback.format_exc()}")
            # Check if it's a 402 error that slipped through
            error_str = str(parse_error).lower()
            if "402" in str(parse_error) or "credits" in error_str or "payment" in error_str:
                logger.error("   → Detected 402 error in parse_error handler")
                return JSONResponse(content={
                    "error": "Insufficient API credits. Please add credits to your OpenRouter account to generate quizzes. Visit https://openrouter.ai/settings/credits",
                    "currentLevel": current_level,
                    "quiz": []
                }, status_code=402)
            return JSONResponse(content={
                "error": f"Error processing AI response: {str(parse_error)[:200]}",
                "currentLevel": current_level,
                "quiz": []
            }, status_code=500)

        # Ensure quiz_json is defined before processing
        if 'quiz_json' not in locals():
            logger.error("quiz_json variable is not defined - this should not happen")
            return JSONResponse(content={
                "error": "Failed to parse quiz data from AI response. Please try again.",
                "currentLevel": current_level,
                "quiz": []
            }, status_code=500)
 
        # Process and validate the quiz
        if not isinstance(quiz_json, list):
            logger.error(f"quiz_json is not a list, got: {type(quiz_json)}")
            return JSONResponse(content={
                "error": "Invalid response format from AI. Expected a list of questions.",
                "currentLevel": current_level,
                "quiz": []
            }, status_code=200)
        
        processed_quiz = []
        for idx, q in enumerate(quiz_json):
            try:
                if not isinstance(q, dict):
                    logger.warning(f"Skipping question {idx}: not a dict")
                    continue
                    
                if not all(key in q for key in ["question", "options", "answer"]):
                    logger.warning(f"Skipping question {idx}: missing required keys")
                    continue
 
                if not isinstance(q["options"], list) or len(q["options"]) != 4:
                    logger.warning(f"Skipping question {idx}: invalid options format")
                    continue
 
                if q["answer"] not in q["options"]:
                    logger.warning(f"Skipping question {idx}: answer not in options")
                    continue
 
                processed_quiz.append(q)
            except Exception as q_err:
                logger.warning(f"Error processing question {idx}: {q_err}")
                continue

        if not processed_quiz:
            logger.error("No valid questions processed from AI response")
            return JSONResponse(content={
                "error": "No valid questions could be generated. Please try again.",
                "currentLevel": current_level,
                "quiz": []
            }, status_code=200)
 
        processed_quiz = processed_quiz[:10]
 
        # Shuffle the quiz questions
        random.shuffle(processed_quiz)
       
        # Shuffle options while preserving correct answer
        for q in processed_quiz:
            # Create a mapping of original positions
            original_options = q["options"].copy()
            correct_answer = q["answer"]
           
            # Shuffle the options
            random.shuffle(q["options"])
           
            # The answer remains the same text, not the position
            # This ensures the answer is always the correct option text
           
        if not retry:
            PREVIOUS_QUESTIONS_QUICK[subtopic] = previous + [q["question"] for q in processed_quiz]
            if len(PREVIOUS_QUESTIONS_QUICK[subtopic]) > MAX_PREVIOUS_QUESTIONS:
                PREVIOUS_QUESTIONS_QUICK[subtopic] = PREVIOUS_QUESTIONS_QUICK[subtopic][-MAX_PREVIOUS_QUESTIONS:]
 
        logger.info(f"Generated {len(processed_quiz)} questions for subtopic: {subtopic} in {language} for {subject if subject else 'unknown subject'}")
       
        return JSONResponse(content={
            "currentLevel": current_level,
            "quiz": processed_quiz
        })
 
    except Exception as e:
        error_msg = str(e)
        error_str = error_msg.lower()
        error_type = type(e).__name__
        logger.error(f"❌❌❌ OUTER EXCEPTION HANDLER CAUGHT ERROR: {error_type}: {error_msg}")
        import traceback
        full_traceback = traceback.format_exc()
        logger.error(f"Full Traceback:\n{full_traceback}")
        
        # Check if it's a 401 authentication error
        error_repr = repr(e)
        error_repr_lower = error_repr.lower()
        if ("401" in error_msg or "401" in error_repr or 
            "no auth credentials" in error_str or "no auth credentials" in error_repr_lower or
            "unauthorized" in error_str or "authentication" in error_str or
            "auth credentials" in error_str or "auth credentials" in error_repr_lower):
            logger.error("   → Detected 401 Authentication error in outer handler")
            return JSONResponse(content={
                "error": "API authentication failed. The OPENROUTER_API_KEY is missing or invalid. Please check your .env file and restart the server. Visit https://openrouter.ai/keys to get your API key.",
                "currentLevel": 1,
                "quiz": []
            }, status_code=401)
        
        # Check if it's a payment/credit error - be very thorough
        is_402 = (
            "402" in error_msg or "402" in error_repr or
            "payment required" in error_str or "payment required" in error_repr_lower or
            "credits" in error_str or "credits" in error_repr_lower or
            "can only afford" in error_str or "can only afford" in error_repr_lower or
            "requires more credits" in error_str or "requires more credits" in error_repr_lower or
            "fewer max_tokens" in error_str or "fewer max_tokens" in error_repr_lower
        )
        
        if is_402:
            logger.error("   → ✅ Detected 402 Payment Required error in outer handler")
            return JSONResponse(content={
                "error": "Insufficient API credits. Please add credits to your OpenRouter account to generate quizzes. Visit https://openrouter.ai/settings/credits",
                "currentLevel": 1,
                "quiz": []
            }, status_code=402)
        
        # Generic error - return 500 with error message
        logger.error(f"   → Returning generic 500 error (error type: {type(e).__name__})")
        return JSONResponse(content={
            "error": f"Failed to generate quiz: {error_msg[:200]}",
            "currentLevel": 1,
            "quiz": []
        }, status_code=500)
   
  # ✅ Typing Lesson Generator (new)
# ----------------------------------------------------------------
from fastapi import APIRouter
router = APIRouter()

class LessonRequest(BaseModel):
    difficulty: str

LESSON_LIBRARY = {
    "Beginner": [
        "The quick brown fox jumps over the lazy dog.",
        "Typing is a great way to improve your focus and speed.",
        "Practice makes perfect when learning to type accurately."
    ],
    "Intermediate": [
        "Programming languages like Python and JavaScript are fun to learn.",
        "Artificial intelligence is transforming how we interact with technology.",
        "Consistency in practice helps develop muscle memory for fast typing."
    ],
    "Advanced": [
        "Quantum computing challenges classical algorithms with immense processing power.",
        "Deep learning models require large datasets and extensive computation resources.",
        "Mastering touch typing allows you to express thoughts seamlessly through the keyboard."
    ]
}

@app.post("/generate-typing-lesson")
   
async def generate_typing_lesson(request: LessonRequest):
    """
    Generates a typing lesson using AI or fallback examples.
    """
    try:
        prompt = f"Generate a short {request.difficulty.lower()} typing practice text (2-3 sentences)."
        response = client.chat.completions.create(
            model="google/gemini-2.0-flash-001",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.8
        )
        text = str(response.choices[0].message.content)
        if text and len(text.strip()) > 30:
            return {"success": True, "lessonText": text.strip()}
        else:
            raise Exception("Empty AI response")
    except Exception as e:
        logger.warning(f"AI lesson generation failed: {e}")
        fallback = random.choice(LESSON_LIBRARY.get(request.difficulty, LESSON_LIBRARY["Beginner"]))
        return {"success": True, "lessonText": fallback}

# ----------------------------------------------------------------
# ✅ Root Test Route
# ----------------------------------------------------------------
@app.get("/")
def home():
    return {"message": "🚀 AI Learning Backend Running Successfully!"}


# Health check for typing endpoint
@app.get("/ai-assistant/typing-health")
async def typing_health_check():
    return {"status": "healthy", "service": "typing-lesson-generator"}
@app.get("/")
def read_root():
    return {"message": "AI Learning Assistant API is running"}
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


    