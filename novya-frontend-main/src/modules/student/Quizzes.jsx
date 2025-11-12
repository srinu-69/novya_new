import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RotateCcw, BookOpen, Play, ArrowLeft, Clock, AlertCircle } from 'lucide-react';
import './Test.css';
 
const Test = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [quizStatus, setQuizStatus] = useState('Not Started');
 
  const subjects = [
    {
      id: 'maths-lines',
      name: 'Lines and Angles',
      lesson: 'Maths',
      image: 'https://images.piclumen.com/normal/20250829/17/bd33069aad134c6fa7b15f0aeb8140ac.webp',
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'english-nutrition',
      name: 'Nutrition in Animals',
      lesson: 'English',
      image: 'https://images.piclumen.com/normal/20250829/17/5f16579e3a9e4c1785c5e20260cd515c.webp',
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 'computer-ms-word',
      name: 'MS Word Pictures',
      lesson: 'Computers',
      image: 'https://images.piclumen.com/normal/20250829/17/3352316b949c422398cd6a78f874d8ea.webp',
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'computer-text-editing',
      name: 'Text Editing',
      lesson: '-Computers',
      image: 'https://images.piclumen.com/normal/20250829/17/59c578dd608946958e6288ac57c56f74.webp',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      id: 'science-electricity',
      name: 'Electricity',
      lesson: 'Science',
      image: 'https://images.piclumen.com/normal/20250829/17/107ad8c0ad1242f1a8d78294a93f26c7.webp',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'science-metals',
      name: 'Metals and Non-Metals',
      lesson: 'Science',
      image: 'https://images.piclumen.com/normal/20250829/17/fd73b26f2cc946d28692064e27192723.webp',
      color: 'from-pink-500 to-rose-600'
    },
    {
      id: 'social-history',
      name: 'Indian History',
      lesson: 'Social',
      image: 'https://images.piclumen.com/normal/20250829/17/d8cdaeae5cd240bcb5b5a0d1beb5659a.webp',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'social-geography',
      name: 'World Geography',
      lesson: 'Social',
      image: 'https://images.piclumen.com/normal/20250829/17/9b84a7e2b962462eb60d10b2389c7874.webp',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      id: 'maths-fractions',
      name: 'Fractions',
      lesson: 'Maths',
      image: 'https://images.piclumen.com/normal/20250829/17/a4f2e6b440db48928ec4938a997e16d6.webp',
      color: 'from-emerald-500 to-green-600'
    },
    {
      id: 'english-grammar',
      name: 'Grammar',
      lesson: 'English',
      image: 'https://images.piclumen.com/normal/20250829/17/28291141699741a1a10eb245140c83df.webp',
      color: 'from-amber-500 to-yellow-600'
    },
    {
      id: 'computer-programming',
      name: 'Programming Basics',
      lesson: 'Computers',
      image: 'https://images.piclumen.com/normal/20250829/17/c5064d0eaece4beebd981a5dc113d480.webp',
      color: 'from-red-500 to-pink-600'
    },
    {
      id: 'science-biology',
      name: 'Human Biology',
      lesson: 'Science',
      image: 'https://images.piclumen.com/normal/20250829/17/fd73b26f2cc946d28692064e27192723.webp',
      color: 'from-teal-500 to-cyan-600'
    }
  ];
 
  // Sample questions data structure (you would need to add actual questions for each subject)
  const questions = {
        'maths-lines': [

      {

        id: 1,

        question: "What is the measure of a straight angle?",

        options: ["90°", "180°", "270°", "360°"],

        correctAnswer: "180°",

        explanation: "A straight angle measures exactly 180 degrees."

      },

      {

        id: 2,

        question: "Two angles that add up to 90° are called:",

        options: ["Supplementary angles", "Complementary angles", "Adjacent angles", "Vertical angles"],

        correctAnswer: "Complementary angles",

        explanation: "Complementary angles are two angles whose measures add up to 90 degrees."

      },

      {

        id: 3,

        question: "What is the name for angles that are opposite each other when two lines intersect?",

        options: ["Adjacent angles", "Supplementary angles", "Vertical angles", "Corresponding angles"],

        correctAnswer: "Vertical angles",

        explanation: "Vertical angles are the angles opposite each other when two lines intersect."

      },

      {

        id: 4,

        question: "If two lines are perpendicular, they form:",

        options: ["Acute angles", "Obtuse angles", "Right angles", "Straight angles"],

        correctAnswer: "Right angles",

        explanation: "Perpendicular lines intersect to form right angles (90°)."

      },

      {

        id: 5,

        question: "Which term describes lines in the same plane that never meet?",

        options: ["Perpendicular lines", "Intersecting lines", "Parallel lines", "Concurrent lines"],

        correctAnswer: "Parallel lines",

        explanation: "Parallel lines are lines in a plane that do not meet or intersect."

      },

      {

        id: 6,

        question: "An angle measuring more than 90° but less than 180° is called:",

        options: ["Acute angle", "Right angle", "Obtuse angle", "Straight angle"],

        correctAnswer: "Obtuse angle",

        explanation: "An obtuse angle measures more than 90° but less than 180°."

      },

      {

        id: 7,

        question: "What is the sum of all angles around a point?",

        options: ["90°", "180°", "270°", "360°"],

        correctAnswer: "360°",

        explanation: "The angles around a point always add up to 360°."

      },

      {

        id: 8,

        question: "Which instrument is used to measure angles?",

        options: ["Compass", "Ruler", "Protractor", "Divider"],

        correctAnswer: "Protractor",

        explanation: "A protractor is a measuring instrument, typically made of transparent plastic or glass, for measuring angles."

      },

      {

        id: 9,

        question: "If two angles are supplementary and one is 45°, what is the measure of the other angle?",

        options: ["45°", "90°", "135°", "180°"],

        correctAnswer: "135°",

        explanation: "Supplementary angles add up to 180°. So if one is 45°, the other is 180° - 45° = 135°."

      },

      {

        id: 10,

        question: "Which type of angle is exactly 90°?",

        options: ["Acute angle", "Right angle", "Obtuse angle", "Straight angle"],

        correctAnswer: "Right angle",

        explanation: "A right angle measures exactly 90°."

      }

    ],

   

    'english-nutrition': [

      {

        id: 1,

        question: "Which organ produces bile?",

        options: ["Liver", "Pancreas", "Stomach", "Small intestine"],

        correctAnswer: "Liver",

        explanation: "The liver produces bile which helps in the digestion of fats."

      },

      {

        id: 2,

        question: "What is the process of taking food into the body called?",

        options: ["Digestion", "Absorption", "Ingestion", "Egestion"],

        correctAnswer: "Ingestion",

        explanation: "Ingestion is the process of taking food into the body through the mouth."

      },

      {

        id: 3,

        question: "Which of these is not a part of the human digestive system?",

        options: ["Esophagus", "Trachea", "Stomach", "Small intestine"],

        correctAnswer: "Trachea",

        explanation: "The trachea is part of the respiratory system, not the digestive system."

      },

      {

        id: 4,

        question: "Where does most nutrient absorption occur?",

        options: ["Stomach", "Large intestine", "Small intestine", "Esophagus"],

        correctAnswer: "Small intestine",

        explanation: "The small intestine is where most nutrient absorption takes place."

      },

      {

        id: 5,

        question: "What is the main function of teeth in digestion?",

        options: ["Absorption", "Chemical breakdown", "Mechanical breakdown", "Secretion"],

        correctAnswer: "Mechanical breakdown",

        explanation: "Teeth help in the mechanical breakdown of food through chewing (mastication)."

      },

      {

        id: 6,

        question: "Which nutrient is the main source of energy for the body?",

        options: ["Proteins", "Vitamins", "Carbohydrates", "Fats"],

        correctAnswer: "Carbohydrates",

        explanation: "Carbohydrates are the body's main source of energy."

      },

      {

        id: 7,

        question: "What does saliva help to break down?",

        options: ["Proteins", "Fats", "Starch", "Minerals"],

        correctAnswer: "Starch",

        explanation: "Saliva contains the enzyme amylase which begins breaking down starch into simpler sugars."

      },

      {

        id: 8,

        question: "Which animal has a four-chambered stomach?",

        options: ["Human", "Cow", "Dog", "Cat"],

        correctAnswer: "Cow",

        explanation: "Cows are ruminants with a four-chambered stomach to help digest cellulose from plants."

      },

      {

        id: 9,

        question: "What is the finger-like projection in the small intestine that helps in absorption?",

        options: ["Alveoli", "Nephrons", "Villi", "Bronchioles"],

        correctAnswer: "Villi",

        explanation: "Villi are finger-like projections in the small intestine that increase surface area for absorption."

      },

      {

        id: 10,

        question: "Which vitamin is produced by bacteria in the large intestine?",

        options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin K"],

        correctAnswer: "Vitamin K",

        explanation: "Bacteria in the large intestine produce Vitamin K, which is important for blood clotting."

      }

    ],

   

    'computer-text-editing': [

      {

        id: 1,

        question: "Which key combination is used to select all text in a document?",

        options: ["Ctrl+A", "Ctrl+C", "Ctrl+V", "Ctrl+X"],

        correctAnswer: "Ctrl+A",

        explanation: "Ctrl+A is the keyboard shortcut to select all text in a document."

      },

      {

        id: 2,

        question: "What does the 'Cut' command do?",

        options: ["Copies selected text", "Removes selected text and places it on clipboard", "Deletes text permanently", "Pastes text from clipboard"],

        correctAnswer: "Removes selected text and places it on clipboard",

        explanation: "The Cut command removes the selected text and places it on the clipboard for pasting elsewhere."

      },

      {

        id: 3,

        question: "Which feature allows you to find specific words in a document?",

        options: ["Search", "Locate", "Find", "Discover"],

        correctAnswer: "Find",

        explanation: "The Find feature allows you to search for specific words or phrases in a document."

      },

      {

        id: 4,

        question: "What is the purpose of the 'Replace' feature?",

        options: ["To find text", "To find and change text", "To delete text", "To move text"],

        correctAnswer: "To find and change text",

        explanation: "The Replace feature allows you to find specific text and replace it with different text."

      },

      {

        id: 5,

        question: "Which alignment makes text even on both left and right margins?",

        options: ["Left align", "Right align", "Center align", "Justify"],

        correctAnswer: "Justify",

        explanation: "Justify alignment makes text even on both the left and right margins."

      },

      {

        id: 6,

        question: "What does double-clicking on a word typically do?",

        options: ["Deletes the word", "Selects the word", "Copies the word", "Underlines the word"],

        correctAnswer: "Selects the word",

        explanation: "Double-clicking on a word typically selects that entire word."

      },

      {

        id: 7,

        question: "Which feature allows you to reverse your last action?",

        options: ["Redo", "Undo", "Reverse", "Back"],

        correctAnswer: "Undo",

        explanation: "The Undo feature allows you to reverse your last action."

      },

      {

        id: 8,

        question: "What is the term for the blinking vertical line that shows where text will be inserted?",

        options: ["Pointer", "Cursor", "Insertion point", "Marker"],

        correctAnswer: "Insertion point",

        explanation: "The insertion point is the blinking vertical line that shows where text will be inserted when you type."

      },

      {

        id: 9,

        question: "Which key moves the insertion point to the beginning of a line?",

        options: ["End key", "Home key", "Page Up key", "Page Down key"],

        correctAnswer: "Home key",

        explanation: "The Home key moves the insertion point to the beginning of the current line."

      },

      {

        id: 10,

        question: "What is the purpose of the clipboard?",

        options: ["To store cut or copied items", "To save documents", "To format text", "To print documents"],

        correctAnswer: "To store cut or copied items",

        explanation: "The clipboard temporarily stores items that have been cut or copied for pasting elsewhere."

      }

    ],

    'science-electricity': [

      {

        id: 1,

        question: "What is the unit of electric current?",

        options: ["Volt", "Ampere", "Ohm", "Watt"],

        correctAnswer: "Ampere",

        explanation: "The ampere is the unit of electric current."

      },

      {

        id: 2,

        question: "Which material is the best conductor of electricity?",

        options: ["Rubber", "Glass", "Copper", "Plastic"],

        correctAnswer: "Copper",

        explanation: "Copper is an excellent conductor of electricity and is commonly used in electrical wiring."

      },

      {

        id: 3,

        question: "What does a battery do in an electric circuit?",

        options: ["Stores electricity", "Produces electricity", "Measures electricity", "Controls electricity"],

        correctAnswer: "Produces electricity",

        explanation: "A battery produces electricity through chemical reactions."

      },

      {

        id: 4,

        question: "Which device is used to measure voltage?",

        options: ["Ammeter", "Voltmeter", "Ohmmeter", "Galvanometer"],

        correctAnswer: "Voltmeter",

        explanation: "A voltmeter is used to measure voltage in an electric circuit."

      },

      {

        id: 5,

        question: "What is the path through which electric current flows called?",

        options: ["Circuit", "Route", "Pathway", "Conduit"],

        correctAnswer: "Circuit",

        explanation: "An electric circuit is the path through which electric current flows."

      },

      {

        id: 6,

        question: "Which of these is an insulator?",

        options: ["Iron", "Silver", "Aluminum", "Rubber"],

        correctAnswer: "Rubber",

        explanation: "Rubber is an insulator that does not allow electric current to flow through it easily."

      },

      {

        id: 7,

        question: "What happens when you break an electric circuit?",

        options: ["Current increases", "Current stops", "Voltage increases", "Resistance decreases"],

        correctAnswer: "Current stops",

        explanation: "When you break an electric circuit, the current stops flowing."

      },

      {

        id: 8,

        question: "Which type of circuit has only one path for current to flow?",

        options: ["Parallel circuit", "Series circuit", "Complex circuit", "Integrated circuit"],

        correctAnswer: "Series circuit",

        explanation: "In a series circuit, there is only one path for current to flow."

      },

      {

        id: 9,

        question: "What is the unit of electrical resistance?",

        options: ["Volt", "Ampere", "Ohm", "Watt"],

        correctAnswer: "Ohm",

        explanation: "The ohm is the unit of electrical resistance."

      },

      {

        id: 10,

        question: "Which device protects circuits from overload?",

        options: ["Switch", "Fuse", "Battery", "Resistor"],

        correctAnswer: "Fuse",

        explanation: "A fuse is a safety device that protects circuits from overload by breaking the circuit when current is too high."

      }

    ],

    'social-history': [

      {

        id: 1,

        question: "Who was the first Emperor of the Maurya Empire?",

        options: ["Ashoka", "Chandragupta Maurya", "Bindusara", "Samudragupta"],

        correctAnswer: "Chandragupta Maurya",

        explanation: "Chandragupta Maurya was the founder of the Maurya Empire in ancient India."

      },

      {

        id: 2,

        question: "Which dynasty built the Khajuraho temples?",

        options: ["Gupta Dynasty", "Chola Dynasty", "Chandela Dynasty", "Pallava Dynasty"],

        correctAnswer: "Chandela Dynasty",

        explanation: "The Chandela dynasty built the famous Khajuraho temples between 950 and 1050 CE."

      },

      {

        id: 3,

        question: "Where did Gautama Buddha attain enlightenment?",

        options: ["Lumbini", "Bodh Gaya", "Sarnath", "Kushinagar"],

        correctAnswer: "Bodh Gaya",

        explanation: "Gautama Buddha attained enlightenment under the Bodhi tree in Bodh Gaya."

      },

      {

        id: 4,

        question: "Who was the first woman ruler of the Delhi Sultanate?",

        options: ["Razia Sultana", "Nur Jahan", "Mumtaz Mahal", "Chand Bibi"],

        correctAnswer: "Razia Sultana",

        explanation: "Razia Sultana was the first and only woman ruler of the Delhi Sultanate."

      },

      {

        id: 5,

        question: "Which Mughal emperor built the Taj Mahal?",

        options: ["Akbar", "Jahangir", "Shah Jahan", "Aurangzeb"],

        correctAnswer: "Shah Jahan",

        explanation: "Shah Jahan built the Taj Mahal in memory of his wife Mumtaz Mahal."

      },

      {

        id: 6,

        question: "When did India gain independence from British rule?",

        options: ["1945", "1947", "1950", "1942"],

        correctAnswer: "1947",

        explanation: "India gained independence from British rule on August 15, 1947."

      },

      {

        id: 7,

        question: "Who was the first Prime Minister of independent India?",

        options: ["Mahatma Gandhi", "Jawaharlal Nehru", "Sardar Patel", "Rajendra Prasad"],

        correctAnswer: "Jawaharlal Nehru",

        explanation: "Jawaharlal Nehru was the first Prime Minister of independent India."

      },

      {

        id: 8,

        question: "Which was the first capital of the Mughal Empire in India?",

        options: ["Delhi", "Agra", "Fatehpur Sikri", "Lahore"],

        correctAnswer: "Agra",

        explanation: "Agra was the first capital of the Mughal Empire in India before it was moved to Delhi."

      },

      {

        id: 9,

        question: "Who founded the Vijayanagara Empire?",

        options: ["Krishnadevaraya", "Harihara and Bukka", "Raja Raja Chola", "Pulakeshin II"],

        correctAnswer: "Harihara and Bukka",

        explanation: "The Vijayanagara Empire was founded in 1336 by Harihara I and his brother Bukka Raya I."

      },

      {

        id: 10,

        question: "Which ancient university was a major center of learning in India?",

        options: ["Takshashila", "Harvard", "Oxford", "Cambridge"],

        correctAnswer: "Takshashila",

        explanation: "Takshashila (Taxila) was an ancient university and important center of learning in ancient India."

      }

    ],

    'maths-fractions': [

      {

        id: 1,

        question: "What is 1/2 + 1/4?",

        options: ["1/6", "2/6", "3/4", "2/4"],

        correctAnswer: "3/4",

        explanation: "1/2 is equal to 2/4. 2/4 + 1/4 = 3/4."

      },

      {

        id: 2,

        question: "Which fraction is equivalent to 0.75?",

        options: ["1/4", "1/2", "3/4", "2/3"],

        correctAnswer: "3/4",

        explanation: "0.75 is equal to 3/4 when expressed as a fraction."

      },

      {

        id: 3,

        question: "What is 2/3 of 12?",

        options: ["4", "6", "8", "10"],

        correctAnswer: "8",

        explanation: "2/3 of 12 is calculated as (2/3) × 12 = 24/3 = 8."

      },

      {

        id: 4,

        question: "Which of these fractions is the smallest?",

        options: ["1/2", "1/3", "1/4", "1/5"],

        correctAnswer: "1/5",

        explanation: "When the numerators are the same, the fraction with the largest denominator is the smallest. So 1/5 is smaller than 1/4, 1/3, and 1/2."

      },

      {

        id: 5,

        question: "What is 3/4 ÷ 2?",

        options: ["3/8", "1/2", "5/4", "6/4"],

        correctAnswer: "3/8",

        explanation: "3/4 ÷ 2 is the same as 3/4 × 1/2 = 3/8."

      },

      {

        id: 6,

        question: "Which fraction is greater than 1/2?",

        options: ["1/4", "1/3", "2/5", "3/5"],

        correctAnswer: "3/5",

        explanation: "3/5 = 0.6 which is greater than 1/2 = 0.5."

      },

      {

        id: 7,

        question: "What is the reciprocal of 2/3?",

        options: ["2/3", "3/2", "1/3", "3/1"],

        correctAnswer: "3/2",

        explanation: "The reciprocal of a fraction is obtained by swapping its numerator and denominator."

      },

      {

        id: 8,

        question: "Simplify 12/18 to its lowest terms:",

        options: ["2/3", "3/4", "4/6", "6/9"],

        correctAnswer: "2/3",

        explanation: "12/18 can be simplified by dividing both numerator and denominator by 6, giving 2/3."

      },

      {

        id: 9,

        question: "What is 1/3 + 2/5?",

        options: ["3/8", "11/15", "3/15", "2/15"],

        correctAnswer: "11/15",

        explanation: "1/3 = 5/15, 2/5 = 6/15. 5/15 + 6/15 = 11/15."

      },

      {

        id: 10,

        question: "Which of these is a proper fraction?",

        options: ["5/4", "4/4", "3/4", "4/3"],

        correctAnswer: "3/4",

        explanation: "A proper fraction has a numerator smaller than its denominator."

      }

    ],

    'english-grammar': [

      {

        id: 1,

        question: "Which sentence is in the past perfect tense?",

        options: ["She sings beautifully.", "She had sung before the show started.", "She will sing tomorrow.", "She is singing now."],

        correctAnswer: "She had sung before the show started.",

        explanation: "The past perfect tense (had + past participle) is used to describe an action that was completed before another action in the past."

      },

      {

        id: 2,

        question: "Identify the direct object in the sentence: 'The chef prepared a delicious meal.'",

        options: ["The chef", "prepared", "a delicious meal", "delicious"],

        correctAnswer: "a delicious meal",

        explanation: "The direct object is the person or thing that receives the action of the verb. The chef prepared *what?* A delicious meal."

      },

      {

        id: 3,

        question: "Choose the correct word to complete the sentence: 'The decision is between you and ___.'",

        options: ["I", "me", "my", "mine"],

        correctAnswer: "me",

        explanation: "The pronoun is the object of the preposition 'between,' so the objective case 'me' is required."

      },

      {

        id: 4,

        question: "What type of phrase is 'running quickly' in the sentence: 'Running quickly, he caught the bus.'?",

        options: ["Infinitive phrase", "Gerund phrase", "Participial phrase", "Prepositional phrase"],

        correctAnswer: "Participial phrase",

        explanation: "A participial phrase acts as an adjective, starting with a present (-ing) or past (-ed) participle, and modifies a noun ('he')."

      },

      {

        id: 5,

        question: "Which of these is a collective noun?",

        options: ["book", "team", "student", "teacher"],

        correctAnswer: "team",

        explanation: "Collective nouns refer to groups of people, animals, or things."

      },

      {

        id: 6,

        question: "Identify the grammatical mood of the verb: 'If I were you, I would study more.'",

        options: ["Indicative", "Imperative", "Subjunctive", "Interrogative"],

        correctAnswer: "Subjunctive",

        explanation: "The subjunctive mood is used to express wishes, suggestions, or hypothetical situations (often with 'if' and 'were')."

      },

      {

        id: 7,

        question: "What is the antecedent of the pronoun 'it'? 'The movie was long, but it was entertaining.'",

        options: ["long", "but", "movie", "entertaining"],

        correctAnswer: "movie",

        explanation: "An antecedent is the word a pronoun refers to. 'It' is referring back to 'The movie'."

      },

      {

        id: 8,

        question: "Which sentence is punctuated correctly?",

        options: ["I need to buy: eggs, milk, bread, and cheese.", "I need to buy eggs, milk, bread and cheese.", "I need to buy eggs, milk, bread, and cheese.", "I need to buy eggs milk bread and cheese."],

        correctAnswer: "I need to buy eggs, milk, bread, and cheese.",

        explanation: "This is the correct use of the Oxford (or serial) comma in a list, which helps avoid ambiguity."

      },

      {

        id: 9,

        question: "Choose the sentence that is in the passive voice.",

        options: ["The cat chased the mouse.", "The mouse was chased by the cat.", "The cat is chasing the mouse.", "Did the cat chase the mouse?"],

        correctAnswer: "The mouse was chased by the cat.",

        explanation: "In the passive voice, the subject receives the action. The structure is often [object] + [be verb] + [past participle] + [by + subject]."

      },

      {

        id: 10,

        question: "What is the simple predicate (verb) in this sentence? 'The tall, ancient tree in the forest provides a home for many animals.'",

        options: ["The tall, ancient tree", "in the forest", "provides", "a home for many animals"],

        correctAnswer: "provides",

        explanation: "The simple predicate is the main verb or verb phrase that tells what the subject does or is."

      }

    ],

    'computer-ms-word': [

      {

        id: 1,

        question: "What is the purpose of the 'Format Painter' tool in MS Word?",

        options: ["To change the page color", "To copy formatting from one text to another", "To insert a picture", "To check grammar"],

        correctAnswer: "To copy formatting from one text to another",

        explanation: "The Format Painter (paintbrush icon) allows you to quickly copy formatting (like font, size, color) from one section of text and apply it to another."

      },

      {

        id: 2,

        question: "Which menu tab would you use to add a Header or Footer to your document?",

        options: ["Home", "Insert", "Design", "Layout"],

        correctAnswer: "Insert",

        explanation: "The 'Insert' tab contains options to add elements like headers, footers, page numbers, pictures, and tables to your document."

      },

      {

        id: 3,

        question: "What does the 'Ctrl + S' keyboard shortcut do?",

        options: ["It opens the Save As dialog box.", "It saves the current document.", "It pastes copied text.", "It starts a new document."],

        correctAnswer: "It saves the current document.",

        explanation: "The 'Ctrl + S' command is the universal shortcut for saving your work in most applications, including MS Word."

      },

      {

        id: 4,

        question: "Which feature allows you to see how your document will look when printed?",

        options: ["Draft View", "Print Preview", "Read Mode", "Outline View"],

        correctAnswer: "Print Preview",

        explanation: "Print Preview (accessed via File > Print) shows you a exact copy of how the pages will appear on paper before you print them."

      },

      {

        id: 5,

        question: "What is the purpose of the 'Thesaurus' tool?",

        options: ["To correct spelling errors", "To find synonyms for a word", "To translate the document", "To count the number of words"],

        correctAnswer: "To find synonyms for a word",

        explanation: "The Thesaurus (found in the Review tab) provides a list of synonyms (words with similar meanings) for a selected word."

      },

      {

        id: 6,

        question: "Which option is used to change the space between lines of text?",

        options: ["Font Size", "Alignment", "Line Spacing", "Margins"],

        correctAnswer: "Line Spacing",

        explanation: "Line spacing controls the vertical distance between lines of text. It can be adjusted in the Paragraph group on the Home tab."

      },

      {

        id: 7,

        question: "How do you insert a manual page break into a document?",

        options: ["Pressing the Enter key multiple times", "Pressing 'Ctrl + Enter'", "Pressing 'Ctrl + P'", "Pressing 'Shift + Enter'"],

        correctAnswer: "Pressing 'Ctrl + Enter'",

        explanation: "The keyboard shortcut 'Ctrl + Enter' instantly inserts a page break, forcing the following text to start on a new page."

      },

      {

        id: 8,

        question: "What feature would you use to create a list of headings with their corresponding page numbers?",

        options: ["Table of Contents", "Index", "Caption", "Bibliography"],

        correctAnswer: "Table of Contents",

        explanation: "A Table of Contents is an automated list that pulls from heading styles in your document to show the structure and corresponding page numbers."

      },

      {

        id: 9,

        question: "Which tool is used to combine multiple versions of a document into one, showing all changes?",

        options: ["Track Changes", "Compare", "Combine", "Merge"],

        correctAnswer: "Compare",

        explanation: "The 'Compare' feature (in the Review tab) allows you to merge two versions of a document and see all differences between them."

      },

      {

        id: 10,

        question: "Where would you go to change the paper size from Letter to A4?",

        options: ["Home > Font", "Insert > Page Layout", "Layout > Size", "Design > Themes"],

        correctAnswer: "Layout > Size",

        explanation: "The 'Size' option, located in the 'Layout' tab, provides a dropdown menu to select different paper sizes like Letter, A4, Legal, etc."

      }

    ],

    'science-metals': [

      {

        id: 1,

        question: "Which of these is a chemical property of most metals?",

        options: ["They are brittle.", "They are poor conductors of heat.", "They react with oxygen to form basic oxides.", "They are dull in appearance."],

        correctAnswer: "They react with oxygen to form basic oxides.",

        explanation: "Metals undergo corrosion by reacting with oxygen in the air to form metal oxides, which are basic in nature."

      },

      {

        id: 2,

        question: "Which non-metal is essential for respiration and is a supporter of combustion?",

        options: ["Nitrogen", "Hydrogen", "Oxygen", "Carbon"],

        correctAnswer: "Oxygen",

        explanation: "Oxygen is the non-metal gas used by living organisms during aerobic respiration and is necessary for burning (combustion)."

      },

      {

        id: 3,

        question: "What is the nature of the oxide formed by non-metals?",

        options: ["Basic", "Neutral", "Acidic", "Alkaline"],

        correctAnswer: "Acidic",

        explanation: "Non-metals react with oxygen to form non-metal oxides, which are acidic in nature (e.g., CO₂ forms carbonic acid with water)."

      },

      {

        id: 4,

        question: "Which metal is liquid at room temperature?",

        options: ["Iron", "Copper", "Mercury", "Silver"],

        correctAnswer: "Mercury",

        explanation: "Mercury (Hg) is the only metal that is in a liquid state at standard room temperature."

      },

      {

        id: 5,

        question: "Why are electric wires made of copper?",

        options: ["It is cheap.", "It is a good conductor of electricity.", "It has a shiny appearance.", "It is very hard."],

        correctAnswer: "It is a good conductor of electricity.",

        explanation: "Copper is ductile (can be drawn into wires) and is an excellent conductor of electricity, making it ideal for electrical wiring."

      },

      {

        id: 6,

        question: "Which non-metal is a good conductor of electricity?",

        options: ["Sulphur", "Phosphorus", "Graphite (Carbon)", "Oxygen"],

        correctAnswer: "Graphite (Carbon)",

        explanation: "Graphite, an allotrope of carbon, is a non-metal that conducts electricity due to its unique layered structure with free electrons."

      },

      {

        id: 7,

        question: "What is the product formed when a metal reacts with a dilute acid?",

        options: ["Salt and Water", "Salt and Hydrogen Gas", "Salt and Carbon Dioxide", "Salt and Oxygen Gas"],

        correctAnswer: "Salt and Hydrogen Gas",

        explanation: "Metals above hydrogen in the reactivity series displace hydrogen from dilute acids, forming a corresponding salt and hydrogen gas."

      },

      {

        id: 8,

        question: "Which property of metals allows them to be hammered into thin sheets?",

        options: ["Ductility", "Malleability", "Sonorous", "Lustre"],

        correctAnswer: "Malleability",

        explanation: "Malleability is the property of metals that allows them to be hammered or rolled into thin sheets without breaking."

      },

      {

        id: 9,

        question: "Which gas is produced when a metal reacts with water?",

        options: ["Carbon Dioxide", "Oxygen", "Chlorine", "Hydrogen"],

        correctAnswer: "Hydrogen",

        explanation: "Reactive metals (like potassium, sodium, calcium) react with cold water to form the metal hydroxide and hydrogen gas."

      },

      {

        id: 10,

        question: "What is the main reason gold and platinum are used to make jewelry?",

        options: ["They are highly reactive.", "They are very hard.", "They are lustrous and highly non-reactive (corrosion-resistant).", "They are poor conductors of heat."],

        correctAnswer: "They are lustrous and highly non-reactive (corrosion-resistant).",

        explanation: "Their shiny appearance (lustre) and inability to tarnish or corrode easily make them ideal for long-lasting jewelry."

      }

    ],

    'social-geography': [

      {

        id: 1,

        question: "Which of these is defined as a large, relatively self-contained landmass that forms a major division of the Earth's surface?",

        options: ["Country", "Continent", "Island", "Peninsula"],

        correctAnswer: "Continent",

        explanation: "A continent is one of several very large landmasses on Earth, typically identified by convention rather than strict criteria."

      },

      {

        id: 2,

        question: "What is the name of the imaginary line that divides the Earth into the Northern and Southern Hemispheres?",

        options: ["Tropic of Cancer", "Prime Meridian", "Equator", "Tropic of Capricorn"],

        correctAnswer: "Equator",

        explanation: "The Equator is a line of latitude at 0 degrees that circles the middle of the Earth, dividing it into the Northern and Southern Hemispheres."

      },

      {

        id: 3,

        question: "Which ocean is the largest and deepest on Earth?",

        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],

        correctAnswer: "Pacific Ocean",

        explanation: "The Pacific Ocean is the largest and deepest ocean basin, covering more than 60 million square miles and containing the Mariana Trench."

      },

      {

        id: 4,

        question: "What is the term for the regular, predictable movement of water in the oceans, driven by wind, gravity, and water density?",

        options: ["Tides", "Waves", "Currents", "Tsunamis"],

        correctAnswer: "Currents",

        explanation: "Ocean currents are continuous, directed movements of seawater generated by forces acting upon it, such as wind, the Coriolis effect, and temperature/salinity differences."

      },

      {

        id: 5,

        question: "Which type of map primarily shows man-made features like borders, cities, and roads?",

        options: ["Physical Map", "Political Map", "Thematic Map", "Topographic Map"],

        correctAnswer: "Political Map",

        explanation: "A political map is designed to show governmental boundaries of countries, states, and counties, as well as the location of major cities and human-made features."

      },

      {

        id: 6,

        question: "What is the name of the vast, flat, treeless Arctic region where the subsoil is permanently frozen?",

        options: ["Desert", "Savanna", "Tundra", "Steppe"],

        correctAnswer: "Tundra",

        explanation: "The tundra biome is characterized by extremely cold climates, frozen subsoil (permafrost), low biotic diversity, and simple vegetation structure."

      },

      {

        id: 7,

        question: "Mount Everest, the world's highest mountain above sea level, is part of which major mountain range?",

        options: ["The Alps", "The Andes", "The Himalayas", "The Rockies"],

        correctAnswer: "The Himalayas",

        explanation: "The Himalayas, stretching across five countries in Asia, were formed by the tectonic collision of the Indian and Eurasian plates and contain Mount Everest."

      },

      {

        id: 8,

        question: "What is the term for the weather conditions prevailing in an area in general or over a long period?",

        options: ["Temperature", "Weather", "Climate", "Precipitation"],

        correctAnswer: "Climate",

        explanation: "Climate is the long-term pattern of weather in a particular area, typically averaged over 30 years. Weather is the short-term state of the atmosphere."

      },

      {

        id: 9,

        question: "Which of these is a key factor that influences the climate of a place?",

        options: ["Name of the country", "Latitude", "Local cuisine", "Population density"],

        correctAnswer: "Latitude",

        explanation: "Latitude is a primary controller of climate because it determines the amount of solar energy (insolation) an area receives."

      },

      {

        id: 10,

        question: "The Amazon River, known for having the largest drainage basin in the world, is primarily located on which continent?",

        options: ["Africa", "Asia", "South America", "North America"],

        correctAnswer: "South America",

        explanation: "The Amazon River flows through the Amazon rainforest, which is predominantly located in the continent of South America, mainly within Brazil."

      }

    ],

    'english-grammar': [

      {

        id: 1,

        question: "Which word is an example of a relative pronoun?",

        options: ["He", "Who", "This", "And"],

        correctAnswer: "Who",

        explanation: "Relative pronouns (who, whom, whose, which, that) introduce a relative clause, which provides more information about a noun."

      },

      {

        id: 2,

        question: "Identify the type of sentence: 'Please close the door on your way out.'",

        options: ["Declarative", "Interrogative", "Imperative", "Exclamatory"],

        correctAnswer: "Imperative",

        explanation: "An imperative sentence gives a command, makes a request, or offers advice. The subject 'you' is often implied."

      },

      {

        id: 3,

        question: "What is the superlative form of the adjective 'good'?",

        options: ["Gooder", "Better", "Best", "Well"],

        correctAnswer: "Best",

        explanation: "'Good' is an irregular adjective. Its comparative form is 'better' and its superlative form is 'best'."

      },

      {

        id: 4,

        question: "Choose the correct sentence.",

        options: ["The team are playing well.", "The team is playing well.", "The team am playing well.", "The team be playing well."],

        correctAnswer: "The team is playing well.",

        explanation: "Collective nouns like 'team' are often treated as singular entities, so they take a singular verb like 'is'."

      },

      {

        id: 5,

        question: "Which word is a coordinating conjunction?",

        options: ["Because", "Although", "But", "Since"],

        correctAnswer: "But",

        explanation: "Coordinating conjunctions (FANBOYS: for, and, nor, but, or, yet, so) join words, phrases, or independent clauses of equal importance."

      },

      {

        id: 6,

        question: "In the sentence 'She gave him the book,' what is the indirect object?",

        options: ["She", "gave", "him", "the book"],

        correctAnswer: "him",

        explanation: "The indirect object is the recipient of the direct object. She gave the book (direct object) to *whom?* To him."

      },

      {

        id: 7,

        question: "What is the past participle of the verb 'to choose'?",

        options: ["Choosed", "Chose", "Chosen", "Choose"],

        correctAnswer: "Chosen",

        explanation: "The principal parts of the irregular verb 'choose' are: choose (present), chose (past), chosen (past participle)."

      },

      {

        id: 8,

        question: "Identify the grammatical error: 'Neither of the boys are coming to the party.'",

        options: ["Incorrect pronoun", "Incorrect verb agreement", "Incorrect preposition", "Incorrect article"],

        correctAnswer: "Incorrect verb agreement",

        explanation: "Indefinite pronouns like 'neither' are singular and require a singular verb. It should be 'Neither of the boys *is* coming...'"

      },

      {

        id: 9,

        question: "Which phrase is an example of a prepositional phrase?",

        options: ["She ran quickly", "Under the bridge", "Very happy", "And then left"],

        correctAnswer: "Under the bridge",

        explanation: "A prepositional phrase begins with a preposition (e.g., under, in, at, on) and ends with a noun or pronoun (the object of the preposition)."

      },

      {

        id: 10,

        question: "What is the term for a word that sounds like the noise it describes, such as 'buzz' or 'pop'?",

        options: ["Simile", "Metaphor", "Onomatopoeia", "Alliteration"],

        correctAnswer: "Onomatopoeia",

        explanation: "Onomatopoeia is the formation of a word from a sound associated with what is named (e.g., cuckoo, sizzle, clang)."

      }

    ],

    'computer-programming': [

      {

        id: 1,

        question: "What is the fundamental difference between an 'integer' and a 'string' data type?",

        options: ["An integer is a letter, a string is a number.", "An integer is a whole number, a string is text.", "An integer is for logic, a string is for math.", "There is no difference."],

        correctAnswer: "An integer is a whole number, a string is text.",

        explanation: "Integers (int) represent numerical whole numbers. Strings (str) represent a sequence of characters (text) and are often enclosed in quotes."

      },

      {

        id: 2,

        question: "In programming, what is a 'variable' used for?",

        options: ["To perform mathematical calculations.", "To store and manipulate data.", "To define a function.", "To create a loop."],

        correctAnswer: "To store and manipulate data.",

        explanation: "A variable is a named container that holds a value, which can be used and changed throughout a program."

      },

      {

        id: 3,

        question: "What structure would you use to execute a block of code multiple times until a condition is met?",

        options: ["If-Else Statement", "Variable Declaration", "Loop", "Function Call"],

        correctAnswer: "Loop",

        explanation: "Loops (like 'for', 'while', and 'do-while') are control flow statements that allow code to be executed repeatedly based on a condition."

      },

      {

        id: 4,

        question: "What is the purpose of an 'if' statement?",

        options: ["To repeat code.", "To store a value.", "To make decisions in code.", "To define a new data type."],

        correctAnswer: "To make decisions in code.",

        explanation: "An 'if' statement allows a program to execute certain code only if a specific condition is true."

      },

      {

        id: 5,

        question: "What is the output of the expression: (10 % 3)?",

        options: ["3", "1", "0.333", "30"],

        correctAnswer: "1",

        explanation: "The modulus operator (%) returns the remainder of a division operation. 10 divided by 3 is 3 with a remainder of 1."

      },

      {

        id: 6,

        question: "What is a 'function' in programming?",

        options: ["A data type for numbers.", "A block of code designed to perform a specific task.", "A tool for drawing graphics.", "A type of computer hardware."],

        correctAnswer: "A block of code designed to perform a specific task.",

        explanation: "Functions are reusable blocks of code that are defined once and can be executed ('called') whenever needed, often taking inputs and returning a result."

      },

      {

        id: 7,

        question: "Which data structure stores a collection of elements in a specific order and allows duplicate members?",

        options: ["Set", "Dictionary", "Array/List", "Variable"],

        correctAnswer: "Array/List",

        explanation: "An array or list is an ordered collection of items (elements) where each element has an index (position). It can contain duplicates."

      },

          {

        id: 8,

        question: "What is the purpose of comments in code?",

        options: ["To make the code run faster.", "To explain the code to humans.", "To fix errors in the code.", "To create variables."],

        correctAnswer: "To explain the code to humans.",

        explanation: "Comments are notes written within the code that are ignored by the computer. They help developers understand the purpose and logic of the code."

      },

      {

        id: 9,

        question: "What symbol is commonly used to indicate the start of a single-line comment in many programming languages?",

        options: ["/*", "//", "<!--", "#"],

        correctAnswer: "//",

        explanation: "In languages like JavaScript, Java, and C++, double forward slashes (//) are used to start a single-line comment."

      },

      {

        id: 10,

        question: "What is the term for finding and fixing errors in code?",

        options: ["Compiling", "Executing", "Debugging", "Commenting"],

        correctAnswer: "Debugging",

        explanation: "Debugging is the process of identifying, analyzing, and removing errors (bugs) from a computer program."

      }

    ],

    'science-biology': [

      {

        id: 1,

        question: "Which organ system is responsible for transporting oxygen and nutrients throughout the body?",

        options: ["Digestive system", "Respiratory system", "Circulatory system", "Nervous system"],

        correctAnswer: "Circulatory system",

        explanation: "The circulatory system, consisting of the heart, blood, and blood vessels, transports oxygen, nutrients, hormones, and waste products throughout the body."

      },

      {

        id: 2,

        question: "What is the basic structural and functional unit of all living organisms?",

        options: ["Tissue", "Organ", "Cell", "Organ system"],

        correctAnswer: "Cell",

        explanation: "The cell is the smallest unit of life that can perform all life processes. All living things are composed of cells."

      },

      {

        id: 3,

        question: "Which process do plants use to make their own food using sunlight?",

        options: ["Respiration", "Photosynthesis", "Digestion", "Transpiration"],

        correctAnswer: "Photosynthesis",

        explanation: "Photosynthesis is the process by which plants convert light energy, water, and carbon dioxide into glucose (food) and oxygen."

      },

      {

        id: 4,

        question: "What is the powerhouse of the cell?",

        options: ["Nucleus", "Mitochondria", "Chloroplast", "Ribosome"],

        correctAnswer: "Mitochondria",

        explanation: "Mitochondria are organelles that generate most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy."

      },

      {

        id: 5,

        question: "Which system in the human body is responsible for producing offspring?",

        options: ["Endocrine system", "Reproductive system", "Excretory system", "Immune system"],

        correctAnswer: "Reproductive system",

        explanation: "The reproductive system is a collection of organs that work together for the purpose of producing offspring."

      },

      {

        id: 6,

        question: "What is the name of the process where cells divide to create two identical daughter cells?",

        options: ["Meiosis", "Mitosis", "Photosynthesis", "Respiration"],

        correctAnswer: "Mitosis",

        explanation: "Mitosis is the process of cell division that results in two genetically identical daughter cells from a single parent cell."

      },

      {

        id: 7,

        question: "Which blood cells are responsible for fighting infections?",

        options: ["Red blood cells", "White blood cells", "Platelets", "Plasma"],

        correctAnswer: "White blood cells",

        explanation: "White blood cells (leukocytes) are part of the immune system and help the body fight infections and other diseases."

      },

      {

        id: 8,

        question: "What is the main function of the respiratory system?",

        options: ["To transport nutrients", "To break down food", "To exchange gases", "To remove waste"],

        correctAnswer: "To exchange gases",

        explanation: "The respiratory system's primary function is to exchange oxygen and carbon dioxide between the body and the environment."

      },

      {

        id: 9,

        question: "Which organ produces insulin to regulate blood sugar levels?",

        options: ["Liver", "Pancreas", "Kidney", "Stomach"],

        correctAnswer: "Pancreas",

        explanation: "The pancreas produces insulin, a hormone that helps regulate blood sugar (glucose) levels in the body."

      },

      {

        id: 10,

        question: "What is the name of the long, coiled tube where most nutrient absorption occurs?",

        options: ["Esophagus", "Stomach", "Small intestine", "Large intestine"],

        correctAnswer: "Small intestine",

        explanation: "The small intestine is where most digestion and absorption of nutrients from food takes place."

      }

    ]
  };
 
  useEffect(() => {
    let timer;
    if (isQuizActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isQuizActive) {
      handleFinishQuiz();
    }
    return () => clearInterval(timer);
  }, [isQuizActive, timeLeft]);
 
  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
    setTimeLeft(300);
    setIsQuizActive(false);
    setQuizStatus('Not Started');
  };
 
  const handleStartQuiz = () => {
    setIsQuizActive(true);
    setQuizStatus('In Progress');
    setTimeLeft(300);
  };
 
  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };
 
  const handleNextQuestion = () => {
    if (currentQuestion < questions[selectedSubject.id].length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(userAnswers[currentQuestion + 1] || '');
    }
  };
 
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(userAnswers[currentQuestion - 1] || '');
    }
  };
 
  const handleFinishQuiz = () => {
    setIsQuizActive(false);
    setQuizStatus('Finished');
    setShowResults(true);
   
    let correctCount = 0;
    const currentQuestions = questions[selectedSubject.id];
   
    currentQuestions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
   
    setScore(correctCount);
  };
 
  const handleResetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
    setTimeLeft(300);
    setIsQuizActive(false);
    setQuizStatus('Not Started');
  };
 
  const handleBackToSubjects = () => {
    setSelectedSubject(null);
  };
 
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
 
  if (!selectedSubject) {
    return (
      <div className="quiz-page"><br></br><br></br><br></br>
        <h1 className="quiz-title">Test Your Knowledge</h1>
        <p className="quiz-subtitle">Select a quiz to begin.</p>
 
        <div className="quiz-grid">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="quiz-card"
              onClick={() => handleSubjectSelect(subject)}
            >
              {/* Image (clickable) */}
              <img
                src={subject.image}
                alt={subject.name}
                className="quiz-image"
              />
 
              {/* Title + Subject */}
              <div className="quiz-info">
                <h2>{subject.name}</h2>
                <p>{subject.lesson}</p>
              </div>
 
              {/* Start Button */}
              <button
                className="quiz-button"
                onClick={() => handleStartQuiz()}
              >
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentQuestions = questions[selectedSubject.id];
  const currentQuestionData = currentQuestions[currentQuestion];
  const totalQuestions = currentQuestions.length;
 
  if (showResults) {
    return (
      <div className="test-container">
        <div className="results-container">
          <h2>Quiz Results</h2>
          <div className="score-section">
            <h3>Your Score: {score}/{totalQuestions}</h3>
            <p>{Math.round((score / totalQuestions) * 100)}%</p>
          </div>
         
          <div className="results-details">
            {currentQuestions.map((question, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer;
             
              return (
                <div key={question.id} className={`result-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="result-question">
                    <span>Q{index + 1}: {question.question}</span>
                    {isCorrect ? (
                      <CheckCircle size={20} className="correct-icon" />
                    ) : (
                      <XCircle size={20} className="incorrect-icon" />
                    )}
                  </div>
                  <div className="result-answer">
                    <p>Your answer: {userAnswer || 'Not answered'}</p>
                    {!isCorrect && <p>Correct answer: {question.correctAnswer}</p>}
                  </div>
                  <div className="result-explanation">
                    <p>{question.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
         
          <div className="results-actions">
            <button onClick={handleResetQuiz} className="btn-retry">
              <RotateCcw size={18} />
              Try Again
            </button>
            <button onClick={handleBackToSubjects} className="btn-back">
              <ArrowLeft size={18} />
              Back to Subjects
            </button>
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div className="test-container">
  <div
  className="quiz-header"
  style={{ paddingTop: "80px" }} // adjust value based on navbar height
>
  <button
    onClick={handleBackToSubjects}
    style={{
      display: "flex",
      alignItems: "center",
      padding: "8px 16px",
      margin: "6px 0",
      border: "none",
      borderRadius: "8px",
      background: "#f5f5f5",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500"
    }}
  >
    <ArrowLeft size={18} style={{ marginRight: "8px" }} />
    Back to Subjects
  </button>

  <div className="quiz-info">
    <div className="subject-title">
      <h2>{selectedSubject.name}</h2>
      <p>{selectedSubject.lesson}</p>
    </div>

    <div className="quiz-status">
      <div className="status-badge">
        {quizStatus === "Not Started" && <AlertCircle size={16} />}
        {quizStatus === "In Progress" && <Clock size={16} />}
        {quizStatus === "Finished" && <CheckCircle size={16} />}
        <span>{quizStatus}</span>
      </div>

      {isQuizActive && (
        <div className="timer">
          <Clock size={16} />
          <span>{formatTime(timeLeft)}</span>
        </div>
      )}
    </div>
  </div>

  <div className="progress-container">
    <div className="progress-bar">
      <div
        className="progress-fill"
        style={{
          width: `${((currentQuestion + 1) / totalQuestions) * 100}%`
        }}
      ></div>
    </div>
    <span>
      Question {currentQuestion + 1} of {totalQuestions}
    </span>
  </div>
</div>

      {!isQuizActive ? (
        <div className="quiz-instructions">
          <div className="instructions-card">
            <h3>Instructions</h3>
            <ul>
              <li>This quiz contains {totalQuestions} multiple-choice questions</li>
              <li>You will have 5 minutes to complete the quiz</li>
              <li>Each question has only one correct answer</li>
              <li>You can navigate between questions using the Previous and Next buttons</li>
              <li>Your progress will be saved as you go through the questions</li>
              <li>You can finish the quiz at any time by clicking the Finish button</li>
            </ul>
           
            <div className="instructions-actions">
              <button onClick={handleStartQuiz} className="btn-start">
                <Play size={18} />
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="quiz-content">
          <div className="question-card">
            <h3 className="question-text">{currentQuestionData.question}</h3>
           
            <div className="options-container">
              {currentQuestionData.options.map((option, index) => (
                <div
                  key={index}
                  className={`option ${selectedAnswer === option ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(option)}
                >
                  <div className="option-selector">
                    {selectedAnswer === option ? (
                      <div className="option-selected"></div>
                    ) : null}
                  </div>
                  <span>{option}</span>
                </div>
              ))}
            </div>
           
            <div className="navigation-buttons">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
                className="btn-prev"
              >
                Previous
              </button>
             
              {currentQuestion === totalQuestions - 1 ? (
                <button onClick={handleFinishQuiz} className="btn-finish">
                  Finish Quiz
                </button>
              ) : (
                <button onClick={handleNextQuestion} className="btn-next">
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default Test;