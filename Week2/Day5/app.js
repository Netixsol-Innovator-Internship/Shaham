// Main application controller
class App {
    constructor() {
        this.currentPage = 'landing';
        this.isInQuiz = false; // Add this flag
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthState();
    }

    setupEventListeners() {
        document.addEventListener('click', this.handleGlobalClick.bind(this));
        document.addEventListener('submit', this.handleGlobalSubmit.bind(this));

        document.addEventListener('click', (e) => {
            if (e.target.matches('#mobile-menu-btn') || e.target.closest('#mobile-menu-btn')) {
                const mobileMenu = document.getElementById('mobile-menu');
                mobileMenu.classList.toggle('hidden');
            }
        });
    }

    handleGlobalClick(e) {
        if (e.target.matches('[data-page]')) {
            e.preventDefault();
            const page = e.target.getAttribute('data-page');
            this.navigateTo(page);
        }

        if (!e.target.closest('#mobile-menu') && !e.target.closest('#mobile-menu-btn')) {
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        }
    }

    handleGlobalSubmit(e) {
        e.preventDefault();
        
        if (e.target.matches('#signup-form')) {
            this.handleSignUp(e.target);
        } else if (e.target.matches('#signin-form')) {
            this.handleSignIn(e.target);
        }
    }

    checkAuthState() {
        if (authManager.isAuthenticated()) {
            this.navigateTo('home');
        } else {
            this.navigateTo('landing');
        }
    }

    navigateTo(page, data = null) {
        this.currentPage = page;

        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.add('hidden');
        }

        this.updateNavbar();

        switch (page) {
            case 'landing':
                this.renderLandingPage();
                break;
            case 'signup':
                this.renderSignUpPage();
                break;
            case 'signin':
                this.renderSignInPage();
                break;
            case 'select-quiz':
                this.renderSelectQuizPage();
                break;
            case 'quiz':
                this.renderQuizPage(data);
                break;
            case 'quiz-results':
                this.renderQuizResultsPage(data);
                break;
            case 'review-answers':
                this.renderReviewAnswersPage(data);
                break;
            case 'profile':
                this.renderProfilePage();
                break;
            case 'home':
                this.renderHomePage();
                break;
            default:
                if (authManager.isAuthenticated()) {
                    this.renderHomePage();
                } else {
                    this.renderLandingPage();
                }
        }
    }

    updateNavbar() {
        const navbar = document.getElementById('navbar');
        
        // Hide navbar if user is in quiz mode
        if (this.isInQuiz) {
            navbar.classList.add('hidden');
            return;
        }
        
        if (authManager.isAuthenticated()) {
            navbar.classList.remove('hidden');

            document.querySelectorAll('#navbar a').forEach(link => {
                link.classList.remove('text-gray-900');
                link.classList.add('text-gray-500');
            });
            // Handle home page active state
            let activeSelector = `#nav-${this.currentPage.replace('-', '')}`;
            if (this.currentPage === 'home') {
                activeSelector = '#nav-home';
            }
        
            const activeLink = document.querySelector(activeSelector);
            if (activeLink) {
                activeLink.classList.remove('text-gray-500');
                activeLink.classList.add('text-gray-900');
            }
        } else {
            navbar.classList.add('hidden');
        }
    }

    renderLandingPage() {
        const content = `
        <div class="min-h-screen bg-gray-50 transition-all duration-500 ease-in-out">
            <div class="relative overflow-hidden">
                <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div class="relative rounded-xl overflow-hidden shadow-2xl transform transition-all duration-300 ease-out hover:scale-[1.02]">
                        <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="background-image: url('./Images/heroBg.png'); background-position: center center;">
                            <div class="absolute inset-0 bg-black/40"></div>
                        </div>
                        <div class="relative z-10 px-8 py-20 sm:px-12 sm:py-24 lg:px-16 lg:py-32 text-center">
                            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 transform transition-all duration-1000 ease-out opacity-0 translate-y-8" 
                                id="hero-title">
                                Welcome to QuizMaster
                            </h1>
                            <p class="text-base sm:text-lg lg:text-xl text-white mb-6 max-w-3xl mx-auto leading-relaxed transform transition-all duration-1000 ease-out opacity-0 translate-y-8 delay-300" 
                               id="hero-subtitle">
                                Test your knowledge with our engaging quizzes. Compete with friends and climb the leaderboard. Start your quiz journey today!
                            </p>
                            <button data-page="signup" 
                                    class="inline-flex items-center px-6 py-3 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl opacity-0 translate-y-8 delay-500" 
                                    id="hero-button">
                                Get Started
                                <svg class="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="py-16 bg-white transform transition-all duration-300 ease-out">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-left mb-12">
                        <h2 class="text-4xl font-bold text-gray-900 mb-4 transform transition-all duration-300 ease-out opacity-0 translate-y-4" 
                            id="features-title">
                            Key Features
                        </h2>
                        <p class="text-lg text-gray-600 max-w-2xl transform transition-all duration-300 ease-out opacity-0 translate-y-4 delay-200" 
                           id="features-subtitle">
                            Explore the exciting features that make QuizMaster the ultimate quiz app.
                        </p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

                        <div class="bg-white p-6 rounded-lg border border-gray-200 transform transition-all duration-500 ease-out opacity-0 translate-y-8" 
                             id="feature-1">
                            <div class="mb-4">
                                <img src="./Images/time.png" alt="Icon" class="h-6 w-5 text-gray-700" />
                            </div>
                            <h3 class="text-xl font-bold text-gray-900 mb-3">Timed Quizzes</h3>
                            <p class="text-gray-600 leading-relaxed">
                                Challenge yourself with timed quizzes to test your speed and accuracy.
                            </p>
                        </div>

                        <div class="bg-white p-6 rounded-lg border border-gray-200 transform transition-all duration-500 ease-out opacity-0 translate-y-8 delay-200" 
                             id="feature-2">
                            <div class="mb-4">
                                <img src="./Images/leaderboard.png" alt="Icon" class="h-6 w-6 text-gray-700" />
                            </div>
                            <h3 class="text-xl font-bold text-gray-900 mb-3">Leaderboard</h3>
                            <p class="text-gray-600 leading-relaxed">
                                Compete with friends and other users to see who can achieve the highest scores.
                            </p>
                        </div>

                        <div class="bg-white p-6 rounded-lg border border-gray-200 transform transition-all duration-500 ease-out opacity-0 translate-y-8 delay-400" 
                             id="feature-3">
                            <div class="mb-4">
                                <img src="./Images/progress.png" alt="Icon" class="h-6 w-6 text-gray-700" />
                            </div>
                            <h3 class="text-xl font-bold text-gray-900 mb-3">Progress Tracking</h3>
                            <p class="text-gray-600 leading-relaxed">
                                Track your progress and see how you improve over time with detailed performance reports.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = content;
    this.animateHomePage();
}

    renderSignUpPage() {
        const content = `
            <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div class="max-w-md w-full space-y-8">
                    <div>
                        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Create your account
                        </h2>
                    </div>
                    <form id="signup-form" class="mt-8 space-y-6">
                        <div class="space-y-4">
                            <div>
                                <input id="signup-name" name="name" type="text" required 
                                       class="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                                       placeholder="Full Name">
                            </div>
                            <div>
                                <input id="signup-email" name="email" type="email" required 
                                       class="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                                       placeholder="Email">
                            </div>
                            <div>
                                <input id="signup-password" name="password" type="password" required 
                                       class="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                                       placeholder="Password">
                            </div>
                            <div>
                                <input id="signup-confirm-password" name="confirmPassword" type="password" required 
                                       class="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                                       placeholder="Confirm Password">
                            </div>
                        </div>

                        <div id="signup-error" class="hidden text-red-600 text-sm text-center"></div>

                        <div>
                            <button type="submit" 
                                    class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200">
                                Sign Up
                            </button>
                        </div>

                        <div class="text-center">
                            <span class="text-sm text-gray-600">Already have an account? </span>
                            <button type="button" data-page="signin" class="font-medium text-blue-600 hover:text-blue-500">
                                Sign In
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.getElementById('main-content').innerHTML = content;
    }

    renderSignInPage() {
        const content = `
            <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div class="max-w-md w-full space-y-8">
                    <div>
                        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Welcome back
                        </h2>
                    </div>
                    <form id="signin-form" class="mt-8 space-y-6">
                        <div class="space-y-4">
                            <div>
                                <input id="signin-email" name="email" type="email" required 
                                       class="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                                       placeholder="Email">
                            </div>
                            <div>
                                <input id="signin-password" name="password" type="password" required 
                                       class="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                                       placeholder="Password">
                            </div>
                        </div>

                        <div class="flex items-center justify-between">
                            <div class="text-sm">
                                <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <div id="signin-error" class="hidden text-red-600 text-sm text-center"></div>

                        <div>
                            <button type="submit"
                                    class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200">
                                Log In
                            </button>
                        </div>

                        <div class="text-center">
                            <span class="text-sm text-gray-600">Don't have an account? </span>
                            <button type="button" data-page="signup" class="font-medium text-blue-600 hover:text-blue-500">
                                Sign up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.getElementById('main-content').innerHTML = content;
    }

    renderHomePage() {
        const content = `
        <div class="min-h-screen bg-gray-50 transition-all duration-500 ease-in-out">
            <div class="relative overflow-hidden">
                <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div class="relative rounded-xl overflow-hidden shadow-2xl transform transition-all duration-300 ease-out hover:scale-[1.02]">

                        <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" 
                             style="background-image: url('./Images/heroBg.png'); background-position: center center;">

                            <div class="absolute inset-0 bg-black/40"></div>
                        </div>

                        <div class="relative z-10 px-8 py-20 sm:px-12 sm:py-24 lg:px-16 lg:py-32 text-center mt-16">
                            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 transform transition-all duration-1000 ease-out opacity-0 translate-y-8" 
                                id="hero-title">
                                Welcome to QuizMaster
                            </h1>
                            <p class="text-base sm:text-lg lg:text-xl text-white mb-6 max-w-3xl mx-auto leading-relaxed transform transition-all duration-1000 ease-out opacity-0 translate-y-8 delay-300" 
                               id="hero-subtitle">
                                Test your knowledge with our engaging quizzes. Compete with friends and climb the leaderboard. Start your quiz journey today!
                            </p>
                            <button data-page="select-quiz"
                                    class="inline-flex items-center px-6 py-3 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl opacity-0 translate-y-8 delay-500" 
                                    id="hero-button">
                                Get Started
                                <svg class="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="py-16 bg-white transform transition-all duration-300 ease-out">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-left mb-12">
                        <h2 class="text-4xl font-bold text-gray-900 mb-4 transform transition-all duration-300 ease-out opacity-0 translate-y-4" 
                            id="features-title">
                            Key Features
                        </h2>
                        <p class="text-lg text-gray-600 max-w-2xl transform transition-all duration-300 ease-out opacity-0 translate-y-4 delay-200" 
                           id="features-subtitle">
                            Explore the exciting features that make QuizMaster the ultimate quiz app.
                        </p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

                        <div class="bg-white p-6 rounded-lg border border-gray-200 transform transition-all duration-500 ease-out opacity-0 translate-y-8 hover:scale-110" 
                             id="feature-1">
                            <div class="mb-4">
                                <img src="./Images/time.png" alt="Icon" class="h-6 w-5 text-gray-700" />
                            </div>
                            <h3 class="text-xl font-bold text-gray-900 mb-3">Timed Quizzes</h3>
                            <p class="text-gray-600 leading-relaxed">
                                Challenge yourself with timed quizzes to test your speed and accuracy.
                            </p>
                        </div>

                        <div class="bg-white p-6 rounded-lg border border-gray-200 transform transition-all duration-500 ease-out opacity-0 translate-y-8 delay-200  hover:scale-110" 
                             id="feature-2">
                            <div class="mb-4">
                                <img src="./Images/leaderboard.png" alt="Icon" class="h-6 w-6 text-gray-700" />
                            </div>
                            <h3 class="text-xl font-bold text-gray-900 mb-3">Leaderboard</h3>
                            <p class="text-gray-600 leading-relaxed">
                                Compete with friends and other users to see who can achieve the highest scores.
                            </p>
                        </div>

                        <div class="bg-white p-6 rounded-lg border border-gray-200 transform transition-all duration-500 ease-out opacity-0 translate-y-8 delay-400  hover:scale-110" 
                             id="feature-3">
                            <div class="mb-4">
                                <img src="./Images/progress.png" alt="Icon" class="h-6 w-6 text-gray-700" />
                            </div>
                            <h3 class="text-xl font-bold text-gray-900 mb-3">Progress Tracking</h3>
                            <p class="text-gray-600 leading-relaxed">
                                Track your progress and see how you improve over time with detailed performance reports.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('main-content').innerHTML = content;
    this.animateHomePage();
}

    animateHomePage() {
        setTimeout(() => {
            const heroTitle = document.getElementById('hero-title');
            const heroSubtitle = document.getElementById('hero-subtitle');
            const heroButton = document.getElementById('hero-button');
            
            if (heroTitle) {
                heroTitle.classList.remove('opacity-0', 'translate-y-8');
                heroTitle.classList.add('opacity-100', 'translate-y-0');
            }
            
            if (heroSubtitle) {
                heroSubtitle.classList.remove('opacity-0', 'translate-y-8');
                heroSubtitle.classList.add('opacity-100', 'translate-y-0');
            }
            
            if (heroButton) {
                heroButton.classList.remove('opacity-0', 'translate-y-8');
                heroButton.classList.add('opacity-100', 'translate-y-0');
            }
        }, 100);

        // Animate features section
        setTimeout(() => {
            const featuresTitle = document.getElementById('features-title');
            const featuresSubtitle = document.getElementById('features-subtitle');
            
            if (featuresTitle) {
                featuresTitle.classList.remove('opacity-0', 'translate-y-4');
                featuresTitle.classList.add('opacity-100', 'translate-y-0');
            }
            
            if (featuresSubtitle) {
                featuresSubtitle.classList.remove('opacity-0', 'translate-y-4');
                featuresSubtitle.classList.add('opacity-100', 'translate-y-0');
            }
        }, 800);

        setTimeout(() => {
            const feature1 = document.getElementById('feature-1');
            const feature2 = document.getElementById('feature-2');
            const feature3 = document.getElementById('feature-3');
            
            if (feature1) {
                feature1.classList.remove('opacity-0', 'translate-y-8');
                feature1.classList.add('opacity-100', 'translate-y-0');
            }
            
            if (feature2) {
                feature2.classList.remove('opacity-0', 'translate-y-8');
                feature2.classList.add('opacity-100', 'translate-y-0');
            }
            
            if (feature3) {
                feature3.classList.remove('opacity-0', 'translate-y-8');
                feature3.classList.add('opacity-100', 'translate-y-0');
            }
        }, 1200);
    }

    renderSelectQuizPage() {
        const categories = ['All', 'HTML', 'JS', 'Python', 'React', 'Node.js'];
        const allQuizzes = getAllQuizzes();
        
        const content = `
        <div class="min-h-screen bg-white">
            <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">

                <div class="px-4 py-6 sm:px-0">
                    <h1 class="text-2xl font-bold text-gray-900">Select a Quiz</h1>
                </div>

                <div class="px-4 sm:px-0 mb-8">
                    <div class="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
                        ${categories.map(category => `
                            <button class="category-tab px-4 py-2 text-sm font-medium rounded-full ${category === 'All' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}" 
                                data-category="${category}">
                                ${category}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="px-4 sm:px-0 mb-12">
                    <h2 class="text-lg font-semibold text-gray-900 mb-6">Featured Quizzes</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        ${this.renderFeaturedQuizzes()}
                    </div>
                </div>

                <div class="px-4 sm:px-0">
                    <h2 class="text-lg font-semibold text-gray-900 mb-6">All Quizzes</h2>
                    <div id="quiz-list" class="space-y-4">
                        ${this.renderQuizListExact(allQuizzes)}
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('main-content').innerHTML = content;
    this.setupQuizSelectionListeners();
}

    setupQuizSelectionListeners() {
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const category = e.target.getAttribute('data-category');

                // Update active tab
                document.querySelectorAll('.category-tab').forEach(t => {
                    t.classList.remove('bg-blue-100', 'text-blue-700');
                    t.classList.add('bg-gray-100', 'text-gray-600');
                });
                e.target.classList.remove('bg-gray-100', 'text-gray-600');
                e.target.classList.add('bg-blue-100', 'text-blue-700');

                let filteredQuizzes = [];
                if (category === 'All') {
                    filteredQuizzes = getAllQuizzes();
                } else {
                    filteredQuizzes = getQuizzesByCategory(category);
                }
                document.getElementById('quiz-list').innerHTML = this.renderQuizListExact(filteredQuizzes);
            });
        });

        document.addEventListener('click', (e) => {
            const quizCard = e.target.closest('.quiz-card');
            if (quizCard) {
                const quizId = quizCard.getAttribute('data-quiz-id');
                if (quizId) {
                    this.startQuiz(quizId);
                }
            }
        });
    }

    startQuiz(quizId) {
        try {
            quizApp.startQuiz(quizId);
            this.isInQuiz = true;
            this.navigateTo('quiz', { quizId });
        } catch (error) {
            alert('Error starting quiz: ' + error.message);
        }
    }

    finishQuiz() {
        quizApp.stopTimer();
        const results = quizApp.calculateResults();

        authManager.saveQuizResult(
            results.quizId,
            results.score,
            results.totalQuestions,
            results.incorrectAnswers,
            results.totalTime
        );

        this.isInQuiz = false; // Exit quiz mode
        this.navigateTo('quiz-results', results);
    }

    abandonQuiz() {
        if (confirm('Are you sure you want to abandon this quiz? Your progress will be lost.')) {
            quizApp.stopTimer();
            quizApp.reset();
            this.isInQuiz = false;
            this.navigateTo('select-quiz');
        }
    }

    renderQuizPage(data) {
        const question = quizApp.getCurrentQuestion();
        const progress = quizApp.getProgress();
        
        if (!question) {
            this.navigateTo('select-quiz');
            return;
        }

        const content = `
            <div class="min-h-screen bg-gray-50">
                <!-- Remove any back/exit buttons from here -->
                <div class="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">


                    <div class="mb-8">
                        <div class="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Progress</span>
                            <span>Question ${progress.currentQuestion} of ${progress.totalQuestions}</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: ${progress.percentage}%"></div>
                        </div>
                    </div>

                    <!-- Rest of your quiz content remains the same -->
                    <div class="text-center mb-8">
                        <div class="inline-flex items-center space-x-4 bg-white rounded-lg px-6 py-3 shadow-sm">
                            <div class="flex items-center space-x-2">
                                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span class="text-2xl font-mono" id="timer">00</span>
                                <span class="text-sm text-gray-500">Hours</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <span class="text-2xl font-mono" id="timer-minutes">00</span>
                                <span class="text-sm text-gray-500">Minutes</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <span class="text-2xl font-mono" id="timer-seconds">30</span>
                                <span class="text-sm text-gray-500">Seconds</span>
                            </div>
                        </div>
                    </div>

                    <!-- Question content continues as before... -->
                    <div class="bg-white rounded-lg shadow-sm p-8 mb-8">
                        <h2 class="text-2xl font-semibold text-gray-900 mb-8">${question.question}</h2>

                        <div class="space-y-4">
                            ${question.options.map((option, index) => `
                                <label class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                                    <input type="radio" name="answer" value="${index}" class="sr-only">
                                    <div class="flex items-center">
                                        <div class="radio-button w-5 h-5 border-2 border-gray-300 rounded-full mr-4 flex items-center justify-center">
                                            <div class="w-2 h-2 bg-blue-600 rounded-full hidden"></div>
                                        </div>
                                        <span class="text-lg text-gray-900">${option}</span>
                                    </div>
                                </label>
                            `).join('')}
                        </div>
                    </div>

                    <div class="flex justify-between">
                        <button id="prev-btn" ${progress.currentQuestion === 1 ? 'disabled' : ''} 
                                class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200">
                            Previous
                        </button>
                        <button id="next-btn" 
                                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                            ${progress.currentQuestion === progress.totalQuestions ? 'Finish Quiz' : 'Next'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('main-content').innerHTML = content;
        this.setupQuizListeners();
        this.startQuestionTimer();
    }

    setupQuizListeners() {
        let selectedAnswer = null;

        document.querySelectorAll('input[name="answer"]').forEach(input => {
            input.addEventListener('change', (e) => {
                selectedAnswer = parseInt(e.target.value);

                document.querySelectorAll('.radio-button').forEach(btn => {
                    btn.classList.remove('border-blue-600');
                    btn.classList.add('border-gray-300');
                    btn.querySelector('div').classList.add('hidden');
                });
                const selectedButton = e.target.closest('label').querySelector('.radio-button');
                selectedButton.classList.remove('border-gray-300');
                selectedButton.classList.add('border-blue-600');
                selectedButton.querySelector('div').classList.remove('hidden');

                quizApp.answerQuestion(selectedAnswer);
            });
        });

        // Navigation buttons
        document.getElementById('prev-btn').addEventListener('click', () => {
            if (quizApp.previousQuestion()) {
                this.renderQuizPage();
            }
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            const progress = quizApp.getProgress();

            // Check if answer is selected
            if (selectedAnswer === null && !quizApp.userAnswers[quizApp.currentQuestionIndex]) {
                alert('Please select an answer before proceeding.');
                return;
            }
            if (progress.currentQuestion === progress.totalQuestions) {
                this.finishQuiz();
            } else {
                if (quizApp.nextQuestion()) {
                    this.renderQuizPage();
                }
            }
        });
    }

    startQuestionTimer() {
        quizApp.startQuestionTimer((timeLeft) => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            
            document.getElementById('timer-minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('timer-seconds').textContent = seconds.toString().padStart(2, '0');
            
            if (timeLeft <= 0) {
                const progress = quizApp.getProgress();
                if (progress.currentQuestion === progress.totalQuestions) {
                    this.finishQuiz();
                } else {
                    if (quizApp.nextQuestion()) {
                        this.renderQuizPage();
                    }
                }
            }
        });
    }

    renderQuizResultsPage(results) {
        const content = `
            <div class="min-h-screen bg-gray-50 py-12">
                <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="bg-white rounded-lg shadow-sm p-8 text-center">
                        <h1 class="text-3xl font-bold text-gray-900 mb-2">Quiz Results</h1>
                        
                         Progress Bar 
                        <div class="mb-8">
                            <div class="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Quiz Completed</span>
                                <span>100%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-green-500 h-2 rounded-full" style="width: 100%"></div>
                            </div>
                        </div>

                         Score 
                        <div class="bg-gray-50 rounded-lg p-6 mb-8">
                            <div class="text-sm text-gray-600 mb-2">Score</div>
                            <div class="text-4xl font-bold text-gray-900">${results.score}/${results.totalQuestions}</div>
                        </div>

                        <div class="space-y-4">
                            ${results.incorrectAnswers.length > 0 ? `
                                <button onclick="app.navigateTo('review-answers', app.lastQuizResults)" 
                                        class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200">
                                    Review Answers
                                </button>
                            ` : ''}
                            <button data-page="select-quiz" 
                                    class="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition duration-200">
                                Take Another Quiz
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.lastQuizResults = results;

        document.getElementById('main-content').innerHTML = content;
    }

    renderReviewAnswersPage(results) {
        const content = `
            <div class="min-h-screen bg-gray-50 py-8">
                <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="mb-8">
                        <h1 class="text-2xl font-bold text-gray-900 mb-2">Review Incorrect Answers</h1>
                    </div>

                    <div class="bg-white rounded-lg shadow-sm p-6">
                        <div class="space-y-8">
                            ${results.incorrectAnswers.map((answer, index) => `
                                <div class="border-b border-gray-200 pb-6 last:border-b-0">
                                    <h3 class="text-lg font-semibold text-gray-900 mb-3">
                                        Question ${answer.questionId}
                                    </h3>
                                    <p class="text-gray-700 mb-4">${answer.question.question}</p>
                                    <div class="space-y-2">
                                        <div>
                                            <span class="text-sm font-medium text-gray-600">Your answer: </span>
                                            <span class="text-red-600">${answer.selectedAnswer >= 0 ? answer.question.options[answer.selectedAnswer] : 'No answer selected'}</span>
                                        </div>
                                        <div>
                                            <span class="text-sm font-medium text-gray-600">Correct answer: </span>
                                            <span class="text-green-600">${answer.question.options[answer.correctAnswer]}</span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>

                        <div class="mt-8 text-center">
                            <button data-page="select-quiz" 
                                    class="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition duration-200">
                                Back to Quizzes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('main-content').innerHTML = content;
    }

    renderProfilePage() {
        const user = authManager.currentUser;
        if (!user) {
            this.navigateTo('signin');
            return;
        }

        const content = `
            <div class="min-h-screen bg-gray-50 py-12">
                <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="bg-white rounded-lg shadow-sm p-8 mb-8 text-center">
                        <img src="./Images/profile.png" 
                            alt="Profile" class="w-30 h-30 rounded-full mx-auto mb-4">
                        <h1 class="text-3xl font-bold text-gray-900">${user.name}</h1>
                        <p class="text-gray-600">Quiz Enthusiast</p>
                        <p class="text-sm text-gray-500 mt-2">Joined ${new Date(user.joinedDate).getFullYear()}</p>
                    </div>

                    <div class="mb-8">
                        <div class="border-b border-gray-200">
                            <nav class="-mb-px flex space-x-8">
                                <button class="profile-tab whitespace-nowrap py-2 px-1 border-b-2 border-blue-600 text-blue-600 font-medium text-sm" 
                                        data-tab="profile">
                                    Profile
                                </button>
                                <button class="profile-tab whitespace-nowrap py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm" 
                                        data-tab="activity">
                                    Activity
                                </button>
                            </nav>
                        </div>
                    </div>

                    <div id="activity-tab" class="tab-content hidden">
                        <div class="bg-white rounded-lg shadow-sm p-6 text-center">
                            <p class="text-gray-500">Nothing to see here for now!</p>
                        </div>
                    </div>

                    <div id="profile-tab" class="tab-content">
                        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <h2 class="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <p class="text-gray-900">${user.name}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <p class="text-gray-900">${user.email}</p>
                                </div>
                                <div class="md:col-span-2">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                    <p class="text-gray-900">Avid quiz taker and trivia lover. Always up for a challenge!</p>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <h2 class="text-xl font-semibold text-gray-900 mb-4">Quiz History</h2>
                            ${user.quizHistory.length > 0 ? `
                                <div class="overflow-x-auto">
                                    <table class="min-w-full divide-y divide-gray-200">
                                        <thead class="bg-gray-50">
                                            <tr>
                                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz Name</th>
                                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody class="bg-white divide-y divide-gray-200">
                                            ${user.quizHistory.slice(-10).reverse().map(quiz => `
                                                <tr>
                                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${quiz.quizTitle}</td>
                                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${quiz.score}/${quiz.totalQuestions}</td>
                                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(quiz.date).toLocaleDateString()}</td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            ` : `
                                <p class="text-gray-500 text-center py-8">No quiz history yet. Take your first quiz to see your results here!</p>
                            `}
                        </div>

                        <div class="bg-white rounded-lg shadow-sm p-6">
                            <h2 class="text-xl font-semibold text-gray-900 mb-4">Account Settings</h2>
                            <div class="space-y-4">
                                <button onclick="app.signOut()" 
                                        class="w-full text-left px-4 py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition duration-200">
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('main-content').innerHTML = content;
        this.setupProfileListeners();
    }

    setupProfileListeners() {
        document.querySelectorAll('.profile-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');

                document.querySelectorAll('.profile-tab').forEach(t => {
                    t.classList.remove('border-blue-600', 'text-blue-600');
                    t.classList.add('border-transparent', 'text-gray-500');
                });
                e.target.classList.remove('border-transparent', 'text-gray-500');
                e.target.classList.add('border-blue-600', 'text-blue-600');

                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.add('hidden');
                });
                document.getElementById(`${tabName}-tab`).classList.remove('hidden');
            });
        });
    }

    handleSignUp(form) {
        const formData = new FormData(form);
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        };

        try {
            authManager.signUp(userData);
            this.navigateTo('home');
        } catch (error) {
            const errorDiv = document.getElementById('signup-error');
            errorDiv.textContent = error.message;
            errorDiv.classList.remove('hidden');
        }
    }

    handleSignIn(form) {
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            authManager.signIn(email, password);
            this.navigateTo('home');
        } catch (error) {
            const errorDiv = document.getElementById('signin-error');
            errorDiv.textContent = error.message;
            errorDiv.classList.remove('hidden');
        }
    }

    signOut() {
        authManager.signOut();
        quizApp.reset();
        this.navigateTo('landing');
    }

    renderQuizListExact(quizzes) {
        return quizzes.map((quiz, index) => `
            <div class="quiz-card bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105" data-quiz-id="${quiz.id}">
                <div class="flex items-center">
                    <div class="flex-1 p-6">
                        <h3 class="font-semibold text-base text-gray-900 mb-2">${quiz.title}</h3>
                        <p class="text-gray-600 text-sm">${quiz.description}</p>
                        <span class="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mt-2">${quiz.category}</span>
                    </div>
                    <div class="w-48 h-24 flex-shrink-0">
                        <img src="${quiz.image}" alt="${quiz.title}" class="w-full h-full object-cover">
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderFeaturedQuizzes() {
        const quizData = getAllQuizzes();
        const htmlQuiz = quizData.find(quiz => quiz.id === 'html');
        const jsQuiz = quizData.find(quiz => quiz.id === 'javascript');
        const nodeQuiz = quizData.find(quiz => quiz.id === 'nodejs');

        return `
            <div class="quiz-card bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md duration-200 cursor-pointer transition-all hover:scale-105" data-quiz-id="html">
                <img src="${htmlQuiz?.image || './Images/quizes.png'}" alt="${htmlQuiz?.title || 'HTML'}" class="w-full h-32 object-cover bg-gradient-to-br from-orange-100 to-orange-200">
                <div class="p-4">
                    <h3 class="font-semibold text-base text-gray-900 mb-1">${htmlQuiz?.title || 'HTML'}</h3>
                    <p class="text-gray-600 text-sm mb-4">${htmlQuiz?.description || 'Test your knowledge about HTML'}</p>
                </div>
            </div>
            
            <div class="quiz-card bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105" data-quiz-id="javascript">
                <img src="${jsQuiz?.image || './Images/quizes.png'}" class="w-full h-32 object-cover bg-gradient-to-br from-amber-100 to-amber-200">
                <div class="p-4">
                    <h3 class="font-semibold text-base text-gray-900 mb-1">${jsQuiz?.title || 'JavaScript'}</h3>
                    <p class="text-gray-600 text-sm mb-4">${jsQuiz?.description || 'Explore JavaScript fundamentals'}</p>
                </div>
            </div>

            <div class="quiz-card bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105" data-quiz-id="nodejs">
                <img src="${nodeQuiz?.image || './Images/quizes.png'}" alt="${nodeQuiz?.title || 'Node.js'}" class="w-full h-32 object-cover bg-gradient-to-br from-yellow-100 to-yellow-200">
                <div class="p-4">
                    <h3 class="font-semibold text-base text-gray-900 mb-1">${nodeQuiz?.title || 'Node.js'}</h3>
                    <p class="text-gray-600 text-sm mb-4">${nodeQuiz?.description || 'Dive into Node.js backend development'}</p>
                </div>
            </div>
        `;
    }

    // Optional: Add browser navigation prevention during quiz
    preventBrowserNavigation() {
        if (this.isInQuiz) {
            window.addEventListener('beforeunload', (e) => {
                if (this.isInQuiz) {
                    e.preventDefault();
                    e.returnValue = 'You have a quiz in progress. Are you sure you want to leave?';
                    return e.returnValue;
                }
            });

            window.addEventListener('popstate', (e) => {
                if (this.isInQuiz) {
                    window.history.pushState(null, null, window.location.pathname);
                    alert('Please complete the quiz before navigating away.');
                }
            });
        }
    }
}

const app = new App();

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (e) => {
        // Desktop navigation
        if (e.target.matches('#nav-home')) {
            e.preventDefault();
            app.navigateTo('home');
        } else if (e.target.matches('#nav-quizzes')) {
            e.preventDefault();
            app.navigateTo('select-quiz');
        } else if (e.target.matches('#nav-profile')) {
            e.preventDefault();
            app.navigateTo('profile');
        } else if (e.target.matches('#nav-leaderboard')) {
            e.preventDefault();
            alert('Leaderboard feature coming soon!');
        }

        // Mobile navigation
        else if (e.target.matches('#mobile-nav-home')) {
            e.preventDefault();
            app.navigateTo('home');
        } else if (e.target.matches('#mobile-nav-quizzes')) {
            e.preventDefault();
            app.navigateTo('select-quiz');
        } else if (e.target.matches('#mobile-nav-profile')) {
            e.preventDefault();
            app.navigateTo('profile');
        } else if (e.target.matches('#mobile-nav-leaderboard')) {
            e.preventDefault();
            alert('Leaderboard feature coming soon!');
        }
    });
});