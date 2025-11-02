// Authentication JavaScript

// Check if user is already logged in
if (localStorage.getItem('voxnoteUser')) {
    window.location.href = 'home.html';
}

// Switch between login and signup tabs
function switchTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    if (tab === 'login') {
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
        tabButtons[0].classList.add('active');
    } else {
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
        tabButtons[1].classList.add('active');
    }
}

// Login form handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Get all users from localStorage
    const users = JSON.parse(localStorage.getItem('voxnoteUsers') || '[]');
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Save current user
        localStorage.setItem('voxnoteUser', JSON.stringify(user));
        
        // Show success animation
        showSuccess('Login successful! Redirecting...');
        
        // Redirect after short delay
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1000);
    } else {
        showError('Invalid email or password!');
    }
});

// Signup form handler
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    // Validation
    if (password !== confirmPassword) {
        showError('Passwords do not match!');
        return;
    }
    
    if (password.length < 6) {
        showError('Password must be at least 6 characters long!');
        return;
    }
    
    // Get all users
    const users = JSON.parse(localStorage.getItem('voxnoteUsers') || '[]');
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
        showError('Email already registered!');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('voxnoteUsers', JSON.stringify(users));
    
    // Auto login
    localStorage.setItem('voxnoteUser', JSON.stringify(newUser));
    
    showSuccess('Account created successfully! Redirecting...');
    
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 1000);
});

// Demo login
function demoLogin() {
    const demoUser = {
        id: 'demo',
        name: 'Demo User',
        email: 'demo@voxnote.com',
        createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('voxnoteUser', JSON.stringify(demoUser));
    
    showSuccess('Demo login successful! Redirecting...');
    
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 1000);
}

// Show success message
function showSuccess(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success';
    alertDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

// Show error message
function showError(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-error';
    alertDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

// Particle animation removed for cleaner look
