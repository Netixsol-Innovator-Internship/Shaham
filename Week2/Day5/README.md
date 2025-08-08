# Quiz Web App

A fully functional Quiz Web Application built using Vanilla JavaScript, Tailwind CSS, and localStorage for data persistence. All pages are dynamically rendered through JavaScript DOM manipulation.

---

## Features

### Authentication
- Signup: Users can register with their name, email, and password.
- Signin: Users can log in with previously registered credentials.
- Authentication data is stored in localStorage.

### Profile Page
- Displays:
  - User name and email
  - Total quizzes attempted
  - Quiz performance data
  - Option to Sign Out

### Quiz Selection Page
- View and filter quizzes by category (HTML, CSS, JavaScript, etc.)
- Each quiz includes:
  - Title
  - 10 questions

### MCQ Quiz Page
- One question per screen
- Four answer options
- Navigation with Next and Previous buttons
- Progress bar
- Timer per quiz or per question
- Final score saved to localStorage

### Review Incorrect Answers
- After finishing a quiz, users can review all incorrectly answered questions
- Each review includes:
  - The user’s incorrect answer
  - The correct answer

---

## Project Structure

- index.html
- style.css
- app.js
- auth.js
- quiz-app.js
- quiz-data.js


---

## Technologies Used

- Vanilla JavaScript
- Tailwind CSS
- HTML (single page)
- localStorage API

---