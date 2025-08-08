// Authentication functions
class AuthManager {
    constructor() {
        this.currentUser = this.getCurrentUser();
    }

    // Sign up new user
    signUp(userData) {
        const { name, email, password, confirmPassword } = userData;
        
        // Validation
        if (!name || !email || !password || !confirmPassword) {
            throw new Error('All fields are required');
        }
        
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }
        
        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }
        
        // Check if user already exists
        const users = this.getUsers();
        if (users.find(user => user.email === email)) {
            throw new Error('User with this email already exists');
        }
        
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password, // In real app, this should be hashed
            joinedDate: new Date().toISOString(),
            quizHistory: [],
            totalQuizzes: 0,
            averageScore: 0
        };
        
        // Save user
        users.push(newUser);
        localStorage.setItem('quiz_users', JSON.stringify(users));
        
        // Set as current user (remove password from stored user)
        const userToStore = { ...newUser };
        delete userToStore.password;
        this.setCurrentUser(userToStore);
        
        return userToStore;
    }

    // Sign in user
    signIn(email, password) {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            throw new Error('Invalid email or password');
        }
        
        // Remove password before storing
        const userToStore = { ...user };
        delete userToStore.password;
        this.setCurrentUser(userToStore);
        return userToStore;
    }

    // Sign out user
    signOut() {
        localStorage.removeItem('quiz_current_user');
        this.currentUser = null;
    }

    // Get all users
    getUsers() {
        const users = localStorage.getItem('quiz_users');
        return users ? JSON.parse(users) : [];
    }

    // Get current user
    getCurrentUser() {
        const user = localStorage.getItem('quiz_current_user');
        return user ? JSON.parse(user) : null;
    }

    // Set current user
    setCurrentUser(user) {
        localStorage.setItem('quiz_current_user', JSON.stringify(user));
        this.currentUser = user;
    }

    // Update user data
    updateUser(userData) {
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...userData };
            localStorage.setItem('quiz_users', JSON.stringify(users));
            
            // Update current user (remove password)
            const updatedUser = { ...users[userIndex] };
            delete updatedUser.password;
            this.setCurrentUser(updatedUser);
            return updatedUser;
        }
        
        return null;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Save quiz result
    saveQuizResult(quizId, score, totalQuestions, incorrectAnswers, timeTaken) {
        if (!this.currentUser) return;

        const result = {
            quizId,
            quizTitle: getQuizById(quizId)?.title || 'Unknown Quiz',
            score,
            totalQuestions,
            percentage: Math.round((score / totalQuestions) * 100),
            incorrectAnswers,
            timeTaken,
            date: new Date().toISOString()
        };

        // Get users with passwords for updating
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex].quizHistory.push(result);
            users[userIndex].totalQuizzes = users[userIndex].quizHistory.length;
            
            // Calculate average score
            const totalScore = users[userIndex].quizHistory.reduce((sum, quiz) => sum + quiz.percentage, 0);
            users[userIndex].averageScore = Math.round(totalScore / users[userIndex].quizHistory.length);
            
            localStorage.setItem('quiz_users', JSON.stringify(users));
            
            // Update current user (remove password)
            const updatedUser = { ...users[userIndex] };
            delete updatedUser.password;
            this.setCurrentUser(updatedUser);
        }

        return result;
    }
}

// Create global auth manager instance
const authManager = new AuthManager();
