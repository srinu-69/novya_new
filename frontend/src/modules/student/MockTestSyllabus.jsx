const mockTestSyllabus = {
  english: {
    name: "English",
    classes: {
      7: [
        { id: "prose", name: "Prose" },
        { id: "poetry", name: "Poetry" },
        { id: "grammar", name: "Grammar" },
        { id: "writing", name: "Writing" }
      ],
      8: [
        { id: "prose", name: "Prose" },
        { id: "poetry", name: "Poetry" },
        { id: "grammar", name: "Grammar" },
        { id: "writing", name: "Writing" }
      ],
      9: [
        { id: "prose", name: "Prose" },
        { id: "poetry", name: "Poetry" },
        { id: "grammar", name: "Grammar" },
        { id: "writing", name: "Writing" }
      ],
      10: [
        { id: "prose", name: "Prose" },
        { id: "poetry", name: "Poetry" },
        { id: "grammar", name: "Grammar" },
        { id: "writing", name: "Writing" }
      ]
    }
  },
  mathematics: {
    name: "Maths",
    classes: {
      7: [
        { id: "integers", name: "Integers" },
        { id: "fractions", name: "Fractions and Decimals" },
        { id: "data", name: "Data Handling" },
        { id: "simple_equations", name: "Simple Equations" },
        { id: "lines_angles", name: "Lines and Angles" },
        { id: "triangles", name: "Triangles" },
        { id: "symmetry", name: "Symmetry" },
        { id: "solid_shapes", name: "Solid Shapes" }
      ],
      8: [
        { id: "rational_numbers", name: "Rational Numbers" },
        { id: "linear_equations", name: "Linear Equations" },
        { id: "quadrilaterals", name: "Quadrilaterals" },
        { id: "data_handling", name: "Data Handling" },
        { id: "squares", name: "Squares and Square Roots" },
        { id: "cubes", name: "Cubes and Cube Roots" },
        { id: "mensuration", name: "Mensuration" },
        { id: "exponents", name: "Exponents" }
      ],
      9: [
        { id: "number_system", name: "Number System" },
        { id: "algebra", name: "Algebra" },
        { id: "coordinate_geometry", name: "Coordinate Geometry" },
        { id: "geometry", name: "Geometry" },
        { id: "mensuration", name: "Mensuration" },
        { id: "statistics", name: "Statistics" }
      ],
      10: [
        { id: "number_system", name: "Number System" },
        { id: "algebra", name: "Algebra" },
        { id: "coordinate_geometry", name: "Coordinate Geometry" },
        { id: "geometry", name: "Geometry" },
        { id: "trigonometry", name: "Trigonometry" },
        { id: "mensuration", name: "Mensuration" },
        { id: "statistics", name: "Statistics" },
        { id: "probability", name: "Probability" }
      ]
    }
  },
  science: {
    name: "Science",
    classes: {
      7: [
        { id: "nutrition_plants", name: "Nutrition in Plants" },
        { id: "nutrition_animals", name: "Nutrition in Animals" },
        { id: "heat", name: "Heat" },
        { id: "acids_bases", name: "Acids, Bases, and Salts" },
        { id: "physical_chemical", name: "Physical and Chemical Changes" },
        { id: "weather_climate", name: "Weather, Climate, and Adaptation" },
        { id: "soil", name: "Soil" },
        { id: "respiration", name: "Respiration in Organisms" },
        { id: "transportation", name: "Transportation in Animals and Plants" },
        { id: "reproduction", name: "Reproduction in Plants" },
        { id: "motion_time", name: "Motion and Time" },
        { id: "electricity", name: "Electric Current and its Effects" }
      ],
      8: [
        { id: "microorganisms", name: "Microorganisms" },
        { id: "food", name: "Food" },
        { id: "force_motion", name: "Force and Motion" },
        { id: "water", name: "Water: A Precious Resource" },
        { id: "friction", name: "Friction" },
        { id: "sound", name: "Sound" },
        { id: "chemical_current", name: "Chemical Effects of Current" },
        { id: "natural_phenomena", name: "Some Natural Phenomena" }
      ],
      9: [
        { id: "matter", name: "Matter" },
        { id: "motion", name: "Motion" },
        { id: "force_laws", name: "Force and Laws of Motion" },
        { id: "gravitation", name: "Gravitation" },
        { id: "work_energy", name: "Work, Energy and Power" },
        { id: "sound", name: "Sound" },
        { id: "chemical_current", name: "Chemical Effects of Current" },
        { id: "light", name: "Light – Reflection and Refraction" },
        { id: "human_eye", name: "Human Eye and Colourful World" }
      ],
      10: [
        { id: "chemical_reactions", name: "Chemical Reactions and Equations" },
        { id: "acids_bases", name: "Acids, Bases and Salts" },
        { id: "metals_nonmetals", name: "Metals and Non-Metals" },
        { id: "carbon_compounds", name: "Carbon and its Compounds" },
        { id: "periodic_table", name: "Periodic Classification of Elements" },
        { id: "life_processes", name: "Life Processes" },
        { id: "control_coordination", name: "Control and Coordination" },
        { id: "reproduction", name: "Reproduction" },
        { id: "heredity", name: "Heredity and Evolution" },
        { id: "light", name: "Light – Reflection and Refraction" },
        { id: "electricity", name: "Electricity" },
        { id: "magnetism", name: "Magnetic Effects of Current" }
      ]
    }
  },
  social_science: {
    name: "Social Science",
    classes: {
      7: [
        { id: "history", name: "History" },
        { id: "geography", name: "Geography" },
        { id: "civics", name: "Civics" },
        { id: "economics", name: "Economics" }
      ],
      8: [
        { id: "history", name: "History" },
        { id: "geography", name: "Geography" },
        { id: "civics", name: "Civics" },
        { id: "economics", name: "Economics" }
      ],
      9: [
        { id: "history", name: "History" },
        { id: "geography", name: "Geography" },
        { id: "civics", name: "Civics" },
        { id: "economics", name: "Economics" }
      ],
      10: [
        { id: "history", name: "History" },
        { id: "geography", name: "Geography" },
        { id: "civics", name: "Civics" },
        { id: "economics", name: "Economics" }
      ]
    }
  },
  computer: {
    name: "Computer",
    classes: {
      7: [
        { id: "basics", name: "Computer Basics" },
        { id: "operating_systems", name: "Operating Systems" },
        { id: "word_processing", name: "Word Processing" },
        { id: "internet", name: "Internet" }
      ],
      8: [
        { id: "spreadsheet", name: "Spreadsheet" },
        { id: "presentation", name: "Presentation" },
        { id: "programming_basics", name: "Programming Basics" },
        { id: "internet", name: "Internet" }
      ],
      9: [
        { id: "programming", name: "Programming" },
        { id: "database", name: "Database Management" },
        { id: "networking", name: "Networking" },
        { id: "web_design", name: "Web Designing" }
      ],
      10: [
        { id: "advanced_programming", name: "Advanced Programming" },
        { id: "database", name: "Database Management" },
        { id: "networking", name: "Networking" },
        { id: "web_design", name: "Web Designing" }
      ]
    }
  }
};

export default mockTestSyllabus;
