// Quiz Application Logic
class QuizApp {
    constructor() {
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = null;
        this.questionTimer = null;
        this.questionTimeLeft = 30; // 30 seconds per question
        this.timerCallback = null;
    }

    // Start a new quiz
    startQuiz(quizId) {
        const quiz = getQuizById(quizId);
        if (!quiz) {
            throw new Error('Quiz not found');
        }

        this.currentQuiz = quiz;
        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(quiz.questions.length).fill(null);
        this.startTime = Date.now();
        this.questionTimeLeft = 30;
        
        return quiz;
    }

    // Get current question
    getCurrentQuestion() {
        if (!this.currentQuiz || this.currentQuestionIndex >= this.currentQuiz.questions.length) {
            return null;
        }
        return this.currentQuiz.questions[this.currentQuestionIndex];
    }

    // Get quiz progress
    getProgress() {
        if (!this.currentQuiz) {
            return { currentQuestion: 0, totalQuestions: 0, percentage: 0 };
        }

        const currentQuestion = this.currentQuestionIndex + 1;
        const totalQuestions = this.currentQuiz.questions.length;
        const percentage = Math.round((currentQuestion / totalQuestions) * 100);

        return {
            currentQuestion,
            totalQuestions,
            percentage
        };
    }

    // Answer current question
    answerQuestion(answerIndex) {
        if (this.currentQuestionIndex < this.userAnswers.length) {
            this.userAnswers[this.currentQuestionIndex] = answerIndex;
        }
    }

    // Move to next question
    nextQuestion() {
        if (this.currentQuestionIndex < this.currentQuiz.questions.length - 1) {
            this.currentQuestionIndex++;
            this.questionTimeLeft = 30; // Reset timer for new question
            return true;
        }
        return false;
    }

    // Move to previous question
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.questionTimeLeft = 30; // Reset timer
            return true;
        }
        return false;
    }

    // Start question timer
    startQuestionTimer(callback) {
        this.timerCallback = callback;
        this.stopTimer(); // Clear any existing timer
        
        this.questionTimer = setInterval(() => {
            this.questionTimeLeft--;
            if (this.timerCallback) {
                this.timerCallback(this.questionTimeLeft);
            }
            
            if (this.questionTimeLeft <= 0) {
                this.stopTimer();
            }
        }, 1000);
        
        // Initial callback
        if (this.timerCallback) {
            this.timerCallback(this.questionTimeLeft);
        }
    }

    // Stop timer
    stopTimer() {
        if (this.questionTimer) {
            clearInterval(this.questionTimer);
            this.questionTimer = null;
        }
    }

    // Calculate quiz results
    calculateResults() {
        if (!this.currentQuiz) {
            return null;
        }

        const totalQuestions = this.currentQuiz.questions.length;
        let score = 0;
        const incorrectAnswers = [];

        this.currentQuiz.questions.forEach((question, index) => {
            const userAnswer = this.userAnswers[index];
            const correctAnswer = question.correct;

            if (userAnswer === correctAnswer) {
                score++;
            } else {
                incorrectAnswers.push({
                    questionId: index + 1,
                    question: question,
                    selectedAnswer: userAnswer,
                    correctAnswer: correctAnswer
                });
            }
        });

        const percentage = Math.round((score / totalQuestions) * 100);
        const totalTime = Date.now() - this.startTime;

        return {
            quizId: this.currentQuiz.id,
            quizTitle: this.currentQuiz.title,
            score,
            totalQuestions,
            percentage,
            incorrectAnswers,
            totalTime: Math.round(totalTime / 1000) // in seconds
        };
    }

    // Reset quiz state
    reset() {
        this.stopTimer();
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = null;
        this.questionTimeLeft = 30;
        this.timerCallback = null;
    }
}

// Create global quiz app instance
const quizApp = new QuizApp();
