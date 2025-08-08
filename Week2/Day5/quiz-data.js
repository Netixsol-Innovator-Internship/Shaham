// Quiz data with 5 different programming quizzes, each with 10 questions
const quizData = {
    "html": {
        id: "html",
        title: "HTML Fundamentals",
        category: "HTML",
        description: "Test your knowledge of HTML structure and elements",
        image: "./Images/quizes.png",
        questions: [
            {
                id: 1,
                question: "What does HTML stand for?",
                options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"],
                correct: 0
            },
            {
                id: 2,
                question: "What is the correct HTML element for the largest heading?",
                options: ["heading", "h6", "head", "h1"],
                correct: 3
            },
            {
                id: 3,
                question: "What is the latest version of HTML?",
                options: ["5", "4", "6", "8"],
                correct: 1
            },
            {
                id: 4,
                question: "What is the correct HTML tag for paragraph?",
                options: ["p", "pre", "b", "br"],
                correct: 1
            },
            {
                id: 5,
                question: "How do you make a list that lists items with bullets?",
                options: ["ul", "ol", "list", "dl"],
                correct: 0
            },
            {
                id: 6,
                question: "What attribute is used to provide alternative text for an image?",
                options: ["alt", "src", "title", "value"],
                correct: 1
            },
            {
                id: 7,
                question: "Which HTML attribute specifies an alternate text for an image?",
                options: ["alt", "title", "src", "longdesc"],
                correct: 0
            },
            {
                id: 8,
                question: "What is the correct HTML for making a text input field?",
                options: ["input type='text'", "textfield", "input type='textfield'", "textinput type='text'"],
                correct: 0
            },
            {
                id: 9,
                question: "Which HTML element defines the title of a document?",
                options: ["meta", "title", "head", "header"],
                correct: 1
            },
            {
                id: 10,
                question: "What is the correct HTML tag for inserting a line horizontally?",
                options: ["hr", "line", "br", "border"],
                correct: 1
            }
        ]
    },
    "javascript": {
        id: "javascript",
        title: "JavaScript Fundamentals",
        category: "JS",
        description: "Test your JavaScript programming knowledge",
        image: "./Images/quizes.png",
        questions: [
            {
                id: 1,
                question: "Which company developed JavaScript?",
                options: ["Microsoft", "Netscape", "Google", "Apple"],
                correct: 1
            },
            {
                id: 2,
                question: "What is the correct way to write a JavaScript array?",
                options: ["var colors = 'red', 'green', 'blue'", "var colors = (1:'red', 2:'green', 3:'blue')", "var colors = ['red', 'green', 'blue']", "var colors = 1 = ('red'), 2 = ('green'), 3 = ('blue')"],
                correct: 2
            },
            {
                id: 3,
                question: "How do you write 'Hello World' in an alert box?",
                options: ["alertBox('Hello World');", "msg('Hello World');", "alert('Hello World');", "msgBox('Hello World');"],
                correct: 2
            },
            {
                id: 4,
                question: "How do you create a function in JavaScript?",
                options: ["function = myFunction() {}", "function myFunction() {}", "create myFunction() {}", "function:myFunction() {}"],
                correct: 1
            },
            {
                id: 5,
                question: "How do you call a function named 'myFunction'?",
                options: ["call function myFunction()", "call myFunction()", "myFunction()", "Call.myFunction()"],
                correct: 2
            },
            {
                id: 6,
                question: "How to write an IF statement in JavaScript?",
                options: ["if i == 5 then", "if i = 5 then", "if (i == 5)", "if i = 5"],
                correct: 2
            },
            {
                id: 7,
                question: "What is the correct way to write a JavaScript object?",
                options: ["var person = {firstName:'John', lastName:'Doe'};", "var person = {firstName = 'John', lastName = 'Doe'};", "var person = (firstName:'John', lastName:'Doe');", "var person = (firstName = 'John', lastName = 'Doe');"],
                correct: 0
            },
            {
                id: 8,
                question: "Which event occurs when the user clicks on an HTML element?",
                options: ["onchange", "onclick", "onmouseclick", "onmouseover"],
                correct: 1
            },
            {
                id: 9,
                question: "How do you declare a JavaScript variable?",
                options: ["variable carName;", "var carName;", "v carName;", "declare carName;"],
                correct: 1
            },
            {
                id: 10,
                question: "What will the following code return: Boolean(10 > 9)",
                options: ["true", "false", "NaN", "undefined"],
                correct: 0
            }
        ]
    },
    "python": {
        id: "python",
        title: "Python Programming",
        category: "Python",
        description: "Test your Python programming skills",
        image: "./Images/quizes.png",
        questions: [
            {
                id: 1,
                question: "What is the correct file extension for Python files?",
                options: [".pyth", ".pt", ".py", ".python"],
                correct: 2
            },
            {
                id: 2,
                question: "Which of the following is the correct syntax to output 'Hello World' in Python?",
                options: ["echo('Hello World')", "print('Hello World')", "printf('Hello World')", "cout << 'Hello World'"],
                correct: 1
            },
            {
                id: 3,
                question: "How do you insert COMMENTS in Python code?",
                options: ["/*This is a comment*/", "//This is a comment", "#This is a comment", "This is a comment"],
                correct: 2
            },
            {
                id: 4,
                question: "Which one is NOT a legal variable name?",
                options: ["Myvar", "my_var", "2myvar", "_myvar"],
                correct: 2
            },
            {
                id: 5,
                question: "What is the correct syntax to create a function in Python?",
                options: ["create myfunction():", "def myfunction():", "function myfunction():", "func myfunction():"],
                correct: 1
            },
            {
                id: 6,
                question: "In Python, which of the following is used to define a block of code?",
                options: ["Curly braces", "Parentheses", "Indentation", "Square brackets"],
                correct: 2
            },
            {
                id: 7,
                question: "What is the output of print(2 ** 3)?",
                options: ["5", "6", "8", "9"],
                correct: 2
            },
            {
                id: 8,
                question: "Which method can be used to remove any whitespace from both the beginning and the end of a string?",
                options: ["strip()", "trim()", "len()", "ptrim()"],
                correct: 0
            },
            {
                id: 9,
                question: "What is the correct way to create a list in Python?",
                options: ["list = (1, 2, 3)", "list = [1, 2, 3]", "list = {1, 2, 3}", "list = <1, 2, 3>"],
                correct: 1
            },
            {
                id: 10,
                question: "What does the len() function do?",
                options: ["Returns the length of an object", "Returns the last element", "Returns the first element", "Returns the type of object"],
                correct: 0
            }
        ]
    },
    "react": {
        id: "react",
        title: "React Development",
        category: "React",
        description: "Test your React.js knowledge and concepts",
        image: "./Images/quizes.png",
        questions: [
            {
                id: 1,
                question: "What is React?",
                options: ["A JavaScript library for building user interfaces", "A database", "A web server", "A CSS framework"],
                correct: 0
            },
            {
                id: 2,
                question: "What is JSX?",
                options: ["A JavaScript extension", "A syntax extension for JavaScript", "A CSS preprocessor", "A database query language"],
                correct: 1
            },
            {
                id: 3,
                question: "How do you create a React component?",
                options: ["function MyComponent() {}", "class MyComponent extends React.Component {}", "const MyComponent = () => {}", "All of the above"],
                correct: 3
            },
            {
                id: 4,
                question: "What is the virtual DOM?",
                options: ["A copy of the real DOM kept in memory", "A new type of DOM", "A DOM manipulation library", "A CSS framework"],
                correct: 0
            },
            {
                id: 5,
                question: "What is the purpose of useState hook?",
                options: ["To manage component state", "To handle side effects", "To optimize performance", "To create context"],
                correct: 0
            },
            {
                id: 6,
                question: "How do you pass data from parent to child component?",
                options: ["Using state", "Using props", "Using context", "Using refs"],
                correct: 1
            },
            {
                id: 7,
                question: "What is the useEffect hook used for?",
                options: ["Managing state", "Handling side effects", "Creating components", "Styling components"],
                correct: 1
            },
            {
                id: 8,
                question: "What is the correct way to handle events in React?",
                options: ["onClick={handleClick()}", "onClick={handleClick}", "onclick='handleClick()'", "onClick='handleClick'"],
                correct: 1
            },
            {
                id: 9,
                question: "What is React Router used for?",
                options: ["State management", "Routing in single-page applications", "API calls", "Styling"],
                correct: 1
            },
            {
                id: 10,
                question: "What is the key prop used for in React lists?",
                options: ["Styling", "Event handling", "Helping React identify which items have changed", "Data binding"],
                correct: 2
            }
        ]
    },
    "nodejs": {
        id: "nodejs",
        title: "Node.js Backend",
        category: "Node.js",
        description: "Test your Node.js server-side development knowledge",
        image: "./Images/quizes.png",
        questions: [
            {
                id: 1,
                question: "What is Node.js?",
                options: ["A JavaScript framework", "A JavaScript runtime built on Chrome's V8 engine", "A database", "A web browser"],
                correct: 1
            },
            {
                id: 2,
                question: "Which of the following is used to install packages in Node.js?",
                options: ["npm", "pip", "gem", "composer"],
                correct: 0
            },
            {
                id: 3,
                question: "What is the purpose of package.json?",
                options: ["To store project metadata and dependencies", "To store CSS styles", "To store HTML templates", "To store images"],
                correct: 0
            },
            {
                id: 4,
                question: "Which module is used to create a web server in Node.js?",
                options: ["fs", "path", "http", "url"],
                correct: 2
            },
            {
                id: 5,
                question: "What is Express.js?",
                options: ["A database", "A web application framework for Node.js", "A CSS framework", "A testing library"],
                correct: 1
            },
            {
                id: 6,
                question: "How do you import a module in Node.js?",
                options: ["import module from 'module'", "require('module')", "include('module')", "using('module')"],
                correct: 1
            },
            {
                id: 7,
                question: "What is middleware in Express.js?",
                options: ["A database layer", "Functions that execute during the request-response cycle", "A CSS preprocessor", "A testing framework"],
                correct: 1
            },
            {
                id: 8,
                question: "Which method is used to read a file asynchronously in Node.js?",
                options: ["fs.readFile()", "fs.readFileSync()", "fs.read()", "fs.open()"],
                correct: 0
            },
            {
                id: 9,
                question: "What is the purpose of the 'async' and 'await' keywords?",
                options: ["To handle synchronous operations", "To handle asynchronous operations", "To create loops", "To define variables"],
                correct: 1
            },
            {
                id: 10,
                question: "Which of the following is NOT a core module in Node.js?",
                options: ["http", "fs", "path", "express"],
                correct: 3
            }
        ]
    }
};

// Get all quizzes
function getAllQuizzes() {
    return Object.values(quizData);
}

// Get quiz by ID
function getQuizById(id) {
    return quizData[id] || null;
}

// Get quizzes by category
function getQuizzesByCategory(category) {
    if (category === 'All') {
        return getAllQuizzes();
    }
    return Object.values(quizData).filter(quiz => quiz.category === category);
}

// Get available categories
function getCategories() {
    const categories = ['All'];
    Object.values(quizData).forEach(quiz => {
        if (!categories.includes(quiz.category)) {
            categories.push(quiz.category);
        }
    });
    return categories;
}
